import {
  ApplicationsPageDocumentsResume,
  type ApplicationCardProps,
} from "#/applications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ApplicationsPageDocuments({
  applicationCard,
}: ApplicationCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-8 py-6">
      <p className="text-lg font-medium">Documents</p>
      <Tabs defaultValue="resume" className="flex-1 rounded-md">
        <TabsList>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
        </TabsList>
        <TabsContent value="resume" className="mt-4 flex flex-col gap-6 flex-1">
          <ApplicationsPageDocumentsResume applicationCard={applicationCard} />
        </TabsContent>
        <TabsContent value="coverLetter">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
