import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionDisplay from './QuestionDisplay';
import { useGetSpecificArcherQuestion } from '@/hooks/api/questions';
import { Button, Group, Stack, Title } from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';

const SpecificQuestion = () => {
  const { questionId } = useParams<{ questionId: string }>();

  const {
    data: question,
    isError: errorQuestion,
    isLoading: loadingQuestion,
  } = useGetSpecificArcherQuestion({ route: { questionId } });
  return (
    <Stack gap="0px">
      {loadingQuestion && <div>loading...</div>}
      {errorQuestion && <div>error...</div>}
      {question && <QuestionDisplay props={{ question, mode: 'admin' }} />}
    </Stack>
  );
};

export default SpecificQuestion;
