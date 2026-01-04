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
import { usePostArcherAnswer } from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';

export const ExtDropDownwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostArcherAnswer();
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
                                  label: o,
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
                          : { border: '2px solid red', borderRadius: '10px' }
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
        <Stack>
          <Group>
            <Button loading={postAnswerPending} onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack>
          <Group>
            <Button loading={postAnswerPending} disabled bg="green.1">
              Submitted
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
};
