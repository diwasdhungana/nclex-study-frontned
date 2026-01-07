import { Page } from '@/components/page';
import React from 'react';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { paths } from '@/routes';
import { useNavigate } from 'react-router-dom';
import classes from '@/pages/dashboard/everything.module.css';
import {
  PiEyeBold,
  PiPersonSimpleSkiBold,
  PiUsers,
  PiUsersBold,
  PiVideoBold,
} from 'react-icons/pi';

const index = () => {
  const navigate = useNavigate();

  return (
    <Page title="Home" className={classes.root}>
      <Group justify="center" h="80%">
        <Stack justify="center" align="center">
          <Title className={classes.title}> Admin Page </Title>
          <Text>Manage Regular Tests, Timed Tests and Class Recordings.</Text>
          <Divider my="md" bg="red" w="100%" />
          <Group>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.addQuestions.root);
              }}
            >
              Add Questions
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.viewQuestions.root);
              }}
            >
              <PiEyeBold size={20} />
              &nbsp; View Questions
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.viewSubjectSystem.root);
              }}
            >
              Subjects and Systems
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.groupQuesitons.root);
              }}
            >
              Group Questions
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.timed.root);
              }}
              bg="red"
            >
              Timed Test
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.users.root);
              }}
              bg="green"
            >
              <PiUsersBold size={20} />
              &nbsp; User Management
            </Button>
            <Button
              bg={'blue'}
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.video.root);
              }}
            >
              <PiVideoBold size={20} />
              &nbsp; Class Recordings
            </Button>
          </Group>
        </Stack>
      </Group>
    </Page>
  );
};

export default index;
