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
import { usePostArcherAnswer } from '@/hooks';
import React, { useEffect, useRef, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';
import { array } from 'prop-types';

export const HighlightwithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostArcherAnswer();
  const [answers, setAnswers] = useState<any>([]);
  const [attempted, setAttempted] = useState(data.attempted);
  const [incommingData, setIncommingData] = useState<any>({});

  const [seconds, setSeconds] = useState(0); // Track elapsed time in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Track timer state

  // Start timer on component mount
  useEffect(() => {
    if (data.attempted) {
      setIsTimerRunning(false);
      setIncommingData(data.result);
    }

    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [isTimerRunning]);
  // useEffect(() => {
  //   console.log('this is answers', answers);
  //   answers.map((answer: any) => {
  //     handleClick(answer.text, answer.index);
  //   });
  // }, [answers]);

  const handleSubmit = () => {
    setIsTimerRunning(false); // Stop timer
    postAnswer(
      {
        variables: {
          questionIndex: data.thisIndex,
          questionId: data._id,
          answers: answers.map((item: any) => ({
            value: item.text,
          })),
          kind: data.kind,
        },
        route: {
          testId: data.testId,
        },
      },
      {
        onSuccess: (data) => {
          setIncommingData(data);
          setAttempted(true);
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
  const contentRef = useRef<HTMLDivElement>(null); // To reference the content div
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, index) => {
      if (data?.answers) {
        const found = data?.answers.findIndex(
          (item: any) => item.value === (element as HTMLElement).innerText
        );
        if (found !== -1) {
          (element as HTMLElement).style.backgroundColor = 'yellow';
          (element as HTMLElement).style.color = 'black';
        }
      }
      if (attempted) {
        (element as HTMLElement).style.pointerEvents = 'none';
        const foundCorrect = incommingData?.correctAnswers?.findIndex(
          (item: any) => item.value === element.innerHTML
        );
        if (foundCorrect !== -1) {
          (element as HTMLElement).style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
          // for some reason, if i change anything except the bg color it's applied to all elements
        }
      }
      (element as HTMLElement).onmouseover = () =>
        handleMouseOver((element as HTMLElement).innerText, index);
      (element as HTMLElement).onmouseout = () =>
        handleMouseOut((element as HTMLElement).innerText, index);
      (element as HTMLElement).onclick = () =>
        handleClick((element as HTMLElement).innerText, index);
      // element.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      (element as HTMLElement).style.display = 'inline';
      (element as HTMLElement).style.cursor = 'pointer';
    });
  });

  const handleMouseOver = (text: string, index: number) => {
    const newCorrect = answers;
    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, i) => {
      if (
        newCorrect.findIndex((item: any) => item?.index === i) === -1 &&
        (element as HTMLElement).innerHTML === text
      ) {
        (element as HTMLElement).style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
      }
    });
  };
  const handleMouseOut = (text: string, index: number) => {
    const newCorrect = answers;
    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, i) => {
      if (
        newCorrect.findIndex((item: any) => item.index === i) === -1 &&
        (element as HTMLElement).innerHTML === text
      ) {
        (element as HTMLElement).style.backgroundColor = 'transparent';
      }
    });
  };

  const handleClick = (text: string, index: number) => {
    const newCorrect = answers;
    const found = newCorrect.findIndex((item: any) => item.text === text);
    if (found === -1) {
      newCorrect.push({ text, index });
    } else {
      newCorrect.splice(found, 1);
    }
    setAnswers(newCorrect);

    const elements = contentRef?.current?.querySelectorAll('.highlight');
    elements?.forEach((element, i) => {
      if (newCorrect.findIndex((item: any) => item.index === i) !== -1) {
        (element as HTMLElement).style.backgroundColor = 'yellow';
        (element as HTMLElement).style.color = 'black';
      } else {
        // translucent yellow
        (element as HTMLElement).style.backgroundColor = 'transparent';
        (element as HTMLElement).style.color =
          colorScheme === 'light' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)';
      }
    });
  };
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
