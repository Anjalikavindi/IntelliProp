import React, { useState }  from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Swal from "sweetalert2";
import './Login.css';

const Login = () => {

  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Email Missing",
        text: "Please enter your email.",
        confirmButtonColor: "#ab9272",
      });
    }

    if (!password.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Password Missing",
        text: "Please enter your password.",
        confirmButtonColor: "#ab9272",
      });
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid email or password",
          confirmButtonColor: "#ab9272",
        });
        return;
      }

      // Success
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to homepage...",
        timer: 2000,
        showConfirmButton: false,
      });

      // Store token if needed
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id); 
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      // Redirect after delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Try again later.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
    <Header/>

    {/* Login Section */}
      <div className="login-wrapper blue-bg">
        <div className="login-container">
          <h2 className="login-title">Login</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group">
              <label>Email</label>
              <input 
                type="text" 
                placeholder="Enter your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {/* Keep Me Logged In + Forgot Password */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Keep me logged in
              </label>

              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button type="submit" className="button login-btn">
              Login
            </button>
          </form>
        </div>
      </div>

    <Footer/>
    </>
  )
}

export default Login
