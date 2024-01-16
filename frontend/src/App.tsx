import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Auth from "pages/Auth";

import LoginForm from "features/auth/components/LoginForm";
import RegisterForm from "features/auth/components/RegisterForm";

import { useAppDispatch } from "hooks/store";
import { refreshTokensThunk } from "store/slices/auth";
import { Header } from "./features/header/components/Header";
import { Posts } from "./pages/Posts";
import { PostList } from "./features/post-list/components/PostList";
import { PostDetail } from "./features/post-detail/components/PostDetail";
import { PostAdd } from "./features/post-add/components/PostAdd";
import AuthComponent from "./features/auth/hoc/AuthComponent";

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
      const token = localStorage.getItem('refreshToken')
      if (token) {
          dispatch(refreshTokensThunk())
      }

      const tokenRefreshInterval = setInterval(() => {
          if (token) {
              dispatch(refreshTokensThunk())
          }
      }, 1000 * 60 * 12);

      return () => {
          clearInterval(tokenRefreshInterval);
      };

  }, [dispatch])

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="auth" element={<Auth />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>

          <Route path={"/"} element={<Posts />} >
            <Route path="" element={<PostList />}/>
            <Route path="/posts/add" element={<AuthComponent children={<PostAdd />}/>}/>
            <Route path="/posts/:id" element={<AuthComponent children={<PostDetail />}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
