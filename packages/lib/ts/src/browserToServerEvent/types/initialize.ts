import { Environment, ExternalAppUser, User } from "../../models";

export type RequestBody = null;

export interface Response {
  user: User.DB & { isExternal: boolean };
  environments: (Environment.ApiAndDecryptableKeyOmittedDB & {
    isOnline: boolean;
    key: string | null;
    externalAppUsers: ExternalAppUser.DB[];
  })[];
}

export const route = "api/v1/initialize";
