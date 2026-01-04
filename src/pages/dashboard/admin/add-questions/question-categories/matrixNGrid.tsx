import React, { useEffect } from 'react';
import {
  Button,
  Group,
  InputLabel,
  Paper,
  Space,
  Stack,
  Textarea,
  TextInput,
  Title,
  NumberInput,
  Table,
  Select,
  Checkbox,
  Radio,
  Text,
} from '@mantine/core';
import { useRef, useState } from 'react';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';
export const MatrixNGrid = ({ dataTunnel, response, setResponse }: any) => {
  const inputRefs = useRef<any[]>([]); // To hold multiple refs
  const [options, setOptions] = useState([
    [{ value: 'sickness' }, { value: 'has Sickness' }, { value: 'no sickness' }],
    [
      { value: 'cough and cold' },
      { value: 'option 0', checked: false },
      { value: 'option 1', checked: false },
    ],
  ]);
  const [gridRows, setGridRows] = useState(2);
  const [gridColumns, setGridColumns] = useState(3);
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(5);
  const [selectionType, setSelectionType] = useState('radio');

  const handleFocus = (index: number) => {
    // Select the text inside the input on focus
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
    }
  };

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type : Matrix And Grid
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
      <InputLabel>Main Question (Title)</InputLabel>
      {response.titleError && <Text c="red">{response.titleError}</Text>}
      <RichTextEditorComponent
        content={title}
        setContent={(item, index) => {
          setTitle(item);
        }}
        index={0}
      />
      <Group mt="md">
        <NumberInput
          label="Number of Rows"
          name="rows"
          min={2}
          max={10}
          defaultValue={2}
          onChange={(e) => {
            const newOptions = options;
            if (options.length > Number(e)) {
              newOptions.splice(Number(e), options.length - Number(e));
            } else {
              while (newOptions.length < Number(e)) {
                newOptions.push(
                  Array.from({ length: gridColumns }).map((_, index) => ({
                    value: 'option ' + newOptions.length,
                    checked: false,
                  }))
                );
              }
            }
            setOptions([...newOptions]);
            setGridRows(Number(e));
          }}
          w="200px"
        />
        <NumberInput
          label="Number of Columns"
          name="columns"
          min={3}
          max={9}
          defaultValue={3}
          onChange={(e) => {
            const newOptions = options;
            if (options[0].length > Number(e)) {
              newOptions.map((opt) => {
                opt.splice(Number(e), opt.length - Number(e));
                return opt;
              });
            } else {
              newOptions.map((opt) => {
                while (opt.length < Number(e)) {
                  opt.push({ value: 'option ' + opt.length, checked: false });
                }
                return opt;
              });
            }
            setOptions([...newOptions]);
            setGridColumns(Number(e));
          }}
          w="200px"
        />
        <Select
          label="Selection Type"
          data={[
            { value: 'radio', label: 'Radio' },
            { value: 'checkbox', label: 'Checkbox' },
          ]}
          value={selectionType}
          onChange={(value) => {
            //change all options to unchecked
            const newOptions = options.map((opt) => {
              return opt.map((op) => ({ ...op, checked: false }));
            });
            setOptions(newOptions);
            setSelectionType(value as string);
          }}
          placeholder="Selection Type"
          allowDeselect={false}
          w="200px"
        />
      </Group>
      {response.optionsError && <Text c="red">{response.optionsError}</Text>}

      <Table mt="lg">
        <Table.Thead>
          <Table.Tr>
            {Array.from({ length: gridColumns }).map((_, index) => (
              <Table.Th key={index}>
                <Textarea
                  variant="unstyled"
                  value={options[0][index].value}
                  ref={(el) => (inputRefs.current[index] = el)} // Assigning refs for each input
                  onFocus={() => handleFocus(index)} // Triggering select on focus
                  onChange={(e) => {
                    const newOptions = options;
                    newOptions[0][index].value = e.target.value;
                    setOptions([...newOptions]);
                  }}
                  autosize
                  minRows={2}
                  w="90%"
                />
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: gridRows - 1 }).map((_, indexR) => (
            <Table.Tr key={indexR}>
              {Array.from({ length: gridColumns }).map((_, index) => (
                <Table.Td key={index}>
                  {index === 0 ? (
                    <Textarea
                      value={options[indexR + 1][index].value}
                      onChange={(e) => {
                        const newOptions = options;
                        newOptions[indexR + 1][index].value = e.target.value;
                        setOptions([...newOptions]);
                      }}
                      autosize
                      minRows={2}
                      w="100%"
                    />
                  ) : selectionType === 'radio' ? (
                    <Radio
                      type="radio"
                      name={`selectOptions${indexR}`}
                      checked={options[indexR + 1][index].checked}
                      onChange={(e) => {
                        const newOptions = options;
                        // uncheck all other options
                        newOptions[indexR + 1].map((opt) => {
                          opt.checked = false;
                          return opt;
                        });
                        newOptions[indexR + 1][index].checked = true;
                        setOptions([...newOptions]);
                      }}
                    />
                  ) : (
                    <Checkbox
                      type="checkbox"
                      name={`selectOptions${indexR}`}
                      value={options[indexR + 1][index].value}
                      checked={options[indexR + 1][index].checked}
                      onChange={(e) => {
                        const newOptions = options;
                        newOptions[indexR + 1][index].checked =
                          !newOptions[indexR + 1][index].checked;
                        setOptions([...newOptions]);
                      }}
                    />
                  )}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <InputLabel mt="lg">Explanation (Shown after Answer Submit.)</InputLabel>
      {response.explanationError && <Text c="red">{response.explanationError}</Text>}

      <RichTextEditorComponent
        content={explanation}
        setContent={(item, index) => {
          setExplanation(item);
        }}
        index={0}
      />
      <Space h="lg" />
      <SubmitQuestion
        dataTunnel={() => ({ ...dataTunnel, options, title, points, explanation, selectionType })}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};
