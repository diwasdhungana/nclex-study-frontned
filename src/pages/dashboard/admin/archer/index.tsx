import { Page } from '@/components/page';
import React from 'react';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { paths } from '@/routes';
import { useNavigate } from 'react-router-dom';
import classes from '@/pages/dashboard/everything.module.css';
import { GoArrowLeft } from 'react-icons/go';

const index = () => {
  const navigate = useNavigate();

  return (
    <Page title="Home" className={classes.root}>
      <Group justify="center" h="80%">
        <Stack justify="center" align="center">
          <Title className={classes.title}> Timed Test Page </Title>
          <Text>Manage Timed Test Questions and Sets.</Text>
          <Divider my="md" bg="#ff4136" w="100%" />
          <Group>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.root);
              }}
              bg="#ff4136"
            >
              <GoArrowLeft strokeWidth={3} size={20} />
              &nbsp; Home
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.timed.addQuestion);
              }}
            >
              Add Questions
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.timed.viewQuestions.root);
              }}
            >
              View Questions
            </Button>
            <Button
              size="xl"
              onClick={() => {
                navigate(paths.dashboard.admin.timed.manageSets.root);
              }}
            >
              Manage Sets
            </Button>
          </Group>
        </Stack>
      </Group>
    </Page>
  );
};

export default index;
