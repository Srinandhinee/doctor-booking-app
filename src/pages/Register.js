import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Register() {
	const { register } = useAuth();
	const nav = useNavigate();
	const [role, setRole] = useState("patient");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [location, setLocation] = useState("");
	const [specialization, setSpecialization] = useState("");
	const [experienceYears, setExperienceYears] = useState(0);
	const [fees, setFees] = useState(0);
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		console.log('Form submitted!'); // Debug log
		setLoading(true);
		setShowSuccess(false);
		
		// Basic validation
		if (!name || !email || !password || !location) {
			alert("Please fill in all required fields.");
			setLoading(false);
			return;
		}
		
		if (role === "doctor" && (!specialization || experienceYears < 0 || fees < 0)) {
			alert("Please fill in all doctor-specific fields with valid values.");
			setLoading(false);
			return;
		}
		
		console.log('Validation passed, proceeding with registration...'); // Debug log
	  
		const payload = {
		  email,
		  password,
		  role,
		  profile:
			role === "patient"
			  ? { name, location }
			  : { name, location, specialization, experienceYears: Number(experienceYears), consultationFees: Number(fees) }
		};
	  
		try {
		  console.log('Sending registration request with payload:', payload); // Debug log
		  const res = await register(payload);
		  
		  console.log('Registration response:', res); // Debug log
		  
		  // Show success message based on role
		  if (role === "patient") {
			setSuccessMessage(`🎉 Welcome to HealConnect, ${name}! Your patient account has been created successfully. You can now book appointments with qualified doctors.`);
		  } else if (role === "doctor") {
			setSuccessMessage(`🎉 Welcome to HealConnect, Dr. ${name}! Your doctor account has been created successfully. Your profile is pending admin approval. You'll be notified once approved.`);
		  }
		  
		  setShowSuccess(true);
		  
		  // Redirect after showing success message
		  setTimeout(() => {
			if (role === "patient") {
			  nav("/patient");
			} else if (role === "doctor") {
			  nav("/waiting-approval");
			}
		  }, 3000); // 3 second delay to let user read the message
		  
		} catch (err) {
		  console.error('Registration error:', err); // Debug log
		  console.error('Error response:', err.response); // Debug log
		  if (err.response && err.response.data && err.response.data.message) {
			alert(`Registration failed: ${err.response.data.message}`);
		  } else if (err.message) {
			alert(`Registration failed: ${err.message}`);
		  } else {
			alert("Something went wrong. Please try again.");
		  }
		} finally {
		  setLoading(false);
		}
	  }	  

return (
	<DashboardLayout>
		<h2 className="hc-page-title">Create your account</h2>
		
		{showSuccess ? (
  <div className="form-container">
    <div className="hc-card">
      <div className="success-banner">
        <div className="success-icon">🎉</div>
        <h3>Account Created Successfully!</h3>
        <p>{successMessage}</p>
        <div className="redirect-info">
          <p>Redirecting you to your dashboard...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  </div>
) : (
  <div className="form-container">
    <form className="hc-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Account Type</label>
        <select 
          className="form-select"
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="patient">👤 Patient</option>
          <option value="doctor">👨‍⚕️ Doctor</option>
        </select>
        <div className="form-help">Choose your account type</div>
      </div>

      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input 
          className="form-input"
          placeholder="Enter your full name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <div className="form-help">This will be displayed on your profile</div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input 
          className="form-input"
          placeholder="Enter your email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <div className="form-help">Used for login and notifications</div>
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input 
          className="form-input"
          placeholder="Create a strong password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <div className="form-help">Minimum 6 characters</div>
      </div>

      <div className="form-group">
        <label className="form-label">Location</label>
        <input 
          className="form-input"
          placeholder="Enter your city/location" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
        />
        <div className="form-help">Help patients find doctors nearby</div>
      </div>

      {role === 'doctor' && (
        <>
          <div className="form-group">
            <label className="form-label">Medical Specialization</label>
            <input 
              className="form-input"
              placeholder="e.g., Cardiology, Pediatrics, Dermatology" 
              value={specialization} 
              onChange={(e) => setSpecialization(e.target.value)} 
            />
            <div className="form-help">Your area of medical expertise</div>
          </div>

          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input 
              className="form-input"
              placeholder="Enter years of experience" 
              type="number" 
              min="0"
              value={experienceYears} 
              onChange={(e) => setExperienceYears(e.target.value)} 
            />
            <div className="form-help">Your professional experience in years</div>
          </div>

          <div className="form-group">
            <label className="form-label">Consultation Fees (₹)</label>
            <input 
              className="form-input"
              placeholder="Enter consultation fee" 
              type="number" 
              min="0"
              value={fees} 
              onChange={(e) => setFees(e.target.value)} 
            />
            <div className="form-help">Fee per consultation in Indian Rupees</div>
          </div>
        </>
      )}

      <button 
        className="hc-btn btn-primary btn-large" 
        type="submit"
        disabled={loading}
      >
        {loading ? '🔄 Creating Account...' : '✨ Create Account'}
      </button>
    </form>
  </div>
		)}
	</DashboardLayout>
);
}


