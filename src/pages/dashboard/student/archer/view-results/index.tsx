import { useGetMyArcherTests } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { formatDate, formatTime } from '@/utilities/date';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { useDeleteManyQuestions, useGetSubjects, useGetSystems } from '@/hooks';
import { useDebouncedValue } from '@mantine/hooks';

const Index = () => {
  const navigate = useNavigate();
  const [jumpToPage, setJumpToPage] = useState('');
  const [limit] = useState(10);
  const [page, setPage] = useState(1);

  const {
    data: activeTests,
    isError: activeTestsError,
    isLoading: activeTestsLoading,
  } = useGetMyArcherTests({
    query: {
      page: page,
      limit: limit,
    },
  });

  const handleViewResults = (test: any) => {
    navigate(
      paths.dashboard.student.timed.viewResults.root +
        '/' +
        test._id +
        `?i=0&t=${test.questions.length}`
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

  // Paginate results

  const totalPages = Math.ceil(activeTests?.data?.totalDocs / limit);

  // Calculate percentage and remarks for each test
  const testsWithRemarks = activeTests?.data?.docs.map((test: any) => {
    const percentage = (test.score / test.fullMarks) * 100;
    let remark = '';
    let color = '';

    if (percentage >= 70) {
      remark = 'Very High Chance of Passing';
      color = 'green';
    } else if (percentage >= 65 && percentage < 70) {
      remark = 'High Chance of Passing';
      color = 'blue';
    } else if (percentage >= 60 && percentage < 65) {
      remark = 'Borderline';
      color = 'yellow';
    } else {
      remark = 'Low Chance of Passing';
      color = '#ff4136';
    }

    return {
      ...test,
      percentage,
      remark,
      color,
    };
  });

  const paginatedTests = testsWithRemarks;

  // Prepare data for the line graph
  const graphData = testsWithRemarks?.map((test: any) => ({
    name: test.archerSet.name || test.archerSet,
    percentage: test.percentage,
    remark: test.remark,
    color: test.color,
  }));

  return (
    <Page title="Archer Tests Results" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.timed.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Archer Page
            </Title>
          </Button>
        </Group>
        <Paper shadow="xs" p="lg" radius="lg">
          <Stack ml="md">
            <Title order={2}>Test Results</Title>
            <Divider my="md" bg="#ff4136" w="100%" />

            {/* Line Graph */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="percentage" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>

            {/* Table */}
            <ScrollArea>
              <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Test Name</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Full Marks</Table.Th>
                    <Table.Th>Obtained Marks</Table.Th>
                    <Table.Th>Percentage</Table.Th>
                    <Table.Th>Performance</Table.Th>
                    <Table.Th>Remark</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedTests?.map(
                    (test: {
                      _id: string;
                      archerSet: any;
                      date: string;
                      fullMarks: number;
                      score: number;
                      percentage: number;
                      remark: string;
                      color: string;
                    }) => (
                      <Table.Tr key={test._id}>
                        <Table.Td>{test.archerSet.name || test.archerSet}</Table.Td>
                        <Table.Td>
                          {formatDate(test.date)} {formatTime(test.date)}
                        </Table.Td>
                        <Table.Td>{test.fullMarks}</Table.Td>
                        <Table.Td>{test.score}</Table.Td>
                        <Table.Td>{test.percentage.toFixed(2)}%</Table.Td>
                        <Table.Td>
                          <Badge color={test.color} variant="filled">
                            {test.remark}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            variant="subtle"
                            onClick={() => handleViewResults(test)}
                            size="sm"
                          >
                            View Results
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    )
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Stack>
          {/* Pagination */}
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
                    console.log('here');
                    handleJumpToPage();
                  }
                }}
              />
              <Button size="sm" onClick={handleJumpToPage}>
                Go
              </Button>
            </Group>
          </Group>
        </Paper>
      </Stack>
    </Page>
  );
};

export default Index;
