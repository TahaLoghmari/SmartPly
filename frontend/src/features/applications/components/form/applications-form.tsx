import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ApplicationsFormCompanyInformation,
  ApplicationsFormJobDetails,
  ApplicationsFormDetails,
  ApplicationsFormCompensation,
  ApplicationsFormAdditionalInformation,
  ApplicationsFormTechnologies,
  ApplicationsFormDocuments,
  useCreateApplication,
  useEditApplication,
  type ApplicationRequestDto,
  type ApplicationFormProps,
  ApplicationRequestformSchema,
  useManageApplicationStore,
  statusToValue,
  steps,
  statusToDateKey,
} from "#/applications";
import { useCurrentUser } from "#/auth";
import { useRef, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { handleApiError } from "@/index";

export function ApplicationsForm({
  mutationType,
  applicationCard,
}: ApplicationFormProps) {
  const setApplicationFormOpen = useManageApplicationStore(
    (s) => s.setOpenDialog,
  );
  const allSteps = [...steps, "Offer", "Ghosted", "Rejected"];
  const { data: user } = useCurrentUser();
  const createMutation = useCreateApplication();
  const editMutation = useEditApplication();
  const isError =
    mutationType === "create" ? createMutation.isError : editMutation.isError;
  const isPending =
    mutationType === "create"
      ? createMutation.isPending
      : editMutation.isPending;

  const form = useForm<ApplicationRequestDto>({
    resolver: zodResolver(ApplicationRequestformSchema),
    mode: "onChange",
    defaultValues: {
      resumeId: applicationCard?.resumeId || "",
      coverLetterId: applicationCard?.coverLetterId || "",
      userId: user?.id,
      companyName: applicationCard?.companyName || "",
      companyEmail: applicationCard?.companyEmail || "",
      position: applicationCard?.position || "",
      link: applicationCard?.link || "",
      notes: applicationCard?.notes || "",
      location: applicationCard?.location || "",
      jobDescription: applicationCard?.jobDescription || "",
      isLiked: false,
      startSalary: applicationCard?.startSalary || undefined,
      endSalary: applicationCard?.endSalary || undefined,
      deadline: applicationCard?.deadline || undefined,
      wishListDate: applicationCard?.wishListDate || undefined,
      appliedDate: applicationCard?.appliedDate || undefined,
      interviewDate: applicationCard?.interviewDate || undefined,
      offerDate: applicationCard?.offerDate || undefined,
      rejectedDate: applicationCard?.rejectedDate || undefined,
      ghostedDate: applicationCard?.ghostedDate || undefined,
      status: applicationCard?.status || "applied",
      type: applicationCard?.type || "onSite",
      jobType: applicationCard?.jobType || "fullTime",
      level: applicationCard?.level || "junior",
      technologiesUsed: applicationCard?.technologiesUsed || [],
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (isError && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isError]);
  async function onSubmit(credentials: ApplicationRequestDto) {
    allSteps.map((step) => {
      const step_lowerCase = step[0].toLowerCase() + step.slice(1);

      if (
        statusToValue[step] <=
        statusToValue[
          credentials.status[0].toUpperCase() + credentials.status.slice(1)
        ]
      ) {
        (credentials as any)[statusToDateKey[step_lowerCase]] = (
          credentials as any
        )[statusToDateKey[step_lowerCase]]
          ? (credentials as any)[statusToDateKey[step_lowerCase]]
          : new Date().toISOString();
      } else (credentials as any)[statusToDateKey[step_lowerCase]] = null;
    });
    if (mutationType === "create") {
      createMutation.mutate(credentials, {
        onSuccess: () => setApplicationFormOpen(false),
        onError: (error) => handleApiError(error),
      });
    } else {
      editMutation.mutate(
        { id: applicationCard.id, credentials },
        {
          onSuccess: () => setApplicationFormOpen(false),
          onError: (error) => handleApiError(error),
        },
      );
    }
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
