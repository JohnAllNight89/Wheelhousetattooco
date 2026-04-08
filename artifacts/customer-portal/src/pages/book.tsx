import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  useGetArtist, getGetArtistQueryKey, 
  useGetArtistServices, getGetArtistServicesQueryKey,
  useCreateBooking, getListBookingsQueryKey, getGetCustomerDashboardQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const bookingFormSchema = z.object({
  serviceId: z.string().optional(),
  scheduledAt: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "A time is required.",
  }),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Book() {
  const params = useParams();
  const artistId = parseInt(params.artistId || "0", 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: artist, isLoading: artistLoading } = useGetArtist(artistId, {
    query: {
      enabled: !!artistId,
      queryKey: getGetArtistQueryKey(artistId)
    }
  });

  const { data: services, isLoading: servicesLoading } = useGetArtistServices(artistId, {
    query: {
      enabled: !!artistId,
      queryKey: getGetArtistServicesQueryKey(artistId)
    }
  });

  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
  });

  const selectedServiceId = form.watch("serviceId");
  const selectedService = services?.find(s => s.id.toString() === selectedServiceId);

  const onSubmit = (data: BookingFormValues) => {
    // Combine date and time
    const dateTime = new Date(data.scheduledAt);
    const [hours, minutes] = data.time.split(':');
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    createBooking.mutate({
      data: {
        artistId,
        serviceId: data.serviceId ? parseInt(data.serviceId, 10) : undefined,
        scheduledAt: dateTime.toISOString(),
        notes: data.notes,
        totalPrice: selectedService?.price, // This is just an estimate sent to API
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Booking Requested",
          description: "Your appointment request has been sent to the artist.",
        });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCustomerDashboardQueryKey() });
        setLocation("/appointments");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: error.error || "An unexpected error occurred.",
        });
      }
    });
  };

  const timeSlots = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  if (artistLoading || servicesLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif mb-4">Artist not found</h2>
        <Link href="/browse">
          <Button variant="outline">Back to browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Link href={`/artists/${artist.id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {artist.name}'s profile
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-serif tracking-tight mb-2">Request Appointment</h1>
        <p className="text-muted-foreground text-lg">Booking with <span className="font-medium text-foreground">{artist.name}</span></p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8 pt-6">
              
              {services && services.length > 0 && (
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select a service (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map(service => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name} - ${service.price} ({service.durationMinutes} mins)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-background/50",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select time" />
                            <Clock className="ml-auto h-4 w-4 opacity-50 absolute right-3" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Notes & Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your idea, placement, size, and any other details..." 
                        className="min-h-[120px] bg-background/50 resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the better the artist can prepare.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedService && (
                <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                  <span className="font-medium">Estimated Price</span>
                  <span className="text-xl font-serif">${selectedService.price}</span>
                </div>
              )}

            </CardContent>
            <CardFooter className="bg-muted/50 py-6 px-6 border-t border-border/40 mt-6 rounded-b-xl flex justify-between">
              <Button variant="ghost" type="button" onClick={() => setLocation(`/artists/${artist.id}`)}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={createBooking.isPending}>
                {createBooking.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
