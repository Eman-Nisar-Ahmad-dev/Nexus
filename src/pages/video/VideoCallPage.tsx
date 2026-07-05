import React, { useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Phone, ScreenShare } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const VideoCallPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

const startCall = async () => {
  setError(null);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;
    cameraStreamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    setInCall(true);
    setVideoEnabled(true);
    setAudioEnabled(true);
  } catch (err) {
    setError('Could not access camera/microphone. Please allow permissions.');
  }
};
const endCall = () => {
  streamRef.current?.getTracks().forEach(track => track.stop());
  cameraStreamRef.current?.getTracks().forEach(track => track.stop());
  streamRef.current = null;
  cameraStreamRef.current = null;
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
  setInCall(false);
  setIsScreenSharing(false);
};
  const toggleVideo = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    }
  };

  const toggleAudio = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
    }
  };

const toggleScreenShare = async () => {
  if (!isScreenSharing) {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // When user clicks the browser's built-in "Stop sharing" button
      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      streamRef.current = screenStream;
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      setIsScreenSharing(true);
      setVideoEnabled(true);
    } catch (err) {
      setError('Could not start screen sharing.');
    }
  } else {
    stopScreenShare();
  }
};

const stopScreenShare = () => {
  streamRef.current?.getVideoTracks().forEach(track => track.stop());

  // Switch back to camera feed
  streamRef.current = cameraStreamRef.current;
  if (videoRef.current && cameraStreamRef.current) {
    videoRef.current.srcObject = cameraStreamRef.current;
  }
  setIsScreenSharing(false);
};

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
        <p className="text-gray-600">Connect face-to-face with investors and entrepreneurs</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            {inCall ? 'Call in progress' : 'Ready to start a call'}
          </h2>
        </CardHeader>
        <CardBody>
          <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
     <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  className="w-full h-full object-cover"
  style={{ display: inCall && videoEnabled ? 'block' : 'none' }}
/>

{!inCall && (
  <div className="text-gray-400 text-center">
    <Video size={48} className="mx-auto mb-2 opacity-50" />
    <p>No active call</p>
  </div>
)}
          </div>

          {error && (
            <p className="text-error-600 text-sm mt-3">{error}</p>
          )}

          <div className="flex items-center justify-center gap-3 mt-6">
            {!inCall ? (
              <Button leftIcon={<Phone size={18} />} onClick={startCall}>
                Start Call
              </Button>
            ) : (
              <>
                <Button
                  variant={audioEnabled ? 'outline' : 'secondary'}
                  className="p-3"
                  aria-label="Toggle microphone"
                  onClick={toggleAudio}
                >
                  {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                </Button>

                <Button
                  variant={videoEnabled ? 'outline' : 'secondary'}
                  className="p-3"
                  aria-label="Toggle camera"
                  onClick={toggleVideo}
                >
                  {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                </Button>

<Button
  variant={isScreenSharing ? 'secondary' : 'outline'}
  className="p-3"
  aria-label="Share screen"
  onClick={toggleScreenShare}
  title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
>
  <ScreenShare size={18} />
</Button>

                <Button
                  variant="secondary"
                  className="p-3 bg-error-600 hover:bg-error-700 text-white"
                  aria-label="End call"
                  onClick={endCall}
                  leftIcon={<PhoneOff size={18} />}
                >
                  End Call
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};