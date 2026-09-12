import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useMeeting } from "../context/MeetingContext";
import { API_URL } from "../config";
import StartMeetingModal from "./StartMeetingModal";

const SIDEBAR_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    accent: "#2EB37A",
    path: "/dashboard",
  },
  {
    key: "past",
    label: "Past meetings",
    accent: "#E8B93E",
    path: "/meetings/past",
  },
  {
    key: "employees",
    label: "Employees",
    accent: "#B48CE0",
    path: "/employees",
  },
];

type AppLayoutProps = {
  children: ReactNode | ((isPremium: boolean) => ReactNode);
  activePage?: string;
};

const AppLayout = ({ children, activePage = "Dashboard" }: AppLayoutProps) => {
  const navigate = useNavigate();
  const [showStartModal, setShowStartModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const me = await response.json();
        setIsPremium(me.isPremium);
      }
    };
    fetchMe();
  }, []);

  const handleSignOut = async () => {
    if (activeMeeting) {
      const confirmed = window.confirm(
        "A meeting is in progress. Sign out anyway?",
      );
      if (!confirmed) return;
    }
    try {
      await fetch(`${API_URL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // even if the request fails, still send them back to sign-in
    } finally {
      navigate("/");
    }
  };

  const { activeMeeting } = useMeeting();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "This will permanently delete your account, including all of your meetings and employees. This cannot be undone. Are you sure?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/");
      } else {
        window.alert("Could not delete account. Please try again.");
      }
    } catch {
      window.alert("Could not delete account. Please try again.");
    }
  };

  const confirmNavigation = (path: string) => {
    if (activeMeeting) {
      const confirmed = window.confirm(
        "A meeting is currently in progress. Leaving this page won't stop the meeting, are you sure you want to navigate away?",
      );
      if (!confirmed) return;
    }
    navigate(path);
  };

  return (
    <div
      className="flex flex-col min-h-screen text-[#DCEAE3]"
      style={{ background: "#0A0F0D" }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-5 border-b"
        style={{ borderColor: "rgba(62,207,142,0.18)" }}
      >
        <span className="text-lg font-semibold tracking-widest text-white">
          MeetingWatch
        </span>

        <button
          onClick={() => setShowStartModal(true)}
          className="text-center  rounded-lg py-4 text-lg px-16 font-semibold text-black transition-transform cursor-pointer hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #3ECF8E 0%, #2EB37A 100%)",
            boxShadow: "0 4px 16px -4px rgba(62,207,142,0.4)",
          }}
        >
          + Start new meeting
        </button>

        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "#EEEEEE" }}
        >
          {activePage}
        </span>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside
          className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r px-4 md:px-6 py-6 md:py-8 flex flex-col gap-2"
          style={{ borderColor: "rgba(62,207,142,0.18)" }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3 px-1"
            style={{ color: "#5E7A6F" }}
          >
            Navigate
          </p>

          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => confirmNavigation(item.path)}
              className="group flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer hover:bg-white/5"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.accent }}
              />
              <span className="text-[#DCEAE3] group-hover:text-white transition-colors">
                {item.label}
              </span>
            </button>
          ))}

          <div className="md:flex-1 mt-6 md:mt-0" />

          <button
            onClick={handleDeleteAccount}
            className="rounded-lg px-4 py-3 text-sm font-medium text-left transition-colors cursor-pointer border hover:bg-[#E0574C]/10"
            style={{ borderColor: "rgba(224,87,76,0.4)", color: "#E0574C" }}
          >
            Delete account
          </button>

          <button
            onClick={handleSignOut}
            className="rounded-lg px-4 py-3 text-sm font-medium text-left  text-white cursor-pointer"
            style={{ background: "#E0574C" }}
          >
            Sign out
          </button>
        </aside>

        {/* Page-specific content goes here */}
        <main className="flex-1 w-full px-4 md:px-10 py-6 md:py-10">
          {typeof children === "function" ? children(isPremium) : children}
        </main>
      </div>
      {showStartModal && (
        <StartMeetingModal onClose={() => setShowStartModal(false)} />
      )}
    </div>
  );
};

export default AppLayout;
