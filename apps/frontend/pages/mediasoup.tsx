import * as mediasoupClient from 'mediasoup-client';
import Logger from 'pino-logger';
import { Transport } from 'mediasoup-client/lib/Transport';
import { Producer } from 'mediasoup-client/lib/Producer';
import { Consumer } from 'mediasoup-client/lib/Consumer';
import { Socket } from 'socket.io-client';
import { socketIo } from '../common/client';

const VIDEO_CONSTRAINS =
{
    qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
    vga: { width: { ideal: 640 }, height: { ideal: 480 } },
    hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

const PC_PROPRIETARY_CONSTRAINTS =
{
    optional: [{ googDscp: true }]
};

// Used for simulcast webcam video.
const WEBCAM_SIMULCAST_ENCODINGS =
    [
        { scaleResolutionDownBy: 4, maxBitrate: 500000 },
        { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
        { scaleResolutionDownBy: 1, maxBitrate: 5000000 }
    ];

// Used for VP9 webcam video.
const WEBCAM_KSVC_ENCODINGS =
    [
        { scalabilityMode: 'S3T3_KEY' }
    ];

// Used for simulcast screen sharing.
const SCREEN_SHARING_SIMULCAST_ENCODINGS =
    [
        { dtx: true, maxBitrate: 1500000 },
        { dtx: true, maxBitrate: 6000000 }
    ];

// Used for VP9 screen sharing.
const SCREEN_SHARING_SVC_ENCODINGS =
    [
        { scalabilityMode: 'S3T3', dtx: true }
    ];

const EXTERNAL_VIDEO_SRC = '/resources/videos/video-audio-stereo.mp4';

const logger = new Logger('RoomClient');

let store;

export default class RoomClient extends EventTarget {
    /**
     * @param  {Object} data
     * @param  {Object} data.store - The Redux store.
     */
    static init(data) {
        store = data.store;
    }

    private _closed: boolean;
    private _device: any
    private _forceTcp: boolean
    private _consume: boolean
    private _produce: boolean
    private _forceH264: boolean
    private _forceVP9: boolean
    private _externalVideo: HTMLVideoElement
    private _externalVideoStream: MediaStream
    private _mediasoupDevice: mediasoupClient.Device;
    private _sendTransport: Transport
    private _recvTransport: Transport
    private _micProducer: Producer
    private _webcamProducer: Producer
    private _shareProducer: Producer
    private _consumers: Map<string, Consumer>
    private _webcams: Map<string, MediaDeviceInfo>
    private _ioClient: Socket
    private _webcam: { device: MediaDeviceInfo, resolution: "hd" | "qvga" | "vga" | "hd" }

    constructor(
        {
            roomId,
            device,
            forceTcp,
            produce,
            consume,
            forceH264,
            forceVP9,
            externalVideo,
            _ioClient
        }: {
            roomId: number,
            device: any,
            produce: boolean,
            consume: boolean,
            forceTcp: boolean,
            forceH264: boolean,
            forceVP9: boolean,
            _externalVideoStream: MediaStream
            externalVideo: HTMLVideoElement
            _ioClient: Socket

        }
    ) {
        super();
        logger.debug(
            'constructor() [roomId:"%s",  device:%s]',
            roomId, device.handlerName);

        // Closed flag.
        // @type {Boolean}
        this._closed = false;

        // Display name.

        // Device info.
        // @type {Object}
        this._device = device;
        this._ioClient = _ioClient;

        // Whether we want to force RTC over TCP.
        // @type {Boolean}
        this._forceTcp = forceTcp;

        // Whether we want to produce audio/video.
        // @type {Boolean}
        this._produce = produce;

        // Whether we should consume.
        // @type {Boolean}
        this._consume = consume;


        // Force H264 codec for sending.
        this._forceH264 = Boolean(forceH264);

        // Force VP9 codec for sending.
        this._forceVP9 = Boolean(forceVP9);

        // External video.
        // @type {HTMLVideoElement}
        this._externalVideo = null;

        // MediaStream of the external video.
        // @type {MediaStream}
        this._externalVideoStream = null;


        if (externalVideo) {
            this._externalVideo = document.createElement('video');

            this._externalVideo.controls = true;
            this._externalVideo.muted = true;
            this._externalVideo.loop = true;
            this._externalVideo.setAttribute('playsinline', '');
            this._externalVideo.src = EXTERNAL_VIDEO_SRC;

            this._externalVideo.play()
                .catch((error) => logger.warn('externalVideo.play() failed:%o', error));
        }

        // mediasoup-client Device instance.
        // @type {mediasoupClient.Device}
        this._mediasoupDevice = null;

        // mediasoup Transport for sending.
        // @type {mediasoupClient.Transport}
        this._sendTransport = null;

        // mediasoup Transport for receiving.
        // @type {mediasoupClient.Transport}
        this._recvTransport = null;

        // Local mic mediasoup Producer.
        // @type {mediasoupClient.Producer}
        this._micProducer = null;

        // Local webcam mediasoup Producer.
        // @type {mediasoupClient.Producer}
        this._webcamProducer = null;

        // Local share mediasoup Producer.
        // @type {mediasoupClient.Producer}
        this._shareProducer = null;



        // mediasoup Consumers.
        // @type {Map<String, mediasoupClient.Consumer>}
        this._consumers = new Map();


        // Map of webcam MediaDeviceInfos indexed by deviceId.
        // @type {Map<String, MediaDeviceInfos>}
        this._webcams = new Map();

        // Local Webcam.
        // @type {Object} with:
        // - {MediaDeviceInfo} [device]
        // - {String} [resolution] - 'qvga' / 'vga' / 'hd'.
        this._webcam =
        {
            device: null,
            resolution: 'hd'
        };

    }

    close() {
        if (this._closed)
            return;

        this._closed = true;

        logger.debug('close()');

        // Close protoo Peer
        // this._protoo.close();

        // Close mediasoup Transports.
        if (this._sendTransport)
            this._sendTransport.close();

        if (this._recvTransport)
            this._recvTransport.close();

        this.emit("closed")
    }

    private emit(evt: string, data?: any) {
        this.dispatchEvent(new Event(evt, data))
    }

    async join() {

        this.emit("connecting")

        this._joinRoom()


        this._ioClient.on('disconnected', () => {
            // Close mediasoup Transports.
            if (this._sendTransport) {
                this._sendTransport.close();
                this._sendTransport = null;
            }

            if (this._recvTransport) {
                this._recvTransport.close();
                this._recvTransport = null;
            }
            this.emit("closed")
        });

        this._ioClient.on('close', () => {
            if (this._closed)
                return;

            this.close();
        });

        // eslint-disable-next-line no-unused-vars
        this._protoo.on('request', async (request, accept, reject) => {
            logger.debug(
                'proto "request" event [method:%s, data:%o]',
                request.method, request.data);

            switch (request.method) {
                case 'newConsumer':
                    {
                        if (!this._consume) {
                            reject(403, 'I do not want to consume');

                            break;
                        }

                        const {
                            peerId,
                            producerId,
                            id,
                            kind,
                            rtpParameters,
                            type,
                            appData,
                            producerPaused
                        } = request.data;

                        try {
                            const consumer = await this._recvTransport.consume(
                                {
                                    id,
                                    producerId,
                                    kind,
                                    rtpParameters,
                                    appData: { ...appData, peerId } // Trick.
                                });



                            // Store in the map.
                            this._consumers.set(consumer.id, consumer);

                            consumer.on('transportclose', () => {
                                this._consumers.delete(consumer.id);
                            });

                            const { spatialLayers, temporalLayers } =
                                mediasoupClient.parseScalabilityMode(
                                    consumer.rtpParameters.encodings[0].scalabilityMode);

                            this.emit("addConsumer", {
                                id: consumer.id,
                                type: type,
                                locallyPaused: false,
                                remotelyPaused: producerPaused,
                                rtpParameters: consumer.rtpParameters,
                                spatialLayers: spatialLayers,
                                temporalLayers: temporalLayers,
                                preferredSpatialLayer: spatialLayers - 1,
                                preferredTemporalLayer: temporalLayers - 1,
                                priority: 1,
                                codec: consumer.rtpParameters.codecs[0].mimeType.split('/')[1],
                                track: consumer.track
                            })

                            // We are ready. Answer the protoo request so the server will
                            // resume this Consumer (which was paused for now if video).
                            accept();

                            // If audio-only mode is enabled, pause it.
                            if (consumer.kind === 'video' && store.getState().me.audioOnly)
                                this._pauseConsumer(consumer);
                        }
                        catch (error) {
                            logger.error('"newConsumer" request failed:%o', error);


                            this.emit("error", {
                                text: `Error creating a Consumer: ${error}`
                            })
                            throw error;
                        }

                        break;
                    }


            }
        });

        this._protoo.on('notification', (notification) => {
            logger.debug(
                'proto "notification" event [method:%s, data:%o]',
                notification.method, notification.data);

            switch (notification.method) {
                case 'producerScore':
                    {
                        const { producerId, score } = notification.data;


                        this.emit("producerScore", { producerId, score: score })

                        break;
                    }

                case 'newPeer':
                    {
                        const peer = notification.data;

                        store.dispatch(
                            stateActions.addPeer(
                                { ...peer, consumers: [], }));

                        store.dispatch(requestActions.notify(
                            {
                                text: `${peer.displayName} has joined the room`
                            }));

                        break;
                    }

                case 'peerClosed':
                    {
                        const { peerId } = notification.data;

                        store.dispatch(
                            stateActions.removePeer(peerId));

                        break;
                    }

                case 'peerDisplayNameChanged':
                    {
                        const { peerId, displayName, oldDisplayName } = notification.data;

                        store.dispatch(
                            stateActions.setPeerDisplayName(displayName, peerId));

                        store.dispatch(requestActions.notify(
                            {
                                text: `${oldDisplayName} is now ${displayName}`
                            }));

                        break;
                    }

                case 'downlinkBwe':
                    {
                        logger.debug('\'downlinkBwe\' event:%o', notification.data);

                        break;
                    }

                case 'consumerClosed':
                    {
                        const { consumerId } = notification.data;
                        const consumer = this._consumers.get(consumerId);

                        if (!consumer)
                            break;

                        consumer.close();
                        this._consumers.delete(consumerId);

                        const { peerId } = consumer.appData;

                        store.dispatch(
                            stateActions.removeConsumer(consumerId, peerId));

                        break;
                    }

                case 'consumerPaused':
                    {
                        const { consumerId } = notification.data;
                        const consumer = this._consumers.get(consumerId);

                        if (!consumer)
                            break;

                        consumer.pause();

                        store.dispatch(
                            stateActions.setConsumerPaused(consumerId, 'remote'));

                        break;
                    }

                case 'consumerResumed':
                    {
                        const { consumerId } = notification.data;
                        const consumer = this._consumers.get(consumerId);

                        if (!consumer)
                            break;

                        consumer.resume();

                        store.dispatch(
                            stateActions.setConsumerResumed(consumerId, 'remote'));

                        break;
                    }

                case 'consumerLayersChanged':
                    {
                        const { consumerId, spatialLayer, temporalLayer } = notification.data;
                        const consumer = this._consumers.get(consumerId);

                        if (!consumer)
                            break;

                        store.dispatch(stateActions.setConsumerCurrentLayers(
                            consumerId, spatialLayer, temporalLayer));

                        break;
                    }

                case 'consumerScore':
                    {
                        const { consumerId, score } = notification.data;

                        store.dispatch(
                            stateActions.setConsumerScore(consumerId, score));

                        break;
                    }

                case 'activeSpeaker':
                    {
                        const { peerId } = notification.data;

                        store.dispatch(
                            stateActions.setRoomActiveSpeaker(peerId));

                        break;
                    }

                default:
                    {
                        logger.error(
                            'unknown protoo notification.method "%s"', notification.method);
                    }
            }
        });
    }

    async enableMic() {
        logger.debug('enableMic()');

        if (this._micProducer)
            return;

        if (!this._mediasoupDevice.canProduce('audio')) {
            logger.error('enableMic() | cannot produce audio');

            return;
        }

        let track;

        try {
            if (!this._externalVideo) {
                logger.debug('enableMic() | calling getUserMedia()');

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                track = stream.getAudioTracks()[0];
            }
            else {
                const stream = await this._getExternalVideoStream();

                track = stream.getAudioTracks()[0].clone();
            }

            this._micProducer = await this._sendTransport.produce(
                {
                    track,
                    codecOptions:
                    {
                        opusStereo: true,
                        opusDtx: true
                    }
                    // NOTE: for testing codec selection.
                    // codec : this._mediasoupDevice.rtpCapabilities.codecs
                    // 	.find((codec) => codec.mimeType.toLowerCase() === 'audio/pcma')
                });


            this.emit("micProducer", {
                id: this._micProducer.id,
                paused: this._micProducer.paused,
                track: this._micProducer.track,
                rtpParameters: this._micProducer.rtpParameters,
                codec: this._micProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
            })

            this._micProducer.on('transportclose', () => {
                this._micProducer = null;
            });

            this._micProducer.on('trackended', () => {
                this.emit("error", {
                    text: 'Microphone disconnected!'
                })
                this.disableMic()
                    .catch(() => { });
            });
        }
        catch (error) {
            logger.error('enableMic() | failed:%o', error);

            this.emit("error", { text: `Error enabling microphone: ${error}` })
            if (track)
                track.stop();
        }
    }

    async disableMic() {
        logger.debug('disableMic()');

        if (!this._micProducer)
            return;

        this._micProducer.close();

        this.emit("removeProducer", { id: this._micProducer.id })

        try {
            this._ioClient.emit(
                'closeProducer', { producerId: this._micProducer.id });
        }
        catch (error) {
            this.emit("error", { text: `Error closing server-side mic Producer: ${error}` })
        }

        this._micProducer = null;
    }

    async muteMic() {
        logger.debug('muteMic()');

        this._micProducer.pause();

        try {
            this._ioClient.emit(
                'pauseProducer', { producerId: this._micProducer.id });


            this.emit("micProducerPaused", { id: this._micProducer.id })
        }
        catch (error) {
            logger.error('muteMic() | failed: %o', error);
            this.emit("error", { text: `Error pausing server-side mic Producer: ${error}` })
        }
    }

    async unmuteMic() {
        logger.debug('unmuteMic()');

        this._micProducer.resume();

        try {
            this._ioClient.emit(
                'resumeProducer', { producerId: this._micProducer.id });

            this.emit("micProducerResumed", { id: this._micProducer.id })

        }
        catch (error) {
            logger.error('unmuteMic() | failed: %o', error);

            this.emit("error", { text: `Error resuming server-side mic Producer: ${error}` })

        }
    }

    async enableWebcam() {
        logger.debug('enableWebcam()');

        if (this._webcamProducer)
            return;
        else if (this._shareProducer)
            await this.disableShare();

        if (!this._mediasoupDevice.canProduce('video')) {
            logger.error('enableWebcam() | cannot produce video');

            return;
        }

        let track;
        let device;


        this.emit("webcamInProgress", true)

        try {
            if (!this._externalVideo) {
                await this._updateWebcams();
                device = this._webcam.device;

                const { resolution } = this._webcam;

                if (!device)
                    throw new Error('no webcam devices');

                logger.debug('enableWebcam() | calling getUserMedia()');

                const stream = await navigator.mediaDevices.getUserMedia(
                    {
                        video:
                        {
                            deviceId: { ideal: device.deviceId },
                            ...VIDEO_CONSTRAINS[resolution]
                        }
                    });

                track = stream.getVideoTracks()[0];
            }
            else {
                device = { label: 'external video' };

                const stream = await this._getExternalVideoStream();

                track = stream.getVideoTracks()[0].clone();
            }

            let encodings;
            let codec;
            const codecOptions =
            {
                videoGoogleStartBitrate: 1000
            };

            if (this._forceH264) {
                codec = this._mediasoupDevice.rtpCapabilities.codecs
                    .find((c) => c.mimeType.toLowerCase() === 'video/h264');

                if (!codec) {
                    throw new Error('desired H264 codec+configuration is not supported');
                }
            }
            else if (this._forceVP9) {
                codec = this._mediasoupDevice.rtpCapabilities.codecs
                    .find((c) => c.mimeType.toLowerCase() === 'video/vp9');

                if (!codec) {
                    throw new Error('desired VP9 codec+configuration is not supported');
                }
            }


            this._webcamProducer = await this._sendTransport.produce(
                {
                    track,
                    encodings,
                    codecOptions,
                    codec
                });


            this.emit("newProducer", {
                id: this._webcamProducer.id,
                deviceLabel: device.label,
                type: this._getWebcamType(device),
                paused: this._webcamProducer.paused,
                track: this._webcamProducer.track,
                rtpParameters: this._webcamProducer.rtpParameters,
                codec: this._webcamProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
            })

            this._webcamProducer.on('transportclose', () => {
                this._webcamProducer = null;
            });

            this._webcamProducer.on('trackended', () => {

                this.emit("error", { text: 'Webcam disconnected!' })

                this.disableWebcam()
                    .catch(() => { });
            });
        }
        catch (error) {
            logger.error('enableWebcam() | failed:%o', error);

            this.emit("error", { text: `Error enabling webcam: ${error}` })

            if (track)
                track.stop();
        }

        this.emit("webcamInProgress", false)
    }

    async disableWebcam() {
        logger.debug('disableWebcam()');

        if (!this._webcamProducer)
            return;

        this._webcamProducer.close();

        this.emit("removeProducer", { id: this._webcamProducer.id })

        try {
            this._ioClient.emit(
                'closeProducer', { producerId: this._webcamProducer.id });
        }
        catch (error) {
            this.emit("error", { text: `Error closing server-side webcam Producer: ${error}` })
        }

        this._webcamProducer = null;
    }

    async changeWebcam() {
        logger.debug('changeWebcam()');


        this.emit("webcamInProgress", true)


        try {
            await this._updateWebcams();

            const array = Array.from(this._webcams.keys());
            const len = array.length;
            const deviceId =
                this._webcam.device ? this._webcam.device.deviceId : undefined;
            let idx = array.indexOf(deviceId);

            if (idx < len - 1)
                idx++;
            else
                idx = 0;

            this._webcam.device = this._webcams.get(array[idx]);

            logger.debug(
                'changeWebcam() | new selected webcam [device:%o]',
                this._webcam.device);

            // Reset video resolution to HD.
            this._webcam.resolution = 'hd';

            if (!this._webcam.device)
                throw new Error('no webcam devices');

            // Closing the current video track before asking for a new one (mobiles do not like
            // having both front/back cameras open at the same time).
            this._webcamProducer.track.stop();

            logger.debug('changeWebcam() | calling getUserMedia()');

            const stream = await navigator.mediaDevices.getUserMedia(
                {
                    video:
                    {
                        deviceId: { exact: this._webcam.device.deviceId },
                        ...VIDEO_CONSTRAINS[this._webcam.resolution]
                    }
                });

            const track = stream.getVideoTracks()[0];

            await this._webcamProducer.replaceTrack({ track });


            this.emit("setProducerTrack", {
                id: this._webcamProducer.id,
                track
            })
        }
        catch (error) {
            logger.error('changeWebcam() | failed: %o', error);
            this.emit("error", { text: `Could not change webcam: ${error}` })
        }

        this.emit("webcamInProgress", false)
    }

    async changeWebcamResolution() {
        logger.debug('changeWebcamResolution()');


        this.emit("webcamInProgress", true)


        try {
            switch (this._webcam.resolution) {
                case 'qvga':
                    this._webcam.resolution = 'vga';
                    break;
                case 'vga':
                    this._webcam.resolution = 'hd';
                    break;
                case 'hd':
                    this._webcam.resolution = 'qvga';
                    break;
                default:
                    this._webcam.resolution = 'hd';
            }

            logger.debug('changeWebcamResolution() | calling getUserMedia()');

            const stream = await navigator.mediaDevices.getUserMedia(
                {
                    video:
                    {
                        deviceId: { exact: this._webcam.device.deviceId },
                        ...VIDEO_CONSTRAINS[this._webcam.resolution]
                    }
                });

            const track = stream.getVideoTracks()[0];

            await this._webcamProducer.replaceTrack({ track });


            this.emit("setProducerTrack", {
                id: this._webcamProducer.id,
                track
            })
        }
        catch (error) {
            logger.error('changeWebcamResolution() | failed: %o', error);

            this.emit("error", {
                text: `Could not change webcam resolution: ${error}`
            })
        }

        this.emit("webcamInProgress", false)

    }

    async enableShare() {
        logger.debug('enableShare()');

        if (this._shareProducer)
            return;
        else if (this._webcamProducer)
            await this.disableWebcam();

        if (!this._mediasoupDevice.canProduce('video')) {
            logger.error('enableShare() | cannot produce video');

            return;
        }

        let track;


        this.emit("shareInProgress", true)


        try {
            logger.debug('enableShare() | calling getUserMedia()');

            const stream = await navigator.mediaDevices.getDisplayMedia(
                {
                    audio: false,
                    video:
                    {
                        width: { max: 1920 },
                        height: { max: 1080 },
                        frameRate: { max: 30 }
                    }
                });

            // May mean cancelled (in some implementations).
            if (!stream) {

                this.emit("shareInProgress", true)

                return;
            }

            track = stream.getVideoTracks()[0];

            let encodings;
            let codec;
            const codecOptions =
            {
                videoGoogleStartBitrate: 1000
            };

            if (this._forceH264) {
                codec = this._mediasoupDevice.rtpCapabilities.codecs
                    .find((c) => c.mimeType.toLowerCase() === 'video/h264');

                if (!codec) {
                    throw new Error('desired H264 codec+configuration is not supported');
                }
            }
            else if (this._forceVP9) {
                codec = this._mediasoupDevice.rtpCapabilities.codecs
                    .find((c) => c.mimeType.toLowerCase() === 'video/vp9');

                if (!codec) {
                    throw new Error('desired VP9 codec+configuration is not supported');
                }
            }


            this._shareProducer = await this._sendTransport.produce(
                {
                    track,
                    encodings,
                    codecOptions,
                    codec,
                    appData:
                    {
                        share: true
                    }
                });


            this.emit("newProducer", {
                id: this._shareProducer.id,
                type: 'share',
                paused: this._shareProducer.paused,
                track: this._shareProducer.track,
                rtpParameters: this._shareProducer.rtpParameters,
                codec: this._shareProducer.rtpParameters.codecs[0].mimeType.split('/')[1]
            })

            this._shareProducer.on('transportclose', () => {
                this._shareProducer = null;
            });

            this._shareProducer.on('trackended', () => {

                this.emit("error", {
                    text: 'Share disconnected!'
                })
                this.disableShare()
                    .catch(() => { });
            });
        }
        catch (error) {
            logger.error('enableShare() | failed:%o', error);

            if (error.name !== 'NotAllowedError') {

                this.emit("error", {
                    text: `Error sharing: ${error}`
                })
            }

            if (track)
                track.stop();
        }

        this.emit("shareInProgress", false)

    }

    async disableShare() {
        logger.debug('disableShare()');

        if (!this._shareProducer)
            return;

        this._shareProducer.close();


        this.emit("removeProducer", { id: this._shareProducer.id })

        try {
            this._ioClient.emit(
                'closeProducer', { producerId: this._shareProducer.id });
        }
        catch (error) {


            this.emit("removeProducer", {
                text: `Error closing server-side share Producer: ${error}`
            })
        }

        this._shareProducer = null;
    }

    async enableAudioOnly() {
        logger.debug('enableAudioOnly()');



        this.emit("audioOnlyInProgress", true)

        this.disableWebcam();

        for (const consumer of this._consumers.values()) {
            if (consumer.kind !== 'video')
                continue;

            this._pauseConsumer(consumer);
        }


        this.emit("audioOnlyOnlyState", true)

        this.emit("audioOnlyInProgress", false)


    }

    async disableAudioOnly() {
        logger.debug('disableAudioOnly()');

        this.emit("audioOnlyOnlyState", true)

        if (
            !this._webcamProducer &&
            this._produce

        ) {
            this.enableWebcam();
        }

        for (const consumer of this._consumers.values()) {
            if (consumer.kind !== 'video')
                continue;

            this._resumeConsumer(consumer);
        }

        this.emit("audioOnlyOnlyState", false)

        this.emit("audioOnlyInProgress", false)
    }

    async muteAudio() {
        logger.debug('muteAudio()');
        this.emit("audioMutedState", false)

    }

    async unmuteAudio() {
        logger.debug('unmuteAudio()');

        this.emit("audioOnlyMuted", true)

    }

    async restartIce() {
        logger.debug('restartIce()');


        this.emit("restartIceInProgress", true)


        try {
            if (this._sendTransport) {
                this._ioClient.emit(
                    'restartIce',
                    { transportId: this._sendTransport.id });

                this._ioClient.on("restartIce", async ({ iceParameters }) => {
                    await this._sendTransport.restartIce({ iceParameters });
                })
            }

            if (this._recvTransport) {
                this._ioClient.emit(
                    'restartIce',
                    { transportId: this._recvTransport.id });

                this._ioClient.on("restartIce", async ({ iceParameters }) => {
                    await this._recvTransport.restartIce({ iceParameters });
                })
            }

            this.emit("ICE restarted")
        }
        catch (error) {
            logger.error('restartIce() | failed:%o', error);

            this.emit("error", { text: `ICE restart failed: ${error}` })
        }

        this.emit("restartIceInProgress", false)
    }

    async setMaxSendingSpatialLayer(spatialLayer) {
        logger.debug('setMaxSendingSpatialLayer() [spatialLayer:%s]', spatialLayer);

        try {
            if (this._webcamProducer)
                await this._webcamProducer.setMaxSpatialLayer(spatialLayer);
            else if (this._shareProducer)
                await this._shareProducer.setMaxSpatialLayer(spatialLayer);
        }
        catch (error) {
            logger.error('setMaxSendingSpatialLayer() | failed:%o', error);

            store.dispatch(requestActions.notify(
                {
                    type: 'error',

                }));

            this.emit("error", { text: `Error setting max sending video spatial layer: ${error}` })

        }
    }

    async setConsumerPreferredLayers(consumerId, spatialLayer, temporalLayer) {
        logger.debug(
            'setConsumerPreferredLayers() [consumerId:%s, spatialLayer:%s, temporalLayer:%s]',
            consumerId, spatialLayer, temporalLayer);

        try {
            this._ioClient.emit(
                'setConsumerPreferredLayers', { consumerId, spatialLayer, temporalLayer });

            // store.dispatch(stateActions.setConsumerPreferredLayers(
            //     consumerId, spatialLayer, temporalLayer));
        }
        catch (error) {
            logger.error('setConsumerPreferredLayers() | failed:%o', error);

            this.emit("error", { text: `Error setting Consumer preferred layers: ${error}` })

        }
    }

    async setConsumerPriority(consumerId, priority) {
        logger.debug(
            'setConsumerPriority() [consumerId:%s, priority:%d]',
            consumerId, priority);

        try {
            this._ioClient.emit('setConsumerPriority', { consumerId, priority });

            // store.dispatch(stateActions.setConsumerPriority(consumerId, priority));
        }
        catch (error) {
            logger.error('setConsumerPriority() | failed:%o', error);


            this.emit("error", { text: `Error setting Consumer priority: ${error}` })

        }
    }

    async requestConsumerKeyFrame(consumerId) {
        logger.debug('requestConsumerKeyFrame() [consumerId:%s]', consumerId);

        try {
            this._ioClient.emit('requestConsumerKeyFrame', { consumerId });


            this.emit("Keyframe requested for video consumer")
        }
        catch (error) {
            logger.error('requestConsumerKeyFrame() | failed:%o', error);


            this.emit("error", { text: `Error requesting key frame for Consumer: ${error}` })

        }
    }


    async getSendTransportRemoteStats() {
        logger.debug('getSendTransportRemoteStats()');

        if (!this._sendTransport)
            return;

        return this._ioClient.emit(
            'getTransportStats', { transportId: this._sendTransport.id });
    }

    async getRecvTransportRemoteStats() {
        logger.debug('getRecvTransportRemoteStats()');

        if (!this._recvTransport)
            return;

        return this._ioClient.emit(
            'getTransportStats', { transportId: this._recvTransport.id });
    }

    async getAudioRemoteStats() {
        logger.debug('getAudioRemoteStats()');

        if (!this._micProducer)
            return;

        return this._ioClient.emit(
            'getProducerStats', { producerId: this._micProducer.id });
    }

    async getVideoRemoteStats() {
        logger.debug('getVideoRemoteStats()');

        const producer = this._webcamProducer || this._shareProducer;

        if (!producer)
            return;

        return this._ioClient.emit(
            'getProducerStats', { producerId: producer.id });
    }

    async getConsumerRemoteStats(consumerId) {
        logger.debug('getConsumerRemoteStats()');

        const consumer = this._consumers.get(consumerId);

        if (!consumer)
            return;

        return this._ioClient.emit('getConsumerStats', { consumerId });
    }


    async getSendTransportLocalStats() {
        logger.debug('getSendTransportLocalStats()');

        if (!this._sendTransport)
            return;

        return this._sendTransport.getStats();
    }

    async getRecvTransportLocalStats() {
        logger.debug('getRecvTransportLocalStats()');

        if (!this._recvTransport)
            return;

        return this._recvTransport.getStats();
    }

    async getAudioLocalStats() {
        logger.debug('getAudioLocalStats()');

        if (!this._micProducer)
            return;

        return this._micProducer.getStats();
    }

    async getVideoLocalStats() {
        logger.debug('getVideoLocalStats()');

        const producer = this._webcamProducer || this._shareProducer;

        if (!producer)
            return;

        return producer.getStats();
    }

    async getConsumerLocalStats(consumerId) {
        const consumer = this._consumers.get(consumerId);

        if (!consumer)
            return;

        return consumer.getStats();
    }

    async _joinRoom() {
        logger.debug('_joinRoom()');

        try {
            this._mediasoupDevice = new mediasoupClient.Device(
                {
                    // handlerName: this._handlerName
                });

            this._ioClient.emit('getRouterRtpCapabilities');


            this._ioClient.on("", async ({ routerRtpCapabilities }) => await this._mediasoupDevice.load({ routerRtpCapabilities }))

            // NOTE: Stuff to play remote audios due to browsers' new autoplay policy.
            //
            // Just get access to the mic and DO NOT close the mic track for a while.
            // Super hack!
            {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioTrack = stream.getAudioTracks()[0];

                audioTrack.enabled = false;

                setTimeout(() => audioTrack.stop(), 120000);
            }
            // Create mediasoup Transport for sending (unless we don't want to produce).
            if (this._produce) {
                this._ioClient.emit(
                    'createWebRtcTransport',
                    {
                        forceTcp: this._forceTcp,
                        producing: true,
                        consuming: false,
                    });

                this._ioClient.on("createWebRtcTransport", async ({
                    id,
                    iceParameters,
                    iceCandidates,
                    dtlsParameters,
                    sctpParameters
                }) => {

                    this._sendTransport = this._mediasoupDevice.createSendTransport(
                        {
                            id,
                            iceParameters,
                            iceCandidates,
                            dtlsParameters:
                            {
                                ...dtlsParameters,
                                // Remote DTLS role. We know it's always 'auto' by default so, if
                                // we want, we can force local WebRTC transport to be 'client' by
                                // indicating 'server' here and vice-versa.
                                role: 'auto'
                            },
                            sctpParameters,
                            iceServers: [],
                            proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
                        });

                    this._sendTransport.on(
                        'connect', ({ dtlsParameters }, callback, errback) => // eslint-disable-line no-shadow
                    {
                        this._ioClient.emit(
                            'connectWebRtcTransport',
                            {
                                transportId: this._sendTransport.id,
                                dtlsParameters
                            })
                        // .catch(errback);

                        this._ioClient.on("connectWebRtcTransport", callback)
                    });

                    this._sendTransport.on(
                        'produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
                            try {
                                // eslint-disable-next-line no-shadow
                                const { id } = this._ioClient.emit(
                                    'produce',
                                    {
                                        transportId: this._sendTransport.id,
                                        kind,
                                        rtpParameters,
                                        appData
                                    });
                                this._ioClient.on("connectWebRtcTransport", callback)

                                // callback({ id });
                            }
                            catch (error) {
                                errback(error);
                            }
                        });
                })

            }

            // Create mediasoup Transport for receiving (unless we don't want to consume).
            if (this._consume) {
                const transportInfo = this._ioClient.emit(
                    'createWebRtcTransport',
                    {
                        forceTcp: this._forceTcp,
                        producing: false,
                        consuming: true,

                    });

                this._ioClient.on("createWebRtcTransport", async ({
                    id,
                    iceParameters,
                    iceCandidates,
                    dtlsParameters,
                    sctpParameters
                }) => {

                    this._recvTransport = this._mediasoupDevice.createRecvTransport(
                        {
                            id,
                            iceParameters,
                            iceCandidates,
                            dtlsParameters:
                            {
                                ...dtlsParameters,
                                // Remote DTLS role. We know it's always 'auto' by default so, if
                                // we want, we can force local WebRTC transport to be 'client' by
                                // indicating 'server' here and vice-versa.
                                role: 'auto'
                            },
                            sctpParameters,
                            iceServers: [],
                        });

                    this._recvTransport.on(
                        'connect', ({ dtlsParameters }, callback, errback) => // eslint-disable-line no-shadow
                    {
                        this._ioClient.emit(
                            'connectWebRtcTransport',
                            {
                                transportId: this._recvTransport.id,
                                dtlsParameters
                            })
                        // .catch(errback);

                        socketIo.on("connectWebRtcTransport", callback)
                    });
                })
            }

            // Join now into the room.
            // NOTE: Don't send our RTP capabilities if we don't want to consume.
            this._ioClient.emit(
                'join',
                {
                    device: this._device,
                    rtpCapabilities: this._consume
                        ? this._mediasoupDevice.rtpCapabilities
                        : undefined,

                });


            this.emit("roomState", "connected");




            // Enable mic/webcam.
            if (this._produce) {
                // Set our media capabilities.


                this.emit("mediaCapabilities", {
                    canSendMic: this._mediasoupDevice.canProduce('audio'),
                    canSendWebcam: this._mediasoupDevice.canProduce('video')
                })

                this.enableMic();


                this.enableWebcam();

                this._sendTransport.on('connectionstatechange', (connectionState) => {
                    if (connectionState === 'connected') {

                    }
                });
            }


        }
        catch (error) {
            logger.error('_joinRoom() failed:%o', error);

            this.emit("error", { text: `Could not join the room: ${error}` })

            this.close();
        }
    }

    async _updateWebcams() {
        logger.debug('_updateWebcams()');

        // Reset the list.
        this._webcams = new Map();

        logger.debug('_updateWebcams() | calling enumerateDevices()');

        const devices = await navigator.mediaDevices.enumerateDevices();

        for (const device of devices) {
            if (device.kind !== 'videoinput')
                continue;

            this._webcams.set(device.deviceId, device);
        }

        const array = Array.from(this._webcams.values());
        const len = array.length;
        const currentWebcamId =
            this._webcam.device ? this._webcam.device.deviceId : undefined;

        logger.debug('_updateWebcams() [webcams:%o]', array);

        if (len === 0)
            this._webcam.device = null;
        else if (!this._webcams.has(currentWebcamId))
            this._webcam.device = array[0];


        this.emit("CanChangeWebcam", this._webcams.size > 1)

    }

    _getWebcamType(device) {
        if (/(back|rear)/i.test(device.label)) {
            logger.debug('_getWebcamType() | it seems to be a back camera');

            return 'back';
        }
        else {
            logger.debug('_getWebcamType() | it seems to be a front camera');

            return 'front';
        }
    }

    async _pauseConsumer(consumer) {
        if (consumer.paused)
            return;

        try {
            this._ioClient.emit('pauseConsumer', { consumerId: consumer.id });

            consumer.pause();


            this.emit("consumerPaused", { consumerId: consumer.id })
        }
        catch (error) {
            logger.error('_pauseConsumer() | failed:%o', error);


            this.emit("error", { text: `Error pausing Consumer: ${error}` })
        }
    }

    async _resumeConsumer(consumer) {
        if (!consumer.paused)
            return;

        try {
            this._ioClient.emit('resumeConsumer', { consumerId: consumer.id });

            consumer.resume();

            this.emit("consumeResumed", { consumerId: consumer.id })


        }
        catch (error) {
            logger.error('_resumeConsumer() | failed:%o', error);


            this.emit("error", {
                text: `Error resuming Consumer: ${error}`

            })
        }
    }

    async _getExternalVideoStream() {
        if (this._externalVideoStream)
            return this._externalVideoStream;

        if (this._externalVideo.readyState < 3) {
            await new Promise((resolve) => (
                this._externalVideo.addEventListener('canplay', resolve)
            ));
        }


        return this._externalVideoStream;
    }
}
