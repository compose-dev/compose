function StylingPositioning() {
  return (
    <div className="p-4">
      <div className="text-brand-neutral flex flex-row justify-center">
        <p>I am centered</p>
      </div>
      <div className="text-brand-neutral flex flex-col items-end gap-4">
        <p>I am on the right</p>
        <p>I am also on the right</p>
      </div>
    </div>
  );
}

export default StylingPositioning;
