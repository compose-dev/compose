import * as m from "../../../models";

export const route = "api/v1/billing/details";

export const method = "GET";

export type RequestBody = null;

export type Response = {
  company: m.Company.DB;
  standardSeats: number;
  externalSeats: number;
  standardSeatsUsed: number;
  externalSeatsUsed: number;
  FREE_UNLIMITED_USAGE: boolean;
  allowInvitingStandardUsers: boolean;
  allowInvitingExternalUsers: boolean;
};

export type ErrorData = {
  message: string;
};
