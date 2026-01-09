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

export const BowTiewithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
  const [answers, setAnswers] = useState<any>([]);
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>({});

  const [seconds, setSeconds] = useState(0); // Track elapsed time in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Track timer state
  const [dropZones, setDropZones] = useState({
    topLeft: { id: 'topLeft', content: '', contentId: null, allowedColumn: 'left' },
    bottomLeft: { id: 'bottomLeft', content: '', contentId: null, allowedColumn: 'left' },
    center: { id: 'center', content: '', contentId: null, allowedColumn: 'center' },
    topRight: { id: 'topRight', content: '', contentId: null, allowedColumn: 'right' },
    bottomRight: { id: 'bottomRight', content: '', contentId: null, allowedColumn: 'right' },
  });

  // Start timer on component mount
  useEffect(() => {
    if (data.attempted) {
      setIsTimerRunning(false);
      setIncommingData(data.result);
      setDropZones({
        topLeft: {
          id: 'topLeft',
          content: data.answers.left[0],
          contentId: data.answers.left[0],
          allowedColumn: 'left',
        },
        bottomLeft: {
          id: 'bottomLeft',
          content: data.answers.left[1],
          contentId: data.answers.left[1],
          allowedColumn: 'left',
        },
        center: {
          id: 'center',
          content: data.answers.center,
          contentId: data.answers.center,
          allowedColumn: 'center',
        },
        topRight: {
          id: 'topRight',
          content: data.answers.right[0],
          contentId: data.answers.right[0],
          allowedColumn: 'right',
        },
        bottomRight: {
          id: 'bottomRight',
          content: data.answers.right[1],
          contentId: data.answers.right[1],
          allowedColumn: 'right',
        },
      });
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
          answers: {
            left: [dropZones.topLeft.content, dropZones.bottomLeft.content],
            right: [dropZones.topRight.content, dropZones.bottomRight.content],
            center: dropZones.center.content,
          },
          kind: data.kind,
        },
        route: {
          testId: data.testId,
        },
      },
      {
        onSuccess: (data) => {
          setAttempted(true);
          setIncommingData(data);
          // set all the dragables to lifted false
          setLeftItems((items) => items.map((item) => ({ ...item, lifted: false })));
          setCenterItems((items) => items.map((item) => ({ ...item, lifted: false })));
          setRightItems((items) => items.map((item) => ({ ...item, lifted: false })));
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

  const [leftItems, setLeftItems] = useState<{ id: string; text: string; lifted: boolean }[]>([]);

  const [centerItems, setCenterItems] = useState<{ id: string; text: string; lifted: boolean }[]>(
    []
  );

  const [rightItems, setRightItems] = useState<{ id: string; text: string; lifted: boolean }[]>([]);

  useEffect(() => {
    setLeftItems(
      data.options.left.map((item: any) => ({
        id: item.id,
        text: item.value,
        lifted: false,
      }))
    );
    setRightItems(
      data.options.right.map((item: any) => ({
        id: item.id,
        text: item.value,
        lifted: false,
      }))
    );
    setCenterItems(
      data.options.center.map((item: any) => ({
        id: item.id,
        text: item.value,
        lifted: false,
      }))
    );
  }, [data.options.center, data.options.left, data.options.right]);
  const handleDrop = (e: any, zoneId: keyof typeof dropZones) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e.dataTransfer.getData('object'));
    const columnType: 'left' | 'center' | 'right' = e.dataTransfer.getData('columnType');

    if (dropZones[zoneId].allowedColumn !== columnType) {
      return;
    }

    setDropZones((prev) => {
      const newZones = { ...prev };
      const oldContentId = newZones[zoneId].contentId;

      if (oldContentId) {
        const setterMap = {
          left: setLeftItems,
          center: setCenterItems,
          right: setRightItems,
        };
        setterMap[columnType]((items) =>
          items.map((item) => (item.id === oldContentId ? { ...item, lifted: false } : item))
        );
      }

      newZones[zoneId] = {
        ...newZones[zoneId],
        content: draggedItem.text,
        contentId: draggedItem.id,
      };
      return newZones;
    });

    const setterMap = {
      left: setLeftItems,
      center: setCenterItems,
      right: setRightItems,
    };
    setterMap[columnType]((items) =>
      items.map((item) => (item.id === draggedItem.id ? { ...item, lifted: true } : item))
    );
  };

  const handleClear = (zoneId: keyof typeof dropZones) => {
    const zone = dropZones[zoneId];
    if (!zone.contentId) return;

    const setterMap = {
      left: setLeftItems,
      center: setCenterItems,
      right: setRightItems,
    };

    setterMap[zone.allowedColumn as 'left' | 'center' | 'right']((items: any) =>
      items.map((item: any) => (item.id === zone.contentId ? { ...item, lifted: false } : item))
    );

    setDropZones((prev: any) => ({
      ...prev,
      [zoneId]: { ...prev[zoneId], content: '', contentId: null },
    }));
  };
  const DropZone = ({ id, content, preText }: { id: string; content: string; preText: string }) => (
    <Paper
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, id as any)}
      onClick={() => !attempted && handleClear(id as any)}
      bg={id.includes('Right') ? 'grape.1' : id.includes('Left') ? 'blue.1' : 'gray.1'}
      w="100%"
      h="100%"
      style={{ cursor: 'pointer' }}
    >
      <Group justify="center" align="center" h="100%">
        {content ? (
          <Paper
            w="90%"
            h="80%"
            bg={id.includes('Right') ? 'grape.5' : id.includes('Left') ? 'blue.5' : 'gray.4'}
            p="sm"
            radius="md"
          >
            <Stack align="center" justify="center" h="100%">
              <Text size="md" ta="center" c={id.includes('center') ? 'black' : 'white'} fw={500}>
                {content}
              </Text>
            </Stack>
          </Paper>
        ) : (
          <Stack align="center" justify="center" h="100%" p="sm">
            <Text size="sm" ta="center">
              {preText}
            </Text>
          </Stack>
        )}
      </Group>
    </Paper>
  );

  const DraggableItem = ({ item, columnType }: { item: any; columnType: string }) => (
    <Paper
      draggable={attempted ? false : true}
      onDragStart={(e) => {
        e.dataTransfer.setData('object', JSON.stringify(item));
        e.dataTransfer.setData('columnType', columnType);
      }}
      bg={
        columnType.includes('right') ? 'grape.5' : columnType.includes('left') ? 'blue.5' : 'gray.4'
      }
      p="sm"
      mb="xs"
      // withBorder={
      //   columnType === 'center'
      //     ? data.correct.center.id === item.id
      //       ? true
      //       : false
      //     : data.correct[columnType].find((c: any) => c.id === item.id)
      //       ? true
      //       : false
      // }
      style={{ cursor: 'move', borderWidth: '3px', borderColor: 'green' }}
    >
      <Group justify="space-between">
        <Text size="sm" c={columnType.includes('center') ? 'black' : 'white'} fw={500}>
          {item.text}
        </Text>
        {columnType === 'center' ? (
          incommingData?.correctAnswers?.center?.id === item?.id ? (
            <Text size="25px" c="black">
              ✓
            </Text>
          ) : (
            false
          )
        ) : incommingData?.correctAnswers &&
          incommingData?.correctAnswers[columnType]?.find((c: any) => c.id === item.id) ? (
          <Text size="25px" c="white">
            ✓
          </Text>
        ) : (
          false
        )}
        {/* {item.lifted ? (
          <Text size="sm" c="#ff4136">
            ✗
          </Text>
        ) : (
          <Text size="sm" c="green">
            ✓
          </Text>
        )} */}
      </Group>
    </Paper>
  );

  const WordChoices = ({
    title,
    items,
    columnType,
  }: {
    title: string;
    items: any;
    columnType: string;
  }) => (
    <Paper shadow="xs" p="md" w={210} radius="md">
      <Group justify="center" mb="sm">
        <Title order={5}>{title}</Title>
      </Group>
      <Stack gap="xs">
        {items
          .filter((item: { lifted: boolean }) => !item.lifted)
          .map((item: { id: string }) => (
            <DraggableItem key={item.id} item={item} columnType={columnType} />
          ))}
      </Stack>
    </Paper>
  );
  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

      <Group justify="center" mt="xl">
        <Stack>
          <Paper pos="relative" w="45vw" h="40vh" p="xl" withBorder>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '30%',
                width: '3px',
                height: '40%',
                backgroundColor: '#339af0',
                transform: 'translate(-50%, -100%) rotate(-45deg)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '30%',
                width: '3px',
                height: '40%',
                backgroundColor: '#cc5de8',
                transform: 'translate(-50%, -100%) rotate(45deg)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '30%',
                width: '3px',
                height: '40%',
                backgroundColor: '#339af0',
                transform: 'translate(-50%, 0%) rotate(45deg)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '30%',
                width: '3px',
                height: '40%',
                backgroundColor: '#cc5de8',
                transform: 'translate(-50%, 0%) rotate(-45deg)',
                zIndex: 0,
              }}
            />
            <Paper pos="absolute" top={15} left={15} w="35%" h="20%">
              <DropZone
                id="topLeft"
                content={dropZones.topLeft.content}
                preText={data.options.preDropText.left}
              />
            </Paper>
            <Paper pos="absolute" bottom={15} left={15} w="35%" h="20%">
              <DropZone
                id="bottomLeft"
                content={dropZones.bottomLeft.content}
                preText={data.options.preDropText.left}
              />
            </Paper>
            <Paper
              pos="absolute"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              w="35%"
              h="20%"
            >
              <DropZone
                id="center"
                content={dropZones.center.content}
                preText={data.options.preDropText.center}
              />
            </Paper>
            <Paper pos="absolute" top={15} right={15} w="35%" h="20%">
              <DropZone
                id="topRight"
                content={dropZones.topRight.content}
                preText={data.options.preDropText.right}
              />
            </Paper>
            <Paper pos="absolute" bottom={15} right={15} w="35%" h="20%">
              <DropZone
                id="bottomRight"
                content={dropZones.bottomRight.content}
                preText={data.options.preDropText.right}
              />
            </Paper>
          </Paper>
          <Group align="flex-start" justify="space-between" gap="xl">
            <WordChoices
              title={data.options.columnTitles.left}
              items={leftItems}
              columnType="left"
            />

            <WordChoices
              title={data.options.columnTitles.center}
              items={centerItems}
              columnType="center"
            />

            <WordChoices
              title={data.options.columnTitles.right}
              items={rightItems}
              columnType="right"
            />
          </Group>
        </Stack>
      </Group>
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
