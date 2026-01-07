import { Page } from '@/components/page';
import { Button, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { AssistanceTabsView } from './tabsView';
import QuestionViewWithModes from './question-solver-category';
import css from '@/pages/dashboard/everything.module.css';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes';
import { usePostSuspendTest } from '@/hooks';
import { modals } from '@mantine/modals';

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
  const { mutate: suspendTest } = usePostSuspendTest();
  const openModal = () =>
    modals.openConfirmModal({
      title: 'Are you sure, that you want to sunspend this test?',
      children: (
        <Text size="sm">
          Tests once suspended cannot be resumed. This test will be visible only in results.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        suspendTest({ variables: { testId }, route: { testId } });
      },
    });
  return (
    <Stack h="81vh" justify="space-between" gap="0px">
      <Group justify="space-between" my="0px" py="0px">
        <Group my="0px" py="0px">
          Question no. {thisIndex + 1}
        </Group>{' '}
        <Group my="0px" py="0px">
          Total Questions: {total}
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
              navigate(paths.dashboard.student.timed.viewResults.root);
            }}
          >
            Back to Results
          </Button>
        </Group>
        <Group>
          <Button
            disabled={thisIndex == 0}
            onClick={() => {
              navigate(
                paths.dashboard.student.timed.viewResults.root +
                  '/' +
                  testId +
                  `?i=${prevIndex}&t=${totalQuestions}`
              );
            }}
          >
            Previous
          </Button>
          <Button
            disabled={thisIndex === total - 1}
            onClick={() => {
              navigate(
                paths.dashboard.student.timed.viewResults.root +
                  '/' +
                  testId +
                  `?i=${nextIndex}&t=${totalQuestions}`
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
