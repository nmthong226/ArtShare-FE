import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import React, { Suspense } from "react";
import Loading from "./components/loading/Loading";

// Context/Provider
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { UserProvider } from "@/contexts/UserProvider";
import { GlobalSearchProvider } from "@/contexts/SearchProvider";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <LanguageProvider>
          <GlobalSearchProvider>
            <Suspense fallback={<Loading />}>
              <AppRoutes />
            </Suspense>
          </GlobalSearchProvider>
        </LanguageProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
