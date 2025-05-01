import { CircularProgress } from "@mui/material";
import React from "react";

const PageLoading = () => (
    <div style={{ paddingBlockStart: 100, textAlign: "center" }}>
        <CircularProgress />
    </div>
);

export { PageLoading };
