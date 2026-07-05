import React, { createContext, useContext, useState } from 'react';
import { Meeting } from '../types';

interface MeetingContextType {
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
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

  const addMeeting = (meeting: Meeting) => {
    console.log('Adding:', meeting);

    setMeetings((prev) => {
      const updated = [...prev, meeting];
      console.log('Meetings:', updated);
      return updated;
    });
  };

  return (
    <MeetingContext.Provider value={{ meetings, addMeeting }}>
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