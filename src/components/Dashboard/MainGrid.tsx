import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CurrentBalancePieChart from './CurrentBalancePieChart.tsx';
import BalanceHistoryChart from './BalanceHistoryChart.tsx';
import CardTransactionsGrid from "./CardTransactionsGrid.tsx";
import {useCardContext} from "../Context/CardContext.tsx";

export default function MainGrid() {

    const { currentCard } = useCardContext();

    if (!currentCard) {
        return null;
    }

    const gridLabel = "Transactions for Card: ".concat(currentCard?.code);

    return (
        <Box sx={{ 
            width: '100%', 
            maxWidth: { sm: '100%', md: '1700px' },
            mx: 'auto'  // ← Centra il contenuto
        }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: 2 }}
            >
                <Grid size={{ xs: 12, md: 6 }}>
                    <CurrentBalancePieChart />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <BalanceHistoryChart cardId={currentCard.id} balance={currentCard.balance}/>
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                {gridLabel}
            </Typography>
            <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, lg: 12 }}>
                    <CardTransactionsGrid key={currentCard.id} cardId={currentCard.id} cardCode={currentCard.code}/>
                </Grid>
            </Grid>
        </Box>
    );
}