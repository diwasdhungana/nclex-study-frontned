import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { usePostAnswer } from '@/hooks';
import React, { useEffect, useState } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { capitalize } from '@/utilities/text';

export const FillBlankswithModes = ({ data, mode }: { data: any; mode: any }) => {
  const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
  const [answer, setAnswer] = useState<string>(data.answers?.value || '');
  const [attempted, setAttempted] = useState(data.attempted);
  const [incomingData, setIncomingData] = useState<any>(data.result);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(!data.attempted);

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (isTimerRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Regular expression to extract the unit value
  const unitPattern = /<<(.*?)>>/;

  const unitMatch = data.title.match(unitPattern);

  // Extract the unit value
  const unit = unitMatch ? unitMatch[1] : null;

  // Extract the other text excluding << and >>
  const title = data.title.replace(unitPattern, '').trim();

  // Submit Answer
  const handleSubmit = () => {
    if (!answer.trim()) {
      setErrorMessage('Please enter an answer before submitting.');
      return;
    }

    setIsTimerRunning(false);
    postAnswer(
      {
        variables: {
          questionIndex: data.thisIndex,
          questionId: data.id,
          answers: parseInt(answer),
          kind: data.kind,
        },
        route: { testId: data.testId },
      },
      {
        onSuccess: (response) => {
          setIncomingData(response);
          setAttempted(true);
        },
        onError: () => setErrorMessage('An error occurred while submitting your answer.'),
      }
    );
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  // Get correct answer from response
  const correctAnswer = incomingData?.correctAnswers;

  return (
    <Stack gap="lg">
      {/* Question Title */}
      <div dangerouslySetInnerHTML={{ __html: title }} className={css.htmlContentDisplay} />

      {/* Answer Input with Unit */}
      <Group align="flex-start">
        <input
          type="text"
          value={data.answers}
          disabled={attempted}
          onChange={(e) => {
            setErrorMessage(null);
            setAnswer(e.target.value);
          }}
          style={{
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '100px', // Smaller width
          }}
        />
        {unit && <Text style={{ marginLeft: 8 }}>{unit}</Text>}
      </Group>

      {/* Submit Button or Result Display */}
      {/* {!attempted ? (
        <Stack>
          {errorMessage && <Text c="#ff4136">{errorMessage}</Text>}
          <Group>
            <Button loading={postAnswerPending} onClick={handleSubmit}>
              Submit
            </Button>
          </Group>
        </Stack>
      ) : ( */}
      <Stack>
        {/* Correct Answer Display */}
        {incomingData?.status === 'incorrect' && (
          <Text fw={500} size="lg">
            Correct Answer: {correctAnswer}
          </Text>
        )}
        <Paper
          bg={
            incomingData?.status === 'correct'
              ? 'green.3'
              : incomingData?.status === 'incorrect'
                ? '#ff6259'
                : 'grey.2'
          }
        >
          <Stack justify="center">
            <Group justify="space-between" p="md">
              <Stack gap="0px">
                <Text fw={700} size="xl">
                  {incomingData?.status && capitalize(incomingData?.status)}
                </Text>
              </Stack>
              <Stack align="center" gap="0px">
                <Group gap="3px">
                  <Text fw={700} size="30px">
                    {incomingData?.pointsObtained}
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

        {/* Explanation */}
        <Title order={2}>Explanation</Title>
        <div
          dangerouslySetInnerHTML={{ __html: incomingData?.explanation }}
          className={css.htmlContentDisplay}
        />
      </Stack>
      {/* )} */}
    </Stack>
  );
};

// import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
// import { usePostAnswer } from '@/hooks';
// import React, { useEffect, useState } from 'react';
// import css from '@/pages/dashboard/everything.module.css';
// import { capitalize } from '@/utilities/text';

// export const FillBlankswithModes = ({ data, mode }: { data: any; mode: any }) => {
//   const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
//   const [answer, setAnswer] = useState<string>(data.answers?.value || '');
//   const [attempted, setAttempted] = useState(data.attempted);
//   const [incomingData, setIncomingData] = useState<any>(data.result || {});
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const [seconds, setSeconds] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(!data.attempted);

//   // Timer Logic
//   useEffect(() => {
//     let timer: any;
//     if (isTimerRunning) {
//       timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isTimerRunning]);

//   // Submit Answer
//   const handleSubmit = () => {
//     if (!answer.trim()) {
//       setErrorMessage('Please enter an answer before submitting.');
//       return;
//     }

//     setIsTimerRunning(false);
//     postAnswer(
//       {
//         variables: {
//           questionIndex: data.thisIndex,
//           questionId: data.id,
//           answers: parseInt(answer),
//           kind: data.kind,
//         },
//         route: { testId: data.testId },
//       },
//       {
//         onSuccess: (response) => {
//           setIncomingData(response);
//           setAttempted(true);
//         },
//         onError: () => setErrorMessage('An error occurred while submitting your answer.'),
//       }
//     );
//   };

//   const minutes = Math.floor(seconds / 60);
//   const displaySeconds = seconds % 60;

//   // Get correct answer from response
//   const correctAnswer = incomingData?.correctAnswers;

//   return (
//     <Stack gap="lg">
//       {/* Question Title */}
//       <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

//       {/* Answer Input */}
//       <input
//         type="text"
//         value={answer}
//         disabled={attempted}
//         onChange={(e) => {
//           setErrorMessage(null);
//           setAnswer(e.target.value);
//         }}
//         style={{
//           padding: '4px 8px',
//           border: '1px solid #ddd',
//           borderRadius: '4px',
//           minWidth: '150px',
//         }}
//       />

//       {/* Submit Button or Result Display */}
//       {!attempted ? (
//         <Stack>
//           {errorMessage && <Text c="#ff4136">{errorMessage}</Text>}
//           <Group>
//             <Button loading={postAnswerPending} onClick={handleSubmit}>
//               Submit
//             </Button>
//           </Group>
//         </Stack>
//       ) : (
//         <Stack>
//           {/* Correct Answer Display */}
//           {incomingData?.status === 'incorrect' && (
//             <Text fw={500} size="lg">
//               Correct Answer: {correctAnswer}
//             </Text>
//           )}
//           <Paper
//             bg={
//               incomingData?.status === 'correct'
//                 ? 'green.3'
//                 : incomingData?.status === 'incorrect'
//                   ? '#ff6259'
//                   : 'grey.2'
//             }
//           >
//             <Stack justify="center">
//               <Group justify="space-between" p="md">
//                 <Stack gap="0px">
//                   <Text fw={700} size="xl">
//                     {incomingData?.status && capitalize(incomingData?.status)}
//                   </Text>
//                   {(minutes > 0 || displaySeconds > 0) && (
//                     <Stack gap="0px" align="center">
//                       <Group gap="3px">
//                         <Text fw={700} size="xl">
//                           {minutes}
//                         </Text>
//                         <Text size="sm">min,</Text>
//                         <Text fw={700} size="xl">
//                           {displaySeconds}
//                         </Text>
//                         <Text size="sm">sec</Text>
//                       </Group>
//                       <Text fw={500} size="sm">
//                         Time Spent
//                       </Text>
//                     </Stack>
//                   )}
//                 </Stack>
//                 <Stack align="center" gap="0px">
//                   <Group gap="3px">
//                     <Text fw={700} size="30px">
//                       {incomingData?.pointsObtained}
//                     </Text>
//                     <Text fw={500} size="md">
//                       /
//                     </Text>
//                     <Text fw={500} size="md">
//                       {data.points}
//                     </Text>
//                   </Group>
//                   <Text size="sm">Scored/Max</Text>
//                 </Stack>
//               </Group>
//             </Stack>
//           </Paper>

//           {/* Explanation */}
//           <Title order={2}>Explanation</Title>
//           <div
//             dangerouslySetInnerHTML={{ __html: incomingData?.explanation }}
//             className={css.htmlContentDisplay}
//           />
//         </Stack>
//       )}
//     </Stack>
//   );
// };

// import { Button, Group, Paper, Select, Stack, Text, Title } from '@mantine/core';
// import { usePostAnswer } from '@/hooks';
// import React, { useEffect, useState } from 'react';
// import css from '@/pages/dashboard/everything.module.css';
// import { capitalize } from '@/utilities/text';
// import { useNavigate } from 'react-router-dom';

// export const FillBlankswithModes = ({
//   data,
//   mode,
//   testsLoading,
//   testError,
// }: {
//   data: any;
//   mode: any;
//   testsLoading: boolean;
//   testError: boolean;
// }) => {
//   const navigate = useNavigate();
//   const { mutate: postAnswer, isPending: postAnswerPending } = usePostAnswer();
//   const [answer, setAnswer] = useState<string>(data.answers?.value || '');
//   const [attempted, setAttempted] = useState(data.attempted);
//   const [incomingData, setIncomingData] = useState<any>(data.result || {});
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const [seconds, setSeconds] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(!data.attempted);

//   // Log the data prop for debugging
//   console.log('Data prop:', data);

//   // Timer Logic
//   useEffect(() => {
//     let timer: any;
//     if (isTimerRunning) {
//       timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isTimerRunning]);

//   // Submit Answer
//   const handleSubmit = () => {
//     console.log('Submitting answer:', answer); // Log the answer
//     if (!answer.trim()) {
//       setErrorMessage('Please enter an answer before submitting.');
//       return;
//     }

//     setIsTimerRunning(false);
//     postAnswer(
//       {
//         variables: {
//           questionIndex: data.thisIndex,
//           questionId: data.id,
//           answers: parseInt(answer),
//           kind: data.kind,
//         },
//         route: { testId: data.testId },
//       },
//       {
//         onSuccess: (response) => {
//           console.log('Response from server:', response); // Log the response
//           setIncomingData(response);
//           setAttempted(true);
//         },
//         onError: () => setErrorMessage('An error occurred while submitting your answer.'),
//       }
//     );
//   };

//   const minutes = Math.floor(seconds / 60);
//   const displaySeconds = seconds % 60;
//   const correctAnswer = incomingData?.correctAnswers;

//   // Defensive check for data.test and data.test.questions
//   const questions = data.test?.questions || [];
//   console.log('Questions:', questions); // Log the questions

//   return (
//     <Stack gap="lg">
//       {/* Question Navigation */}
//       {!testsLoading && !testError && data.testStatus !== 'completed' ? (
//         <Select
//           data={questions.map((q: any, i: number) => ({
//             value: i.toString(),
//             label: `Question ${i + 1}` + (q.attempted ? ' (Attempted)' : ''),
//           }))}
//           placeholder="Select a question"
//           value={data.thisIndex.toString()}
//           onChange={(value: string | null, option: any) => {
//             console.log('Selected value:', value); // Log the selected value
//             if (value !== null) {
//               console.log(
//                 'Navigating to:',
//                 `/dashboard/student/test?testId=${data.testId}&i=${value}&t=${questions.length}`
//               );
//               navigate(
//                 `/dashboard/student/test?testId=${data.testId}&i=${value}&t=${questions.length}`
//               );
//               setTimeout(() => window.location.reload(), 10);
//             }
//           }}
//         />
//       ) : (
//         <Text>Test is already completed</Text>
//       )}

//       {/* Question Content */}
//       <div dangerouslySetInnerHTML={{ __html: data.title }} className={css.htmlContentDisplay} />

//       {/* Answer Input */}
//       <input
//         type="text"
//         value={answer}
//         disabled={attempted}
//         onChange={(e) => {
//           console.log('Input value:', e.target.value); // Log the input value
//           setErrorMessage(null);
//           setAnswer(e.target.value);
//         }}
//         style={{
//           padding: '4px 8px',
//           border: '1px solid #ddd',
//           borderRadius: '4px',
//           minWidth: '150px',
//         }}
//       />

//       {/* Submit Button or Result Display */}
//       {!attempted ? (
//         <Stack>
//           {errorMessage && <Text c="#ff4136">{errorMessage}</Text>}
//           <Group>
//             <Button loading={postAnswerPending} onClick={handleSubmit}>
//               Submit
//             </Button>
//           </Group>
//         </Stack>
//       ) : (
//         <Stack>
//           {/* Correct Answer Display */}
//           {incomingData?.status === 'incorrect' && (
//             <Text fw={500} size="lg">
//               Correct Answer: {correctAnswer}
//             </Text>
//           )}
//           <Paper
//             bg={
//               incomingData?.status === 'correct'
//                 ? 'green.3'
//                 : incomingData?.status === 'incorrect'
//                   ? '#ff6259'
//                   : 'grey.2'
//             }
//           >
//             <Stack justify="center">
//               <Group justify="space-between" p="md">
//                 <Stack gap="0px">
//                   <Text fw={700} size="xl">
//                     {incomingData?.status && capitalize(incomingData?.status)}
//                   </Text>
//                   {(minutes > 0 || displaySeconds > 0) && (
//                     <Stack gap="0px" align="center">
//                       <Group gap="3px">
//                         <Text fw={700} size="xl">
//                           {minutes}
//                         </Text>
//                         <Text size="sm">min,</Text>
//                         <Text fw={700} size="xl">
//                           {displaySeconds}
//                         </Text>
//                         <Text size="sm">sec</Text>
//                       </Group>
//                       <Text fw={500} size="sm">
//                         Time Spent
//                       </Text>
//                     </Stack>
//                   )}
//                 </Stack>
//                 <Stack align="center" gap="0px">
//                   <Group gap="3px">
//                     <Text fw={700} size="30px">
//                       {incomingData?.pointsObtained}
//                     </Text>
//                     <Text fw={500} size="md">
//                       /
//                     </Text>
//                     <Text fw={500} size="md">
//                       {data.points}
//                     </Text>
//                   </Group>
//                   <Text size="sm">Scored/Max</Text>
//                 </Stack>
//               </Group>
//             </Stack>
//           </Paper>

//           {/* Explanation */}
//           <Title order={2}>Explanation</Title>
//           <div
//             dangerouslySetInnerHTML={{ __html: incomingData?.explanation }}
//             className={css.htmlContentDisplay}
//           />
//         </Stack>
//       )}
//     </Stack>
//   );
// };
