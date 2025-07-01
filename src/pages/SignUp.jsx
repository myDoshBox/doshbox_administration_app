// src/components/SignupPage.jsx
import React, { useState } from "react";
import axios from "axios";
import SideContent from "../componet/sideContent";



export default function SignUpPage() {
    return (
        <div className="row"> 
            <div className="col-lg-6 col-sm-12">
                <SideContent/>
            </div>
            <div className="col-lg-6 col-sm-12">
                <Signup/>
            </div>
        </div>
    )
}

 

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsLoading(true);

    try {
      // Simulate API call with 5-second delay
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            data: { message: "Check your mail for verification." },
          });
        }, 5000)
      );

      // If using a real API, uncomment and replace with your endpoint
      // const response = await axios.post("https://your-api.com/signup", {
      //   email,
      //   password,
      // });

      setStatus(response.data.message);
    } catch (error) {
      console.error("Signup error:", error);
      setStatus("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header text-center bg-white">
              <h3>Create an Account as a Mediator</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-success text-white w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2 "
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              {status && (
                <div className="alert alert-info mt-3 text-center" role="alert">
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
