import React, { useState } from 'react';
import { Page } from '@/components/page';
import { paths } from '@/routes';
import {
  Button,
  Group,
  Paper,
  Stack,
  Title,
  TextInput,
  PasswordInput,
  Text,
  Alert,
} from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { useEditMyProfile } from '@/hooks/api/users';
import { useSelector } from 'react-redux';
import { useForm } from '@mantine/form';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const { mutate: editMyProfile, isPending } = useEditMyProfile();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const user = useSelector(
    (state: {
      provider: {
        user: any;
      };
    }) => state.provider.user
  );

  const form = useForm({
    initialValues: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phoneNumber: (value) => (value.trim().length > 0 ? null : 'User Id is required'),
      password: (value) => {
        if (value && value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = (values: any) => {
    // Prepare data for submission by only including changed fields
    const submitData: any = {};

    // Check each field and only add to submitData if it has changed
    if (values.name !== user.name) {
      submitData['name'] = values.name;
    }

    if (values.email !== user.email) {
      submitData['email'] = values.email;
    }

    if (values.phoneNumber !== user.phoneNumber) {
      submitData['phoneNumber'] = values.phoneNumber;
    }

    if (values.password) {
      submitData['password'] = values.password;
    }

    // Only submit if there are changes
    if (Object.keys(submitData).length > 0) {
      // Reset error and success states
      setUpdateError(null);
      setUpdateSuccess(false);

      // Call API to update profile
      editMyProfile(
        { variables: submitData },
        {
          onSuccess: () => {
            setUpdateSuccess(true);
            form.reset();
          },
          onError: (error) => {
            setUpdateError(error.message || 'Failed to update profile');
          },
        }
      );
    } else {
      // No changes made
      setUpdateError('No changes to update');
    }
  };

  return (
    <Page title="My Profile">
      <Stack gap="md">
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} />
            <Title order={3} mx="sm">
              Home Page
            </Title>
          </Button>
        </Group>

        <Paper shadow="xs" p="lg" radius="lg">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Title order={2}>My Profile</Title>

              {updateError && (
                <Alert color="red" title="Update Failed">
                  {updateError}
                </Alert>
              )}

              {updateSuccess && (
                <Alert color="green" title="Success">
                  <Text size="lg">Profile updated successfully !</Text>
                  Logout and Login again to see changes.
                </Alert>
              )}

              <Stack gap="sm">
                <Text fw={600}>Role</Text>
                <Text>{user.role}</Text>
              </Stack>

              <TextInput
                label="Name"
                placeholder="Enter your name"
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="Enter your email"
                {...form.getInputProps('email')}
              />

              <TextInput
                label="User Id"
                placeholder="Enter your user id"
                {...form.getInputProps('phoneNumber')}
              />

              <PasswordInput
                label="New Password"
                placeholder="Leave blank if no change"
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm new password"
                {...form.getInputProps('confirmPassword')}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit" loading={isPending}>
                  Update Profile
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Page>
  );
};

export default ProfileUpdate;
