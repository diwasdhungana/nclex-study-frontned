import { Page } from '@/components/page';
import {
  Button,
  Card,
  Group,
  Paper,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { useNavigate } from 'react-router-dom';
import { Settings } from '@/pages/dashboard/admin/add-questions/utils/settings';
import { PiArrowLeft } from 'react-icons/pi';
import { useGetAllSets, usePostSet } from '@/hooks';

const questionTypewithlabelandValue = {
  'Next Gen': [
    { label: 'Extended Drop Down', value: 'extDropDown' },
    { label: 'Highlight', value: 'highlight' },
    { label: 'Matrix and Grid', value: 'matrixNGrid' },
    { label: 'Drag and Drop', value: 'dragNDrop' },
    { label: 'Bow Tie', value: 'bowTie' },
    { label: 'Select One', value: 'selectOne' },
    { label: 'Select All That Apply', value: 'mcq' },
  ],

  Traditional: [
    { label: 'Select One', value: 'selectOne' },

    { label: 'Select All That Apply', value: 'mcq' },
  ],
};
const questionGen = [
  { label: 'Traditional', value: 'Traditional' },
  { label: 'Next Gen', value: 'Next Gen' },
];
const addQuestions = () => {
  const navigate = useNavigate();
  const [selectedSet, setselectedSet] = React.useState<null | string>();
  const [selectedGen, setSelectedGen] = React.useState<null | 'Traditional' | 'Next Gen'>();
  const [isCreating, setIsCreating] = React.useState(false);
  const [newSetName, setNewSetName] = React.useState('');
  const [selectedQuestionType, setSelectedQuestionType] = React.useState<null | string>();
  const [response, setResponse] = React.useState({});
  const { mutate: postSet, isPending: postSetLoading, isError: postSetError } = usePostSet();
  const { data: sets, isError: setsError } = useGetAllSets({ query: { getAll: true } });
  type ISet = {
    _id: string;
    name: string;
  };
  // postSet({
  //   variables: {
  //     name: newSetName,
  //   },
  // });
  return (
    <Page title="Home" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(-1)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Archer Page
            </Title>
          </Button>
        </Group>
        <Paper shadow="xs" p="lg" radius="lg">
          <Stack ml="md">
            <Title order={2}>Create a Archer Question.</Title>

            <Group mt="xl">
              <Radio.Group
                name="Question Generation"
                label={<Text fw="600">Select Question Generation</Text>}
                onChange={(value) => setSelectedGen(value as 'Traditional' | 'Next Gen')}
              >
                <Group mt="xs">
                  {questionGen.map((gen) => {
                    return (
                      <Radio
                        key={gen.value}
                        value={gen.value}
                        label={gen.label}
                        checked={selectedGen === gen.value}
                        // disabled={gen.value === 'nextgen'}
                        onChange={() => setSelectedQuestionType('')}
                      />
                    );
                  })}
                </Group>
              </Radio.Group>
            </Group>
            <Group>
              <Stack>
                {setsError && <Text c="#ff4136">Error fetching subjects</Text>}

                <Select
                  label={<Text fw="600">Choose a Subject</Text>}
                  placeholder={'Select Set'}
                  data={sets?.data?.docs?.map((set: ISet) => {
                    return { value: set._id, label: set.name };
                  })}
                  onChange={(value) => setselectedSet(value)}
                  value={selectedSet}
                  allowDeselect={false}
                  searchable
                  nothingFoundMessage="No such set."
                  maxDropdownHeight={200}
                  comboboxProps={{ withinPortal: false }}
                />
              </Stack>

              {isCreating ? (
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
              ) : (
                <Button onClick={() => setIsCreating(true)} mt="lg">
                  +
                </Button>
              )}
            </Group>
            <Group>
              <Select
                disabled={!selectedGen}
                data={
                  selectedGen
                    ? questionTypewithlabelandValue[selectedGen]
                    : ([] as { label: string; value: string }[])
                }
                placeholder="Select Question Type"
                label={<Text fw="600">Choose a Question Type</Text>}
                onChange={(value) => setSelectedQuestionType(value)}
                allowDeselect={false}
              />
            </Group>
            {/* main Page starts from here */}
          </Stack>
        </Paper>
        {selectedQuestionType && selectedGen && selectedSet && (
          <>
            <Settings
              dataTunnel={{
                selectedQuestionType,
                selectedGen,
                selectedSet,
              }}
              response={response}
              setResponse={setResponse}
            />
          </>
        )}
      </Stack>
    </Page>
  );
};

export default addQuestions;
