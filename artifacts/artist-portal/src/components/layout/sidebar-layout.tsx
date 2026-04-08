import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import { LayoutDashboard, UserCircle, Calendar, LogOut, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@assets/grok_image_1775622274401_1775622404806.jpg";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/events", label: "Browse Gigs", icon: Ticket },
    { href: "/my-events", label: "My Lineup", icon: Calendar },
    { href: "/profile", label: "Artist Profile", icon: UserCircle },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center">
            <img src={logo} alt="Wheelhouse Tattoo Co." className="h-10 w-10 object-contain" />
          </Link>
          <div className="mt-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Artist Portal
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + '/');
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-sidebar/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img 
              src={user?.imageUrl || "https://api.dicebear.com/7.x/initials/svg?seed=" + user?.fullName} 
              alt={user?.fullName || "User"} 
              className="w-8 h-8 rounded-full border border-border"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate text-sidebar-foreground">{user?.fullName}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground" 
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-5xl mx-auto p-6 md:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}