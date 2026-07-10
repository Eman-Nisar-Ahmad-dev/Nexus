import React, { useState } from 'react';
import { Joyride, STATUS, Step } from 'react-joyride';
import { HelpCircle } from 'lucide-react';

const tourSteps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to Business Nexus! Let\'s take a quick tour of the newest features.',
    placement: 'center',
  },
  {
    target: '#meeting-calendar-section',
    content: 'Schedule meetings here — click an empty date to add a slot, click an existing one to rename or delete it, and manage meeting requests below the calendar.',
    placement: 'right',
  },
  {
    target: '#tour-video-call',
    content: 'Start a video call with your camera, microphone, and screen sharing controls.',
    placement: 'right',
  },
  {
    target: '#tour-documents',
    content: 'Upload, preview, and e-sign important documents, and track their status.',
    placement: 'right',
  },
  {
    target: '#tour-payments',
    content: 'Manage your wallet, deposit or transfer funds, and fund deals directly from here.',
    placement: 'right',
  },
];

export const TourGuide: React.FC = () => {
  const [run, setRun] = useState(false);

  const startTour = () => setRun(true);
const handleCallback = (data: { status: string }) => {
  const { status } = data;
  if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
    setRun(false);
  }
};

  return (
    <>
      <button
        onClick={startTour}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <HelpCircle size={16} />
        Take a tour
      </button>
<Joyride {...({
  steps: tourSteps,
  run: run,
  continuous: true,
  showSkipButton: true,
  showProgress: true,
  callback: handleCallback,
} as any)} />
    </>
  );
};