import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import FlipCard from './interactive/FlipCard';

/**
 * MarkdownRenderer — renders lesson Markdown with support for custom
 * interactive components embedded as HTML tags.
 *
 * Supported custom tags:
 *   <flipcard front="..." back="..." image="..."></flipcard>
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-content">
      <Markdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Map the custom <flipcard> HTML tag to the React FlipCard component
          flipcard: ({ node, ...props }) => {
            const front = props.front || '';
            const back = props.back || '';
            const image = props.image || '';
            return (
              <FlipCard
                frontText={front}
                backText={back}
                image={image || undefined}
              />
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
