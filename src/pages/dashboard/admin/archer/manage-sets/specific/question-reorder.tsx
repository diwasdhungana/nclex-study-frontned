import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Box, Paper, Text, Group, Button } from '@mantine/core';
import { paths } from '@/routes';

interface Question {
  _id: string;
  hashTag: string;
}

interface QuestionReorderProps {
  questions: Question[];
  onReorder: (hashtags: string[]) => void;
  isLoading?: boolean;
}

const QuestionReorder = ({ questions, onReorder, isLoading = false }: QuestionReorderProps) => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [orderedQuestions, setOrderedQuestions] = useState(questions);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedQuestions(items);
  };

  const handleTagClick = (hashtag: string) => {
    setSelectedTag(hashtag);
  };

  const handleTagDoubleClick = (questionId: string) => {
    // on a new tab
    window.open(paths.dashboard.admin.timed.viewQuestions.root + '/' + questionId, '_blank');
    // navigate(paths.dashboard.admin.timed.viewQuestions.root + '/' + questionId);
  };

  const handleSaveOrder = () => {
    onReorder(orderedQuestions.map((q) => q.hashTag));
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ minHeight: '200px' }}
            >
              {orderedQuestions.map((question, index) => (
                <Group>
                  {index + 1}.
                  <Draggable key={question._id} draggableId={question._id} index={index}>
                    {(provided, snapshot) => (
                      <Paper
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        shadow={snapshot.isDragging ? 'md' : 'sm'}
                        p="sm"
                        mb="sm"
                        style={{
                          backgroundColor: selectedTag === question.hashTag ? '#ffe5e5' : 'white',
                          cursor: 'grab',
                          ...provided.draggableProps.style,
                        }}
                        onClick={() => handleTagClick(question.hashTag)}
                        onDoubleClick={() => handleTagDoubleClick(question._id)}
                      >
                        <Text size="lg" style={{ userSelect: 'none' }}>
                          #{question.hashTag}
                        </Text>
                      </Paper>
                    )}
                  </Draggable>
                </Group>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Group justify="right" mt="xl">
        <Button onClick={handleSaveOrder} loading={isLoading} variant="filled" color="blue">
          Save Order
        </Button>
      </Group>
    </Box>
  );
};

export default QuestionReorder;
