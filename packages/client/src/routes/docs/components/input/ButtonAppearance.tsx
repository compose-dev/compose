import Button from "~/components/button";

function ButtonAppearance() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <Button onClick={() => {}} variant="primary">
          Primary
        </Button>
      </div>
      <div>
        <Button onClick={() => {}} variant="outline">
          Outline
        </Button>
      </div>
      <div>
        <Button onClick={() => {}} variant="warning">
          Warning
        </Button>
      </div>
      <div>
        <Button onClick={() => {}} variant="danger">
          Danger
        </Button>
      </div>
    </div>
  );
}

export default ButtonAppearance;
