import { Button, Group, Paper, Text } from '@mantine/core';
import React from 'react';
import { requestDataCreator } from './requestDataCreator';
import { usePostQuestion } from '@/hooks/api/questions';
import { notifications } from '@mantine/notifications';
import { set } from 'date-fns';

export const SubmitQuestion = ({
  dataTunnel,
  response,
  setResponse,
}: {
  dataTunnel: any;
  response: any;
  setResponse: any;
}) => {
  const { mutate: postQuestion, isPending } = usePostQuestion();
  const [attempted, setAttempted] = React.useState(false);
  const handleSubmit = () => {
    const requestData = requestDataCreator(dataTunnel, setResponse);
    const variables = requestData?.variables;
    const valid = requestData?.valid;
    setAttempted(true);
    valid &&
      postQuestion(
        { variables },
        {
          onSuccess: (data) => {
            console.log('Success');
            setResponse({ status: 'success' });
            //reload this page to clear all data.
            notifications.show({
              title: 'Question Created',
              message: `New ${dataTunnel().selectedQuestionType} question created.`,
            });
            // setTimeout(() => {
            //   window.location.reload();
            // }, 2000);
          },
          onError: (error) => {
            console.log('error', error);
          },
        }
      );
  };
  return (
    <Group mt="md">
      <Button bg="green" onClick={handleSubmit} loading={isPending}>
        Submit
      </Button>
      {response.status != 'success' && attempted && (
        <Text c="red">Check fields above for error.</Text>
      )}
    </Group>
  );
};
