import React from 'react';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import Navbar from "./components/Navigation"
const Layout = () => {
  return (
    <>
      <Header />
      <Navbar/>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
