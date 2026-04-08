import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  useGetMyServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService,
  getGetMyServicesQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Clock, DollarSign, Tag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const serviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  durationMinutes: z.coerce.number().min(15, "Duration must be at least 15 minutes"),
  category: z.string().min(1, "Category is required"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  const { data: services, isLoading } = useGetMyServices({
    query: { queryKey: getGetMyServicesQueryKey() }
  });

  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 100,
      durationMinutes: 60,
      category: "custom",
    }
  });

  const openNewDialog = () => {
    setEditingServiceId(null);
    form.reset({
      name: "",
      description: "",
      price: 100,
      durationMinutes: 60,
      category: "custom",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: any) => {
    setEditingServiceId(service.id);
    form.reset({
      name: service.name,
      description: service.description || "",
      price: service.price,
      durationMinutes: service.durationMinutes,
      category: service.category,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ServiceFormValues) => {
    if (editingServiceId) {
      updateService.mutate({
        id: editingServiceId,
        data
      }, {
        onSuccess: () => {
          toast({ title: "Service updated" });
          setIsDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: getGetMyServicesQueryKey() });
        },
        onError: (error: any) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      });
    } else {
      createService.mutate({
        data
      }, {
        onSuccess: () => {
          toast({ title: "Service created" });
          setIsDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: getGetMyServicesQueryKey() });
        },
        onError: (error: any) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteService.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Service deleted" });
        queryClient.invalidateQueries({ queryKey: getGetMyServicesQueryKey() });
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage the types of sessions you offer.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={openNewDialog}>
            <Plus className="w-4 h-4 mr-2" /> New Service
          </Button>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingServiceId ? "Edit Service" : "Create Service"}</DialogTitle>
              <DialogDescription>
                Define a new offering for clients to book.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Full Day Session" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" step="15" min="15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="custom">Custom Design</SelectItem>
                          <SelectItem value="flash">Flash Art</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="touchup">Touch-up</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Details about what's included..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createService.isPending || updateService.isPending}>
                    {editingServiceId ? "Save Changes" : "Create Service"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {services && services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{service.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground gap-3">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {service.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {Math.floor(service.durationMinutes / 60)}h {service.durationMinutes % 60}m</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm font-bold">
                    <DollarSign className="w-3 h-3" />{service.price}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {service.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 pt-4 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(service)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the service "{service.name}". It cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">No Services Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Create your first service offering to allow clients to start booking appointments with you.
          </p>
          <Button onClick={openNewDialog}>Create Your First Service</Button>
        </div>
      )}
    </div>
  );
}