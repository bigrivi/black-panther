import { SettingOutlined, TagsOutlined, UserOutlined } from "@ant-design/icons";
import { ResourceProps } from "@refinedev/core";

export const resources: ResourceProps[] = [
  {
    name: "系统管理",
    identifier: "system_manager",
    meta: {
      icon: <SettingOutlined />,
    },
  },

  {
    name: "post",
    list: "/blog-posts",
    create: "/blog-posts/create",
    edit: "/blog-posts/edit/:id",
    show: "/blog-posts/show/:id",
    meta: {
      canDelete: true,
      icon: <UserOutlined />,
      label: "博客文章",
      parent: "system_manager",
    },
  },
  {
    name: "user",
    list: "/user",
    create: "/user/create",
    edit: "/user/edit/:id",
    show: "/user/show/:id",
    meta: {
      canDelete: true,
      label: "用户管理",
      icon: <TagsOutlined />,
      parent: "system_manager",
    },
  },
];
