import React, { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { SignUp } from './Routes/SignUp.js'
import { SignIn } from './Routes/SignIn.js'

function Layout() {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 pt-6">Proceed with TMRW ID</h1>
      <Outlet />
    </div>
  );
}

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </div>
  );
}