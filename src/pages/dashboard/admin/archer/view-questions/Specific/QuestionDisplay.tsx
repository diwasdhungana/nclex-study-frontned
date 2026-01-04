import { Page } from '@/components/page';
import { Badge, Button, Group, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { AssistanceTabsView } from './tabsView';
import QuestionViewWithModes from './question-view-category';
import css from '@/pages/dashboard/everything.module.css';
import { PiArrowLeft } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

const QuestionDisplay = ({ props }: { props: any }) => {
  const navigate = useNavigate();
  const { question, mode } = props;
  console.log(question);
  return (
    <Stack h="83vh" justify="space-between">
      <Page title="Question" h="calc(83vh - 70px)">
        <Group gap="xl" justify="space-between">
          <Group>
            <Text fw="600">Type: {question.data.kind} </Text>
            {question?.data?.belongsToGroup && (
              <Badge color="purple" variant="light">
                {'#' + question?.data?.groupTag || 'Group tag'}
              </Badge>
            )}
            {/* {question?.data?.belongsToGroup && (
              <Badge color="purple" variant="light">
                Qno: {question?.data?.indexInGroup + 1}
              </Badge>
            )} */}

            <Badge color="purple" variant="light">
              {question.data.archerSet?.name || 'Readiness Assesment ##'}
            </Badge>

            <Badge
              color="purple"
              variant="light"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigator.clipboard.writeText(question.hashTag);
                notifications.show({
                  color: 'green',
                  title: 'Copied to clipboard',
                  message: question.hashTag,
                });
              }}
            >
              {'#' + question?.data.hashTag || 'Question tag'}
            </Badge>
          </Group>
          <Text mx="lg" fw="600">
            Points : {question.data.points}
          </Text>
        </Group>
        <Group h="100%" gap="3px" grow>
          {question.data.assistanceColumn && (
            <Paper withBorder w="0%" p="sm" h="100%">
              <ScrollArea h="100%">
                <div dangerouslySetInnerHTML={{ __html: question.data.assistanceColumn.title }} />
                {question.data.assistanceColumn.tabs && (
                  <AssistanceTabsView data={question.data.assistanceColumn.tabs} />
                )}
                {
                  <Text>
                    {question.data.assistanceColumn.assistanceData && (
                      <div
                        className={css.htmlContentDisplay}
                        dangerouslySetInnerHTML={{
                          __html: question.data.assistanceColumn.assistanceData,
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
              <QuestionViewWithModes mode={mode} data={question.data} />
            </ScrollArea>
          </Paper>
        </Group>
      </Page>
      <Group gap="xl">
        <Button variant="filled" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Group>
    </Stack>
  );
};

export default QuestionDisplay;
