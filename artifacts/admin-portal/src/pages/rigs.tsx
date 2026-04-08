import { useState } from "react";
import { useListRigs, useCreateRig, useUpdateRig, getListRigsQueryKey, Rig } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
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
import { Plus, Settings, CheckCircle2, Wrench } from "lucide-react";

export default function Rigs() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRig, setEditingRig] = useState<Rig | null>(null);
  
  const { data: rigs, isLoading } = useListRigs();
  const queryClient = useQueryClient();
  
  const createRig = useCreateRig({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRigsQueryKey() });
        setIsCreateOpen(false);
      }
    }
  });

  const updateRig = useUpdateRig({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRigsQueryKey() });
        setEditingRig(null);
      }
    }
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "available": return <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />;
      case "deployed": return <Settings className="h-4 w-4 text-blue-500 mr-1" />;
      case "maintenance": return <Wrench className="h-4 w-4 text-orange-500 mr-1" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "available": return "outline";
      case "deployed": return "default";
      case "maintenance": return "secondary";
      default: return "outline";
    }
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createRig.mutate({
      data: {
        name: formData.get("name") as string,
        homeState: formData.get("homeState") as string,
        status: formData.get("status") as any,
        description: formData.get("description") as string,
      }
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRig) return;
    const formData = new FormData(e.currentTarget);
    updateRig.mutate({
      id: editingRig.id,
      data: {
        name: formData.get("name") as string,
        homeState: formData.get("homeState") as string,
        status: formData.get("status") as any,
        description: formData.get("description") as string,
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rig Fleet</h1>
          <p className="text-muted-foreground mt-1">Manage mobile tattoo rigs and their status.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Rig</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Rig</DialogTitle>
            </DialogHeader>
            <form id="create-rig-form" onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rig Name / ID</Label>
                <Input id="name" name="name" required placeholder="e.g., Rig Alpha TX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeState">Home State</Label>
                <Input id="homeState" name="homeState" required placeholder="TX" maxLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select name="status" defaultValue="available">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="deployed">Deployed</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Notes (Optional)</Label>
                <Textarea id="description" name="description" className="resize-none" />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" form="create-rig-form" disabled={createRig.isPending}>
                {createRig.isPending ? "Adding..." : "Add Rig"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rig Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Home State</TableHead>
              <TableHead>Current Event</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : rigs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No rigs found.
                </TableCell>
              </TableRow>
            ) : (
              rigs?.map((rig) => (
                <TableRow key={rig.id}>
                  <TableCell className="font-medium">
                    {rig.name}
                    {rig.description && <div className="text-xs text-muted-foreground font-normal mt-0.5 truncate max-w-[200px]">{rig.description}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(rig.status) as any} className="flex w-fit items-center">
                      {getStatusIcon(rig.status)}
                      <span className="capitalize">{rig.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{rig.homeState}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {rig.status === 'deployed' && rig.currentEventTitle ? rig.currentEventTitle : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setEditingRig(rig)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingRig} onOpenChange={(open) => !open && setEditingRig(null)}>
        {editingRig && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Rig</DialogTitle>
            </DialogHeader>
            <form id="update-rig-form" onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Rig Name / ID</Label>
                <Input id="edit-name" name="name" required defaultValue={editingRig.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-homeState">Home State</Label>
                <Input id="edit-homeState" name="homeState" required defaultValue={editingRig.homeState} maxLength={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={editingRig.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="deployed">Deployed</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Notes</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingRig.description || ""} className="resize-none" />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRig(null)}>Cancel</Button>
              <Button type="submit" form="update-rig-form" disabled={updateRig.isPending}>
                {updateRig.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
