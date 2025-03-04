import Spinner from "./Spinner";

function CenteredSpinner(props: React.ComponentProps<typeof Spinner>) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner {...props} />
    </div>
  );
}

export default CenteredSpinner;
