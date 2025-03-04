type FileUploadProps = {
  value: File[];
  setValue: (value: File[]) => void;
  acceptedFileTypes: string[] | null;
  label: string | null;
  description: string | null;
  hasError?: boolean;
  errorMessage?: string | null;
};

export { type FileUploadProps };
