import { Page } from '@/components/page';
import { useGetAllSets, usePatchArcherSet } from '@/hooks/api/questions';
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
  Table,
  ScrollArea,
} from '@mantine/core';
import React from 'react';
import { PiArrowLeft, PiToggleLeftDuotone, PiToggleRightDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const ViewQuestions = () => {
  const navigate = useNavigate();
  const { mutate: patchArcherSet } = usePatchArcherSet();

  // Fetch all sets for filtering
  const { data: allSets } = useGetAllSets({
    query: { getAll: true },
  });

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
          <Button variant="subtle" onClick={() => navigate(paths.dashboard.admin.archer.root)}>
            <PiArrowLeft size="xl" strokeWidth={10} />
            <Title order={3} mx="sm">
              Archer Page
            </Title>
          </Button>
        </Group>

        {/* Set Management Section */}
        <Paper radius="lg" p="md">
          <Title order={3} mb="md">
            Manage Sets
          </Title>
          <ScrollArea>
            <Table striped highlightOnHover withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Set Name</Table.Th>
                  <Table.Th>Questions</Table.Th>
                  <Table.Th>Full Marks</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {allSets?.data?.docs.map((set: any) => (
                  <Table.Tr key={set._id}>
                    <Table.Td>{set.name}</Table.Td>
                    <Table.Td>{set.questions.length}</Table.Td>
                    <Table.Td>{set.fullMarks}</Table.Td>
                    <Table.Td>
                      <Badge color={set.enabled ? 'green' : 'red'}>
                        {set.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <Button
                          variant="subtle"
                          onClick={() => toggleSetStatus(set._id, set.enabled)}
                        >
                          {set.enabled ? (
                            <PiToggleRightDuotone size={30} color="green" />
                          ) : (
                            <PiToggleLeftDuotone size={30} color="red" />
                          )}
                        </Button>
                        <Button
                          variant="subtle"
                          onClick={() =>
                            navigate(`${paths.dashboard.admin.archer.manageSets.root}/${set._id}`)
                          }
                        >
                          Reorder Questions
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Stack>
    </Page>
  );
};

export default ViewQuestions;
