import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { usePostAnswer } from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';

export const DragNDropwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
  const [answers, setAnswers] = useState<any>(data.attempted ? data.answers : null);
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>(data.result);

  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  // New drag and drop state and handlers
  const [draggedItems, setDraggedItems] = useState<{ [key: string]: string }>(
    data.attempted
      ? data.answers.reduce((acc: any, ans: any) => {
          acc[ans.containerId] = ans.value;
          return acc;
        }, {})
      : []
  );

  const handleDragStart = (e: React.DragEvent, item: { id: string; value: string }) => {
    !attempted && e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    if (attempted) return answers;
    const droppedItem = JSON.parse(e.dataTransfer.getData('text/plain'));

    // Update dragged items state
    setDraggedItems((prev) => ({
      ...prev,
      [containerId]: droppedItem.value,
    }));

    // Update answers for submission
    setAnswers((prev: any) => {
      // Remove any previous answer for this container
      const filteredAnswers = prev.filter((ans: any) => ans.containerId !== containerId);

      // Add new answer
      return [
        ...filteredAnswers,
        {
          value: droppedItem.value,
          id: droppedItem.id,
          containerId: containerId,
        },
      ];
    });
  };

  const renderContent = () => {
    if (!data.options?.title) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.options.title;

    const processNodes = (parentElement: HTMLElement): any => {
      return Array.from(parentElement.childNodes).map((node, index: number) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return <span key={index}>{node.textContent}</span>;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if ((node as HTMLElement)?.classList.contains('drop-container')) {
            const containerId = (node as HTMLElement)?.getAttribute('data-id');

            // Show dropped item or empty drop zone
            return (
              <div
                key={index}
                // onDragOver={handleDragOver}
                // onDrop={(e) => handleDrop(e, containerId!)}
                style={{
                  border: '2px dashed #4CAF50',
                  display: 'inline-block',
                  backgroundColor: draggedItems[containerId!] ? '#E8F5E9' : '#f0f0f0',
                  padding: '10px',
                  width: '300px',
                  minHeight: '40px',
                  borderRadius: '5px',
                  margin: '2px 5px',
                  cursor: 'pointer',
                }}
              >
                <Group justify="space-between">
                  {answers?.find((ans: any) => ans.containerId === containerId)?.value}
                  {draggedItems[containerId!] ===
                  incommingData?.correctAnswers?.find((ans: any) => ans.containerId === containerId)
                    ?.value ? (
                    <Text size="30px" c="green">
                      ✓
                    </Text>
                  ) : (
                    <Text c="#ff4136" size="md">
                      (
                      {
                        incommingData?.correctAnswers?.find(
                          (ans: any) => ans.containerId === containerId
                        )?.value
                      }
                      )
                    </Text>
                  )}
                </Group>
              </div>
            );
          } else {
            return processNodes(node as HTMLElement);
          }
        }
        return null;
      });
    };

    return <div>{processNodes(tempDiv)}</div>;
  };

  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

      {renderContent()}

      {/* All Options */}
      <Stack w="350px" style={{ border: '1px solid #ccc', borderRadius: '10px' }} mt="50px">
        <Group
          justify="center"
          className="bg-blue-100"
          h="50px"
          style={{ borderRadius: '10px 10px 0px 0px' }}
        >
          <Text fw={600}>Word Choices</Text>
        </Group>

        <Stack p="md" gap="sm">
          {data.options?.dragables
            ?.filter(
              (item: { id: string; value: string }) =>
                !Object.values(draggedItems).includes(item.value)
            )
            .map((item: { id: string; value: string }) => (
              <Group
                key={item.id}
                draggable
                // onDragStart={(e) => handleDragStart(e, item)}
                p="sm"
                bg="gray.2"
                style={{
                  borderRadius: '5px',
                  cursor: 'move',
                }}
              >
                <Text>{item.value}</Text>
              </Group>
            ))}
        </Stack>
      </Stack>

      <Stack>
        <Paper
          bg={
            incommingData?.status === 'correct'
              ? 'green.3'
              : incommingData?.status === 'partially correct'
                ? 'green.2'
                : incommingData?.status === 'incorrect'
                  ? '#ff6259'
                  : '#ff6259'
          }
        >
          <Stack justify="center">
            <Group justify="space-between" p="md">
              <Stack gap="0px">
                <Text fw={700} size="xl">
                  {incommingData?.status ? capitalize(incommingData?.status) : 'Not Attempted'}
                </Text>
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
