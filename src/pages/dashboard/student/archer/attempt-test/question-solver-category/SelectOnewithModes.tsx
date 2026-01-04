import { Button, Group, Paper, Radio, Stack, Text, Title, Image } from '@mantine/core';
import { usePostArcherAnswer } from '@/hooks';
import React, { useEffect, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';
import { i } from 'vite/dist/node/types.d-aGj9QkWt';

export const SelectOnewithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostArcherAnswer();
  const [answers, setAnswers] = useState<string | number | null>(null);
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

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

  useEffect(() => {
    if (data.attempted) {
      setAttempted(true);
      setIsTimerRunning(false);
      setIncommingData(data.result);
      setAnswers(data.answers.value);
    }
    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const handleSubmit = () => {
    if (answers === null) {
      setErrorMessage('Please select an option before submitting.');
      return;
    }

    setIsTimerRunning(false);
    postAnswer(
      {
        variables: {
          questionIndex: data.thisIndex,
          questionId: data._id,
          answers: {
            value: answers,
          },
          kind: data.kind,
        },
        route: {
          testId: data.testId,
        },
      },
      {
        onSuccess: (response) => {
          // setIncommingData(response);
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
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

      <Title order={3}>Options</Title>
      <Stack gap="sm">
        {data.options.map((option: any, index: number) => (
          <Group key={index} align="flex-start">
            <Radio
              checked={answers === option.value}
              disabled={attempted}
              onChange={() => {
                if (attempted) {
                  setAnswers(data.answers.value);
                }
                setErrorMessage(null);
                setAnswers(option.value);
              }}
            />

            {renderOptionContent(option.label || option.value)}
          </Group>
        ))}
      </Stack>

      {!attempted ? (
        <Stack>
          {errorMessage && <Text c="red">{errorMessage}</Text>}
          <Group>
            <Button loading={postAnswerPending} onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack>
          {errorMessage && <Text c="red">{errorMessage}</Text>}
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
