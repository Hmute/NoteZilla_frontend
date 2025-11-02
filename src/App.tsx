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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UploaderWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summery"
            element={
              <ProtectedRoute>
                <SummeryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
