import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import {formatCurrency} from "../../helpers/CurrencyHelper.ts";
import {ResponsivePieChart} from "./ResponsivePieChart.tsx";
import {getCurrentMonthTransactionsByCardId} from '../../api/transaction-api.ts';
import {useQuery} from "@tanstack/react-query";
import {useCardContext} from "../Context/CardContext.tsx";

const colors = [
    'hsl(220, 20%, 65%)',
    'hsl(220, 20%, 42%)',
    'hsl(220, 20%, 35%)',
    'hsl(220, 20%, 25%)',
];

export default function CurrentBalancePieChart() {

    const { currentCard } = useCardContext();

    const { data } = useQuery({
        queryKey: ["transactionsThisMonthByCard", currentCard?.id],
        queryFn: () => getCurrentMonthTransactionsByCardId(currentCard!.id),
        enabled: !!currentCard?.id, // prevents running until you have an id
    });

    if(!currentCard) return null;

    const formattedBalance= formatCurrency(currentCard?.balance);

    let totalExpense = 0;
    let totalIncome = 0;

    console.log("Current cardId: ", currentCard?.id);

    data?.forEach(transaction => {
        if (transaction.recipientCardId === currentCard?.id) {
            totalIncome += transaction.amount;
        } else if (transaction.senderCardId === currentCard?.id) {
            totalExpense += transaction.amount;
        }
    })

    console.log("Total Expense:", totalExpense);
    console.log("Total Income:", totalIncome);

    const chartData = [
        { id: 'expenses', label: 'Total expenses this month', value: totalExpense, },
        { id: 'incomes', label: 'Total incomes this month', value: totalIncome },
    ];

    return (
        <Card
            variant="outlined"
            sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
        >
            <CardContent>
                <Typography component="h2" variant="subtitle2">
                    Balance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ResponsivePieChart data={chartData} colors={colors} formattedBalance={formattedBalance} />
                </Box>
            </CardContent>
        </Card>
    );
}
