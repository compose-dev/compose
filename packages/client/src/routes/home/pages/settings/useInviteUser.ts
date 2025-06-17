import { m, u } from "@compose/ts";
import { useState } from "react";
import { api } from "~/api";
import { toast } from "~/utils/toast";

enum ACTIVE_MODAL {
  FORM,
  SUCCESS,
  NONE,
}

function getInviteLink(id: string, expiresAt: Date) {
  return `${window.location.origin}/auth/signup/?inviteCode=${id}&inviteExpiresAt=${expiresAt.getTime()}`;
}

export function useInviteUser(refetchAccounts: () => void) {
  const { addToast } = toast.useStore();

  const [activeModal, setActiveModal] = useState(ACTIVE_MODAL.NONE);

  const [email, setEmail] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<m.User.AccountType | null>(
    null
  );
  const [permission, setPermission] = useState<m.User.Permission | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [successData, setSuccessData] = useState<{
    email: string;
    expiresAt: Date;
    link: string;
  } | null>(null);

  function clearForm() {
    setEmail(null);
    setAccountType(null);
    setPermission(null);
    setFormError(null);
  }

  function clearSuccessData() {
    setSuccessData(null);
  }

  function closeModal() {
    setActiveModal(ACTIVE_MODAL.NONE);
  }

  async function onInviteUser() {
    setFormError(null);

    if (!email || !accountType || !permission) {
      setFormError("Please fill out all fields to submit.");
      return;
    }

    if (!u.string.isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const response = await api.routes.generateInviteCode({
      email: email,
      accountType: accountType,
      permission: permission,
    });

    if (response.didError) {
      addToast({
        message: `Failed to invite user: ${response.data.message}`,
        appearance: toast.APPEARANCE.error,
        duration: "long",
      });
      return;
    }

    refetchAccounts();

    setSuccessData({
      link: getInviteLink(response.data.id, response.data.expiresAt),
      expiresAt: response.data.expiresAt,
      email: email,
    });
    setActiveModal(ACTIVE_MODAL.SUCCESS);
  }

  async function onDeleteInviteCode(id: string) {
    const response = await api.routes.deleteInviteCode(id);

    if (response.didError) {
      addToast({
        message: `Failed to delete invite code: ${response.data.message}`,
        appearance: toast.APPEARANCE.error,
      });
    } else {
      addToast({
        message: "Invite code deleted",
        appearance: toast.APPEARANCE.success,
      });
      refetchAccounts();
    }
  }

  return {
    ACTIVE_MODAL,
    getInviteLink,
    activeModal,
    setActiveModal,
    email,
    setEmail,
    accountType,
    setAccountType,
    permission,
    setPermission,
    formError,
    setFormError,
    successData,
    setSuccessData,
    clearForm,
    clearSuccessData,
    closeModal,
    onInviteUser,
    onDeleteInviteCode,
  };
}
