import { useGetMyTests, usePostSuspendTest } from '@/hooks';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from '@/pages/dashboard/everything.module.css';
import { Page } from '@/components/page';
import { Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import TestOutlineComponent from '../attempt-test';
import { paths } from '@/routes';
import { modals } from '@mantine/modals';

const index = () => {
  const navigate = useNavigate();
  const {
    data: activeTests,
    isError: activeTestsError,
    isLoading: activeTestsLoading,
  } = useGetMyTests({
    query: {
      status: 'active',
    },
  });
  const [selectedTest, setSelectedTest] = React.useState<any>();
  const handleStartTest = (test: any) => {
    navigate(`/dashboard/student/test?testId=${test._id}&i=${0}&t=${test.questions.length}`);
  };
  const { mutate: suspendTest } = usePostSuspendTest();

  const openModal = (testId: string) =>
    modals.openConfirmModal({
      title: 'Are you sure, that you want to sunspend this test?',
      children: (
        <Text size="sm">
          Tests once suspended cannot be resumed. This test will not be visible in results.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        suspendTest({ variables: { testId }, route: { testId } });
      },
    });

  useEffect(() => {
    if (activeTests && activeTests?.data?.docs?.length == 0) {
      navigate(paths.dashboard.student.root);
    }
  }, [activeTests]);
  if (activeTestsLoading) {
    return <div>Loading...</div>;
  }
  if (activeTestsError) {
    return <div>Error...</div>;
  }
  console.log(activeTests);
  return (
    <Page title="Active Tests" className={css.root}>
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
            <Title order={2}>Active Tests</Title>
            <Stack mt="xl">
              {activeTests?.data?.docs.map(
                (test: {
                  _id: string;
                  user: {
                    name: string;
                  };
                  systems: { name: string }[];
                  questionTypes: string[];
                  questions: any[];
                  fullMarks: number;
                }) => (
                  <Stack
                    key={test._id}
                    gap="sm"
                    style={{
                      border: '1px solid #e1e1e1',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                    p="lg"
                  >
                    <Group>
                      <Text fw="bold">1.</Text>{' '}
                      <Text fw={600} size="lg">
                        New Test by {test.user.name}
                      </Text>
                    </Group>
                    <Divider my="md" bg="red" w="100%" />
                    <Group>
                      <Text fw={600} size="lg">
                        Systems :{' '}
                      </Text>
                      <Text>
                        {test.systems.map((typee: { name: string }) => typee.name).join(', ')}{' '}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Group>
                        <Text fw={600} size="lg">
                          No of Questions :{' '}
                        </Text>
                        <Text>{test.questions.length}</Text>
                      </Group>
                      <Group>
                        <Text fw={600} size="lg">
                          Full Marks :{' '}
                        </Text>
                        <Text>{test.fullMarks}</Text>
                      </Group>
                    </Group>

                    <Group>
                      <Text fw={600} size="lg">
                        Generation :{' '}
                      </Text>
                      <Text>{test.questionTypes.map((typee: String) => typee).join(', ')}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Button
                        size="md"
                        variant="outline"
                        // bg="red"
                        onClick={() => {
                          openModal(test._id);
                        }}
                      >
                        Suspend
                      </Button>
                      <Button
                        size="md"
                        variant="filled"
                        bg="red"
                        onClick={() => {
                          test.questions.length > 0 && handleStartTest(test);
                        }}
                      >
                        Start
                      </Button>
                    </Group>
                  </Stack>
                )
              )}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Page>
  );
};

export default index;
