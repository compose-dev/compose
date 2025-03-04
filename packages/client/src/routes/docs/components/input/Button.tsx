import Button from "~/components/button";

function ButtonComponent() {
  return (
    <div className="p-4">
      <Button onClick={() => alert("clicked")} variant="primary">
        Click me
      </Button>
    </div>
  );
}

export default ButtonComponent;
