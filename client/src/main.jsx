import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Home from "./pages/Home.jsx";
import Video from "./pages/Video.jsx";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Search from "./pages/Search.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignInWrapper from "./pages/SignInWrapper.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home type="random" />} />
      <Route path="trend" element={<Home type="trend" />} />
      <Route path="sub" element={<Home type="sub" />} />
      <Route path="history" element={<History />} />
      <Route path="profile" element={<Profile />} />
      <Route path="search" element={<Search />} />
      <Route path="video/:id" element={<Video />} />
      <Route path="signin" element={<SignInWrapper />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
