import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import Inquire from "./pages/inquire";
import Confirm from "./pages/confirm";
import Navbar from "./components/layout/navbar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark selection:bg-primary selection:text-primary-foreground">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/inquire" component={Inquire} />
                <Route path="/confirm" component={Confirm} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </QueryClientProvider>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
