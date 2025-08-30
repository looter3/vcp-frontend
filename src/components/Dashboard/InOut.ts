export const InOut = {
    IN: "IN",
    OUT: "OUT",
} as const;

export type InOut = (typeof InOut)[keyof typeof InOut];
