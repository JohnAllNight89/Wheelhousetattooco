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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Plus, Image as ImageIcon } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  bio: z.string().optional(),
  phone: z.string().optional(),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  styles: z.array(z.object({ value: z.string() })).min(1, "At least one style is required"),
  portfolioImages: z.array(z.object({ url: z.string().url("Must be a valid URL") })).optional(),
  hourlyRate: z.coerce.number().min(0).optional(),
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
      styles: [{ value: "" }],
      portfolioImages: [],
      hourlyRate: 150,
      available: true,
      instagramHandle: "",
      yearsExperience: 0,
    }
  });

  const { fields: styleFields, append: appendStyle, remove: removeStyle } = useFieldArray({
    name: "styles",
    control: form.control
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    name: "portfolioImages",
    control: form.control
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        bio: profile.bio || "",
        phone: profile.phone || "",
        state: profile.state,
        city: profile.city,
        styles: profile.styles.map(s => ({ value: s })),
        portfolioImages: profile.portfolioImages.map(url => ({ url })),
        hourlyRate: profile.hourlyRate || 0,
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
        styles: data.styles.map(s => s.value).filter(Boolean),
        portfolioImages: data.portfolioImages?.map(i => i.url).filter(Boolean),
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
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artist Profile</h1>
          <p className="text-muted-foreground">Manage how clients see you.</p>
        </div>
        {hasProfile && !isFormActive && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      {!hasProfile && !isEditing && (
        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-md mb-6">
          <strong>Welcome!</strong> Please complete your profile to start accepting bookings.
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your core identity and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Name</FormLabel>
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
                      <FormLabel>Bio</FormLabel>
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
                        <FormLabel>Phone Number</FormLabel>
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
                        <FormLabel>Instagram Handle</FormLabel>
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

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where do you work?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
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
                        <FormLabel>State</FormLabel>
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

            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Rates and experience level.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input disabled={!isFormActive} type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years Experience</FormLabel>
                        <FormControl>
                          <Input disabled={!isFormActive} type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Accepting Bookings</FormLabel>
                        <FormDescription>
                          Are your books currently open?
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

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tattoo Styles</CardTitle>
                <CardDescription>What styles do you specialize in?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {styleFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`styles.${index}.value`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex items-center gap-2 m-0 p-0 space-y-0">
                          <FormControl>
                            <div className="relative flex items-center">
                              <Input 
                                disabled={!isFormActive} 
                                className="w-[180px] pr-8" 
                                placeholder="e.g. Traditional" 
                                {...inputField} 
                              />
                              {isFormActive && (
                                <button 
                                  type="button" 
                                  onClick={() => removeStyle(index)}
                                  className="absolute right-2 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                {isFormActive && (
                  <Button type="button" variant="outline" size="sm" onClick={() => appendStyle({ value: "" })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Style
                  </Button>
                )}
                {form.formState.errors.styles && (
                  <p className="text-[0.8rem] font-medium text-destructive">{form.formState.errors.styles.message}</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Portfolio Images</CardTitle>
                <CardDescription>URLs to your best work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {imageFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`portfolioImages.${index}.url`}
                      render={({ field: inputField }) => (
                        <FormItem className="m-0 p-0 space-y-2">
                          <FormLabel className="sr-only">Image URL</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center">
                              <Input 
                                disabled={!isFormActive} 
                                className="pr-8" 
                                placeholder="https://..." 
                                {...inputField} 
                              />
                              {isFormActive && (
                                <button 
                                  type="button" 
                                  onClick={() => removeImage(index)}
                                  className="absolute right-2 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                          {inputField.value && (
                            <div className="mt-2 aspect-video w-full rounded-md border border-border overflow-hidden bg-muted flex items-center justify-center">
                              <img 
                                src={inputField.value} 
                                alt={`Portfolio ${index}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                }}
                              />
                              <ImageIcon className="w-8 h-8 text-muted-foreground absolute -z-10" />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                {isFormActive && (
                  <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: "" })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Image URL
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {isFormActive && (
            <div className="flex justify-end gap-4 border-t pt-6">
              {hasProfile && (
                <Button type="button" variant="ghost" onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={upsertProfile.isPending}>
                {upsertProfile.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}