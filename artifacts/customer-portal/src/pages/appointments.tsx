import { useListBookings, getListBookingsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User as UserIcon } from "lucide-react";
import { Link } from "wouter";

export default function Appointments() {
  const { data: bookings, isLoading } = useListBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "completed": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "cancelled": return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      default: return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"; // pending
    }
  };

  const activeBookings = bookings?.filter(b => b.status === "pending" || b.status === "confirmed") || [];
  const pastBookings = bookings?.filter(b => b.status === "completed" || b.status === "cancelled") || [];

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif mb-8">Appointments</h1>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const BookingList = ({ items }: { items: typeof bookings }) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-24 border border-dashed rounded-xl bg-card/30">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-serif mb-2">No appointments</h3>
          <p className="text-muted-foreground mb-6">You don't have any appointments in this category.</p>
          <Link href="/browse" className="text-primary hover:underline">
            Find an artist
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {items.map(booking => (
          <Card key={booking.id} className="overflow-hidden border-border/40 bg-card/40 hover:bg-card/60 transition-colors">
            <div className="flex flex-col sm:flex-row">
              <div className="bg-muted p-6 sm:w-48 flex flex-col justify-center items-center text-center border-b sm:border-b-0 sm:border-r border-border/40">
                {booking.scheduledAt ? (
                  <>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      {format(new Date(booking.scheduledAt), "MMM")}
                    </div>
                    <div className="text-4xl font-serif mb-1">
                      {format(new Date(booking.scheduledAt), "dd")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(booking.scheduledAt), "h:mm a")}
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground italic">TBD</div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-medium mb-1">{booking.serviceName || "Custom Tattoo"}</h3>
                      <Link href={`/artists/${booking.artistId}`} className="text-muted-foreground hover:text-primary flex items-center transition-colors">
                        <UserIcon className="w-4 h-4 mr-1.5" />
                        {booking.artistName}
                      </Link>
                    </div>
                    <Badge className={getStatusColor(booking.status)} variant="outline">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  {booking.notes && (
                    <div className="bg-background/50 p-3 rounded-md text-sm text-muted-foreground mt-4 mb-4 line-clamp-2">
                      "{booking.notes}"
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm font-medium mt-auto pt-4 border-t border-border/40">
                  {booking.totalPrice && <span>Estimated: ${booking.totalPrice}</span>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">Appointments</h1>
        <p className="text-muted-foreground text-lg">Manage your upcoming ink sessions.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-serif text-lg"
          >
            Upcoming ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-serif text-lg"
          >
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="focus-visible:outline-none">
          <BookingList items={activeBookings} />
        </TabsContent>
        
        <TabsContent value="past" className="focus-visible:outline-none">
          <BookingList items={pastBookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
