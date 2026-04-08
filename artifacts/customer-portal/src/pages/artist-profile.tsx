import { Link, useParams } from "wouter";
import { useGetArtist, getGetArtistQueryKey, useGetArtistServices, getGetArtistServicesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Instagram, Clock, DollarSign, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ArtistProfile() {
  const params = useParams();
  const artistId = parseInt(params.id || "0", 10);

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

  if (artistLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-10 w-24 mb-8" />
        <div className="grid md:grid-cols-[1fr_300px] gap-12">
          <div>
            <Skeleton className="h-16 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="aspect-square w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/browse" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to artists
      </Link>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div>
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-serif tracking-tight mb-4">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {artist.city}, {artist.state}
              </div>
              {artist.yearsExperience && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {artist.yearsExperience} years exp.
                </div>
              )}
              {artist.instagramHandle && (
                <a 
                  href={`https://instagram.com/${artist.instagramHandle}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  @{artist.instagramHandle}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {artist.styles.map(style => (
              <Badge key={style} variant="secondary" className="bg-secondary/50 font-normal px-4 py-1 text-sm">
                {style}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
              <TabsTrigger 
                value="portfolio" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-serif text-lg"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="about"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-serif text-lg"
              >
                About
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio" className="focus-visible:outline-none">
              {artist.portfolioImages && artist.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {artist.portfolioImages.map((img, i) => (
                    <div key={i} className="relative aspect-[4/5] bg-muted overflow-hidden group rounded-md">
                      <img 
                        src={img} 
                        alt={`${artist.name} portfolio piece ${i + 1}`} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center border border-dashed rounded-lg bg-card/30">
                  <p className="text-muted-foreground font-serif italic">No portfolio images available.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="about" className="focus-visible:outline-none">
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {artist.bio ? (
                  <p className="whitespace-pre-line leading-relaxed text-lg font-light">{artist.bio}</p>
                ) : (
                  <p className="italic">This artist hasn't provided a bio yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 bg-card/40 backdrop-blur sticky top-24">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Book an Appointment</CardTitle>
              <CardDescription>
                {artist.available ? "Currently accepting new clients." : "Books are currently closed."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {artist.hourlyRate && (
                <div className="flex items-center justify-between pb-6 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" /> Hourly Rate
                  </span>
                  <span className="font-medium">${artist.hourlyRate}/hr</span>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium">Services Offered</h4>
                {servicesLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : services && services.length > 0 ? (
                  <ul className="space-y-3">
                    {services.map(service => (
                      <li key={service.id} className="flex justify-between items-start text-sm">
                        <div>
                          <span className="block font-medium">{service.name}</span>
                          <span className="text-muted-foreground text-xs">{service.durationMinutes} mins</span>
                        </div>
                        <span>${service.price}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No specific services listed.</p>
                )}
              </div>

              <Link href={artist.available ? `/book/${artist.id}` : "#"}>
                <Button 
                  className="w-full h-12 text-base" 
                  disabled={!artist.available}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {artist.available ? "Request Booking" : "Books Closed"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
