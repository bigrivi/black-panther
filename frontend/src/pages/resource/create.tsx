import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";
import { ResourceDrawerForm } from "./components/drawer-form";

export const ResourceCreate = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();

    return <ResourceDrawerForm action="create" />;
};
