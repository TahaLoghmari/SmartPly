import { useCreateApplication, useEditApplication } from "#/applications";
import { handleApiError } from "@/hooks";

export function useApplicationFormMutation(
  type: "create" | "edit",
  editId?: string,
) {
  const create = useCreateApplication();
  const edit = useEditApplication();

  const isPending = type === "create" ? create.isPending : edit.isPending;
  const isError = type === "create" ? create.isError : edit.isError;

  const mutate = (
    credentials: any,
    {
      onSuccess,
    }: {
      onSuccess: () => void;
    },
  ) => {
    if (type === "create") {
      create.mutate(credentials, {
        onSuccess,
        onError: (error) => handleApiError({ apiError: error }),
      });
    } else {
      console.log(credentials);
      edit.mutate(
        { id: editId!, data: credentials },
        { onSuccess, onError: (error) => handleApiError({ apiError: error }) },
      );
    }
  };

  return { mutate, isPending, isError };
}
