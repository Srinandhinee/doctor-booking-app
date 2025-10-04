import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import MedicalHistoryPage from "./pages/patient/MedicalHistoryPage";
import AvailabilityPage from "./pages/doctor/AvailabilityPage";
import EarningsPage from "./pages/doctor/EarningsPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import SupportPage from "./pages/admin/SupportPage";
import ReportsPage from "./pages/admin/ReportsPage";
import PatientConsult from "./pages/patient/ConsultRoom";
import DoctorConsult from "./pages/doctor/ConsultRoom";
import WaitingApproval from "./pages/WaitingApproval";
import DoctorGuard from "./components/DoctorGuard";


function Home() {
  return (
    <div>
      <Navbar />
      <section className="about-section">
        <div className="about-overlay">
          <h1>HealConnect</h1>
          <p>Your Health, Our Priority. Book appointments with top specialists instantly and get the care you deserve.</p>
          <div className="about-buttons">
            <Link className="btn btn-primary btn-large" to="/login">Book Appointment</Link>
            <Link className="btn btn-outline btn-large" to="/register">Get Started</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/waiting-approval" element={<WaitingApproval />} />

  <Route element={<ProtectedRoute roles={["patient"]} />}>
    <Route path="/patient" element={<PatientDashboard />} />
    <Route path="/patient/book" element={<BookAppointment />} />
    <Route path="/patient/appointments" element={<MyAppointments />} />
    <Route path="/patient/history" element={<MedicalHistoryPage />} />
    <Route path="/patient/consult" element={<PatientConsult />} />
  </Route>

  <Route element={<ProtectedRoute roles={["doctor"]} />}>
    <Route path="/doctor" element={<DoctorGuard><DoctorDashboard /></DoctorGuard>} />
    <Route path="/doctor/availability" element={<DoctorGuard><AvailabilityPage /></DoctorGuard>} />
    <Route path="/doctor/earnings" element={<DoctorGuard><EarningsPage /></DoctorGuard>} />
    <Route path="/doctor/consult" element={<DoctorGuard><DoctorConsult /></DoctorGuard>} />
  </Route>

  <Route element={<ProtectedRoute roles={["admin"]} />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/payments" element={<PaymentsPage />} />
    <Route path="/admin/support" element={<SupportPage />} />
    <Route path="/admin/reports" element={<ReportsPage />} />
  </Route>
</Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}