import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/ui/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
  console.log({data, error})

  if (loading) return null;

  const authUser = false

  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path='/' element={1 ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={1 ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={1 ? <SignUpPage /> : <Navigate to='/' />} />
        <Route
          path='/transaction/:id'
          element={1 ? <TransactionPage /> : <Navigate to='/login' />}
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
