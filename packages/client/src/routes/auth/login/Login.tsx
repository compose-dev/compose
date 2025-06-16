import Button from "~/components/button";
import Icon from "~/components/icon";
import { DashedWrapper } from "~/components/dashed-wrapper";
import { Favicon } from "~/components/favicon";

import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { theme } from "~/utils/theme";

function Login() {
  const { redirect, appRoute, environmentId } = useSearch({
    from: "/auth/login",
  });

  theme.use();

  const navigate = useNavigate({ from: "/auth/login" });

  return (
    <DashedWrapper>
      <div className="w-full h-full flex items-center justify-center flex-col space-y-8 text-brand-neutral">
        <div className="flex items-center justify-center flex-col gap-y-8">
          <Favicon className="w-10 h-10" />
          <h2 className="font-medium text-2xl">Log in to Compose</h2>
        </div>
        <div className="flex flex-col items-center justify-center space-y-8">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/auth/google-oauth",
                search: {
                  redirect,
                  newAccount: false,
                  appRoute,
                  environmentId,
                },
              })
            }
            size="lg"
            className="w-80"
          >
            <Icon name="google-with-color" size="1.5" />
            <p>Continue with Google</p>
          </Button>
          <p className="text-brand-neutral-2 text-sm">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-brand-neutral hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </DashedWrapper>
  );
}

export default Login;
