import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const noto = Noto_Sans_SC({ variable: "--font-cn", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "刘世安｜LLM & Agent", template: "%s｜刘世安" },
  description: "刘世安的个人主页：大模型应用、AI Agent、RAG、模型微调、推理部署与科研记录。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geist.variable} ${mono.variable} ${noto.variable}`}>{children}</body></html>;
}
