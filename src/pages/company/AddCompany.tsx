import React, { useState } from 'react';
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CompaniesUrl } from '../../services/ApiUrls';
import { CustomAppBar } from '../../components/CustomAppBar';
import { fetchData } from '../../components/FetchData';
import { RequiredTextField } from '../../styles/CssStyled';
import '../../styles/style.css';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';

type FormErrors = {
    name?: string[];
};

function AddCompany() {
  const navigate = useNavigate();
  // const { state } = useLocation();
  const [_error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    submitForm();
  };

  const submitForm = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org')
    };

    const data = { name: formData.name };
    fetchData(`${CompaniesUrl}`, 'POST', JSON.stringify(data), Header)
      .then((res: any) => {
        if (!res.error) {
          resetForm();
          navigate('/app/companies');
        }
        if (res.error) {
          setError(true);
        }
      })
      .catch(() => {
      });
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setErrors({});
  };
  const backbtnHandle = () => {
    navigate('/app/companies');
  };
  const module = 'Companies';
  const crntPage = 'Add Company';
  const backBtn = 'Back To Companies';

  const onCancel = () => {
    resetForm();
  };

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
      <Box sx={{ mt: '120px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className='leadContainer'>
              <Accordion style={{ width: '98%' }}
                defaultExpanded
              >
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Company Information</Typography>
                </AccordionSummary>
                <Divider className='divider' />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353',mb:1 }}
                    component='form'
                    // noValidate
                    autoComplete='off'
                  >
                    <div className='fieldContainer'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Name</div>
                        <RequiredTextField
                          type="text"
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              submitForm();
                            }
                          }}
                          size='small'
                          helperText={errors?.name?.[0] ? errors?.name[0] : ''}
                          error={!!errors?.name?.[0]}
                        />
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button type="submit" variant="contained">
                Save
              </Button>
          </Box>
          </div>
        </form>
      </Box>

    </Box>
  );
}

export default AddCompany;
