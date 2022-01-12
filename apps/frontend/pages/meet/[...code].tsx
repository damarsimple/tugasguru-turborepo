import { Box, Typography, Button, AppBar, Avatar, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip } from '@mui/material';
import { WithRouterProps } from 'next/dist/client/with-router'
import { withRouter } from 'next/router'
import React, { CSSProperties } from 'react'
import { useState, useEffect, useRef } from "react";
import useWindowDimensions from '../../hooks/useWindowDimensions';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


function Code({ router }: WithRouterProps) {

    const { code } = router.query

    const [started, setStarted] = useState(true);

    const { mediaStream, reset } = useUserMedia({ video: true, audio: true });



    const videoRef = useRef<HTMLVideoElement>(null);


    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handleCanPlay() {
        videoRef.current.play();
    }


    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const { width, height } = useWindowDimensions()



    return (
        !started ? <Box>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{
                        justifyContent: "space-between"
                    }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2 }}
                        >
                            TUGAS GURU
                        </Typography>



                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
                p: 3
            }}>

                <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted
                    style={{
                        height: 300,
                        backgroundColor: "black",
                        width: "100%",
                    }}
                />

                <Box sx={{ display: "flex", gap: 2, flexDirection: "column", textAlign: "center" }}>
                    <Typography variant="h5" component="h1">
                        Siap untuk bergabung ?
                    </Typography>

                    <Typography variant="body1" component="p">
                        {0} peserta di dalam meeting
                    </Typography>

                    <Button variant="contained" onClick={() => setStarted(true)}>Gabung sekarang</Button>
                    <Button onClick={reset} >check video dan suara</Button>
                </Box>
            </Box>
        </Box> :
            <Box >
                {mediaStream && [...new Array(2)].map((_, i) => {
                    return <VideoComponent key={i} mediaStream={mediaStream}
                        style={{
                            height,
                            width
                        }}
                    />
                })}
            </Box>
    )

}

export default withRouter(Code)

interface VideoBoxProps {
    mediaStreams: MediaStream[]
}

export function VideoBox({ }: VideoBoxProps) {

}

interface VideoComponentProps {
    mediaStream: MediaStream
    style?: CSSProperties
}

export function VideoComponent({ mediaStream, style }: VideoComponentProps) {

    // const videoRef = useRef<HTMLVideoElement>(null);

    // useEffect(() => {
    //     videoRef.current.srcObject = mediaStream;

    // }, [])

    return <video autoPlay ref={(video) => {
        if (video && mediaStream) {
            video.srcObject = mediaStream;
            video.play()
        }
    }} style={style} playsInline controls />
}

export function useUserMedia(requestedMedia: MediaStreamConstraints) {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    useEffect(() => {
        async function enableStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(requestedMedia);
                setMediaStream(stream);
            } catch (err) {
                // Removed for brevity
            }
        }

        if (!mediaStream) {
            enableStream();
        } else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }
    }, [mediaStream, requestedMedia]);

    return {
        mediaStream,
        reset: () => setMediaStream(null)
    };
}