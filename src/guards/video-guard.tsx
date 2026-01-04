import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/routes';
import { useSelector } from 'react-redux';

interface VideoGuardProps {
  children: ReactNode;
}

export function VideoGuard({ children }: VideoGuardProps) {
  const user = useSelector(
    (state: {
      provider: {
        user: any;
      };
    }) => state.provider.user
  );
  if (user.role !== 'STUDENT' || !user.classRecordingEligible) {
    return <Navigate to={`${paths.dashboard.root}`} replace />;
  }
  return children;
}
