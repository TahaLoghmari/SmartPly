import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

import {
  ApplicationFormCompanyInformation,
  ApplicationFormJobDetails,
  ApplicationFormDetails,
  ApplicationFormCompensation,
  ApplicationFormAdditionalInformation,
  ApplicationFormTechnologies,
  ApplicationFormDocuments,
  ApplicationsFormDefaultValues,
  ApplicationsFormRequestSchema,
  useApplicationFormMutation,
  useApplicationFormDialogStore,
  type ApplicationFormProps,
  type ApplicationRequestDto,
} from "#/applications";

import { useCurrentUser } from "#/auth";
import { useRef, useEffect } from "react";

export default function ApplicationForm({
  mutationType,
  applicationCard,
}: ApplicationFormProps) {
  const { setOpenDialog } = useApplicationFormDialogStore();
  const { data: user } = useCurrentUser();
  const { mutate, isPending, isError } = useApplicationFormMutation(
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
    credentials.wishListDate = applicationCard?.wishListDate;
    credentials.appliedDate = applicationCard?.appliedDate;
    credentials.interviewDate = applicationCard?.interviewDate;
    credentials.offerDate = applicationCard?.offerDate;
    credentials.rejectedDate = applicationCard?.rejectedDate;
    credentials.ghostedDate = applicationCard?.ghostedDate;
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
        <ApplicationFormCompanyInformation form={form} />
        <ApplicationFormJobDetails form={form} />
        <ApplicationFormDetails form={form} />
        <ApplicationFormCompensation form={form} />
        <ApplicationFormTechnologies form={form} />
        <ApplicationFormAdditionalInformation form={form} />
        <ApplicationFormDocuments form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} className="w-full sm:w-34">
            {isPending ? (
              <Spinner className="h-5 w-5 border-2 invert" />
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
