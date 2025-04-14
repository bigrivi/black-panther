import react from "@vitejs/plugin-react";
//@ts-ignore
import path from "path";
import { defineConfig,AliasOptions } from "vite";
//@ts-ignore
const root = path.resolve(__dirname, "src");
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
});
