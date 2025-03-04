import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.FILE_TRANSFER;
  metadata: {
    name: string;
    download: boolean;
    id: string;
    executionId: string;
  };
  fileContents: Blob;
}
