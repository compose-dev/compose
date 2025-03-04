import Button from "~/components/button";
import { toast } from "~/utils/toast";

function ToastExample() {
  const { addToast } = toast.useStore();

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <Button
          variant="primary"
          onClick={() =>
            addToast({
              message: "This is a success toast",
              appearance: "success",
            })
          }
        >
          Show success toast
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          onClick={() =>
            addToast({
              message: "This is an info toast",
              appearance: "info",
            })
          }
        >
          Show info toast
        </Button>
      </div>
      <div>
        <Button
          variant="warning"
          onClick={() =>
            addToast({
              message: "This is a warning toast",
              appearance: "warning",
            })
          }
        >
          Show warning toast
        </Button>
      </div>
      <div>
        <Button
          variant="danger"
          onClick={() =>
            addToast({
              message: "This is an error toast",
              appearance: "error",
            })
          }
        >
          Show error toast
        </Button>
      </div>
    </div>
  );
}

export default ToastExample;
