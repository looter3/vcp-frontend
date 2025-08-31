import Box from "@mui/material/Box";
import MainGrid from "./MainGrid.tsx";
import Container from "@mui/material/Container";

export default function Dashboard() {
    return(
        <Box sx={{ display: 'flex' }}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: 'background.default',
                    overflow: 'auto',
                }}
            >
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <MainGrid />
                </Container>
            </Box>
        </Box>
    );
}