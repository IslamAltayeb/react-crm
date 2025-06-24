import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tabs,
  Typography,
  Paper,
  TableCell,
  IconButton,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { getComparator, stableSort } from '../../components/Sorting';
import { DeleteModal } from '../../components/DeleteModal';
import { Spinner } from '../../components/Spinner';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import {
  CustomTab,
  CustomToolbar,
  FabLeft,
  FabRight,
} from '../../styles/CssStyled';

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email Address',
  },
  {
    id: 'phone',
    numeric: true,
    disablePadding: false,
    label: 'Mobile Number',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

type Item = {
  id: string;
};

export default function Users() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Website');
  const [activeUsers, setActiveUsers] = useState<Item[]>([]);
  const [_activeUsersOffset, setActiveUsersOffset] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [_inactiveUsersOffset, setInactiveUsersOffset] = useState(0);
  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selectOpen, setSelectOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);

  const [activeCurrentPage, setActiveCurrentPage] = useState<number>(1);
  const [activeRecordsPerPage, setActiveRecordsPerPage] = useState<number>(10);
  const [activeTotalPages, setActiveTotalPages] = useState<number>(0);
  const [_activeLoading, setActiveLoading] = useState(true);

  const [inactiveCurrentPage, setInactiveCurrentPage] = useState<number>(1);
  const [inactiveRecordsPerPage, setInactiveRecordsPerPage] = useState<number>(10);
  const [inactiveTotalPages, setInactiveTotalPages] = useState<number>(0);
  const [_inactiveLoading, setInactiveLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, [
    activeCurrentPage,
    activeRecordsPerPage,
    inactiveCurrentPage,
    inactiveRecordsPerPage,
  ]);

  const handleChangeTab = (e: SyntheticEvent, val: any) => {
    setTab(val);
  };

  const getUsers = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    try {
      const activeOffset = (activeCurrentPage - 1) * activeRecordsPerPage;
      const inactiveOffset = (inactiveCurrentPage - 1) * inactiveRecordsPerPage;
      await fetchData(
        `${UsersUrl}/?offset=${
          tab === 'active' ? activeOffset : inactiveOffset
        }&limit=${
          tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage
        }`,
        'GET',
        null as any,
        Header
      )
        // fetchData(`${UsersUrl}/`, 'GET', null as any, Header)
        .then((res: any) => {
          if (!res.error) {
            // console.log(res, 'users')
            setActiveUsers(res?.active_users?.active_users);
            setActiveTotalPages(
              Math.ceil(
                res?.active_users?.active_users_count / activeRecordsPerPage
              )
            );
            setActiveUsersOffset(res?.active_users?.offset);
            setInactiveUsers(res?.inactive_users?.inactive_users);
            setInactiveTotalPages(
              Math.ceil(
                res?.inactive_users?.inactive_users_count /
                  inactiveRecordsPerPage
              )
            );
            setInactiveUsersOffset(res?.inactive_users?.offset);
            setLoading(false);
            // setUsersData(
            //   ...usersData, {
            //     active_users: data.active_users.active_users,
            //     active_users_count: data.active_users.active_users_count,
            //     inactive_users_count: data.inactive_users.inactive_users_count,
            //     inactive_users: data.inactive_users.inactive_users,
            //     roles: data.roles,
            //     status: data.status
            //   }
            // )
            // setLoader(false)
            // setactiveOffset(initial ? 0 : activeOffset)
            // setinactiveOffset(initial ? 0 : inactiveOffset)
            // setInitial(false)
          }
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const userDetail = (userId: string) => {
    navigate('/app/users/user-details', { state: { userId, detail: true } });
  };

  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (tab == 'active') {
      setActiveLoading(true);
      setActiveRecordsPerPage(parseInt(event.target.value));
      setActiveCurrentPage(1);
    } else {
      setInactiveLoading(true);
      setInactiveRecordsPerPage(parseInt(event.target.value));
      setInactiveCurrentPage(1);
    }
  };

  const handlePreviousPage = () => {
    if (tab == 'active') {
      setActiveLoading(true);
      setActiveCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    } else {
      setInactiveLoading(true);
      setInactiveCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  const handleNextPage = () => {
    if (tab == 'active') {
      setActiveLoading(true);
      setActiveCurrentPage((prevPage) =>
        Math.min(prevPage + 1, activeTotalPages)
      );
    } else {
      setInactiveLoading(true);
      setInactiveCurrentPage((prevPage) =>
        Math.min(prevPage + 1, inactiveTotalPages)
      );
    }
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onAddUser = () => {
    if (!loading) {
      navigate('/app/users/add-users');
    }
    // navigate('/users/add-users', {
    //   state: {
    //     roles: usersData.roles,
    //     status: usersData.status
    //   }
    // })
  };

  const deleteRow = (id: any) => {
    setSelectedId(id);
    setDeleteRowModal(!deleteRowModal);
  };

  const getUserDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header).then((res) => {
      console.log(res, 'res');
      if (!res.error) {
        const data = res?.data?.profile_obj;
        navigate('/app/users/edit-user', {
          state: {
            value: {
              email: data?.user_details?.email,
              role: data?.role,
              phone: data?.phone,
              alternate_phone: data?.alternate_phone,
              address_line: data?.address?.address_line,
              street: data?.address?.street,
              city: data?.address?.city,
              state: data?.address?.state,
              postcode: data?.address?.postcode,
              country: data?.address?.country,
              profile_pic: data?.user_details?.profile_pic,
              has_sales_access: data?.has_sales_access,
              has_marketing_access: data?.has_marketing_access,
              is_organization_admin: data?.is_organization_admin,
            },
            id: id,
            edit: true,
          },
        });
      }
    });
  };

  const EditItem = (userId: any) => {
    getUserDetail(userId);
  };

  const deleteRowModalClose = () => {
    setDeleteRowModal(false);
    setSelectedId([]);
  };

  const DeleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };
    fetchData(`${UserUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        console.log('delete:', res);
        if (!res.error) {
          deleteRowModalClose();
          getUsers();
        }
      })
      .catch(() => {});
  };

  const handleSelectAllClick = () => {
    if (selected.length === activeUsers.length) {
      setSelected([]);
      setSelectedId([]);
      setIsSelectedId([]);
    } else {
      const newSelectedIds = activeUsers.map((user) => user.id);
      setSelected(newSelectedIds);
      setSelectedId(newSelectedIds);
      setIsSelectedId(newSelectedIds.map(() => true));
    }
  };

  const modalDialog = 'Are You Sure You want to delete this User?';
  const modalTitle = 'Delete User';

  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ];

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomToolbar>
        <Tabs value={tab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
          <CustomTab
            value="active"
            label="Active"
            sx={{
              backgroundColor: tab === 'active' ? '#F0F7FF' : '#284871',
              color: tab === 'active' ? '#3f51b5' : 'white',
            }}
          ></CustomTab>
          <CustomTab
            value="inactive"
            label="In Active"
            sx={{
              backgroundColor: tab === 'inactive' ? '#F0F7FF' : '#284871',
              color: tab === 'inactive' ? '#3f51b5' : 'white',
              ml: '5px',
            }}
          ></CustomTab>
        </Tabs>

        <Stack
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Select
            value={
              tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage
            }
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
            <FabLeft
              onClick={handlePreviousPage}
              disabled={
                tab === 'active'
                  ? activeCurrentPage === 1
                  : inactiveCurrentPage === 1
              }
            >
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
              {tab === 'active'
                ? `${activeCurrentPage} to ${activeTotalPages}`
                : `${inactiveCurrentPage} to ${inactiveTotalPages}`}
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={
                tab === 'active'
                  ? activeCurrentPage === activeTotalPages
                  : inactiveCurrentPage === inactiveTotalPages
              }
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>
          <Button
            variant="contained"
            startIcon={<FiPlus className="plus-icon" />}
            onClick={onAddUser}
            className={'add-button'}
          >
            Add User
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
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={activeUsers?.length}
                  // rowCount={tab === 0 ? usersData.active_users_count : usersData.inactive_users_count}
                  numSelectedId={selectedId}
                  isSelectedId={isSelectedId}
                  headCells={headCells}
                />
                {tab === 'active' ? (
                  <TableBody>
                    {activeUsers?.length > 0 ? (
                      stableSort(
                        activeUsers,
                        getComparator(order, orderBy)
                      ).map((item: any, index: any) => {
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
                              onClick={() => userDetail(item.id)}
                            >
                              {item?.user_details?.email
                                ? item.user_details.email
                                : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <div style={{ display: 'flex' }}>
                                {item?.phone ? item.phone : '---'}
                              </div>
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.role ? item.role : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <IconButton onClick={() => EditItem(item.id)}>
                                <FaEdit
                                  style={{
                                    fill: '#1A3353',
                                    cursor: 'pointer',
                                    width: '18px',
                                  }}
                                />
                                {/* <FaAd
                                                                    onClick={() => EditItemBox(item)}
                                                                    style={{ fill: '#1A3353', cursor: 'pointer' }}
                                                                /> */}
                              </IconButton>
                              <IconButton onClick={() => deleteRow(item?.id)}>
                                <FaTrashAlt
                                  style={{
                                    fill: '#1A3353',
                                    cursor: 'pointer',
                                    width: '15px',
                                  }}
                                />
                                {/* <FaAd onClick={() => deleteItemBox(item)} style={{ fill: '#1A3353', cursor: 'pointer' }} /> */}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ border: 0 }}>
                          <Spinner />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                ) : (
                  <TableBody>
                    {inactiveUsers?.length > 0 ? (
                      stableSort(
                        inactiveUsers,
                        getComparator(order, orderBy)
                      ).map((item: any, index: any) => {
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
                              onClick={() => userDetail(item.id)}
                            >
                              {item?.user_details?.email
                                ? item.user_details.email
                                : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <div style={{ display: 'flex' }}>
                                {item?.phone ? item.phone : '---'}
                              </div>
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.role ? item.role : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <IconButton>
                                <FaEdit
                                  onClick={() => EditItem(item.id)}
                                  style={{
                                    fill: '#1A3353',
                                    cursor: 'pointer',
                                    width: '18px',
                                  }}
                                />
                              </IconButton>
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
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ border: 0 }}>
                          <Spinner />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
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
        DeleteItem={DeleteItem}
      />
    </Box>
  );
}
