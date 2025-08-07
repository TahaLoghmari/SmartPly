export function EmailPageEmpty() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <div className="max-w-md space-y-6 p-8 text-center">
        <p className="text-foreground text-2xl font-semibold">
          Welcome to Your Inbox
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Select an email from the list to start reading, or choose a folder
          from the sidebar to browse your messages.
        </p>
      </div>
    </div>
  );
}
