import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import React, { Suspense } from "react";
import Loading from "./components/loading/Loading";

// Context/Provider
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { GlobalSearchProvider } from "@/contexts/SearchProvider";
import { LoadingProvider } from "./contexts/Loading/LoadingProvider";
import { NotificationsProvider } from "@/contexts/NotificationsProvider";
import { ComposeProviders } from "./contexts/ComposeProviders";

const App: React.FC = () => {
  // The order here is the same as the nesting order (outermost first)
  const providers = [
    LoadingProvider,
    UserProvider,
    NotificationsProvider,
    LanguageProvider,
    GlobalSearchProvider,
  ];

  return (
    <BrowserRouter>
      <ComposeProviders providers={providers}>
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </ComposeProviders>
    </BrowserRouter>
  );
};

export default App;
