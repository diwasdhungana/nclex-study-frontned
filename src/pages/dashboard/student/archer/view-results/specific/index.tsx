import { Page } from '@/components/page';
import { useGetSpecificArcherTestQuestion } from '@/hooks';
import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import QuestionDisplay from './QuestionDisplay';
import { Button, Group, Stack, Title } from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';

const index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { testId } = useParams<{ testId: string }>();
  const {
    data: question,
    isError: errorQuestion,
    isLoading: loadingQuestion,
  } = useGetSpecificArcherTestQuestion({
    route: { testId, index: searchParams.get('i') },
  });
  console.log('question', testId);
  return (
    <Stack gap="0px" mt="-7px">
      {loadingQuestion && <div>loading...</div>}
      {errorQuestion && <div>error fetching archer question</div>}
      {question && (
        <QuestionDisplay
          props={{
            question,
            mode: 'student',
            questionIndex: searchParams.get('i'),
            testId: testId,
            totalQuestions: searchParams.get('t'),
          }}
        />
      )}
    </Stack>
  );
};

export default index;
