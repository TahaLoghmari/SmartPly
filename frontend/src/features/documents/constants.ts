import type {
  CoverLetterCreateResponseDto,
  ResumeCreateResponseDto,
} from "#/documents";
import { type ColumnDef } from "@tanstack/react-table";

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
    cell: () => null, // or your checkbox/select logic
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name", // The accessorKey should be the exact property name from your data object (ResumeCreateResponseDto), and the table will display that property's value in the column.
    header: "Resume Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Edited",
  },
  {
    accessorKey: "actions",
    header: "",
  },
];
