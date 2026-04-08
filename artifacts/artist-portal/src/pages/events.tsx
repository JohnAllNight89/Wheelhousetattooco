import { useState } from "react";
import { useListEvents, useGetMyEventSignups, getListEventsQueryKey, getGetMyEventSignupsQueryKey, useSignUpForEvent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Flame, Check, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListEventsPackageType } from "@workspace/api-client-react/src/generated/api.schemas";

const STATES = [
  "TN", "TX", "AZ", "OK", "FL"
];

export default function EventsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");

  const { data: events, isLoading: isLoadingEvents } = useListEvents({ 
    upcoming: true,
    ...(stateFilter !== "all" ? { state: stateFilter } : {}),
    ...(packageFilter !== "all" ? { packageType: packageFilter as ListEventsPackageType } : {})
  });
  
  const { data: mySignups } = useGetMyEventSignups({
    query: { queryKey: getGetMyEventSignupsQueryKey() }
  });

  const signUp = useSignUpForEvent();

  const handleSignUp = (eventId: number, title: string) => {
    signUp.mutate(
      { id: eventId },
      {
        onSuccess: () => {
          toast({
            title: "Slot Claimed!",
            description: `You're on the roster for ${title}.`,
          });
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMyEventSignupsQueryKey() });
        },
        onError: (err: any) => {
          toast({
            title: "Failed to claim slot",
            description: err.message || "Please try again later.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const myEventIds = mySignups?.map(s => s.eventId) || [];

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Browse Gigs</h1>
        <p className="text-muted-foreground mt-2">Find open slots at upcoming festivals and events.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="flex-1">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={packageFilter} onValueChange={setPackageFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Packages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Packages</SelectItem>
              <SelectItem value="A">Package A</SelectItem>
              <SelectItem value="B">Package B</SelectItem>
              <SelectItem value="C">Package C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoadingEvents ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isSignedUp = myEventIds.includes(event.id);
            const isFull = event.signedUpCount >= event.artistSlots;
            const slotsLeft = event.artistSlots - event.signedUpCount;

            return (
              <Card key={event.id} className={`flex flex-col bg-card transition-all ${isSignedUp ? 'border-primary/50' : 'hover:border-primary/30'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-wider">
                      PKG {event.packageType}
                    </Badge>
                    {isSignedUp ? (
                      <Badge className="bg-primary text-primary-foreground font-bold uppercase">
                        <Check className="w-3 h-3 mr-1" /> Booked
                      </Badge>
                    ) : (
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        {isFull ? (
                          <span className="text-destructive">FULL</span>
                        ) : (
                          <span className={slotsLeft <= 2 ? "text-primary" : ""}>{slotsLeft} SLOTS LEFT</span>
                        )}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2 min-h-[40px]">
                    {event.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3 text-sm font-medium">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{format(new Date(event.eventDate), "MMM do, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.city}, {event.state}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{event.signedUpCount} / {event.artistSlots} Artists</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border mt-4">
                  {isSignedUp ? (
                    <Button variant="secondary" className="w-full" disabled>
                      <Check className="w-4 h-4 mr-2" />
                      You're On The Crew
                    </Button>
                  ) : (
                    <Button 
                      className="w-full font-bold uppercase tracking-wide" 
                      disabled={isFull || signUp.isPending}
                      onClick={() => handleSignUp(event.id, event.title)}
                    >
                      {signUp.isPending && signUp.variables?.id === event.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      {isFull ? "Roster Full" : "Claim Slot"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-lg border border-border flex flex-col items-center">
          <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-xl font-bold tracking-tight mb-2">No Gigs Found</p>
          <p className="text-muted-foreground">There are no open gigs matching your filters.</p>
          {(stateFilter !== "all" || packageFilter !== "all") && (
            <Button 
              variant="link" 
              onClick={() => { setStateFilter("all"); setPackageFilter("all"); }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}