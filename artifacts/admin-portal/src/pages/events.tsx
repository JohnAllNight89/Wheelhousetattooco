import { useState } from "react";
import { Link } from "wouter";
import { useListEvents, useCreateEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function Events() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: events, isLoading } = useListEvents();
  
  const queryClient = useQueryClient();
  const createEvent = useCreateEvent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        setIsCreateOpen(false);
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "open": return "default";
      case "full": return "secondary";
      case "completed": return "outline";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createEvent.mutate({
      data: {
        title: formData.get("title") as string,
        state: formData.get("state") as string,
        city: formData.get("city") as string,
        venue: formData.get("venue") as string,
        packageType: formData.get("packageType") as any,
        eventDate: formData.get("eventDate") as string,
        artistSlots: parseInt(formData.get("artistSlots") as string, 10),
        description: formData.get("description") as string,
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Manage scheduled events and rig deployments.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form id="create-event-form" onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" name="title" required placeholder="e.g., Austin Music Fest" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date</Label>
                  <Input id="eventDate" name="eventDate" type="date" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="packageType">Package</Label>
                  <Select name="packageType" required defaultValue="A">
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
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required placeholder="Austin" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" required placeholder="TX" maxLength={2} />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="venue">Venue (Optional)</Label>
                  <Input id="venue" name="venue" placeholder="Zilker Park" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="artistSlots">Artist Slots</Label>
                  <Input id="artistSlots" name="artistSlots" type="number" min="1" required defaultValue="2" />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" name="description" className="resize-none" />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" form="create-event-form" disabled={createEvent.isPending}>
                {createEvent.isPending ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Event Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Artists</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : events?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events?.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    {format(new Date(event.eventDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground">Pkg {event.packageType}</div>
                  </TableCell>
                  <TableCell>
                    {event.city}, {event.state}
                  </TableCell>
                  <TableCell>
                    <span className={event.signedUpCount >= event.artistSlots ? "text-green-600 font-medium" : ""}>
                      {event.signedUpCount} / {event.artistSlots}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(event.status) as any}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" size="sm">Manage</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
