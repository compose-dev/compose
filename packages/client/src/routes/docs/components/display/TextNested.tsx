function TextNested() {
  return (
    <div className="p-4 flex flex-col space-y-1">
      <p className="text-brand-neutral">
        It is{" "}
        <span className="font-semibold text-brand-warning">very important</span>{" "}
        that you know this...
      </p>
    </div>
  );
}

export default TextNested;
