import { Route, BrowserRouter as Router, Routes } from "react-router";
import { Fragment } from "react";

import "./App.css";
import { ToastContainer } from "react-toastify";
import { routes } from "./routes/routes";
import { NavbarProvider } from "./providers/NavbarProvider";

function App() {
  return (
    <>
      <Router>
        {/* <AuthProvider> */}
        <NavbarProvider>
          <ToastContainer />
          <Routes>
            {routes.map((route, index) => {
              const Page = route.component;
              // Ensure Layout is always a component type. When a route explicitly
              // sets layout to null we use Fragment so JSX accepts it.
              const Layout = (route?.layout ??
                Fragment) as React.ComponentType<{
                children?: React.ReactNode;
              }>;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </NavbarProvider>
        {/* </AuthProvider> */}
      </Router>
    </>
  );
}

export default App;
