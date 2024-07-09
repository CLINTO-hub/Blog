import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import store from './store.js'
import './index.css'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <ToastContainer theme='dark' position='top-right' autoClose={3000} closeOnClick pauseOnHover={false}/>
    <App />
    </BrowserRouter>  
    </Provider>
  </React.StrictMode>,
)
