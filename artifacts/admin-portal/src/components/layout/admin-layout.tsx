import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Inbox, 
  CalendarDays, 
  Users, 
  Truck, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@assets/grok_image_1775622274401_1775622404806.jpg";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/inquiries", label: "Inquiries", icon: Inbox },
    { href: "/events", label: "Events", icon: CalendarDays },
    { href: "/artists", label: "Artists", icon: Users },
    { href: "/rigs", label: "Rigs", icon: Truck },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 border-r bg-card flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Wheelhouse Tattoo Co." className="h-10 w-10 object-contain" />
            <span className="font-bold text-sm tracking-tight text-muted-foreground uppercase">Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "font-medium" : "text-muted-foreground"}`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <Link href="/sign-in">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs">
              W
            </div>
            Wheelhouse
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
