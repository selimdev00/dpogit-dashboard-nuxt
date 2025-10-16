import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: process.env.NODE_ENV !== "production" },
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

  ssr: false,

  modules: ["shadcn-nuxt", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      apiHost: process.env.API_HOST || 'https://dpogti-api.marsakod.app',
    },
  },

  shadcn: {
    componentDir: "./shared/ui",
  },

  // Production optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,

    // Reduce memory usage
    experimental: {
      wasm: false,
    },
  },

  // Disable source maps in production
  sourcemap: {
    server: false,
    client: false,
  },

  // Optimize rendering
  experimental: {
    payloadExtraction: false,
  },

  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover",
      title: "DPOGTI Dashboard",
      meta: [
        {
          name: "description",
          content: "Система управления и мониторинга DPOGTI",
        },
        { name: "format-detection", content: "telephone=no" },
        { name: "msapplication-tap-highlight", content: "no" },
        { name: "theme-color", content: "#111111" },
        { name: "mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        { name: "apple-touch-fullscreen", content: "yes" },
        { name: "msapplication-TileColor", content: "#111111" },
        { name: "msapplication-config", content: "/browserconfig.xml" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#111111" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
});
