import Button from "~/components/button";

function DistributedRow() {
  return (
    <div className="p-4 flex flex-row space-x-4 justify-between items-center">
      <h4>Users</h4>
      <Button onClick={() => {}} variant="primary">
        Create new
      </Button>
    </div>
  );
}

export default DistributedRow;
