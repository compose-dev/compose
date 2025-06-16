import Button from "~/components/button";
import Icon from "~/components/icon";
import { DashedWrapper } from "~/components/dashed-wrapper";

import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Favicon } from "~/components/favicon";
import { theme } from "~/utils/theme";

function SignUp() {
  const { inviteCode, inviteExpiresAt, redirect } = useSearch({
    from: "/auth/signup",
  });
  const navigate = useNavigate({ from: "/auth/signup" });

  theme.use();

  return (
    <DashedWrapper>
      <div className="flex items-center justify-center flex-col gap-y-8">
        <Favicon className="w-10 h-10" />
        <h2 className="font-medium text-2xl">
          {inviteCode ? "Join your workspace" : "Create your workspace"}
        </h2>
        <Button
          variant="outline"
          onClick={() =>
            navigate({
              to: "/auth/google-oauth",
              search: {
                redirect: redirect || null,
                newAccount: true,
                inviteCode,
                inviteExpiresAt,
              },
            })
          }
          size="lg"
          className="w-80"
        >
          <Icon name="google-with-color" size="1.5" />
          <p>Continue with Google</p>
        </Button>
        <div className="flex flex-col items-center justify-center space-y-4 text-sm text-center text-brand-neutral-2">
          <p>
            By signing up, you agree to our{" "}
            <a
              href="https://composehq.com/privacy"
              target="_blank"
              className="text-brand-neutral hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
          <p>-</p>
          <p>
            Already have an account?{" "}
            <Link
              to="/auth/login"
              search={{ redirect: null }}
              className="text-brand-neutral hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </DashedWrapper>
  );
}

export default SignUp;
