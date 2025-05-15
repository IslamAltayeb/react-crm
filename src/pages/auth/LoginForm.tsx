"use client";

import React from "react";
import TextField from '@mui/material/TextField';
import { Button, Paper, Stack, Typography } from "@mui/material";

export const LoginForm: React.FC<{ toggleForm: () => void }> = ({ toggleForm }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (

    <Paper
      elevation={4}
      sx={{
        width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
        maxWidth: 800,
        mx: "auto",
        mt: 5,
        mb: 5,
        p: 5,
        borderRadius: 4,
      }}
    >
      <Stack spacing={5} sx={{ pt: 25, pb: 5 }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" fontWeight="bold" gutterBottom justifyContent={"center"}> Sign-in </Typography>

        <TextField id="email-id" label="Email" variant="outlined" value={email} onChange={(event: any) => setEmail(event.target.value)} />
        <TextField id="password-id" label="Password" type="password" variant="outlined" value={password} onChange={(event: any) => setPassword(event.target.value)} />

        <Button variant="contained">Login</Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Button onClick={toggleForm} >Signup Here</Button>
        </Typography>
      </Stack>

    </Paper>
  );
};
