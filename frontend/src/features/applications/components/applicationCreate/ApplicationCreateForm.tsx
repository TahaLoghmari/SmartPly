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
  type ApplicationCreateRequestDto,
  formSchema,
} from "#/applications";
import { useCurrentUser } from "#/auth";
import { useAddApplicationDialogStore } from "#/dashboard";
import { useRef, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export function ApplicationCreateForm() {
  const setAddApplicationOpen = useAddApplicationDialogStore(
    (s) => s.setAddApplicationOpen,
  );
  const createApplicationMutation = useCreateApplication();
  const { data: user } = useCurrentUser();
  const form = useForm<ApplicationCreateRequestDto>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      resumeId: "",
      coverLetterId: "",
      userId: user?.id,
      companyName: "",
      companyEmail: "",
      position: "",
      link: "",
      notes: "",
      location: "",
      startSalary: 0,
      endSalary: 0,
      contacts: "",
      deadline: undefined,
      jobDescription: "",
      status: "applied",
      type: "onSite",
      jobType: "fullTime",
      level: "junior",
      technologiesUsed: [],
    },
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createApplicationMutation.isError && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [createApplicationMutation.isError]);
  async function onSubmit(credentials: ApplicationCreateRequestDto) {
    createApplicationMutation.mutate(credentials, {
      onSuccess: () => {
        setAddApplicationOpen(false);
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
        {createApplicationMutation.isError && (
          <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
            {createApplicationMutation.error.message}
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
            disabled={createApplicationMutation.isPending}
            className="w-34"
          >
            {createApplicationMutation.isPending ? (
              <Spinner className="h-8 w-auto invert dark:invert-0" />
            ) : (
              "Add Application"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
