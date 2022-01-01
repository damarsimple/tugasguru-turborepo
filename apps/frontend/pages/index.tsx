import { useRouter } from 'next/router'
import { Box, Button, Typography } from '@mui/material'
import Navbar from '../components/Navbar'
import Image from "next/image"
import { WhatsappOutlined } from '@mui/icons-material'
import { BrowserView, MobileView } from 'react-device-detect';

export default function Account(): JSX.Element {
  const { push } = useRouter()

  return (
    <Box
      sx={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        height: "100vh",
        width: "100vw",

      }}>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pt: 16,
          width: 300,
          gap: 4,
          pl: 5
        }}
      >
        <BrowserView>
          <Image src="/apple-icon-180x180.png" height={400} width={400} alt="tg-logo" />
        </BrowserView>
        <MobileView>
          <Image src="/apple-icon-180x180.png" height={150} width={150} alt="tg-logo" />
        </MobileView>
        <Typography variant="h3" component="h1" sx={{
          color: "white",
          textAlign: "center",
          fontWeight: "bold"
        }} >
          TUGAS GURU
        </Typography>

        <Typography variant="body1" component="p" sx={{
          textAlign: "center",
          color: "white"
        }}>
          Ujian Online, Quiz, Bimbingan Belajar, Ruang Kelas, Admin Sekolah, Absensi QR Code, PPDB Online, Raport Online, Cek Kelulusan, Akun Orang Tua, Guru Bimbel
        </Typography>

        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: 300
        }}>
          <Button variant="contained" onClick={() => push("login")}>
            MASUK
          </Button>
          <Button color="success" variant="contained" startIcon={<WhatsappOutlined />}
            onClick={() => push("https://wa.me/6282240001974?text=Hai Admin Tugas Guru Mohon bantuannya...")}>
            CHAT ADMIN
          </Button>
        </Box>
        <Typography variant="body1" component="p" sx={{
          textAlign: "center",
          color: "white"
        }}>
          Download Aplikasi kami di Playstore
        </Typography>
        <Box sx={{
          display: "flex",
          gap: 1,
          width: 300
        }}>
          <Image src={"/App Store.svg"} height={50} width={150} alt="app store logo" />
          <Image src={"/Play Store.svg"} height={50} width={150} alt="play store logo" />
        </Box>
      </Box>
    </Box>
  )
}
