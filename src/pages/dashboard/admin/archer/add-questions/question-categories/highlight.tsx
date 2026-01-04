import {
  Button,
  Checkbox,
  Group,
  InputLabel,
  NumberInput,
  Paper,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';
import css from '@/pages/dashboard/everything.module.css';

export const Highlight = ({ dataTunnel, response, setResponse }: any) => {
  const { colorScheme } = useMantineColorScheme();
  const inputRefs = useRef<any[]>([]); // To hold multiple refs
  const contentRef = useRef<HTMLDivElement>(null); // To reference the content div
  const [mainText, setMainText] = useState('');
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(5);
  const [toSend, setToSend] = useState({});
  const [correct, setCorrect] = useState<{ value: string; index: number }[]>([]);

  const handleFocus = (index: number) => {
    // Select the text inside the input on focus
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
    }
  };
  useEffect(() => {
    const updatedContent = mainText
      .replace(/<mark>/g, '<div class="highlight" >')
      .replace(/<\/mark>/g, '</div>')
      .replace(/<p>/g, '<div>')
      .replace(/<\/p>/g, '</div>');
    setToSend(updatedContent);
    // console.clear();
    // console.log(updatedContent);
  }, [mainText]);

  useEffect(() => {
    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, index) => {
      (element as HTMLElement).onclick = () =>
        handleClick((element as HTMLElement).innerText, index);
      (element as HTMLElement).style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      (element as HTMLElement).style.display = 'inline';
      // set cursor to pointer on hover
      (element as HTMLElement).style.cursor = 'pointer';
    });
  }, [toSend]);

  const handleClick = (text: string, index: number) => {
    const newCorrect = correct;
    const found = newCorrect.findIndex((item) => item.value === text);
    if (found === -1) {
      newCorrect.push({ value: text, index });
    } else {
      newCorrect.splice(found, 1);
    }
    setCorrect(newCorrect);

    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, i) => {
      if (newCorrect.findIndex((item) => item.index === i) !== -1) {
        (element as HTMLElement).style.backgroundColor = 'yellow';
        (element as HTMLElement).style.color = 'black';
      } else {
        // translucent yellow
        (element as HTMLElement).style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
        (element as HTMLElement).style.color =
          colorScheme === 'light' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)';
      }
    });
  };

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type : Highlight
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
      <Stack mt="md">
        <Stack gap="0px">
          <InputLabel>
            Highlight all possible options (type this text completely before highlighting.)
          </InputLabel>
          <RichTextEditorComponent
            content={mainText}
            setContent={(item) => {
              setMainText(item);
            }}
            index={0}
          />
        </Stack>
        {/* <Space h="sm" /> */}
        {response.optionsError && <Text c="red">{response.optionsError}</Text>}

        <Text c="green">Select the correct answers from options below.</Text>
        <Group>
          <div
            // className="content"
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: toSend }}
            className={css.htmlContentDisplay}
          />
        </Group>
      </Stack>
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
        dataTunnel={() => ({ ...dataTunnel, options: toSend, title, points, explanation, correct })}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};
