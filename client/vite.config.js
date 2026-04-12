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
                home: resolve(__dirname, "html/index.html"),
                ask: resolve(__dirname, "html/ask_a_question.html"),
                account: resolve(__dirname, "html/account.html"),
                deleted: resolve(__dirname, "html/deleted.html"),
                download: resolve(__dirname, "html/download.html"),
                download_started: resolve(__dirname, "html/download-started.html"),
                FAQs: resolve(__dirname, "html/FAQs.html"),
                game: resolve(__dirname, "html/game.html"),
                password_update: resolve(__dirname, "html/password-update.html"),
                question_overview: resolve(__dirname, "html/question-overview.html"),
                sign_in: resolve(__dirname, "html/sign-in.html"),
                sign_up: resolve(__dirname, "html/sign-up.html"),
                submitted: resolve(__dirname, "html/submitted.html"),
                subscribed: resolve(__dirname, "html/subscribed.html"),
            },
        },
    },
    server: {
        port: 5500
    }
});