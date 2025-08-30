import axios from "axios";
import type {PagedTransactionResponse, Transaction} from "../model/Transaction.ts";

export const getTransactionsByCardId = async (
    cardId: number,
    page: number = 0,
    size: number = 20,
    upperBoundDate: Date = new Date(),
    lowerBoundDate: Date | undefined = undefined,
): Promise<PagedTransactionResponse> => {

    const token = sessionStorage.getItem("jwt");

    const response = await axios.get<PagedTransactionResponse>(
        `${import.meta.env.VITE_API_URL}/transactions/${cardId}`,
        {
            headers: {
                Accept: "*/*",
                Authorization: token || ""
            },
            params: {
                page,
                size,
                upperBoundDate: upperBoundDate.toISOString(),
                lowerBoundDate: lowerBoundDate?.toISOString()
            }
        }
    );

    return response.data;
};

export const getCurrentMonthTransactionsByCardId = async (cardId: number): Promise<Transaction[]> => {
    const token = sessionStorage.getItem("jwt");

    const response = await axios.get<Transaction[]>(
        `${import.meta.env.VITE_API_URL}/transactions/thisMonth/${cardId}`,
        {
            headers: {
                Accept: "*/*",
                Authorization: token || ""
            }
        }
    );

    return response.data;
}