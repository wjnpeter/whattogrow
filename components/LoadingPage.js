import React from 'react'
import { LinearProgress, Grid, Container } from '@mui/material'

export default function LoadingPage() {
  return <>
    <Grid
      container
      alignItems='center'
      justify="center"
      style={{ minHeight: '100vh' }}>
      <Container maxWidth="xs">
        <LinearProgress />
      </Container>
    </Grid>
  </>
}