import { m } from "@compose/ts";
import { useHomeStore } from "~/routes/home/utils/useHomeStore";

function TitleLabel({ title, label }: { title: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h6>{title}</h6>
      <p className="text-brand-neutral-2">{label}</p>
    </div>
  );
}

function UserProfileSection() {
  const { user } = useHomeStore();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-col gap-4 flex-1">
        <TitleLabel title="Name" label={`${user.firstName} ${user.lastName}`} />
        <TitleLabel title="Email" label={user.email} />
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <TitleLabel
          title="Developer"
          label={user.developmentEnvironmentId ? "Yes" : "No"}
        />
        <TitleLabel
          title="Role"
          label={m.User.PERMISSION_TO_LABEL[user.permission]}
        />
      </div>
    </div>
  );
}

export default UserProfileSection;
