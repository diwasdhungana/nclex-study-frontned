import { useGetMyArcherTests } from '@/hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Badge,
} from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import { paths } from '@/routes';
import { formatDate, formatTime } from '@/utilities/date';

const Index = () => {
  const navigate = useNavigate();
  const {
    data: activeTests,
    isError: activeTestsError,
    isLoading: activeTestsLoading,
  } = useGetMyArcherTests({});

  const handleStartTest = (test: any) => {
    navigate(
      paths.dashboard.student.archer.attemptTest.root +
        `?testId=${test._id}&i=${0}&t=${test.questions.length}`
    );
  };

  // Filter active tests
  const activeTestsData = activeTests?.data?.docs.filter((test: any) => test?.status === 'active');

  if (activeTestsLoading) {
    return <div>Loading...</div>;
  }
  if (activeTestsError) {
    return <div>Error...</div>;
  }

  return (
    <Page title="Active Tests" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.archer.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Archer Page
            </Title>
          </Button>
        </Group>
        <Paper shadow="xs" p="lg" radius="lg">
          <Stack ml="md">
            <Title order={2}>Active Tests</Title>
            <Divider my="md" bg="red" w="100%" />
            {activeTestsData.length === 0 ? (
              <Text>No active tests.</Text>
            ) : (
              <ScrollArea>
                <Table striped highlightOnHover withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Test Name</Table.Th>
                      <Table.Th>No. of Questions</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Full Marks</Table.Th>
                      <Table.Th>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {activeTestsData.map(
                      (test: {
                        _id: string;
                        archerSet: any;
                        questions: any[];
                        date: string;
                        fullMarks: number;
                      }) => (
                        <Table.Tr key={test._id}>
                          <Table.Td>
                            <Badge color="green" variant="filled">
                              Active
                            </Badge>
                          </Table.Td>
                          <Table.Td>{test?.archerSet?.name || 'No Name'}</Table.Td>
                          <Table.Td>{test?.questions?.length}</Table.Td>
                          <Table.Td>{formatDate(test.date)}</Table.Td>
                          <Table.Td>{test.fullMarks}</Table.Td>
                          <Table.Td>
                            <Button
                              variant="subtle"
                              onClick={() => handleStartTest(test)}
                              size="sm"
                            >
                              Continue
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
      </Stack>
    </Page>
  );
};

export default Index;
