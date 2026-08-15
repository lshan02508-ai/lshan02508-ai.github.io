import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import { articles } from "../app/site-data";
import "../app/globals.css";

function useHash(){const [hash,setHash]=useState(()=>location.hash.slice(1)||"/");useEffect(()=>{const fn=()=>setHash(location.hash.slice(1)||"/");addEventListener("hashchange",fn);return()=>removeEventListener("hashchange",fn)},[]);return hash}
function BlogHeader(){return <header className="blog-nav"><a href="#/">LS / 刘世安</a><a href="#/">返回主页 ↗</a></header>}
function Blog(){return <main className="blog-page"><section className="blog-cover"><BlogHeader/><div className="cover-art"><i/><i/><i/></div><div className="cover-copy"><span>NOTES FROM THE FIELD</span><h1>Lines of Code,<br/><em>Lines of Thought.</em></h1><p>技术、研究与生活的长期记录。</p></div></section><section className="post-panel"><header><div><span>05 / JOURNAL</span><h2>博客与日记</h2></div><p>关于 Agent、RAG、模型训练与工程实践。<br/>偶尔也写研究之外的观察。</p></header><div className="post-list">{articles.map((a,i)=><a href={`#/blog/${a.slug}`} key={a.slug}><div className={`post-thumb thumb-${i+1}`}><b>0{i+1}</b><span>{a.category}</span></div><div className="post-copy"><span>{a.date} · 阅读 {a.readingTime}</span><h3>{a.title}</h3><p>{a.excerpt}</p><small>#{a.category}</small></div><b className="post-arrow">↗</b></a>)}</div></section><footer className="blog-footer">© 2026 刘世安 · Keep thinking, keep building.</footer></main>}
function Article({slug}:{slug:string}){const a=articles.find(x=>x.slug===slug);if(!a)return <Home/>;return <main className="article-page"><BlogHeader/><article><a className="article-back" href="#/blog">← 返回全部文章</a><span className="article-kicker">{a.category} · {a.date}</span><h1>{a.title}</h1><p className="article-lead">{a.lead}</p><div className="article-rule"/>{a.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}<footer>写于 {a.date} · 持续更新</footer></article></main>}
function App(){const path=useHash();useEffect(()=>scrollTo(0,0),[path]);if(path==="/blog")return <Blog/>;if(path.startsWith("/blog/"))return <Article slug={path.slice(6)}/>;return <Home/>}
createRoot(document.getElementById("root")!).render(<App/>);
