import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetMyArtistProfile, useUpsertMyArtistProfile, getGetMyArtistProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const STYLES = [
  "Traditional", "Neo-Traditional", "Blackwork", "Geometric", "Realism", 
  "Watercolor", "Japanese", "Tribal", "Script/Lettering", "New School"
];

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().optional(),
  phone: z.string().optional(),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  styles: z.array(z.string()).min(1, "At least one style is required"),
  available: z.boolean().default(true),
  instagramHandle: z.string().optional(),
  yearsExperience: z.coerce.number().min(0).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useGetMyArtistProfile({
    query: { 
      queryKey: getGetMyArtistProfileQueryKey(),
      retry: false // Don't retry if 404 (user doesn't have a profile yet)
    }
  });

  const upsertProfile = useUpsertMyArtistProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      phone: "",
      state: "",
      city: "",
      styles: [],
      available: true,
      instagramHandle: "",
      yearsExperience: 0,
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        bio: profile.bio || "",
        phone: profile.phone || "",
        state: profile.state,
        city: profile.city,
        styles: profile.styles || [],
        available: profile.available,
        instagramHandle: profile.instagramHandle || "",
        yearsExperience: profile.yearsExperience || 0,
      });
    }
  }, [profile, form]);

  const onSubmit = (data: ProfileFormValues) => {
    upsertProfile.mutate({
      data: {
        ...data,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Profile saved",
          description: "Your artist profile has been updated.",
        });
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: getGetMyArtistProfileQueryKey() });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to save profile.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Artist Profile</h1>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasProfile = !!profile;
  const isFormActive = isEditing || !hasProfile;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">Artist Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your public information and availability for gigs.</p>
        </div>
        {hasProfile && !isFormActive && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {!hasProfile && !isEditing && (
        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-md mb-6 font-medium">
          Welcome to the crew! Please complete your profile to start claiming slots.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="uppercase tracking-tight">Basic Information</CardTitle>
              <CardDescription>Your core identity and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Professional Name</FormLabel>
                    <FormControl>
                      <Input disabled={!isFormActive} placeholder="Your name or moniker" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        disabled={!isFormActive} 
                        placeholder="Tell clients about your background, artistic philosophy, and what you love to tattoo..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider">Phone Number</FormLabel>
                      <FormControl>
                        <Input disabled={!isFormActive} placeholder="(555) 555-5555" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider">Instagram Handle</FormLabel>
                      <FormControl>
                        <Input disabled={!isFormActive} placeholder="@yourhandle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="uppercase tracking-tight">Location</CardTitle>
              <CardDescription>Where are you based?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider">City</FormLabel>
                      <FormControl>
                        <Input disabled={!isFormActive} placeholder="Austin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider">State</FormLabel>
                      <FormControl>
                        <Input disabled={!isFormActive} placeholder="TX" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="uppercase tracking-tight">Professional Details</CardTitle>
              <CardDescription>Experience level and availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Years Experience</FormLabel>
                    <FormControl>
                      <Input disabled={!isFormActive} type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base uppercase text-xs font-bold tracking-wider">Accepting Gigs</FormLabel>
                      <FormDescription>
                        Are you currently looking to get booked on the road?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={!isFormActive}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="uppercase tracking-tight">Tattoo Styles</CardTitle>
              <CardDescription>What styles do you specialize in?</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="styles"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {STYLES.map((style) => (
                        <FormField
                          key={style}
                          control={form.control}
                          name="styles"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={style}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    disabled={!isFormActive}
                                    checked={field.value?.includes(style)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, style])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== style
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm">
                                  {style}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage className="mt-4" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {isFormActive && (
            <div className="flex justify-end gap-4">
              {hasProfile && (
                <Button type="button" variant="ghost" onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="lg" className="w-full md:w-auto font-bold uppercase tracking-wide px-8" disabled={upsertProfile.isPending}>
                {upsertProfile.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Profile
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}