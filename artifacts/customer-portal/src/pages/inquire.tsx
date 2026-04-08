import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  useListPackages, 
  useCreateInquiry,
  CreateInquiryBodyPackageType,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Footer from "../components/layout/footer";
import { Loader2 } from "lucide-react";

const SUPPORTED_STATES = ["TN", "TX", "AZ", "OK", "FL"];

const inquirySchema = z.object({
  contactName: z.string().min(2, "Name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  eventState: z.string().refine((val) => SUPPORTED_STATES.includes(val), {
    message: "We currently only serve TN, TX, AZ, OK, and FL.",
  }),
  eventCity: z.string().min(2, "City is required"),
  expectedAttendees: z.coerce.number().optional(),
  packageType: z.enum(["A", "B", "C"] as const),
  message: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function Inquire() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const initialPackage = searchParams.get("package") as CreateInquiryBodyPackageType | undefined;
  const { toast } = useToast();

  const { data: packages, isLoading: isLoadingPackages } = useListPackages();
  const createInquiry = useCreateInquiry();

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      eventName: "",
      eventDate: "",
      eventState: "",
      eventCity: "",
      expectedAttendees: undefined,
      packageType: ["A", "B", "C"].includes(initialPackage as string) ? initialPackage : undefined,
      message: "",
    },
  });

  const onSubmit = (data: InquiryFormValues) => {
    createInquiry.mutate({
      data: {
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        eventName: data.eventName || undefined,
        eventDate: data.eventDate || undefined,
        eventState: data.eventState,
        eventCity: data.eventCity,
        expectedAttendees: data.expectedAttendees || undefined,
        packageType: data.packageType,
        message: data.message || undefined,
      }
    }, {
      onSuccess: () => {
        setLocation("/confirm");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: error.error || "An unexpected error occurred.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-4xl">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Request a Booking</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Tell us about your upcoming event. We'll review the details and get back to you with a custom quote and availability within 48 hours.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-white/5 p-6 md:p-10 shadow-2xl shadow-black/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="space-y-6">
                <h2 className="text-xl font-medium text-white border-b border-white/5 pb-2">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="jane@example.com" type="email" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-medium text-white border-b border-white/5 pb-2">Event Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="SXSW, Corporate Retreat, etc." className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date (Approximate is fine)</FormLabel>
                        <FormControl>
                          <Input type="date" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SUPPORTED_STATES.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Currently serving TN, TX, AZ, OK, FL</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Austin" className="bg-background/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Attendees</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500" className="bg-background/50" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-medium text-white border-b border-white/5 pb-2">Package Selection</h2>
                
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Package *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 h-14 text-base">
                            <SelectValue placeholder={isLoadingPackages ? "Loading packages..." : "Select a package"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packages?.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id} className="py-3">
                              <div className="font-medium text-white">{pkg.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {pkg.rigCount} Rig(s) • {pkg.artistSlots} Artists
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about the vibe, specific requirements, or any questions you have." 
                          className="min-h-[150px] bg-background/50 resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto rounded-full px-10 h-14 text-base bg-white text-black hover:bg-white/90"
                  disabled={createInquiry.isPending}
                >
                  {createInquiry.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}