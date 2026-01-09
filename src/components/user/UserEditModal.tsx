// src/components/user/UserEditModal.tsx
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  PasswordInput,
  Switch,
  Card,
  Badge,
  Divider,
  Title,
  Loader,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { PiUser, PiPhone, PiEnvelope, PiCalendar, PiLock } from 'react-icons/pi';

interface UserEditModalProps {
  opened: boolean;
  onClose: () => void;
  user: any;
  isAdmin: boolean;
  onUpdatePassword: (userId: string, password: string) => void;
  onUpdateArcherEligibility: (userId: string, currentState: boolean) => void;
  onUpdateVideoEligibility: (userId: string, currentState: boolean) => void;
  onUpdateUserEnabled: (userId: string, currentState: boolean) => void;
}

export function UserEditModal({
  opened,
  onClose,
  user,
  isAdmin,
  onUpdatePassword,
  onUpdateArcherEligibility,
  onUpdateVideoEligibility,
  onUpdateUserEnabled,
}: UserEditModalProps) {
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Reset password field when modal is opened with a new user
  useEffect(() => {
    if (opened) {
      setPassword('');
      setIsUpdating(null);
    }
  }, [opened, user?._id]);

  const handleToggleUpdate = async (
    updateFunction: (userId: string, currentState: boolean) => void,
    userId: string,
    currentState: boolean,
    toggleType: string
  ) => {
    setIsUpdating(toggleType);
    try {
      await updateFunction(userId, currentState);
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsUpdating(null), 500);
    }
  };

  const formatJoinedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <PiUser size={20} />
          <Title order={3}>Edit User</Title>
        </Group>
      }
      size="lg"
      padding="xl"
    >
      <Stack gap="lg">
        {/* User Information Card */}
        <Card withBorder radius="md" p="lg">
          <Stack gap="md">
            <Title order={4} c="dimmed" size="sm" fw={600}>
              USER INFORMATION
            </Title>

            <Group wrap="nowrap" gap="sm">
              <PiUser size={16} color="gray" />
              <Text fw={500} size="sm" c="dimmed" w={100}>
                Name:
              </Text>
              <Text fw={600}>{user.name}</Text>
            </Group>

            <Group wrap="nowrap" gap="sm">
              <PiPhone size={16} color="gray" />
              <Text fw={500} size="sm" c="dimmed" w={100}>
                Phone:
              </Text>
              <Text>{user.phoneNumber}</Text>
            </Group>

            <Group wrap="nowrap" gap="sm">
              <PiEnvelope size={16} color="gray" />
              <Text fw={500} size="sm" c="dimmed" w={100}>
                Email:
              </Text>
              <Text>{user.email || 'Not provided'}</Text>
            </Group>

            <Group wrap="nowrap" gap="sm">
              <PiCalendar size={16} color="gray" />
              <Text fw={500} size="sm" c="dimmed" w={100}>
                Joined:
              </Text>
              <Badge variant="light" color="blue" size="sm">
                {formatJoinedDate(user.createdAt)}
              </Badge>
            </Group>
          </Stack>
        </Card>

        {/* Settings Card */}
        {!isAdmin && (
          <Card withBorder radius="md" p="lg">
            <Stack gap="md">
              <Title order={4} c="dimmed" size="sm" fw={600}>
                USER PERMISSIONS
              </Title>

              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={500} size="sm">
                    Time Test Eligible
                  </Text>
                  <Text size="xs" c="dimmed">
                    Allow access to timed test features
                  </Text>
                </div>
                <Group gap="xs">
                  {isUpdating === 'archer' && <Loader size="xs" />}
                  <Switch
                    checked={user.archerEligible}
                    onChange={() =>
                      handleToggleUpdate(
                        onUpdateArcherEligibility,
                        user._id,
                        user.archerEligible,
                        'archer'
                      )
                    }
                    disabled={isUpdating === 'archer'}
                    color="green"
                    size="md"
                  />
                </Group>
              </Group>

              {/* <Divider />

              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={500} size="sm">
                    Video Eligible
                  </Text>
                  <Text size="xs" c="dimmed">
                    Allow access to class recordings
                  </Text>
                </div>
                <Group gap="xs">
                  {isUpdating === 'video' && <Loader size="xs" />}
                  <Switch
                    checked={user.classRecordingEligible}
                    onChange={() =>
                      handleToggleUpdate(
                        onUpdateVideoEligibility,
                        user._id,
                        user.classRecordingEligible,
                        'video'
                      )
                    }
                    disabled={isUpdating === 'video'}
                    color="blue"
                    size="md"
                  />
                </Group>
              </Group> */}

              <Divider />

              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={500} size="sm">
                    Account Status
                  </Text>
                  <Text size="xs" c="dimmed">
                    Enable or disable user account
                  </Text>
                </div>
                <Group gap="xs">
                  {isUpdating === 'enabled' && <Loader size="xs" />}
                  <Switch
                    checked={!user.deleted}
                    onChange={() =>
                      handleToggleUpdate(onUpdateUserEnabled, user._id, user.deleted, 'enabled')
                    }
                    disabled={isUpdating === 'enabled'}
                    color={!user.deleted ? 'green' : '#ff4136'}
                    size="md"
                  />
                </Group>
              </Group>
            </Stack>
          </Card>
        )}

        {/* Password Change Card */}
        <Card withBorder radius="md" p="lg">
          <Stack gap="md">
            <Group gap="sm">
              <PiLock size={16} />
              <Title order={4} c="dimmed" size="sm" fw={600}>
                CHANGE PASSWORD
              </Title>
            </Group>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter new password"
              description="Leave empty to keep current password"
              size="sm"
            />
          </Stack>
        </Card>

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md" gap="sm">
          {password.trim() && (
            <Button variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
          )}
          <Button
            onClick={() => {
              if (password.trim()) {
                onUpdatePassword(user._id, password);
                setPassword('');
              }
              onClose();
            }}
            size="sm"
            color="blue"
          >
            {password.trim() ? 'Save Changes' : 'Close'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
