import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import {useLocation} from "react-router-dom";
import {allRoutes} from "../../routes.tsx";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export default function NavbarBreadcrumbs() {
    const location = useLocation();

    const pathToTextMap = allRoutes.reduce((acc, item) => {
        acc[item.path] = item.text;
        return acc;
    }, {} as Record<string, string>);

    const currentLabel = pathToTextMap[location.pathname] ?? location.pathname;

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            <Typography variant="body1">Home</Typography>
            <Typography
                variant="body1"
                sx={{ color: "text.primary", fontWeight: 600 }}
            >
                {currentLabel}
            </Typography>
        </StyledBreadcrumbs>
    );
}
