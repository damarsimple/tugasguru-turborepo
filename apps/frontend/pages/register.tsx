/* eslint-disable @next/next/no-img-element */
import { Typography, Button, Container, Paper, Stepper, Step, StepLabel, Box, TextField, TextFieldProps, Grid, Autocomplete, Checkbox, FormControlLabel, FormGroup, Modal } from '@mui/material'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Enum, Model } from 'ts-types'
import { getTranslation } from '../helpers/translation'
import Copyright from "../components/Copyright";
import Joi from "joi";
import { gql, useMutation, useQuery } from '@apollo/client'
import { toast } from 'react-toastify'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { useRouter } from 'next/router'


export default function Register() {

  const [provinceId, setProvinceId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);

  const { data: { provinces } = {}, loading: lprovince } = useQuery<{ provinces: Model["Province"][] }>(gql`
  query Provinces {
  provinces {
    id
    name
    updatedAt
    createdAt
    cities {
      id
      name
      updatedAt
      createdAt
    }
  }
}
  `)


  const { data: { cities } = {}, loading: lcity } = useQuery<{ cities: Model["City"][] }>(gql`
   query Cities($provinceId: Int) {
    cities(provinceId: $provinceId) {
      id
      name
    }
  }
  `, {
    variables: {
      provinceId
    }
  })

  const { data: { schools } = {}, loading: lschool } = useQuery<{ schools: Model["School"][] }>(gql`
query Schools($provinceId: Int, $cityId: Int) {
  schools(provinceId: $provinceId, cityId: $cityId) {
    id
    name
  }
}
  `, {
    variables: {
      provinceId,
      cityId
    }
  })



  const validRoles: Enum['Roles'][] = ['TEACHER', 'STUDENT', 'PARENT', 'GENERAL']

  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .min(8),
    phone: Joi.string()
      .pattern(new RegExp('^(\\+62|62|0)8[1-9][0-9]{6,9}$')),
    repeat_password: Joi.ref('password'),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    // roles: Joi.array().items(Joi.string().valid(...validRoles)),
    name: Joi.string().required(),

    provinceId: Joi.string().required(),
    cityId: Joi.string().required(),
    address: Joi.string().required(),

    // teacher and student

    schoolId: Joi.number(),


    //student
    classtypeId: Joi.number(),
    nisn: Joi.number(),

    //teacher
    identityNumber: Joi.string(),
  })


  const [activeStep, setActiveStep] = useState(0);
  const [biodataValidated, setBiodataValidated] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<Enum['Roles'] | null>(null)
  const [isbimbel, setIsbimbel] = useState(false)
  const [isSchoolTeacher, setIsSchoolTeacher] = useState(true)

  const [schoolId, setSchoolId] = useState<number | null>(null)
  const [identity, setIdentity] = useState("")
  const [nisn, setNisn] = useState("")

  const [identityFile, setIdentityFile] = useState<File | null>(null)

  const handleNext = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      handleOpen();
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const check = () => {

    if (activeStep === 0 && selectedRoles) {

      return true


    }


    if (activeStep === 1 && biodataValidated) {

      return true

    }

    if (activeStep === 2) {

      if (selectedRoles == "TEACHER") {

        if (isSchoolTeacher && !schoolId)
          return false

        if (isbimbel && !identity && !identityFile)
          return false

        return true

      }

      if (selectedRoles == "STUDENT" && schoolId) {

        return true

      }

      if (selectedRoles == "PARENT" && nisn) {

        return true

      }

      if (selectedRoles == "GENERAL") {

        return true

      }

    }




    return false
  }

  const [handleRegisterValidation] = useMutation<{
    registerValidation
    : Model["AuthPayload"]
  }>(gql`
  mutation RegisterValidation($username: String!, $phone: String!, $email: String!, $provinceId: Int!, $cityId: Int!) {
  registerValidation(username: $username, phone: $phone, email: $email, provinceId: $provinceId, cityId: $cityId) {
    status
    message
  }
}
  `)


  const [biodata, setBiodata] = useState<Record<string, number | string>>({})

  const handleValidateBiodata = async (formData: FormData) => {
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });


    const { error } = await schema.validate(data)

    if (error) {
      console.log(data)
      toast.error(error.message)
      return
    }



    data["provinceId"] = provinces.find(p => p.name === data["provinceId"])?.id
    data["cityId"] = cities.find(p => p.name === data["cityId"])?.id



    if (!data["provinceId"] || !data["cityId"]) {

      toast.error("Provinsi atau kota tidak sesuai")

      return;

    }

    setProvinceId(data["provinceId"])
    setCityId(data["cityId"])

    const { data: { registerValidation } } = await handleRegisterValidation({
      variables: data
    })

    if (!registerValidation.status) {
      toast.error(registerValidation.message)
    } else {
      toast.success("Data Tervalidasi")
      setBiodataValidated(true)
      setBiodata(data)
    }

  }


  const [handleSubmitData] = useMutation<{ register: Model["AuthPayload"] }>(gql`
  mutation Register($username: String!, $password: String!, $phone: String!, $email: String!, $address: String!, $roles: Roles!, $name: String!, $provinceId: Int!, $cityId: Int!, $schoolId: Int, $classtypeId: Int, $identityNumber: String, $nisn: String, $identityFile: Upload) {
  register(username: $username, password: $password, phone: $phone, email: $email, address: $address, roles: $roles, name: $name, provinceId: $provinceId, cityId: $cityId, schoolId: $schoolId, classtypeId: $classtypeId, identityNumber: $identityNumber, nisn: $nisn, identityFile: $identityFile) {
    status
    message
    token
    user {
      id
      email
      roles
      username
      name
      balance
    }
  }
}
  `)

  const { setToken } = useAuthStore()
  const { user, setUser } = useUserStore()
  const { push } = useRouter()


  useEffect(() => {
    if (user) {
      console.log(user)
      push(user.roles.toLowerCase())
    }
  }, [user])

  const handleSubmit = () => {
    handleSubmitData({
      variables: {
        ...biodata,
        roles: selectedRoles,
        provinceId,
        cityId,
        schoolId,
        identityNumber: identity,
        nisn: nisn,
        identityFile
      }
    }).then(({ data: { register } }) => {

      if (register.status) {
        handleClose();
        toast.success("Berhasil mendaftarkan akun");
        setToken(register.token)
        setUser(register.user)

      } else {
        toast.error(register.message)
      }

    })
  }

  const steps = ['Pilih Tipe Akun', 'Isi Biodata', getTranslation(selectedRoles)]

  const getStepContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom sx={{
              textAlign: "center"
            }}>
              Pilih Tipe Akun
            </Typography>
            <Box display="flex" gap={3}>
              {validRoles.map((role) => (
                <Button
                  variant="contained"
                  color={selectedRoles == role ? "success" : "primary"}
                  key={role} onClick={() => setSelectedRoles(selectedRoles == role ? null : role)}>
                  {getTranslation(role)}
                </Button>
              ))}

            </Box>
          </>
        )
      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom sx={{
              textAlign: "center"
            }}>
              Biodata
            </Typography>
            <Grid container spacing={2} component="form" onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              handleValidateBiodata(data)
            }}>
              <Grid item xs={12} >
                <TextField name="name" label="Nama" variant="standard" fullWidth />
              </Grid>
              {([
                {
                  name: "username",
                  label: "Username",
                  required: true,
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                },
                {
                  name: "password",
                  label: "Password",
                  required: true,
                },
                {
                  name: "repeat_password",
                  label: "Ulangi Password",
                  required: true,
                },
                {
                  name: "phone",
                  label: "Nomor Telepon",
                  required: true,
                },
                {
                  name: "address",
                  label: "Alamat",
                  required: true,
                }
              ] as TextFieldProps[]).map((e, i) => {
                return (
                  <Grid item xs={12} sm={6} key={i}>
                    <TextField  {...e} variant="standard" fullWidth />
                  </Grid>
                )

              })}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  options={provinces?.map(e => ({
                    id: e.id,
                    label: e.name
                  })) ?? []}
                  disabled={lprovince}

                  onChange={(e, v) => {
                    //@ts-ignore
                    setProvinceId(v.id)
                  }}
                  renderInput={(params) => <TextField {...params} name="provinceId" label="Provinsi" variant="standard" required />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal

                  options={cities?.map(e => ({
                    id: e.id,
                    label: e.name
                  })) ?? []}
                  disabled={lcity}
                  renderInput={(params) => <TextField {...params} name="cityId" label="Kota" variant="standard" required />}
                />
              </Grid>

              <Grid item xs={12}>
                <Button fullWidth type="submit"> Validasi data</Button>
              </Grid>
            </Grid>
          </>
        )
      case 2:

        switch (selectedRoles) {
          case "TEACHER":
            return (
              <>
                <Typography variant="h6" gutterBottom sx={{
                  textAlign: "center"
                }}>
                  Guru
                </Typography>
                <Grid container spacing={2} component="form" onSubmit={(e) => {
                  e.preventDefault();

                  try {
                    if (isSchoolTeacher && !schoolId)
                      throw "anda belum memilih sekolah"
                    if (isbimbel && !identity && !identityFile)
                      throw "anda belum memasukkan nomor ktp atau mengupload ktp"
                  } catch (error) {
                    toast.error(error)
                  } finally {
                    toast.success("Data Tervalidasi")
                  }


                }}>
                  <Grid item xs={12} >
                    <FormGroup>
                      <FormControlLabel control={<Checkbox defaultChecked value={isSchoolTeacher} onChange={(e) => setIsSchoolTeacher(e.target.checked)} />} label="Daftar sebagai guru sekolah" />
                    </FormGroup>
                    {isSchoolTeacher && <Autocomplete
                      disablePortal
                      options={schools?.map(e => ({
                        id: e.id,
                        label: e.name
                      })) ?? []}
                      disabled={lschool}
                      onChange={(e, v) => {
                        //@ts-ignore
                        setSchoolId(v.id)
                      }}
                      renderInput={(params) => <TextField {...params} name="schoolId" label="Sekolah" variant="standard" required />}
                    />}
                  </Grid>

                  <Grid item xs={12} sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3
                  }}>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value={isbimbel} onChange={(e) => setIsbimbel(e.target.checked)} />} label="Daftar sebagai guru bimbel" />
                    </FormGroup>
                    {isbimbel && <>
                      <TextField name="identityNumber" label="Nomor KTP" variant="standard" fullWidth required />
                      {identityFile && <img src={URL.createObjectURL(identityFile)} alt="FILE KTP"
                        style={{
                          height: 300,
                          width: "100%"
                        }} />}
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                      >
                        Upload {identityFile ? "Ulang" : ""} KTP
                        <input
                          accept='image/*'
                          type="file"
                          hidden
                          name="identityFile"
                          onChange={(e) => {
                            setIdentityFile(e.target.files[0]);
                          }}
                        />
                      </Button>
                    </>}


                  </Grid>


                  <Grid item xs={12}>

                    <Button fullWidth type="submit"> Validasi data</Button>
                  </Grid>
                </Grid>
              </>
            )
          default:
            return <>Invalid Roles</>
        }


      default:
        return <>Invalid Step</>
    }
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Modal
        open={open}
        onClose={handleClose}
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
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Validasi Terakhir
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            anda yakin data anda sudah benar ?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
            <Button color="error" onClick={handleClose}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              Yakin
            </Button>
          </Box>
        </Box>
      </Modal>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center">
          Pendaftaran Akun
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Terimakasih telah mendaftar
              </Typography>
              <Typography variant="subtitle1">
                Anda sedang di pindahkan ke halaman utama ....
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} sx={{ mt: 3, ml: 1 }} disabled={!check()}>
                  {activeStep === steps.length - 1 ? 'Selesai' : 'Selanjutnya'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </React.Fragment>
      </Paper>
      <Copyright />
    </Container>
  )
}

