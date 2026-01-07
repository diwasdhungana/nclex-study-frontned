import { Page } from '@/components/page';
import React, { useEffect, useState } from 'react';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { paths } from '@/routes';
import { useNavigate } from 'react-router-dom';
import classes from '@/pages/dashboard/everything.module.css';
import { useGetMyArcherTests } from '@/hooks';
import { GoArrowLeft } from 'react-icons/go';

const index = () => {
  const navigate = useNavigate();
  const [showActiveTests, setShowActiveTests] = useState<boolean>(false);
  const {
    data: activeTests,
    isError: activeTestsError,
    isLoading: activeTestsLoading,
  } = useGetMyArcherTests({
    query: {},
  });
  useEffect(() => {
    if (
      activeTests &&
      activeTests?.data?.docs?.filter((test: any) => test.status == 'active').length > 0
    ) {
      setShowActiveTests(true);
    }
  });
  return (
    <Page title="Home" className={classes.root}>
      <Group justify="center" h="80%">
        <Stack justify="center" align="center">
          <Title className={classes.title}> Timed Test Page </Title>
          <Text>Timed test you must finish within 2 hours 30 minutes. </Text>
          <Divider my="md" bg="red" w="100%" />
          <Group>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.student.root);
              }}
              bg="red"
            >
              <GoArrowLeft strokeWidth={3} size={20} />
              &nbsp; Home
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.student.timed.createTest.root);
              }}
            >
              New Timed Test
            </Button>
            {showActiveTests && (
              <Button
                size="xl"
                onClick={() => {
                  navigate(paths.dashboard.student.timed.activeTest.root);
                }}
              >
                Active Timed Test
              </Button>
            )}
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.student.timed.viewResults.root);
              }}
            >
             Timed Test Results
            </Button>
          </Group>
        </Stack>
      </Group>
    </Page>
  );
};

export default index;
