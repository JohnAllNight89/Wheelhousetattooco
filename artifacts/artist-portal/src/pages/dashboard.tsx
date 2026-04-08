import { useListEvents, useGetMyEventSignups, getListEventsQueryKey, getGetMyEventSignupsQueryKey, useSignUpForEvent, useWithdrawFromEvent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Ticket, ArrowRight, Flame, Check } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading: isLoadingEvents } = useListEvents({ upcoming: true });
  const { data: mySignups, isLoading: isLoadingSignups } = useGetMyEventSignups({
    query: { queryKey: getGetMyEventSignupsQueryKey() }
  });

  const signUp = useSignUpForEvent();
  const withdraw = useWithdrawFromEvent();

  const handleSignUp = (eventId: number, title: string) => {
    signUp.mutate(
      { id: eventId },
      {
        onSuccess: () => {
          toast({
            title: "Slot Claimed!",
            description: `You're on the roster for ${title}.`,
          });
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey({ upcoming: true }) });
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
  const nextEvent = mySignups?.length ? mySignups[0] : null;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to the Wheelhouse Crew. Claim your slots and hit the road.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card md:col-span-2 border-primary/20 shadow-sm shadow-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="uppercase tracking-tight text-sm font-bold text-muted-foreground">Next Up For You</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSignups ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : nextEvent ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{nextEvent.eventTitle}</h3>
                  <div className="flex items-center gap-4 mt-3 text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {nextEvent.eventDate ? format(new Date(nextEvent.eventDate), "MMM d, yyyy") : "TBD"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {nextEvent.eventCity}, {nextEvent.eventState}
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="w-full md:w-auto font-bold uppercase tracking-wide">
                  <Link href="/my-events">View My Lineup</Link>
                </Button>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <Ticket className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-lg font-medium">No upcoming gigs booked.</p>
                <p className="text-muted-foreground mb-4">Claim a slot below to get on the road.</p>
                <Button asChild variant="outline">
                  <Link href="/events">Browse All Gigs</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="uppercase tracking-tight text-sm font-bold text-muted-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="secondary" className="w-full justify-between" asChild>
              <Link href="/profile">
                <span>Update Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="secondary" className="w-full justify-between" asChild>
              <Link href="/events">
                <span>Browse All Gigs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            Hot Open Gigs
          </h2>
          <Button variant="link" asChild className="hidden sm:flex">
            <Link href="/events">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        {isLoadingEvents ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
            {events.slice(0, 6).map((event) => {
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
                  <CardFooter className="pt-4">
                    {isSignedUp ? (
                      <Button variant="secondary" className="w-full" disabled>
                        <Check className="w-4 h-4 mr-2" />
                        You're In
                      </Button>
                    ) : (
                      <Button 
                        className="w-full font-bold uppercase tracking-wide" 
                        disabled={isFull || signUp.isPending}
                        onClick={() => handleSignUp(event.id, event.title)}
                      >
                        {isFull ? "Roster Full" : "Claim Slot"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No open gigs at the moment. Check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}