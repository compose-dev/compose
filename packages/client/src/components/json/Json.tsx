import { Code } from "~/components/code";

function Json({
  label,
  json,
  description = null,
  bare = false,
  copyable = true,
  size = "sm",
  wrap = false,
}: {
  label: string | null;
  json: object;
  description?: string | null;
  bare?: boolean;
  copyable?: boolean;
  size?: "xs" | "sm" | "md";
  wrap?: boolean;
}) {
  return (
    <Code
      label={label ?? undefined}
      description={description ?? undefined}
      code={JSON.stringify(json, null, 2)}
      lang="json"
      bare={bare}
      copyable={copyable}
      size={size}
      wrap={wrap}
    />
  );
}

export default Json;
