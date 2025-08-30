import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCardIcon from '@mui/icons-material/AddCard';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import {Link, useLocation} from 'react-router-dom';
import type {JSX} from "react";

interface Item {
    text: string;
    icon: JSX.Element;
}

const mainListItems: Item[] = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'New Payment', icon: <PaymentIcon /> },
    { text: 'Add Card', icon: <AddCardIcon /> },
];

const secondaryListItems: Item[] = [
    { text: 'Settings', icon: <SettingsRoundedIcon /> },
    { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {

    const location = useLocation();

    // helper to turn "New Payment" -> "/newpayment"
    const toPath = (text: string) => `/${text.toLowerCase().replace(/\s+/g, "")}`;

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            <List dense>
                {mainListItems.map((item) => {
                    const path = toPath(item.text);
                    const selected = location.pathname === path;

                    return (
                        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                            <Link
                                to={path}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <ListItemButton selected={selected}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    );
                })}
            </List>
            <List dense>
                {secondaryListItems.map((item) => {
                    const path = toPath(item.text);
                    const selected = location.pathname === path;

                    return (
                        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                            <Link
                                to={path}
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <ListItemButton selected={selected}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    );
                })}
            </List>
        </Stack>
    );
}
