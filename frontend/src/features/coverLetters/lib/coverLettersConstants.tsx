import type { ColumnDef } from "@tanstack/react-table";
import type { CoverLetterResponseDto } from "#/coverLetters";
import { FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

export const CoverLetter_COLUMNS: ColumnDef<CoverLetterResponseDto>[] = [
  {
    id: "select",
    header: "",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-primary ml-2 cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "CoverLetter Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <FileText className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}.pdf</p>
            <p className="text-muted-foreground text-sm">
              {row.original.size} MB
            </p>
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
      return <div className="text-muted-foreground">{formatted}</div>;
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
      return <div className="text-muted-foreground">{formatted}</div>;
    },
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => {
      return <CoverLetterActions {...row.original} />;
    },
  },
];
