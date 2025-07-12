import { Company, Environment, ExternalAppUser, User } from "../../models";

export type RequestBody = null;

export interface SuccessResponseBody {
  company: Company.DB;
  user: User.DB & { isExternal: boolean };
  environments: (Environment.ApiAndDecryptableKeyOmittedDB & {
    isOnline: boolean;
    key: string | null;
    externalAppUsers: ExternalAppUser.DB[];
  })[];
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;

export const route = "api/v1/initialize";
