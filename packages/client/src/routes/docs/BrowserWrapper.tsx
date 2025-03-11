import Icon from "~/components/icon";

function BrowserWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-brand h-full ${className}`}>
      <div className="w-full bg-brand-overlay p-2 relative flex justify-center items-center">
        <div className="absolute h-full left-2 items-center hidden xs:flex">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
        </div>
        <div className="bg-brand-page text-brand-neutral-2 text-xs p-1 px-4 flex items-center gap-1 rounded-xl">
          <Icon name="lock" color="brand-neutral-2" size="xs" />
          <p>composehq.com</p>
        </div>
        <div className="absolute h-full right-2 items-center hidden xs:flex">
          <div className="flex items-center gap-0.5">
            <Icon name="lightning" color="brand-neutral-3" size="sm" />
            <p className="text-[10px] leading-3 tracking-wider text-brand-neutral-3">
              LIVE DEMO
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto w-full h-[calc(100%-40px)]">
        {children}
      </div>
    </div>
  );
}

export default BrowserWrapper;
