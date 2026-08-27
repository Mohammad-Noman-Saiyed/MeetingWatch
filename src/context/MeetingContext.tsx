import { createContext, useContext, useState, type ReactNode } from "react";

type ActiveMeeting = {
  id: number;
  title: string;
  startedAt: string;
  attendeeIds: number[];
};

type MeetingContextValue = {
  activeMeeting: ActiveMeeting | null;
  setActiveMeeting: (meeting: ActiveMeeting | null) => void;
};

const MeetingContext = createContext<MeetingContextValue | undefined>(
  undefined,
);

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(
    null,
  );

  return (
    <MeetingContext.Provider value={{ activeMeeting, setActiveMeeting }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeeting must be used within a MeetingProvider");
  }
  return context;
};
