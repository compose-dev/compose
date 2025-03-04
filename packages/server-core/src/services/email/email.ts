import { m, u } from "@compose/ts";

interface EmailServiceSuccessResponse {
  success: true;
  id: string;
}
interface EmailServiceErrorResponse {
  success: false;
  message: string;
}
type EmailServiceContact = {
  /**
   * The contact's ID.
   */
  id: string;
  /**
   * The contact's email address.
   */
  email: string;
  /**
   * The contact's first name.
   */
  firstName: string | null;
  /**
   * The contact's last name.
   */
  lastName: string | null;
  /**
   * The source the contact was created from.
   */
  source: string | null;
  /**
   * Whether the contact will receive campaign and loops emails.
   */
  subscribed: boolean;
  /**
   * The contact's user group (used to segemnt users when sending emails).
   */
  userGroup: string | null;
  /**
   * A unique user ID (for example, from an external application).
   */
  userId: string | null;
  /**
   * Mailing lists the contact is subscribed to.
   */
  mailingLists: Record<string, true>;
} & Record<string, string | number | boolean | null>;

type EmailServiceCreateContactResponse = Promise<
  EmailServiceSuccessResponse | EmailServiceErrorResponse | undefined
>;
type EmailServiceUpdateContactResponse = Promise<
  EmailServiceSuccessResponse | EmailServiceErrorResponse | undefined
>;
type EmailServiceFindContactResponse = Promise<
  EmailServiceContact[] | undefined
>;

abstract class EmailService {
  constructor() {}

  abstract createContact(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    companyId: string,
    companyName: string,
    accountType: m.User.AccountType,
    permission: m.User.Permission,
    attribution: u.email.Attribution
  ): EmailServiceCreateContactResponse;

  abstract updateContact(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    companyId: string,
    companyName: string,
    accountType: m.User.AccountType,
    permission: m.User.Permission
  ): EmailServiceUpdateContactResponse;

  abstract findContact(email: string): EmailServiceFindContactResponse;

  abstract shutdown(): void;
}

class EmailServiceStub extends EmailService {
  constructor() {
    super();
  }

  async createContact(
    userId: string,
    _email: string,
    _firstName: string,
    _lastName: string,
    _companyId: string,
    _companyName: string,
    _accountType: m.User.AccountType,
    _permission: m.User.Permission,
    _attribution: u.email.Attribution
  ): EmailServiceCreateContactResponse {
    return { success: true, id: userId };
  }

  async updateContact(
    userId: string,
    _email: string,
    _firstName: string,
    _lastName: string,
    _companyId: string,
    _companyName: string,
    _accountType: m.User.AccountType,
    _permission: m.User.Permission
  ): EmailServiceUpdateContactResponse {
    return { success: true, id: userId };
  }

  async findContact(_email: string): EmailServiceFindContactResponse {
    return [];
  }

  // Nothing to shutdown
  shutdown() {
    return;
  }
}

export {
  EmailService,
  EmailServiceStub,
  type EmailServiceCreateContactResponse,
  type EmailServiceUpdateContactResponse,
  type EmailServiceFindContactResponse,
};
