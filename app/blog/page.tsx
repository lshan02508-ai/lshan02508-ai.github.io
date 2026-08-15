import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "../site-data";

export const metadata: Metadata = { title: "博客", description: "关于 Agent、RAG、模型微调与工程实践的思考。" };

export default function BlogPage() {
  return <main className="blog-page">
    <header className="subpage-header"><Link href="/">LS / 刘世安</Link><Link href="/">返回主页 ↗</Link></header>
    <section className="blog-hero"><span className="eyebrow">NOTES & ESSAYS</span><h1>思考与记录</h1><p>记录 Agent 系统、RAG 检索、模型微调、推理部署与科研过程中的问题、选择和复盘。</p></section>
    <section className="blog-list">
      {articles.map((article,index)=><Link className="article-card" href={`/blog/${article.slug}`} key={article.slug}>
        <div><span>{article.category}</span><time>{article.date}</time></div><h3>{article.title}</h3><p>{article.excerpt}</p><footer><span>阅读 {article.readingTime}</span><b>0{index+1} ↗</b></footer>
      </Link>)}
    </section>
  </main>;
}
