import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/routes';
import { useSelector } from 'react-redux';

interface AuthGuardProps {
  children: ReactNode;
}

export function StudentGuard({ children }: AuthGuardProps) {
  const user = useSelector(
    (state: {
      provider: {
        user: any;
      };
    }) => state.provider.user
  );
  if (user.role !== 'STUDENT') {
    return <Navigate to={`${paths.dashboard.root}`} replace />;
  }

  return children;
}
