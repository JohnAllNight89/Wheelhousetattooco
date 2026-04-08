import { useState } from "react";
import { 
  useListBookings, 
  useUpdateBookingStatus, 
  getListBookingsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, FileText, CheckCircle2, XCircle, PlayCircle } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export default function BookingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: bookings, isLoading } = useListBookings({
    query: { queryKey: getListBookingsQueryKey() }
  });

  const updateStatus = useUpdateBookingStatus();

  const handleUpdateStatus = (id: number, status: "confirmed" | "completed" | "cancelled") => {
    updateStatus.mutate({
      id,
      data: { status }
    }, {
      onSuccess: () => {
        toast({ title: `Booking ${status}` });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredBookings = bookings?.filter(b => filter === "all" || b.status === filter) || [];

  const getStatusBadge = (status: BookingStatus) => {
    switch(status) {
      case "pending": return <Badge variant="secondary">Pending Review</Badge>;
      case "confirmed": return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Confirmed</Badge>;
      case "completed": return <Badge variant="outline" className="border-green-600 text-green-600">Completed</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage your schedule and client requests.</p>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">{booking.serviceName || 'Custom Service'}</h3>
                          {getStatusBadge(booking.status as BookingStatus)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{booking.customerName || 'Unknown Client'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${booking.totalPrice?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Scheduled Time</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.scheduledAt ? format(new Date(booking.scheduledAt), "EEEE, MMMM d, yyyy 'at' h:mm a") : 'Date to be determined'}
                          </div>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="flex items-start gap-3 md:col-span-2 mt-2 pt-4 border-t border-border/50">
                          <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">Client Notes</div>
                            <div className="text-sm text-muted-foreground italic bg-background p-3 rounded border">"{booking.notes}"</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Sidebar */}
                  <div className="md:w-64 bg-muted/20 border-l p-6 flex flex-col justify-center gap-3">
                    {booking.status === "pending" && (
                      <>
                        <Button 
                          className="w-full justify-start bg-green-600 hover:bg-green-700 text-white" 
                          onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Request
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-destructive hover:bg-destructive/10" 
                          onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                          disabled={updateStatus.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Decline
                        </Button>
                      </>
                    )}
                    
                    {booking.status === "confirmed" && (
                      <>
                        <Button 
                          className="w-full justify-start" 
                          onClick={() => handleUpdateStatus(booking.id, "completed")}
                          disabled={updateStatus.isPending}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" /> Mark Completed
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-destructive hover:bg-destructive/10" 
                          onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                          disabled={updateStatus.isPending}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Cancel Appointment
                        </Button>
                      </>
                    )}

                    {(booking.status === "completed" || booking.status === "cancelled") && (
                      <div className="text-center text-sm text-muted-foreground italic">
                        No further actions available for this booking.
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-card rounded-lg border border-dashed border-border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-bold mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are no {filter !== "all" ? filter : ""} bookings to display right now.
              </p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}