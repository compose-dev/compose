import { getNodeEnvironment } from "~/utils/nodeEnvironment";

const isDev = getNodeEnvironment() === "development";

function Image() {
  return (
    <div className="p-4">
      <div style={{ width: "600px" }}>
        <img
          src={
            isDev
              ? "http://localhost:3000/img/some-fun-apples.jpeg"
              : "https://docs.composehq.com/img/some-fun-apples.jpeg"
          }
        />
      </div>
    </div>
  );
}

export default Image;
