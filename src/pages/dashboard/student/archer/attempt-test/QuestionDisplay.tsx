import { Page } from '@/components/page';
import { Button, Group, Paper, ScrollArea, Select, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { AssistanceTabsView } from './tabsView';
import QuestionViewWithModes from './question-solver-category';
import css from '@/pages/dashboard/everything.module.css';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes';
import { usePostSuspendTest, useGetMyArcherTests } from '@/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

const QuestionDisplay = ({ props }: { props: any }) => {
  const navigate = useNavigate();
  const { question, mode, questionIndex, testId, totalQuestions } = props;
  const total = Number(totalQuestions);
  const thisIndex: number = Number(questionIndex);
  const nextIndex = thisIndex + 1;
  const prevIndex = thisIndex - 1;
  const attempted = question.data.attempted;
  const result = question?.data?.result || null;
  const answers = question?.data?.answers || null;
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { data: testdata, isLoading: testsLoading, isError: testError } = useGetMyArcherTests();

  useEffect(() => {
    if (!testdata?.data?.docs[0]?.createdAt) return;

    if (testdata?.data?.docs[0]?.status != 'active') {
      notifications.show({
        title: 'Test Ended',
        message: 'Test has ended',
        color: 'red',
      });
      setTimeout(() => {
        navigate(paths.dashboard.student.timed.root);

      }, 2000); // Navigate after 2 seconds
    }

    // Parse the test start time and calculate the end time
    const testStartTime = new Date(testdata.data.docs[0].createdAt).getTime();
    const testDuration = 2.5 * 60 * 60 * 1000; // 2.5 hours in milliseconds
    const testEndTime = testStartTime + testDuration;

    // Update the countdown every second
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const remainingTime = testEndTime - currentTime;

      if (remainingTime <= 0) {
        clearInterval(interval); // Stop the interval
        setTimeRemaining(0);
        notifications.show({
          title: 'Test Ended',
          message: 'Test has ended',
          color: 'red',
        });
        setTimeout(() => {
          navigate(paths.dashboard.student.timed.root);
        }, 2000); // Navigate after 2 seconds
      } else {
        setTimeRemaining(remainingTime);
      }
    }, 1000); // Update every second

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [testdata, navigate]);

  // Function to format the remaining time into hours, minutes, and seconds
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Stack h="81vh" justify="space-between" gap="0px">
      <Group
        justify="space-between"
        my="0px"
        py="0px"
        bg={question.data.testStatus == 'completed' ? 'green.2' : 'none'}
      >
        <Group my="0px" py="0px">
          Question no. {thisIndex + 1}
        </Group>
        {question.data.testStatus == 'completed' && (
          <Group my="0px" py="0px">
            Test Completed
          </Group>
        )}
        <Group my="0px" py="0px">
          <Group>
            Time Remaining : <Text c="red">{formatTime(timeRemaining)}</Text>
          </Group>

          <Group>Total Questions: {total}</Group>
        </Group>
      </Group>
      <Page title="Question" h="calc(83vh - 40px)">
        <Group h="100%" gap="3px" grow>
          {question.data.question.assistanceColumn && (
            <Paper withBorder w="0%" p="sm" h="100%">
              <ScrollArea h="100%">
                <div
                  dangerouslySetInnerHTML={{
                    __html: question.data.question.assistanceColumn.title,
                  }}
                />
                {question.data.question.assistanceColumn.tabs && (
                  <AssistanceTabsView data={question.data.question.assistanceColumn.tabs} />
                )}
                {
                  <Text>
                    {question.data.question.assistanceColumn.assistanceData && (
                      <div
                        className={css.htmlContentDisplay}
                        dangerouslySetInnerHTML={{
                          __html: question.data.question.assistanceColumn.assistanceData,
                        }}
                      />
                    )}
                  </Text>
                }
              </ScrollArea>
            </Paper>
          )}
          <Paper withBorder h="100%" p="sm">
            <ScrollArea h="100%">
              <QuestionViewWithModes
                mode={mode}
                data={{ ...question.data.question, thisIndex, testId, attempted, result, answers }}
              />
            </ScrollArea>
          </Paper>
        </Group>
      </Page>
      <Group gap="xl" justify="space-between" mt="3px" mb="0px">
        <Group>
          <Button
            onClick={() => {
              navigate(paths.dashboard.student.root);
            }}
          >
            Back to Home Screen
          </Button>
          {!testsLoading && !testError && testdata?.data?.docs[0].status !== 'completed' ? (
            <Select
              data={testdata?.data?.docs[0].questions.map((q: any, i: number) => ({
                value: i.toString(),
                label: `Question ${i + 1}` + (q.attempted ? ' (Attempted)' : ''),
              }))}
              placeholder="Select a question"
              value={thisIndex.toString()}
              onChange={(value: any) => {
                navigate(
                  `/dashboard/student/timed/test?testId=${testId}&i=${value}&t=${totalQuestions}`
                );
              }}
            />
          ) : (
            'Test is already completed'
          )}
        </Group>
        <Group>
          <Button
            disabled={thisIndex == 0}
            onClick={() => {
              navigate(
                `/dashboard/student/timed/test?testId=${testId}&i=${prevIndex}&t=${totalQuestions}`
              );
            }}
          >
            Previous
          </Button>
          <Button
            disabled={thisIndex === total - 1}
            onClick={() => {
              navigate(
                `/dashboard/student/timed/test?testId=${testId}&i=${nextIndex}&t=${totalQuestions}`
              );
            }}
          >
            Next
          </Button>
        </Group>
      </Group>
    </Stack>
  );
};

export default QuestionDisplay;
