import React, { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Link } from "react-router-dom";

export function SignIn() {
  return (
    <div>
      <h2>Sign In</h2>
      <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to="/">or Sign up</Link>
    </div>
  );
}