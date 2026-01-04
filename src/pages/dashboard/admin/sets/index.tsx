import React from 'react';
import { Card, Stack, TextInput, Button, Group, Title, Text, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useGetAllSets, usePostSet, usePutSetQuestions } from '@/hooks/api/questions';
import { PiArrowLeft } from 'react-icons/pi';

const QuestionSets = () => {
  const navigate = useNavigate();
  const [newSetName, setNewSetName] = React.useState('');
  const [selectedSet, setSelectedSet] = React.useState('');
  const [questionIds, setQuestionIds] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [questionsToRemove, setQuestionsToRemove] = React.useState<string[]>([]);

  // API hooks
  const { data: sets, isLoading: setsLoading, isError: setsError } = useGetAllSets();

  const { mutate: postSet, isPending: postSetLoading, isError: postSetError } = usePostSet();

  const {
    mutate: putSetQuestions,
    isPending: putSetQuestionsLoading,
    isError: putSetQuestionsError,
  } = usePutSetQuestions();

  // Handle set selection
  const handleSetSelection = (setId: string) => {
    if (selectedSet === setId) {
      setSelectedSet('');
      setQuestionsToRemove([]);
    } else {
      setSelectedSet(setId);
      setQuestionsToRemove([]);
    }
  };

  // Handle checkbox changes
  const handleQuestionToggle = (hashTag: string, checked: boolean) => {
    if (checked) {
      setQuestionsToRemove((prev) => [...prev, hashTag]);
    } else {
      setQuestionsToRemove((prev) => prev.filter((q) => q !== hashTag));
    }
  };

  // Handle removing questions
  const handleRemoveQuestions = (setId: string, currentQuestions: any[]) => {
    const remainingQuestions = currentQuestions
      .filter((q) => !questionsToRemove.includes(q.hashTag))
      .map((q) => q.hashTag);

    putSetQuestions({
      route: {
        setId: setId,
      },
      variables: {
        questions: remainingQuestions,
      },
    });

    setQuestionsToRemove([]);
  };

  // Handle adding new questions
  const handleAddQuestions = (setId: string, currentQuestions: any[]) => {
    const newQuestions = questionIds.split(',').map((id) => id.trim());
    const existingQuestions = currentQuestions.map((q) => q.hashTag);
    const updatedQuestions = [...existingQuestions, ...newQuestions];

    putSetQuestions({
      route: {
        setId: setId,
      },
      variables: {
        questions: updatedQuestions,
      },
    });

    setQuestionIds('');
  };

  if (setsLoading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Loading sets...</Text>
      </Stack>
    );
  }

  if (setsError) {
    return (
      <Stack align="center" mt="xl">
        <Text color="red">Failed to load question sets. Please try again later.</Text>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </Stack>
    );
  }

  return (
    <Stack className="p-6 max-w-4xl mx-auto">
      <Group gap="xl">
        <Button variant="subtle" onClick={() => navigate(-1)}>
          <PiArrowLeft size="xl" strokeWidth={10} />
        </Button>
        <Title order={1} mx="sm">
          Available Sets
        </Title>
      </Group>

      {/* Create New Set */}
      {!isCreating ? (
        <Button onClick={() => setIsCreating(true)} w="200px">
          Create New Set +
        </Button>
      ) : (
        <Card p="md" w="300px">
          <Stack>
            <TextInput
              placeholder="Enter set name"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              error={postSetError ? 'Failed to create set' : ''}
            />
            <Group>
              <Button onClick={() => setIsCreating(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  postSet({
                    variables: {
                      name: newSetName,
                    },
                  });
                  setNewSetName('');
                  setIsCreating(false);
                }}
                disabled={!newSetName || postSetLoading}
                loading={postSetLoading}
              >
                Create Set
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      {/* Display Sets */}
      {sets?.data?.docs?.map((set: any) => (
        <Card key={set._id} p="md" bg={selectedSet === set._id ? 'gray.1' : ''}>
          <Stack>
            <Stack>
              <Title order={4}>{set.name}</Title>
              <Group>
                <Text className="text-sm text-gray-600">
                  Duration: {set.durationInMinutes} minutes
                </Text>
                <Button onClick={() => handleSetSelection(set._id)} variant="subtle">
                  {selectedSet === set._id ? 'Cancel' : 'Edit Questions'}
                </Button>
              </Group>
            </Stack>

            {selectedSet === set._id && (
              <Stack className="mt-4">
                <TextInput
                  placeholder="Enter question IDs (comma-separated)"
                  value={questionIds}
                  onChange={(e) => setQuestionIds(e.target.value)}
                  error={putSetQuestionsError ? 'Failed to update questions' : ''}
                />
                <Button
                  onClick={() => handleAddQuestions(set._id, set.questions)}
                  disabled={!questionIds || putSetQuestionsLoading}
                  loading={putSetQuestionsLoading}
                >
                  Add Questions
                </Button>
                <Stack className="mt-2">
                  <Text className="text-sm font-medium">Current Questions:</Text>
                  {set.questions.map((q: any, index: number) => (
                    <div key={index}>
                      {index + 1}.
                      <input
                        type="checkbox"
                        checked={questionsToRemove.includes(q.hashTag)}
                        onChange={(e) => handleQuestionToggle(q.hashTag, e.target.checked)}
                      />
                      {`#${q.hashTag}`}
                    </div>
                  ))}
                  {set.questions.length === 0 && (
                    <Text className="text-sm text-gray-600">This set is currently empty.</Text>
                  )}
                </Stack>
                {questionsToRemove.length > 0 && (
                  <Button
                    onClick={() => handleRemoveQuestions(set._id, set.questions)}
                    color="red"
                    variant="light"
                    disabled={putSetQuestionsLoading}
                    loading={putSetQuestionsLoading}
                    w="200px"
                  >
                    Remove Selected Questions
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export default QuestionSets;
