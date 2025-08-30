import axios from 'axios';


export const balanceOperation = async (senderCardNumber: string, recipientCardNumber: string, amount: number)=> {
    const token = sessionStorage.getItem("jwt");
    const response = await axios.post(
        import.meta.env.VITE_API_URL + "/card-aggregate-service/balanceOperation",
        {
            senderCardNumber,
            recipientCardNumber,
            amount,
            type: "TRANSFER",
        },
        {
            headers: {
                Accept: "*/*",
                Authorization: token,
            },
        }
    );


    return response.status === 201;
}
