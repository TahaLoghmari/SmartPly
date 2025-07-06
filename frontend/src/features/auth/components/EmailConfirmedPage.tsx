export function EmailConfirmedPage() {
  return (
    <div className="from-background via-background to-muted flex min-h-screen w-screen flex-col items-center bg-gradient-to-br sm:rounded-md">
      <div className="bg-card text-card-foreground border-border/50 flex w-full flex-col items-center gap-8 border p-9 shadow-2xl sm:my-20 sm:w-[550px] sm:rounded-lg sm:p-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary h-20 w-20"
          viewBox="0 -960 960 960"
          fill="currentColor"
        >
          <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
        </svg>
        <p className="text-center">
          Your email was verified. You can close this page and continue using
          this application
        </p>
      </div>
    </div>
  );
}
