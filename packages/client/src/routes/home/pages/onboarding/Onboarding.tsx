import { Page } from "../../components/page";

import WelcomeStep from "./steps/WelcomeStep";
import InstallationMethodStep from "./steps/InstallationMethodStep";
import FrameworkInstructions from "./steps/framework-instructions/FrameworkInstructions";
import {
  DEFAULT_STEP,
  Framework,
  STEP,
  STEP_TO_PERCENT_COMPLETE,
  STEP_TO_PREVIOUS_STEP,
  type Step,
} from "./utils";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { ProgressBar } from "~/components/progress-bar";
import Icon from "~/components/icon";
import Button from "~/components/button";
import { ConnectionStatus, useWSContext } from "~/utils/wsContext";
import { useHomeStore } from "../../utils/useHomeStore";
import InviteDevelopersStep from "./steps/InviteDevelopersStep";
import FooterActions from "./FooterActions";
import { useEffect, useState } from "react";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex flex-row items-center space-x-2"
    >
      <Icon name="arrow-back-up" />
      <p>Back</p>
    </Button>
  );
}

export default function Onboarding() {
  const { step, framework } = useSearch({ from: "/home/onboarding" });

  const { connectionStatus } = useWSContext();
  const { environments, user } = useHomeStore();

  const [shouldAnimateWelcomeStep, setShouldAnimateWelcomeStep] =
    useState(true);

  const navigate = useNavigate({ from: "/home/onboarding" });

  function setStep(step: Step, framework?: Framework) {
    navigate({
      search: { step, framework },
    });
  }

  function goBack() {
    if (step === STEP.welcome) {
      navigate({
        to: "/home",
      });
    } else {
      navigate({
        search: { step: STEP_TO_PREVIOUS_STEP[step || DEFAULT_STEP] },
      });
    }
  }

  const environmentId =
    environments && Object.keys(environments).length > 0
      ? Object.values(environments).find(
          (environment) => environment.type === "development"
        )?.id || null
      : null;

  const apiKey = environmentId ? environments[environmentId].key : null;

  const isSdkConnected =
    !!environmentId &&
    connectionStatus[environmentId] === ConnectionStatus.TYPE.ONLINE;

  const environmentHasApps =
    !!environmentId &&
    environments[environmentId].apps &&
    Object.keys(environments[environmentId].apps).length > 0;

  const onboardingComplete = isSdkConnected && environmentHasApps;

  useEffect(() => {
    if (step !== STEP.welcome) {
      setShouldAnimateWelcomeStep(false);
    }
  }, [step]);

  return (
    <Page.Root width="sm">
      <div className="flex flex-col gap-y-10 my-16 w-full">
        {step !== STEP.welcome && (
          <div className="flex flex-row items-center gap-x-4 w-full">
            <BackButton onClick={goBack} />
            <ProgressBar
              appearance="primary"
              percentComplete={
                onboardingComplete && step === STEP["framework-instructions"]
                  ? 100
                  : STEP_TO_PERCENT_COMPLETE[step || DEFAULT_STEP]
              }
            />
          </div>
        )}
        {(step === STEP.welcome || !step) && (
          <WelcomeStep
            step={STEP.welcome}
            setStep={setStep}
            isDeveloper={!!(user && user.developmentEnvironmentId !== null)}
            shouldAnimate={shouldAnimateWelcomeStep}
          />
        )}
        {step === STEP["installation-method"] && (
          <InstallationMethodStep step={step} setStep={setStep} />
        )}
        {step === STEP["framework-instructions"] && (
          <FrameworkInstructions
            framework={framework}
            apiKey={apiKey}
            isSdkConnected={isSdkConnected}
            environmentHasApps={environmentHasApps}
            setStep={setStep}
          />
        )}
        {step === STEP["invite-developers"] && <InviteDevelopersStep />}
      </div>
      <FooterActions step={step} framework={framework} />
    </Page.Root>
  );
}
