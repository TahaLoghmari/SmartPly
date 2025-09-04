import { Header } from "#/home";
import ApplicationsImage from "@/assets/Applications.png";
import NotificationsImage from "@/assets/Notifications.png";
import InboxImage from "@/assets/Inbox.png";
import JobInboxImage from "@/assets/Job Inbox.png";
import DocumentsImage from "@/assets/Documents.png";
import { ChevronRight } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-y-auto">
      <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
        <Header />
        <div className="mt-16 mb-24">
          <div className="flex flex-col justify-between gap-14 lg:flex-row">
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <p className="text-xs font-bold">AI JOB APPLICATION TRACKER</p>
              <p className="text-center text-[38px] font-extrabold lg:text-start xl:text-[50px]">
                All your job applications in{" "}
                <span className="bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
                  one place
                </span>
              </p>
              <p className="text-[16px] font-semibold text-gray-700">
                Automatically track your applications from start to finish on
                one simple platform.
              </p>
              <button className="mt-8 flex items-center gap-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 p-4 font-bold text-white">
                START NOW FOR FREE <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <img
              className="h-auto w-full flex-1 rounded-lg shadow-2xl lg:w-56"
              src={ApplicationsImage}
              alt="Screenshot of the SmartPly application tracking dashboard"
            />
          </div>
          <div className="mt-32 flex flex-col items-center justify-between gap-14 lg:flex-row">
            <img
              className="h-auto w-full flex-1 rounded-lg shadow-2xl lg:w-56"
              src={NotificationsImage}
              alt="Screenshot of the SmartPly Notifications"
            />
            <div className="flex-1">
              <p className="text-[27px] font-extrabold xl:text-[32px]">
                Secure Gmail sync
              </p>
              <p className="text-[16px] text-gray-700">
                SmartPly is{" "}
                <span className="font-bold">
                  certified and approved by Google
                </span>{" "}
                to work with your Gmail account.
              </p>
              <p className="mt-4 text-[16px] text-gray-700">
                So you can trust us to track all your job applications,
                risk-free.
              </p>
            </div>
          </div>
          <div className="mt-32 flex flex-col items-center justify-between gap-14 lg:flex-row">
            <div className="flex-1">
              <p className="text-[27px] font-extrabold xl:text-[32px]">
                From Inbox Chaos to Clarity
              </p>
              <p className="text-[16px] text-gray-700">
                Our AI automatically scans your inbox to find every job-related
                email, from application confirmations to interview requests.
              </p>
              <p className="mt-4 text-[16px] text-gray-700">
                It then organizes them into a dedicated Job Inbox, so you never
                miss an important update and can focus on what matters most.
              </p>
            </div>
            <div className="flex w-full flex-1 flex-col gap-2 lg:w-56">
              <img
                className="h-auto w-full flex-1 rounded-lg shadow-2xl"
                src={InboxImage}
                alt="Screenshot of the SmartPly Inbox"
              />
              <img
                className="h-auto w-full flex-1 rounded-lg shadow-2xl"
                src={JobInboxImage}
                alt="Screenshot of the SmartPly Job Inbox"
              />
            </div>
          </div>
          <div className="mt-32 flex flex-col items-center justify-between gap-14 lg:flex-row">
            <img
              className="h-auto w-full flex-1 rounded-lg shadow-2xl lg:w-56"
              src={DocumentsImage}
              alt="Screenshot of the SmartPly Documents"
            />
            <div className="flex-1">
              <p className="text-[32px] font-extrabold">
                Centralize Your Career Documents
              </p>
              <p className="text-[16px] text-gray-700">
                Securely store and manage all your career documents, including
                resumes and cover letters, all in one place.
              </p>
              <p className="mt-4 text-[16px] text-gray-700">
                Quickly attach the right documents to your applications without
                the hassle of searching for files. Stay organized and always be
                ready for your next opportunity.
              </p>
            </div>
          </div>
          <div className="mt-32 flex flex-col items-center gap-8">
            <p className="text-[32px] font-extrabold">How it works</p>
            <div className="flex w-full justify-center">
              <div className="grid w-[95%] grid-cols-1 gap-28 lg:grid-cols-3">
                <div className="flex flex-col">
                  <div className="flex w-[100px] flex-col items-center">
                    <p className="z-10 bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-[48px] font-extrabold text-transparent">
                      1
                    </p>
                    <div className="z-0 -mt-9 h-[50px] w-[100px] rounded-lg bg-gray-200/30"></div>
                  </div>
                  <p className="mt-6 text-[24px] font-extrabold">
                    Connect your Gmail account
                  </p>
                  <p className="text-[16px] text-gray-700">
                    Follow the prompt to link your Gmail in a few clicks.
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex w-[100px] flex-col items-center">
                    <p className="z-10 bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-[48px] font-extrabold text-transparent">
                      2
                    </p>
                    <div className="z-0 -mt-9 h-[50px] w-[100px] rounded-lg bg-gray-200/30"></div>
                  </div>
                  <p className="mt-6 text-[24px] font-extrabold">
                    Sync your applications
                  </p>
                  <p className="text-[16px] text-gray-700">
                    We'll add any recent applications to your job tracker and
                    update the status of existing ones.
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex w-[100px] flex-col items-center">
                    <p className="z-10 bg-gradient-to-b from-gray-900 to-gray-400 bg-clip-text text-[48px] font-extrabold text-transparent">
                      3
                    </p>
                    <div className="z-0 -mt-9 h-[50px] w-[100px] rounded-lg bg-gray-200/30"></div>
                  </div>
                  <p className="mt-6 text-[24px] font-extrabold">
                    Enjoy your new job tracker
                  </p>
                  <p className="text-[16px] text-gray-700">
                    That's it! Your applications will auto-sync from now on.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-32 flex flex-col items-center gap-8">
            <p className="text-[32px] font-extrabold">Why we built SmartPly</p>
            <div className="flex w-full xl:justify-center">
              <p className="text-[16px] text-gray-700 xl:w-[40%] xl:text-center">
                Tracking all your job applications can feel like a full-time
                job. You need to read through unnecessarily long emails, track
                your progress, set follow up reminders, etc. It's a drag. So we
                thought: Why can't we track our entire job search process in one
                place? And now we can, with SmartPly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
