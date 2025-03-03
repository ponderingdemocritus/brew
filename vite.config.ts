import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["coffee-icon.svg", "icons/*.png"],
      manifest: {
        name: "Loafs Brew Journal",
        short_name: "Brew Journal",
        description:
          "Track and improve your coffee extraction parameters and brewing process",
        theme_color: "#8c7851",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
