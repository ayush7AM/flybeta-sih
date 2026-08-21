import Markdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-content">
      <Markdown>{content}</Markdown>
    </div>
  );
}
