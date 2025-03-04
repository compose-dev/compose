import { Code } from "~/components/code";

const JSON_EXAMPLE = {
  first: "John",
  last: "Doe",
  age: 50,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
  },
};

const jsonToString = (json: object): string => {
  return JSON.stringify(json, null, 2);
};

const JSON_EXAMPLE_STRING = jsonToString(JSON_EXAMPLE);

function JSONComponent() {
  return (
    <div className="p-4">
      <Code code={JSON_EXAMPLE_STRING} lang="json" />
    </div>
  );
}

export default JSONComponent;
