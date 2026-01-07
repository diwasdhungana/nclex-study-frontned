import { Page } from '@/components/page';
import { useGetArcherQuestions, useGetAllSets } from '@/hooks/api/questions';
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
import {
  PiArrowLeft,
  PiTrashBold,
  PiMagnifyingGlass,
  PiToggleLeft,
  PiToggleRight,
} from 'react-icons/pi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { useDeleteManyArcherQuestions, usePatchArcherSet } from '@/hooks';
import css from '@/pages/dashboard/everything.module.css';
import { useDebouncedValue } from '@mantine/hooks';
import { LoadingScreen } from '@/components/loading-screen';
import { notifications } from '@mantine/notifications';
import { useGetSets } from '@/hooks/api/set';
import { QuestionKinds } from '@/enum/QuestionKind.enum';

const ViewQuestions = () => {
  const navigate = useNavigate();
  const { data: setsData, isError: setsError } = useGetSets({ query: { getAll: true } });
  const [searchParams, setSearchParams] = useSearchParams();
  const [newPage, setNewPage] = useState(1);
  const [limit] = useState(10);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    kind: searchParams.get('kind') || '',
    filters: searchParams.get('filters') || '',
    archerSet: searchParams.get('archerSet') || '', // New filter for archerSet
  });

  const [debouncedFilters] = useDebouncedValue(filters, 300);

  const { mutate: deleteQuestionMutate, isPending } = useDeleteManyArcherQuestions();
  const { mutate: patchArcherSet } = usePatchArcherSet();

  // Fetch all sets for filtering
  const { data: allSets } = useGetAllSets({
    query: { getAll: true },
  });

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
  } = useGetArcherQuestions({
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

  const toggleSetStatus = (setId: string, isActive: boolean) => {
    patchArcherSet({
      route: {
        setId,
      },
    });
  };

  return (
    <Page title="View Questions">
      <Stack>
        <Group gap="xl" justify="space-between">
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.admin.timed.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} />
            <Title order={3} mx="sm">
              Admin Page
            </Title>
          </Button>
        </Group>
        <Title order={2} ml="xl">
          View Archer Questions
        </Title>
        {/* //backend dooesnot support the search feature yet. */}
        {/* Search and Filter Section */}
        <Paper p="md" radius="lg" withBorder>
          <Stack gap="sm">
            <Group grow>
              {/* <TextInput
                placeholder="Search questions..."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                rightSection={<PiMagnifyingGlass />}
              /> */}
              <Select
                placeholder="Filter by set"
                value={filters.archerSet}
                onChange={(value) => handleFilterChange('archerSet', value || '')}
                data={setsData?.data?.docs.map((archerSet: any) => ({
                  value: archerSet._id.toString(),
                  label: archerSet.name,
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
                          navigate(
                            paths.dashboard.admin.timed.viewQuestions.root + '/' + question._id
                          )
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
                        <Badge color="orange" variant="light">
                          {question?.archerSet?.name || 'Readiness Assesment ##'}
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
