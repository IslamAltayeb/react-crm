import React, { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export const ActivateUser: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const { uid, token } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/activate-user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        alert('Password reset successfully!');
        navigate('/login');
      } else {
        const data = await response.json();
        alert('Error: ' + (data.detail || 'Unable to reset password'));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Something went wrong. Try again.');
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
      }}
    >
      <Stack spacing={4} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Reset Password
        </Typography>

        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button variant="contained" type="submit">
          Change Password
        </Button>
      </Stack>
    </Paper>
  );
};

export default ActivateUser;