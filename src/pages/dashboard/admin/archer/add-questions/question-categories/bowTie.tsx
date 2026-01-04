import React, { useState } from 'react';
import {
  Button,
  Group,
  InputLabel,
  NumberInput,
  Paper,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { generateId } from '@/utilities/uid';
import { SubmitQuestion } from '../utils/SubmitQuestion';

export const BowTie = ({ dataTunnel, response, setResponse }: any) => {
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(5);

  // State for drag items in each column
  const [leftItems, setLeftItems] = useState([
    { id: generateId(), text: 'Left Option 1', lifted: false },
  ]);

  const [centerItems, setCenterItems] = useState([
    { id: generateId(), text: 'Center Option 1', lifted: false },
  ]);

  const [rightItems, setRightItems] = useState([
    { id: generateId(), text: 'Right Option 1', lifted: false },
  ]);
  const [wordChoiceTitles, setWordChoicesTitle] = useState({
    left: 'Actions to Take',
    center: 'Potential Conditions',
    right: 'Parameters',
  });
  const [wordChoicePretext, setWordChoicesPretext] = useState({
    left: 'Actions to Take',
    center: 'Condition most likely experiencing',
    right: 'Parameter to moniter',
  });
  const [newOptionsOne, setNewOptionsOne] = useState({ right: '', left: '', center: '' });

  // State for drop zones
  const [dropZones, setDropZones] = useState({
    topLeft: { id: 'topLeft', content: '', contentId: null, allowedColumn: 'left' },
    bottomLeft: { id: 'bottomLeft', content: '', contentId: null, allowedColumn: 'left' },
    center: { id: 'center', content: '', contentId: null, allowedColumn: 'center' },
    topRight: { id: 'topRight', content: '', contentId: null, allowedColumn: 'right' },
    bottomRight: { id: 'bottomRight', content: '', contentId: null, allowedColumn: 'right' },
  });

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
      onClick={() => handleClear(id as any)}
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

  const DraggableItem = ({
    item,
    columnType,
    setItems,
  }: {
    item: { id: string; text: string; lifted: boolean };
    columnType: string;
    setItems: any;
  }) => (
    <Paper
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('object', JSON.stringify(item));
        e.dataTransfer.setData('columnType', columnType);
      }}
      bg={
        columnType.includes('right') ? 'grape.5' : columnType.includes('left') ? 'blue.5' : 'gray.4'
      }
      p="sm"
      mb="xs"
      style={{ cursor: 'move' }}
      w="90%"
    >
      <Text size="sm" c={columnType.includes('center') ? 'black' : 'white'} fw={500}>
        {item.text}
      </Text>
    </Paper>
  );

  const WordChoices = ({
    title,
    items,
    setItems,
    columnType,
  }: {
    title: string;
    items: {
      id: string;
      text: string;
      lifted: boolean;
    }[];

    setItems: any;
    columnType: string;
  }) => (
    <Paper shadow="xs" p="md" w={210} radius="md">
      {/* <Group justify="center" mb="sm">{title}</Group> */}
      <Stack gap="xs">
        {items
          .filter((item) => !item.lifted)
          .map((item) => (
            <Group preventGrowOverflow={false} grow gap="0px">
              <DraggableItem
                key={item.id}
                item={item}
                setItems={setItems}
                columnType={columnType}
              />
              <Button
                variant="subtle"
                c="black"
                p="0px"
                w="10%"
                mb="sm"
                onClick={() => {
                  setItems((prev: any) => prev.filter((i: any) => i.id !== item.id));
                }}
              >
                {' '}
                X
              </Button>
            </Group>
          ))}
      </Stack>
    </Paper>
  );

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type : Bow Tie
      </Title>

      <Group>
        <NumberInput
          label="Points (1-20)"
          value={points}
          onChange={(val) => setPoints(val as number)}
          min={1}
          max={20}
        />
      </Group>

      <Stack mt="md">
        <InputLabel>Title</InputLabel>
        {response.titleError && <Text c="red">{response.titleError}</Text>}
        <RichTextEditorComponent content={title} setContent={setTitle} index={0} />
      </Stack>
      <Group justify="center" mt="xl">
        <Stack>
          <Group align="flex-start" justify="space-between" gap="xl">
            <TextInput
              label="Left pre-drop Text"
              value={wordChoicePretext.left}
              w={200}
              fw={700}
              onChange={(event) => {
                setWordChoicesPretext((prev) => ({ ...prev, left: event.target.value }));
              }}
            />
            <TextInput
              label="Center pre-drop Text"
              value={wordChoicePretext.center}
              w={200}
              fw={700}
              onChange={(event) => {
                setWordChoicesPretext((prev) => ({ ...prev, center: event.target.value }));
              }}
            />
            <TextInput
              label="Right pre-drop Text"
              value={wordChoicePretext.right}
              w={200}
              fw={700}
              onChange={(event) => {
                setWordChoicesPretext((prev) => ({ ...prev, right: event.target.value }));
              }}
            />
          </Group>
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
                preText={wordChoicePretext.left}
              />
            </Paper>
            <Paper pos="absolute" bottom={15} left={15} w="35%" h="20%">
              <DropZone
                id="bottomLeft"
                content={dropZones.bottomLeft.content}
                preText={wordChoicePretext.left}
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
                preText={wordChoicePretext.center}
              />
            </Paper>
            <Paper pos="absolute" top={15} right={15} w="35%" h="20%">
              <DropZone
                id="topRight"
                content={dropZones.topRight.content}
                preText={wordChoicePretext.right}
              />
            </Paper>
            <Paper pos="absolute" bottom={15} right={15} w="35%" h="20%">
              <DropZone
                id="bottomRight"
                content={dropZones.bottomRight.content}
                preText={wordChoicePretext.right}
              />
            </Paper>
          </Paper>

          <Group align="flex-start" justify="space-between" gap="xl">
            <Stack>
              <TextInput
                label="Column Heading"
                value={wordChoiceTitles.left}
                w={200}
                fw={700}
                onChange={(event) => {
                  setWordChoicesTitle((prev) => ({ ...prev, left: event.target.value }));
                  // I am talking about htis part here.
                }}
              />
              <WordChoices
                title={wordChoiceTitles.left}
                items={leftItems}
                setItems={setLeftItems}
                columnType="left"
              />
              <TextInput
                value={newOptionsOne?.left}
                w={200}
                fw={700}
                placeholder="Add new Left Option"
                onChange={(event) => {
                  setNewOptionsOne((prev) => ({ ...prev, left: event.target.value }));
                }}
              />
              <Button
                onClick={() => {
                  setLeftItems((prev) => [
                    ...prev,
                    {
                      id: generateId(),
                      text: newOptionsOne?.left,
                      lifted: false,
                    },
                  ]);
                  setNewOptionsOne((prev) => ({ ...prev, left: '' }));
                }}
                mt="md"
                fullWidth
                disabled={!newOptionsOne?.left}
              >
                Add Item
              </Button>
            </Stack>
            <Stack>
              <TextInput
                label="Column Heading"
                value={wordChoiceTitles.center}
                w={200}
                fw={700}
                onChange={(event) => {
                  setWordChoicesTitle((prev) => ({ ...prev, center: event.target.value }));
                  // I am talking about htis part here.
                }}
              />
              <WordChoices
                title={wordChoiceTitles.center}
                items={centerItems}
                setItems={setCenterItems}
                columnType="center"
              />
              <TextInput
                value={newOptionsOne?.center}
                w={200}
                fw={700}
                placeholder="Add new Center Option"
                onChange={(event) => {
                  setNewOptionsOne((prev) => ({ ...prev, center: event.target.value }));
                }}
              />
              <Button
                onClick={() => {
                  setCenterItems((prev) => [
                    ...prev,
                    {
                      id: generateId(),
                      text: newOptionsOne?.center,
                      lifted: false,
                    },
                  ]);
                  setNewOptionsOne((prev) => ({ ...prev, center: '' }));
                }}
                mt="md"
                fullWidth
                disabled={!newOptionsOne?.center}
              >
                Add Item
              </Button>
            </Stack>
            <Stack>
              <TextInput
                label="Column Heading"
                value={wordChoiceTitles.right}
                w={200}
                fw={700}
                onChange={(event) => {
                  setWordChoicesTitle((prev) => ({ ...prev, right: event.target.value }));
                  // I am talking about htis part here.
                }}
              />
              <WordChoices
                title={wordChoiceTitles.right}
                items={rightItems}
                setItems={setRightItems}
                columnType="right"
              />
              <TextInput
                value={newOptionsOne?.right}
                w={200}
                fw={700}
                placeholder="Add new Right Option"
                onChange={(event) => {
                  setNewOptionsOne((prev) => ({ ...prev, right: event.target.value }));
                }}
              />

              <Button
                onClick={() => {
                  setRightItems((prev) => [
                    ...prev,
                    {
                      id: generateId(),
                      text: newOptionsOne?.right,
                      lifted: false,
                    },
                  ]);
                  setNewOptionsOne((prev) => ({ ...prev, right: '' }));
                }}
                mt="md"
                fullWidth
                disabled={!newOptionsOne?.right}
              >
                Add Item
              </Button>
            </Stack>
          </Group>
          <Group justify="center">
            <Button
              bg="red"
              w="200px"
              onClick={() => {
                const newleftItems = leftItems.map((item) => ({ ...item, lifted: false }));
                setLeftItems(newleftItems);
                const newCenterItems = centerItems.map((item) => ({ ...item, lifted: false }));
                setCenterItems(newCenterItems);
                const newRightItems = rightItems.map((item) => ({ ...item, lifted: false }));
                setRightItems(newRightItems);
                setDropZones({
                  topLeft: { id: 'topLeft', content: '', contentId: null, allowedColumn: 'left' },
                  bottomLeft: {
                    id: 'bottomLeft',
                    content: '',
                    contentId: null,
                    allowedColumn: 'left',
                  },
                  center: { id: 'center', content: '', contentId: null, allowedColumn: 'center' },
                  topRight: {
                    id: 'topRight',
                    content: '',
                    contentId: null,
                    allowedColumn: 'right',
                  },
                  bottomRight: {
                    id: 'bottomRight',
                    content: '',
                    contentId: null,
                    allowedColumn: 'right',
                  },
                });
              }}
            >
              Reset All
            </Button>
          </Group>
          {response.optionsError && <Text c="red">{response.optionsError}</Text>}
        </Stack>
      </Group>

      <Stack mt="xl">
        <InputLabel>Explanation</InputLabel>
        {response.explanationError && <Text c="red">{response.explanationError}</Text>}
        <RichTextEditorComponent content={explanation} setContent={setExplanation} index={0} />
      </Stack>

      {/* <Space h="lg" />

      <Button
        onClick={() => {
          const data = {
            ...dataTunnel,
            options: {
              left: leftItems.map(({ id, text }) => ({ id, value: text })),
              center: centerItems.map(({ id, text }) => ({ id, value: text })),
              right: rightItems.map(({ id, text }) => ({ id, value: text })),
            },
            correct: {
              topLeft: { value: dropZones.topLeft.content, id: dropZones.topLeft.contentId },
              bottomLeft: {
                value: dropZones.bottomLeft.content,
                id: dropZones.bottomLeft.contentId,
              },
              center: { value: dropZones.center.content, id: dropZones.center.contentId },
              topRight: { value: dropZones.topRight.content, id: dropZones.topRight.contentId },
              bottomRight: {
                value: dropZones.bottomRight.content,
                id: dropZones.bottomRight.contentId,
              },
            },
            title,
            points,
            explanation,
          };
          dataTunnel(data);
        }}
      >
        Submit
      </Button> */}
      <Space h="lg" />

      <SubmitQuestion
        dataTunnel={() => ({
          ...dataTunnel,
          options: {
            left: leftItems.map(({ id, text }) => ({ id, value: text })),
            center: centerItems.map(({ id, text }) => ({ id, value: text })),
            right: rightItems.map(({ id, text }) => ({ id, value: text })),
            preDropText: wordChoicePretext,
            columnTitles: wordChoiceTitles,
          },
          title,
          points,
          explanation,
          correct: {
            left: [
              { value: dropZones.topLeft.content, id: dropZones.topLeft.contentId },
              {
                value: dropZones.bottomLeft.content,
                id: dropZones.bottomLeft.contentId,
              },
            ],
            center: { value: dropZones.center.content, id: dropZones.center.contentId },
            right: [
              { value: dropZones.topRight.content, id: dropZones.topRight.contentId },
              {
                value: dropZones.bottomRight.content,
                id: dropZones.bottomRight.contentId,
              },
            ],
          },
        })}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};
