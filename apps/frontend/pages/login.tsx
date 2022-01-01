import {useMutation, gql} from '@apollo/client'
import {
  Typography,
  Grid,
  CssBaseline,
  Paper,
  Box,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material'
import Link from 'next/link'
import {toast} from 'react-toastify'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {Copyright} from '@mui/icons-material'
import {useAuthStore} from '../stores/auth'
import {useUserStore} from '../stores/user'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {Model} from 'ts-types'

export default function LoginPage() {
  const {setToken} = useAuthStore()
  const {user, setUser} = useUserStore()
  const {push} = useRouter()

  useEffect(() => {
    if (user) {
      console.log(user)
      push(user.roles.toLowerCase())
    }
  }, [user])

  const [handle, {loading}] = useMutation<{login: Model['AuthPayload']}>(gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        status
        message
        token
        refreshToken
        user {
          id
          email
          username
          name
          balance
          phone
          address
          coverId
          roles
          updatedAt
          createdAt
        }
      }
    }
  `)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    handle({
      variables: {
        username: data.get('username'),
        password: data.get('password'),
      },
    }).then(({data: {login}}) => {
      if (login.status) {
        setToken(login.token)
        setUser(login.user)
        push('/')
      } else {
        toast.error(login.message)
      }
    })
  }

  return (
    <Grid container component="main" sx={{height: '100vh'}}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email / Nomor Telepon / Username"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Ingat Saya"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
              disabled={loading}>
              masuk
            </Button>
            <Grid container>
              <Grid item xs={12}>
                <Link href="/forgot">Lupa Password?</Link>
              </Grid>
              <Grid item xs={12}>
                <Link href="/register">{'Belum memiliki akun ? Daftar'}</Link>
              </Grid>
            </Grid>
            <Copyright sx={{mt: 5}} /> TUGAS GURU
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
