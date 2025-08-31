import {useTheme} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {LineChart} from '@mui/x-charts/LineChart';
import {useQuery} from "@tanstack/react-query";
import type {Transaction} from "../../model/Transaction.ts";
import {formatCurrency} from "../../helpers/CurrencyHelper.ts";
import {getTransactionsByCardId} from "../../api/transaction-api.ts";

function AreaGradient({ color, id }: { color: string; id: string }) {
    return (
        <defs>
            <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
        </defs>
    );
}

function getDaysInMonth(month: number, year: number): string[] {
    const days: string[] = [];
    const totalDays = new Date(year, month + 1, 0).getDate(); // correct in local time

    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        days.push(formatDateLabel(date)); // uses same format
    }

    return days;
}

function formatDateLabel(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'Europe/Rome', // or your app's actual local time zone
    });
}

type BalanceHistoryChartProps= {
    cardId: number;
    balance: number;
};

function calculateBalanceValuesPerDay(
    transactions: Transaction[],
    cardId: number,
    currentBalance: number,
    currentDay: number,
    daysInTheMonth: string[]
): number[] {
    const dailySums: Record<string, number> = {};

    // Step 1: Aggregate transaction amounts per day
    transactions.forEach((tx) => {
        const date = new Date(tx.createdAt);
        const dateKey = formatDateLabel(date);

        const amount = tx.senderCardId === cardId ? -tx.amount : tx.amount;
        dailySums[dateKey] = (dailySums[dateKey] || 0) + amount;
    });

    // Step 2: Build balances from currentDay going backward
    const balancesReversed: number[] = [];
    let runningBalance = currentBalance;

    // Calculate daily deviation to find the balance of each day
    for (let i = currentDay - 1; i >= 0; i--) {

        const dateLabel = daysInTheMonth[i];
        const dailyDeviation = dailySums[dateLabel] || 0;

        balancesReversed.push(runningBalance);
        runningBalance -= dailyDeviation;
    }

    return balancesReversed.reverse();
}

export default function BalanceHistoryChart({ cardId, balance }: BalanceHistoryChartProps) {
    const theme = useTheme();
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);

    const firstDay = new Date(year, month, 1, 0, 0, 0, 0); // Local midnight
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day at 23:59:59.999

    const { data, isLoading, isError } = useQuery({
        queryKey: ["transactionsThisMonthByCustomDate", cardId],
        queryFn: () => getTransactionsByCardId(cardId, undefined, undefined, lastDay, firstDay),
    });

    if (isLoading) return <p>Loading balance history for card {cardId}...</p>;
    if (isError) return <p>Error loading balance history for card {cardId}</p>;

    const currentMonthDailyBalance = calculateBalanceValuesPerDay(data?.transactions, cardId, balance, now.getDate(), daysInMonth);

    const startMonthBalance = currentMonthDailyBalance.at(0) ?? 0;
    const deviationValue = balance - startMonthBalance;

    const deviationPercentage = startMonthBalance !== 0
        ? Number(((deviationValue * 100) / startMonthBalance).toFixed(2))
        : 0;

    const colorPalette = [
        theme.palette.primary.light,
        theme.palette.primary.main,
        theme.palette.primary.dark,
    ];

    // Scale dynamically the y axis
    const yMin = Math.min(...currentMonthDailyBalance);
    const yMax = Math.max(...currentMonthDailyBalance);

    // Add some padding
    const yPadding = (yMax - yMin) * 0.1;

    const chartYAxis = [{
        width: 150,
        valueFormatter: (value: number) => formatCurrency(value),
        min: yMin - yPadding,
        max: yMax + yPadding,
    }];

    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Balance History
                </Typography>
                <Stack sx={{ justifyContent: 'space-between' }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignContent: { xs: 'center', sm: 'flex-start' },
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h4" component="p">
                            {formatCurrency(balance)}
                        </Typography>
                        <Chip size="small"
                              color={deviationPercentage < 0 ? "error" : "success"}
                              label={deviationPercentage !== null ? `${deviationPercentage > 0 ? "+" : ""}${deviationPercentage}%` : "—"}
                        />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Balance history per day for the last 30 days
                    </Typography>
                </Stack>
                <LineChart
                    colors={colorPalette}
                    xAxis={[
                        {
                            scaleType: 'point',
                            data: daysInMonth,
                            height: 24,
                        },
                    ]}
                    yAxis={chartYAxis}
                    series={[
                        {
                            id: 'direct',
                            label: 'Balance',
                            showMark: false,
                            curve: 'linear',
                            stack: 'total',
                            area: true,
                            stackOrder: 'ascending',
                            data: currentMonthDailyBalance,
                        },
                    ]}
                    height={250}
                    margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                    grid={{ horizontal: true }}
                    sx={{
                        '& .MuiAreaElement-series-organic': {
                            fill: "url('#organic')",
                        },
                        '& .MuiAreaElement-series-referral': {
                            fill: "url('#referral')",
                        },
                        '& .MuiAreaElement-series-direct': {
                            fill: "url('#direct')",
                        },
                    }}
                    hideLegend
                >
                    <AreaGradient color={theme.palette.primary.dark} id="organic" />
                    <AreaGradient color={theme.palette.primary.main} id="referral" />
                    <AreaGradient color={theme.palette.primary.light} id="direct" />
                </LineChart>
            </CardContent>
        </Card>
    );
}