import { motion } from "motion/react";
import { classNames } from "~/utils/classNames";

function StepContainer({
  children,
  enterDuration = 0.2,
  exitDuration = 0.2,
  className = "",
}: {
  children: React.ReactNode;
  enterDuration?: number;
  exitDuration?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={classNames("flex flex-col gap-10 w-full", className)}
      initial={{ opacity: 0, translateY: 10 }}
      animate={{
        opacity: 1,
        translateY: 0,
        transition: { duration: enterDuration },
      }}
      exit={{
        opacity: 0,
        translateY: 10,
        transition: { duration: exitDuration },
      }}
    >
      {children}
    </motion.div>
  );
}

export default StepContainer;
