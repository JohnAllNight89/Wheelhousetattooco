import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, Truck, Inbox, CheckCircle2, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return <div>Error loading dashboard.</div>;
  }

  const statCards = [
    { title: "Total Artists", value: dashboard.totalArtists, icon: Users, desc: `${dashboard.approvedArtists} approved, ${dashboard.pendingArtists} pending`, link: "/artists" },
    { title: "Inquiries", value: dashboard.totalInquiries, icon: Inbox, desc: `${dashboard.newInquiries} new, ${dashboard.bookedInquiries} booked`, link: "/inquiries" },
    { title: "Events", value: dashboard.totalEvents, icon: Calendar, desc: `${dashboard.upcomingEvents} upcoming, ${dashboard.openEvents} open slots`, link: "/events" },
    { title: "Rigs", value: dashboard.totalRigs, icon: Truck, desc: `${dashboard.availableRigs} available, ${dashboard.deployedRigs} deployed`, link: "/rigs" },
    { title: "Total Signups", value: dashboard.totalSignups, icon: CheckCircle2, desc: "Artist event signups", link: "/events" },
    { title: "Pending Approvals", value: dashboard.pendingArtists, icon: Clock, desc: "Artists awaiting approval", link: "/artists" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of Wheelhouse Tattoo Co. operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.link}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
