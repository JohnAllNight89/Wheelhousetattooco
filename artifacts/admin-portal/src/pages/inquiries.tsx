import { useState } from "react";
import { useListInquiries, useUpdateInquiryStatus, getListInquiriesQueryKey, Inquiry } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Inquiries() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  const { data: inquiries, isLoading } = useListInquiries(
    statusFilter !== "all" ? { status: statusFilter as any } : {}
  );

  const queryClient = useQueryClient();
  const updateInquiry = useUpdateInquiryStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
        setSelectedInquiry(null);
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "quoted": return "outline";
      case "booked": return "default"; // Primary color
      case "declined": return "destructive";
      default: return "secondary";
    }
  };

  const handleUpdateStatus = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get("status") as any;
    const adminNotes = formData.get("adminNotes") as string;
    
    updateInquiry.mutate({
      id: selectedInquiry.id,
      data: {
        status: newStatus,
        adminNotes: adminNotes || undefined
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>
          <p className="text-muted-foreground mt-1">Manage incoming event requests.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Filter:</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : inquiries?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              inquiries?.map((inq) => (
                <TableRow key={inq.id}>
                  <TableCell className="font-medium">
                    {format(new Date(inq.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{inq.contactName}</div>
                    <div className="text-xs text-muted-foreground">{inq.contactEmail}</div>
                  </TableCell>
                  <TableCell>{inq.eventCity}, {inq.eventState}</TableCell>
                  <TableCell>Pkg {inq.packageType}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(inq.status) as any}>
                      {inq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(inq)}>
                      View & Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        {selectedInquiry && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-muted-foreground">Contact Name</span>
                  <p>{selectedInquiry.contactName}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Email</span>
                  <p>{selectedInquiry.contactEmail}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Phone</span>
                  <p>{selectedInquiry.contactPhone || "N/A"}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Date Created</span>
                  <p>{format(new Date(selectedInquiry.createdAt), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Location</span>
                  <p>{selectedInquiry.eventCity}, {selectedInquiry.eventState}</p>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Package</span>
                  <p>Package {selectedInquiry.packageType}</p>
                </div>
                {selectedInquiry.eventName && (
                  <div className="col-span-2">
                    <span className="font-semibold text-muted-foreground">Event Name</span>
                    <p>{selectedInquiry.eventName}</p>
                  </div>
                )}
                {selectedInquiry.message && (
                  <div className="col-span-2">
                    <span className="font-semibold text-muted-foreground">Message</span>
                    <p className="bg-muted/50 p-2 rounded-md mt-1">{selectedInquiry.message}</p>
                  </div>
                )}
              </div>

              <div className="border-t my-2 pt-4">
                <form id="update-status-form" onSubmit={handleUpdateStatus} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={selectedInquiry.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea 
                      name="adminNotes" 
                      id="adminNotes" 
                      defaultValue={selectedInquiry.adminNotes || ""}
                      placeholder="Add internal notes about this inquiry..."
                      className="resize-none"
                    />
                  </div>
                </form>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Cancel</Button>
              <Button type="submit" form="update-status-form" disabled={updateInquiry.isPending}>
                {updateInquiry.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
