import { Code } from "~/components/code";

function Json({
  label,
  json,
  description = null,
}: {
  label: string | null;
  json: object;
  description?: string | null;
}) {
  return (
    <Code
      label={label ?? undefined}
      description={description ?? undefined}
      code={JSON.stringify(json, null, 2)}
      lang="json"
    />
  );
}

export default Json;
