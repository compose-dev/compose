import { useState } from "react";
import Button from "~/components/button";

function State() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 text-brand-neutral flex flex-col gap-4">
      <h3>Count: {count}</h3>
      <div>
        <Button onClick={() => setCount(count + 1)} variant="primary">
          Increment
        </Button>
      </div>
    </div>
  );
}

export default State;
