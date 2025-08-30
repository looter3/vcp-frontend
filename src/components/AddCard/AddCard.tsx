import * as React from 'react';
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
} from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useForm, Controller } from 'react-hook-form';
import { addCard } from "../../api/card-api.ts";
import dayjs, { type Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type NewCardInput = {
    cardNumber: string;
    expiration: string; // YYYY-MM
    cvv: string;
    cardHolder?: string;
    saveCard?: boolean;
};

const AddCard: React.FC = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NewCardInput>({
        defaultValues: {
            cardNumber: "",
            expiration: "",
            cvv: "",
            cardHolder: "",
            saveCard: false,
        },
    });

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const onSubmit = async (data: NewCardInput) => {
        setError(null);
        setSuccess(null);
        try {
            await addCard(data);
            reset();
            setSuccess("Card has been added successfully!");
        } catch (err) {
            setError("Failed to add card. Please try again. Error: " + err);
        }
    };

    return (
        <Card
            variant="outlined"
            sx={{
                maxWidth: 500,
                mx: 'auto',
                overflow: 'auto',
                resize: 'horizontal',
            }}
        >
            <Typography
                variant="h6"
                component="div"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}
            >
                <InfoOutlined fontSize="small" />
                Add new card
            </Typography>
            <Divider />
            <CardContent
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                    gap: 2,
                    p: 2,
                }}
            >
                {/* Card Number */}
                <FormControl sx={{ gridColumn: '1/-1' }}>
                    <FormLabel>Card number</FormLabel>
                    <Controller
                        name="cardNumber"
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
                                error={!!errors.cardNumber}
                                helperText={errors.cardNumber?.message}
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

                {/* Expiry Date */}
                <FormControl>
                    <FormLabel>Expiry date</FormLabel>
                    <Controller
                        name="expiration"
                        control={control}
                        rules={{ required: "Expiry date is required" }}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month']}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue: Dayjs | null) =>
                                        field.onChange(newValue ? newValue.format("YYYY-MM") : "")
                                    }
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            error: !!errors.expiration,
                                            helperText: errors.expiration?.message,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        )}
                    />
                </FormControl>

                {/* CVV / CVC */}
                <FormControl>
                    <FormLabel>CVC / CVV</FormLabel>
                    <Controller
                        name="cvv"
                        control={control}
                        rules={{
                            required: "CVC is required",
                            pattern: {
                                value: /^[0-9]{3}$/,
                                message: "CVC must be exactly 3 digits",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                inputProps={{ maxLength: 3 }}
                                error={!!errors.cvv}
                                helperText={errors.cvv?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <InfoOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </FormControl>

                {/* Card Holder */}
                <FormControl sx={{ gridColumn: '1/-1' }}>
                    <FormLabel>Card holder name</FormLabel>
                    <Controller
                        name="cardHolder"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                placeholder="Enter cardholder's full name"
                            />
                        )}
                    />
                </FormControl>

                {/* Submit Button */}
                <CardActions sx={{ gridColumn: '1/-1' }}>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add card"}
                    </Button>
                </CardActions>

                {/* Error message */}
                {error && (
                    <Typography color="error" variant="body2" sx={{ gridColumn: '1/-1' }}>
                        {error}
                    </Typography>
                )}

                {/* Success message */}
                {success && (
                    <Typography color="success.main" variant="body2" sx={{ gridColumn: '1/-1' }}>
                        {success}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default AddCard;
