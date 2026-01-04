import {
  Button,
  Group,
  InputLabel,
  NumberInput,
  Paper,
  Radio,
  Space,
  Stack,
  Text,
  Textarea,
  Title,
  SegmentedControl,
  FileInput,
  Image,
  LoadingOverlay,
} from '@mantine/core';
import { useFileUpload } from '@/hooks/api/fileUpload';
import React, { useRef, useState } from 'react';
import { RichTextEditorComponent } from '../utils/RichTextEditorComponent';
import { SubmitQuestion } from '../utils/SubmitQuestion';
import { notifications } from '@mantine/notifications';

// Interface for internal component state
interface OptionWithType {
  value: string;
  checked: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
}

export const SelectOne = ({ dataTunnel, response, setResponse }: any) => {
  const inputRefs = useRef<any[]>([]);
  const [options, setOptions] = useState<any[]>([
    { value: 'option 0', checked: false, type: 'text' },
    { value: 'option 1', checked: false, type: 'text' },
  ]);
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState(5);

  const { mutate: uploadImage, isPending: uploadImagePending } = useFileUpload();

  const handleFocus = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
    }
  };

  const handleImageUpload = (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);

    uploadImage(
      { variables: formData },
      {
        onSuccess: (data) => {
          const newOptions = options.map((opt, idx) => {
            if (idx === index) {
              return {
                ...opt,
                value: data, // Set value to the URL
                imageUrl: data, // Keep imageUrl for preview
              };
            }
            return opt;
          });
          console.log('newOptions', newOptions);
          setOptions(newOptions);
        },
        onError: (error) => {
          if (error.messages?.[0]) {
            notifications.show({ message: error.messages[0], color: 'red' });
          } else {
            notifications.show({ message: 'Uploads will be available soon.', color: 'red' });
          }
        },
      }
    );
  };

  // Transform options to the expected format for submission
  const getSubmissionOptions = () => {
    return options.map(({ value, checked }) => ({
      value,
      checked,
    }));
  };

  return (
    <Paper shadow="xs" p="lg" radius="lg" mt="sm">
      <LoadingOverlay visible={uploadImagePending} />
      <Title order={3} mb="xl">
        Type : Select One
      </Title>
      <Group>
        <NumberInput
          label="Points (1-20)"
          value={points}
          onChange={(e) => setPoints(Number(e))}
          placeholder="Points"
          min={1}
          max={20}
        />
      </Group>
      <InputLabel>Main Question (Title)</InputLabel>
      {response.titleError && <Text c="red">{response.titleError}</Text>}
      <RichTextEditorComponent content={title} setContent={(item) => setTitle(item)} index={0} />

      <Stack mt="md">
        <InputLabel required>Options :</InputLabel>
        {response.optionsError && <Text c="red">{response.optionsError}</Text>}
        {options.map((option, index) => (
          <Group gap="xs" key={index} w="100%" align="flex-start">
            <Radio
              name="selectOne"
              checked={option.checked}
              onChange={() => {
                const newOptions = options.map((opt) => ({
                  ...opt,
                  checked: opt === option,
                }));
                setOptions(newOptions);
              }}
            />
            <Stack w="90%">
              <SegmentedControl
                value={option.type}
                onChange={(value) => {
                  const optionType = value as 'text' | 'image';
                  const newOptions = options.map((opt, idx) =>
                    idx === index ? { ...opt, type: value, value: '', imageUrl: undefined } : opt
                  );
                  setOptions(newOptions);
                }}
                data={[
                  { label: 'Text', value: 'text' },
                  { label: 'Image', value: 'image' },
                ]}
              />
              {option.type === 'text' ? (
                <Textarea
                  value={option.value}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onFocus={() => handleFocus(index)}
                  onChange={(e) => {
                    const newOptions = options.map((opt, idx) =>
                      idx === index ? { ...opt, value: e.target.value } : opt
                    );
                    setOptions(newOptions);
                  }}
                  autosize
                  minRows={2}
                />
              ) : (
                <Stack>
                  <FileInput
                    accept="image/*"
                    onChange={(file) => file && handleImageUpload(file, index)}
                    placeholder="Upload image"
                  />
                  {option.imageUrl && (
                    <Image
                      src={option.imageUrl}
                      alt={`Option ${index + 1}`}
                      fit="contain"
                      h={200}
                    />
                  )}
                </Stack>
              )}
            </Stack>
            <Button
              variant="subtle"
              onClick={() => {
                const newOptions = options.filter((_, idx) => idx !== index);
                setOptions(newOptions);
              }}
            >
              X
            </Button>
          </Group>
        ))}
        <Group>
          <Button
            size="sm"
            onClick={() => {
              setOptions([...options, { value: '', checked: false, type: 'text' }]);
            }}
          >
            Add Option
          </Button>
        </Group>
      </Stack>

      <InputLabel mt="lg" required>
        Explanation (Shown after Answer Submit.)
      </InputLabel>
      {response.explanationError && <Text c="red">{response.explanationError}</Text>}
      <RichTextEditorComponent
        content={explanation}
        setContent={(item) => setExplanation(item)}
        index={0}
      />
      <Space h="lg" />

      <SubmitQuestion
        dataTunnel={() => ({
          ...dataTunnel,
          options: getSubmissionOptions(), // Use transformed options
          title,
          points,
          explanation,
        })}
        response={response}
        setResponse={setResponse}
      />
    </Paper>
  );
};
