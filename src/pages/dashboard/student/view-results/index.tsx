import { useGetMyTests } from '@/hooks';
import React, { useState } from 'react';
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
  Pagination,
  TextInput,
} from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import { paths } from '@/routes';
import { formatDate, formatTime, date } from '@/utilities/date';

// Helper function to format date in a user-friendly way
const formatUserFriendlyDate = (dateValue: string | Date) => {
  const dateObj = date(dateValue);

  // Get day with ordinal suffix (1st, 2nd, 3rd, etc.)
  const day = dateObj.date();
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  const dayName = dateObj.format('dddd');
  const month = dateObj.format('MMMM');
  const year = dateObj.format('YYYY');
  const time = dateObj.format('h:mm A');

  return `${dayName} ${dayWithSuffix} ${month}, ${year} ${time}`;
};

const index = () => {
  const navigate = useNavigate();
  const [jumpToPage, setJumpToPage] = useState('');
  const [limit] = useState(10);
  const [page, setPage] = useState(1);

  const {
    data: activeTests,
    isError: activeTestsError,
    isLoading: activeTestsLoading,
  } = useGetMyTests({
    query: {
      status: ['completed'],
      page: page,
      limit: limit,
    },
  });

  const handleStartTest = (test: any) => {
    navigate(
      `/dashboard/student/view-results/test?testId=${test._id}&i=${0}&t=${test.questions.length}`
    );
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setPage(pageNumber);
      window.scrollTo(0, 0);
      setJumpToPage('');
    }
  };

  if (activeTestsLoading) {
    return <div>Loading...</div>;
  }
  if (activeTestsError) {
    return <div>Error...</div>;
  }

  const totalPages = Math.ceil(activeTests?.data?.totalDocs / limit);

  // Calculate percentage and performance for each test
  const testsWithPerformance = activeTests?.data?.docs.map((test: any) => {
    const percentage = (test.score / test.fullMarks) * 100;
    let performance = '';
    let color = '';

    if (percentage >= 80) {
      performance = 'Excellent';
      color = 'green';
    } else if (percentage >= 70) {
      performance = 'Good';
      color = 'blue';
    } else if (percentage >= 60) {
      performance = 'Fair';
      color = 'yellow';
    } else {
      performance = 'Needs Improvement';
      color = '#ff4136';
    }

    return {
      ...test,
      percentage,
      performance,
      color,
    };
  });

  return (
    <Page title="Tests Results" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Student Page
            </Title>
          </Button>
        </Group>
        <Paper shadow="xs" p="lg" radius="lg">
          <Stack ml="md">
            <Title order={2}>Test Results</Title>
            <Divider my="md" bg="#ff4136" w="100%" />

            {testsWithPerformance?.length === 0 ? (
              <Text>No completed tests found.</Text>
            ) : (
              <ScrollArea>
                <Table striped highlightOnHover withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Sr. No.</Table.Th>
                      <Table.Th>Date & Time</Table.Th>
                      <Table.Th>Systems</Table.Th>
                      <Table.Th>Questions</Table.Th>
                      <Table.Th>Score</Table.Th>
                      <Table.Th>Percentage</Table.Th>
                      <Table.Th>Performance</Table.Th>
                      <Table.Th>Question Types</Table.Th>
                      <Table.Th>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {testsWithPerformance?.map((test: any, index: number) => (
                      <Table.Tr key={test._id}>
                        <Table.Td>
                          {activeTests?.data?.totalDocs - ((page - 1) * limit + index)}
                        </Table.Td>

                        <Table.Td>
                          <Text size="sm">{formatUserFriendlyDate(test.date)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {test.systems.map((system: { name: string }) => system.name).join(', ')}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{test?.questions?.length}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {test?.score} / {test?.fullMarks || 'Total'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {test.percentage.toFixed(1)}%
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={test.color} variant="filled" size="sm">
                            {test.performance}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {test.questionTypes.map((type: string) => type).join(', ')}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Button variant="subtle" onClick={() => handleStartTest(test)} size="sm">
                            View Details
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="space-between" py="md">
              <Group></Group>
              <Pagination
                className={css.paginationControls}
                value={page}
                onChange={(newPage) => {
                  setPage(newPage);
                  window.scrollTo(0, 0);
                }}
                total={totalPages}
                size="sm"
                radius="xs"
              />
              <Group>
                Jump to page
                <TextInput
                  w="80px"
                  type="number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJumpToPage();
                    }
                  }}
                />
                <Button size="sm" onClick={handleJumpToPage}>
                  Go
                </Button>
              </Group>
            </Group>
          )}
        </Paper>
      </Stack>
    </Page>
  );
};

export default index;
