import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

import aois from "./aois";
import config from "./config";
import global from "./global";
import network from "./network";
import osm from "./osm";

const reducer = combineReducers({
  aois,
  config,
  form,
  network,
  osm,
  router: routerReducer
});

// export a custom reducer function so that globally-reduced values can be hoisted
export default (state = {}, action) => ({
  ...reducer(global(state, action), action)
});
