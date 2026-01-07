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
        <Link to="/"
        //open new tab on control click without effecting the old tab
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            window.open('/', '_blank'); 

          }
        }}
     
        >

        <LogoImage
          
          />
          </Link>
      </Group>
      <Group>
        <ColorSchemeToggler />
        <CurrentUser />
      </Group>
    </StickyHeader>
  );
}
