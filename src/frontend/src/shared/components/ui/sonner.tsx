import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "#7057b0",
          "--success-text": "#ffffff",
          "--success-border": "#7057b0",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--success-bg)",
          color: "var(--success-text)",
          border: "1px solid var(--success-border)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
