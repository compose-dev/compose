import Button from "~/components/button";

function ButtonCustomStyle() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <Button
          onClick={() => {}}
          variant="primary"
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "10px 20px",
            borderRadius: "999px",
          }}
        >
          Custom button
        </Button>
      </div>
    </div>
  );
}

export default ButtonCustomStyle;
