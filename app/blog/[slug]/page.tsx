import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "../../site-data";

export function generateStaticParams() { return articles.map(({slug})=>({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const article=articles.find(item=>item.slug===slug);
  return article?{title:article.title,description:article.excerpt}:{};
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const article=articles.find(item=>item.slug===slug); if(!article) notFound();
  return <main className="blog-page"><header className="subpage-header"><Link href="/">LS / 刘世安</Link><Link href="/blog">全部文章 ↗</Link></header>
    <article className="article-body"><Link className="article-back" href="/blog">← 返回博客</Link><span className="article-category">{article.category}</span><h1>{article.title}</h1><p className="article-lead">{article.lead}</p><div className="article-info"><time>{article.date}</time><span>阅读 {article.readingTime}</span></div>
      {article.sections.map(section=><section className="article-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
      <div className="article-end">这是一篇持续更新的实践笔记。欢迎通过 GitHub 或邮件交流。</div>
    </article></main>;
}
