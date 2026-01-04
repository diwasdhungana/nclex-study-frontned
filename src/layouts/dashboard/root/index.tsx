import { Outlet } from 'react-router-dom';
import { Paper, ScrollArea } from '@mantine/core';
import { Header } from '../header';
import classes from './root.module.css';

export function DashboardLayout() {
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Header />

        <main className={classes.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return <Outlet />;
}
export function StudentLayout() {
  return <Outlet />;
}
