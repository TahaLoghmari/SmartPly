import type {
  CoverLetterCreateResponseDto,
  ResumeCreateResponseDto,
} from "#/documents";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";

export const coverLettersConstant: CoverLetterCreateResponseDto[] = [
  {
    id: "e2b1c2d3-4f5a-6789-b0c1-2d3e4f5a6789",
    userId: "e03f666f-4603-4732-91cd-9e5e9f506e4c",
    name: "Frontend Position Cover Letter",
  },
];

export const columns: ColumnDef<ResumeCreateResponseDto>[] = [
  {
    id: "select",
    header: "",
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Resume Name",
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <FileText className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{name}.pdf</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Edited",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      const formatted = formatDistanceToNow(date, {
        addSuffix: true,
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
          >
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
          >
            <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
          >
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
          </svg>
        </div>
      );
    },
  },
];
