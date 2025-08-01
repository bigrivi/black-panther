import { CloseOutlined } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import {
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
} from "@mui/material";
import classNames from "classnames";
import React, { FC, useRef, useState } from "react";

interface SearchInputProps {
    value: string;
    debounce?: boolean;
    className?: string;
    style?: React.CSSProperties;
    debounceTime?: number;
    placeholder?: string;
    inputProps?: object;
    showIcon?: boolean;
    onChange: (value: string) => void;
    autoFocus?: boolean;
}
const SearchInput: FC<SearchInputProps> = ({
    value,
    autoFocus,
    onChange,
    className,
    style,
    placeholder,
    inputProps,
}) => {
    const [focused, setFocused] = useState(false);

    const inputRef = useRef<HTMLDivElement>();

    const handleOnChange = (evt: any) => {
        onChange(evt.target.value);
    };
    const clearInput = () => {
        onChange("");
    };

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    return (
        <FormControl
            fullWidth
            style={{
                ...style,
            }}
            className={classNames(className, {
                focused,
            })}
        >
            <OutlinedInput
                ref={inputRef}
                fullWidth
                size="small"
                autoFocus={autoFocus}
                startAdornment={<Search fontSize="small" />}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                onChange={handleOnChange}
                inputProps={inputProps}
                value={value}
                endAdornment={
                    value ? (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={clearInput}
                                sx={{
                                    height: "2rem",
                                    transform: "scale(0.9)",
                                    width: "2rem",
                                }}
                                size="small"
                            >
                                <CloseOutlined />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }
            />
        </FormControl>
    );
};
export default SearchInput;
