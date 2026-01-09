import { Page } from '@/components/page';
import { Button, Group, Paper, Radio, Select, Stack, Text, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { useNavigate } from 'react-router-dom';
import { Settings } from '@/pages/dashboard/admin/archer/add-questions/utils/settings';
import { PiArrowLeft } from 'react-icons/pi';
import { useGetSubjects, useGetSystems } from '@/hooks';

const questionTypewithlabelandValue = {
  'Next Gen': [
    { label: 'Fill in the Blanks', value: 'fillBlanks' },
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
  const [selectedSubject, setSelectedSubject] = React.useState<null | string>();
  const [selectedSystem, setSelectedSystem] = React.useState<null | string>();
  const [selectedGen, setSelectedGen] = React.useState<null | 'Traditional' | 'Next Gen'>();
  const [selectedQuestionType, setSelectedQuestionType] = React.useState<null | string>();
  const [response, setResponse] = React.useState({});

  const { data: subjects, isError: subjectsError } = useGetSubjects({ query: { getAll: true } });
  const { data: systemsData, isError: systemsDataError } = useGetSystems({
    query: {
      getAll: true,
      subjects: [selectedSubject ? selectedSubject : ''],
    },
  });
  type Subject = {
    _id: string;
    name: string;
  };
  type System = {
    _id: string;
    name: string;
  };

  return (
    <Page title="Home" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(-1)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Admin Page
            </Title>
          </Button>
        </Group>
        <Paper shadow="xs" p="lg" radius="lg">
          <Stack ml="md">
            <Title order={2}>Create a Question.</Title>

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
                {subjectsError && <Text c="#ff4136">Error fetching subjects</Text>}
                <Select
                  label={<Text fw="600">Choose a Subject</Text>}
                  placeholder={'Select Subject'}
                  data={subjects?.data?.docs?.map((subject: Subject) => {
                    return { value: subject._id, label: subject.name };
                  })}
                  onChange={(value) => setSelectedSubject(value)}
                  value={selectedSubject}
                  allowDeselect={false}
                  searchable
                  nothingFoundMessage="No such subjects."
                  maxDropdownHeight={200}
                  comboboxProps={{ withinPortal: false }}
                />
              </Stack>
              <Stack>
                {systemsDataError && <Text c="#ff4136">Error fetching systems</Text>}

                <Select
                  disabled={!selectedSubject}
                  label={<Text fw="600">Choose a System</Text>}
                  placeholder={'Select System'}
                  data={systemsData?.data?.docs?.map((subject: Subject) => {
                    return { value: subject._id, label: subject.name };
                  })}
                  onChange={(value) => setSelectedSystem(value)}
                  value={selectedSystem}
                  allowDeselect={false}
                  maxDropdownHeight={200}
                  nothingFoundMessage="no systems available for this subject"
                  comboboxProps={{ withinPortal: false }}
                />
              </Stack>
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
        {selectedQuestionType && selectedGen && selectedSubject && selectedSystem && (
          <>
            <Settings
              dataTunnel={{
                selectedQuestionType,
                selectedGen,
                selectedSubject,
                selectedSystem,
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
