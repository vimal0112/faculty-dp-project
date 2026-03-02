import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UpcomingEvent } from '@/types';
import { eventsAPI } from '@/lib/api';

const FacultyEvents = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getUpcomingEvents();
      setEvents(data.map((item: any) => ({
        id: item._id || item.id,
        title: item.title,
        type: item.type,
        date: item.date ? new Date(item.date).toLocaleDateString() : '',
        venue: item.venue,
        description: item.description || '',
        registrationLink: item.registrationLink,
      })));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };
  const getEventColor = (type: string) => {
    switch (type) {
      case 'FDP':
        return 'bg-primary text-primary-foreground';
      case 'Conference':
        return 'bg-accent text-accent-foreground';
      case 'Workshop':
        return 'bg-secondary text-secondary-foreground';
      case 'Seminar':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
        <p className="text-muted-foreground">
          Professional development opportunities and academic events
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No upcoming events</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
          <Card key={event.id} className="hover:shadow-hover transition-all">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getEventColor(event.type)}>{event.type}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
              </div>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.venue}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{event.description}</p>
              
              {event.registrationLink ? (
                <Button className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Register Now
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Registration Closed
                </Button>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyEvents;
