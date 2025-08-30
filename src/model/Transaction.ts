// You may define this based on your API's response shape
export interface PagedTransactionResponse {
    transactions: Transaction[];
    metadata: PaginationMetadata;
}

export interface Transaction {
    id: number;
    senderCardId: number;
    recipientCardId: number;
    code: string;
    type: TransactionType;
    amount: number;
    createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export enum TransactionType {
    TRANSFER = "TRANSFER",
}

export interface PaginationMetadata {
     currentPage: number;
     pageSize: number;
     totalElements: number;
     totalPages: number;
     hasNext: boolean;
     hasPrevious: boolean;
}