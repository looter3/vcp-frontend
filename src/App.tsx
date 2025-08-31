import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login/Login.tsx';
import SignUp from './components/SignUp/SignUp.tsx';
import ProtectedRoute from "./components/Login/ProtectedRoute.tsx";
import {AuthProvider, useAuth} from "./components/Context/AuthContext.tsx";
import {AppLayout} from "./AppLayout.tsx";
import {allRoutes} from "./routes.tsx";
import {colorSchemes, shadows, shape, typography} from "./theme/themePrimitives.ts";
import { inputsCustomizations } from './theme/customizations/inputs.tsx';
import { dataDisplayCustomizations } from './theme/customizations/dataDisplay.tsx';
import { feedbackCustomizations } from './theme/customizations/feedback.tsx';
import { navigationCustomizations } from './theme/customizations/navigation.tsx';
import { surfacesCustomizations } from './theme/customizations/surfaces.ts';
import { createTheme } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import {dataGridCustomizations} from "./theme/customizations";

const queryClient = new QueryClient();

export function AppContent() {
    const { isAuthenticated } = useAuth();

    // Base component customizations
    const baseComponents = {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...dataGridCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
    };


    const theme = createTheme({
        cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: baseComponents,
    });

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                            {/* Layout for all authenticated routes */}
                            <Route element={<AppLayout />}>
                                {allRoutes.map((route) => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );

}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
