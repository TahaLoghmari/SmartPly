import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CompanyInformation,
  JobDetails,
  ApplicationDetails,
  Compensation,
  AdditionalInformation,
  TechnologiesUsedFormField,
  Documents,
  useCreateApplication,
  useEditApplication,
  type ApplicationRequestDto,
  type ApplicationFormProps,
  formSchema,
} from "#/applications";
import { useCurrentUser } from "#/auth";
import { useDialogStore } from "#/dashboard";
import { useRef, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ApplicationForm({
  mutationType,
  applicationCard,
}: ApplicationFormProps) {
  const setApplicationFormOpen = useDialogStore((s) => s.setOpenDialog);
  const { data: user } = useCurrentUser();
  const manageApplicationMutation =
    mutationType === "create"
      ? useCreateApplication()
      : useEditApplication({ id: applicationCard.id });

  const form = useForm<ApplicationRequestDto>({
    resolver: zodResolver(formSchema),
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
      startSalary: applicationCard?.startSalary || 0,
      endSalary: applicationCard?.endSalary || 0,
      deadline: applicationCard?.deadline || undefined,
      jobDescription: applicationCard?.jobDescription || "",
      status: applicationCard?.status || "applied",
      type: applicationCard?.type || "onSite",
      jobType: applicationCard?.jobType || "fullTime",
      level: applicationCard?.level || "junior",
      technologiesUsed: applicationCard?.technologiesUsed || [],
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (manageApplicationMutation.isError && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [manageApplicationMutation.isError]);
  async function onSubmit(credentials: ApplicationRequestDto) {
    manageApplicationMutation.mutate(credentials, {
      onSuccess: () => {
        setApplicationFormOpen(false);
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
        ref={formRef}
      >
        {manageApplicationMutation.isError && (
          <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
            {manageApplicationMutation.error.message}
          </div>
        )}
        <CompanyInformation form={form} />
        <JobDetails form={form} />
        <ApplicationDetails form={form} />
        <Compensation form={form} />
        <TechnologiesUsedFormField form={form} />
        <AdditionalInformation form={form} />
        <Documents form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={manageApplicationMutation.isPending}
            className="w-34"
          >
            {manageApplicationMutation.isPending ? (
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
