import {
  Button,
  Group,
  InputLabel,
  Paper,
  Combobox as ComboBox,
  InputBase,
  Space,
  Stack,
  TextInput,
  Title,
  useCombobox,
  Text,
} from '@mantine/core';
import React, { useRef, useState, useLayoutEffect } from 'react';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';
import css from '@/pages/dashboard/everything.module.css';
import { generateId } from '@/utilities/uid';

// Base option type that all option types extend from
interface BaseOption {
  id: string;
  type: string;
  name: string;
}

// Specific option types for different field types
interface TextOption extends BaseOption {
  type: 'text';
  value: string;
}

interface DropdownOption extends BaseOption {
  type: 'dropdown';
  value: string[];
}

interface NextLineOption extends BaseOption {
  type: 'next-line';
  value: 'next-line';
}

// Union type for all possible option types
type Option = TextOption | DropdownOption | NextLineOption;

// Type for correct answer entries
interface CorrectAnswer {
  id: string;
  value: string;
}

// Response type for error handling
interface Response {
  titleError?: string;
  optionsError?: string;
  explanationError?: string;
  [key: string]: string | undefined;
}

// Props for the main ExtDropDown component
interface ExtDropDownProps {
  dataTunnel: {
    options: Option[];
    title: string;
    points: number;
    explanation: string;
    correctAnswer: CorrectAnswer[];
    [key: string]: any;
  };
  response: Response;
  setResponse: React.Dispatch<React.SetStateAction<Response>>;
}

// Props for the ComboBoxComponent
interface ComboBoxComponentProps {
  option: DropdownOption;
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  options: Option[];
  correctAnswer: CorrectAnswer[];
  setCorrectAnswer: React.Dispatch<React.SetStateAction<CorrectAnswer[]>>;
  id: string;
}

// Type for the editor refs
type EditorRefs = Map<string, HTMLDivElement>;

/**
 * ExtDropDown Component
 * A form component that allows creation of text and dropdown fields with support for correct answers
 */
export const ExtDropDown: React.FC<ExtDropDownProps> = ({
  dataTunnel,
  response,
  setResponse,
}: any) => {
  const editorRefs = useRef<EditorRefs>(new Map());
  const [counter, setCounter] = useState<number>(1);
  const [options, setOptions] = useState<Option[]>([
    { type: 'text', value: 'type..', name: 'text 0', id: generateId() },
    { type: 'dropdown', value: [], name: 'dropdown 0', id: generateId() },
  ]);
  const [title, setTitle] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [points, setPoints] = useState<number>(5);
  const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const handleFocus = (id: string): void => {
    setFocusedId(id);
  };

  const moveCaretToEnd = (id: string): void => {
    const selection = window.getSelection();
    const range = document.createRange();
    const editorElement = editorRefs.current.get(id);

    if (editorElement && selection) {
      range.selectNodeContents(editorElement);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useLayoutEffect(() => {
    if (focusedId) {
      moveCaretToEnd(focusedId);
    }
  }, [options, focusedId]);

  const groupOptions = (options: Option[]): Option[][] => {
    const groups: Option[][] = [];
    let currentGroup: Option[] = [];

    options.forEach((option) => {
      if (option.type === 'next-line') {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [];
      } else {
        currentGroup.push(option);
      }
    });

    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  };

  const groupedOptions = groupOptions(options);

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type : Extended Dropdown
      </Title>
      <Group>
        <TextInput
          label="Points (1-20)"
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value))}
          placeholder="Points"
          min={1}
          max={20}
        />
      </Group>
      <InputLabel>Main Question (Title)</InputLabel>
      {response.titleError && <Text c="red">{response.titleError}</Text>}
      <RichTextEditorComponent
        content={title}
        setContent={(item: string) => setTitle(item)}
        index={0}
      />
      <Stack mt="md">
        <InputLabel>Text with dropdown</InputLabel>
        <Stack>
          {groupedOptions.map((group, groupIndex) => (
            <Group key={groupIndex}>
              &#9166;
              {group.map((option) =>
                option.type === 'text' ? (
                  <Group gap="0px" key={option.id}>
                    ⓣ
                    <div
                      key={option.id}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      ref={(el) => el && editorRefs.current.set(option.id, el)}
                      dangerouslySetInnerHTML={{ __html: option.value }}
                      className={css.htmlContentDisplay}
                      onFocus={() => handleFocus(option.id)}
                      onInput={(event: React.FormEvent<HTMLDivElement>) => {
                        const input = event.currentTarget.innerHTML;
                        setFocusedId(option.id);
                        setOptions((prevOptions: any) =>
                          prevOptions.map((opt: any) =>
                            opt.id === option.id ? { ...opt, value: input } : opt
                          )
                        );
                      }}
                    />
                  </Group>
                ) : option.type === 'dropdown' ? (
                  <ComboBoxComponent
                    option={option as DropdownOption}
                    setOptions={setOptions}
                    options={options}
                    id={option.id}
                    correctAnswer={correctAnswer}
                    setCorrectAnswer={setCorrectAnswer}
                    key={option.id}
                  />
                ) : null
              )}
            </Group>
          ))}
        </Stack>
        {response.optionsError && <Text c="red">{response.optionsError}</Text>}
        <Group justify="space-between" mt="md">
          <Group>
            <Button
              size="sm"
              onClick={() => {
                const newField: TextOption = {
                  type: 'text',
                  value: '',
                  name: `text ${counter}`,
                  id: generateId(),
                };
                setOptions([...options, newField]);
                setCounter(counter + 1);
                setFocusedId(newField.id);
              }}
            >
              Add Text field
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setOptions([
                  ...options,
                  { type: 'dropdown', value: [], name: `dropdown ${counter}`, id: generateId() },
                ]);
                setCounter(counter + 1);
                setFocusedId('');
              }}
            >
              Add Dropdown
            </Button>

            <Button
              size="sm"
              onClick={() => {
                if (options[options.length - 1].type === 'next-line') return;
                setOptions([
                  ...options,
                  {
                    type: 'next-line',
                    id: generateId(),
                    value: 'next-line',
                    name: `next-line ${counter}`,
                  },
                ]);
                setFocusedId('');
              }}
            >
              &#9166; New Line
            </Button>
          </Group>
          {options.length > 0 && (
            <Button
              bg="red"
              onClick={() => {
                if (options.findLast((opt) => opt.type === 'dropdown') && options.length > 1) {
                  setCorrectAnswer((prevCorrectAnswers) =>
                    prevCorrectAnswers.filter(
                      (answer) => answer.id !== options[options.length - 1].id
                    )
                  );
                }
                setOptions(options.slice(0, options.length - 1));
                setCounter(counter + 1);
              }}
            >
              Remove Last field
            </Button>
          )}
        </Group>
      </Stack>

      <InputLabel mt="lg">Explanation (Shown after Answer Submit.)</InputLabel>
      {response.explanationError && <Text c="red">{response.explanationError}</Text>}
      <RichTextEditorComponent
        index={0}
        content={explanation}
        setContent={(item: string) => setExplanation(item)}
      />
      <Space h="lg" />

      <SubmitQuestion
        dataTunnel={() => ({ ...dataTunnel, options, title, points, explanation, correctAnswer })}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};

/**
 * ComboBoxComponent
 * A dropdown component that allows selection and creation of new options
 */
const ComboBoxComponent: React.FC<ComboBoxComponentProps> = ({
  option,
  setOptions,
  options,
  correctAnswer,
  setCorrectAnswer,
  id,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState<string>('');
  const exactOptionMatch = option.value.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? option.value
    : option.value.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()));

  const handleOptionSubmit = (val: string) => {
    if (val === '$create') {
      const newOptions = options.map((opt) =>
        opt.id === id ? { ...opt, value: [...opt.value, search] } : opt
      );
      setOptions(newOptions as Option[]);
      setSearch('');
    } else {
      setSearch(val);

      setCorrectAnswer((prevCorrectAnswers) => {
        const existingAnswerIndex = prevCorrectAnswers.findIndex((answer) => answer.id === id);

        if (existingAnswerIndex >= 0) {
          const updatedAnswers = [...prevCorrectAnswers];
          updatedAnswers[existingAnswerIndex].value = val;
          return updatedAnswers;
        } else {
          return [...prevCorrectAnswers, { id, value: val }];
        }
      });
    }
    combobox.closeDropdown();
  };

  return (
    <ComboBox store={combobox} withinPortal={false} onOptionSubmit={handleOptionSubmit}>
      <ComboBox.Target>
        <InputBase
          rightSection={<ComboBox.Chevron />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            combobox.openDropdown();
          }}
          placeholder={option.name}
          rightSectionPointerEvents="none"
        />
      </ComboBox.Target>

      <ComboBox.Dropdown>
        <ComboBox.Options>
          {filteredOptions.map((item) => (
            <ComboBox.Option key={item} value={item}>
              {item}
            </ComboBox.Option>
          ))}
          {!exactOptionMatch && search.trim().length > 0 && (
            <ComboBox.Option value="$create">+ Create {search}</ComboBox.Option>
          )}
        </ComboBox.Options>
      </ComboBox.Dropdown>
    </ComboBox>
  );
};
