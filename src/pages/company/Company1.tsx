import React, { useEffect, useState } from 'react';
import { Box, Card, Container, List, ListItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import { OrgUrl } from '../../services/ApiUrls';
// import '../../styles/company.css'
import { StyledListItemButton, StyledListItemText } from '../../styles/CssStyled';

interface Item {
    org: {
        id: any;
        name: any;
    };
}

export default function Organization() {
  const [organization, setOrganization] = useState<Item[]>([]);
  const [_newOrganization, setNewOrganization] = useState('');
  const [_loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token')
  };
  const getOrganization = () => {
    fetchData(`${OrgUrl}/`, 'GET', null as any, headers)
      .then((res: any) => {
        // console.log(res, 'org')
        if (res?.profile_org_list) {
          setLoading(false);
          setOrganization(res?.profile_org_list);
          setNewOrganization('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  useEffect(() => {
    if (!localStorage.getItem('Token')) {
      navigate('/login');
    } else {
      getOrganization();
    }
  }, []);

  const selectedOrganization = (id: any) => {
    localStorage.setItem('org', id);
    // navigate('/')
    navigate('/contacts');
  };

  // const addCompany = () => {
  //   const organizationName = { name: newOrganization };
  //   fetchData(`${OrgUrl}/`, 'POST', JSON.stringify(organizationName), headers)
  //     .then(res => {
  //       console.log(res);
  //       if (res.status === 201) {
  //         getOrganization();
  //       }
  //     })
  //     .catch(err => console.error(err));
  // };

  return (
    <Box>
      <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h5'>Organization</Typography>
        <Card>
          <List>
            {
              organization?.length > 0 &&
                            organization.map((item, i) => (
                              <ListItem key={i}>
                                <StyledListItemButton onClick={() => selectedOrganization(item?.org?.id)}>
                                  <StyledListItemText>
                                    {item?.org?.name}
                                  </StyledListItemText>
                                </StyledListItemButton>
                              </ListItem>
                            ))}
          </List>
        </Card>
      </Container>
    </Box>

  );
}