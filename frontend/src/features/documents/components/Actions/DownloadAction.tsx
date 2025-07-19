const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function DownloadAction({ id }: { id: string }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}/resumes/${id}/download`;
    link.download = ""; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
      className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
      onClick={handleDownload}
    >
      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
    </svg>
  );
}
