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
  const {
    data: question,
    isError: errorQuestion,
    isLoading: loadingQuestion,
  } = useGetSpecificArcherTestQuestion({
    route: {
      testId: searchParams.get('testId'),
      index: searchParams.get('i'),
      // timestamp: Date.now(),
    },
  });

  return (
    <Stack gap="0px" mt="-7px" mb="0px">
      {loadingQuestion && <div>loading...</div>}
      {errorQuestion && <div>error...</div>}
      {question && (
        <QuestionDisplay
          key={`${searchParams.get('testId')}-${searchParams.get('i')}`}
          props={{
            question,
            mode: 'student',
            questionIndex: searchParams.get('i'),
            testId: searchParams.get('testId'),
            totalQuestions: searchParams.get('t'),
          }}
        />
      )}
    </Stack>
  );
};

export default index;
