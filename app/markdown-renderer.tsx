import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({source, className = "markdown-content"}:{source:string;className?:string}) {
  return <div className={className}><ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeSanitize]}
    components={{a:({href, children, ...props}) => <a {...props} href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>}}
  >{source}</ReactMarkdown></div>;
}
