import type {Theme} from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { checkboxClasses } from '@mui/material/Checkbox';
import { gray } from "../themePrimitives.ts";

export const dataGridCustomizations = {
    MuiDataGrid: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                "--DataGrid-overlayHeight": "300px",
                overflow: "clip",
                [`& .${gridClasses.columnHeader}`]: {
                    backgroundColor: theme.vars
                        ? theme.vars.palette.background.paper
                        : theme.palette.background.paper,
                },
                [`& .${gridClasses.footerContainer}`]: {
                    backgroundColor: theme.vars
                        ? theme.vars.palette.background.paper
                        : theme.palette.background.paper,
                },
                [`& .${checkboxClasses.root}`]: {
                    padding: theme.spacing(0.5),
                    "& > svg": {
                        fontSize: "1rem",
                    },
                },
                [`& .${tablePaginationClasses.root}`]: {
                    marginRight: theme.spacing(1),
                    "& .MuiIconButton-root": {
                        maxHeight: 32,
                        maxWidth: 32,
                        "& > svg": {
                            fontSize: "1rem",
                        },
                    },
                },
                // Make header text bold
                [`& .${gridClasses.columnHeaderTitle}`]: {
                    fontWeight: 700,
                }
            }),
            cell: ({ theme }: { theme: Theme }) => ({
                borderTopColor: theme.palette.divider,
            }),
            row: ({ theme }: { theme: Theme }) => ({
                backgroundColor: theme.vars
                    ? theme.vars.palette.background.default
                    : theme.palette.background.default, // default row background
                color: theme.vars
                    ? theme.vars.palette.text.primary
                    : theme.palette.text.primary, // default text color
                "&:last-of-type": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
                "&:hover": {
                    backgroundColor: theme.vars
                        ? theme.vars.palette.action.hover
                        : theme.palette.action.hover,
                },
                "&.Mui-selected": {
                    backgroundColor: theme.vars
                        ? theme.vars.palette.action.selected
                        : theme.palette.action.selected,
                    color: theme.vars
                        ? theme.vars.palette.text.primary
                        : theme.palette.text.primary,
                    "&:hover": {
                        backgroundColor: theme.vars
                            ? theme.vars.palette.action.hover
                            : theme.palette.action.hover,
                    },
                },
            }),
            columnHeaderTitleContainer: {
                flexGrow: 1,
                justifyContent: "space-between",
            },
            columnHeaderDraggableContainer: { paddingRight: 2 },
        },
    },
    MuiMenu: {
        styleOverrides: {
            paper: ({ theme }: { theme: Theme }) => ({
                borderRadius: theme.shape.borderRadius,
                backgroundImage: "none",
                border: `1px solid ${theme.palette.divider}`,
            }),
            list: {
                paddingLeft: 0,
                paddingRight: 0,
            },
            menuItem: {
                margin: "0 4px",
            },
            listItemIcon: {
                marginRight: 0,
            },
        },
    },
    MuiIconButton: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                border: "none",
                backgroundColor: "transparent",
                "&:hover": {
                    backgroundColor: alpha(theme.palette.action.selected, 0.3),
                },
                "&:active": {
                    backgroundColor: gray[200],
                },
            }),
        },
    },
};

