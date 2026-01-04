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
import { array } from 'prop-types';

export const HighlightwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
  const [answers, setAnswers] = useState<any>([]);
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>(data.result || {});

  const contentRef = useRef<HTMLDivElement>(null); // To reference the content div
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const normalizeText = (text: string) =>
      text
        .replace(/\u00A0/g, ' ') // replace &nbsp; with space
        .replace(/\s+/g, ' ') // collapse whitespace
        .trim();

    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element) => {
      const text = normalizeText((element as HTMLElement).innerText);

      const isSelected = data?.answers?.some((item: any) => normalizeText(item.value) === text);
      const isCorrect = incommingData?.correctAnswers?.some(
        (item: any) => normalizeText(item.value) === text
      );

      // Disable interaction if attempted

      (element as HTMLElement).style.pointerEvents = 'none';

      // If both selected and correct — golden
      if (isSelected && isCorrect) {
        (element as HTMLElement).style.backgroundColor = 'gold';
        (element as HTMLElement).style.color = 'black';
      }
      // If selected but not correct — red
      else if (isSelected) {
        (element as HTMLElement).style.backgroundColor = 'red';
        (element as HTMLElement).style.color = 'black';
      }
      // If correct but not selected — green
      else if (isCorrect) {
        (element as HTMLElement).style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
      }
    });
  }, [data, incommingData]);

  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />
      <Group>
        <div
          // className="content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: data.options }}
          // className={css.htmlContentDisplay}
        />
      </Group>
      <Stack gap="xs" mt="md">
        <Title order={5}>Legend:</Title>
        <Group gap="md">
          <Group gap="xs">
            <div style={{ width: 16, height: 16, backgroundColor: 'gold', borderRadius: 4 }} />
            <Text size="sm">Correct & Selected (Gold)</Text>
          </Group>
          <Group gap="xs">
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                borderRadius: 4,
              }}
            />
            <Text size="sm">Correct Answer (Green)</Text>
          </Group>
          <Group gap="xs">
            <div style={{ width: 16, height: 16, backgroundColor: 'red', borderRadius: 4 }} />
            <Text size="sm">Selected but Incorrect (Red)</Text>
          </Group>
        </Group>
      </Stack>

      <Stack>
        <Paper
          bg={
            incommingData?.status === 'correct'
              ? 'green.3'
              : incommingData?.status === 'partially correct'
                ? 'green.2'
                : incommingData?.status === 'incorrect'
                  ? 'red.3'
                  : 'red.3'
          }
        >
          <Stack justify="center">
            <Group justify="space-between" p="md">
              <Stack gap="0px">
                <Text fw={700} size="xl">
                  {incommingData?.status ? capitalize(incommingData?.status) : 'Not Attempted'}
                </Text>
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
    </Stack>
  );
};
