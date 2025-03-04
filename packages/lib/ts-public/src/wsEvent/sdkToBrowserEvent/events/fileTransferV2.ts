import { type BaseData, TYPE } from "../eventType";

export interface Data extends BaseData {
  type: typeof TYPE.FILE_TRANSFER_V2;
  metadata: {
    name: string;
    download: boolean;
    id: string;
  };
  fileContents: Blob;
}
