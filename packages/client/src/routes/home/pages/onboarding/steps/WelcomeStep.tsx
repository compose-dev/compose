import Icon from "~/components/icon";
import Button from "~/components/button";
import { STEP, STEP_TO_ORDER, type Step } from "../utils";
import StepContainer from "../StepContainer";
import { motion } from "motion/react";

const INITIAL_DELAY = 0.75;
const DELAY_INCREMENT = 0.5;
const ANIMATION_DURATION = 0.5;

/**
 * order starts with 1!
 */
function getDelay(shouldAnimate: boolean, order: number) {
  if (!shouldAnimate) {
    return 0;
  }

  // First item gets a special delay
  if (order === 1) {
    return INITIAL_DELAY;
  }

  // Second item also gets a special delay so the page hangs
  // on the title for a bit longer
  if (order === 2) {
    return INITIAL_DELAY * 2;
  }

  // After that, we increment by the normal amount
  return INITIAL_DELAY * 2 + DELAY_INCREMENT * (order - 2);
}

function FeatureCard({
  icon,
  text,
  delay,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex flex-row items-start gap-x-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION, delay }}
    >
      <div className="mt-1">
        <Icon name={icon} size="1" />
      </div>
      <p>{text}</p>
    </motion.div>
  );
}

function WelcomeStep({
  step,
  setStep,
  isDeveloper,
  shouldAnimate,
}: {
  step: Step;
  setStep: (step: Step) => void;
  isDeveloper: boolean;
  shouldAnimate: boolean;
}) {
  return (
    <StepContainer className="min-h-[calc(100dvh-20rem)] justify-center items-center mt-16">
      <div className="flex flex-col gap-y-8 max-w-xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATION,
            delay: getDelay(shouldAnimate, 1),
          }}
        >
          Welcome to Compose.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATION,
            delay: getDelay(shouldAnimate, 2),
          }}
        >
          A simpler way to build internal apps.{" "}
          <strong>With just backend code.</strong>
        </motion.p>
        <div className="flex flex-col gap-y-4">
          <FeatureCard
            icon="format"
            text="Build fast with 40+ components designed for internal apps"
            delay={getDelay(shouldAnimate, 3)}
          />
          <FeatureCard
            icon="code"
            text="Use code from across your backend codebase just by importing it"
            delay={getDelay(shouldAnimate, 4)}
          />
          <FeatureCard
            icon="users"
            text="Instantly share apps within your organization"
            delay={getDelay(shouldAnimate, 5)}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATION,
            delay: getDelay(shouldAnimate, 6),
          }}
        >
          <Button
            onClick={() => {
              if (isDeveloper) {
                setStep(STEP["installation-method"]);
              } else {
                setStep(STEP["invite-developers"]);
              }
            }}
            variant="primary"
            disabled={STEP_TO_ORDER[step] > 0}
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </StepContainer>
  );
}

export default WelcomeStep;
