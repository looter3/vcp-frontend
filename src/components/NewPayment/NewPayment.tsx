import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import type { Card as CardType } from "../../model/Card";
import {
    Card,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    FormLabel,
    TextField,
    Typography,
    Button,
    InputAdornment,
    MenuItem,
    Select,
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useCardContext } from "../Context/CardContext.tsx";
import { balanceOperation } from "../../api/card-aggregate-api.ts";

type NewPaymentInput = {
    senderCard: CardType | null;
    recipientCard: string;
    amount: number;
};

export default function NewPayment() {
    const { cards, currentCard } = useCardContext();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NewPaymentInput>({
        defaultValues: {
            senderCard: currentCard,
            recipientCard: "",
            amount: 0,
        },
    });

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const onSubmit = async (data: NewPaymentInput) => {
        setError(null);
        setSuccess(null);
        try {
            if (!data.senderCard?.code || !data.recipientCard) {
                setError("Both sender and recipient cards are required.");
                return;
            }

            await balanceOperation(data.senderCard.code, data.recipientCard, data.amount);
            reset();
            setSuccess("Payment has been executed successfully!");
        } catch (err) {
            setError("Failed to process payment. Please try again. Error: " + err);
        }
    };

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 500,
                mx: "auto",
                overflow: "auto",
                resize: "horizontal",
            }}
        >
            <Typography
                variant="h6"
                component="div"
                sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}
            >
                <InfoOutlined fontSize="small" />
                New payment
            </Typography>
            <Divider />
            <CardContent
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(80px, 1fr))",
                    gap: 2,
                    p: 2,
                }}
            >
                {/* Sender Card Select */}
                <FormControl sx={{ gridColumn: "1/-1" }} error={!!errors.senderCard}>
                    <FormLabel>Select Card</FormLabel>
                    <Controller
                        name="senderCard"
                        control={control}
                        rules={{ required: "Please select a card" }}
                        render={({ field }) => {
                            const selectedId: string = field.value?.code ?? "";
                            return (
                                <Select
                                    value={selectedId}
                                    onChange={(e) => {
                                        const selectedCard = cards.find((c) => c.code === e.target.value) ?? null;
                                        field.onChange(selectedCard);
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="">
                                        <em>Choose a card</em>
                                    </MenuItem>
                                    {cards.map((card) => (
                                        <MenuItem key={card.code} value={card.code}>
                                            {card.code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            );
                        }}
                    />
                    {errors.senderCard && (
                        <Typography color="error" variant="caption">
                            {errors.senderCard.message}
                        </Typography>
                    )}
                </FormControl>

                {/* Recipient Card */}
                <FormControl sx={{ gridColumn: "1/-1" }}>
                    <FormLabel>Recipient Card Number</FormLabel>
                    <Controller
                        name="recipientCard"
                        control={control}
                        rules={{
                            required: "Card number is required",
                            pattern: {
                                value: /^[0-9]{13,19}$/,
                                message: "Card number must be 13–19 digits",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                placeholder="1234 5678 9012 3456"
                                error={!!errors.recipientCard}
                                helperText={errors.recipientCard?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CreditCardIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </FormControl>

                {/* Amount */}
                <FormControl sx={{ gridColumn: "1/-1" }}>
                    <FormLabel>Amount</FormLabel>
                    <Controller
                        name="amount"
                        control={control}
                        rules={{
                            required: "Amount is required",
                            min: { value: 1, message: "Amount must be greater than 0" },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                inputProps={{ min: 1 }}
                                placeholder="Enter amount"
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                            />
                        )}
                    />
                </FormControl>

                {/* Submit Button */}
                <CardActions sx={{ gridColumn: "1/-1" }}>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Issuing payment..." : "Pay"}
                    </Button>
                </CardActions>

                {/* Error message */}
                {error && (
                    <Typography color="error" variant="body2" sx={{ gridColumn: "1/-1" }}>
                        {error}
                    </Typography>
                )}

                {/* Success message */}
                {success && (
                    <Typography color="success.main" variant="body2" sx={{ gridColumn: "1/-1" }}>
                        {success}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
