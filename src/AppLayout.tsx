// src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import {CardProvider} from "./components/Context/CardContext.tsx";
import SideMenu from "./components/SideMenu/SideMenu.tsx";
import Header from "./components/Header/Header.tsx";

// Always render SideMenu and Header regardless of route
export const AppLayout: React.FC = () => {
    return (
        <CardProvider>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: "flex" }}>
                <SideMenu />
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Header />
                    <Outlet />
                </Box>
            </Box>
        </CardProvider>
    );
};
