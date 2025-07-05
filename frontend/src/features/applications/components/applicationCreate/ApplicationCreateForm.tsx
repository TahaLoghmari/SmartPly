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
import { useAuthStore } from "#/auth";

export function ApplicationCreateForm() {
  const createApplicationMutation = useCreateApplication();
  const { user } = useAuthStore();
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

  async function onSubmit(credentials: ApplicationCreateRequestDto) {
    console.log(credentials);
    createApplicationMutation.mutate(credentials);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
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
          <Button type="submit">Add Application</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
