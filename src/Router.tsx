import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: `${process.env.PUBLIC_URL}/`,
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/movies/:movieId",
        element: <Home />,
      },
      {
        path: "tv",
        element: <Tv />,
      },
      {
        path: "/tvs/:tvId",
        element: <Tv />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "search/:tvId",
        element: <Search />,
      },
      {
        path: "search/:movieId",
        element: <Search />,
      },
    ],
  },
]);

export default router;
