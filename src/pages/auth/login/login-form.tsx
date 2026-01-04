import { NavLink } from 'react-router-dom';
import { Anchor, Button, Group, Stack, StackProps } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Checkbox } from '@/components/forms/checkbox';
import { FormProvider } from '@/components/forms/form-provider';
import { PasswordInput } from '@/components/forms/password-input';
import { TextInput } from '@/components/forms/text-input';
import { useAuth, useLogin } from '@/hooks';
import { paths } from '@/routes';
import { handleFormErrors } from '@/utilities/form';
import { useDispatch } from 'react-redux';
import { loadUserid } from '@/store/interactions';

interface LoginFormProps extends Omit<StackProps, 'children'> {
  onSuccess?: () => void;
}

import { Text } from '@mantine/core';

export function LoginForm({ onSuccess, ...props }: LoginFormProps) {
  const dispatch = useDispatch();
  const { setIsAuthenticated } = useAuth();
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { phoneNumber: '', password: '' },
  });

  const handleSubmit = form.onSubmit((variables) => {
    login(
      { variables },
      {
        onSuccess: (data) => {
          loadUserid(data.user, dispatch);
          setIsAuthenticated(true);
        },
        onError: (error) => {
          console.log('error', error);
          // Ensure the error is passed to form and displayed
          handleFormErrors(form, error);
        },
      }
    );
  });

  return (
    <FormProvider form={form} onSubmit={handleSubmit}>
      <Stack {...props}>
        <TextInput name="phoneNumber" label="Phone Number" required />
        <PasswordInput name="password" label="Password" required />
        <Text c="red" fw="600" size="sm" mt="-5px" mb="-10px">
          {form.errors.global && form.errors.global}
        </Text>
        <Button type="submit" loading={isPending}>
          Login
        </Button>
      </Stack>
    </FormProvider>
  );
}
