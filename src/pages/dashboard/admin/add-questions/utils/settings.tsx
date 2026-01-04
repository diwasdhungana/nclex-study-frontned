// @ts-nocheck

import {
  Button,
  Checkbox,
  Group,
  InputLabel,
  Paper,
  Radio,
  Spoiler,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import React from 'react';
import JoditEditor from 'jodit-react';
import { SelectOne } from '@/pages/dashboard/admin/add-questions/question-categories/selectOne';
import { MatrixNGrid } from '@/pages/dashboard/admin/add-questions/question-categories/matrixNGrid';
import { Highlight } from '@/pages/dashboard/admin/add-questions/question-categories/highlight';
import { ExtDropDown } from '@/pages/dashboard/admin/add-questions/question-categories/extDropDown';
import { DragNDrop } from '@/pages/dashboard/admin/add-questions/question-categories/dragNdrop';
import { BowTie } from '@/pages/dashboard/admin/add-questions/question-categories/bowTie';
import { Mcq } from '@/pages/dashboard/admin/add-questions/question-categories/mcq';
import { FillBlanks } from '@/pages/dashboard/admin/add-questions/question-categories/fillBlanks';
import EditableContainer from './EditableContainer';
import { RichTextEditorComponent } from './RichTextEditorComponent';
import css from '@/pages/dashboard/everything.module.css';
export const Settings = ({ dataTunnel, response, setResponse }: any) => {
  const [hasAssistanceColumn, setHasAssistanceColumn] = React.useState(false);
  const [hasTabsInAssistance, setHasTabsinAssistance] = React.useState(false);
  const [tabsData, setTabsData] = React.useState<{
    title: string[];
    content: string[];
  }>({ title: [], content: [] });
  const [assistanceData, setAssistanceData] = React.useState('');
  const [assistanceTitle, setAssistanceTitle] = React.useState('');

  const handleDoubleTap = (text: string, index: number) => {
    const newTitle = [...tabsData.title];
    newTitle[index] = text;
    setTabsData({ title: newTitle, content: tabsData.content });
  };
  const handleRichContentChange = (item: string, index: number) => {
    const newContent = [...tabsData.content];
    newContent[index] = item;
    setTabsData({ title: tabsData.title, content: newContent });
  };
  const staticAssistanceDataHandleRichContentChange = (item: string, index: number) => {
    setAssistanceData(item);
  };

  return (
    <>
      <Paper shadow="xs" p="lg" radius="lg">
        <Stack>
          <Title order={4}>Question Configuration</Title>
          <Group>
            Has Assistance Column :{' '}
            <Checkbox
              checked={hasAssistanceColumn}
              onChange={() => setHasAssistanceColumn(!hasAssistanceColumn)}
            />
          </Group>
          {hasAssistanceColumn && (
            <Stack>
              <Stack gap="0px">
                <InputLabel fw={600}>Assistance Column Title</InputLabel>
                <RichTextEditorComponent
                  content={assistanceTitle}
                  setContent={(item: string, index: number) => {
                    setAssistanceTitle(item);
                  }}
                  index={0}
                />
              </Stack>
              <Radio.Group
                name="assistanceTabs"
                label={<Text fw="600">Assistance Column</Text>}
                onChange={(value) => {
                  if (value === 'tabs') {
                    setHasTabsinAssistance(true);
                  } else {
                    setHasTabsinAssistance(false);
                  }
                }}
                defaultValue={'data'}
              >
                <Group mt="xs">
                  <Radio value={'tabs'} label={'has tabs'} checked={hasTabsInAssistance} />
                  <Radio value={'data'} label={'plain data'} checked={!hasTabsInAssistance} />
                </Group>
              </Radio.Group>
            </Stack>
          )}
        </Stack>
      </Paper>
      {hasTabsInAssistance && hasAssistanceColumn && (
        <Spoiler
          maxHeight={0}
          showLabel={<Button bg="red">View Tabs</Button>}
          hideLabel={
            <Button mt="xs" bg="green">
              Save And Close Tabs
            </Button>
          }
          mb="xl"
        >
          <Stack>
            <Title order={4}>Add Tabs Data</Title>

            <Group justify="space-between">
              <Button
                onClick={() =>
                  setTabsData({
                    title: [...tabsData.title, 'double click edit, enter to save'],
                    content: [
                      ...tabsData.content,
                      '<h2 style="text-align: center;">Tab Content goes here.</h2>',
                    ],
                  })
                }
              >
                New Tab
              </Button>
              <Button bg="red" onClick={() => setTabsData({ title: [], content: [] })}>
                Clear All Tabs
              </Button>
            </Group>
            <Paper withBorder p="md" radius="lg">
              <Tabs w="100%">
                <Tabs.List>
                  {tabsData.title.map((item, index) => (
                    <Tabs.Tab value={(item + index).toString()} key={index}>
                      <Group>
                        <EditableContainer
                          doubleClick={true}
                          handleEnter={(text) => handleDoubleTap(text, index)}
                          style={{ margin: '0px' }}
                        >
                          {item}
                        </EditableContainer>
                        <Button
                          radius="xl"
                          variant="subtle"
                          onClick={() => {
                            const newTitle = [...tabsData.title];
                            const newContent = [...tabsData.content];
                            newTitle.splice(index, 1);
                            newContent.splice(index, 1);
                            setTabsData({ title: newTitle, content: newContent });
                          }}
                        >
                          <Text ta="center" c="red" fw="bold">
                            X
                          </Text>
                        </Button>
                      </Group>
                    </Tabs.Tab>
                  ))}
                </Tabs.List>

                {tabsData.content.map((item, index) => (
                  <Tabs.Panel
                    value={(tabsData.title[index] + index).toString()}
                    key={index}
                    w="100%"
                  >
                    <RichTextEditorComponent
                      content={item}
                      setContent={(item: any, index: number) => {
                        handleRichContentChange(item, index);
                      }}
                      index={index}
                    />
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Paper>
          </Stack>
        </Spoiler>
      )}
      {!hasTabsInAssistance && hasAssistanceColumn && (
        <Spoiler
          maxHeight={0}
          showLabel={<Button bg="red">Add Assistance Page Data</Button>}
          hideLabel={
            <Button mt="xs" bg="green">
              Save And Close Assistance Page
            </Button>
          }
          mb="xl"
        >
          <Stack>
            <Title order={4}>Add Assistance Page Data</Title>
            <RichTextEditorComponent
              content={assistanceData}
              setContent={(item: any, index: number) => {
                staticAssistanceDataHandleRichContentChange(item, index);
              }}
              index={0}
            />
          </Stack>
        </Spoiler>
      )}
      {response.assiatanceError && <Text c="red">{response.assiatanceError}</Text>}

      {renderQuestionType(
        dataTunnel,
        hasAssistanceColumn,
        hasTabsInAssistance,
        tabsData,
        assistanceData,
        assistanceTitle,
        response,
        setResponse
      )}
    </>
  );
};

const renderQuestionType = (
  dataTunnel = {
    selectedQuestionType: '',
    hasAssistanceColumn: false,
    hasTabsInAssistance: false,
    tabsData: {},
    assistanceData: '',
    assistanceTitle: '',
  },
  hasAssistanceColumn = false,
  hasTabsInAssistance = false,
  tabsData = {},
  assistanceData = '',
  assistanceTitle = '',
  response = {},
  setResponse = (response: { assiatanceError: string; questionError: string }) => {}
) => {
  dataTunnel = {
    ...dataTunnel,
    hasAssistanceColumn,
    hasTabsInAssistance,
    tabsData,
    assistanceData,
    assistanceTitle,
  };
  switch (dataTunnel.selectedQuestionType) {
    case 'selectOne':
      return <SelectOne dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'matrixNGrid':
      return <MatrixNGrid dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'highlight':
      return <Highlight dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'extDropDown':
      return <ExtDropDown dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'dragNDrop':
      return <DragNDrop dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'bowTie':
      return <BowTie dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'mcq':
      return <Mcq dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    case 'fillBlanks':
      return <FillBlanks dataTunnel={dataTunnel} response={response} setResponse={setResponse} />;
    default:
      return null;
  }
};

///this one makes the whole div editable but i havenot found a way to make it save html data.
{
  /* <div
id="ctleditor_html"
className={css.edit_textEditor}
contentEditable={true}
suppressContentEditableWarning={true}
dangerouslySetInnerHTML={{ __html: item }}
// value={item}
onInput={(event: React.FormEvent<HTMLDivElement>) => {
  const input = (event.target as HTMLDivElement).innerHTML;
  const title = [...tabsData.title];
  const newContent = [...tabsData.content];
  newContent[index] = input;
  setTabsData({ title, content: newContent });
}}
/> */
}
