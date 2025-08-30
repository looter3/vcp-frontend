import axios from 'axios';
import type {Card} from "../model/Card.ts";
import type {NewCardInput} from "../model/NewCardInput.ts";

export const getAllCards = async (): Promise<Card[]> => {

    const token = sessionStorage.getItem("jwt");
    const username = sessionStorage.getItem("user");

    const response = await axios.get(
        import.meta.env.VITE_API_URL + "/cards/getAllCardsByUser/" + username, {
            headers: {
                'Accept': '*/*',
                'Authorization': token
            }
        });

    return response.data;
}

export const addCard = async ({cardNumber, expiration, cvv}: NewCardInput): Promise<boolean> => {

    const token = sessionStorage.getItem("jwt");
    const username = sessionStorage.getItem("user");

    if (!token) throw new Error("No auth token found");

    try {
        const response = await axios.post(
            import.meta.env.VITE_API_URL + "/cards", { username, cardNumber, expiration, cvv }, {
                headers: {
                    'Accept': '*/*',
                    'Authorization': token
                }
            });

        return response.status === 201;
    } catch (error) {
        console.error("Failed to add card:", error);
        return false;
    }

}