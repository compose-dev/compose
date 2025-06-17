import { Page } from "~/routes/home/components/page";

function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {title && <Page.Subtitle>{title}</Page.Subtitle>}
      {children}
    </div>
  );
}

export default SettingsSection;
