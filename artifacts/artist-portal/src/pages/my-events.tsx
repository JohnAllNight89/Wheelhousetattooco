import { useGetMyEventSignups, getGetMyEventSignupsQueryKey, useWithdrawFromEvent, getListEventsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, X, Loader2, Music, Check } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link } from "wouter";

export default function MyEventsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: mySignups, isLoading } = useGetMyEventSignups({
    query: { queryKey: getGetMyEventSignupsQueryKey() }
  });

  const withdraw = useWithdrawFromEvent();

  const handleWithdraw = (eventId: number, title: string | null | undefined) => {
    withdraw.mutate(
      { id: eventId },
      {
        onSuccess: () => {
          toast({
            title: "Withdrawn",
            description: `You have given up your slot for ${title || 'the event'}.`,
          });
          queryClient.invalidateQueries({ queryKey: getGetMyEventSignupsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
        },
        onError: (err: any) => {
          toast({
            title: "Failed to withdraw",
            description: err.message || "Please try again later.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">My Lineup</h1>
        <p className="text-muted-foreground mt-2">Your confirmed gig schedule.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : mySignups && mySignups.length > 0 ? (
        <div className="space-y-4">
          {mySignups.map((signup) => (
            <Card key={signup.id} className="bg-card border-l-4 border-l-primary overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent font-bold uppercase tracking-wider mb-2">
                      <Check className="w-3 h-3 mr-1" /> Confirmed
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground uppercase">
                      Signed up {format(new Date(signup.signedUpAt), "MMM d")}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight mb-4">{signup.eventTitle}</h3>
                  
                  <div className="flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{signup.eventDate ? format(new Date(signup.eventDate), "MMM do, yyyy") : "Date TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{signup.eventCity}, {signup.eventState}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">PKG {signup.eventPackageType}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-6 flex flex-row md:flex-col justify-end md:justify-center items-center md:border-l border-border md:w-48 gap-3 border-t md:border-t-0">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                        <X className="w-4 h-4 mr-2" />
                        Withdraw
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will open your slot up to other artists. If you change your mind, you'll have to sign up again and hope the spot is still available.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleWithdraw(signup.eventId, signup.eventTitle)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Withdraw
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-lg border border-border flex flex-col items-center">
          <Music className="w-16 h-16 text-muted-foreground/30 mb-6" />
          <p className="text-2xl font-black uppercase tracking-tight mb-2">No Gigs Yet</p>
          <p className="text-muted-foreground mb-8 max-w-md">Your lineup is empty. Browse open gigs and claim slots to start building your tour schedule.</p>
          <Button size="lg" asChild className="font-bold uppercase tracking-wide px-8">
            <Link href="/events">Browse Gigs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}