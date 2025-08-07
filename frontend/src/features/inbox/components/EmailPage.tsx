import { useParams } from "react-router-dom";
import { useRef } from "react";
import {
  formatEmailDate,
  getEmailBody,
  getHeader,
  getSenderName,
  useGetUserEmail,
} from "#/inbox";
import { Spinner } from "@/components/ui/spinner";

export function EmailPage() {
  const { id } = useParams<{ id: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: email, isLoading, isError } = useGetUserEmail({ id: id! });

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );
  }

  if (isError || !email) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        <p className="text-primary text-4xl font-medium">An Error Occured</p>
        <p className="text-sm">Please refresh the page</p>
      </div>
    );
  }

  const headers = email.payload?.headers;
  const fromRaw = getHeader(headers, "From");
  const from = getSenderName(fromRaw);
  const subject = getHeader(headers, "Subject");
  const dateRaw = getHeader(headers, "Date");
  const date = formatEmailDate(dateRaw);
  const bodyHtml = getEmailBody(email.payload);

  // Enhanced iframe content with better image handling
  const iframeContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;">
      <style>
        body {
          margin: 0;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #374151;
          background-color: white;
        }
        img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
        img[src=""], img:not([src]) {
          display: none !important;
        }
        table {
          max-width: 100%;
          border-collapse: collapse;
        }
        a {
          color: #3b82f6;
          text-decoration: underline;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      ${bodyHtml}
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Fix all images
          document.querySelectorAll('img').forEach(function(img) {
            // Handle broken images
            img.onerror = function() {
              this.style.display = 'none';
            };
            
            // Force reload images with proxy URLs
            if (img.src && img.src.includes('googleusercontent.com')) {
              const originalSrc = img.src;
              img.src = '';
              setTimeout(() => {
                img.src = originalSrc;
              }, 100);
            }
            
            // Handle images with data-src (lazy loading)
            if (img.dataset.src && !img.src) {
              img.src = img.dataset.src;
            }
            
            // Handle images with srcset
            if (img.srcset && !img.src) {
              const firstSrc = img.srcset.split(',')[0].trim().split(' ')[0];
              img.src = firstSrc;
            }
          });
          
          // Handle background images in divs/tables
          document.querySelectorAll('[style*="background-image"]').forEach(function(el) {
            const style = el.getAttribute('style');
            if (style && style.includes('background-image')) {
              const match = style.match(/background-image:\s*url\(['"]?([^'"\\)]+)['"]?\)/);
              if (match) {
                const imgUrl = match[1];
                // Create a test image to check if URL is valid
                const testImg = new Image();
                testImg.onerror = function() {
                  el.style.backgroundImage = 'none';
                };
                testImg.src = imgUrl;
              }
            }
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <div className="max-w-full flex-1 overflow-y-auto">
      <iframe
        ref={iframeRef}
        srcDoc={iframeContent}
        className="h-full w-full border-0"
        title="Email content"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
