import { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    autoApproveFDP: false,
    requireApprovalForSeminars: true,
    dataRetentionDays: 365,
    maxFileUploadSize: 10,
  });

  const [profile, setProfile] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@university.edu',
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully');
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Update your admin profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get alerts for system-wide events
                </p>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, systemAlerts: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Approval Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Approval Settings</CardTitle>
            </div>
            <CardDescription>Configure approval workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve FDPs</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve FDP submissions
                </p>
              </div>
              <Switch
                checked={settings.autoApproveFDP}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoApproveFDP: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Approval for Seminars</Label>
                <p className="text-sm text-muted-foreground">
                  Seminars require admin approval before being published
                </p>
              </div>
              <Switch
                checked={settings.requireApprovalForSeminars}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireApprovalForSeminars: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>Manage system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Data Retention (Days)</Label>
              <Input
                id="retention"
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) =>
                  setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) || 365 })
                }
              />
              <p className="text-sm text-muted-foreground">
                How long to keep records before archiving
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="uploadSize">Max File Upload Size (MB)</Label>
              <Input
                id="uploadSize"
                type="number"
                value={settings.maxFileUploadSize}
                onChange={(e) =>
                  setSettings({ ...settings, maxFileUploadSize: parseInt(e.target.value) || 10 })
                }
              />
              <p className="text-sm text-muted-foreground">
                Maximum file size allowed for uploads
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save All Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;

