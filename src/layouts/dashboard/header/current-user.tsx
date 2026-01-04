import {
  PiChatDuotone,
  PiGearSixDuotone,
  PiHeartDuotone,
  PiPauseDuotone,
  PiSignOut,
  PiStarDuotone,
  PiTrashDuotone,
  PiUserSwitchDuotone,
} from 'react-icons/pi';
import { Avatar, AvatarProps, Button, ElementProps, Menu } from '@mantine/core';
import { useAuth, useLogout } from '@/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserid } from '@/store/interactions';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes';

type CurrentUserProps = Omit<AvatarProps, 'src' | 'alt'> & ElementProps<'div', keyof AvatarProps>;

export function CurrentUser(props: CurrentUserProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: logout, isPending } = useLogout();
  const { setIsAuthenticated } = useAuth();
  const handleLogout = () => {
    logout(
      { variables: {} },
      {
        onSuccess: () => {
          setIsAuthenticated(false);
          loadUserid({}, dispatch);
        },
        onError: (error) => {
          console.log('error', error);
        },
      }
    );
  };

  const user = useSelector((state: any) => state.provider.user);

  return (
    <Menu>
      <Menu.Target>
        <Avatar
          src={user?.image ?? null}
          alt={user?.displayName ?? 'Current user'}
          {...props}
          style={{ cursor: 'pointer', ...props.style }}
          size={'48px'}
        ></Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>{user?.name}</Menu.Item>
        <Menu.Item>{user?.phoneNumber}</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => navigate(paths.dashboard.myProfile.root)}>Edit Profile</Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<PiSignOut size="1rem" />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
