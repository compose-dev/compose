import { Markdown } from "~/components/markdown";

const MARKDOWN_TEXT = `
# Welcome to Markdown Example

## Features

1. **Bold text** and *italic text*
2. [Hyperlinks](https://example.com)
3. Inline \`code\`

### Lists

- Unordered list item 1
- Unordered list item 2
- Nested item

> This is a blockquote.
`;

function MarkdownComponent() {
  return (
    <div className="p-4">
      <Markdown>{MARKDOWN_TEXT}</Markdown>
    </div>
  );
}

export default MarkdownComponent;
