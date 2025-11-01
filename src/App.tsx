import React from "react";
import Layout from "./components/Layout";
import Uploader from "./components/uploader/Uploader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Summery from "./components/uploader/Summery";
import UploaderWrapper from "./components/uploader/UploaderWrapper";
import SummeryList from "./components/SummeryList";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <>
     <Routes>
      <Route element={<Layout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<UploaderWrapper />} />
        <Route path="/summery" element={<SummeryList />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
