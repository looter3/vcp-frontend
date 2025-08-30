import type {ReactNode} from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import AddCardIcon from "@mui/icons-material/AddCard";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import MainGrid from "./components/Dashboard/MainGrid.tsx";
import NewPayment from "./components/NewPayment/NewPayment";
import AddCard from "./components/AddCard/AddCard";
import Feedback from "./components/Feedback/Feedback";
import Settings from "./components/Settings/Settings";

export interface RouteItem {
    text: string;
    path: string;
    icon?: ReactNode;
    element?: ReactNode;
}

export const mainRoutes: RouteItem[] = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, element: <MainGrid /> },
    { text: "New Payment", path: "/newpayment", icon: <PaymentIcon />, element: <NewPayment /> },
    { text: "Add Card", path: "/addcard", icon: <AddCardIcon />, element: <AddCard /> },
];

export const secondaryRoutes: RouteItem[] = [
    { text: "Settings", path: "/settings", icon: <SettingsRoundedIcon />, element: <Settings /> },
    { text: "Feedback", path: "/feedback", icon: <HelpRoundedIcon />, element: <Feedback /> },
];

export const allRoutes = [...mainRoutes, ...secondaryRoutes];

