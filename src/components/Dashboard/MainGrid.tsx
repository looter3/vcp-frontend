import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CurrentBalancePieChart from './CurrentBalancePieChart.tsx';
import BalanceHistoryChart from './BalanceHistoryChart.tsx';
import CardTransactionsGrid from "./CardTransactionsGrid.tsx";
import {useCardContext} from "../Context/CardContext.tsx";

export default function MainGrid() {

    const { currentCard } = useCardContext();

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{ mb: (theme) => theme.spacing(2) }}
            >
                <Grid size={{ xs: 12, md: 6 }}>
                    {currentCard && <CurrentBalancePieChart />}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    {currentCard && <BalanceHistoryChart cardId={currentCard.id} balance={currentCard.balance}/>}
                </Grid>
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Details
            </Typography>
            <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, lg: 12 }}>
                    {currentCard && <CardTransactionsGrid key={currentCard.id} cardId={currentCard.id} cardCode={currentCard.code}/>}
                </Grid>
            </Grid>
        </Box>
    );
}