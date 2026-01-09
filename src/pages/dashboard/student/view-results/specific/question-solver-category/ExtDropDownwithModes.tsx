import {
  Button,
  Checkbox,
  Group,
  OptionsDropdown,
  Paper,
  Radio,
  Select,
  Space,
  Stack,
  Table,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { usePostAnswer } from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';

export const ExtDropDownwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
  const [answers, setAnswers] = useState<any>([]);
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>({});

  const [seconds, setSeconds] = useState(0); // Track elapsed time in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Track timer state

  // Start timer on component mount
  useEffect(() => {
    if (data.attempted) {
      setIsTimerRunning(false);
      setIncommingData(data.result);
      setAnswers(data.answers);
    }
    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [isTimerRunning]);

  const handleSubmit = () => {
    setIsTimerRunning(false); // Stop timer
    postAnswer(
      {
        variables: {
          questionIndex: data.thisIndex,
          questionId: data._id,
          answers: answers ? answers : [],
          kind: data.kind,
        },
        route: {
          testId: data.testId,
        },
      },
      {
        onSuccess: (data) => {
          setIncommingData(data);
          setAttempted(true);
        },
        onError: (data) => {
          console.error(data);
        },
      }
    );
  };

  // Format time into minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  const groupOptions = (
    options: {
      id: string;
      type: string;
      value: [];
    }[]
  ) => {
    const groups = [];
    let currentGroup: {
      id: string;
      type: string;
      value: [];
    }[] = [];

    options.forEach((option) => {
      if (option.type === 'next-line') {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [];
      } else {
        currentGroup.push(option);
      }
    });

    if (currentGroup.length > 0) groups.push(currentGroup); // Add the last group if any
    return groups;
  };
  const groupedOptions = groupOptions(data.options);

  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />
      <Stack gap="sm">
        {groupedOptions.map((group, groupIndex) => (
          <Group key={groupIndex} gap="0px" style={{ lineHeight: '40px' }}>
            {group.map((option) =>
              option.type === 'text' ? (
                <React.Fragment key={option.id}>
                  <div
                    dangerouslySetInnerHTML={{ __html: option.value }}
                    key={option.id}
                    className={css.htmlContentDisplay}
                  />
                  &#160;
                </React.Fragment>
              ) : option.type === 'dropdown' ? (
                <React.Fragment key={option.id}>
                  <Select
                    data={
                      !attempted
                        ? option?.value?.map((o) => ({
                            value: o,
                            label: o,
                          }))
                        : option?.value?.map((o: any) =>
                            // If the answer is correct, highlight it in green
                            incommingData?.correctAnswers?.find(
                              (ans: { id: string; value: string }) => ans.id === option.id
                            )?.value === o
                              ? {
                                  value: o,
                                  label: o + ' (✓)',
                                }
                              : { value: o, label: o }
                          )
                    }
                    key={option.id}
                    value={
                      answers.find((o: { id: string; value: string }) => o.id === option.id)?.value
                    }
                    onChange={(data) => {
                      // if there is already this value present remove it if not add this value.
                      !attempted &&
                        setAnswers((prev: any) => [...prev, { value: data, id: option.id }]);
                    }}
                    style={
                      attempted
                        ? incommingData?.correctAnswers?.find(
                            (o: { id: string; value: string }) => o.id === option.id
                          )?.value ==
                          answers.find((o: { id: string; value: string }) => o.id === option.id)
                            ?.value
                          ? { border: '2px solid green', borderRadius: '10px' }
                          : { border: '2px solid #ff4136', borderRadius: '10px' }
                        : {}
                    }
                  />
                  {/* {attempted &&
                    incommingData?.correctAnswers?.find(
                      (o: { id: string; value: string }) => o.id === option.id
                    )?.value ==
                      answers.find((o: { id: string; value: string }) => o.id === option.id)
                        ?.value && (
                      <Text size="30px" c="green">
                        ✓
                      </Text>
                    )} */}
                  &#160;&#160;
                </React.Fragment>
              ) : null
            )}
          </Group>
        ))}
      </Stack>

      {!attempted ? (
        <Group>
          <Button loading={postAnswerPending} onClick={handleSubmit}>
            Submit
          </Button>
        </Group>
      ) : (
        <Stack>
          <Paper
            bg={
              incommingData?.status === 'correct'
                ? 'green.3'
                : incommingData?.status === 'partially correct'
                  ? 'green.2'
                  : incommingData?.status === 'incorrect'
                    ? '#ff6259'
                    : 'grey.2'
            }
          >
            <Stack justify="center">
              <Group justify="space-between" p="md">
                <Stack gap="0px">
                  <Text fw={700} size="xl">
                    {incommingData?.status && capitalize(incommingData?.status)}
                  </Text>
                  {minutes > 0 ||
                    (displaySeconds > 0 && (
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
                    ))}
                </Stack>
                <Stack align="center" gap="0px">
                  <Group gap="3px">
                    <Text fw={700} size="30px">
                      {incommingData?.pointsObtained}
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
          <Title order={2}>Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: incommingData?.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};
