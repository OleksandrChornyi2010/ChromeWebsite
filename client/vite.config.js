import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/ChromeWebsite/",
    root: ".",
    build: {
        outDir: "dist",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                download: resolve(__dirname, "download.html"),
                FAQs: resolve(__dirname, "FAQs.html"),
                game: resolve(__dirname, "game.html"),
                auth: resolve(__dirname, "auth.html"),
                info: resolve(__dirname, "info.html"),
                profile: resolve(__dirname, "profile.html"),
                question: resolve(__dirname, "question.html")
            },
        },
    },
    server: {
        port: 5500
    }
});