
export function EmailConfirmedPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center sm:rounded-md sm:bg-[#f0f3f5]">
      <div className="bg-background flex w-full flex-col items-center gap-8 p-9 sm:my-20 sm:w-[550px] sm:rounded-lg sm:p-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20"
          viewBox="0 -960 960 960"
        >
          <defs>
            <linearGradient
              id="checkGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6c79e1" />
              <stop offset="100%" stopColor="#7057b0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#checkGradient)"
            d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
          />
        </svg>
        <p className="text-center">
          Your email was verified. You can close this page and continue using
          this application
        </p>
      </div>
    </div>
  );
}
