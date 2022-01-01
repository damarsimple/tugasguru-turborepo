import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    Button,
    Box,
} from '@mui/material'
import { useState } from 'react'
import Image from 'next/image'
import { useUserStore } from '../stores/user'
import { getImages } from '../helpers/fetchers'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'next/router'

export default function Navbar() {
    const { user, setUser } = useUserStore()
    const { setToken } = useAuthStore()
    const [anchorEl, setAnchorEl] = useState(null)

    const { push } = useRouter()

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        setToken('')
        setUser(null)
        window.location.replace('/')
    }

    return (
        <AppBar
            position="static"
            sx={{
                position: 'fixed',
                top: 0,
            }}>
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <Image src="/android-icon-96x96.png" height={50} width={50} alt="tg-logo" />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    TUGAS GURU
                </Typography>
                {user ? (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit">
                            <Avatar
                                sx={{
                                    height: 50,
                                    width: 50,
                                }}
                                src={getImages(user.coverId)}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}>
                            <MenuItem onClick={() => push('/profiles')}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Box display="flex" gap={2}>
                        <Button sx={{ color: 'white' }} onClick={() => push('/login')}>LOGIN</Button>
                        <Button sx={{ color: 'white' }} onClick={() => push('/register')}>REGISTER</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    )
}
