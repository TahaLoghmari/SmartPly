import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";
import { useDocumentSearchBarStore } from "#/documents";
import { FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function Documents() {
  const { search, setSearch } = useDocumentSearchBarStore();
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto p-6 transition-[width,height,margin,padding] duration-300">
      <Tabs defaultValue="resume" className="flex-1 rounded-md">
        <div className="flex flex-col items-start justify-between gap-x-4 sm:flex-row sm:items-center">
          <TabsList className="flex gap-x-2">
            <TabsTrigger value="resume">Resumes</TabsTrigger>
            <TabsTrigger value="coverLetter">Cover Letters</TabsTrigger>
          </TabsList>
          <div className="my-4 flex flex-col-reverse items-center gap-4 sm:max-w-2xl sm:flex-row">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
              </SelectContent>
            </Select>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by name"
            />
          </div>
        </div>
        <TabsContent value="resume" className="flex flex-col overflow-x-auto">
          
        </TabsContent>
      </Tabs>
    </div>
  );
}
