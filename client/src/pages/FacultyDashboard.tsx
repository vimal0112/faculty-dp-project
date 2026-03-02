import { useEffect, useState } from 'react';
import { Award, Calendar, GraduationCap, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { facultyAPI, eventsAPI } from '@/lib/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [recentFDPs, setRecentFDPs] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, events] = await Promise.all([
        facultyAPI.getDashboard(),
        eventsAPI.getUpcomingEvents(),
      ]);
      
      setStats(dashboardData.stats);
      setRecentFDPs(dashboardData.recentFDPs || []);
      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your portfolio</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total FDPs"
            value={stats?.fdpAttended + stats?.fdpOrganized || 0}
            icon={Award}
            description="Completed & Ongoing"
          />
          <StatCard
            title="Seminars"
            value={stats?.seminars || 0}
            icon={GraduationCap}
            description="Conducted"
          />
          <StatCard
            title="Upcoming Events"
            value={upcomingEvents.length}
            icon={Calendar}
            description="Available for registration"
          />
          <StatCard
            title="ABL Reports"
            value={stats?.abl || 0}
            icon={TrendingUp}
            description="Activity Based Learning"
          />
        </div>
      )}

      {/* Recent FDPs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent FDPs</CardTitle>
              <CardDescription>Your latest Faculty Development Programs</CardDescription>
            </div>
            <Button onClick={() => navigate('/faculty/fdps')}>View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFDPs.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No recent FDPs</div>
            ) : (
              recentFDPs.slice(0, 3).map((fdp: any) => (
                <div
                  key={fdp._id || fdp.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{fdp.title}</h4>
                    <p className="text-sm text-muted-foreground">{fdp.venue}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fdp.duration}
                    </p>
                  </div>
                  <Badge
                    variant={fdp.status === 'approved' ? 'default' : 'secondary'}
                    className="ml-4"
                  >
                    {fdp.status || 'pending'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Register for these professional development opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No upcoming events</div>
            ) : (
              upcomingEvents.slice(0, 4).map((event: any) => (
                <div
                  key={event._id || event.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{event.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{event.venue}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  {event.registrationLink && (
                    <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                        Register Now
                      </a>
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
