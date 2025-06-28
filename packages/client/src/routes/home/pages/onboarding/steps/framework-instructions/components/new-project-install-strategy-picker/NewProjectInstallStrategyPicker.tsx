import Button from "~/components/button";
import { classNames } from "~/utils/classNames";
import { INSTALL_STRATEGY, type InstallStrategy } from "./constants";

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

export default function NewProjectInstallStrategyPicker({
  activeTab,
  setActiveTab,
}: {
  activeTab: InstallStrategy;
  setActiveTab: (tab: InstallStrategy) => void;
}) {
  return (
    <div className="relative">
      <div className="flex self-stretch h-px border-b border-brand-neutral absolute bottom-0 left-0 right-0 " />
      <div className="flex flex-space justify-between items-start">
        <div className="flex flex-row gap-x-4">
          <Tab
            label="Clone starter repo"
            active={activeTab === INSTALL_STRATEGY.GITHUB_REPO}
            onClick={() => setActiveTab(INSTALL_STRATEGY.GITHUB_REPO)}
          />
          <Tab
            label="Install manually in terminal"
            active={activeTab === INSTALL_STRATEGY.MANUAL}
            onClick={() => setActiveTab(INSTALL_STRATEGY.MANUAL)}
          />
        </div>
      </div>
    </div>
  );
}
