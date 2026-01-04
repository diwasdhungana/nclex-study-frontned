import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Group,
  InputLabel,
  NumberInput,
  Paper,
  Space,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';
import { generateId } from '@/utilities/uid';
import css from '@/pages/dashboard/everything.module.css';

export const DragNDrop = ({ dataTunnel, response, setResponse }: any) => {
  const inputRefs = useRef<any[]>([]);
  const contentRef = useRef(null);
  const [consecutive, setConsecutive] = useState(false);

  const [mainText, setMainText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(5);
  const [dropZones, setDropZones] = useState<
    { id: string; contentId: string | null; content: string }[]
  >([]);
  const [inputDone, setInputDone] = useState(false);
  const [dragables, setDragables] = useState([
    { id: generateId(), text: 'opt 1', lifted: false },
    { id: generateId(), text: 'opt 2', lifted: false },
    { id: generateId(), text: 'opt 3', lifted: false },
  ]);

  // Process mainText and create dropZones when text is finalized
  useEffect(() => {
    if (inputDone) {
      const processText = () => {
        let newText = mainText;
        const newDropZones: {
          id: string;
          contentId: string | null;
          content: string;
        }[] = [];

        // Replace marked text with drop zone placeholders
        newText = newText.replace(/<mark>(.*?)<\/mark>/g, () => {
          const zoneId = generateId();
          newDropZones.push({
            id: zoneId,
            contentId: null,
            content: '',
          });
          return `###DROP_ZONE_${zoneId}###`;
        });

        setProcessedText(newText);
        setDropZones(newDropZones);
      };

      processText();
    }
  }, [inputDone, mainText]);

  const handleDrop = (e: DragEvent, dropZoneId: string) => {
    e.preventDefault();
    const draggedItem = JSON.parse(e?.dataTransfer?.getData('object') || '{}');

    setDropZones((zones) =>
      zones.map((zone: any) => {
        if (zone.id === dropZoneId) {
          if (zone.contentId) {
            setDragables((prev) =>
              prev.map((d) => (d.id === zone.contentId ? { ...d, lifted: false } : d))
            );
          }
          return {
            ...zone,
            contentId: draggedItem?.id,
            content: draggedItem?.text,
          };
        }
        return zone;
      })
    );

    setDragables((prev) => prev.map((d) => (d.id === draggedItem.id ? { ...d, lifted: true } : d)));
  };

  const handleClear = (dropZoneId: any) => {
    setDropZones((zones) =>
      zones.map((zone: any) => {
        if (zone.id === dropZoneId && zone.contentId) {
          setDragables((prev) =>
            prev.map((d) => (d.id === zone.contentId ? { ...d, lifted: false } : d))
          );
          return { ...zone, contentId: null, content: '' };
        }
        return zone;
      })
    );
  };

  const resetAll = () => {
    setDragables((prev) => prev.map((d) => ({ ...d, lifted: false })));
    setDropZones((zones) => zones.map((zone) => ({ ...zone, contentId: null, content: '' })));
  };

  const renderContent = () => {
    if (!inputDone) return null;

    const segments = processedText.split(/###DROP_ZONE_([^#]+)###/);
    return (
      <Group align="end">
        {segments.map((segment, index) => {
          if (index % 2 === 0) {
            // Regular text segment
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: segment }}
                className={css.htmlContentDisplay}
              />
            );
          } else {
            // Drop zone
            const zone = dropZones.find((z: any) => z.id === segment);
            return (
              <div
                key={segment}
                className="drop-container"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e as any, segment)}
                onClick={() => handleClear(segment)}
                style={{
                  border: '1px solid black',
                  display: 'inline',
                  backgroundColor: '#dee2e6',
                  cursor: 'pointer',
                  padding: '10px',
                  width: '300px',
                  minHeight: '40px',
                  borderRadius: '5px',
                  margin: '0 5px',

                  // verticalAlign: 'middle',
                }}
              >
                {zone?.content || ''}
              </div>
            );
          }
        })}
      </Group>
    );
  };

  const getFinalContent = () => {
    let content = processedText;
    dropZones.forEach((zone) => {
      const placeholder = `###DROP_ZONE_${zone.id}###`;
      const replacement = `<div class="drop-container" data-id="${zone.id}"></div>`;
      content = content.replace(placeholder, replacement);
    });
    return content;
  };

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type: Drag and Drop
      </Title>

      <Group>
        <NumberInput
          label="Points (1-20)"
          value={points}
          onChange={(e) => setPoints(Number(e))}
          placeholder="Points"
          min={1}
          max={20}
        />
      </Group>
      {/* toggle for answere must be Consecutive */}
      <Switch
        my="md"
        label="Answer must be Consecutive"
        checked={consecutive}
        onChange={(e) => setConsecutive(e.currentTarget.checked)}
      />

      <InputLabel>Main Question (Title)</InputLabel>
      {response.titleError && <Text c="red">{response.titleError}</Text>}
      <RichTextEditorComponent content={title} setContent={setTitle} index={0} />

      <Stack mt="md">
        {inputDone ? (
          <>
            <div ref={contentRef}>
              <Group>{renderContent()}</Group>
              <Button
                onClick={() => {
                  setInputDone(false);
                  resetAll();
                  setProcessedText('');
                }}
                bg="red"
                w="100px"
              >
                Edit Text
              </Button>
              {response.optionsError && <Text c="red">{response.optionsError}</Text>}
              <Stack w="350px" mt="lg" style={{ border: '1px solid #000', borderRadius: '10px' }}>
                <Group
                  justify="center"
                  className="bg-blue-100"
                  h="50px"
                  style={{ borderRadius: '10px 10px 0px 0px' }}
                >
                  <Text className="font-semibold">Word Choices</Text>
                </Group>

                <Stack p="sm">
                  {dragables
                    .filter((item) => !item.lifted)
                    .map((item, index) => (
                      <Group gap="0px">
                        <Group
                          key={item.id}
                          draggable
                          onDragStart={(e) =>
                            e.dataTransfer.setData('object', JSON.stringify(item))
                          }
                          p="5px"
                          bg="gray.3"
                          mih="45px"
                          style={{ borderRadius: '5px' }}
                          w="80%"
                        >
                          <TextInput
                            ref={(el) => {
                              if (inputRefs.current) {
                                inputRefs.current[index] = el;
                              }
                            }}
                            // onFocus={() => handleFocus(index)}
                            value={item.text}
                            onChange={(e) => {
                              setDragables((prev) =>
                                prev.map((d) =>
                                  d.id === item.id ? { ...d, text: e.target.value } : d
                                )
                              );
                            }}
                            w="100%"
                            variant="unstyled"
                          />
                        </Group>
                        <Button
                          variant="subtle"
                          size="md"
                          radius="sm"
                          w="19%"
                          onClick={() => {
                            setDragables((prev) => prev.filter((d) => d.id !== item.id));
                          }}
                        >
                          {' '}
                          X
                        </Button>
                      </Group>
                    ))}
                </Stack>

                <Group p="sm">
                  <Button
                    onClick={() =>
                      setDragables((prev) => [
                        ...prev,
                        {
                          id: generateId(),
                          text: 'New draggable item',
                          lifted: false,
                        },
                      ])
                    }
                  >
                    Add Item
                  </Button>
                  <Button onClick={resetAll}>Reset All</Button>
                </Group>
              </Stack>
            </div>
          </>
        ) : (
          <Stack>
            <InputLabel className="mb-4">Highlight text to create drop zones</InputLabel>
            <RichTextEditorComponent content={mainText} setContent={setMainText} index={0} />
            <Button onClick={() => setInputDone(true)} bg="green" w="100px">
              Done
            </Button>
          </Stack>
        )}
      </Stack>

      <InputLabel mt="lg">Explanation (Shown after submission)</InputLabel>
      {response.explanationError && <Text c="red">{response.explanationError}</Text>}

      <RichTextEditorComponent content={explanation} setContent={setExplanation} index={0} />

      <Space h="lg" />

      <SubmitQuestion
        dataTunnel={() => ({
          ...dataTunnel,
          options: {
            title: getFinalContent(),
            dragables: dragables.map((item) => ({ value: item.text, id: item.id })),
          },
          title,
          points,
          explanation,
          consecutive,
          correct: dropZones
            .map((zone) => ({
              value: zone.content,
              textId: zone.contentId,
              containerId: zone.id,
            }))
            .filter((item) => item.textId !== null),
        })}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};

// export default DragNDrop;
