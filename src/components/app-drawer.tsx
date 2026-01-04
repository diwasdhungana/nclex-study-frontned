import { Button, Drawer } from '@mantine/core';
import type { DrawerProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function AppDrawer({
  title,
  position,
  closure,
  children,
}: {
  title: string;
  position: DrawerProps['position'];
  closure: ReturnType<typeof useDisclosure>;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = closure;

  return (
    <>
      <Drawer opened={opened} onClose={close} title={title} position={position}>
        {children}
      </Drawer>

      <Button onClick={open}>Open Drawer</Button>
    </>
  );
}
