import Button from "~/components/button";

function Row() {
  return (
    <div className="p-4 flex flex-row space-x-4">
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
  );
}

export default Row;
