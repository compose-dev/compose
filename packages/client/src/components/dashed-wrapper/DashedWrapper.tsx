interface DashedWrapperProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function DashedWrapper({ children, footer }: DashedWrapperProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-[1fr_auto_1fr] h-screen w-screen">
      {/* Top-left corner */}
      <div className="border-r border-b border-dashed border-brand-neutral"></div>
      {/* Top edge */}
      <div className="border-b border-dashed border-brand-neutral pt-4"></div>
      {/* Top-right corner */}
      <div className="border-l border-b border-dashed border-brand-neutral"></div>

      {/* Left edge */}
      <div className="border-r border-dashed border-brand-neutral pl-4"></div>
      {/* Content */}
      <div>
        <div className="p-4 sm:p-8 lg:p-16">{children}</div>
        {footer && (
          <div className="border-t border-dashed border-brand-neutral w-full p-4 sm:px-8 lg:px-16">
            {footer}
          </div>
        )}
      </div>
      {/* Right edge */}
      <div className="border-l border-dashed border-brand-neutral pr-4"></div>

      {/* Bottom-left corner */}
      <div className="border-r border-t border-dashed border-brand-neutral"></div>
      {/* Bottom edge */}
      <div className="border-t border-dashed border-brand-neutral pb-4"></div>
      {/* Bottom-right corner */}
      <div className="border-l border-t border-dashed border-brand-neutral"></div>
    </div>
  );
}

export default DashedWrapper;
