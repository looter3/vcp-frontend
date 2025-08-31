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
            <Box sx={{
                display: "flex",
                backgroundColor: 'background.default',
                minHeight: '100vh',
                width: '100vw'
            }}>
                <SideMenu />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        backgroundColor: 'background.default',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Header />
                    <Box sx={{
                        flex: 1,
                        p: { xs: 2, sm: 3 },  // ← QUESTO WRAPPER MANCAVA!
                        backgroundColor: 'background.default'  // ← E questo
                    }}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </CardProvider>
    );
};