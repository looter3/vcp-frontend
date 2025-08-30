import { PieChart } from '@mui/x-charts/PieChart';
import {styled} from "@mui/material/styles";
import {useDrawingArea} from "@mui/x-charts/hooks";
import * as React from "react";
import {formatCurrency} from "../../helpers/CurrencyHelper.ts";

interface PieDataItem {
    id: string;
    value: number;
    label?: string;
}

interface Props {
    data: PieDataItem[];
    colors: string[];
    formattedBalance: string;
}

interface StyledTextProps {
    variant: 'primary' | 'secondary';
    calculatedFontSize?: number; // New prop for dynamic font size
}

interface PieCenterLabelProps {
    primaryText: string;
    secondaryText: string;
    availableWidth: number; // Pass available width to the label
}

const StyledText = styled('text', {
    shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'calculatedFontSize',
})<StyledTextProps>(({ theme, calculatedFontSize }) => ({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fill: (theme.vars || theme).palette.text.secondary,
    variants: [
        {
            props: {
                variant: 'primary',
            },
            style: {
                // Use calculatedFontSize if provided, otherwise fallback to theme h5
                fontSize: calculatedFontSize ? `${calculatedFontSize}px` : theme.typography.h5.fontSize,
            },
        },
        {
            props: ({ variant }) => variant !== 'primary',
            style: {
                fontSize: theme.typography.body2.fontSize,
            },
        },
        {
            props: {
                variant: 'primary',
            },
            style: {
                fontWeight: theme.typography.h5.fontWeight,
            },
        },
        {
            props: ({ variant }) => variant !== 'primary',
            style: {
                fontWeight: theme.typography.body2.fontWeight,
            },
        },
    ],
}));

function PieCenterLabel({ primaryText, secondaryText, availableWidth }: PieCenterLabelProps) {
    const { width, height, left, top } = useDrawingArea();

    // Calculate dynamic font size for primaryText
    const maxFontSize = 32; // Maximum allowed font size
    const minFontSize = 14; // Minimum allowed font size
    const padding = 10; // Padding from the edges of the availableWidth

    // Estimate the text width to calculate the appropriate font size
    // This is a simplified estimation; for precise fitting, one might need an SVG text measurement approach.
    // Assuming an average character width, we can derive a scaling factor.
    const estimatedCharWidth = 0.5; // Rough ratio of font size to character width
    const textLength = primaryText.length;

    // Calculate the desired font size based on available width
    const desiredFontSize = (availableWidth - padding * 2) / (textLength * estimatedCharWidth);

    // Clamp the font size within min and max limits
    const calculatedFontSize = Math.max(minFontSize, Math.min(maxFontSize, desiredFontSize));

    // Adjust vertical positioning for better centering of both lines of text
    const primaryY = top + height / 2 - (calculatedFontSize / 2 + 5); // Shift primary text up based on its size
    const secondaryY = primaryY + calculatedFontSize + 8; // Position secondary text below primary, considering primary's size

    return (
        <React.Fragment>
            <StyledText variant="primary" x={left + width / 2} y={primaryY} calculatedFontSize={calculatedFontSize}>
                {primaryText}
            </StyledText>
            <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
                {secondaryText}
            </StyledText>
        </React.Fragment>
    );
}

export function ResponsivePieChart({ data, colors, formattedBalance }: Props) {
    const fixedOuterRadius = 130;
    const innerRadius = 80;
    // The available width for the label is approximately (innerRadius * 2)
    const availableLabelWidth = innerRadius * 2;

    return (
        <PieChart
            colors={colors}
            margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            series={[
                {
                    data,
                    innerRadius: innerRadius,
                    outerRadius: fixedOuterRadius,
                    paddingAngle: 0,
                    highlightScope: { fade: "global", highlight: "item" },
                    valueFormatter: (datum) => formatCurrency(datum.value)
                },
            ]}
            height={fixedOuterRadius * 2 + 40}
            width={fixedOuterRadius * 2 + 40}
            hideLegend
        >
            {/* Pass the calculated available width to the PieCenterLabel */}
            <PieCenterLabel primaryText={formattedBalance} secondaryText="Total" availableWidth={availableLabelWidth} />
        </PieChart>
    );
}