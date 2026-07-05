import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { useMeetings } from '../../context/MeetingContext';

export const MeetingCalendar = () => {
  const { meetings, addMeeting } = useMeetings();

  const handleDateClick = (info: any) => {
    const title = prompt('Enter Meeting Title');

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

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">
          Meeting Calendar
        </h2>
      </CardHeader>

      <CardBody>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable
          selectable
          events={meetings}
          dateClick={handleDateClick}
          eventDisplay="block"
          height="auto"
        />
      </CardBody>
    </Card>
  );
};