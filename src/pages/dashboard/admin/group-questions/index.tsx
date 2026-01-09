import { Page } from '@/components/page';
import { Badge, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import React, { useEffect } from 'react';
import { PiArrowLeft, PiCheckCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import {
  useGetQuestionByHashtag,
  useGetAllGroups,
  usePostGroup,
  useGetGroupQuestions,
  useDeleteGroup,
} from '@/hooks/api/questions';
import { set } from 'date-fns';

const index = () => {
  const navigate = useNavigate();
  const [searchHashtag, setSearchHashtag] = React.useState<string>('');
  const [newGroupTags, setNewGroupTags] = React.useState<string[]>([]);
  const [questionAvailable, setQuestionAvailabel] = React.useState<boolean>(false);
  const [createNewGroup, setCreateNewGroup] = React.useState<boolean>(false);
  const { data: groups, isLoading: groupsLoading, isError: groupsIsError } = useGetAllGroups();
  const {
    mutate: deleteGroup,
    isPending: deleteGroupLoading,
    isError: deleteGroupIsError,
  } = useDeleteGroup();
  const [selectedGroup, setSelectedGroup] = React.useState<string>('');
  const {
    data: groupData,
    isLoading: groupDataLoading,
    isError: groupDataIsError,
  } = useGetGroupQuestions({
    route: {
      groupId: selectedGroup,
    },
  });
  const {
    data: hashtags,
    isLoading: hashtagsLoading,
    isError: hashtagsIsError,
  } = useGetQuestionByHashtag({
    route: {
      hashtag: searchHashtag,
    },
  });

  const {
    mutate: postGroup,
    isPending: postGroupLoading,
    isError: postGroupIsError,
  } = usePostGroup();

  const searchForHashtag = (hashtag: string) => {
    setSearchHashtag(hashtag);
  };
  useEffect(() => {
    if (hashtags?.success) {
      setQuestionAvailabel(true);
    } else {
      setQuestionAvailabel(false);
    }
  }, [hashtags]);

  return (
    <Page title="Group Questions">
      <Stack>
        <Group gap="xl">
          <Button variant="subtle" onClick={() => navigate(-1)}>
            <PiArrowLeft size="xl" strokeWidth={10} />
          </Button>
          <Title order={1} mx="sm">
            Available Groups
          </Title>
        </Group>

        {createNewGroup ? (
          <Stack>
            <Text>Enter tag of the questions from first to the last. one at a time.</Text>
            <TextInput
              w="300px"
              type="text"
              placeholder="Question Hashtag witout #"
              value={searchHashtag}
              onChange={(e) => searchForHashtag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && questionAvailable) {
                  setNewGroupTags([...newGroupTags, searchHashtag]);
                  setSearchHashtag('');
                  setQuestionAvailabel(false);
                }
              }}
              rightSection={
                questionAvailable ? (
                  <div>
                    <Text c="green" mt="xs">
                      <PiCheckCircle size="sm" strokeWidth={2} />
                    </Text>
                  </div>
                ) : (
                  <div>
                    <Text c="#ff4136">N/A</Text>
                  </div>
                )
              }
            />
            {questionAvailable && <Text c="green">Press Enter to add Question.</Text>}
            <ol style={{ listStyleType: '1' }}>
              {newGroupTags.map((question: string) => (
                <li key={question}>
                  <Badge color="purple" variant="light">
                    {'#' + question || 'Question tag'}
                  </Badge>
                </li>
              ))}
            </ol>
            <Group>
              <Button
                variant="subtle"
                size="md"
                w="100px"
                onClick={() => {
                  setCreateNewGroup(false);
                  setNewGroupTags([]);
                  setSearchHashtag('');
                }}
              >
                Cancel
              </Button>
              <Button
                w="300px"
                disabled={newGroupTags.length < 2}
                onClick={() => {
                  postGroup({
                    variables: {
                      hashTags: newGroupTags,
                    },
                  });
                  setCreateNewGroup(false);
                }}
              >
                Create
              </Button>
            </Group>
          </Stack>
        ) : (
          <Button
            ml="xl"
            variant="subtle"
            size="md"
            w="200px"
            onClick={() => {
              setCreateNewGroup(true);
            }}
          >
            create new group +
          </Button>
        )}

        <ol style={{ listStyleType: 'upper-roman' }}>
          {groups?.data?.groupTags?.map((group: string, index: number) => (
            <li key={group}>
              <Button
                variant="transparent"
                size="md"
                w="200px"
                onClick={() => {
                  setSelectedGroup(group);
                }}
              >
                {group}
              </Button>
              {selectedGroup === group && (
                <Stack>
                  <Group>
                    <Group> Questions in this group</Group>
                    <Button
                      variant="subtle"
                      size="md"
                      w="100px"
                      onClick={() => {
                        deleteGroup({
                          route: {
                            groupId: group,
                          },
                        });
                      }}
                    >
                      Delete This Group
                    </Button>
                  </Group>
                  <ol style={{ listStyleType: '1' }}>
                    {groupData?.data?.map((question: any) => (
                      <li key={question._id}>
                        <Badge color="purple" variant="light">
                          {'#' + question.hashTag || 'Question tag'}
                        </Badge>
                      </li>
                    ))}
                  </ol>
                </Stack>
              )}
            </li>
          ))}
        </ol>
      </Stack>
    </Page>
  );
};

export default index;
