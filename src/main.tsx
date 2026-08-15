import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import { articles } from "../app/site-data";
import "../app/globals.css";

function useHash() {
  const [hash,setHash]=useState(()=>window.location.hash.slice(1)||"/");
  useEffect(()=>{ const update=()=>setHash(window.location.hash.slice(1)||"/"); window.addEventListener("hashchange",update); return()=>window.removeEventListener("hashchange",update); },[]);
  return hash;
}

function Header(){return <header className="subpage-header"><a href="#/">LS / 刘世安</a><a href="#/">返回主页 ↗</a></header>}

function Blog(){return <main className="blog-page"><Header/><section className="blog-hero"><span className="eyebrow">NOTES & ESSAYS</span><h1>思考与记录</h1><p>记录 Agent 系统、RAG 检索、模型微调、推理部署与科研过程中的问题、选择和复盘。</p></section><section className="blog-list">{articles.map((article,index)=><a className="article-card" href={`#/blog/${article.slug}`} key={article.slug}><div><span>{article.category}</span><time>{article.date}</time></div><h3>{article.title}</h3><p>{article.excerpt}</p><footer><span>阅读 {article.readingTime}</span><b>0{index+1} ↗</b></footer></a>)}</section></main>}

function Article({slug}:{slug:string}){const article=articles.find(item=>item.slug===slug);if(!article)return <NotFound/>;return <main className="blog-page"><Header/><article className="article-body"><a className="article-back" href="#/blog">← 返回博客</a><span className="article-category">{article.category}</span><h1>{article.title}</h1><p className="article-lead">{article.lead}</p><div className="article-info"><time>{article.date}</time><span>阅读 {article.readingTime}</span></div>{article.sections.map(section=><section className="article-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}<div className="article-end">这是一篇持续更新的实践笔记。欢迎通过 GitHub 或邮件交流。</div></article></main>}

function NotFound(){return <main className="article-body"><span className="article-category">404</span><h1>页面没有找到</h1><p className="article-lead">这个链接可能已经移动。</p><a className="article-back" href="#/">返回主页 →</a></main>}

function App(){const path=useHash();useEffect(()=>window.scrollTo(0,0),[path]);if(path==="/blog")return <Blog/>;if(path.startsWith("/blog/"))return <Article slug={path.replace("/blog/","")}/>;return <Home/>}

createRoot(document.getElementById("root")!).render(<App/>);
