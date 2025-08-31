import * as React from "react";

import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Typography from "@mui/material/Typography";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {styled} from "@mui/material/styles";
import MuiToolbar from "@mui/material/Toolbar";
import {tabsClasses} from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import PaymentsIcon from '@mui/icons-material/Payments';

import NavbarBreadcrumbs from './NavbarBreadcrumbs.tsx';
import MenuButton from '../SideMenu/MenuButton.tsx';
import SideMenuMobile from "../SideMenu/SideMenuMobile.tsx";
import ColorModeIconDropdown from "../../theme/ColorModeIconDropdown.tsx";

const Toolbar = styled(MuiToolbar)({
    width: '100%',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '12px',
    flexShrink: 0,
    [`& ${tabsClasses.flexContainer}`]: {
        gap: '8px',
        p: '8px',
        pb: 0,
    },
});

export default function Header() {

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <Stack
            direction="row"
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
            }}
            spacing={2}
        >
            <Toolbar variant="regular">
                <Stack
                    direction="row"
                    sx={{
                        alignItems: 'center',
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'center', mr: 'auto' }}
                    >
                        <CustomIcon />
                        <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
                            Virtual Card Platform
                        </Typography>
                    </Stack>
                    <ColorModeIconDropdown />
                    <Stack direction="row" sx={{ gap: 1 }}>
                        <MenuButton showBadge aria-label="Open notifications">
                            {/* TODO create a proper notification component + system*/}
                            <NotificationsRoundedIcon />
                        </MenuButton>
                    </Stack>
                    <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
                    <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuRoundedIcon />
                    </MenuButton>
                </Stack>
                <NavbarBreadcrumbs />

            </Toolbar>
        </Stack>
    );
}

export function CustomIcon() {
    return (
        <Box
            sx={{
                width: '1.5rem',
                height: '1.5rem',
                bgcolor: 'black',
                borderRadius: '999px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundImage:
                    'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
                color: 'hsla(210, 100%, 95%, 0.9)',
                border: '1px solid',
                borderColor: 'hsl(210, 100%, 55%)',
                boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
            }}
        >
            <PaymentsIcon color="inherit" sx={{fontSize: '1rem'}}/>
        </Box>
    );
}