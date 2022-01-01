import {Typography, Button, Container, Paper, Stepper, Step, StepLabel, Box} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import {useState} from 'react'
import {Enum} from 'ts-types'
import {getTranslation} from '../helpers/translation'
import Copyright from "../components/Copyright";

function getStepContent(step: number) {
  switch (step) {
    case 0:
    // return <AddressForm />;
    case 1:
    // return <PaymentForm />;
    case 2:
    // return <Review />;
    default:
      throw new Error('Unknown step')
  }
}

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedRoles, setSelectedRoles] = useState<Enum['Roles'] | null>(null)

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

    const check = () => {

        if (activeStep === 0 && selectedRoles) {
            
            return true
            

        }



        return false
    }
    

  const steps = ['Pilih Tipe Akun', 'Isi Biodata', getTranslation(selectedRoles)]

  const getStepContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Pilih Tipe Akun
            </Typography>
                <Box display="flex" gap={3}>
            {['TEACHER', 'STUDENT', 'PARENT', 'GENERAL'].map((role) => (
                <Button
                    variant="contained"
                    color={ selectedRoles == role ? "success" : "primary"}
                    key={role} onClick={() => setSelectedRoles(selectedRoles == role ? null :  role as Enum['Roles'])}>
                {getTranslation(role)}
              </Button>
            ))}
                    
            </Box>
          </>
        )
    case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Biodata
            </Typography>
                <Box display="flex" gap={3}>
                    
            </Box>
          </>
        )
      default:
        return <>Invalid Step</>
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{mb: 4}}>
      <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
        <Typography component="h1" variant="h4" align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
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
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order confirmation, and will
                send you an update when your order has shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                    Back
                  </Button>
                )}
                <Button  onClick={handleNext} sx={{ mt: 3, ml: 1 }} disabled={!check()}>
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
