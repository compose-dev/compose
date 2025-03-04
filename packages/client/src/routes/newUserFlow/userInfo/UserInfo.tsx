import { BrowserToServerEvent, m } from "@compose/ts";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import { ComboboxSingle } from "~/components/combobox";
import { DashedWrapper } from "~/components/dashed-wrapper";
import { Favicon } from "~/components/favicon";
import { EmailInput, TextInput } from "~/components/input";

function UserInfo({
  firstName,
  lastName,
  email,
  userType,
  setFirstName,
  setLastName,
  setUserType,
  inviteCodeData,
  onContinue,
  submitting,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string;
  userType: m.User.AccountType | null;
  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
  setUserType: (userType: m.User.AccountType | null) => void;
  inviteCodeData:
    | BrowserToServerEvent.GetInviteCode.Response
    | null
    | undefined;
  onContinue: () => void;
  submitting: boolean;
}) {
  const [disableUserType, setDisableUserType] = useState(false);

  useEffect(() => {
    if (
      inviteCodeData &&
      inviteCodeData.metadata.purpose === m.EmailCode.PURPOSE.JOIN_COMPANY
    ) {
      setDisableUserType(true);
      setUserType(inviteCodeData.metadata.accountType);
    } else {
      setDisableUserType(false);
    }
  }, [inviteCodeData, setUserType]);

  return (
    <DashedWrapper>
      <div className="flex flex-col space-y-8 min-w-80">
        <div className="flex items-center justify-center flex-col space-y-8">
          <Favicon className="w-10 h-10" />
          <div className="flex flex-col items-center space-y-4">
            <h2 className="font-medium text-2xl">
              {inviteCodeData
                ? `You've been invited to join ${inviteCodeData.company?.name}!`
                : "Welcome to Compose!"}
            </h2>
            <p className="text-brand-neutral-2 text-center">
              Let's get you set up.
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <TextInput
            label="First Name"
            value={firstName}
            setValue={setFirstName}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            setValue={setLastName}
          />
          <EmailInput
            label="Email"
            value={email}
            disabled
            setValue={() => {}}
          />
          <ComboboxSingle
            label="Are you a developer?"
            options={[
              {
                label: "Yes",
                value: m.User.ACCOUNT_TYPE.DEVELOPER,
                description: "I will develop and use apps with Compose.",
              },
              {
                label: "No",
                value: m.User.ACCOUNT_TYPE.USER_ONLY,
                description: "I will only use apps.",
              },
            ]}
            value={userType}
            setValue={setUserType}
            id="user-type"
            disabled={disableUserType}
          />
          <Button
            onClick={onContinue}
            variant="primary"
            className="!mt-5"
            disabled={
              firstName === null || lastName === null || userType === null
            }
            loading={submitting}
          >
            {inviteCodeData ? "Join workspace" : "Continue"}
          </Button>
        </div>
      </div>
    </DashedWrapper>
  );
}

export default UserInfo;
