import Spinner from "./Spinner";

function CenteredSpinner(props: React.ComponentProps<typeof Spinner>) {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Spinner {...props} />
    </div>
  );
}

export default CenteredSpinner;
