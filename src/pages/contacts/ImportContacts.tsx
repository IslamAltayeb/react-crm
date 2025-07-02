import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';

const ImportContacts: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setMessage(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting file:', file);
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await fetch('http://localhost:8000/api/contacts/import/preview', {
        method: 'POST',
        body: formData,
        credentials: 'include' // if cookies/auth are needed
      });
      console.log('Response status:', response.status);

      const data = await response.json();

      if (response.ok) {
        setMessage(`Imported ${data.imported} contacts. Failed: ${data.failed_count}`);
        console.log('Import preview:', data);
      } else {
        setError('Import failed. Please check the CSV file format.');
        console.error(data);
      }
    } catch (err) {
      setError('An error occurred during import.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: 4, maxWidth: 600, margin: '40px auto' }}>
      <Typography variant="h5" gutterBottom>
        Import Contacts from CSV
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <InputLabel>Select CSV File</InputLabel>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ marginBottom: '16px' }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Import'}
        </Button>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default ImportContacts;
