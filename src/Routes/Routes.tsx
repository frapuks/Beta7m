import { Route } from "react-router-dom";
import { Home, SelectPlayers, NewMatch, Login, Dashboard, Account } from "../Pages";

const Router = [
  // { id: 1, mainPath: "*", mainElement: <NoPage /> },
  { id: 2, mainPath: "/", mainElement: <Home /> },
  { id: 3, mainPath: "/SelectPlayers", mainElement: <SelectPlayers /> },
  { id: 4, mainPath: "/NewMatch", mainElement: <NewMatch /> },
  { id: 5, mainPath: "/Login", mainElement: <Login /> },
  { id: 5, mainPath: "/Dashboard", mainElement: <Dashboard /> },
  { id: 5, mainPath: "/Account", mainElement: <Account /> },
];

const mainRoutes = Router.map(({ id, mainPath, mainElement }) => <Route key={id} path={mainPath} element={mainElement} />);

export { Router, mainRoutes };