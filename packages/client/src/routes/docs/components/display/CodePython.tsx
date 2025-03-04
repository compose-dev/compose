import { Code } from "~/components/code";

const CODE_EXAMPLE_PYTHON = `def add(a, b):
    return a + b

result = add(1, 2)
`;
function CodeComponentPython() {
  return (
    <div className="p-4">
      <Code code={CODE_EXAMPLE_PYTHON} lang="python" />
    </div>
  );
}

export default CodeComponentPython;
