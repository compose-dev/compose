import Button from "~/components/button";
import { classNames } from "~/utils/classNames";

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <div className="flex flex-col space-y-2">
        <p
          className={classNames({
            "text-brand-neutral-2": !active,
          })}
        >
          {label}
        </p>
        <p
          className={classNames("h-px w-full z-10", {
            "border-brand-text border-b-2": active,
            "pb-0.5": !active,
          })}
        ></p>
      </div>
    </Button>
  );
}

export default function Tabs<T extends string | number>({
  activeTab,
  setActiveTab,
  options,
  rightContent,
}: {
  activeTab: T | null;
  setActiveTab: (tab: T) => void;
  options: { label: string; value: T }[];
  rightContent?: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <div className="flex self-stretch h-px border-b border-brand-neutral absolute bottom-0 left-0 right-0 " />
      <div className="flex flex-space justify-between items-center">
        <div className="flex flex-row gap-x-4">
          {options.map((option) => (
            <Tab
              key={option.value}
              label={option.label}
              active={activeTab === option.value}
              onClick={() => setActiveTab(option.value)}
            />
          ))}
        </div>
        {rightContent && rightContent}
      </div>
    </div>
  );
}
