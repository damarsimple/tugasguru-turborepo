import { AppProvider } from "ui";
import { AppBar, Box, Toolbar, Typography, IconButton, Button, Avatar, TextField } from "@mui/material";
import { useUserStore } from "ui/stores/user";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Docs() {
  const { user } = useUserStore()
  const { push } = useRouter();
  const [code, setCode] = useState("")
  return (
    <AppProvider >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TUGASGURU MEET
          </Typography>
          {user ? <Avatar alt={user?.name} src={user?.address} /> : <Button color="inherit">Login</Button>}
        </Toolbar>
      </AppBar>
      <Box>
        <Box sx={{ p: 10, display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Video meetings untuk anak - anak sekolah di Indonesia
          </Typography>
          <Typography variant="body1" component="h2" sx={{ flexGrow: 1 }}>
            membantu koneksi antara siswa dan guru
          </Typography>

          <Button variant="contained" color="primary" sx={{
            height: "3rem",
            my: 2
          }}>
            Buat Meeting Baru
          </Button>
          <Box sx={{
            display: 'flex',
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'center',
            my: 2,
            gap: 2
          }}>

            <TextField
              onChange={(e) => setCode(e.target.value)}
              id="outlined-basic" label="masukkan kode meeting" variant="outlined" />
            <Button variant="contained" color="secondary"
              onClick={() => push(`/meet/${code}`)}
            >
              Gabung
            </Button>
          </Box>
        </Box>
      </Box>
    </AppProvider >
  );
}
