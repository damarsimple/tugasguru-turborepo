import { AppProvider } from "ui";
import { AppBar, Box, Toolbar, Typography, IconButton, Button, Avatar, TextField, Modal } from "@mui/material";
import { useUserStore } from "ui/stores/user";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import { Model } from "ts-types";

export default function Docs() {
  const { user } = useUserStore()
  const { push } = useRouter();
  const [code, setCode] = useState("")

  const [open, setOpen] = useState(false)

  const [name, setName] = useState("");
  const [handleMutation] = useMutation<{
    createMeeting: Model["Meeting"];
  }>(gql`
  mutation Mutation($name: String!, $classroomId: Int) {
  createMeeting(name: $name, classroomId: $classroomId) {
    id
    }
  }
`)

  const handleCreate = () => {
    if (!name) {
      toast.error("Please enter a name")
      return;
    }

    handleMutation({
      variables: {
        name
      }
    }).then(({ data: { createMeeting } }) => {
      push(`/meet/${createMeeting.id}`)
    }).catch(err => {
      toast.error(err.message)
    })

  }

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}>
          <Typography id="parent-modal-title" variant="h5" component="h2" >Detail Meeting</Typography>
          <TextField label="Nama Meeting" required fullWidth onChange={
            (e) => setName(e.target.value)
          } />
          <Button fullWidth onClick={handleCreate}>Buat</Button>
        </Box>
      </Modal>
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
          }}
            onClick={handleOpen}
          >
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
    </>
  );
}
