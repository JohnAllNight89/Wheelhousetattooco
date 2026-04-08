import { useState } from "react";
import { useAdminListArtists, useAdminUpdateArtist, getAdminListArtistsQueryKey } from "@workspace/api-client-react";
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
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Artists() {
  const [stateFilter, setStateFilter] = useState<string>("all");
  
  const { data: artists, isLoading } = useAdminListArtists(
    stateFilter !== "all" ? { state: stateFilter } : {}
  );

  const queryClient = useQueryClient();
  const updateArtist = useAdminUpdateArtist({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListArtistsQueryKey() });
      }
    }
  });

  const toggleApproval = (id: number, currentApproval: boolean) => {
    updateArtist.mutate({
      id,
      data: { approved: !currentApproval }
    });
  };

  const toggleAvailability = (id: number, currentAvailability: boolean) => {
    updateArtist.mutate({
      id,
      data: { available: !currentAvailability }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground mt-1">Manage artist approvals and availability.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">State:</Label>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="TX">TX</SelectItem>
              <SelectItem value="TN">TN</SelectItem>
              <SelectItem value="AZ">AZ</SelectItem>
              <SelectItem value="OK">OK</SelectItem>
              <SelectItem value="FL">FL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Styles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-center">Approved</TableHead>
              <TableHead className="text-center">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : artists?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No artists found.
                </TableCell>
              </TableRow>
            ) : (
              artists?.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div className="font-medium">{artist.name}</div>
                    <div className="text-xs text-muted-foreground">{artist.email}</div>
                    {artist.instagramHandle && (
                      <div className="text-xs text-primary mt-0.5">@{artist.instagramHandle}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {artist.city}, {artist.state}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {artist.styles.slice(0, 2).map(style => (
                        <Badge key={style} variant="secondary" className="text-[10px]">{style}</Badge>
                      ))}
                      {artist.styles.length > 2 && (
                        <Badge variant="secondary" className="text-[10px]">+{artist.styles.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(artist.createdAt), "MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={artist.approved} 
                      onCheckedChange={() => toggleApproval(artist.id, artist.approved)}
                      disabled={updateArtist.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch 
                      checked={artist.available} 
                      onCheckedChange={() => toggleAvailability(artist.id, artist.available)}
                      disabled={updateArtist.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
