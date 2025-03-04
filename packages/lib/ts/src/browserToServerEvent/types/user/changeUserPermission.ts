import * as m from "../../../models";

export const route = "api/v1/user/:userId/permission";

export const method = "PUT";

export type RequestBody = {
  newPermission: m.User.Permission;
};

export type Response = {
  updatedUser: m.User.DB;
};

export type ErrorData = {
  message: string;
};
