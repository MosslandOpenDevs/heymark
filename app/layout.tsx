import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "@/app/styles/global.scss";

export const metadata: Metadata = {
    title: "heymark",
    description: "Documentation system designed for the age of agentic AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
