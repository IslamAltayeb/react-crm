import {
  Box,
  Button,
  Stack,
  Typography,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  Paper,
  TableBody,
  IconButton,
  Container,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import {
  CustomToolbar,
  FabLeft,
  FabRight,
} from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import { getComparator, stableSort } from '../../components/Sorting';
import { FaTrashAlt } from 'react-icons/fa';
import { CasesUrl } from '../../services/ApiUrls';
import { DeleteModal } from '../../components/DeleteModal';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { Priority } from '../../components/Priority';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
}
const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'account',
    numeric: false,
    disablePadding: false,
    label: 'Account',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'priority',
    numeric: false,
    disablePadding: false,
    label: 'Priority',
  },
  {
    id: 'created_on',
    numeric: false,
    disablePadding: false,
    label: 'Created On',
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
];

// type Item = {
//   id: string;
// };

export default function Cases(_props: any) {
  const navigate = useNavigate();
  // const [tab, setTab] = useState('Active');
  const [loading, setLoading] = useState(true);

  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [page, setPage] = useState(0);

  const [cases, setCases] = useState([]);
  // const [openCases, setOpenCases] = useState([]);
  // const [openCasesCount, setOpenCasesCount] = useState(0);
  // const [closedCases, setClosedCases] = useState([]);
  // const [closedCasesCount, setClosedCasesCount] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [typeOfCases, setTypeOfCases] = useState([]);
  const [account, setAccount] = useState([]);

  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selectOpen, setSelectOpen] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const [selected, _setSelected] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [isSelectedId, _setIsSelectedId] = useState<boolean[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    getCases();
  }, [currentPage, recordsPerPage]);

  const getCases = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    try {
      const offset = (currentPage - 1) * recordsPerPage;
      await fetchData(
        `${CasesUrl}/?offset=${offset}&limit=${recordsPerPage}`,
        'GET',
        null as any,
        Header
      )
        .then((res) => {
          if (!res.error) {
            setCases(res?.cases);
            setTotalPages(Math.ceil(res?.cases_count / recordsPerPage));
            setStatus(res?.status);
            setPriority(res?.priority);
            setTypeOfCases(res?.type_of_case);
            setContacts(res?.contacts_list);
            setAccount(res?.accounts_list);
            setLoading(false);
          }
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleChangeTab = (e: SyntheticEvent, val: any) => {
  //   setTab(val);
  // };

  const onAddCases = () => {
    if (!loading) {
      navigate('/app/cases/add-case', {
        state: {
          detail: false,
          contacts: contacts || [],
          priority: priority || [],
          typeOfCases: typeOfCases || [],
          account: account || [],
          status: status || [],
        },
      });
    }
  };
  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // type SelectedItem = string[];

  // const isSelected = (name: string, selected: SelectedItem): boolean => {
  //   return selected.indexOf(name) !== -1;
  // };

  const caseDetail = (caseId: any) => {
    // console.log(contacts,priority,typeOfCases,account,'list');

    navigate('/app/cases/case-details', {
      state: {
        caseId,
        detail: true,
        contacts: contacts || [],
        priority: priority || [],
        typeOfCases: typeOfCases || [],
        account: account || [],
        status: status || [],
      },
    });
  };

  const deleteRow = (id: any) => {
    setSelectedId(id);
    setDeleteRowModal(!deleteRowModal);
  };
  const deleteRowModalClose = () => {
    setDeleteRowModal(false);
    setSelectedId([]);
  };

  const deleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    fetchData(`${CasesUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        console.log('delete:', res);
        if (!res.error) {
          deleteRowModalClose();
          getCases();
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

  // const handleRowSelect = (casesId: string) => {
  //   const selectedIndex = selected.indexOf(casesId);
  //   let newSelected: string[] = [...selected];
  //   let newSelectedIds: string[] = [...selectedId];
  //   let newIsSelectedId: boolean[] = [...isSelectedId];

  //   if (selectedIndex === -1) {
  //     newSelected.push(casesId);
  //     newSelectedIds.push(casesId);
  //     newIsSelectedId.push(true);
  //   } else {
  //     newSelected.splice(selectedIndex, 1);
  //     newSelectedIds.splice(selectedIndex, 1);
  //     newIsSelectedId.splice(selectedIndex, 1);
  //   }

  //   setSelected(newSelected);
  //   setSelectedId(newSelectedIds);
  //   setIsSelectedId(newIsSelectedId);
  // };
  const modalDialog = 'Are You Sure You want to delete selected Cases?';
  const modalTitle = 'Delete Cases';

  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ];
  // const tag = [
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'leading',
  //   'account',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  //   'account',
  //   'leading',
  // ];
  return (
    <Box sx={{ mt: '60px' }}>
      <CustomToolbar sx={{ flexDirection: 'row-reverse' }}>

        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={recordsPerPage}
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
            sx={{
              '& .MuiSelect-select': { overflow: 'visible !important' },
            }}
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
          <Button
            variant="contained"
            startIcon={<FiPlus className="plus-icon" />}
            onClick={onAddCases}
            className={'add-button'}
          >
            Add Cases
          </Button>
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
                  rowCount={cases?.length}
                  numSelectedId={selectedId}
                  isSelectedId={isSelectedId}
                  headCells={headCells}
                />
                <TableBody>
                  {cases?.length > 0 ? (
                    stableSort(cases, getComparator(order, orderBy)).map(
                      (item: any, index: any) => {
                        // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => {
                        // const labelId = `enhanced-table-checkbox-${index}`;
                        // const rowIndex = selectedId.indexOf(item.id);
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
                              onClick={() => caseDetail(item.id)}
                            >
                              {item?.name ? item?.name : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.account ? item?.account?.name : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.status ? item?.status : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.priority ? (
                                <Priority priorityData={item?.priority} />
                              ) : (
                                '---'
                              )}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.created_on_arrow
                                ? item?.created_on_arrow
                                : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <IconButton>
                                <FaTrashAlt
                                  onClick={() => deleteRow(item?.id)}
                                  style={{
                                    fill: '#1A3353',
                                    cursor: 'pointer',
                                    width: '15px',
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )
                  ) : loading ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ border: 0 }}>
                        <Spinner />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ border: 0, textAlign: 'center' }}
                      >
                        No cases found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
      <DeleteModal
        onClose={deleteRowModalClose}
        open={deleteRowModal}
        id={selectedId}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={deleteItem}
      />
    </Box>
  );
}
