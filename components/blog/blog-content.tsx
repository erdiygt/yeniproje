import "server-only";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import sanitizeHtml from "sanitize-html";

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

const htmlSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
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
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title"],
    "*": ["class"],
  },
  transformTags: {
    h1: "h2",
    a: (tagName, attribs) => {
      const next = { ...attribs };
      if (next.target === "_blank") {
        next.rel = "noopener noreferrer";
      }
      return { tagName, attribs: next };
    },
  },
};

export function BlogContent({ content }: BlogContentProps) {
  if (isHtmlContent(content)) {
    const sanitized = sanitizeHtml(content, htmlSanitizeOptions);

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
