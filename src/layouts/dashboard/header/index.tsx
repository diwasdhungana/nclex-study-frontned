import { Link } from 'react-router-dom';
import { Group } from '@mantine/core';
import { ColorSchemeToggler } from '@/components/color-scheme-toggler';
import { LogoImage } from '@/components/logo';
import { SpotlightSearchBarButton } from '@/components/spotlight-search-bar-button';
import { StickyHeader } from '@/components/sticky-header';
import { CurrentUser } from './current-user';
import classes from './header.module.css';

export function Header() {
  return (
    <StickyHeader className={classes.root}>
      <Group>
        <LogoImage
          onClick={() => {
            window.location.href = '/';
          }}
        />
      </Group>
      <Group>
        <ColorSchemeToggler />
        <CurrentUser />
      </Group>
    </StickyHeader>
  );
}
