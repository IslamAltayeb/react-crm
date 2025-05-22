'use client';

import React from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Button, Paper, Stack, Typography } from '@mui/material';

export const SignupForm: React.FC<{ toggleForm: () => void }> = ({
  toggleForm,
}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/sign-up/',
        {
          username: name,
          email: email,
          password: password,
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert('Account created successfully!');
        toggleForm(); // switch to login form
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response && error.response.data) {
        alert('Error: ' + JSON.stringify(error.response.data));
      } else {
        alert('Signup failed. Please try again later.');
      }
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
        maxWidth: 800,
        mx: 'auto',
        mt: 5,
        mb: 5,
        p: 5,
        borderRadius: 4,
        autoComplete: 'off',
      }}
    >
      <Stack
        spacing={5}
        sx={{ pt: 25, pb: 5 }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create Account
        </Typography>

        <TextField
          id="fullname-id"
          label="Full Name"
          variant="outlined"
          value={name}
          onChange={(event: any) => setName(event.target.value)}
        />
        <TextField
          id="email-id"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event: any) => setEmail(event.target.value)}
        />
        <TextField
          id="password-id"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(event: any) => setPassword(event.target.value)}
        />

        <Button variant="contained" type="submit">
          Create Account
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Button onClick={toggleForm}>Login</Button>
        </Typography>
      </Stack>
    </Paper>
  );
};
