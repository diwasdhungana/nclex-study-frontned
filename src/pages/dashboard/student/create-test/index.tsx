import { useCreateTest, useGetSubjects, useGetSystems } from '@/hooks';
import React from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { Page } from '@/components/page';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
  SimpleGrid,
} from '@mantine/core';
import { PiArrowLeft } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes';

const index = () => {
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const [selectedSystems, setSelectedSystems] = React.useState<string[]>([]);
  const [selectedGen, setSelectedGen] = React.useState<string[]>([]);
  const [selectedModes, setSelectedModes] = React.useState<string[]>(['Used']);
  const [questionsCount, setQuestionsCount] = React.useState(40);
  const { data: subjectsData, isError: subjectsError } = useGetSubjects({
    query: { getAll: true },
  });
  const { data: systemsData, isError: systemsDataError } = useGetSystems({
    query: {
      getAll: true,
      subjects: selectedSubjects,
    },
  });

  const questionGen = [
    { label: 'Traditional', value: 'Traditional' },
    { label: 'Next Gen', value: 'Next Gen' },
  ];
  const questionMode = [
    { label: 'Used', value: 'Used' },
    { label: 'Unused', value: 'Unused' },
  ];
  const { mutate: createTest, isPending: isCreatingTest } = useCreateTest();
  const handleCreateTest = () => {
    //filter out all the systems that are not currently present in systemData.data.docs
    const newSystems = selectedSystems.filter((system) =>
      systemsData?.data?.docs.find((s: { _id: String }) => s._id === system)
    );
    createTest(
      {
        variables: {
          types: selectedGen,
          systems: newSystems,
          modes: selectedModes,
          questionsCount,
        },
      },
      {
        onSuccess: (data) => {},
        onError: (error: String) => {
          console.log(error);
        },
      }
    );
  };
  // subjectsData && console.log(subjectsData.data.docs);
  // Toggle all subjects
  const handleToggleAllSubjects = () => {
    if (selectedSubjects.length === subjectsData?.data?.docs.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(
        subjectsData?.data?.docs.map((subject: { _id: string }) => subject._id) || []
      );
    }
  };

  // Toggle all systems
  const handleToggleAllSystems = () => {
    if (selectedSystems.length === systemsData?.data?.docs.length) {
      setSelectedSystems([]);
    } else {
      setSelectedSystems(
        systemsData?.data?.docs.map((system: { _id: string }) => system._id) || []
      );
    }
  };

  return (
    <Page title="New Test" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.student.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
            <Title order={3} mx="sm">
              Home Page
            </Title>
          </Button>
        </Group>
      </Stack>
      <Paper shadow="xs" p="lg" radius="lg">
        <Stack ml="md">
          <Title order={2}>New test</Title>
          <Group>
            <Text fw={700} size="lg">
              Gen :{' '}
            </Text>{' '}
            <Group>
              {' '}
              {questionGen.map((gen) => (
                <Group key={gen.value}>
                  <Checkbox
                    checked={selectedGen?.includes(gen.value)}
                    onChange={() => {
                      if (selectedGen?.includes(gen.value)) {
                        setSelectedGen(selectedGen.filter((g) => g !== gen.value));
                      } else {
                        setSelectedGen([...selectedGen, gen.value]);
                      }
                    }}
                  />

                  <Text>{gen.label}</Text>
                  <Text c="gray">
                    {subjectsData?.data?.docs &&
                      subjectsData?.data?.docs.reduce(
                        (acc: number, subject: any) =>
                          acc +
                          (gen.value === 'Next Gen'
                            ? subject.questionsCount.nextgen
                            : subject.questionsCount.traditional),
                        0
                      )}
                  </Text>
                </Group>
              ))}
            </Group>
            <Divider my="md" bg="#ff4136" w="100%" />
          </Group>
          {subjectsData?.data?.docs && (
            <Group>
              <Group align="center">
                <Text fw={700} size="lg">
                  Subjects :
                </Text>{' '}
                <Checkbox
                  checked={selectedSubjects.length === subjectsData?.data?.docs.length}
                  indeterminate={
                    selectedSubjects.length > 0 &&
                    selectedSubjects.length < (subjectsData?.data?.docs.length || 0)
                  }
                  onChange={handleToggleAllSubjects}
                />
              </Group>
              <SimpleGrid cols={3} spacing="xs">
                {subjectsData?.data?.docs.map(
                  (subject: {
                    _id: string;
                    name: string;
                    questionsCount: {
                      traditional: number;
                      nextgen: number;
                    };
                  }) => (
                    <Group key={subject._id}>
                      <Checkbox
                        checked={selectedSubjects?.includes(subject._id)}
                        onChange={() => {
                          if (selectedSubjects?.includes(subject._id)) {
                            setSelectedSubjects(selectedSubjects.filter((g) => g !== subject._id));
                          } else {
                            setSelectedSubjects([...selectedSubjects, subject._id]);
                          }
                        }}
                      />
                      <Text>{subject.name}</Text>
                      <Text c="gray">
                        {' '}
                        {selectedGen.length == 2
                          ? subject.questionsCount.nextgen + subject.questionsCount.traditional
                          : selectedGen.includes('Next Gen')
                            ? subject.questionsCount.nextgen
                            : (
                                  selectedGen.includes('Traditional')
                                    ? subject.questionsCount.traditional
                                    : 0
                                )
                              ? subject.questionsCount.traditional
                              : 0}
                      </Text>
                    </Group>
                  )
                )}
              </SimpleGrid>
            </Group>
          )}
          <Divider my="md" bg="#ff4136" w="100%" />
          {!systemsDataError && (
            <Group>
              <Group align="center">
                <Text fw={700} size="lg">
                  Systems :
                </Text>{' '}
                <Checkbox
                  checked={selectedSystems.length === systemsData?.data?.docs.length}
                  indeterminate={
                    selectedSystems.length > 0 &&
                    selectedSystems.length < (systemsData?.data?.docs.length || 0)
                  }
                  onChange={handleToggleAllSystems}
                  disabled={selectedSubjects.length === 0}
                />
              </Group>
              <SimpleGrid cols={3} spacing="xs">
                {selectedSubjects.length > 0 &&
                  systemsData?.data?.docs.map(
                    (system: {
                      _id: string;
                      name: string;
                      questionsCount: {
                        traditional: number;
                        nextgen: number;
                      };
                    }) => (
                      <Group key={system._id}>
                        <Checkbox
                          checked={selectedSystems?.includes(system._id)}
                          onChange={() => {
                            if (selectedSystems?.includes(system._id)) {
                              setSelectedSystems(selectedSystems.filter((g) => g !== system._id));
                            } else {
                              setSelectedSystems([...selectedSystems, system._id]);
                            }
                          }}
                        />
                        <Text>{system.name}</Text>
                        <Text c="gray">
                          {' '}
                          {selectedGen.length == 2
                            ? system.questionsCount.nextgen + system.questionsCount.traditional
                            : selectedGen.includes('Next Gen')
                              ? system.questionsCount.nextgen
                              : (
                                    selectedGen.includes('Traditional')
                                      ? system.questionsCount.traditional
                                      : 0
                                  )
                                ? system.questionsCount.traditional
                                : 0}
                        </Text>
                      </Group>
                    )
                  )}
              </SimpleGrid>
            </Group>
          )}
          <Divider my="md" bg="#ff4136" w="100%" />

          <Group>
            <Text fw={700} size="lg">
              Mode :{' '}
            </Text>{' '}
            <Group>
              {' '}
              {questionMode.map((mode) => (
                <Group key={mode.value}>
                  <Checkbox
                    checked={selectedModes?.includes(mode.value)}
                    onChange={() => {
                      if (selectedModes?.includes(mode.value)) {
                        setSelectedModes(selectedModes.filter((g) => g !== mode.value));
                      } else {
                        setSelectedModes([...selectedModes, mode.value]);
                      }
                    }}
                  />

                  <Text>{mode.label}</Text>
                </Group>
              ))}
            </Group>
          </Group>
          <Divider my="md" bg="#ff4136" w="100%" />
          <Group>
            <Text fw={700} size="lg">
              Number of Questions :{' '}
            </Text>{' '}
            <NumberInput
              value={questionsCount}
              onChange={(value) => setQuestionsCount(Number(value))}
              min={5}
              max={300}
            />
            <Text fw={200}>(5-300)</Text>
          </Group>
          <Group>
            <Button
              size="lg"
              color="blue"
              radius="xl"
              disabled={
                selectedGen.length == 0 ||
                selectedSystems.length == 0 ||
                selectedSubjects.length == 0 ||
                selectedModes.length == 0 ||
                isCreatingTest
              }
              onClick={handleCreateTest}
              loading={isCreatingTest}
            >
              Create Test
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Page>
  );
};

export default index;
