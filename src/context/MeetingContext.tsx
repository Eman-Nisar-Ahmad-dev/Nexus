import React, { createContext, useContext, useState } from 'react';
import { Meeting } from '../types';

interface MeetingRequest {
  id: string;
  title: string;
  date: string;
  requesterName: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface MeetingContextType {
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, title: string) => void;
  deleteMeeting: (id: string) => void;
  meetingRequests: MeetingRequest[];
  acceptRequest: (id: string) => void;
  declineRequest: (id: string) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Investor Meeting',
      date: '2026-07-08',
      investorId: 'i1',
      entrepreneurId: 'e1',
      status: 'confirmed',
    },
    {
      id: '2',
      title: 'Pitch Session',
      date: '2026-07-10',
      investorId: 'i2',
      entrepreneurId: 'e1',
      status: 'confirmed',
    },
  ]);

  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([
    {
      id: 'r1',
      title: 'Follow-up Call',
      date: '2026-07-15',
      requesterName: 'Michael Rodriguez',
      status: 'pending',
    },
  ]);

  const addMeeting = (meeting: Meeting) => {
    setMeetings((prev) => [...prev, meeting]);
  };

  const updateMeeting = (id: string, title: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, title } : m))
    );
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const acceptRequest = (id: string) => {
    const request = meetingRequests.find((r) => r.id === id);
    if (!request) return;

    // Move accepted request onto the confirmed calendar
    addMeeting({
      id: `from-request-${id}`,
      title: request.title,
      date: request.date,
      investorId: '',
      entrepreneurId: '',
      status: 'confirmed',
    });

    setMeetingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r))
    );
  };

  const declineRequest = (id: string) => {
    setMeetingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r))
    );
  };

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        meetingRequests,
        acceptRequest,
        declineRequest,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetings = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeetings must be used inside MeetingProvider');
  }
  return context;
};