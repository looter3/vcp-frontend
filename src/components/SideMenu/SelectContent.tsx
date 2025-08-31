import * as React from 'react';
import {
    Select,
    type SelectChangeEvent,
    selectClasses,
    MenuItem,
    ListSubheader,
    ListItemText,
    ListItemAvatar,
    Avatar,
    ListItemIcon,
    Divider,
} from '@mui/material';
import {
    AddRounded as AddRoundedIcon,
} from '@mui/icons-material';
import {useCardContext} from "../Context/CardContext.tsx";
import {useNavigate} from "react-router-dom";
import CreditCardIcon from "@mui/icons-material/CreditCard";


export default function SelectContent() {

    const { cards, currentCard, setCurrentCard } = useCardContext();

    // State to track if the menu is open
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleChange = (event: SelectChangeEvent<number | string>) => {
        const value = event.target.value;

        if (value === "add-card") {
            navigate("/addcard");
            return;
        }

        console.log("Select content value: ", value);
        console.log("Select content value type: ", typeof value);

        // We check if the value is a number before trying to find the card.
        // The "add-card" string won't pass this check.
        if (typeof value === 'string') {
            const newCard = cards.find(card => card.code === value);
            if (newCard) {
                console.log("Selected card value: ", newCard);
                setCurrentCard(newCard);
            }
        }
    };

    // Set the initial selected card ID
    React.useEffect(() => {
        if (cards && cards.length > 0) {
            setCurrentCard(cards[0]);
        }
    }, [cards]);

    return (
        <Select
            labelId="card-select"
            id="card-simple-select"
            value={currentCard?.code ?? ""}
            onChange={handleChange}
            onOpen={() => setIsMenuOpen(true)} // Set state to true when menu opens
            onClose={() => setIsMenuOpen(false)} // Set state to false when menu closes
            displayEmpty
            inputProps={{ 'aria-label': 'Select card' }}
            fullWidth
            sx={{
                maxHeight: 56,
                width: 215,
                '&.MuiList-root': {
                    p: '8px',
                },
                [`& .${selectClasses.select}`]: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    pl: 1,
                },
            }}
        >
            <ListSubheader sx={{ pt: 0 }}>All cards</ListSubheader>
            {/* Dynamically render menu items from the cards prop */}
            {cards.map(card => (
                <MenuItem key={card.code} value={card.code}>
                    <ListItemAvatar>
                        <Avatar alt={card.code}>
                            <CreditCardIcon sx={{ fontSize: '1rem' }} />
                        </Avatar>
                    </ListItemAvatar>
                    {/* Conditionally apply a style to the primary ListItemText */}
                    <ListItemText
                        primary={card.code}
                        secondary={card.code}
                        primaryTypographyProps={{
                            // Apply a different font size if the menu is not open
                            sx: {
                                fontSize: isMenuOpen ? '1rem' : '0.875rem',
                            },
                        }}
                    />
                </MenuItem>
            ))}
            <Divider sx={{ mx: -1 }} />
            <MenuItem value="add-card">
                <ListItemIcon>
                    <AddRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Add card" />
            </MenuItem>
        </Select>
    );
}