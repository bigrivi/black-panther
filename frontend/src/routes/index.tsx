import { AppSider, Header, PageLoading } from "@/components";
import { DashboardPage } from "@/pages/dashboard";
import { DeptCreate, DeptEdit, DeptList } from "@/pages/departments";
import { EnumCreate, EnumEdit, EnumList } from "@/pages/enums";
import { ForgotPassword } from "@/pages/forgotPassword";
import { LoginPage } from "@/pages/login";
import { PolicyPage } from "@/pages/policy";
import { PositionCreate, PositionEdit, PositionList } from "@/pages/positions";
import { Register } from "@/pages/register";
import { ResourceCreate, ResourceEdit, ResourceList } from "@/pages/resources";
import { RoleCreate, RoleEdit, RoleList } from "@/pages/roles";
import { UserCreate, UserEdit, UserList } from "@/pages/users";
import { Authenticated, CanAccess } from "@refinedev/core";
import { ErrorComponent, ThemedLayoutV2 } from "@refinedev/mui";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { Outlet, Route, Routes } from "react-router";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route
                element={
                    <Authenticated
                        key="authenticated-inner"
                        loading={<PageLoading />}
                        fallback={<CatchAllNavigate to="/login" />}
                    >
                        <CanAccess
                            action="list"
                            onUnauthorized={({
                                resource,
                                reason,
                                action,
                                params,
                            }) => {
                                console.log(params);
                                console.warn(
                                    `You cannot access ${resource}-${params} resource with ${action} action because ${reason}`
                                );
                            }}
                        >
                            <ThemedLayoutV2 Header={Header} Sider={AppSider}>
                                {/* <Box
                                                        sx={{
                                                            maxWidth: "1200px",
                                                            marginLeft: "auto",
                                                            marginRight: "auto",
                                                        }}
                                                    > */}
                                <Outlet />
                                {/* </Box> */}
                            </ThemedLayoutV2>
                        </CanAccess>
                    </Authenticated>
                }
            >
                <Route index element={<DashboardPage />} />

                {/* <Route path="/:resource">
                                        <Route
                                            index
                                            element={<BlogPostList />}
                                        />
                                        <Route
                                            path="create"
                                            element={<BlogPostCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<BlogPostEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<BlogPostShow />}
                                        />
                                    </Route> */}

                <Route
                    path="/roles"
                    element={
                        <RoleList>
                            <Outlet />
                        </RoleList>
                    }
                >
                    <Route path="create" element={<RoleCreate />} />
                    <Route path="edit/:id" element={<RoleEdit />} />
                </Route>

                <Route
                    path="/users"
                    element={
                        <UserList>
                            <Outlet />
                        </UserList>
                    }
                >
                    <Route path="create" element={<UserCreate />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                </Route>

                <Route
                    path="/positions"
                    element={
                        <PositionList>
                            <Outlet />
                        </PositionList>
                    }
                >
                    <Route path="create" element={<PositionCreate />} />
                    <Route path="edit/:id" element={<PositionEdit />} />
                </Route>

                <Route
                    path="/departments"
                    element={
                        <DeptList>
                            <Outlet />
                        </DeptList>
                    }
                >
                    <Route path="create" element={<DeptCreate />} />
                    <Route path="edit/:id" element={<DeptEdit />} />
                </Route>
                <Route
                    path="/resources"
                    element={
                        <ResourceList>
                            <Outlet />
                        </ResourceList>
                    }
                >
                    <Route path="create" element={<ResourceCreate />} />

                    <Route path="edit/:id" element={<ResourceEdit />} />
                </Route>

                <Route path="/policy" element={<PolicyPage />} />

                <Route
                    path="/enums"
                    element={
                        <EnumList>
                            <Outlet />
                        </EnumList>
                    }
                >
                    <Route path="create" element={<EnumCreate />} />
                    <Route path="edit/:id" element={<EnumEdit />} />
                </Route>

                <Route path="*" element={<ErrorComponent />} />
            </Route>
            <Route
                element={
                    <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                    >
                        <NavigateToResource />
                    </Authenticated>
                }
            >
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
        </Routes>
    );
};
