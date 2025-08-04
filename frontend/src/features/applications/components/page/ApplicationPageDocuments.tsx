import {
  ApplicationPageDocumentsCoverLetter,
  ApplicationPageDocumentsResume,
  useApplicationChangingCoverLetterStore,
  useApplicationChangingResumeStore,
  type ApplicationCardProps,
} from "#/applications";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function ApplicationPageDocuments({
  applicationCard,
}: ApplicationCardProps) {
  const [tab, setTab] = useState("resume");
  const { setIsChangingResume } = useApplicationChangingResumeStore();
  const { setIsChangingCoverLetter } = useApplicationChangingCoverLetterStore();
  return (
    <div className="flex flex-1 flex-col gap-6 px-8 py-6">
      <p className="text-lg font-medium">Documents</p>
      <p className="text-muted-foreground text-sm">
        Add {tab === "resume" ? "resume" : "cover letter"} used to apply
      </p>
      <Button
        variant="outline"
        className="w-50"
        onClick={() => {
          tab === "resume"
            ? setIsChangingResume(true)
            : setIsChangingCoverLetter(true);
        }}
      >
        Link existing {tab === "resume" ? "resume" : "cover letter"}
      </Button>
      <Tabs
        defaultValue="resume"
        className="flex-1 rounded-md border-t pt-4"
        value={tab}
        onValueChange={setTab}
      >
        <TabsList>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
        </TabsList>
        <TabsContent value="resume" className="mt-4 flex flex-1 flex-col gap-6">
          <ApplicationPageDocumentsResume applicationCard={applicationCard} />
        </TabsContent>
        <TabsContent
          value="coverLetter"
          className="mt-4 flex flex-1 flex-col gap-6"
        >
          <ApplicationPageDocumentsCoverLetter
            applicationCard={applicationCard}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
