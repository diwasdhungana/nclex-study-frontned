import React, { useRef, useState } from 'react';
import {
  Button,
  InputLabel,
  NumberInput,
  Paper,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
  Group,
  LoadingOverlay,
} from '@mantine/core';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';

interface Blank {
  id: string;
  correctAnswer: string;
}

export const FillBlanks = ({ dataTunnel, response, setResponse }: any) => {
  const [question, setQuestion] = useState('');
  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [points, setPoints] = useState(5);
  const [explanation, setExplanation] = useState('');

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <Title order={3} mb="xl">
        Type : Fill in the Blanks
      </Title>
    </Paper>
  );
};
