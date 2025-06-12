import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
// import { makeStyles } from '@mui/styles'
// import isEmail from 'validator/lib/isEmail'

import "../../styles/style.css";
import { UsersUrl } from "../../services/ApiUrls";
import { fetchData } from "../../components/FetchData";
import { CustomAppBar } from "../../components/CustomAppBar";

import { RequiredTextField } from "../../styles/CssStyled";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp";
import { countries } from "../../components/Countries";

type FormErrors = {
  username?: string[];
  password?: string[];
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
  profile_pic?: string[];
  has_sales_access?: string[];
  has_marketing_access?: string[];
  is_organization_admin?: string[];
};
interface FormData {
  username: string;
  password: string;
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
  profile_pic: string | null;
  has_sales_access: boolean;
  has_marketing_access: boolean;
  is_organization_admin: boolean;
}
export function AddUsers() {
  // const { state } = useLocation();
  const navigate = useNavigate();

  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const [_error, setError] = useState(false);
  const [_msg, setMsg] = useState("");
  // const [responceError, setResponceError] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, _files, type, checked } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null });
    }
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const backbtnHandle = () => {
    navigate("/app/users");
  };
  const handleSubmit = (e: any) => {
    console.log("Payload being submitted:", formData);
    e.preventDefault();
    submitForm();
  };
  const [errors, _setErrors] = useState<FormErrors>({});
  const [profileErrors, setProfileErrors] = useState<FormErrors>({});
  const [userErrors, setUserErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
    role: "ADMIN",
    phone: "",
    alternate_phone: "",
    address_line: "",
    street: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    profile_pic: null,
    has_sales_access: false,
    has_marketing_access: false,
    is_organization_admin: false,
  });

  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0] || null;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setFormData({ ...formData, profile_pic: reader.result as string });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const submitForm = () => {
    const Header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      org: localStorage.getItem("org"),
    };

    const data = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      alternate_phone: formData.alternate_phone,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      profile_pic: formData.profile_pic,
      has_sales_access: formData.has_sales_access,
      has_marketing_access: formData.has_marketing_access,
      is_organization_admin: formData.is_organization_admin,
    };

    fetchData(`${UsersUrl}/`, "POST", JSON.stringify(data), Header)
      .then((res: any) => {
        console.log("Full response:", res); // ✅ Log full response
        if (!res.error) {
          // setResponceError(data.error)
          // navigate('/contacts')profile_errors

          resetForm();
          navigate("/app/users");
        }
        if (res.error) {
          // profile_errors
          // user_errors
          setError(true);
          setMsg(res?.error || "An error occurred while suabmitting the form.");
          setProfileErrors(res?.errors?.profile_errors || {});
          setUserErrors(res?.errors?.user_errors || {});
          _setErrors({
            ...(res?.errors?.user_errors || {}),
            ...(res?.errors?.profile_errors || {}),
          });
        }
      })
      .catch((err) => {
        console.error("Error during fetch:", err);

        let errorMessage = "An error occurred while submitting the form.";

        try {
          const jsonPart = err.message.split(" - ")[1];
          if (jsonPart) {
            const errorObj = JSON.parse(jsonPart);

            const userErrors = errorObj.errors?.user_errors || {};
            const profileErrors = errorObj.errors?.profile_errors || {};

            // Create an array of strings like "field: error message"
            const formatErrors = (
              errors: { [s: string]: unknown } | ArrayLike<unknown>
            ) =>
              Object.entries(errors).flatMap(([field, messages]) =>
                (Array.isArray(messages) ? messages : []).map(
                  (msg) => `${field}: ${msg}`
                )
              );

            const allErrors = [
              ...formatErrors(userErrors),
              ...formatErrors(profileErrors),
            ];

            if (allErrors.length) {
              errorMessage = allErrors.join("\n");
            }
          }
        } catch (parseError) {
          console.error("Failed to parse error message JSON:", parseError);
        }

        setError(true);
        setMsg(errorMessage);
      });
  };
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      role: "ADMIN",
      phone: "",
      alternate_phone: "",
      address_line: "",
      street: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      profile_pic: null,
      has_sales_access: false,
      has_marketing_access: false,
      is_organization_admin: false,
    });
    setProfileErrors({});
    setUserErrors({});
  };
  const onCancel = () => {
    resetForm();
  };
  const module = "Users";
  const crntPage = "Add Users";
  const backBtn = "Back To Users";

  return (
    <Box sx={{ mt: "60px" }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: "120px" }}>
        <form onSubmit={handleSubmit}>
          {_error && _msg && (
            <Box sx={{ color: "red", mb: 2, textAlign: "center" }}>{_msg}</Box>
          )}
          <div style={{ padding: "10px" }}>
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: "98%" }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: "25px" }} />}
                >
                  <Typography className="accordion-header">
                    User Information
                  </Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: "98%", color: "#1A3353", mb: 1 }}
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
                          style={{ width: "70%" }}
                          size="small"
                          error={!!userErrors?.username?.[0]}
                          helperText={userErrors?.username?.[0] || ""}
                        />
                      </div>

                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Password</div>
                        <RequiredTextField
                          required
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          style={{ width: "70%" }}
                          size="small"
                          error={!!userErrors?.password?.[0]}
                          helperText={userErrors?.password?.[0] || ""}
                        />
                      </div>
                    </div>
                    <div className="fieldContainer">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Email</div>
                        <RequiredTextField
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ width: "70%" }}
                          size="small"
                          error={
                            !!profileErrors?.email?.[0] ||
                            !!userErrors?.email?.[0]
                          }
                          helperText={
                            profileErrors?.email?.[0] ||
                            userErrors?.email?.[0] ||
                            ""
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Role</div>
                        <FormControl sx={{ width: "70%" }}>
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
                            className={"select"}
                            onChange={handleChange}
                            error={!!errors?.role?.[0]}
                          >
                            {["ADMIN", "USER"].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {/* <FormHelperText>{errors?.[0] ? errors[0] : ''}</FormHelperText> */}
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Number must start with + followed by country code (e.g. +1, +44, +91)">
                          <RequiredTextField
                            name="phone"
                            id="outlined-error-helper-text"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{ width: "70%" }}
                            size="small"
                            error={
                              !!profileErrors?.phone?.[0] ||
                              !!userErrors?.phone?.[0]
                            }
                            helperText={
                              profileErrors?.phone?.[0] ||
                              userErrors?.phone?.[0] ||
                              ""
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
                            style={{ width: "70%" }}
                            size="small"
                            error={
                              !!profileErrors?.alternate_phone?.[0] ||
                              !!userErrors?.alternate_phone?.[0]
                            }
                            helperText={
                              profileErrors?.alternate_phone?.[0] ||
                              userErrors?.alternate_phone?.[0] ||
                              ""
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Address Details */}
            <div className="leadContainer">
              <Accordion defaultExpanded style={{ width: "98%" }}>
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ fontSize: "25px" }} />}
                >
                  <Typography className="accordion-header">Address</Typography>
                </AccordionSummary>
                <Divider className="divider" />
                <AccordionDetails>
                  <Box
                    sx={{ width: "98%", color: "#1A3353", mb: 1 }}
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
                          style={{ width: "70%" }}
                          size="small"
                          error={
                            !!profileErrors?.address_line?.[0] ||
                            !!userErrors?.address_line?.[0]
                          }
                          helperText={
                            profileErrors?.address_line?.[0] ||
                            userErrors?.address_line?.[0] ||
                            ""
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
                          style={{ width: "70%" }}
                          size="small"
                          error={
                            !!profileErrors?.street?.[0] ||
                            !!userErrors?.street?.[0]
                          }
                          helperText={
                            profileErrors?.street?.[0] ||
                            userErrors?.street?.[0] ||
                            ""
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
                          style={{ width: "70%" }}
                          size="small"
                          error={
                            !!profileErrors?.city?.[0] ||
                            !!userErrors?.city?.[0]
                          }
                          helperText={
                            profileErrors?.city?.[0] ||
                            userErrors?.city?.[0] ||
                            ""
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
                          style={{ width: "70%" }}
                          size="small"
                          error={
                            !!profileErrors?.state?.[0] ||
                            !!userErrors?.state?.[0]
                          }
                          helperText={
                            profileErrors?.state?.[0] ||
                            userErrors?.state?.[0] ||
                            ""
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
                          style={{ width: "70%" }}
                          size="small"
                          error={
                            !!profileErrors?.postcode?.[0] ||
                            !!userErrors?.postcode?.[0]
                          }
                          helperText={
                            profileErrors?.postcode?.[0] ||
                            userErrors?.postcode?.[0] ||
                            ""
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Country</div>
                        <FormControl sx={{ width: "70%" }}>
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
                            className={"select"}
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
                              : ""}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
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
