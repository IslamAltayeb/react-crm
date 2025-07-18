import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  MenuItem,
  Tooltip,
  Divider,
  Select,
  FormControl,
  FormHelperText,
  Avatar,
  Input,
} from '@mui/material';
import { UserUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { CustomAppBar } from '../../components/CustomAppBar';
import { RequiredTextField } from '../../styles/CssStyled';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import '../../styles/style.css';
import { countries } from '../../components/Countries';

type FormErrors = {
  username?: string[];
  email?: string[];
  role?: string[];
  phone?: string[];
  alternate_phone?: string[];
  address_line?: string[];
  street?: string[];
  city?: string[];
  state?: string[];
  postcode?: string[];
  country?: string[];
};

interface FormData {
  username: string;
  email: string;
  role: string;
  phone: string;
  alternate_phone: string;
  address_line: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  profile_pic: File | null;
}

interface Role {
  id: number;
  name: string;
}

export function EditUser() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [reset, setReset] = useState(false);
  const [_error, setError] = useState(false);
  const [errors, _setErrors] = useState<FormErrors>({});
  const [profileErrors, setProfileErrors] = useState<FormErrors>({});
  const [userErrors, setUserErrors] = useState<FormErrors>({});
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    role: '',
    phone: '',
    alternate_phone: '',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    profile_pic: null,
  });

  useEffect(() => {
    if (state?.value) {
      setFormData(state?.value);

      const profilePic = state?.value?.profile_pic;
      if (profilePic) {
        setPreviewUrl(`http://localhost:8000${profilePic}`);
      }
    }
  }, [state?.id]);

  useEffect(() => {
    if (reset) {
      setFormData(state?.value);
    }
    return () => {
      setReset(false);
    };
  }, [reset]);

  // Fetch roles
  const getRoles = async () => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org') || "",
    };

    try {
      const res = await fetch("http://localhost:8000/api/roles/", {
        method: 'GET',
        headers: headers,
      });

      if (!res.ok) {
        alert('HTTP error! status: ${res.status}');
      }

      const data = await res.json();
      setRoles(data);
    } catch (error) {
      alert('An error occurred please try again');
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    getRoles(); //
  }, []);

  const handleChange = (e: any) => {
    const { name, value, _files, type, checked } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null });
    }
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const backbtnHandle = () => {
    if (state?.edit) {
      navigate('/app/users');
    } else {
      navigate('/app/users/user-details', {
        state: { userId: state?.id, detail: true },
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    submitForm();
  };

  const submitForm = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };

    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('role', formData.role || '');
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('alternate_phone', formData.alternate_phone);
    formDataToSend.append('address_line', formData.address_line);
    formDataToSend.append('street', formData.street);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('postcode', formData.postcode);
    formDataToSend.append('username', 'UserName');
    formDataToSend.append('name', 'Name');
    formDataToSend.append('country', 'NL');
    if (formData.profile_pic) {
      formDataToSend.append('profile_pic', formData.profile_pic);
    }

    fetchData(`${UserUrl}/${state?.id}/`, 'PUT', formDataToSend, Header)
      .then((res: any) => {
        if (!res.error) {
          resetForm();
          navigate('/app/users');
        }
        if (res.error) {
          setError(true);
          setProfileErrors(
            res?.errors?.profile_errors || res?.profile_errors[0]
          );
          setUserErrors(res?.errors?.user_errors || res?.user_errors[0]);
        }
      })
      .catch(() => { });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: '',
      phone: '',
      alternate_phone: '',
      address_line: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      profile_pic: null,
    });
    setProfileErrors({});
    setUserErrors({});
  };

  const onCancel = () => {
    setReset(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_pic: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const module = 'Users';
  const crntPage = 'Edit User';
  const backBtn = state?.edit ? 'Back To Users' : 'Back To UserDetails';

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
                    User Information
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
                        <div className="fieldTitle">Username</div>
                        <RequiredTextField
                          required
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={!!userErrors?.username?.[0]}
                          helperText={userErrors?.username?.[0] || ''}
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Email</div>
                        <RequiredTextField
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.email?.[0] ||
                            !!userErrors?.email?.[0]
                          }
                          helperText={
                            profileErrors?.email?.[0] ||
                            userErrors?.email?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Number must start with + followed by country code (e.g. +1, +44, +91)">
                          <RequiredTextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{ width: '70%' }}
                            size="small"
                            error={
                              !!profileErrors?.phone?.[0] ||
                              !!userErrors?.phone?.[0]
                            }
                            helperText={
                              profileErrors?.phone?.[0] ||
                              userErrors?.phone?.[0] ||
                              ''
                            }
                          />
                        </Tooltip>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Alternate Phone</div>
                        <Tooltip title="Number must start with + followed by country code (e.g. +1, +44, +91)">
                          <TextField
                            name="alternate_phone"
                            value={formData.alternate_phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size="small"
                            error={
                              !!profileErrors?.alternate_phone?.[0] ||
                              !!userErrors?.alternate_phone?.[0]
                            }
                            helperText={
                              profileErrors?.alternate_phone?.[0] ||
                              userErrors?.alternate_phone?.[0] ||
                              ''
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Role</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="role"
                            value={formData.role}
                            open={roleSelectOpen}
                            onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setRoleSelectOpen(!roleSelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {roleSelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.role?.[0]}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.id} value={role.name}>
                                {role.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {/* <FormHelperText>{errors?.[0] ? errors[0] : ''}</FormHelperText> */}
                        </FormControl>
                      </div>
                      <div className="fieldSubContainer">
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>

            {/* Address Details */}
            <div className="leadContainer">
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
                        <div className="fieldTitle">Address Lane</div>
                        <TextField
                          required
                          name="address_line"
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.address_line?.[0] ||
                            !!userErrors?.address_line?.[0]
                          }
                          helperText={
                            profileErrors?.address_line?.[0] ||
                            userErrors?.address_line?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                        <TextField
                          required
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.street?.[0] ||
                            !!userErrors?.street?.[0]
                          }
                          helperText={
                            profileErrors?.street?.[0] ||
                            userErrors?.street?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">City</div>
                        <TextField
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.city?.[0] ||
                            !!userErrors?.city?.[0]
                          }
                          helperText={
                            profileErrors?.city?.[0] ||
                            userErrors?.city?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                        <TextField
                          required
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.state?.[0] ||
                            !!userErrors?.state?.[0]
                          }
                          helperText={
                            profileErrors?.state?.[0] ||
                            userErrors?.state?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Postcode</div>
                        <TextField
                          required
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.postcode?.[0] ||
                            !!userErrors?.postcode?.[0]
                          }
                          helperText={
                            profileErrors?.postcode?.[0] ||
                            userErrors?.postcode?.[0] ||
                            ''
                          }
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
                            className={'select'}
                            onChange={handleChange}
                            error={!!profileErrors?.country?.[0]}
                          >
                            {countries.map(([code, name]) => (
                              <MenuItem key={code} value={code}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {profileErrors?.country?.[0]
                              ? profileErrors?.country?.[0]
                              : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>

            {/* Avatar */}
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                >
                  <Typography className="accordion-header">Avatar</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                    component="form"
                    noValidate
                    autoComplete="off"
                  >
                    <Typography variant="h6">Profile pic</Typography>
                    <Avatar
                      alt={'User Profile'}
                      src={previewUrl ?? undefined}
                      sx={{ width: 180, height: 180, mb: 2, ml:75 }}
                      onClick={handleAvatarClick}
                    />
                    <Input
                      type="file"
                      inputRef={fileInputRef}
                      inputProps={{accept: 'image/*'}}
                      onChange={handleFileChange}
                      sx={{ display: 'none' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>

          </div>
        </form>
      </Box>
    </Box>
  );
}
