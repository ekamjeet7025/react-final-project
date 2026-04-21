import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";
import Revision from "./pages/Revision";
import AITools from "./pages/AITools";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import "./App.css";

function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>

          {/* 🌐 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔐 Protected Routes */}
          <Route element={<ProtectedRoute />}>

            <Route
              path="/"
              element={
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Dashboard />
                  </main>
                </div>
              }
            />

            <Route
              path="/dashboard"
              element={
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Dashboard />
                  </main>
                </div>
              }
            />

            <Route
              path="/subjects"
              element={
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Subjects />
                  </main>
                </div>
              }
            />

            <Route
              path="/tasks"
              element={
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Tasks />
                  </main>
                </div>
              }
            />

            <Route
              path="/revision"
              element={
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Revision />
                  </main>
                </div>
              }
            />

            <Route
              path="/ai-tools"
              element={
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <AITools />
                  </main>
                </div>
              }
            />

          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
      />
    </>
  );
}

export default App;