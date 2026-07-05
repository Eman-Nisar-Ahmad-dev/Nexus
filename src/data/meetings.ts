import { Meeting } from '../types';

export const meetings: Meeting[] = [];

export const addMeeting = (meeting: Meeting) => {
  meetings.push(meeting);
};

export const getMeetingsForEntrepreneur = (entrepreneurId: string) => {
  return meetings.filter(
    (meeting) => meeting.entrepreneurId === entrepreneurId
  );
};