import * as OutputOmittedComponents from "../outputOmittedComponents";

type Id = string;
type Required = boolean;
type Children =
  | OutputOmittedComponents.All
  | readonly OutputOmittedComponents.All[];

export { type Id, type Required, type Children };
