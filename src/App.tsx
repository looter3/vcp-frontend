import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login/Login.tsx';
import SignUp from './components/SignUp/SignUp.tsx';
import ProtectedRoute from "./components/Login/ProtectedRoute.tsx";
import {AuthProvider, useAuth} from "./components/Context/AuthContext.tsx";
import {AppLayout} from "./AppLayout.tsx";
import {allRoutes} from "./routes.tsx";

const queryClient = new QueryClient();

export function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
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
                                <Route key={route.path} path={route.path} element={route.element} />
                            ))}
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
