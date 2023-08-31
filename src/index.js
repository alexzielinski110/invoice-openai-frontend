import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import store, { history } from './store'
import App from "App"

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

import './index.css'

const target = document.querySelector('#root')

render(
  <BrowserRouter>
    <MaterialUIControllerProvider store={store}>
      <App />
    </MaterialUIControllerProvider>
  </BrowserRouter>,
  target
)

// render(
//   <Provider store={store}>
//     <ConnectedRouter history={history}>
//       <div>
//         <App />
//       </div>
//     </ConnectedRouter>
//   </Provider>,
//   target
// )
