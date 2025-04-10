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
    name: "category",
    list: "/categories",
    create: "/categories/create",
    edit: "/categories/edit/:id",
    show: "/categories/show/:id",
    meta: {
      canDelete: true,
      label: "分类管理",
      icon: <TagsOutlined />,
      parent: "system_manager",
    },
  },
];
