import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function WaitingApproval() {
  const nav = useNavigate();

  return (
    <DashboardLayout>
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Your account is pending admin approval</h2>
        <p>
          Thank you for registering as a doctor. Your account is under review.
          Once approved by the admin, you will be able to log in and access your dashboard.
        </p>
        <button
          className="hc-btn"
          onClick={() => {
            nav("/"); // redirect to homepage or login
          }}
        >
          Back to Home
        </button>
      </div>
    </DashboardLayout>
  );
}
