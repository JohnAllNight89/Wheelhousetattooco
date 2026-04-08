import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  useGetMyCustomerProfile, getGetMyCustomerProfileQueryKey,
  useUpsertMyCustomerProfile
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const initialized = useRef(false);

  const { data: profile, isLoading } = useGetMyCustomerProfile();
  const upsertProfile = useUpsertMyCustomerProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile && !initialized.current) {
      form.reset({
        name: profile.name || user?.fullName || "",
        phone: profile.phone || "",
      });
      initialized.current = true;
    } else if (user && !profile && !isLoading && !initialized.current) {
      form.reset({
        name: user.fullName || "",
        phone: "",
      });
      initialized.current = true;
    }
  }, [profile, user, isLoading, form]);

  const onSubmit = (data: ProfileFormValues) => {
    upsertProfile.mutate({
      data
    }, {
      onSuccess: () => {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved.",
        });
        queryClient.invalidateQueries({ queryKey: getGetMyCustomerProfileQueryKey() });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: error.error || "Could not update your profile.",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your personal information.</p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur">
        <CardHeader className="flex flex-row items-center gap-4 pb-8">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-2xl"><UserIcon className="w-8 h-8" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-serif">{profile?.name || user?.fullName}</CardTitle>
            <CardDescription className="text-base">{user?.primaryEmailAddress?.emailAddress}</CardDescription>
          </div>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-background/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" className="bg-background/50" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      Used by artists to contact you about appointments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="bg-muted/50 py-6 px-6 border-t border-border/40 mt-6 rounded-b-xl flex justify-end">
              <Button type="submit" disabled={upsertProfile.isPending}>
                {upsertProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
