import { Page } from '@/components/page';
import { useGetQuestions } from '@/hooks/api/questions';
import { paths } from '@/routes';
import {
  Badge,
  Button,
  Group,
  Pagination,
  Paper,
  Stack,
  Text,
  Title,
  TextInput,
  Select,
} from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { PiArrowLeft, PiTrashBold, PiMagnifyingGlass } from 'react-icons/pi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { useDeleteManyQuestions, useGetSubjects, useGetSystems } from '@/hooks';
import css from '@/pages/dashboard/everything.module.css';
import { useDebouncedValue } from '@mantine/hooks';
import { LoadingScreen } from '@/components/loading-screen';
import { notifications } from '@mantine/notifications';
import { QuestionKinds } from '@/enum/QuestionKind.enum';

interface Subject {
  _id: string;
  name: string;
}

interface System {
  _id: string;
  name: string;
  subject: string;
}

const ViewQuestions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSubject, setSelectedSubject] = React.useState<null | string>(null);
  const [newPage, setNewPage] = React.useState(1);
  const [limit] = useState(10);
  const { data: subjectsData, isError: subjectsDataError } = useGetSubjects({
    query: { getAll: true },
  });
  const { data: systemsData, isError: systemsDataError } = useGetSystems({
    query: { getAll: true, subjects: [selectedSubject] },
  });
  // Initialize state from URL parameters
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    kind: searchParams.get('kind') || '',
    subject: searchParams.get('subject') || '',
    system: searchParams.get('system') || '',
    filters: searchParams.get('filters') || '',
  });

  // Debounce the search input to prevent too many API calls
  const [debouncedFilters] = useDebouncedValue(filters, 300);

  const { mutate: deleteQuestionMutate, isPending } = useDeleteManyQuestions();

  // Update URL when filters or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [page, debouncedFilters, setSearchParams]);

  const {
    data: Questions,
    isError: questionsError,
    isLoading: questionsLoading,
  } = useGetQuestions({
    query: {
      page: page.toString(),
      limit: limit.toString(),
      ...debouncedFilters,
    },
  });

  const totalPages = Questions ? Math.ceil(Questions.data.totalDocs / limit) : 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const deleteQuestion = (id: string) => {
    modals.openConfirmModal({
      title: 'Delete selected Question?',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete the selected question?</Text>,
      labels: { confirm: 'Delete Question', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () =>
        deleteQuestionMutate({
          route: {
            id: id,
          },
        }),
      onWaiting: () => modals.openContextModal('Deleting Question...' as any),
    });
  };

  return (
    <Page title="View Questions">
      <Stack>
        <Group gap="xl" justify="space-between">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.admin.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} />
            <Title order={3} mx="sm">
              Admin Page
            </Title>
          </Button>
        </Group>
        <Title order={2}>View Questions</Title>

        <Paper p="md" radius="lg" withBorder>
          <Stack gap="sm">
            <Group grow>
              <Select
                placeholder="Filter by  Subject"
                value={filters.subject}
                onChange={(value) => {
                  setSelectedSubject(value);
                  handleFilterChange('subject', value || '');
                }}
                data={subjectsData?.data?.docs.map((subject: Subject) => ({
                  label: subject.name,
                  value: subject._id,
                }))}
                clearable
              />
              <Select
                placeholder="Filter by  System"
                value={filters.system}
                onChange={(value) => handleFilterChange('system', value || '')}
                data={systemsData?.data?.docs.map((system: System) => ({
                  label: system.name,
                  value: system._id,
                }))}
                clearable
              />
              <Select
                placeholder="Filter by  Question type"
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value || '')}
                data={[
                  { label: 'Traditional', value: 'Traditional' },
                  { label: 'NextGen', value: 'Next Gen' },
                ]}
                clearable
              />
              <Select
                placeholder="Filter by  Question kind"
                value={filters.kind}
                onChange={(value) => handleFilterChange('kind', value || '')}
                data={Object.values(QuestionKinds)}
                clearable
              />
            </Group>
          </Stack>
        </Paper>

        {/* Questions List */}
        <Paper radius="lg">
          <Stack px="md">
            {questionsLoading && (
              <Text>
                <LoadingScreen></LoadingScreen>
              </Text>
            )}
            {questionsError && <Text color="red">Error loading questions</Text>}

            {Questions?.data?.docs?.map((question: any, index: any) => (
              <Paper key={index} px="xl" radius="sm" shadow="none" withBorder>
                <Group justify="space-between">
                  <Stack w="92%">
                    <Group>
                      <Text>{Questions.data.totalDocs - index - (page - 1) * limit}.</Text>
                      <div
                        className={css.htmlContentDisplay}
                        dangerouslySetInnerHTML={{ __html: question.title }}
                        onClick={() =>
                          navigate(paths.dashboard.admin.viewQuestions.root + question._id)
                        }
                        style={{ cursor: 'pointer' }}
                      />
                    </Group>
                    <Group mb="xs" justify="space-between" w="100%">
                      <Group>
                        {question.belongsToGroup && (
                          <Badge color="purple" variant="light">
                            {'#' + question?.groupTag || 'Group tag'}
                          </Badge>
                        )}
                        {question.belongsToGroup && (
                          <Badge color="purple" variant="light">
                            Qno : {question?.indexInGroup + 1}
                          </Badge>
                        )}
                        <Badge
                          color="purple"
                          variant="light"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            navigator.clipboard.writeText(question.hashTag);
                            notifications.show({
                              color: 'green',
                              title: 'Copied to clipboard',
                              message: question.hashTag,
                            });
                          }}
                        >
                          {'#' + question?.hashTag || 'Question tag'}
                        </Badge>
                        <Badge color="blue" variant="light">
                          {question.type}
                        </Badge>
                        <Badge color="green" variant="light">
                          {question.kind}
                        </Badge>
                      </Group>
                      <Group>
                        <Badge color="red" variant="light">
                          {question?.subject?.name || 'subject'}
                        </Badge>
                        <Badge color="orange" variant="light">
                          {question?.system?.name || 'system'}
                        </Badge>
                        <Badge color="black" variant="light">
                          points: {question?.points || 'N/A'}
                        </Badge>
                      </Group>
                    </Group>
                  </Stack>
                  <Button
                    variant="subtle"
                    bg="none"
                    size="xs"
                    radius="10"
                    onClick={() => deleteQuestion(question._id)}
                  >
                    <PiTrashBold size="30px" color="red" style={{ margin: '5px' }} />
                  </Button>
                </Group>
              </Paper>
            ))}
          </Stack>

          {/* Pagination */}
          <Group justify="space-between" py="md">
            <Group></Group>
            <Pagination
              className={css.paginationControls}
              value={page}
              onChange={handlePageChange}
              total={totalPages}
              size="sm"
              radius="xs"
            />
            <Group>
              jump to page
              <TextInput
                w="80px"
                type="number"
                value={newPage}
                onChange={(e) => setNewPage(parseInt(e.currentTarget.value))}
                onKeyDownCapture={(e) => {
                  if (e.key === 'Enter') {
                    if (newPage > 0 && newPage <= totalPages) {
                      setPage(newPage);
                    }
                  }
                }}
              />
            </Group>
          </Group>
        </Paper>
      </Stack>
    </Page>
  );
};

export default ViewQuestions;
