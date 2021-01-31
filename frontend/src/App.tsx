import "./scss/App.scss";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { positions, Provider as AlertProvider, transitions } from "react-alert";

import AlertTemplate from "./components/AlertTemplate/AlertTemplate";
import InputFile from "./components/InputFile/InputFile";
import Report from "./components/Report/Report";
import Test from "./components/Test/Test";
import NotFound from "./components/NotFound/NotFound";

const options: any = {
  position: positions.BOTTOM_RIGHT,
  timeout: 2500,
  offset: '30px',
  transition: transitions.SCALE,
  type: 'error',
};

function App() {
  return (
    <ReduxProvider store={store}>
      <AlertProvider template={AlertTemplate}  {...options}>
        <Router>
          <div className="app">
            <Header />
            <main className="main">
              <Switch>
                <Route path="/" exact>
                  <InputFile />
                </Route>
                <Route path="/report/:id">
                  <Report />
                </Route>
                <Route path="/test" exact>
                  <Test />
                </Route>
                <Route path='/404'>
                  <NotFound />
                </Route>
                <Route path="/login" exact></Route>
                <Route path="/register" exact></Route>
                <Route path="/workspace" exact></Route>

                <Redirect path="*" exact to='/404' />
              </Switch>
            </main>

          </div>
        </Router>
      </AlertProvider>
    </ReduxProvider>
  );
}

export default App;