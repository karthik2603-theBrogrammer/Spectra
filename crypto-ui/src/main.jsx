import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GraphComponent from "./components/Graph.jsx";
import ErrorPage from "./error-page";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import LandingPageComponent from "./components/LandingPageComponent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPageComponent />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: <App />,
  },
  {
    path: "graph/:walletId",
    element: <GraphComponent />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
);
