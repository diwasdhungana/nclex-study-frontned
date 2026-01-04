import React from 'react';
import { Stack, Tabs, Text } from '@mantine/core';
import css from '@/pages/dashboard/everything.module.css';

//let's create a type for the data that we will pass to the AssistanceTabs component
type AssistanceTabData = {
  title: string;
  content: string;
};

export const AssistanceTabsView = ({ data }: { data: AssistanceTabData[] }) => {
  return (
    <Tabs defaultValue={data[0]?.title}>
      <Tabs.List>
        {data?.map((item, index) => (
          <Tabs.Tab value={item?.title} key={index}>
            <Text size="sm">{item?.title}</Text>
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {data?.map((item, index) => (
        <Tabs.Panel value={item?.title} key={index}>
          <Stack>
            <div
              className={css.htmlContentDisplay}
              dangerouslySetInnerHTML={{ __html: item?.content }}
            />
          </Stack>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
