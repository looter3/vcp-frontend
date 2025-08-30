import React from "react";
import type {Card} from "../../model/Card.ts";
import {useQuery} from "@tanstack/react-query";
import {getAllCards} from "../../api/card-api.ts";

type CardContextType = {
    cards: Card[];
    currentCard: Card | null;
    setCurrentCard: (c: Card | null) => void;
    isLoading: boolean;
    isError: boolean;
};

const CardContext = React.createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: cards = [], isLoading, isError } = useQuery<Card[]>({
        queryKey: ["cards"],
        queryFn: getAllCards,
    });

    const [currentCard, setCurrentCard] = React.useState<Card | null>(null);

    React.useEffect(() => {
        if (cards.length > 0 && !currentCard) {
            const sorted = [...cards].sort((a, b) => b.balance - a.balance);
            setCurrentCard(sorted[0]);
        }
    }, [cards, currentCard]);

    return (
        <CardContext.Provider value={{ cards, currentCard, setCurrentCard, isLoading, isError }}>
            {children}
        </CardContext.Provider>
    );
};
export function useCardContext() {
    const ctx = React.useContext(CardContext);
    if (!ctx) throw new Error("useCardContext must be used within CardProvider");
    return ctx;
}
