import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import "./index.css"
import Landing from './Components/Landing/Landing.tsx'
import NotFoundMsg from './Components/NotFoundMsg/NotFoundMsg.tsx'


const Routes = createBrowserRouter([
  { path: "/", element: <Landing/>},
  { path: "*", element: <NotFoundMsg/>},
  { path: "/SoftwareProjects", element: <NotFoundMsg/>},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    < RouterProvider router={Routes} />
  </StrictMode>,
)
