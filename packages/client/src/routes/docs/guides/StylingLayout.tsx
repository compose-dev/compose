import Button from "~/components/button";

function StylingLayout() {
  return (
    <div className="p-4">
      <div className="text-brand-neutral flex flex-row justify-between items-center gap-4 card">
        <h3>Users</h3>
        <div className="flex flex-row gap-4">
          <Button onClick={() => {}} variant="primary">
            Add
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

export default StylingLayout;
