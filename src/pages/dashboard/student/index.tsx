import { Page } from '@/components/page';
import React, { useEffect, useState } from 'react';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { paths } from '@/routes';
import { useNavigate } from 'react-router-dom';
import classes from '@/pages/dashboard/everything.module.css';
import { useGetMyTests } from '@/hooks';
import { useSelector } from 'react-redux';
import { PiVideoBold } from 'react-icons/pi';

const index = () => {
  const navigate = useNavigate();
  const [showActiveTests, setShowActiveTests] = useState<boolean>(false);
  const {
    data: activeTests,
    isError: activeTestsError,
    isLoading: activeTestsLoading,
  } = useGetMyTests({
    query: {
      status: 'active',
    },
  });
  useEffect(() => {
    if (activeTests && activeTests?.data?.docs?.length > 0) {
      setShowActiveTests(true);
    }
  });
  const user = useSelector(
    (state: {
      provider: {
        user: any;
      };
    }) => state.provider.user
  );
  return (
    <Page title="Home" className={classes.root}>
      <Group justify="center" h="80%">
        <Stack justify="center" align="center">
          <Title className={classes.title}> Student Page </Title>
          <Text>Explore different tests and class recordings.</Text>
          <Divider my="md" bg="red" w="100%" />
          <Group>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.student.createTest.root);
              }}
            >
              New Test
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.student.viewResults.root);
              }}
            >
              Results History
            </Button>
            {showActiveTests && (
              <Button
                size="xl"
                onClick={() => {
                  navigate(paths.dashboard.student.activeTest.root);
                }}
              >
                Active Tests
              </Button>
            )}
            {user.archerEligible && (
              <Button
                bg="red"
                size="xl"
                onClick={() => {
                  navigate(paths.dashboard.student.archer.root);
                }}
              >
                Visit Archer
              </Button>
            )}
            {user.classRecordingEligible && (
              <Button
                bg="blue"
                size="xl"
                onClick={() => {
                  navigate(paths.dashboard.student.video.root);
                }}
              >
                <PiVideoBold size={20} />
                &nbsp; Class Recordings
              </Button>
            )}
          </Group>
        </Stack>
      </Group>
    </Page>
  );
};

export default index;
