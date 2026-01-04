import { PiArrowLeft as GoBackIcon } from 'react-icons/pi';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Button, Center, Flex, Image, SimpleGrid, Space, Text, Title } from '@mantine/core';
import demoImg from '@/assets/app-demo.webp';
import { Logo } from '@/components/logo';
import logoImage from '@/assets/logoImage.png';

export function AuthLayout() {
  const navigate = useNavigate();

  return (
    <SimpleGrid mih="100vh" p="md" cols={{ base: 1, lg: 2 }}>
      <Flex direction="column" align="flex-start">
        {/* <Button
          c="inherit"
          variant="subtle"
          leftSection={<GoBackIcon size="1rem" />}
          onClick={() => navigate(-1)}
        >
          Go back
        </Button> */}

        <Center flex={1} w="100%">
          <Box maw="25rem">
            <Outlet />
          </Box>
        </Center>
      </Flex>

      <Center
        ta="center"
        p="4rem"
        bg="var(--mantine-color-default-hover)"
        display={{ base: 'none', lg: 'flex' }}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
      >
        <Box maw="40rem">
          <Title order={2}>Get Prepared for your Nursing Journey.</Title>
          <Text my="lg" c="dimmed">
            With our platform, you can get access to the best resources and tools to help you
            prepare for your nursing journey.
          </Text>

          <Image src={logoImage} alt="Demo" display={{ base: 'none', lg: 'block' }} />
        </Box>
      </Center>
    </SimpleGrid>
  );
}
