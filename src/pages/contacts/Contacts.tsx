import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Select,
  MenuItem,
  TableCell,
  Container,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { getComparator, stableSort } from '../../components/Sorting';
import { Spinner } from '../../components/Spinner';
import { fetchData } from '../../components/FetchData';
import { ContactUrl } from '../../services/ApiUrls';
import {
  CustomToolbar,
  FabLeft,
  FabRight,
} from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { DeleteModal } from '../../components/DeleteModal';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiUpload } from '@react-icons/all-files/fi/FiUpload';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
}

/*const headCells: readonly HeadCell[] = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },

  {
    id: 'primary_email',
    numeric: true,
    disablePadding: false,
    label: 'Email Address',
  },
  {
    id: 'mobile_number',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
];*/

export default function Contacts() {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const canDelete = permissions.includes("Delete any contact") || permissions.includes("Delete own contacts");

  const baseHeadCells: HeadCell[] = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'primary_email',
    numeric: true,
    disablePadding: false,
    label: 'Email Address',
  },
  {
    id: 'mobile_number',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  },
];

const headCells: HeadCell[] = canDelete
  ? [
      ...baseHeadCells,
      {
        id: '',
        numeric: true,
        disablePadding: false,
        label: 'Action',
      },
    ]
  : baseHeadCells;

  const navigate = useNavigate();
  // const context = useMyContext();

  // const [value, setValue] = useState('Open');
  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [contactList, setContactList] = useState([]);
  const [countries, setCountries] = useState([]);

  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selected, _setSelected] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [isSelectedId, _setIsSelectedId] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('first_name');

  const [selectOpen, setSelectOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    getContacts();
  }, [currentPage, recordsPerPage]);

  const getContacts = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    try {
      const offset = (currentPage - 1) * recordsPerPage;
      await fetchData(
        `${ContactUrl}/?offset=${offset}&limit=${recordsPerPage}`,
        'GET',
        null as any,
        Header
      )
        // fetchData(`${ContactUrl}/`, 'GET', null as any, Header)
        .then((data) => {
          if (!data.error) {
            setContactList(data.contact_obj_list);
            setCountries(data?.countries);
            setTotalPages(Math.ceil(data?.contacts_count / recordsPerPage));
            setLoading(false);
          }
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const DeleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    fetchData(`${ContactUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        // console.log('delete:', res);
        if (!res.error) {
          deleteRowModalClose();
          getContacts();
        }
      })
      .catch(() => {});
  };

  const handlePreviousPage = () => {
    setLoading(true);
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setLoading(true);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLoading(true);
    setRecordsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const onAddContact = () => {
    if (!loading) {
      navigate('/app/contacts/add-contacts', { state: { countries } });
    }
  };

  const contactHandle = (contactId: any) => {
    navigate('/app/contacts/contact-details', {
      state: { contactId, detail: true, countries },
    });
  };

  const deleteRow = (deleteId: any) => {
    setDeleteRowModal(true);
    setSelectedId(deleteId);
  };
  const deleteRowModalClose = () => {
    setDeleteRowModal(false);
    setSelectedId('');
  };
  const modalDialog = 'Are You Sure you want to delete this contact?';
  const modalTitle = 'Delete Contact';

  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ];
const [previewRes, setPreviewRes] = useState<any>(null);
const [confirmResult, setConfirmResult] = useState<any>(null);
const [isPreviewing, setIsPreviewing] = useState(false);
const [isConfirming, setIsConfirming] = useState(false);
const fileInputRef = React.useRef<HTMLInputElement>(null);
function handleImportClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
  event.preventDefault();
  fileInputRef.current?.click();
}

async function handlePreviewUpload(file: File) {
  console.log("Preview upload triggered with file:", file);
  const formData = new FormData();
  formData.append('file', file);
  setIsPreviewing(true);

  const token = localStorage.getItem('accessToken'); 

  if (!token) {
    console.error('No token found in localStorage. User may not be logged in.');
    setIsPreviewing(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/contacts/import/preview/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Preview response:", data);
    setPreviewRes(data);
  } catch (error) {
    console.error('Preview upload failed:', error);
  } finally {
    setIsPreviewing(false);
  }
}
async function handleConfirmImport(importId: string) {
  setIsConfirming(true);

  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('No token found in localStorage.');
    setIsConfirming(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/contacts/import/confirm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ import_id: importId }),
    });

    // const data = await response.json();
    // setConfirmResult(data);
    
    if (response.ok ) {
      
      alert('Import confirmed successfully!');
    } else {
      const data = await response.json();
      alert('Error: ' + (data.detail || 'Unable to upload contacts'));
    }
  } catch (error) {
    console.error('Import confirmation failed:', error);
    alert('An unexpected error occurred.');
  } finally {
    setIsConfirming(false);
  }
}



  
  return (
    <Box
      sx={{
        mt: '60px',
        // , width: '1376px'
      }}
    >
      <CustomToolbar sx={{ flexDirection: 'row-reverse' }}>
        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={recordsPerPage}
            // onChange={(e: any) => setRecordsPerPage(e.target.value)}
            onChange={(e: any) => handleRecordsPerPage(e)}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            className={'custom-select'}
            onClick={() => setSelectOpen(!selectOpen)}
            IconComponent={() => (
              <div
                onClick={() => setSelectOpen(!selectOpen)}
                className="custom-select-icon"
              >
                {selectOpen ? (
                  <FiChevronUp style={{ marginTop: '12px' }} />
                ) : (
                  <FiChevronDown style={{ marginTop: '12px' }} />
                )}
              </div>
            )}
            sx={{ '& .MuiSelect-select': { overflow: 'visible !important' } }}
          >
            {recordsList?.length &&
              recordsList.map((item: any, i: any) => (
                <MenuItem key={i} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
          </Select>
          <Box
            sx={{
              borderRadius: '7px',
              backgroundColor: 'white',
              height: '40px',
              minHeight: '40px',
              maxHeight: '40px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              mr: 1,
              p: '0px',
            }}
          >
            <FabLeft onClick={handlePreviousPage} disabled={currentPage === 1}>
              <FiChevronLeft style={{ height: '15px' }} />
            </FabLeft>
            <Typography
              sx={{
                mt: 0,
                textTransform: 'lowercase',
                fontSize: '15px',
                color: '#1A3353',
                textAlign: 'center',
              }}
            >
              {currentPage} to {totalPages}
              {/* {renderPageNumbers()} */}
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>

          {permissions.includes("Create new contacts") &&(
            <Button
              variant="contained"
              startIcon={<FiPlus className="plus-icon" />}
              onClick={onAddContact}
              className={'add-button'}
            >
              Add Contact
            </Button>
            <Button
            variant="outlined"
            startIcon={<FiUpload />}
            onClick={handleImportClick}
            style={{ marginLeft: '10px' }}
          >
            Import CSV
          </Button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePreviewUpload(file);
            }}
           />
          )}

        </Stack>
      </CustomToolbar>

      <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
        <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
          <Paper
            sx={{ width: 'cal(100%-15px)', mb: 2, p: '0px 15px 15px 15px' }}
          >
            <TableContainer>
              <Table>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  numSelectedId={selectedId}
                  isSelectedId={isSelectedId}
                  headCells={headCells}
                />
                <TableBody>
                  {contactList?.length
                    ? stableSort(contactList, getComparator(order, orderBy))
                      .map((item: any, index: any) => {
                        return (
                          <TableRow
                            tabIndex={-1}
                            key={index}
                            sx={{
                              border: 0,
                              '&:nth-of-type(even)': {
                                backgroundColor: 'whitesmoke',
                              },
                              color: 'rgb(26, 51, 83)',
                              textTransform: 'capitalize',
                            }}
                          >
                            <TableCell
                              className="tableCell-link"
                              onClick={() => contactHandle(item)}
                            >
                              {item.first_name + ' ' + item.last_name}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item.primary_email}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item.mobile_number
                                ? item.mobile_number
                                : '---'}
                            </TableCell>
                            {canDelete && (
                              <TableCell className="tableCell">
                                <FaTrashAlt
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => deleteRow(item.id)}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    : ''}
                </TableBody>
              </Table>
            </TableContainer>
            {loading && (
              <Spinner />
            )}
            {previewRes && (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6">Import Preview</Typography>
      {/* Show preview results here, e.g., number of rows, errors, etc. */}
      <pre style={{ maxHeight: 200, overflowY: 'auto' }}>
        {JSON.stringify(previewRes, null, 2)}
      </pre>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="contained"
          disabled={isConfirming}
          onClick={() => handleConfirmImport(previewRes.import_id)}
        >
          {isConfirming ? 'Importing...' : 'Confirm Import'}
        </Button>
      <Button
        variant="outlined"
        onClick={() => setPreviewRes(null)}
        disabled={isConfirming}
      >
        Cancel
      </Button>
    </Stack>
  </Paper>
)}

          </Paper>
        </Box>
      </Container>
      {
        <DeleteModal
          onClose={deleteRowModalClose}
          open={deleteRowModal}
          id={selectedId}
          modalDialog={modalDialog}
          modalTitle={modalTitle}
          DeleteItem={DeleteItem}
        />
      }
    </Box>
  );
}


