import Button from "~/components/button";

function AddUI() {
  return (
    <div className="p-4 text-brand-neutral flex flex-col gap-4">
      <h3>Users</h3>
      <div>
        <Button onClick={() => {}} variant="primary">
          Add user
        </Button>
      </div>
    </div>
  );
}

export default AddUI;
