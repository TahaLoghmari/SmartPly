import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/SearchBar";
import {
  useResumeSearchbarStore,
  RESUME_COLUMNS,
  useGetUserResumes,
  ResumeUploadButton,
  useSelectedResumesStore,
  useBulkDeleteResumes,
  ResumeBulkDeleteButton,
} from "#/resumes";
import {
  COVER_LETTER_COLUMNS,
  CoverLetterBulkDeleteButton,
  CoverLetterUploadButton,
  useBulkDeleteCoverLetters,
  useCoverLetterSearchbarStore,
  useGetUserCoverLetters,
  useSelectedCoverLettersStore,
} from "#/coverLetters";
import { DataTable } from "@/components/DataTable";
import { useState } from "react";

export default function Documents() {
  const [tab, setTab] = useState("resume");

  const { data: resumes } = useGetUserResumes();
  const { search: resumeSearch, setSearch: setResumeSearch } =
    useResumeSearchbarStore();
  const {
    selected: selectedResumes,
    setSelected: setSelectedResumes,
    clearSelected: clearSelectedResumes,
  } = useSelectedResumesStore();
  const bulkDeleteResumesMutation = useBulkDeleteResumes();

  const { data: coverLetters } = useGetUserCoverLetters();
  const { search: coverLetterSearch, setSearch: setCoverLetterSearch } =
    useCoverLetterSearchbarStore();
  const {
    selected: selectedCoverLetters,
    setSelected: setSelectedCoverLetters,
    clearSelected: clearSelectedCoverLetters,
  } = useSelectedCoverLettersStore();
  const bulkDeleteCoverLettersMutation = useBulkDeleteCoverLetters();

  const handleBulkDeleteResumes = () => {
    const Ids = selectedResumes.map((row: any) => row.original.id);
    bulkDeleteResumesMutation.mutate({ Ids });
    clearSelectedResumes();
  };
  const handleBulkDeleteCoverLetters = () => {
    const Ids = selectedCoverLetters.map((row: any) => row.original.id);
    bulkDeleteCoverLettersMutation.mutate({ Ids });
    clearSelectedCoverLetters();
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
          {tab === "coverLetter" && <CoverLetterUploadButton />}
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
              <ResumeBulkDeleteButton
                isLoading={bulkDeleteResumesMutation.isPending}
                onClick={handleBulkDeleteResumes}
                show={tab === "resume" && selectedResumes.length > 0}
              />
              <CoverLetterBulkDeleteButton
                isLoading={bulkDeleteCoverLettersMutation.isPending}
                onClick={handleBulkDeleteCoverLetters}
                show={tab === "coverLetter" && selectedCoverLetters.length > 0}
              />
            </div>
            <div className="my-4 flex flex-col-reverse items-center gap-4 sm:max-w-2xl sm:flex-row">
              <SearchBar
                value={tab === "resume" ? resumeSearch : coverLetterSearch}
                onChange={
                  tab === "resume" ? setResumeSearch : setCoverLetterSearch
                }
                placeholder="Search by name"
                className="w-sm"
              />
            </div>
          </div>
          <TabsContent value="resume" className="flex flex-col overflow-x-auto">
            <DataTable
              columns={RESUME_COLUMNS}
              data={resumes ?? []}
              setSelected={setSelectedResumes}
            />
          </TabsContent>
          <TabsContent
            value="coverLetter"
            className="flex flex-col overflow-x-auto"
          >
            <DataTable
              columns={COVER_LETTER_COLUMNS}
              data={coverLetters ?? []}
              setSelected={setSelectedCoverLetters}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
