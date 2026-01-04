import { Page } from '@/components/page';

import classes from '@/pages/dashboard/everything.module.css';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const handleGotoAdminPanel = () => {
    navigate(paths.dashboard.admin.root);
  };
  const user = useSelector(
    (state: {
      provider: {
        user: any;
      };
    }) => state.provider.user
  );
  useEffect(() => {
    if (user) {
      // console.log(user);
      if (user.role === 'ADMIN') navigate(paths.dashboard.admin.root);
      if (user.role === 'STUDENT') navigate(paths.dashboard.student.root);
    }
  });
  return (
    <Page title="Home" className={classes.root}>
      <Group justify="center" h="80%">
        <Stack justify="center" align="center">
          <Title className={classes.title}>Welcome to Nclex Study's </Title>
          <Title className={classes.title}> NCLEX practice app </Title>
          <Text>other pages will be available very soon.</Text>
          <Divider my="md" bg="red" w="100%" />
          <Button size="xl" onClick={handleGotoAdminPanel} w="200px">
            Admin Page
          </Button>
        </Stack>
      </Group>
    </Page>
  );
}
