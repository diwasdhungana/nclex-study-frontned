import React, { useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Group, Paper, Radio, Stack, Table, Text, Title } from '@mantine/core';
import css from '@/pages/dashboard/everything.module.css';
import { usePostArcherAnswer } from '@/hooks';
import { capitalize, firstLetters } from '@/utilities/text';

export const MatrixNGridwithModes = ({ data, mode }: any) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostArcherAnswer();
  const [answers, setAnswers] = useState(new Map());
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>({});
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  useEffect(() => {
    if (data.attempted) {
      setIsTimerRunning(false);
      setIncommingData(data.result);
      setAnswers(new Map(data.answers.map((answer: any) => [answer.key, answer.values])));
    }
    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const isCorrectAnswer = (rowName: any, columnValue: any) => {
    if (!incommingData?.correctAnswers) return false;

    const correctRow = incommingData?.correctAnswers?.find((answer: any) => answer.key === rowName);
    return correctRow?.values.includes(columnValue) || false;
  };

  const handleOptionChange = (rowName: any, columnValue: any, checked: any) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);

      if (data.radio) {
        if (checked) {
          newAnswers.set(rowName, [columnValue]);
        } else {
          newAnswers.delete(rowName);
        }
      } else {
        const currentValues = newAnswers.get(rowName) || [];
        if (checked) {
          newAnswers.set(rowName, [...currentValues, columnValue]);
        } else {
          newAnswers.set(
            rowName,
            currentValues.filter((value: any) => value !== columnValue)
          );
        }
      }

      return newAnswers;
    });
  };

  const formatAnswersForAPI = () => {
    const formattedAnswers: any = [];
    answers.forEach((values, key) => {
      if (values.length > 0) {
        formattedAnswers.push({
          key,
          values,
        });
      }
    });
    return formattedAnswers;
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    const formattedAnswers = formatAnswersForAPI();

    postAnswer(
      {
        variables: {
          questionIndex: data.thisIndex,
          questionId: data._id,
          answers: formattedAnswers,
          kind: data.kind,
        },
        route: {
          testId: data.testId,
        },
      },
      {
        onSuccess: (responseData) => {
          setIncommingData(responseData);
          setAttempted(true);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} />

      <Stack gap="sm" mt="md">
        <Table verticalSpacing="lg">
          <Table.Thead>
            <Table.Tr ta="center">
              {data.options.head.map((head: any, index: any) => (
                <Table.Td key={index}>
                  <Text>{head}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.options.rows.map((rowName: any, indexR: any) => (
              <Table.Tr key={indexR} ta="center">
                <Table.Td>
                  <Text>{rowName}</Text>
                </Table.Td>
                {data.options.head.map(
                  (head: any, index: any) =>
                    index > 0 && (
                      <Table.Td
                        key={index}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Group justify="center" gap="xs">
                          {data.radio ? (
                            <Radio
                              checked={(answers.get(rowName) || []).includes(head)}
                              onChange={(e) =>
                                attempted
                                  ? null
                                  : handleOptionChange(rowName, head, e.currentTarget.checked)
                              }
                            />
                          ) : (
                            <Checkbox
                              checked={(answers.get(rowName) || []).includes(head)}
                              onChange={(e) =>
                                attempted
                                  ? null
                                  : handleOptionChange(rowName, head, e.currentTarget.checked)
                              }
                            />
                          )}
                        </Group>
                      </Table.Td>
                    )
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
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

export default MatrixNGridwithModes;
