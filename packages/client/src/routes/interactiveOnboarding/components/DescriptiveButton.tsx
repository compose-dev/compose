import Icon from "~/components/icon";
import Button from "~/components/button";

function DescriptiveButton({
  onClick,
  iconName,
  iconColor,
  name,
  description,
}: {
  onClick: () => void;
  iconName: Parameters<typeof Icon>[0]["name"];
  iconColor: Parameters<typeof Icon>[0]["color"];
  name: string;
  description: string;
}) {
  return (
    <Button variant="outline" onClick={onClick} className="w-full max-w-md">
      <div className="flex flex-row items-center gap-4 w-full py-1">
        <Icon name={iconName} size="1.5" color={iconColor} />{" "}
        <div className="flex flex-col items-start text-left flex-1">
          <span className="text-lg font-medium">{name}</span>
          <span className="text-brand-neutral-2 text-sm">{description}</span>
        </div>
      </div>
    </Button>
  );
}

export default DescriptiveButton;
