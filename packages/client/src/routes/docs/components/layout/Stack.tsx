import Button from "~/components/button";

function Stack() {
  return (
    <div className="p-4">
      <div className="space-y-4 flex flex-col items-center">
        <p>Choose an action</p>
        <div className="flex flex-row space-x-4">
          <Button onClick={() => {}} variant="primary">
            View
          </Button>
          <Button onClick={() => {}} variant="outline">
            Edit
          </Button>
          <Button onClick={() => {}} variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Stack;
