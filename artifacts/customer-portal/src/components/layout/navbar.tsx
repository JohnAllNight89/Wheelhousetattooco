import { Link } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scissors, User as UserIcon, Calendar, LogOut } from "lucide-react";

export default function Navbar() {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl tracking-tight font-medium hidden sm:inline-block">
              Wheelhouse
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/browse"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Artists
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-full font-medium">
                Get Started
              </Button>
            </Link>
          </Show>

          <Show when="signed-in">
            <Link href="/browse" className="md:hidden">
              <Button variant="ghost" size="icon">
                <Scissors className="w-5 h-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                    <AvatarFallback>{user?.firstName?.charAt(0) || <UserIcon className="w-4 h-4" />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/appointments" className="cursor-pointer w-full flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Appointments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Show>
        </div>
      </div>
    </header>
  );
}
