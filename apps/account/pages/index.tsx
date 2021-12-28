import { AppProvider } from "ui";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography, Grid, CssBaseline, Paper, Box, Avatar, TextField, FormControlLabel, Checkbox, Button } from "@mui/material";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "ui/stores/auth";
import { Model } from "ts-types";
import { toast } from "react-toastify";

function Copyright(props: any) {

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link href="https://mui.com/">
        Tugas Guru
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function Account() {
  const { token, setToken } = useAuthStore()
  const [handle, { loading }] = useMutation<Model["AuthPayload"]>(gql`
  mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    status
    message
    token
    refreshToken
  }
}`);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    handle({
      variables: {
        username: data.get('username'),
        password: data.get('password'),
      }
    }).then(({ data }) => {
      if (data.status) {
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    })
  };

  return (
    <AppProvider>
      <Grid container component="main" sx={{ height: '100vh' }}>
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
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                sx={{ mt: 3, mb: 2 }}

                disabled={loading}
              >
                masuk
              </Button>
              <Grid container>
                <Grid item xs={12}>
                  <Link href="/forgot">
                    Lupa Password?
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Link href="/register">
                    {"Belum memiliki akun ? Daftar"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </AppProvider>
  );
}
