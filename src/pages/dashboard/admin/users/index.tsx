import React, { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Stack,
  Title,
  Table,
  TextInput,
  Pagination,
  ActionIcon,
  Alert,
  Switch,
  Badge,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { PiArrowLeft, PiMagnifyingGlass, PiGearSix } from 'react-icons/pi';
import { IconAlertCircle } from '@tabler/icons-react';
import css from '@/pages/dashboard/everything.module.css';
import { Page } from '@/components/page';
import {
  useCreateAdmins,
  useCreateStudents,
  useEditSpecificProfile,
  useDeleteUser,
  useUnDeleteUser,
  useGetUsers,
  usePostLogoutUser,
} from '@/hooks/api/users';
import { LoadingScreen } from '@/components/loading-screen';
import { UserEditModal } from '@/components/user/UserEditModal';

import { useDebouncedValue } from '@mantine/hooks';

const UserManagement = () => {
  const navigate = useNavigate();
  const { mutate: createAdmins, isPending: createAdminsPending } = useCreateAdmins();
  const { mutate: createStudents, isPending: createStudentsPending } = useCreateStudents();
  const { mutate: editUser, isPending: editUserPending } = useEditSpecificProfile();
  const { mutate: deleteUser, isPending: deleteUserPending } = useDeleteUser();
  const { mutate: unDeleteUser, isPending: unDeleteUserPending } = useUnDeleteUser();
  const { mutate: onLogoutUser, isPending: onLogoutUserPending } = usePostLogoutUser();

  // Admins State
  const [adminPage, setAdminPage] = useState(1);
  const [newAdminUsers, setNewAdminUsers] = useState<any>([]);

  // Students State
  const [studentPage, setStudentPage] = useState(1);
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [newStudentUsers, setNewStudentUsers] = useState<any>([]);

  // Modal State
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserType, setSelectedUserType] = useState<'admin' | 'student'>('student');

  const [studentSearch, setStudentSearch] = useState('');
  const [debouncedStudentSearch] = useDebouncedValue(studentSearch, 300);

  const {
    data: adminsData,
    isLoading: adminsLoading,
    isError: adminsError,
  } = useGetUsers({
    query: { role: 'ADMIN', page: adminPage.toString(), limit: '10' },
  });
  const {
    data: studentsData,
    isLoading: studentsLoading,
    isError: studentsError,
  } = useGetUsers({
    query: {
      role: 'STUDENT',
      page: studentPage.toString(),
      limit: '10',
      deleted: showDeletedUsers.toString(),
      nameOrPhone: debouncedStudentSearch,
    },
  });

  // Reset Page to 1 when search Item changes.
  useEffect(() => {
    setStudentPage(1);
  }, [debouncedStudentSearch]);

  // Validation Functions
  const validateName = (name: any) => name.trim().length >= 3;

  const validatePhoneNumber = (phone: any) => phone.trim().length > 5;

  const validateEmail = (email: any) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // New User Row Handlers
  const addNewUserRow = (type: any) => {
    if (type === 'admin') {
      setNewAdminUsers([...newAdminUsers, { name: '', phoneNumber: '', email: '' }]);
    } else {
      setNewStudentUsers([...newStudentUsers, { name: '', phoneNumber: '', email: '' }]);
    }
  };

  // Update New User Fields
  const updateNewUserField = (type: any, index: number, field: any, value: any) => {
    const updater = type === 'admin' ? setNewAdminUsers : setNewStudentUsers;
    updater((prev: any) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Modal handlers
  const openEditModal = (user: any, type: 'admin' | 'student') => {
    setSelectedUser(user);
    setSelectedUserType(type);
    setEditModalOpened(true);
  };

  const closeEditModal = () => {
    setEditModalOpened(false);
    setSelectedUser(null);
  };

  // Update selected user state after successful API calls
  const updateSelectedUser = (updatedFields: any) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, ...updatedFields });
    }
  };

  // Updating user password
  const handleUpdatePassword = async (userId: string, password: any) => {
    try {
      await editUser({
        variables: { password },
        route: {
          id: userId,
        },
      });
    } catch (error) {
      // Handle error, perhaps show a notification
      console.error('Failed to update password', error);
    }
  };
  // Updating user password
  const handleUpdateArcherEligibility = async (userId: string, currentState: boolean) => {
    try {
      await editUser({
        variables: { archerEligible: !currentState },
        route: {
          id: userId,
        },
      });
      // Update the selected user state to reflect the change
      updateSelectedUser({ archerEligible: !currentState });
    } catch (error) {
      // Handle error, perhaps show a notification
      console.error('Failed to update archer eligibility', error);
    }
  };

  const handleClassRecordingEligibility = async (userId: string, currentState: boolean) => {
    try {
      await editUser({
        variables: { classRecordingEligible: !currentState },
        route: {
          id: userId,
        },
      });
      // Update the selected user state to reflect the change
      updateSelectedUser({ classRecordingEligible: !currentState });
    } catch (error) {
      // Handle error, perhaps show a notification
      console.error('Failed to update video eligibility', error);
    }
  };

  const handleUpdateUserEnabled = async (userId: string, currentUserDeleted: boolean) => {
    try {
      if (currentUserDeleted === false) {
        // User is currently enabled, so disable them
        await new Promise((resolve, reject) => {
          deleteUser(
            {
              route: {
                id: userId,
              },
            },
            {
              onSuccess: () => {
                updateSelectedUser({ deleted: true });
                resolve(true);
              },
              onError: (error) => {
                reject(error);
              },
            }
          );
        });
      } else {
        // User is currently disabled, so enable them
        await new Promise((resolve, reject) => {
          unDeleteUser(
            {
              route: {
                id: userId,
              },
            },
            {
              onSuccess: () => {
                updateSelectedUser({ deleted: false });
                resolve(true);
              },
              onError: (error) => {
                reject(error);
              },
            }
          );
        });
      }
    } catch (error) {
      console.error('Failed to update user enabled status', error);
    }
  };

  // Bulk create admins
  const handleCreateAdmins = (adminUsers = newAdminUsers) => {
    try {
      createAdmins(
        { variables: adminUsers },
        {
          onSuccess: () => {
            setNewAdminUsers([]);
          },
        }
      );
    } catch (error) {
      console.error('Failed to create admin users', error);
    }
  };

  // Bulk create students
  const handleCreateStudents = (studentUsers = newStudentUsers) => {
    try {
      createStudents(
        { variables: studentUsers },
        {
          onSuccess: () => {
            setNewStudentUsers([]);
          },
        }
      );
    } catch (error) {
      console.error('Failed to create student users', error);
    }
  };
  // Render User Table
  const renderUserTable = (users: any, type: any, totalDocs: number, page: number) => {
    const newUsers = type === 'admin' ? newAdminUsers : newStudentUsers;

    //Handle Logout
    const handleLogoutUser = (userId: any) => {
      try {
        onLogoutUser({
          variables: { userId },
        });
      } catch (e) {
        console.error('Failed to Logout User', e);
      }
    };

    return (
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>S.N</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Phone Number</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Logout</Table.Th>
            {type != 'admin' && <Table.Th>Archer Eligible</Table.Th>}
            {type != 'admin' && <Table.Th>Video Eligible</Table.Th>}
            {type != 'admin' && <Table.Th>User Enabled</Table.Th>}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* New User Rows */}
          {newUsers.map((newUser: any, index: number) => (
            <Table.Tr key={`new-${type}-${index}`}>
              <Table.Td>{totalDocs + index + 1}</Table.Td>

              <Table.Td>
                <TextInput
                  placeholder="Name"
                  autoFocus
                  value={newUser.name}
                  onChange={(e) => updateNewUserField(type, index, 'name', e.target.value)}
                  error={newUser.name && !validateName(newUser.name) ? 'Min 3 chars' : null}
                />
              </Table.Td>
              <Table.Td>
                <TextInput
                  placeholder="+977 9812345678"
                  value={newUser.phoneNumber}
                  onChange={(e) => updateNewUserField(type, index, 'phoneNumber', e.target.value)}
                  error={
                    newUser.phoneNumber && !validatePhoneNumber(newUser.phoneNumber)
                      ? 'Min 6 chars'
                      : null
                  }
                />
              </Table.Td>
              <Table.Td>
                <TextInput
                  placeholder="students@gmail.com"
                  value={newUser.email}
                  onChange={(e) => updateNewUserField(type, index, 'email', e.target.value)}
                />
              </Table.Td>
              <Table.Td>
                <Button
                  variant="light"
                  color="green"
                  disabled={
                    !validateName(newUser.name) ||
                    !validatePhoneNumber(newUser.phoneNumber) ||
                    !validateEmail(newUser.email)
                  }
                  onClick={() => {
                    if (type === 'admin') {
                      handleCreateAdmins(newAdminUsers);
                    } else {
                      handleCreateStudents(newStudentUsers);
                    }
                  }}
                >
                  Upload
                </Button>
              </Table.Td>
              <Table.Td colSpan={type === 'admin' ? 1 : 4}>
                <Button
                  variant="light"
                  color="red"
                  onClick={() => {
                    if (type === 'admin') {
                      setNewAdminUsers(newAdminUsers.filter((_: any, i: any) => i !== index));
                    } else {
                      setNewStudentUsers(newStudentUsers.filter((_: any, i: any) => i !== index));
                    }
                  }}
                >
                  Cancle
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
          {users.map((user: any, index: number) => (
            <Table.Tr key={user._id}>
              <Table.Td>{totalDocs - index - (page - 1) * 10}</Table.Td>
              <Table.Td>{user.name}</Table.Td>
              <Table.Td>{user.phoneNumber}</Table.Td>
              <Table.Td>{user.email || 'N/A'}</Table.Td>
              <Table.Td>
                <Button color="red" size="xs" onClick={() => handleLogoutUser(user._id)}>
                  Logout
                </Button>
              </Table.Td>

              {type != 'admin' && (
                <Table.Td>
                  <Badge color={user.archerEligible ? 'green' : 'red'} variant="light">
                    {user.archerEligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                </Table.Td>
              )}
              {type != 'admin' && (
                <Table.Td>
                  <Badge color={user.classRecordingEligible ? 'green' : 'red'} variant="light">
                    {user.classRecordingEligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                </Table.Td>
              )}
              {type != 'admin' && (
                <Table.Td>
                  <Badge color={!user.deleted ? 'green' : 'red'} variant="light">
                    {!user.deleted ? 'Enabled' : 'Disabled'}
                  </Badge>
                </Table.Td>
              )}
              <Table.Td>
                <ActionIcon color="blue" variant="light" onClick={() => openEditModal(user, type)}>
                  <PiGearSix />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  };

  // Loading state

  // Error handling
  if (adminsError || studentsError) {
    return (
      <Page title="Users Management" className={css.root}>
        <Stack>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error Loading Users"
            color="red"
            variant="filled"
          >
            Unable to load user data. Please try again later.
          </Alert>
        </Stack>
      </Page>
    );
  }

  // Ensure data exists before rendering
  // if (!adminsData?.data?.docs) {
  //   return <Page title="Users Management" className={css.root}></Page>;
  // }

  return (
    <Page title="Users Management" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(-1)}>
            <PiArrowLeft size="xl" strokeWidth={10} />
          </Button>
          <Title order={1} mx="sm">
            User Management
          </Title>
        </Group>

        <Stack>
          <Group
            justify="space-between"
            align="center"
            style={{ paddingBottom: '1rem', paddingTop: '1rem' }}
          >
            <Title order={2}>Admins</Title>
            <Group
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outline"
                disabled={createAdminsPending}
                onClick={() => addNewUserRow('admin')}
              >
                Add Admin
              </Button>
            </Group>
          </Group>
          {adminsLoading ? (
            <LoadingScreen />
          ) : !adminsData?.data?.docs ? (
            <Stack>
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="No Data"
                color="yellow"
                variant="filled"
              >
                No user data available.
              </Alert>
            </Stack>
          ) : (
            renderUserTable(adminsData.data.docs, 'admin', adminsData.data.totalDocs, adminPage)
          )}
          <Group justify="center" py="md">
            <Pagination
              value={adminPage}
              onChange={setAdminPage}
              total={adminsData?.data?.totalPages}
              size="sm"
              radius="xs"
            />
          </Group>
        </Stack>

        {/* Students Section */}

        <Stack>
          <Group
            justify="space-between"
            align="center"
            style={{ paddingBottom: '1rem', paddingTop: '1rem' }}
          >
            <Title order={2}>Students</Title>
            <Group
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outline"
                onClick={() => addNewUserRow('student')}
                disabled={createStudentsPending}
              >
                Add Student
              </Button>
              <TextInput
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.currentTarget.value)}
                rightSection={<PiMagnifyingGlass />}
              />
              <Switch
                checked={showDeletedUsers}
                onChange={(event) => setShowDeletedUsers(event.currentTarget.checked)}
                label="Show Deleted Users"
              />
            </Group>
          </Group>

          {studentsLoading ? (
            <LoadingScreen />
          ) : !studentsData?.data?.docs ? (
            <Stack>
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="No Data"
                color="yellow"
                variant="filled"
              >
                No user data available.
              </Alert>
            </Stack>
          ) : (
            renderUserTable(
              studentsData.data.docs,
              'student',
              studentsData.data.totalDocs,
              studentPage
            )
          )}

          <Group justify="center" py="md">
            <Pagination
              value={studentPage}
              onChange={setStudentPage}
              total={studentsData?.data?.totalPages}
              size="sm"
              radius="xs"
            />
          </Group>
        </Stack>
      </Stack>

      {/* User Edit Modal */}
      <UserEditModal
        opened={editModalOpened}
        onClose={closeEditModal}
        user={selectedUser}
        isAdmin={selectedUserType === 'admin'}
        onUpdatePassword={handleUpdatePassword}
        onUpdateArcherEligibility={handleUpdateArcherEligibility}
        onUpdateVideoEligibility={handleClassRecordingEligibility}
        onUpdateUserEnabled={handleUpdateUserEnabled}
      />
    </Page>
  );
};

export default UserManagement;
