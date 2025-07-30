import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

import {
  ApplicationsFormCompanyInformation,
  ApplicationsFormJobDetails,
  ApplicationsFormDetails,
  ApplicationsFormCompensation,
  ApplicationsFormAdditionalInformation,
  ApplicationsFormTechnologies,
  ApplicationsFormDocuments,
  ApplicationsFormHandleStatusChange,
  ApplicationsFormDefaultValues,
  ApplicationsFormRequestSchema,
  useManageApplicationStore,
  type ApplicationFormProps,
  type ApplicationRequestDto,
  useApplicationsFormMutation,
} from "#/applications";

import { useCurrentUser } from "#/auth";
import { useRef, useEffect } from "react";

export function ApplicationsForm({
  mutationType,
  applicationCard,
}: ApplicationFormProps) {
  const { setOpenDialog } = useManageApplicationStore();
  const { data: user } = useCurrentUser();
  const { mutate, isPending, isError } = useApplicationsFormMutation(
    mutationType,
    applicationCard?.id,
  );

  const form = useForm<ApplicationRequestDto>({
    resolver: zodResolver(ApplicationsFormRequestSchema),
    mode: "onChange",
    defaultValues: ApplicationsFormDefaultValues(applicationCard, user!.id),
  });

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (isError && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isError]);

  async function onSubmit(credentials: ApplicationRequestDto) {
    if (applicationCard)
      ApplicationsFormHandleStatusChange({ credentials, applicationCard });
    mutate(credentials, {
      onSuccess: () => setOpenDialog(false),
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
        ref={formRef}
      >
        <ApplicationsFormCompanyInformation form={form} />
        <ApplicationsFormJobDetails form={form} />
        <ApplicationsFormDetails form={form} />
        <ApplicationsFormCompensation form={form} />
        <ApplicationsFormTechnologies form={form} />
        <ApplicationsFormAdditionalInformation form={form} />
        <ApplicationsFormDocuments form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} className="w-34">
            {isPending ? (
              <Spinner className="h-8 w-auto invert dark:invert-0" />
            ) : mutationType === "create" ? (
              "Add Application"
            ) : (
              "Edit Application"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
