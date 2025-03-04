import { classNames } from "~/utils/classNames";

export default function Favicon({ className = "" }: { className?: string }) {
  return (
    <>
      <img
        src="/favicon-dark-without-bg.svg"
        alt="Compose Logo"
        className={classNames("hidden dark:block", className)}
      />
      <img
        src="/favicon-light.svg"
        alt="Compose Logo"
        className={classNames("dark:hidden", className)}
      />
    </>
  );
}
