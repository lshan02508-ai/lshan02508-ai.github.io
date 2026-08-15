import {useEffect,useLayoutEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import Home from "../app/page";
import {articles} from "../app/site-data";
import "../app/globals.css";

function readRoute(){const hash=location.hash.slice(1);return hash.startsWith("/blog")?hash:"/"}
function useRoute(){const [route,setRoute]=useState(readRoute);useEffect(()=>{const update=()=>setRoute(readRoute());addEventListener("hashchange",update);return()=>removeEventListener("hashchange",update)},[]);return route}
function SubNav(){return <header className="article-nav"><a href="#/">LS · 刘世安</a><div><a href="#/">主页</a>　<a href="#/blog">文章</a></div></header>}
function Blog(){return <main className="blog-page"><SubNav/><div className="blog-wrap"><section className="blog-title"><span>NOTES & ESSAYS</span><h1>个人博客</h1><p>关于 Agent、RAG、模型训练与工程实践的记录。</p></section><h2 className="archive-year">2026</h2><div className="archive-list">{articles.map(a=><a href={`#/blog/${a.slug}`} key={a.slug}><time>{a.date}</time><div><span>{a.category}</span><h2>{a.title}</h2><p>{a.excerpt}</p></div><b>↗</b></a>)}</div></div></main>}
function Article({slug}:{slug:string}){const a=articles.find(x=>x.slug===slug);if(!a)return <Home/>;return <main className="article-page"><SubNav/><article className="article-body"><a className="back" href="#/blog">← 返回文章列表</a><header><span>{a.category}</span><h1>{a.title}</h1><p>{a.lead}</p><div>{a.date}　·　阅读 {a.readingTime}</div></header>{a.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}<div className="article-end">END · 这是一篇持续更新的实践笔记。</div></article></main>}
function App(){const route=useRoute();useLayoutEffect(()=>{document.documentElement.scrollTop=0;document.body.scrollTop=0;scrollTo(0,0)},[route]);if(route==="/blog")return <Blog/>;if(route.startsWith("/blog/"))return <Article slug={route.slice(6)}/>;return <Home/>}
createRoot(document.getElementById("root")!).render(<App/>);
