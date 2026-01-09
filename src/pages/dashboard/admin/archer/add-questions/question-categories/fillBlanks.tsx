// import React, { useState } from 'react';
// import {
//   Button,
//   Paper,
//   Text,
//   Stack,
//   Group,
//   NumberInput,
//   TextInput,
//   Modal,
//   Title,
//   InputLabel,
// } from '@mantine/core';
// import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';

// interface Blank {
//   id: string;
//   correctAnswer: string;
//   placeholder: string; // e.g., "{blank-1}"
// }

// export const FillBlanks = ({ dataTunnel, response, setResponse }: any) => {
//   const [question, setQuestion] = useState('');
//   const [blanks, setBlanks] = useState<Blank[]>([]);
//   const [points, setPoints] = useState(5);
//   const [explanation, setExplanation] = useState('');
//   const [selectedRange, setSelectedRange] = useState<Range | null>(null); // Track selected range
//   const [showAddBlankModal, setShowAddBlankModal] = useState(false);
//   const [newBlankAnswer, setNewBlankAnswer] = useState(''); // Track input for new blank

//   // Handle text selection in the RichTextEditor
//   const handleTextSelection = () => {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       setSelectedRange(selection.getRangeAt(0)); // Save the selected range
//       setShowAddBlankModal(true);
//     }
//   };

//   // Add a new blank
//   const handleAddBlank = () => {
//     if (!newBlankAnswer.trim()) {
//       setResponse({ ...response, blankModalError: 'Correct answer is required.' });
//       return;
//     }

//     const newBlank: Blank = {
//       id: `blank-${blanks.length + 1}`,
//       correctAnswer: newBlankAnswer,
//       placeholder: `{blank-${blanks.length + 1}}`,
//     };

//     // Insert placeholder at the saved cursor position
//     if (selectedRange) {
//       const placeholderNode = document.createTextNode(newBlank.placeholder);
//       selectedRange.deleteContents();
//       selectedRange.insertNode(placeholderNode);
//       setSelectedRange(null); // Clear the saved range

//       // Update the question state with the new content
//       const editor = document.querySelector('.rich-text-editor');
//       if (editor) {
//         setQuestion(editor.textContent || '');
//       }
//     }

//     setBlanks([...blanks, newBlank]);
//     setShowAddBlankModal(false);
//     setNewBlankAnswer(''); // Reset input field
//     setResponse({ ...response, blankModalError: undefined }); // Clear errors
//   };

//   // Remove a blank
//   const handleRemoveBlank = (id: string) => {
//     const updatedBlanks = blanks.filter((blank) => blank.id !== id);
//     setBlanks(updatedBlanks);

//     // Remove the placeholder from the question text
//     const blankToRemove = blanks.find((blank) => blank.id === id);
//     if (blankToRemove) {
//       const newQuestion = question.replace(blankToRemove.placeholder, '');
//       setQuestion(newQuestion);
//     }
//   };

//   // Validate the form before submission
//   const validateForm = () => {
//     const errors: any = {};

//     if (!question.trim()) errors.questionError = 'Question is required.';
//     if (blanks.length === 0) errors.blanksError = 'Add at least one blank.';
//     blanks.forEach((blank, index) => {
//       if (!blank.correctAnswer.trim())
//         errors.blanksError = `Blank ${index + 1} requires a correct answer.`;
//     });

//     setResponse(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     if (!validateForm()) return;

//     // Format question with blank placeholders
//     let formattedQuestion = question;
//     blanks.forEach((blank) => {
//       formattedQuestion = formattedQuestion.replace(blank.placeholder, `{${blank.id}}`);
//     });

//     // Display the formatted question and blanks instead of submitting
//     console.log('Submitted Question:', formattedQuestion);
//     console.log(
//       'Blanks:',
//       blanks.map((blank) => `Placeholder: {${blank.id}}, Correct Answer: ${blank.correctAnswer}`)
//     );

//     // Optionally, set response state to show feedback
//     setResponse({ message: 'Preview in console. Check developer tools.' });
//   };

//   return (
//     <Paper shadow="xs" p="lg" radius="lg" mt="sm">
//       <Title order={3} mb="xl">
//         Type: Fill in the Blanks
//       </Title>

//       {/* Points Input */}
//       <Group>
//         <NumberInput
//           label="Points (1-20)"
//           value={points}
//           onChange={(e) => setPoints(Number(e))}
//           placeholder="Points"
//           min={1}
//           max={20}
//         />
//       </Group>

//       {/* Question Editor */}
//       <InputLabel required>Question</InputLabel>
//       {response.questionError && <Text color="#ff4136">{response.questionError}</Text>}
//       <RichTextEditorComponent
//         content={question}
//         setContent={setQuestion}
//         onTextSelect={handleTextSelection} // Capture selected text
//         index={0}
//       />

//       {/* Add Blank Button */}
//       <Button size="sm" onClick={handleTextSelection} mt="md">
//         Add Blank
//       </Button>

//       {/* Blanks Management */}
//       <Stack mt="md">
//         <InputLabel required>Blanks:</InputLabel>
//         {response.blanksError && <Text color="#ff4136">{response.blanksError}</Text>}
//         {blanks.map((blank, index) => (
//           <Group key={blank.id} align="flex-start">
//             <Text>Blank {index + 1}:</Text>
//             <TextInput
//               value={blank.correctAnswer}
//               onChange={(e) =>
//                 setBlanks(
//                   blanks.map((b) =>
//                     b.id === blank.id ? { ...b, correctAnswer: e.target.value } : b
//                   )
//                 )
//               }
//               placeholder="Correct answer"
//             />
//             <Button variant="subtle" color="#ff4136" onClick={() => handleRemoveBlank(blank.id)}>
//               Delete
//             </Button>
//           </Group>
//         ))}
//       </Stack>

//       {/* Explanation Editor */}
//       <InputLabel mt="lg" required>
//         Explanation (Shown after Answer Submit.)
//       </InputLabel>
//       {response.explanationError && <Text color="#ff4136">{response.explanationError}</Text>}
//       <RichTextEditorComponent content={explanation} setContent={setExplanation} index={1} />

//       {/* Submit Button */}
//       <Button onClick={handleSubmit} fullWidth mt="lg">
//         Submit
//       </Button>

//       {/* Modal for Adding Blanks */}
//       <Modal
//         opened={showAddBlankModal}
//         onClose={() => setShowAddBlankModal(false)}
//         title="Add Blank"
//       >
//         <TextInput
//           label="Correct Answer"
//           placeholder="Enter the correct answer"
//           value={newBlankAnswer}
//           onChange={(e) => setNewBlankAnswer(e.target.value)}
//         />
//         {response.blankModalError && (
//           <Text color="#ff4136" mt="sm">
//             {response.blankModalError}
//           </Text>
//         )}
//         <Group mt="md">
//           <Button onClick={handleAddBlank}>Confirm</Button>
//           <Button variant="subtle" onClick={() => setShowAddBlankModal(false)}>
//             Cancel
//           </Button>
//         </Group>
//       </Modal>
//     </Paper>
//   );
// };

// import React, { useState } from 'react';
// import {
//   Button,
//   InputLabel,
//   NumberInput,
//   Paper,
//   Space,
//   Stack,
//   Text,
//   Title,
//   Group,
//   LoadingOverlay,
// } from '@mantine/core';
// import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
// import { SubmitQuestion } from '../utils/SubmitQuestion';

// export const FillBlanks = ({ dataTunnel, response, setResponse }: any) => {
//   const [question, setQuestion] = useState('');
//   const [points, setPoints] = useState(5);
//   const [explanation, setExplanation] = useState('');
//   const [correctAnswer, setCorrectAnswer] = useState<number | ''>('');

//   return (
//     <Paper shadow="xs" p="lg" radius="lg" mt="sm">
//       <Title order={3} mb="xl">
//         Type : Fill in the Blanks
//       </Title>

//       <Group>
//         <NumberInput
//           label="Points (1-20)"
//           value={points}
//           onChange={(e) => setPoints(e !== null ? Number(e) : 5)}
//           placeholder="Points"
//           min={1}
//           max={20}
//           required
//         />
//       </Group>

//       <InputLabel required>Question</InputLabel>
//       {response.questionError && <Text c="#ff4136">{response.questionError}</Text>}
//       <RichTextEditorComponent content={question} setContent={setQuestion} index={0} />

//       <Stack mt="md">
//         <InputLabel required>Correct Answer</InputLabel>
//         {response.answerError && <Text c="#ff4136">{response.answerError}</Text>}
//         <NumberInput
//           value={correctAnswer}
//           onChange={(e) => setCorrectAnswer(e !== null ? Number(e) : '')}
//           placeholder="Enter correct number answer"
//         />
//       </Stack>

//       <InputLabel mt="lg" required>
//         Explanation (Shown after Answer Submit)
//       </InputLabel>
//       {response.explanationError && <Text c="#ff4136">{response.explanationError}</Text>}
//       <RichTextEditorComponent content={explanation} setContent={setExplanation} index={1} />

//       <Space h="lg" />

//       <SubmitQuestion
//         dataTunnel={() => {
//           if (
//             !question.trim() ||
//             correctAnswer === '' ||
//             isNaN(correctAnswer) ||
//             !explanation.trim()
//           ) {
//             console.log('Validation Error: Missing Required Fields');
//             return null;
//           }
//           return {
//             ...dataTunnel,
//             question,
//             correctAnswer: Number(correctAnswer),
//             points: Number(points),
//             explanation,
//           };
//         }}
//         response={response}
//         setResponse={setResponse}
//       />
//     </Paper>
//   );
// };

import React, { useState } from 'react';
import {
  Button,
  InputLabel,
  NumberInput,
  Paper,
  Space,
  Stack,
  Text,
  Title,
  Group,
  Select,
  TextInput,
} from '@mantine/core';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';

export const FillBlanks = ({ dataTunnel, response, setResponse }: any) => {
  const [question, setQuestion] = useState('');
  const [points, setPoints] = useState(5);
  const [explanation, setExplanation] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number | ''>('');
  const [unit, setUnit] = useState<string>('');

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type : Fill in the Blanks
      </Title>

      {/* Points Input */}
      <Group>
        <NumberInput
          label="Points (1-20)"
          value={points}
          onChange={(e) => setPoints(e !== null ? Number(e) : 5)}
          placeholder="Points"
          min={1}
          max={20}
          required
        />
      </Group>

      {/* Question Editor */}
      <InputLabel required>Question {unit && `(Unit: ${unit})`}</InputLabel>
      {response.titleError && <Text c="#ff4136">{response.titleError}</Text>}
      <RichTextEditorComponent content={question} setContent={setQuestion} index={0} />

      {/* Correct Answer Input */}
      <Stack mt="md">
        <InputLabel required>Correct Answer</InputLabel>
        {response.answerError && <Text c="#ff4136">{response.answerError}</Text>}
        <Group align="flex-end">
          <NumberInput
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e !== null ? Number(e) : '')}
            placeholder="Enter correct number answer"
            style={{ flex: 1 }}
          />
          <TextInput
            placeholder="Enter Unit"
            value={unit}
            onChange={(data) => {
              setUnit(data.currentTarget.value);
            }}
            style={{ flex: 1 }}
            required
          />
        </Group>
        {response.unitError && <Text c="#ff4136">{response.unitError}</Text>}
      </Stack>

      {/* Explanation Editor */}
      <InputLabel mt="lg" required>
        Explanation (Shown after Answer Submit)
      </InputLabel>
      {response.explanationError && <Text c="#ff4136">{response.explanationError}</Text>}
      <RichTextEditorComponent content={explanation} setContent={setExplanation} index={1} />

      <Space h="lg" />
      <SubmitQuestion
        dataTunnel={() => {
          if (
            !question.trim() ||
            correctAnswer === '' ||
            isNaN(correctAnswer) ||
            !explanation.trim()
          ) {
            console.log('Validation Error: Missing Required Fields');
            return null;
          }
          return {
            ...dataTunnel,
            question: `${question}<<${unit}>>`,
            correctAnswer: Number(correctAnswer),
            points: Number(points),
            explanation,
          };
        }}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};
