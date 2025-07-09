import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  FormControl,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  Chip,
  Autocomplete,
  FormHelperText,
  IconButton,
  Tooltip,
  Divider,
  Select,
  Button,
  Alert, 
  Snackbar
} from '@mui/material';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import '../../styles/style.css';
import { LeadUrl } from '../../services/ApiUrls';
import { fetchData, Header } from '../../components/FetchData';
import { CustomAppBar } from '../../components/CustomAppBar';
import {
  FaCheckCircle,
  FaPercent,
  FaPlus,
  FaTimes,
  FaTimesCircle,
  FaUpload,
} from 'react-icons/fa';
import {
  CustomPopupIcon,
  RequiredTextField,
} from '../../styles/CssStyled';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';

type FormErrors = {
  title?: string[];
  first_name?: string[];
  last_name?: string[];
  account_name?: string[];
  phone?: string[];
  email?: string[];
  lead_attachment?: string[];
  opportunity_amount?: string[];
  website?: string[];
  description?: string[];
  teams?: string[];
  assigned_to?: string[];
  contacts?: string[];
  status?: string[];
  source?: string[];
  address_line?: string[];
  street?: string[];
  city?: string[];
  state?: string[];
  postcode?: string[];
  country?: string[];
  tags?: string[];
  company?: string[];
  probability?: number[];
  industry?: string[];
  skype_ID?: string[];
  file?: string[];
};
interface FormData {
  title: string;
  first_name: string;
  last_name: string;
  account_name: string;
  phone: string;
  email: string;
  lead_attachment: string | null;
  opportunity_amount: string;
  website: string;
  description: string;
  teams: string;
  assigned_to: string[];
  contacts: string[];
  status: string;
  source: string;
  address_line: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  tags: string[];
  company: string;
  probability: number;
  industry: string;
  skype_ID: string;
  file: string | null;
}

export function AddLeads() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { quill, quillRef } = useQuill();
  const initialContentRef = useRef(null);

  const autocompleteRef = useRef<any>(null);
  const [error, setError] = useState(false);


  // const autocompleteRef = useRef<any>(null);
  //const [_error, setError] = useState(false);

  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  // const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
  const [sourceSelectOpen, setSourceSelectOpen] = useState(false);
  const [statusSelectOpen, setStatusSelectOpen] = useState(false);
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [industrySelectOpen, setIndustrySelectOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    first_name: '',
    last_name: '',
    account_name: '',
    phone: '',
    email: '',
    lead_attachment: null,
    opportunity_amount: '',
    website: '',
    description: '',
    teams: '',
    assigned_to: [],
    contacts: [],
    status: 'assigned',
    source: 'call',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    tags: [],
    company: '',
    probability: 1,
    industry: 'ADVERTISING',
    skype_ID: '',
    file: null,
  });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setFormData((prev) => ({
          ...prev,
          description: quill.root.innerHTML,
        }));
      });
    }
  }, [quill]);

  const handleChange2 = (title: any, val: any) => {
    
    if (title === 'contacts') {
      setFormData({
        ...formData,
        contacts: val.length > 0 ? val.map((item: any) => item.id) : [],
      });
      setSelectedContacts(val);
    } else if (title === 'assigned_to') {
      setFormData({
        ...formData,
        assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [],
      });
      setSelectedAssignTo(val);
    } else if (title === 'tags') {
      setFormData({
        ...formData,
        assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [],
      });
      setSelectedTags(val);
    }
    
    else {
      setFormData({ ...formData, [title]: val });
    }
  };


  const handleChange = (e: any) => {    
    const { name, value, files, type, checked, id } = e.target;

  /*const handleChange = (e: any) => {
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // console.log('e.target',e)
    const { name, value, _files, type, checked, _id } = e.target;
    // console.log('auto', val)*/

    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, file: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors: FormErrors = {};
  if (!formData.first_name) newErrors.first_name = ['First name is required.'];
  if (!formData.last_name) newErrors.last_name = ['Last name is required.'];
  if (!formData.title) newErrors.title = ['Job title is required.'];

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setSnackbar({ open: true, message: 'Please fill all required fields.', severity: 'error' });
    return;
  }

  submitForm();
};

 const submitForm = () => {
  const formDataToSend = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formDataToSend.append(key, v));
    } else if (value !== null && value !== undefined) {
      formDataToSend.append(key, value as string);
    }
  });

  fetch('http://localhost:8000/api/leads/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      org: localStorage.getItem("org") || '', // optional: add org from localStorage
    },
    body: formDataToSend,
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.error) {
        setSnackbar({
          open: true,
          message: 'Lead created successfully.',
          severity: 'success',
        });

        setTimeout(() => {
          //window.location.reload();
          navigate('/app/leads');
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: 'There was an error saving the lead.',
          severity: 'error',
        });
        setErrors(res.errors || {});
      }
    })
    .catch(() => {
      setSnackbar({
        open: true,
        message: 'Unexpected error occurred.',
        severity: 'error',
      });
    });
};
  console.log("Posting to:", `${LeadUrl}/`);

  const resetForm = () => {
  setFormData({
    title: '',
    first_name: '',
    last_name: '',
    account_name: '',
    phone: '',
    email: '',
    lead_attachment: null,
    opportunity_amount: '',
    website: '',
    description: '',
    teams: '',
    assigned_to: [],
    contacts: [],
    status: 'assigned',
    source: 'call',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    tags: [],
    company: '',
    probability: 1,
    industry: 'ADVERTISING',
    skype_ID: '',
    file: null,
  });
  setErrors({});
};

  const onCancel = () => {
    resetForm();
  };

  const backbtnHandle = () => {
    navigate('/app/leads');
  };

  const module = 'Leads';
  const crntPage = 'Add Leads';
  const backBtn = 'Back To Leads';

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: '120px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Lead Information
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Lead Name</div>
                        <TextField
                          name="account_name"
                          value={formData.account_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.account_name?.[0]
                              ? errors?.account_name[0]
                              : ''
                          }
                          error={!!errors?.account_name?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Amount</div>
                        <TextField
                          type={'number'}
                          name="opportunity_amount"
                          value={formData.opportunity_amount}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.opportunity_amount?.[0]
                              ? errors?.opportunity_amount[0]
                              : ''
                          }
                          error={!!errors?.opportunity_amount?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Website</div>
                        <TextField
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.website?.[0] ? errors?.website[0] : ''
                          }
                          error={!!errors?.website?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Contact Name</div>
                        <FormControl
                          error={!!errors?.contacts?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            multiple
                            value={selectedContacts}
                            limitTags={2}
                            options={state?.contacts || []}
                            getOptionLabel={(option: any) =>
                              state?.contacts ? option?.first_name : option
                            }
                            onChange={(e: any, value: any) =>
                              handleChange2('contacts', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value: any, getTagProps: any) =>
                              value.map((option: any, index: any) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px',
                                  }}
                                  variant="outlined"
                                  label={
                                    state?.contacts
                                      ? option?.first_name
                                      : option
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                placeholder="Add Contacts"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' },
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.contacts?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Assign To</div>
                        <FormControl
                          error={!!errors?.assigned_to?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            multiple
                            value={selectedAssignTo}
                            limitTags={2}
                            options={state?.users || []}
                            getOptionLabel={(option: any) =>
                              state?.users ? option?.user__email : option
                            }
                            onChange={(e: any, value: any) =>
                              handleChange2('assigned_to', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px',
                                  }}
                                  variant="outlined"
                                  label={
                                    state?.users ? option?.user__email : option
                                  }
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Add Users"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' },
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.assigned_to?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Industry</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="industry"
                            value={formData.industry}
                            open={industrySelectOpen}
                            onClick={() =>
                              setIndustrySelectOpen(!industrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setIndustrySelectOpen(!industrySelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {industrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.industry?.[0]}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px',
                                },
                              },
                            }}
                          >
                            {state?.industries?.length
                              ? state?.industries.map((option: any) => (
                                <MenuItem key={option[0]} value={option[1]}>
                                  {option[1]}
                                </MenuItem>
                              ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.industry?.[0] ? errors?.industry[0] : ''}
                          </FormHelperText>
                        </FormControl>
                       
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Status</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="status"
                            value={formData.status}
                            open={statusSelectOpen}
                            onClick={() =>
                              setStatusSelectOpen(!statusSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setStatusSelectOpen(!statusSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {statusSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.status?.[0]}
                          >
                            {state?.status?.length
                              ? state?.status.map((option: any) => (
                                <MenuItem key={option[0]} value={option[1]}>
                                  {option[1]}
                                </MenuItem>
                              ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.status?.[0] ? errors?.status[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">SkypeID</div>
                        <TextField
                          name="skype_ID"
                          value={formData.skype_ID}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.skype_ID?.[0] ? errors?.skype_ID[0] : ''
                          }
                          error={!!errors?.skype_ID?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Lead Source</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="source"
                            value={formData.source}
                            open={sourceSelectOpen}
                            onClick={() =>
                              setSourceSelectOpen(!sourceSelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setSourceSelectOpen(!sourceSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {sourceSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.source?.[0]}
                          >
                            {state?.source?.length
                              ? state?.source.map((option: any) => (
                                <MenuItem key={option[0]} value={option[0]}>
                                  {option[1]}
                                </MenuItem>
                              ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.source?.[0] ? errors?.source[0] : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Lead Attachment</div>
                        <TextField
                          name="lead_attachment"
                          value={formData.lead_attachment}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disableFocusRipple
                                  disableTouchRipple
                                  sx={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'whitesmoke',
                                    borderRadius: '0px',
                                    mr: '-13px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <label htmlFor="icon-button-file">
                                    <input
                                      hidden
                                      accept="image/*"
                                      id="icon-button-file"
                                      type="file"
                                      name="account_attachment"
                                      onChange={(e: any) => {
                                        //  handleChange(e);
                                        handleFileChange(e);
                                      }}
                                    />
                                    <FaUpload
                                      color="primary"
                                      style={{
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  </label>
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.lead_attachment?.[0]
                              ? errors?.lead_attachment[0]
                              : ''
                          }
                          error={!!errors?.lead_attachment?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Tags</div>
                        <FormControl
                          error={!!errors?.tags?.[0]}
                          sx={{ width: '70%' }}
                        >
                          <Autocomplete
                            value={selectedTags}
                            multiple
                            limitTags={5}
                            options={state?.tags || []}
                            getOptionLabel={(option: any) => option}
                            onChange={(e: any, value: any) =>
                              handleChange2('tags', value)
                            }
                            size="small"
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={
                                    <FaTimes style={{ width: '9px' }} />
                                  }
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px',
                                  }}
                                  variant="outlined"
                                  label={option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={
                              <CustomPopupIcon>
                                <FaPlus className="input-plus-icon" />
                              </CustomPopupIcon>
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Add Tags"
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': {
                                      '&:hover': { backgroundColor: 'white' },
                                    },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.tags?.[0] || ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Probability</div>
                        <TextField
                          name="probability"
                          value={formData.probability}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  disableFocusRipple
                                  disableTouchRipple
                                  sx={{
                                    backgroundColor: '#d3d3d34a',
                                    width: '45px',
                                    borderRadius: '0px',
                                    mr: '-12px',
                                  }}
                                >
                                  <FaPercent style={{ width: '12px' }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.probability?.[0]
                              ? errors?.probability[0]
                              : ''
                          }
                          error={!!errors?.probability?.[0]}
                        />
                      </div>
                    </div>
                    
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Contact</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">First Name</div>
                        <RequiredTextField
                          name="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={Boolean(errors.first_name)}
                          helperText={errors.first_name?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Last Name</div>
                        <RequiredTextField
                          name="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={Boolean(errors.last_name)}
                          helperText={errors.last_name?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Job Title</div>
                        <RequiredTextField
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={Boolean(errors.title)}
                          helperText={errors.title?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Number must start with + followed by country code (e.g. +1, +44, +91)">
                          <TextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size="small"
                            helperText={
                              errors?.phone?.[0] ? errors?.phone[0] : ''
                            }
                            error={!!errors?.phone?.[0]}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div
                      className="fieldSubContainer"
                      style={{ marginLeft: '5%', marginTop: '19px' }}
                    >
                      <div className="fieldTitle">Email Address</div>                      
                      <TextField
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '70%' }}
                        size="small"
                        helperText={errors?.email?.[0] ? errors?.email[0] : ''}
                        error={!!errors?.email?.[0]}
                      />
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Address</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div
                          className="fieldTitle"
                        >
                          Address Lane
                        </div>
                        <TextField
                          name="address_line"
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.address_line?.[0]
                              ? errors?.address_line[0]
                              : ''
                          }
                          error={!!errors?.address_line?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">City</div>
                        <TextField
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={errors?.city?.[0] ? errors?.city[0] : ''}
                          error={!!errors?.city?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                        <TextField
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.street?.[0] ? errors?.street[0] : ''
                          }
                          error={!!errors?.street?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                        <TextField
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.state?.[0] ? errors?.state[0] : ''
                          }
                          error={!!errors?.state?.[0]}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Postcode</div>
                        <TextField
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          helperText={
                            errors?.postcode?.[0] ? errors?.postcode[0] : ''
                          }
                          error={!!errors?.postcode?.[0]}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Country</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="country"
                            value={formData.country}
                            open={countrySelectOpen}
                            onClick={() =>
                              setCountrySelectOpen(!countrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setCountrySelectOpen(!countrySelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {countrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px',
                                },
                              },
                            }}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.country?.[0]}
                          >
                            {state?.countries?.length
                              ? state?.countries.map((option: any) => (
                                <MenuItem key={option[0]} value={option[0]}>
                                  {option[1]}
                                </MenuItem>
                              ))
                              : ''}
                          </Select>
                          <FormHelperText>
                            {errors?.country?.[0] ? errors?.country[0] : ''}
                          </FormHelperText>
                        </FormControl>
                        
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">
                    Description
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '100%', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <div className="DescriptionDetail">
                      <div className="descriptionTitle">Description</div>
                      <div style={{ width: '100%', marginBottom: '3%' }}>
                        <div ref={quillRef} />
                      </div>
                    </div>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 1.5,
                      }}
                    >
                      {/*<Button
                        className="header-button"
                        // onClick={resetQuillToInitialState}
                        onClick={onCancel}
                        size="small"
                        variant="contained"
                        startIcon={
                          <FaTimesCircle
                            style={{
                              fill: 'white',
                              width: '16px',
                              marginLeft: '2px',
                            }}
                          />
                        }
                        sx={{
                          backgroundColor: '#2b5075',
                          ':hover': { backgroundColor: '#1e3750' },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="header-button"
                        type="submit"
                        variant="contained"
                        size="small"
                        startIcon={<FaCheckCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                        sx={{ ml: 1 }}
>
                        Save
                      </Button>*/}
                      <Snackbar
                  open={snackbar.open}
                  autoHideDuration={6000}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  >
                  <Alert
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  severity={snackbar.severity as any}
                  sx={{ width: '100%' }}
                  >
                  {snackbar.message}
                  </Alert>
            </Snackbar>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>  
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button type="submit" variant="contained">
                Save
              </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
