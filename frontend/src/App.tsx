import { Routes,Route } from "react-router-dom";
import AuthCallBackPage from "./pages/auth-callback/AuthCallBackPage";
import HomePage from "./pages/Home/HomePage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}> </Route>
        <Route path='/sso-callback' element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={'/auth-callback'}/>}> </Route>
        <Route path='/auth-callback' element={<AuthCallBackPage/>}> </Route>
      </Routes>

    </>
  )
}

export default App