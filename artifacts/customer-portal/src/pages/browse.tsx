import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useListArtists, useGetArtistLocations } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export default function Browse() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [styleFilter, setStyleFilter] = useState<string>("all");

  const { data: artists, isLoading: artistsLoading } = useListArtists({
    state: stateFilter !== "all" ? stateFilter : undefined,
    style: styleFilter !== "all" ? styleFilter : undefined,
  });

  const { data: locationData } = useGetArtistLocations();

  const allStyles = useMemo(() => {
    if (!artists) return [];
    const styles = new Set<string>();
    artists.forEach(a => a.styles.forEach(s => styles.add(s)));
    return Array.from(styles).sort();
  }, [artists]);

  const filteredArtists = useMemo(() => {
    if (!artists) return [];
    return artists.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [artists, search]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-3">Artists</h1>
          <p className="text-muted-foreground text-lg">Discover the perfect visionary for your next piece.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-10 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name..." 
            className="pl-10 border-none bg-background/50 focus-visible:ring-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-px md:h-8 bg-border hidden md:block" />
        <div className="flex w-full md:w-auto gap-4">
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-full md:w-[180px] border-none bg-background/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Location</SelectItem>
              {locationData?.locations.map(loc => (
                <SelectItem key={loc.state} value={loc.state}>{loc.state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-full md:w-[180px] border-none bg-background/50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Style" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Style</SelectItem>
              {allStyles.map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {artistsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden border-border/50">
              <Skeleton className="h-64 w-full rounded-none" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="text-center py-24 border border-dashed rounded-xl bg-card/50">
          <h3 className="text-xl font-serif mb-2">No artists found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setSearch("");
              setStateFilter("all");
              setStyleFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtists.map((artist) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}>
              <Card className="group overflow-hidden border-border/40 hover:border-primary/50 transition-colors cursor-pointer bg-card/40 hover:bg-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {artist.portfolioImages?.[0] ? (
                    <img 
                      src={artist.portfolioImages[0]} 
                      alt={`${artist.name} portfolio`} 
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif italic">
                      No images
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <CardContent className="p-6 relative">
                  <h3 className="text-2xl font-serif tracking-tight mb-1">{artist.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {artist.city}, {artist.state}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {artist.styles.slice(0, 3).map(style => (
                      <Badge key={style} variant="secondary" className="bg-secondary/50 font-normal">
                        {style}
                      </Badge>
                    ))}
                    {artist.styles.length > 3 && (
                      <Badge variant="secondary" className="bg-secondary/50 font-normal">
                        +{artist.styles.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
