import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Check, X } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useMeetings } from '../../context/MeetingContext';

export const MeetingCalendar = () => {
  const {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    meetingRequests,
    acceptRequest,
    declineRequest,
  } = useMeetings();

  const handleDateClick = (info: any) => {
    const title = prompt('Enter Meeting Title (add a new availability slot):');
    if (!title) return;
    addMeeting({
      id: Date.now().toString(),
      title,
      date: info.dateStr,
      investorId: '',
      entrepreneurId: '',
      status: 'confirmed',
    });
  };

  const handleEventClick = (info: any) => {
    const meetingId = info.event.id;
    const currentTitle = info.event.title;

    const choice = prompt(
      `Editing: "${currentTitle}"\n\nType a new title to rename this slot, or type DELETE to remove it, or leave blank and press OK to cancel:`,
      currentTitle
    );

    if (choice === null) return; // cancelled
    if (choice.trim().toUpperCase() === 'DELETE') {
      deleteMeeting(meetingId);
      return;
    }
    if (choice.trim() && choice.trim() !== currentTitle) {
      updateMeeting(meetingId, choice.trim());
    }
  };

  const pendingRequests = meetingRequests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Meeting Calendar</h2>
        </CardHeader>
        <CardBody>
          <p className="text-xs text-gray-500 mb-2">
            Click an empty date to add a slot. Click an existing meeting to rename or delete it.
          </p>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable
            selectable
            events={meetings}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDisplay="block"
            height="auto"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Meeting Requests</h2>
          {pendingRequests.length > 0 && (
            <Badge variant="accent">{pendingRequests.length} pending</Badge>
          )}
        </CardHeader>
        <CardBody>
          {meetingRequests.length === 0 && (
            <p className="text-sm text-gray-500">No meeting requests yet.</p>
          )}

          <div className="space-y-3">
            {meetingRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{req.title}</p>
                  <p className="text-xs text-gray-500">
                    Requested by {req.requesterName} · {req.date}
                  </p>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<X size={16} />}
                      onClick={() => declineRequest(req.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<Check size={16} />}
                      onClick={() => acceptRequest(req.id)}
                    >
                      Accept
                    </Button>
                  </div>
                ) : (
                  <Badge variant={req.status === 'accepted' ? 'success' : 'error'}>
                    {req.status === 'accepted' ? 'Accepted' : 'Declined'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};