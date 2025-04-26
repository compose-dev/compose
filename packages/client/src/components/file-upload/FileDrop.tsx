import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FileUploadProps } from "./props";
import Icon from "../icon";
import Button from "~/components/button";

const kilobyte = 1024;
const megabyte = kilobyte * 1024;

// This should be aligned with the max packet size that will
// be accepted by the websocket clients in the SDKs and the
// websocket server.
const MAX_FILE_SIZE = megabyte * 10;

const formatFileSize = (
  sizeInBytes: number,
  includeDecimals: boolean = true
): string => {
  if (sizeInBytes < kilobyte) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < megabyte) {
    return `${Math.round(sizeInBytes / kilobyte)} KB`;
  } else {
    const sizeInMB = sizeInBytes / megabyte;
    if (includeDecimals) {
      return `${sizeInMB.toFixed(1)} MB`;
    } else {
      return `${Math.round(sizeInMB)} MB`;
    }
  }
};

function FileDrop(props: FileUploadProps) {
  const accept = useMemo(() => {
    if (props.acceptedFileTypes === null) {
      return {};
    }

    const accepted: Record<string, string[]> = {};

    props.acceptedFileTypes?.forEach((type) => {
      accepted[type] = [];
    });

    return {
      accept: accepted,
    };
  }, [props.acceptedFileTypes]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      props.setValue([...props.value, ...acceptedFiles]);
    },
    [props]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    ...accept,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="flex flex-col space-y-4">
      <div
        className="flex p-8 border-dashed border-brand-neutral rounded-brand border-2 bg-brand-io hover:bg-brand-overlay transition duration-100"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col w-full items-center gap-2">
          <div className="flex justify-center">Add files</div>
          <div className="text-brand-neutral-2 text-sm">
            Maximum file size: {formatFileSize(MAX_FILE_SIZE, false)}
          </div>
        </div>
      </div>
      {props.value.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4">
          {props.value.map((file, idx) => (
            <div
              className="bg-brand-page p-4 rounded-brand border-brand border-brand-neutral w-full justify-between flex items-center"
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div>
                <div className="w-72 truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-brand-neutral-2 text-sm">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  props.setValue(props.value.filter((f) => f !== file));
                }}
              >
                <Icon name="x" size="0.75" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileDrop;
