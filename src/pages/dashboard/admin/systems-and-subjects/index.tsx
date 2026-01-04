import { Page } from '@/components/page';
import {
  Box,
  Button,
  Grid,
  Group,
  List,
  ListItem,
  Paper,
  Radio,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React, { useEffect } from 'react';
import css from '@/pages/dashboard/everything.module.css';
import { useNavigate } from 'react-router-dom';
import { PiArrowLeft } from 'react-icons/pi';
import {
  useGetSubjects,
  useGetSystems,
  usePostSystem,
  usePostSubject,
  usePutSystem,
  usePutSubject,
} from '@/hooks';
import { set, sub } from 'date-fns';

const subjectAndSystems = () => {
  const navigate = useNavigate();
  const { data: subjectsData, isError: subjectsDataError } = useGetSubjects({
    query: { getAll: true },
  });
  interface Subject {
    _id: string;
    name: string;
  }

  interface System {
    _id: string;
    name: string;
    subject: string;
  }

  const [selectedSubject, setSelectedSubject] = React.useState<null | Subject>(null);
  const [selectedSystem, setSelectedSystem] = React.useState<null | System>(null);
  const [subjectName, setSubjectName] = React.useState('');
  const [systemName, setSystemName] = React.useState('');
  const [systemNameEdit, setSystemNameEdit] = React.useState('');
  const [systemSubjectChangeTo, setSystemSubjectChangeTo] = React.useState('');
  const [editsubject, setEditSubject] = React.useState(false);
  const [subjectNameEdit, setSubjectNameEdit] = React.useState('');
  const { data: systemsData, isError: systemsDataError } = useGetSystems({
    query: { getAll: true, subjects: [selectedSubject?._id] },
  });
  const { mutate: postSubject, isPending: postSubjectPending } = usePostSubject();
  const { mutate: postSystem, isPending: postSystemPending } = usePostSystem();
  const { mutate: putSystem, isPending: putSystemPending } = usePutSystem();
  const { mutate: putSubject, isPending: putSubjectPending } = usePutSubject();
  const handleAddSubject = () => {
    // Split the subject name by comma and remove any empty strings, output in this format [{name: 'subject1'}, {name: 'subject2'}]
    const subjects = subjectName
      .split(',')
      .filter(Boolean)
      .map((name) => ({ name: name.trim() }));
    postSubject(
      { variables: subjects },
      {
        onSuccess: () => {
          setSubjectName('');
        },
        onError: (e) => {
          console.log('Error', e);
        },
      }
    );
  };
  const handleAddSystem = () => {
    // Split the system name by comma and remove any empty strings, output in this format [{name: 'system1'}, {name: 'system2'}]
    const systems = systemName
      .split(',')
      .filter(Boolean)
      .map((name) => ({ name: name.trim(), subject: selectedSubject?._id }));
    // const systems = { name: systemName, subject: selectedSubject };
    postSystem(
      { variables: systems },
      {
        onSuccess: () => {
          setSystemName('');
        },
        onError: (e) => {
          console.log('Error', e);
        },
      }
    );
  };
  const handleSystemEdit = (systemId: string) => {
    putSystem(
      {
        variables: { name: systemNameEdit, subject: systemSubjectChangeTo },
        route: { id: systemId },
      },
      {
        onSuccess: () => {
          setSystemNameEdit('');
          setSystemSubjectChangeTo('');
          setSelectedSystem(null);
        },
        onError: (e) => {
          console.log('Error', e);
        },
      }
    );
  };
  const handleSubjectEdit = () => {
    putSubject(
      {
        variables: { name: subjectNameEdit },
        route: { id: selectedSubject?._id },
      },
      {
        onSuccess: () => {
          setSubjectNameEdit('');
          setEditSubject(false);
        },
        onError: (e) => {
          console.log('Error', e);
        },
      }
    );
  };
  useEffect(() => {
    if (subjectsData?.data?.docs?.length > 0) {
      setSelectedSubject(subjectsData?.data?.docs[0]);
      // systemsData.refetch({ subjects: [subjectsData?.data?.docs[0].length] });
    }
  }, [subjectsData]);

  return (
    <Page title="systems/subjects" className={css.root}>
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(-1)}>
            <PiArrowLeft size="xl" strokeWidth={10} /> {'  '}
          </Button>
          <Title order={1} mx="sm">
            Add/Edit Subjects and Systems
          </Title>
        </Group>
        <Grid>
          <Grid.Col span={3}>
            <Stack gap="md">
              {/* <Text>select subject from here</Text> */}
              <Paper shadow="xs" p="md" radius="md">
                <Title order={2} mb="md">
                  Available Subjects
                </Title>
                <ScrollArea h="70vh" offsetScrollbars>
                  <Stack gap="xs">
                    <Group preventGrowOverflow={false} grow>
                      <TextInput
                        placeholder="Enter subject name/s (comma separated)"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.currentTarget.value)}
                      />
                      <Button
                        onClick={handleAddSubject}
                        loading={postSubjectPending}
                        disabled={!subjectName}
                        size="sm"
                      >
                        Add Subject
                      </Button>
                    </Group>

                    {subjectsData?.data?.docs?.map((subject: Subject) => (
                      <Button
                        key={subject._id}
                        variant={selectedSubject?._id === subject._id ? 'filled' : 'subtle'}
                        onClick={() => {
                          setEditSubject(false);
                          setSelectedSubject(subject);
                        }}
                        w="100%"
                        justify="flex-start" // Aligns content to the start
                        ta="left"
                        px="md" // Adjust padding if needed
                      >
                        <Text ta="left" w="100%">
                          {subject.name}
                        </Text>
                      </Button>
                    ))}
                  </Stack>
                </ScrollArea>
              </Paper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={9}>
            <Paper shadow="xs" p="md" radius="md">
              {selectedSubject ? (
                <>
                  <Group justify="space-between">
                    <Title order={2}>{selectedSubject?.name || 'select a subject'}</Title>
                    <Group>
                      {editsubject && (
                        <Group>
                          <TextInput
                            placeholder="Enter new subject name"
                            value={subjectNameEdit}
                            onChange={(e) => setSubjectNameEdit(e.currentTarget.value)}
                          />
                          <Button bg="green" onClick={handleSubjectEdit}>
                            Save
                          </Button>
                        </Group>
                      )}
                      <Button
                        onClick={() => {
                          if (!editsubject) {
                            setSubjectNameEdit(selectedSubject.name);
                          }
                          setEditSubject(!editsubject);
                        }}
                      >
                        {editsubject ? 'Cancel' : "Edit Subject's Name"}
                      </Button>
                    </Group>
                  </Group>
                  <ScrollArea h="70vh" offsetScrollbars>
                    <Stack gap="md">
                      <Group mt="md">
                        <TextInput
                          placeholder="Enter system name/s (comma separated)"
                          value={systemName}
                          onChange={(e) => setSystemName(e.currentTarget.value)}
                        />
                        <Button
                          onClick={handleAddSystem}
                          loading={postSystemPending}
                          disabled={!systemName || !selectedSubject}
                        >
                          Add System
                        </Button>
                        <Text>
                          (this will add system to subject{' '}
                          {selectedSubject?.name || 'select a subject'})
                        </Text>
                      </Group>
                      {systemsData?.data?.docs?.length === 0 ? (
                        <Text>No systems available for this subject</Text>
                      ) : (
                        <Title order={3}>Available Systems</Title>
                      )}
                      <List size="lg">
                        {systemsData?.data?.docs?.map((system: System) => (
                          <ListItem key={system._id}>
                            <Group align="flex-end">
                              <Text>{system.name}</Text>
                              <Button
                                size="sm"
                                variant="subtle"
                                onClick={() => {
                                  if (selectedSystem?._id === system._id) {
                                    setSelectedSystem(null);
                                    return;
                                  }
                                  setSelectedSystem(system);
                                  setSystemNameEdit(system.name);
                                  setSystemSubjectChangeTo(selectedSubject._id);
                                }}
                              >
                                {selectedSystem?._id === system._id ? 'Cancel' : 'Edit'}
                              </Button>
                              {selectedSystem?._id === system._id && (
                                <Group align="flex-end">
                                  <TextInput
                                    label="Edit System Name"
                                    placeholder="Enter new system name"
                                    value={systemNameEdit}
                                    onChange={(e) => setSystemNameEdit(e.currentTarget.value)}
                                  />
                                  <Select
                                    data={subjectsData?.data?.docs?.map((subject: Subject) => {
                                      return { value: subject._id, label: subject.name };
                                    })}
                                    label="sent this system to another subject"
                                    placeholder="Select new subject"
                                    value={systemSubjectChangeTo}
                                    onChange={(value) => setSystemSubjectChangeTo(value as string)}
                                    allowDeselect={false}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      handleSystemEdit(system._id);
                                    }}
                                    color="green"
                                  >
                                    Save
                                  </Button>
                                </Group>
                              )}
                            </Group>
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </ScrollArea>
                </>
              ) : (
                <Text>Select a subject to add systems</Text>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Page>
  );
};

export default subjectAndSystems;
