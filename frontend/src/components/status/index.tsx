import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import Chip, { type ChipProps } from "@mui/material/Chip";
import { green } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { useTranslate } from "@refinedev/core";

type Props = {
    value: boolean;
} & ChipProps;

export const Status = ({ value, ...rest }: Props) => {
    const { palette } = useTheme();
    const isDarkMode = palette.mode === "dark";

    const t = useTranslate();

    const color = value ? (isDarkMode ? green[200] : green[800]) : "default";
    const icon: ChipProps["icon"] = value ? (
        <CheckCircleIcon
            sx={{
                fill: isDarkMode ? green[200] : green[600],
            }}
        />
    ) : (
        <PauseCircleOutlineOutlinedIcon color="action" />
    );

    return (
        <Chip
            {...rest}
            label={t(`fields.status.${value}`)}
            size="small"
            sx={{
                borderColor: color,
                color: color,
            }}
            icon={icon}
            variant="outlined"
        />
    );
};
