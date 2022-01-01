import { ApolloServer } from "apollo-server-express";
import { schema } from "../schema/schema";
import { context, prisma } from "../api/context";
import pino, { final, P } from "pino";
import { logRequestDB } from "../logging";
import { verifyJWT } from "../api/jwt";
import { User } from "@prisma/client";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import * as mediasoup from "mediasoup";
import os from "os";
import { Worker } from "mediasoup/node/lib/Worker";

const dest = pino.destination({
  sync: false,
});
const logger = pino(dest);

const apolloServer = new ApolloServer({
  //@ts-ignore
  schema,
  context: async ({ req }) => {
    // Get the user token from the headers.
    const token = req.headers.authorization || "";

    if (!token) return context;

    // Try to retrieve a user with the token
    const user = (await verifyJWT(token)) as User | undefined;

    if (user) {
      // console.log(`logged ${user?.name}`);
    } else {
      console.log(`not logged ${token}`);
    }

    return {
      user,
      isLogged: !!user,
      isAdmin: user?.isAdmin || false,
      ...context,
    };
  },
  plugins: [
    {
      async requestDidStart(ctx) {
        const start = Date.now();
        const { operationName, query, variables, http } = ctx.request;
        const data = {
          operationName,
          query,
          variables,
          http,
        };
        const execute =
          operationName != "IntrospectionQuery" &&
          operationName &&
          query &&
          http;

        if (execute) {
          // logger.info(data);
        }

        return {
          async() {
            if (execute) {
              const stop = Date.now();
              const elapsed = stop - start;
              logger.info(
                `Operation ${operationName} completed in ${elapsed} ms`
              );
              logRequestDB(
                operationName,
                query,
                JSON.stringify(variables),
                elapsed
              );
            }
          },
        };
      },
    },
  ],
});

interface SocketObjectExist
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  decoded: User;
}

interface SocketObject
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  decoded?: Partial<User>;
}

async function main() {
  await apolloServer.start();

  const app = express();

  const server = http.createServer(app);

  // This middleware should be added before calling`applyMiddleware`.
  app.use(graphqlUploadExpress());

  apolloServer.applyMiddleware({ app });

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const token = socket.handshake.query.token as string;

      try {
        const decoded = await verifyJWT(token);
        //@ts-ignore
        socket.decoded = decoded;
        next();
      } catch (error) {
        return next(new Error("Authentication error"));
      }
    } else {
      next(new Error("Authentication error"));
    }
  }).on("connection", function (socket: SocketObject) {
    // Connection now authenticated to receive further

    // auth only
    if (socket.decoded) {
      const user = socket.decoded;

      socket.join("user-quiz" + user.id);
      socket.join("user-chat" + user.id);
      socket.join("user-notification" + user.id);

      socket.on("meeting-join", async ({ meetingId }) => {
        const room = await getOrCreateRoom({ io, roomId: meetingId });

        room.handleSocketJoin({ socket: socket as SocketObjectExist });

        console.log("meeting-join-called");
      });
    }

    // free for all
  });

  logger.info("starting mediasoup workers");

  await startMediasoupWorkers();

  logger.info("mediasoup started");

  server.listen(4000, () => {
    logger.info(
      `GRAPHQL Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
}

main();

const mediasoupWorkers: Worker[] = [];
let nextMediasoupWorkerIdx = 0;

async function startMediasoupWorkers() {
  for (let index = 0; index < os.cpus().length; index++) {
    const worker = await mediasoup.createWorker({
      logLevel: "error",
      logTags: [
        "info",
        "ice",
        "dtls",
        "rtp",
        "srtp",
        "rtcp",
        "rtx",
        "bwe",
        "score",
        "simulcast",
        "svc",
        "sctp",
      ],
      rtcMaxPort: 49999,
      rtcMinPort: 40000,
    });

    mediasoupWorkers.push(worker);
  }
}

function getMediasoupWorker() {
  const worker = mediasoupWorkers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === mediasoupWorkers.length)
    nextMediasoupWorkerIdx = 0;

  return worker;
}

const rooms = new Map<number, Room>();
/**
 * Get a Room instance (or create one if it does not exist).
 */
async function getOrCreateRoom({
  roomId,
  io,
}: {
  roomId: number;
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}) {
  let room = rooms.get(roomId);

  // If the Room does not exist create a new one.
  if (!room) {
    logger.info("creating a new Room [roomId:%d]", roomId);

    const mediasoupWorker = getMediasoupWorker();

    room = await Room.create({ mediasoupWorker, roomId, io });

    rooms.set(roomId, room);
    room.on("close", () => rooms.delete(roomId));
  }

  return room;
}

import { EventEmitter } from "events";
import config from "./config";
import { Router } from "mediasoup/node/lib/Router";
import { AudioLevelObserver } from "mediasoup/node/lib/AudioLevelObserver";
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/node/lib/RtpParameters";
import { Transport } from "mediasoup/node/lib/Transport";
import { Producer } from "mediasoup/node/lib/Producer";
import { DataProducer } from "mediasoup/node/lib/DataProducer";
import { Consumer } from "mediasoup/node/lib/Consumer";
import { DataConsumer } from "mediasoup/node/lib/DataConsumer";
import { SctpCapabilities } from "mediasoup/node/lib/SctpParameters";
import { DtlsParameters } from "mediasoup/node/lib/WebRtcTransport";

interface BroadcasterData {
  displayName: string;
  device: object; // TODO : FIND PROPER TYPE
  rtpCapabilities?: RtpCapabilities;
  sctpCapabilities?: SctpCapabilities;
  transports: Map<string, Transport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
  consume: boolean;
  joined: boolean;
  socket: SocketObjectExist;
}

/**
 * Room class.
 *
 * This is not a "mediasoup Room" by itself, by a custom class that holds
 * a protoo Room (for signaling with WebSocket clients) and a mediasoup Router
 * (for sending and receiving media to/from those WebSocket peers).
 */
class Room extends EventEmitter {
  /**
   * Factory function that creates and returns Room instance.
   *
   * @async
   *
   * @param {mediasoup.Worker} mediasoupWorker - The mediasoup Worker in which a new
   *   mediasoup Router must be created.
   * @param {Number} roomId - Id of the Room instance.
   */
  static async create({
    mediasoupWorker,
    roomId,
    io,
  }: {
    mediasoupWorker: Worker;
    roomId: number;
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  }) {
    logger.info("create() [roomId:%s]", roomId);

    // Create a socket Room instance.

    // Router media codecs.
    const { mediaCodecs } = config.mediasoup.routerOptions;

    // Create a mediasoup Router.
    //@ts-ignore
    const mediasoupRouter = await mediasoupWorker.createRouter({ mediaCodecs });

    // Create a mediasoup AudioLevelObserver.
    const audioLevelObserver = await mediasoupRouter.createAudioLevelObserver({
      maxEntries: 1,
      threshold: -80,
      interval: 800,
    });

    return new Room({
      roomId,
      mediasoupRouter,
      audioLevelObserver,
      io,
    });
  }

  private _peers: Map<number, BroadcasterData>;
  private _roomId: number;
  private _closed: boolean;
  private _mediasoupRouter: Router;
  private _audioLevelObserver: AudioLevelObserver;
  private _networkThrottled: boolean;
  private _roomIdentifier: string;
  private _broadcasters: Map<string, BroadcasterData>;
  private _roomsPeers: Set<string>;
  private _ioInstance: Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;
  constructor({
    roomId,
    mediasoupRouter,
    audioLevelObserver,
    io,
  }: {
    roomId: number;
    mediasoupRouter: Router;
    audioLevelObserver: AudioLevelObserver;
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  }) {
    super();
    this.setMaxListeners(Infinity);
    this._peers = new Map();
    // Room id.
    // @type {String}
    this._roomId = roomId;
    this._roomIdentifier = `room-${roomId}`;
    // Closed flag.
    // @type {Boolean}
    this._closed = false;

    // // socket Room instance.
    // this._socket = socket;

    // Map of broadcasters indexed by id. Each Object has:
    // - {String} id
    // - {Object} data
    //   - {String} displayName
    //   - {Object} device
    //   - {RTCRtpCapabilities} rtpCapabilities
    //   - {Map<String, mediasoup.Transport>} transports
    //   - {Map<String, mediasoup.Producer>} producers
    //   - {Map<String, mediasoup.Consumers>} consumers
    //   - {Map<String, mediasoup.DataProducer>} dataProducers
    //   - {Map<String, mediasoup.DataConsumers>} dataConsumers
    // @type {Map<String, Object>}

    this._broadcasters = new Map<string, BroadcasterData>();

    // mediasoup Router instance.
    // @type {mediasoup.Router}
    this._mediasoupRouter = mediasoupRouter;

    // mediasoup AudioLevelObserver.
    // @type {mediasoup.AudioLevelObserver}
    this._audioLevelObserver = audioLevelObserver;

    // Network throttled.
    // @type {Boolean}
    this._networkThrottled = false;

    // Handle audioLevelObserver.
    this._handleAudioLevelObserver();

    this._ioInstance = io;

    this._roomsPeers =
      io.sockets.adapter.rooms.get(this._roomIdentifier) || new Set();
    // For debugging.
    // global.audioLevelObserver = this._audioLevelObserver;
  }

  /**
   * Closes the Room instance by closing the protoo Room and the mediasoup Router.
   */
  close() {
    logger.debug("close()");

    this._closed = true;

    // Close the mediasoup Router.
    this._mediasoupRouter.close();

    // Emit 'close' event.
    this.emit("close");
  }

  logStatus() {
    logger.info(
      "logStatus() [roomId:%s, protoo Peers:%s]",
      this._roomId,
      this._roomsPeers.size
    );
  }

  /**
   * Called from server.js upon a protoo WebSocket connection request from a
   * browser.
   *
   *   protoo WebSocket transport.
   */
  handleSocketJoin({ socket }: { socket: SocketObjectExist }) {
    const socketId = socket.decoded.id;

    const existingPeer = this._peers.has(socketId);

    let data: BroadcasterData | undefined;
    if (existingPeer) {
      logger.warn(
        "handleSocketJoin() | there is already a socketIO Peer with same socketId, closing it [socketId:%s]",
        socketId
      );

      // Use the peer.data object to store mediasoup related objects.

      // Not joined after a custom protoo 'join' request is later received.

      data = this._peers.get(socketId);

      // existingPeer.close();
    } else {
      data = {
        displayName: socket.decoded.name,
        consume: true,
        joined: false,
        device: {},
        rtpCapabilities: undefined,
        sctpCapabilities: undefined,

        // Have mediasoup related maps ready even before the Peer joins since we
        // allow creating Transports before joining.

        transports: new Map(),
        producers: new Map(),
        consumers: new Map(),
        socket,
      };

      this._peers.set(socketId, data);
    }

    if (!data) {
      throw new Error("data not found");
    }

    socket.on("setupRequestHandler", () => {
      logger.debug(
        'socketIO Peer "request" event [socketId:%s peerUsername: %s]',
        socket.id,
        socket.decoded?.username
      );

      this._handleSocketRequest(socket);
    });

    socket.on("close", () => {
      if (this._closed) return;
      if (!data) return;

      logger.debug('socketIO Peer "close" event [socketId:%s]', socket.id);

      // BROADCAST CLOSE
      if (data.joined) {
        socket.broadcast
          .to(this._roomIdentifier)
          .emit("peerClosed", { socketId: socket.id });
      }

      // Iterate and close all mediasoup Transport associated to this Peer, so all
      // its Producers and Consumers will also be closed.
      if (data.transports?.values())
        for (const transport of data.transports.values()) {
          transport.close();
        }

      this._peers.delete(socketId);

      // If this is the latest Peer in the room, close the room.
      if (this._roomsPeers.size === 0) {
        logger.info(
          "last Peer in the room left, closing the room [roomId:%s]",
          this._roomId
        );

        this.close();
      }
    });
  }

  getRouterRtpCapabilities() {
    return this._mediasoupRouter.rtpCapabilities;
  }

  /**
   * Create a Broadcaster. This is for HTTP API requests (see server.js).
   *
   * @async
   *
   * @type {String} id - Broadcaster id.
   * @type {String} displayName - Descriptive name.
   * @type {Object} [device] - Additional info with name, version and flags fields.
   * @type {RTCRtpCapabilities} [rtpCapabilities] - Device RTP capabilities.
   */
  async createBroadcaster({
    socket,
    id,
    displayName,
    device = {},
    rtpCapabilities,
  }: {
    id: string;
    socket: SocketObjectExist;
    displayName: string;
    device: any;
    rtpCapabilities: RtpCapabilities;
  }) {
    if (typeof id !== "string" || !id) throw new TypeError("missing body.id");
    else if (typeof displayName !== "string" || !displayName)
      throw new TypeError("missing body.displayName");
    else if (typeof device.name !== "string" || !device.name)
      throw new TypeError("missing body.device.name");
    else if (rtpCapabilities && typeof rtpCapabilities !== "object")
      throw new TypeError("wrong body.rtpCapabilities");

    if (this._broadcasters.has(id))
      throw new Error(`broadcaster with id "${id}" already exists`);

    const broadcaster = {
      socket,
      displayName,
      device: {
        flag: "broadcaster",
        name: device.name || "Unknown device",
        version: device.version,
      },
      rtpCapabilities,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
      consume: false,
      joined: true,
    };

    // Store the Broadcaster into the map.
    this._broadcasters.set(socket.id, broadcaster);

    // Notify the new Broadcaster to all Peers.
    for (const otherPeer of this._peers.values()) {
      socket.broadcast.to(this._roomIdentifier).emit("newPeer", {
        id: socket.id,
        displayName: broadcaster.displayName,
        device: broadcaster.device,
      });
    }

    // Reply with the list of Peers and their Producers.
    const peerInfos = [];
    const joinedPeers = this._peers.values();

    // Just fill the list of Peers if the Broadcaster provided its rtpCapabilities.
    if (rtpCapabilities) {
      for (const joinedPeer of joinedPeers) {
        const peerInfo = {
          id: socket.id,
          displayName: joinedPeer.displayName,
          device: joinedPeer.device,
          producers: [] as any[],
        };

        for (const producer of joinedPeer.producers.values()) {
          // Ignore Producers that the Broadcaster cannot consume.
          if (
            !this._mediasoupRouter.canConsume({
              producerId: producer.id,
              rtpCapabilities,
            })
          ) {
            continue;
          }

          peerInfo.producers.push({
            id: producer.id,
            kind: producer.kind,
          });
        }

        peerInfos.push(peerInfo);
      }
    }

    return { peers: peerInfos };
  }

  /**
   * Delete a Broadcaster.
   *
   * @type {String} broadcasterId
   */
  deleteBroadcaster({ broadcasterId }: { broadcasterId: string }) {
    const broadcaster = this._broadcasters.get(broadcasterId);

    if (!broadcaster)
      throw new Error(`broadcaster with id "${broadcasterId}" does not exist`);

    for (const transport of broadcaster.transports.values()) {
      transport.close();
    }

    this._broadcasters.delete(broadcasterId);

    for (const peer of this._peers.values()) {
      broadcaster.socket.broadcast
        .to(this._roomIdentifier)
        .emit("peerClosed", { socketId: broadcasterId });
    }
  }

  /**
   * Create a mediasoup Transport associated to a Broadcaster. It can be a
   * PlainTransport or a WebRtcTransport.
   *
   * @async
   *
   * @type {String} broadcasterId
   * @type {String} type - Can be 'plain' (PlainTransport) or 'webrtc'
   *   (WebRtcTransport).
   * @type {Boolean} [rtcpMux=false] - Just for PlainTransport, use RTCP mux.
   * @type {Boolean} [comedia=true] - Just for PlainTransport, enable remote IP:port
   *   autodetection.
   * @type {Object} [sctpCapabilities] - SCTP capabilities
   */
  async createBroadcasterTransport({
    broadcasterId,
    type,
    rtcpMux = false,
    comedia = true,
    sctpCapabilities,
  }: {
    broadcasterId: string;
    type: string;
    rtcpMux: boolean;
    comedia: boolean;
    sctpCapabilities: SctpCapabilities;
  }) {
    const broadcaster = this._broadcasters.get(broadcasterId);

    if (!broadcaster)
      throw new Error(`broadcaster with id "${broadcasterId}" does not exist`);

    switch (type) {
      case "webrtc": {
        const webRtcTransportOptions = {
          ...config.mediasoup.webRtcTransportOptions,
          enableSctp: Boolean(sctpCapabilities),
          numSctpStreams: (sctpCapabilities || {}).numStreams,
        };

        const transport = await this._mediasoupRouter.createWebRtcTransport(
          webRtcTransportOptions
        );

        // Store it.
        broadcaster.transports.set(transport.id, transport);

        return {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
          sctpParameters: transport.sctpParameters,
        };
      }

      case "plain": {
        const plainTransportOptions = {
          ...config.mediasoup.plainTransportOptions,
          rtcpMux: rtcpMux,
          comedia: comedia,
        };

        const transport = await this._mediasoupRouter.createPlainTransport(
          plainTransportOptions
        );

        // Store it.
        broadcaster.transports.set(transport.id, transport);

        return {
          id: transport.id,
          ip: transport.tuple.localIp,
          port: transport.tuple.localPort,
          rtcpPort: transport.rtcpTuple
            ? transport.rtcpTuple.localPort
            : undefined,
        };
      }

      default: {
        throw new TypeError("invalid type");
      }
    }
  }

  /**
   * Connect a Broadcaster mediasoup WebRtcTransport.
   *
   * @async
   *
   * @type {String} broadcasterId
   * @type {String} transportId
   * @type {RTCDtlsParameters} dtlsParameters - Remote DTLS parameters.
   */
  async connectBroadcasterTransport({
    broadcasterId,
    transportId,
    dtlsParameters,
  }: {
    broadcasterId: string;
    transportId: string;
    dtlsParameters: DtlsParameters;
  }) {
    const broadcaster = this._broadcasters.get(broadcasterId);

    if (!broadcaster)
      throw new Error(`broadcaster with id "${broadcasterId}" does not exist`);

    const transport = broadcaster.transports.get(transportId);

    if (!transport)
      throw new Error(`transport with id "${transportId}" does not exist`);

    if (transport.constructor.name !== "WebRtcTransport") {
      throw new Error(
        `transport with id "${transportId}" is not a WebRtcTransport`
      );
    }

    await transport.connect({ dtlsParameters });
  }

  /**
   * Create a mediasoup Producer associated to a Broadcaster.
   *
   * @async
   *
   * @type {String} broadcasterId
   * @type {String} transportId
   * @type {String} kind - 'audio' or 'video' kind for the Producer.
   * @type {RTCRtpParameters} rtpParameters - RTP parameters for the Producer.
   */
  async createBroadcasterProducer({
    broadcasterId,
    transportId,
    kind,
    rtpParameters,
  }: {
    broadcasterId: string;
    transportId: string;
    kind: MediaKind;
    rtpParameters: RtpParameters;
  }) {
    const broadcaster = this._broadcasters.get(broadcasterId);

    if (!broadcaster)
      throw new Error(`broadcaster with id "${broadcasterId}" does not exist`);

    const transport = broadcaster.transports.get(transportId);

    if (!transport)
      throw new Error(`transport with id "${transportId}" does not exist`);

    const producer = await transport.produce({ kind, rtpParameters });

    // Store it.
    broadcaster.producers.set(producer.id, producer);

    // Set Producer events.
    // producer.on('score', (score) =>
    // {
    // 	logger.debug(
    // 		'broadcaster producer "score" event [producerId:%s, score:%o]',
    // 		producer.id, score);
    // });

    producer.on("videoorientationchange", (videoOrientation) => {
      logger.debug(
        'broadcaster producer "videoorientationchange" event [producerId:%s, videoOrientation:%o]',
        producer.id,
        videoOrientation
      );
    });

    // Optimization: Create a server-side Consumer for each Peer.
    for (const peer of this._peers.values()) {
      this._createConsumer({
        consumerPeer: peer.socket,
        producerPeer: broadcaster.socket,
        producer,
      });
    }

    // Add into the audioLevelObserver.
    if (producer.kind === "audio") {
      this._audioLevelObserver.addProducer({ producerId: producer.id });
    }

    return { id: producer.id };
  }

  /**
   * Create a mediasoup Consumer associated to a Broadcaster.
   *
   * @async
   *
   * @type {String} broadcasterId
   * @type {String} transportId
   * @type {String} producerId
   */
  async createBroadcasterConsumer({
    broadcasterId,
    transportId,
    producerId,
  }: Record<string, string>) {
    const broadcaster = this._broadcasters.get(broadcasterId);

    if (!broadcaster)
      throw new Error(`broadcaster with id "${broadcasterId}" does not exist`);

    if (!broadcaster.rtpCapabilities)
      throw new Error("broadcaster does not have rtpCapabilities");

    const transport = broadcaster.transports.get(transportId);

    if (!transport)
      throw new Error(`transport with id "${transportId}" does not exist`);

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities: broadcaster.rtpCapabilities,
    });

    // Store it.
    broadcaster.consumers.set(consumer.id, consumer);

    // Set Consumer events.
    consumer.on("transportclose", () => {
      // Remove from its map.
      broadcaster.consumers.delete(consumer.id);
    });

    consumer.on("producerclose", () => {
      // Remove from its map.
      broadcaster.consumers.delete(consumer.id);
    });

    return {
      id: consumer.id,
      producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
    };
  }

  _handleAudioLevelObserver() {
    this._audioLevelObserver.on("volumes", (volumes) => {
      const { producer, volume } = volumes[0];

      // logger.debug(
      // 	'audioLevelObserver "volumes" event [producerId:%s, volume:%s]',
      // 	producer.id, volume);

      // Notify all Peers.
      for (const peer of this._peers.values()) {
        peer.socket.emit("activeSpeaker", {
          socketId: producer.appData.socketId,
          volume: volume,
        });
      }
    });

    this._audioLevelObserver.on("silence", () => {
      // logger.debug('audioLevelObserver "silence" event');

      // Notify all Peers.
      for (const peer of this._peers.values()) {
        peer.socket.emit("activeSpeaker", { socketId: null });
      }
    });
  }

  /**
   * Handle protoo requests from browsers.
   *
   * @async
   */
  async _handleSocketRequest(socket: SocketObjectExist) {
    const data = this._peers.get(socket.decoded.id);

    console.log(data);

    if (!data) {
      logger.info("ignoring socket request from unknown peer");
      return;
    }

    const { device, rtpCapabilities, sctpCapabilities } = data;
    socket.on("getRouterRtpCapabilities", () => {
      socket.emit("getRouterRtpCapabilities", {
        rtpCapabilities: this._mediasoupRouter.rtpCapabilities,
      });
    });

    socket.on("join", () => {
      // Ensure the Peer is not already joined.
      if (data.joined) {
        // throw new Error("Peer already joined");
        data.joined = false;
      }
      // Store client data into the protoo Peer data object.
      data.joined = true;
      data.device = device;
      data.rtpCapabilities = rtpCapabilities;
      data.sctpCapabilities = sctpCapabilities;
      // Tell the new Peer about already joined Peers.
      // And also create Consumers for existing Producers.
      const joinedPeers = [...this._broadcasters.values()];
      // Reply now the request with the list of joined peers (all but the new one).
      const peerInfos = [];

      for (const id of this._peers.keys()) {
        const joinedPeer = this._peers.get(id);

        if (id == socket.decoded.id || !joinedPeer) continue;
        peerInfos.push({
          id,
          displayName: joinedPeer.displayName,
          device: joinedPeer.device,
        });
      }

      socket.emit("peers", peerInfos);

      // Mark the new Peer as joined.
      data.joined = true;

      for (const joinedPeer of joinedPeers) {
        // Create Consumers for existing Producers.
        for (const producer of joinedPeer.producers.values()) {
          this._createConsumer({
            consumerPeer: socket,
            producerPeer: joinedPeer.socket,
            producer,
          });
        }
      }

      // Notify the new Peer to all other Peers.
      socket.broadcast.to(this._roomIdentifier).emit("newPeer", {
        id: socket.id,
        displayName: data.displayName,
        device: data.device,
      });
    });

    socket.on(
      "createWebRtcTransport",
      async ({
        forceTcp,
        producing,
        consuming,
      }: {
        forceTcp: boolean;
        producing: boolean;
        consuming: boolean;
      }) => {
        // NOTE: Don't require that the Peer is joined here, so the client can
        // initiate mediasoup Transports and be ready when he later joins.

        const webRtcTransportOptions = {
          ...config.mediasoup.webRtcTransportOptions,
          appData: { producing, consuming },
          enableUdp: true,
          enableTcp: false,
        };

        if (forceTcp) {
          webRtcTransportOptions.enableUdp = false;
          webRtcTransportOptions.enableTcp = true;
        }

        const transport = await this._mediasoupRouter.createWebRtcTransport(
          webRtcTransportOptions
        );

        transport.on("sctpstatechange", (sctpState) => {
          logger.debug(
            'WebRtcTransport "sctpstatechange" event [sctpState:%s]',
            sctpState
          );
        });

        transport.on("dtlsstatechange", (dtlsState) => {
          if (dtlsState === "failed" || dtlsState === "closed")
            logger.warn(
              'WebRtcTransport "dtlsstatechange" event [dtlsState:%s]',
              dtlsState
            );
        });

        // NOTE: For testing.
        // await transport.enableTraceEvent([ 'probation', 'bwe' ]);
        await transport.enableTraceEvent(["bwe"]);

        transport.on("trace", (trace) => {
          logger.debug(
            'transport "trace" event [transportId:%s, trace.type:%s, trace:%o]',
            transport.id,
            trace.type,
            trace
          );

          if (trace.type === "bwe" && trace.direction === "out") {
            socket.emit("downlinkBwe", {
              desiredBitrate: trace.info.desiredBitrate,
              effectiveDesiredBitrate: trace.info.effectiveDesiredBitrate,
              availableBitrate: trace.info.availableBitrate,
            });
          }
        });

        // Store the WebRtcTransport into the protoo Peer data Object.
        data.transports.set(transport.id, transport);

        socket.emit("createWebRtcTransport", {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
          sctpParameters: transport.sctpParameters,
        });

        const { maxIncomingBitrate } = config.mediasoup.webRtcTransportOptions;

        // If set, apply max incoming bitrate limit.
        if (maxIncomingBitrate) {
          try {
            await transport.setMaxIncomingBitrate(maxIncomingBitrate);
          } catch (error) {}
        }
      }
    );

    socket.on(
      "connectWebRtcTransport",
      async ({ transportId, dtlsParameters }) => {
        const transport = data.transports.get(transportId);

        if (!transport)
          throw new Error(`transport with id "${transportId}" not found`);

        await transport.connect({ dtlsParameters });
      }
    );

    socket.on(
      "restartIce",
      async ({ transportId }: { transportId: string }) => {
        const transport = data.transports.get(transportId);

        if (!transport)
          throw new Error(`transport with id "${transportId}" not found`);
        //@ts-ignore
        const iceParameters = await transport.restartIce();

        socket.emit("restartIce", iceParameters);
      }
    );

    socket.on(
      "produce",
      async ({ transportId, kind, rtpParameters, appData }: any) => {
        // Ensure the Peer is joined.
        if (!data.joined) throw new Error("Peer not yet joined");
        const transport = data.transports.get(transportId);

        if (!transport)
          throw new Error(`transport with id "${transportId}" not found`);

        // Add socketId into appData to later get the associated Peer during
        // the 'loudest' event of the audioLevelObserver.
        // appData = { ...appData, socketId: peer.id };

        const producer = await transport.produce({
          kind,
          rtpParameters,
          // appData,
          // keyFrameRequestDelay: 5000
        });

        // Store the Producer into the protoo Peer data Object.
        data.producers.set(producer.id, producer);

        // Set Producer events.
        producer.on("score", (score) => {
          // logger.debug(
          // 	'producer "score" event [producerId:%s, score:%o]',
          // 	producer.id, score);

          socket.broadcast
            .to(this._roomIdentifier)
            .emit("producerScore", { producerId: producer.id, score });
        });

        producer.on("videoorientationchange", (videoOrientation) => {
          logger.debug(
            'producer "videoorientationchange" event [producerId:%s, videoOrientation:%o]',
            producer.id,
            videoOrientation
          );
        });

        // NOTE: For testing.
        // await producer.enableTraceEvent([ 'rtp', 'keyframe', 'nack', 'pli', 'fir' ]);
        // await producer.enableTraceEvent([ 'pli', 'fir' ]);
        // await producer.enableTraceEvent([ 'keyframe' ]);

        producer.on("trace", (trace) => {
          logger.debug(
            'producer "trace" event [producerId:%s, trace.type:%s, trace:%o]',
            producer.id,
            trace.type,
            trace
          );
        });

        socket.emit("produce", { id: producer.id });

        // Optimization: Create a server-side Consumer for each Peer.
        for (const otherPeer of this._peers.values()) {
          this._createConsumer({
            consumerPeer: otherPeer.socket,
            producerPeer: socket,
            producer,
          });
        }

        // Add into the audioLevelObserver.
        if (producer.kind === "audio") {
          this._audioLevelObserver.addProducer({ producerId: producer.id });
        }
      }
    );

    socket.on("closeProducer", ({ producerId }) => {
      if (!data.joined) throw new Error("Peer not yet joined");

      const producer = data.producers.get(producerId);

      if (!producer)
        throw new Error(`producer with id "${producerId}" not found`);

      producer.close();

      // Remove from its map.
      data.producers.delete(producer.id);
    });

    socket.on("pauseProducer", async ({ producerId }) => {
      if (!data.joined) throw new Error("Peer not yet joined");

      const producer = data.producers.get(producerId);

      if (!producer)
        throw new Error(`producer with id "${producerId}" not found`);

      await producer.pause();
    });

    socket.on("resumeProducer", async ({ producerId }) => {
      // Ensure the Peer is joined.
      if (!data.joined) throw new Error("Peer not yet joined");

      const producer = data.producers.get(producerId);

      if (!producer)
        throw new Error(`producer with id "${producerId}" not found`);

      await producer.resume();
    });

    socket.on("pauseConsumer", async ({ consumerId }) => {
      // Ensure the Peer is joined.
      if (!data.joined) throw new Error("Peer not yet joined");

      const consumer = data.consumers.get(consumerId);

      if (!consumer)
        throw new Error(`consumer with id "${consumerId}" not found`);

      await consumer.pause();
    });

    socket.on("resumeConsumer", async ({ consumerId }) => {
      // Ensure the Peer is joined.
      if (!data.joined) throw new Error("Peer not yet joined");

      const consumer = data.consumers.get(consumerId);

      if (!consumer)
        throw new Error(`consumer with id "${consumerId}" not found`);

      await consumer.resume();
    });

    socket.on(
      "setConsumerPreferredLayers",
      async ({ consumerId, spatialLayer, temporalLayer }) => {
        // Ensure the Peer is joined.
        if (!data.joined) throw new Error("Peer not yet joined");

        const consumer = data.consumers.get(consumerId);

        if (!consumer)
          throw new Error(`consumer with id "${consumerId}" not found`);

        await consumer.setPreferredLayers({ spatialLayer, temporalLayer });
      }
    );

    socket.on("setConsumerPriority", async ({ consumerId, priority }) => {
      // Ensure the Peer is joined.
      if (!data.joined) throw new Error("Peer not yet joined");

      const consumer = data.consumers.get(consumerId);

      if (!consumer)
        throw new Error(`consumer with id "${consumerId}" not found`);

      await consumer.setPriority(priority);
    });

    socket.on("requestConsumerKeyFrame", async ({ consumerId }) => {
      // Ensure the Peer is joined.
      if (!data.joined) throw new Error("Peer not yet joined");

      const consumer = data.consumers.get(consumerId);

      if (!consumer)
        throw new Error(`consumer with id "${consumerId}" not found`);

      await consumer.requestKeyFrame();
    });

    socket.on("requestConsumerKeyFrame", async ({ consumerId }) => {
      // Ensure the Peer is joined.
      if (!data.joined) throw new Error("Peer not yet joined");

      const consumer = data.consumers.get(consumerId);

      if (!consumer)
        throw new Error(`consumer with id "${consumerId}" not found`);

      await consumer.requestKeyFrame();
    });

    socket.on("getTransportStats", async ({ transportId }) => {
      const transport = data.transports.get(transportId);

      if (!transport)
        throw new Error(`transport with id "${transportId}" not found`);

      const stats = await transport.getStats();

      socket.emit("getTransportStats", stats);
    });

    socket.on("getProducerStats", async ({ producerId }) => {
      const producer = data.producers.get(producerId);

      if (!producer)
        throw new Error(`producer with id "${producerId}" not found`);

      const stats = await producer.getStats();
      socket.emit("getProducerStats", stats);
    });

    socket.on("getConsumerStats", async ({ consumerId }) => {
      const consumer = data.consumers.get(consumerId);

      if (!consumer)
        throw new Error(`consumer with id "${consumerId}" not found`);

      const stats = await consumer.getStats();
      socket.emit("getConsumerStats", stats);
    });
  }

  /**
   * Creates a mediasoup Consumer for the given mediasoup Producer.
   *
   * @async
   */
  async _createConsumer({
    consumerPeer,
    producerPeer,
    producer,
  }: {
    consumerPeer: SocketObjectExist;
    producerPeer: SocketObjectExist;
    producer: Producer;
  }) {
    // Optimization:
    // - Create the server-side Consumer in paused mode.
    // - Tell its Peer about it and wait for its response.
    // - Upon receipt of the response, resume the server-side Consumer.
    // - If video, this will mean a single key frame requested by the
    //   server-side Consumer (when resuming it).
    // - If audio (or video), it will avoid that RTP packets are received by the
    //   remote endpoint *before* the Consumer is locally created in the endpoint
    //   (and before the local SDP O/A procedure ends). If that happens (RTP
    //   packets are received before the SDP O/A is done) the PeerConnection may
    //   fail to associate the RTP stream.

    // NOTE: Don't create the Consumer if the remote Peer cannot consume it.
    if (
      !consumerPeer.data.rtpCapabilities ||
      !this._mediasoupRouter.canConsume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.data.rtpCapabilities,
      })
    ) {
      return;
    }

    const consumerxD = this._peers.get(consumerPeer.decoded.id);

    if (!consumerxD) throw new Error("consumerxD not found");

    // Must take the Transport the remote Peer is using for consuming.
    const transport = Array.from(consumerxD.transports.values()).find(
      (t) => t.appData.consuming
    );

    // This should not happen.
    if (!transport) {
      logger.warn("_createConsumer() | Transport for consuming not found");

      return;
    }

    // Create the Consumer in paused mode.

    try {
      const consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.data.rtpCapabilities,
        paused: true,
      });
      // Store the Consumer into the protoo consumerPeer data Object.
      consumerPeer.data.consumers.set(consumer.id, consumer);

      // Set Consumer events.
      consumer.on("transportclose", () => {
        // Remove from its map.
        consumerPeer.data.consumers.delete(consumer.id);
      });

      consumer.on("producerclose", () => {
        // Remove from its map.
        consumerPeer.data.consumers.delete(consumer.id);

        consumerPeer.emit("consumerClosed", { consumerId: consumer.id });
      });

      consumer.on("producerpause", () => {
        consumerPeer.emit("consumerPaused", { consumerId: consumer.id });
      });

      consumer.on("producerresume", () => {
        consumerPeer.emit("consumerResumed", { consumerId: consumer.id });
      });

      consumer.on("score", (score) => {
        // logger.debug(
        // 	'consumer "score" event [consumerId:%s, score:%o]',
        // 	consumer.id, score);

        consumerPeer.emit("consumerScore", { consumerId: consumer.id, score });
      });

      consumer.on("layerschange", (layers) => {
        consumerPeer.emit("consumerLayersChanged", {
          consumerId: consumer.id,
          spatialLayer: layers ? layers.spatialLayer : null,
          temporalLayer: layers ? layers.temporalLayer : null,
        });
      });

      // NOTE: For testing.
      // await consumer.enableTraceEvent([ 'rtp', 'keyframe', 'nack', 'pli', 'fir' ]);
      // await consumer.enableTraceEvent([ 'pli', 'fir' ]);
      // await consumer.enableTraceEvent([ 'keyframe' ]);

      consumer.on("trace", (trace) => {
        logger.debug(
          'consumer "trace" event [producerId:%s, trace.type:%s, trace:%o]',
          consumer.id,
          trace.type,
          trace
        );
      });

      // Send a protoo request to the remote Peer with Consumer parameters.
      try {
        await consumerPeer.emit("newConsumer", {
          socketId: producerPeer.id,
          producerId: producer.id,
          id: consumer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          type: consumer.type,
          appData: producer.appData,
          producerPaused: consumer.producerPaused,
        });

        // Now that we got the positive response from the remote endpoint, resume
        // the Consumer so the remote endpoint will receive the a first RTP packet
        // of this new stream once its PeerConnection is already ready to process
        // and associate it.
        await consumer.resume();

        consumerPeer.emit("consumerScore", {
          consumerId: consumer.id,
          score: consumer.score,
        });
      } catch (error) {
        logger.warn("_createConsumer() | failed:%o", error);
      }
    } catch (error) {
      logger.warn("_createConsumer() | transport.consume():%o", error);

      return;
    }
  }
}
