import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./routes/AuthPage";
import HomePage from "./routes/HomePage";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";

import Home from "./routes/Home";
import AllUsers from "./routes/AllUsers";
import CreatePost from "./routes/CreatePost";
import UpdatePost from "./routes/UpdatePost";
import PostDetails from "./routes/PostDetails";
import Profile from "./routes/Profile";
import UpdateProfile from "./routes/UpdateProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            path: "/",
            element: <Home />
          },
          {
            path: "all-users",
            element: <AllUsers />
          },
          {
            path: "create-post",
            element: <CreatePost />
          },
          {
            path: "update-post/:id",
            element: <UpdatePost />
          },
          {
            path: "posts/:id",
            element: <PostDetails />
          },
          {
            path: "profile/:id",
            element: <Profile />
          },
          {
            path: "update-profile/:id",
            element: <UpdateProfile />
          }
        ]
      },
      {
        path: "sign-in",
        element: (
          <AuthPage>
            <SignInForm />
          </AuthPage>
        ),
      },
      {
        path: "sign-up",
        element: (
          <AuthPage>
            <SignUpForm />
          </AuthPage>
        ),
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
