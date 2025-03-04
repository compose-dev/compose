import { Code } from "~/components/code";

const CODE_EXAMPLE_JS = `function add(a, b) {
    return a + b;
}

const result = add(1, 2);
`;

function CodeComponentJS() {
  return (
    <div className="p-4">
      <Code code={CODE_EXAMPLE_JS} lang="javascript" />
    </div>
  );
}

export default CodeComponentJS;
