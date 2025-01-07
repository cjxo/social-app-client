import sb from "./lib/supabase";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      {/*
      <ul>
        {countries.map((country) => (
          <li key={country.name}>{country.name}</li>
        ))}
      </ul>*/}

      <Outlet />
    </div>
  )
};

export default App;