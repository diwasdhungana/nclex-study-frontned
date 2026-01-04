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
} from '@mantine/core';
import { p } from 'msw/lib/core/GraphQLHandler-Cu4Xvg4S';
import React, { useEffect, useRef, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';

const QuestionViewWithModes = ({ mode, data }: { mode: string; data: any }) => {
  switch (data.kind) {
    case 'Select One':
      return <SelectOnewithModes data={data} mode={mode} />;
    case 'Grid and Matrix':
      return <MatrixNGridwithModes data={data} mode={mode} />;
    case 'Highlight':
      return <HighlightwithModes data={data} mode={mode} />;
    case 'Extended Dropdown':
      return <ExtDropDownwithModes data={data} mode={mode} />;
    case 'Drag and Drop':
      return <DragNDropwithModes data={data} mode={mode} />;
    case 'Bowtie':
      return <BowTiewithModes data={data} mode={mode} />;
    case 'Select all that apply':
      return <McqwithModes data={data} mode={mode} />;
    case 'Fill in the blank':
      return <FillBlankswithModes data={data} mode={mode} />;
    default:
      return null;
  }
};
export default QuestionViewWithModes;

interface Option {
  value: string;
}

interface QuestionData {
  title: string;
  options: Option[];
  correct: number[];
  explanation: string;
}

const FillBlankswithModes = ({ data, mode }: { data: any; mode: any }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [answer, setAnswer] = useState<string>('');

  // Initialize answer state with the correct value
  useEffect(() => {
    if (data.correct) {
      setAnswer(data.correct.toString());
    }
  }, [data.correct]);
  // Regular expression to extract the unit value
  const trimmedInputString = data.title.trim();
  const unitPattern = /<<(.*?)>>/;
  const unitMatch = trimmedInputString.match(unitPattern);
  // Extract the unit value
  const unit = unitMatch ? unitMatch[1] : null;

  // Extract the other text excluding << and >>
  const title = data.title.replace(unitPattern, '').trim();

  return (
    <Stack gap="lg">
      {/* Display Question */}
      <div>
        <div dangerouslySetInnerHTML={{ __html: title }} className={css.htmlContentDisplay} />
        <Group>
          <input
            type="text"
            value={answer || ''}
            onChange={(e) => setAnswer(e.target.value)}
            contentEditable
            disabled
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              margin: '0 4px',
              minWidth: '100px',
            }}
          />
          <Text style={{ marginLeft: 8 }}>{unit}</Text>
        </Group>
      </div>

      {/* Submit Button & Explanation */}
      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(true)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}>Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

interface SelectOnewithModesProps {
  data: QuestionData;
  mode: any; // You might want to type this properly based on your needs
}

const SelectOnewithModes = ({ data, mode }: SelectOnewithModesProps) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // Function to check if a string is an image URL
  const isImageUrl = (str: string): boolean => {
    // Check if the string contains your S3 bucket URL or is a valid image URL
    return (
      str.startsWith('https://s3.ap-south-1.amazonaws.com/nclexstudy/') ||
      str.match(/\.(jpeg|jpg|gif|png)$/) !== null
    );
  };

  // Function to render either image or text based on the content
  const renderOption = (value: string) => {
    if (isImageUrl(value)) {
      return (
        <Image
          src={value}
          alt="Question option"
          fit="contain"
          radius="md"
          w={600}
          // Adjust size as needed
          h="auto"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/fallback-image.png'; // Add a fallback image path
          }}
        />
      );
    }
    return <Text>{value}</Text>;
  };

  return (
    <Stack gap="lg">
      {/* Question Title */}
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

      <Title order={3}>Options</Title>

      {/* Options */}
      <Stack gap="sm">
        {data.options.map((option: Option, index: number) => (
          <Group key={index} align="flex-start">
            <Radio
              checked={data.correct.includes(index)}
              style={{ marginTop: '8px' }} // Align radio with content
            />
            <div className={css.optionContainer}>{renderOption(option.value)}</div>
          </Group>
        ))}
      </Stack>

      {/* Explanation Section */}
      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(true)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}>Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

const HighlightwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // To reference the content div

  useEffect(() => {
    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, index) => {
      // element.onclick = () => handleClick(element.innerText, index);
      (element as HTMLElement).style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      (element as HTMLElement).style.display = 'inline';
      (element as HTMLElement).style.cursor = 'pointer';
      const found = data.correct.findIndex(
        (item: { value: string }) => item.value === (element as HTMLElement).innerText
      );
      if (found !== -1) {
        (element as HTMLElement).style.backgroundColor = 'yellow';
        (element as HTMLElement).style.color = 'black';
      }
    });
  });

  // const handleClick = (text, index) => {
  //   const newCorrect = correct;
  //   const found = newCorrect.findIndex((item) => item.text === text);
  //   if (found === -1) {
  //     newCorrect.push({ text, index });
  //   } else {
  //     newCorrect.splice(found, 1);
  //   }
  //   setCorrect(newCorrect);

  //   const elements = contentRef.current.querySelectorAll('.highlight');
  //   elements.forEach((element, i) => {
  //     if (newCorrect.findIndex((item) => item.index === i) !== -1) {
  //       element.style.backgroundColor = 'yellow';
  //       element.style.color = 'black';
  //     } else {
  //       // translucent yellow
  //       element.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
  //       element.style.color =
  //         colorScheme === 'light' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)';
  //     }
  //   });
  // };
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
      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(!showExplanation)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}> Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

const MatrixNGridwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <Stack gap="lg">
      <div dangerouslySetInnerHTML={{ __html: data.title }} />

      <Stack gap="sm" mt="md">
        <Table verticalSpacing="lg">
          <Table.Thead>
            <Table.Tr ta="center">
              {data.options.head.map((head: string) => (
                <Table.Td>
                  <Text> {head}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.options.rows.map((rowName: string, indexR: number) => (
              <Table.Tr key={indexR} ta="center">
                <Table.Td>
                  <Text>{rowName}</Text>
                </Table.Td>
                {data.options.head.map(
                  (head: string, index: number) =>
                    index > 0 && (
                      <Table.Td
                        key={index}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {data.radio === true ? (
                          <Group justify="center">
                            <Radio
                              type="radio"
                              name={`selectOptions${indexR}`}
                              checked={
                                data.correct.filter(
                                  (n: any) => n.key == rowName && n.values.includes(head)
                                ).length == 1
                              }
                            />
                          </Group>
                        ) : (
                          <Group justify="center">
                            <Checkbox
                              type="checkbox"
                              name={`selectOptions${indexR}`}
                              checked={
                                data.correct.filter(
                                  (n: any) => n.key == rowName && n.values.includes(head)
                                ).length == 1
                              }
                            />
                          </Group>
                        )}
                      </Table.Td>
                    )
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>

      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(!showExplanation)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}> Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

const ExtDropDownwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const [showExplanation, setShowExplanation] = useState(false);

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
          <Group key={groupIndex} gap="0px">
            {group.map((option) =>
              option.type === 'text' ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{ __html: option.value }}
                    key={option.id}
                    className={css.htmlContentDisplay}
                  />
                  &#160;
                </>
              ) : option.type === 'dropdown' ? (
                <>
                  <Select
                    data={option?.value?.map((o) => ({
                      value: o,
                      label: o,
                      disabled: mode == 'admin' ? true : false,
                    }))}
                    key={option.id}
                    defaultValue={
                      data.correct.find((o: { id: string; value: string }) => o.id === option.id)
                        .value
                    }
                  />
                  &#160;&#160;
                </>
              ) : null
            )}
          </Group>
        ))}
      </Stack>

      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(!showExplanation)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}> Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

interface MCQData {
  title: string;
  options: Option[];
  correct: number[];
  explanation: string;
}

interface McqwithModesProps {
  data: MCQData;
  mode: any; // Type this according to your needs
}

const McqwithModes = ({ data, mode }: McqwithModesProps) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // Function to check if a string is an image URL
  const isImageUrl = (str: string): boolean => {
    return (
      str.startsWith('https://s3.ap-south-1.amazonaws.com/nclexstudy/') ||
      str.match(/\.(jpeg|jpg|gif|png)$/) !== null
    );
  };

  // Function to render either image or text based on the content
  const renderOption = (value: string) => {
    if (isImageUrl(value)) {
      return (
        <div className={css.imageWrapper}>
          <Image
            src={value}
            alt="Question option"
            fit="contain"
            radius="md"
            w={600}
            h="auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/fallback-image.png'; // Add a fallback image path
            }}
          />
        </div>
      );
    }
    return <Text className={css.optionText}>{value}</Text>;
  };

  return (
    <Stack gap="lg">
      {/* Question Title with potential images */}
      <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

      <Title order={3}>Options</Title>

      {/* Options with images or text */}
      <Stack gap="md">
        {data.options.map((option: Option, index: number) => (
          <Group key={index} align="flex-start" className={css.optionGroup}>
            <Checkbox
              checked={data.correct.includes(index)}
              style={{ marginTop: '8px' }}
              radius="xs"
            />
            <div className={css.optionContainer}>{renderOption(option.value)}</div>
          </Group>
        ))}
      </Stack>

      {/* Explanation Section */}
      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(true)} variant="filled" radius="md">
            Submit
          </Button>
        </Group>
      ) : (
        <Stack className={css.explanationSection}>
          <Title order={2}>Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

const DragNDropwithModes = ({ data, mode }: { data: any; mode: any }) => {
  console.log(data);
  // Function to render the content with answers in place
  const [showExplanation, setShowExplanation] = useState(false);

  const renderContent = () => {
    if (!data.options?.title) return null;

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.options.title;

    // Function to process nodes and replace drop-containers
    const processNodes = (parentElement: HTMLElement): any => {
      return Array.from(parentElement.childNodes).map((node, index: number) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Text node
          return <span key={index}>{node.textContent}</span>;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if ((node as HTMLElement)?.classList.contains('drop-container')) {
            // Drop zone element
            const containerId = (node as HTMLElement)?.getAttribute('data-id');

            const correctAnswer = data.correct.find(
              (answer: { containerId: string }) => answer.containerId === containerId
            );

            return (
              <div
                key={index}
                style={{
                  border: '2px solid #4CAF50',
                  display: 'inline-block',
                  backgroundColor: '#E8F5E9',
                  padding: '10px',
                  width: '300px',
                  minHeight: '40px',
                  borderRadius: '5px',
                  margin: '2px 5px',
                }}
              >
                {correctAnswer?.value || 'notfound'}
              </div>
            );
          } else {
            // Other HTML elements (like <p>)
            return (
              // <node.tagName.toLowerCase() key={index}>
              //   {processNodes(node)}
              // </node.tagName.toLowerCase()>
              processNodes(node as HTMLElement)
            );
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

      {/* Main Content with Answers */}

      {renderContent()}
      {data.answersMustBeConsecutive && (
        <Text size="sm" c="red">
          Answers must be consecutive. (This text is not visible to students.)
        </Text>
      )}

      {/* All Options */}
      <Stack w="350px" style={{ border: '1px solid #ccc', borderRadius: '10px' }} mt="50px">
        <Group
          justify="center"
          className="bg-blue-100"
          h="50px"
          style={{ borderRadius: '10px 10px 0px 0px' }}
        >
          <Text fw={600}>All Options</Text>
        </Group>

        <Stack p="md" gap="sm">
          {data.options?.dragables?.map((item: { id: string; value: string }) => (
            <Group
              key={item.id}
              p="sm"
              bg="gray.2"
              style={{
                borderRadius: '5px',
                border: data.correct.some((c: any) => c.textId === item.id)
                  ? '2px solid #4CAF50'
                  : '1px solid #ddd',
              }}
            >
              <Text>{item.value}</Text>
              {data.correct.some((c: any) => c.textId === item.id) && (
                <Text size="25px" c="green" ml="auto">
                  ✓
                </Text>
              )}
            </Group>
          ))}
        </Stack>
      </Stack>

      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(!showExplanation)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}> Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};

const BowTiewithModes = ({ data, mode }: { data: any; mode: any }) => {
  console.log(data);
  const [showExplanation, setShowExplanation] = useState(false);

  const DropZone = ({ id, content, preText }: { id: string; content: string; preText: string }) => (
    <Paper
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
      withBorder={
        columnType === 'center'
          ? data.correct.center.id === item.id
            ? true
            : false
          : data.correct[columnType].find((c: any) => c.id === item.id)
            ? true
            : false
      }
      style={{ cursor: 'move', borderWidth: '3px', borderColor: 'green' }}
    >
      <Group justify="space-between">
        <Text size="sm" c={columnType.includes('center') ? 'black' : 'white'} fw={500}>
          {item.value}
        </Text>
        {columnType === 'center' ? (
          data.correct.center.id === item.id ? (
            <Text size="25px" c="black">
              ✓
            </Text>
          ) : (
            false
          )
        ) : data.correct[columnType].find((c: any) => c.id === item.id) ? (
          <Text size="25px" c="white">
            ✓
          </Text>
        ) : (
          false
        )}
        {/* {item.lifted ? (
          <Text size="sm" c="red">
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
                content={data.correct.left[0].value}
                preText={data.options.preDropText.left}
              />
            </Paper>
            <Paper pos="absolute" bottom={15} left={15} w="35%" h="20%">
              <DropZone
                id="bottomLeft"
                content={data.correct.left[1].value}
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
                content={data.correct.center.value}
                preText={data.options.preDropText.center}
              />
            </Paper>
            <Paper pos="absolute" top={15} right={15} w="35%" h="20%">
              <DropZone
                id="topRight"
                content={data.correct.right[0].value}
                preText={data.options.preDropText.right}
              />
            </Paper>
            <Paper pos="absolute" bottom={15} right={15} w="35%" h="20%">
              <DropZone
                id="bottomRight"
                content={data.correct.right[1].value}
                preText={data.options.preDropText.right}
              />
            </Paper>
          </Paper>
          <Group align="flex-start" justify="space-between" gap="xl">
            <WordChoices
              title={data.options.columnTitles.left}
              items={data.options.left}
              columnType="left"
            />

            <WordChoices
              title={data.options.columnTitles.center}
              items={data.options.center}
              columnType="center"
            />

            <WordChoices
              title={data.options.columnTitles.right}
              items={data.options.right}
              columnType="right"
            />
          </Group>
        </Stack>
      </Group>
      {!showExplanation ? (
        <Group>
          <Button onClick={() => setShowExplanation(!showExplanation)}>Submit</Button>
        </Group>
      ) : (
        <Stack>
          <Title order={2}> Explanation</Title>
          <div
            dangerouslySetInnerHTML={{ __html: data.explanation }}
            className={css.htmlContentDisplay}
          />
        </Stack>
      )}
    </Stack>
  );
};
