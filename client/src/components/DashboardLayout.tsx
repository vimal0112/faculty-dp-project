import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider } from './ui/sidebar';

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6 bg-background">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
