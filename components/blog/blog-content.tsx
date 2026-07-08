import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import DOMPurify from "isomorphic-dompurify";

interface BlogContentProps {
  content: string;
}

function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  return (
    trimmed.startsWith("<") ||
    /<(p|h[1-6]|ul|ol|blockquote|img|div|strong|em|a)\b/i.test(content)
  );
}

const sanitizeConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "mark",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "img",
    "span",
    "div",
  ],
  ALLOWED_ATTR: [
    "href",
    "target",
    "rel",
    "src",
    "alt",
    "title",
    "class",
  ],
};

export function BlogContent({ content }: BlogContentProps) {
  if (isHtmlContent(content)) {
    const sanitized = DOMPurify.sanitize(content, sanitizeConfig);

    return (
      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <div className="prose-blog">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
