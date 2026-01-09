import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { usePostAnswer } from '@/hooks';
import React, { useEffect, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';

export const FillBlankswithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
  const [answer, setAnswer] = useState<string>('');
  const [attempted, setAttempted] = useState(data.attempted);
  const [incomingData, setIncomingData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Initialize answer with correct value if attempted
  useEffect(() => {
    if (data.attempted) {
      setIsTimerRunning(false);
      setIncomingData(data.result);
      setAnswer(data.answers.value || '');
    }

    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Handle answer submission
  const handleSubmit = () => {
    if (!answer.trim()) {
      setErrorMessage('Please enter an answer before submitting.');
      return;
    }

    setIsTimerRunning(false);
    postAnswer(
      {
        variables: {
          questionIndex: data.thisIndex,
          questionId: data._id,
          answers: { value: answer },
          kind: data.kind,
        },
        route: { testId: data.testId },
      },
      {
        onSuccess: (response) => {
          setIncomingData(response);
          setAttempted(true);
          console.log(response);
        },
        onError: (error) => {
          console.error(error);
          setErrorMessage('An error occurred while submitting your answer.');
        },
      }
    );
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <Stack gap="lg">
      {/* Question Title */}
      <div
        dangerouslySetInnerHTML={{ __html: data.question.title }}
        className={css.htmlContentDisplay}
      />

      {/* Answer Input Field */}
      <input
        type="text"
        value={answer}
        onChange={(e) => {
          setErrorMessage(null);
          setAnswer(e.target.value);
        }}
        style={{
          padding: '4px 8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          margin: '0 4px',
          minWidth: '150px',
        }}
      />

      {/* Submit Button & Error Message */}
      {!attempted ? (
        <Stack>
          {errorMessage && <Text c="#ff4136">{errorMessage}</Text>}
          <Group>
            <Button loading={postAnswerPending} onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack>
          {/* Feedback Section */}
          <Paper
            bg={
              incomingData?.status === 'correct'
                ? 'green.3'
                : incomingData?.status === 'partially correct'
                  ? 'green.2'
                  : incomingData?.status === 'incorrect'
                    ? '#ff6259'
                    : 'grey.2'
            }
          >
            <Stack justify="center">
              <Group justify="space-between" p="md">
                <Stack gap="0px">
                  <Text fw={700} size="xl">
                    {incomingData?.status && capitalize(incomingData?.status)}
                  </Text>

                  {/* Time Spent */}
                  {(minutes > 0 || displaySeconds > 0) && (
                    <Stack gap="0px" align="center">
                      <Group gap="3px">
                        <Text fw={700} size="xl">
                          {minutes}
                        </Text>
                        <Text size="sm">min,</Text>
                        <Text fw={700} size="xl">
                          {displaySeconds}
                        </Text>
                        <Text size="sm">sec</Text>
                      </Group>
                      <Text fw={500} size="sm">
                        Time Spent
                      </Text>
                    </Stack>
                  )}
                </Stack>

                {/* Score Display */}
                <Stack align="center" gap="0px">
                  <Group gap="3px">
                    <Text fw={700} size="30px">
                      {incomingData?.pointsObtained}
                    </Text>
                    <Text fw={500} size="md">
                      /
                    </Text>
                    <Text fw={500} size="md">
                      {data.points}
                    </Text>
                  </Group>
                  <Text size="sm">Scored/Max</Text>
                </Stack>
              </Group>
            </Stack>
          </Paper>

          {/* Explanation Section */}
          <Title order={2}>Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: incomingData?.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};
