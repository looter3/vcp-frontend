import {useQuery} from "@tanstack/react-query";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import {getTransactionsByCardId} from "../../api/transaction-api.ts";
import Chip from "@mui/material/Chip";
import {formatCurrency} from "../../helpers/CurrencyHelper.ts";
import {useState} from "react";
import {type Transaction} from "../../model/Transaction.ts";
import {InOut} from "./InOut.ts";

type Props = {
    cardId: number,
    cardCode: string;
};

type RowData = {
    transactionCode: string,
    cardCode: string,
    type: InOut,
    amount: number,
    createdAt: string;
}

export default function CardTransactionsGrid({ cardId, cardCode }: Props) {

    function renderStatus(status: 'IN' | 'OUT') {
        const colors: { [index: string]: 'success' | 'error' } = {
            IN: 'success', // green
            OUT: 'error', // MUI pink
        };

        return <Chip label={status} color={colors[status]} size="small" />;
    }

    // Define columns
    const columns: GridColDef[] = [
        { field: 'transactionCode', headerName: 'Transaction #', flex: 1.5, minWidth: 200 },
        {
            field: 'type',
            headerName: 'In/Out',
            flex: 0.5,
            minWidth: 80,
            renderCell: (params) => renderStatus(params.value),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 100,
            valueFormatter: (value: number) => formatCurrency(value),
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            headerAlign: 'right',
            align: 'right',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString(); // or custom format
            },
        },
    ];

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["transactionsByCard", cardId, page, pageSize],
        queryFn: () => getTransactionsByCardId(cardId, page, pageSize),
        keepPreviousData: true,
    });

    const transactions: Transaction[] = data?.transactions || [];

    const rowData: RowData[] = transactions.map(transaction => ({
        transactionCode: transaction.code,
        cardCode: cardCode,
        type: transaction.senderCardId == cardId ? InOut.OUT : InOut.IN,
        amount: transaction.senderCardId == cardId ? transaction.amount * -1 : transaction.amount,
        createdAt: transaction.createdAt,
    }));

    console.log("CardTransactionGrid: transactions: ", data?.transactions);

    if (isLoading) return <p>Loading transactions for card {cardId}...</p>;
    if (isError) return <p>Error loading transactions for card {cardId}</p>;

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h3>Transactions for Card: {cardCode}</h3>
            <DataGrid
                checkboxSelection
                rows={rowData || []}
                columns={columns}
                getRowId={(row) => row.transactionCode}
                rowCount={data?.metadata.totalElements || 0} // assuming your API response has this
                pagination
                paginationMode="server"
                pageSizeOptions={[10, 20, 50]}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                }
                disableColumnResize
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: { mt: 'auto' },
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />

        </div>
    );
}
