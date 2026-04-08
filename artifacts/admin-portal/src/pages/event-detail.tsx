import { useState } from "react";
import { useGetEvent, useGetEventSignups, useUpdateEvent, useDeleteEvent, getGetEventQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Trash2, Edit2, Calendar as CalendarIcon, MapPin, Users, Package as PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EventDetail({ id }: { id: string }) {
  const eventId = parseInt(id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const { data: event, isLoading: isLoadingEvent } = useGetEvent(eventId);
  const { data: signups, isLoading: isLoadingSignups } = useGetEventSignups(eventId);
  
  const deleteEvent = useDeleteEvent({
    mutation: {
      onSuccess: () => {
        setLocation("/events");
      }
    }
  });

  const updateEvent = useUpdateEvent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) });
        setIsEditOpen(false);
      }
    }
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      deleteEvent.mutate({ id: eventId });
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;
    const formData = new FormData(e.currentTarget);
    updateEvent.mutate({
      id: eventId,
      data: {
        title: formData.get("title") as string,
        state: formData.get("state") as string,
        city: formData.get("city") as string,
        venue: formData.get("venue") as string,
        packageType: formData.get("packageType") as any,
        eventDate: formData.get("eventDate") as string,
        artistSlots: parseInt(formData.get("artistSlots") as string, 10),
        notes: formData.get("notes") as string,
      }
    });
  };

  if (isLoadingEvent || isLoadingSignups) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-1" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!event) return <div>Event not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/events">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Badge variant="outline">{event.status}</Badge>
              {format(new Date(event.eventDate), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteEvent.isPending}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form id="edit-event-form" onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input id="edit-title" name="title" required defaultValue={event.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-eventDate">Date</Label>
                <Input id="edit-eventDate" name="eventDate" type="date" required defaultValue={event.eventDate.split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-packageType">Package</Label>
                <Select name="packageType" defaultValue={event.packageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Package A</SelectItem>
                    <SelectItem value="B">Package B</SelectItem>
                    <SelectItem value="C">Package C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input id="edit-city" name="city" required defaultValue={event.city} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input id="edit-state" name="state" required defaultValue={event.state} maxLength={2} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-venue">Venue (Optional)</Label>
                <Input id="edit-venue" name="venue" defaultValue={event.venue || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-artistSlots">Artist Slots</Label>
                <Input id="edit-artistSlots" name="artistSlots" type="number" min="1" required defaultValue={event.artistSlots} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea id="edit-notes" name="notes" defaultValue={event.notes || ""} className="resize-none" />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" form="edit-event-form" disabled={updateEvent.isPending}>
              {updateEvent.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Configuration and location info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-sm text-muted-foreground">{format(new Date(event.eventDate), "MMMM d, yyyy")}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">
                  {event.venue ? `${event.venue}, ` : ''}{event.city}, {event.state}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <PackageIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Package Type</div>
                <div className="text-sm text-muted-foreground">Package {event.packageType}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Capacity</div>
                <div className="text-sm text-muted-foreground">{event.signedUpCount} of {event.artistSlots} slots filled</div>
              </div>
            </div>

            {event.description && (
              <div className="pt-4 border-t">
                <div className="font-medium mb-1">Description</div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Artist Roster</CardTitle>
            <CardDescription>Artists signed up for this event</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artist Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Styles</TableHead>
                  <TableHead>Signed Up On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signups?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No artists signed up yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  signups?.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">{signup.artistName || `Artist #${signup.artistId}`}</TableCell>
                      <TableCell>{signup.artistState || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {signup.artistStyles?.slice(0, 2).map(s => (
                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                          ))}
                          {signup.artistStyles?.length > 2 && (
                            <Badge variant="secondary" className="text-[10px]">+{signup.artistStyles.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(signup.signedUpAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
