import * as React from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import {styled} from "@mui/material/styles";
import {useDrawingArea} from "@mui/x-charts/hooks";
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

    // Font size boundaries
    const maxFontSize = 32;
    const minFontSize = 12;
    const padding = 8;

    // Rough width estimation based on number of characters
    const estimatedCharWidthRatio = 0.6; // Slightly more conservative
    const textLength = primaryText.length;

    // Compute desired font size to fit within availableWidth
    const desiredFontSize = (availableWidth - padding * 2) / (textLength * estimatedCharWidthRatio);

    // Clamp font size
    const calculatedFontSize = Math.max(minFontSize, Math.min(maxFontSize, desiredFontSize));

    // Compute vertical positioning
    const primaryY = top + height / 2 - calculatedFontSize / 2;
    const secondaryY = primaryY + calculatedFontSize + 4; // spacing between primary & secondary

    return (
        <React.Fragment>
            <StyledText
                variant="primary"
                x={left + width / 2}
                y={primaryY}
                calculatedFontSize={calculatedFontSize}
            >
                {primaryText}
            </StyledText>
            <StyledText
                variant="secondary"
                x={left + width / 2}
                y={secondaryY}
            >
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