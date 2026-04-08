import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AdminLayout } from "@/components/layout/admin-layout";
import Dashboard from "@/pages/dashboard";
import Inquiries from "@/pages/inquiries";
import Events from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import Artists from "@/pages/artists";
import Rigs from "@/pages/rigs";
import SignIn from "@/pages/sign-in";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/sign-in" component={SignIn} />
      <Route path="/">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      <Route path="/inquiries">
        <AdminLayout>
          <Inquiries />
        </AdminLayout>
      </Route>
      <Route path="/events">
        <AdminLayout>
          <Events />
        </AdminLayout>
      </Route>
      <Route path="/events/:id">
        {params => (
          <AdminLayout>
            <EventDetail id={params.id} />
          </AdminLayout>
        )}
      </Route>
      <Route path="/artists">
        <AdminLayout>
          <Artists />
        </AdminLayout>
      </Route>
      <Route path="/rigs">
        <AdminLayout>
          <Rigs />
        </AdminLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
