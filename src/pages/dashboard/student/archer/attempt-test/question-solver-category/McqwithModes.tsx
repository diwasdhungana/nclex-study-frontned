import {
  Button,
  Checkbox,
  Group,
  Image,
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

export const McqwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostArcherAnswer();
  const [answers, setAnswers] = useState<any>([]);
  const [attempted, setAttempted] = useState(false);
  const [incommingData, setIncommingData] = useState<any>({});

  const [seconds, setSeconds] = useState(0); // Track elapsed time in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Track timer state

  // Function to check if a string is an image URL
  const isImageUrl = (str: string): boolean => {
    return str.startsWith('https://s3') || str.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  // Function to render option content (image or text)
  const renderOptionContent = (value: string) => {
    if (isImageUrl(value)) {
      return (
        <Group w="50%">
          <Image
            src={value}
            alt="Question option"
            width={400}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/fallback-image.png';
            }}
          />
        </Group>
      );
    }
    return value;
  };

  // Start timer on component mount
  useEffect(() => {
    if (data.attempted) {
      console.log('results', data.result);
      setAttempted(true);
      setIsTimerRunning(false);
      setIncommingData(data.result);
      setAnswers(data.answers.map((ans: any) => ans.value));
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
          answers: answers.map((ans: any) => ({ value: ans })),
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
  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

      <Title order={3}>Options</Title>

      <Stack gap="sm">
        {data.options.map(
          (
            option: {
              value: string;
              label: string;
            },
            index: number
          ) => {
            return (
              <Group key={index}>
                <Checkbox
                  disabled={attempted}
                  checked={answers?.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAnswers([...answers, option.value]);
                    } else {
                      setAnswers(answers.filter((ans: any) => ans !== option.value));
                    }
                  }}
                />{' '}
                {renderOptionContent(option.label || option.value)}
              </Group>
            );
          }
        )}
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
