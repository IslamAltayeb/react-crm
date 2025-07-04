import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OrganizationModal from './OrganizationModal';
import '../../styles/style.css';

// interface Item {
//   org: {
//     id: any;
//     name: any;
//   };
// }

export default function Organization() {
  const navigate = useNavigate();

  const [organizationModal, setOrganizationModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    } else {
      setOrganizationModal(true);
    }
  }, []);

  const handleClose = (event: any, reason: any) => {
    if (reason && reason == 'backdropClick') {
      return;
    }
  };

  return (
    <Box>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <OrganizationModal open={organizationModal} handleClose={handleClose} />
      </Container>
    </Box>
  );
}
