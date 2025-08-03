import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/SearchBar";
import {
  useDocumentSearchBarStore,
  COLUMNS,
  useGetUserResumes,
  ResumeUploadButton,
  useSelectedDocumentsStore,
  useBulkDeleteResumes,
} from "#/documents";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Documents() {
  const { data: resumes } = useGetUserResumes();
  const [tab, setTab] = useState("resume");
  const { search, setSearch } = useDocumentSearchBarStore();
  const { selected } = useSelectedDocumentsStore();
  const bulkDeleteResumesMutation = useBulkDeleteResumes();
  const deleteSelectedRows = () => {
    const resumeIds = selected.map((row) => row.original.id);
    bulkDeleteResumesMutation.mutate({ Ids: resumeIds });
  };
  return (
    <div className="flex-1 overflow-auto transition-[width,height,margin,padding] duration-300">
      <div className="flex w-full flex-col gap-6 p-6 px-20">
        <div className="flex items-center justify-between">
          <div className="mb-5 flex flex-col">
            <p className="text-3xl font-bold tracking-tight">My Documents</p>
            <p className="text-muted-foreground mt-1">
              Manage and tailor all of your job search documents here!
            </p>
          </div>
          {tab === "resume" && <ResumeUploadButton />}
        </div>
        <Tabs
          defaultValue="resume"
          className="flex-1 rounded-md"
          value={tab}
          onValueChange={setTab}
        >
          <div className="flex flex-col items-start justify-between gap-x-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <TabsList className="flex gap-x-2">
                <TabsTrigger value="resume">Resumes</TabsTrigger>
                <TabsTrigger value="coverLetter">Cover Letters</TabsTrigger>
              </TabsList>
              {selected.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => deleteSelectedRows()}
                  className="cursor-pointer"
                >
                  {!bulkDeleteResumesMutation.isPending ? (
                    "Delete Selected"
                  ) : (
                    <Spinner className="h-8 w-auto invert dark:invert-0" />
                  )}
                </Button>
              )}
            </div>
            <div className="my-4 flex flex-col-reverse items-center gap-4 sm:max-w-2xl sm:flex-row">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name"
                className="w-sm"
              />
            </div>
          </div>
          <TabsContent value="resume" className="flex flex-col overflow-x-auto">
            <DataTable columns={COLUMNS} data={resumes ?? []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
