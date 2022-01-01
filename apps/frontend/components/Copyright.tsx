import {Typography} from '@mui/material'
import Link from 'next/link'

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link href="https://tugasguru.com/">TUGAS GURU</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
