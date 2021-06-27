import React, { useEffect, useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import LoadingSpinner from "./shared/components/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import useAuth from "./shared/hooks/auth-hook";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const AuthenticatePage = React.lazy(() =>
  import("./user/pages/AuthenticatePage")
);

const App = () => {
  const [isLoggedIn, user, setUser, token, setToken, login, logout] = useAuth();
  const [splashScreen, setSplashScreen] = useState(true);
  useEffect(() => {
    const oldToken = localStorage.getItem("userToken");
    if (!oldToken) {
      setSplashScreen(false);
      return;
    }
    try {
      let decoded = jwt_decode(oldToken);
      if (decoded.exp > Math.floor(Date.now() / 1000)) {
        setUser({ id: decoded.userId });
        setToken(oldToken);
        login(oldToken);
      }
    } catch (error) {}

    setSplashScreen(false);
  }, [login, setToken, setUser]);

  let routes = null;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>{" "}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/auth" exact>
          <AuthenticatePage />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  if (splashScreen)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setUser, user, login, logout, token, setToken }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
