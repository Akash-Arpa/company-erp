import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter, Routes, Route } from "react-router";
import {Route, RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Report, { stockLoader } from './components/report/Report.jsx'
import Home from "./components/Home.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/",
    element: <Home />,
    children:[{
      path: "report",
      element: <Report />,
      // action: stockAction,
      loader: stockLoader
    }]
  }
])

// console.log(stockLoader());

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>
)