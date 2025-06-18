import { useNavigate } from "@tanstack/react-router";
import Button from "~/components/button";

export default function ProPlanNotice({ label }: { label: string }) {
  const navigate = useNavigate();

  return (
    <>
      <p>{label}</p>
      <Button
        variant="brand"
        onClick={() => navigate({ to: "/home/settings", hash: "billing" })}
      >
        Upgrade to Pro
      </Button>
    </>
  );
}
