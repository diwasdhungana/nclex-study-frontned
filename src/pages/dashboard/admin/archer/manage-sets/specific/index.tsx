import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetSpecificSet, usePatchQuestionOrderInSet } from '@/hooks';
import { Button, Group, List, ListItem, Paper, Stack, Text, Title } from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import { Page } from '@/components/page';
import { paths } from '@/routes';
import QuestionReorder from './question-reorder';

const SpecificQuestion = () => {
  const { setId } = useParams<{ setId: string }>();
  const {
    data: setData,
    isError: setError,
    isLoading: setLoading,
  } = useGetSpecificSet({
    route: {
      setId,
    },
  });
  const navigate = useNavigate();
  const { mutate: reorderQuestionInSet, isPending: patchPending } = usePatchQuestionOrderInSet();

  const handleReorderSubmit = (questionsHashtag: string[]) => {
    reorderQuestionInSet({
      variables: {
        orderedHashtags: questionsHashtag,
      },
      route: {
        setId,
      },
    });
  };

  if (setError) {
    return <div>Something went wrong</div>;
  }
  if (setLoading) {
    return <div>Loading...</div>;
  }
  if (!setData) {
    return <div>Set not found</div>;
  }

  return (
    <Page title="View Questions">
      <Stack>
        <Group gap="xl" justify="space-between">
          <Button
            variant="subtle"
            onClick={() => navigate(paths.dashboard.admin.timed.manageSets.root)}
          >
            <PiArrowLeft size="xl" strokeWidth={10} />
            <Title order={3} mx="sm">
              Manage Sets
            </Title>
          </Button>
        </Group>

        {/* Set Management Section */}
        <Paper radius="lg" p="md">
          <Title order={3} mb="md">
            Reorder Questions
          </Title>
          <List type="unordered">
            <ListItem>
              <Text size="sm">click once to select.</Text>
            </ListItem>
            <ListItem>
              <Text size="sm">double click to view question.</Text>
            </ListItem>
            <ListItem>
              <Text size="sm">drag and drop to reorder questions.</Text>
            </ListItem>
            <ListItem>
              <Text size="sm">click the save order button to save.</Text>
            </ListItem>
          </List>
          <QuestionReorder
            questions={setData.data.questions}
            onReorder={handleReorderSubmit}
            isLoading={patchPending}
          />
        </Paper>
      </Stack>
    </Page>
  );
};

export default SpecificQuestion;
