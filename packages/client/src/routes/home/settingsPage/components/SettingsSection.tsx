function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export default SettingsSection;
