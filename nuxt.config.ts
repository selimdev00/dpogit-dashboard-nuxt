import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "./src",
  css: ["@/app/styles/global.css"],

  dir: {
    layouts: "app/layouts",
    plugins: "app/plugins",
  },

  vite: {
    plugins: [tailwindcss()],

    server: {
      allowedHosts: true,
    },
  },

  modules: ["shadcn-nuxt", "@pinia/nuxt"],

  shadcn: {
    componentDir: "./shared/ui",
  },

  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover",
      meta: [
        { name: "format-detection", content: "telephone=no" },
        { name: "msapplication-tap-highlight", content: "no" },
        { name: "theme-color", content: "#000000" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-touch-fullscreen", content: "yes" },
      ],
    },
  },
});
