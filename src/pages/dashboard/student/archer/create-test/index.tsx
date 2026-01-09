import { useCreateArcherTest, useGetAllSets } from '@/hooks';
import React from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { Page } from '@/components/page';
import {
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Table,
  ScrollArea,
} from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes';

const Index = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = React.useState<any>({});
  const {
    data: archerSets,
    isError: archerSetsError,
    isLoading: archerSetsLoading,
  } = useGetAllSets({
    query: { getAll: true },
  });

  const { mutate: createTest, isPending } = useCreateArcherTest();
  const handleCreateTest = (set: any) => {
    createTest(
      {
        variables: {
          archerSetId: set._id,
        },
      },
      {
        onSuccess: (data) => {},
        onError: (error: String) => {
          console.log(error);
        },
      }
    );
  };

  // Function to convert duration in minutes to "X hours Y minutes" format
  const formatDuration = (durationInMinutes: number) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours} hours ${minutes} minutes`;
  };

  return (
    <Page title="New Test" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.timed.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Archer Page
            </Title>
          </Button>
        </Group>
      </Stack>
      <Paper shadow="xs" p="lg" radius="lg">
        <Stack ml="md">
          <Title order={2}>New Archer Test</Title>
          <Text size="lg"> Select a Set to continue</Text>
          <Divider my="md" bg="#ff4136" w="100%" />
          {archerSetsLoading ? (
            <Text>Loading...</Text>
          ) : archerSetsError ? (
            <Text>Error...</Text>
          ) : (
            <ScrollArea>
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Set Name</Table.Th>
                    <Table.Th>Full Marks</Table.Th>
                    <Table.Th>Duration</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {archerSets?.data?.docs.map(
                    (set: any) =>
                      set.enabled && (
                        <Table.Tr key={set._id}>
                          <Table.Td>{set.name}</Table.Td>
                          <Table.Td>{set.fullMarks}</Table.Td>
                          <Table.Td>{formatDuration(set.durationInMinutes)}</Table.Td>
                          <Table.Td>
                            <Button
                              variant={set.attempted ? 'disabled' : 'subtle'}
                              disabled={set.attempted || isPending}
                              onClick={() => handleCreateTest(set)}
                              size="sm"
                            >
                              {set.attempted ? 'Attempted' : 'Attempt'}
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      )
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </Stack>
      </Paper>
    </Page>
  );
};

export default Index;
