import { m } from "@compose/ts";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "~/api";
import Button from "~/components/button";
import { InlineLink } from "~/components/inline-link";
import { TextAreaInput } from "~/components/input";
import { Modal } from "~/components/modal";
import { toast } from "~/utils/toast";

function FooterActions() {
  const { addToast } = toast.useStore();
  const navigate = useNavigate({ from: "/start" });
  const { lang, step } = useSearch({ from: "/start" });

  const [reportIssueModal, setReportIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState<string | null>(null);

  function onSkipOnboarding() {
    api.routes.logEvent({
      event: "INTERACTIVE_ONBOARDING_SKIPPED",
      data: {
        step,
        lang: lang || "no-lang",
      },
    });
    navigate({
      to: "/home",
      search: { newUser: true, newOrganization: true },
    });
  }

  function onOpenReportIssueModal() {
    api.routes.logEvent({
      event: "INTERACTIVE_ONBOARDING_CLICKED_REPORT_ISSUE",
      data: {
        step,
        lang: lang || "no-lang",
      },
    });
    setReportIssueModal(true);
  }

  async function onSubmitReportIssue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!issueDescription || issueDescription.length < 10) {
      addToast({
        message: "Issue description must be at least 10 characters",
        appearance: "error",
      });
      return;
    } else {
      // Log in external analytics provider
      api.routes.logEvent({
        event: "INTERACTIVE_ONBOARDING_SUBMITTED_ISSUE_REPORT",
        data: {
          issueDescription: issueDescription.slice(0, 100),
          lang: lang || "no-lang",
          step,
        },
      });

      // Log in internal error tracker
      await api.routes.logError({
        type: m.ErrorLog.ENTRY_TYPE.ONBOARDING_ISSUE_REPORT,
        issueDescription,
        lang: lang || "no-lang",
        step,
      });

      setReportIssueModal(false);
      addToast({
        title: "Issue reported successfully",
        message:
          "We'll email you within 12 hours with a solution or next steps.",
        appearance: "success",
      });
      setIssueDescription(null);
    }
  }

  return (
    <div className="flex flex-row items-center justify-center gap-3 w-full text-sm">
      <Button variant="ghost" onClick={onSkipOnboarding}>
        <p className="text-brand-neutral-2 hover:underline">Skip onboarding</p>
      </Button>
      <span>&#183;</span>
      <Button variant="ghost" onClick={onOpenReportIssueModal}>
        <p className="text-brand-error hover:underline">Report an issue</p>
      </Button>
      <Modal.Root
        isOpen={reportIssueModal}
        onClose={() => setReportIssueModal(false)}
      >
        <Modal.CloseableHeader onClose={() => setReportIssueModal(false)}>
          Report an issue
        </Modal.CloseableHeader>
        <Modal.Body>
          <p>
            Sorry to hear you're having trouble. Describe the issue and any
            helpful information you can provide (terminal output, system
            information, etc.). We'll get back to you{" "}
            <span className="font-bold">within 12 hours</span>.
          </p>
          <form onSubmit={onSubmitReportIssue} className="flex flex-col gap-4">
            <TextAreaInput
              label={null}
              value={issueDescription}
              setValue={(value) => setIssueDescription(value)}
              placeholder=""
            />
            <Button variant="primary" onClick={() => {}} type="submit">
              Submit issue
            </Button>
          </form>
          <div className="py-4">
            <div className="flex flex-row border-b border-brand-neutral"></div>
          </div>
          <h4>Want help faster?</h4>
          <p>
            <InlineLink url="https://discord.gg/82rk2N8ZE6">
              Join the Discord server
            </InlineLink>{" "}
            to talk to other users and engineers on the team.
          </p>
        </Modal.Body>
      </Modal.Root>
    </div>
  );
}

export default FooterActions;
