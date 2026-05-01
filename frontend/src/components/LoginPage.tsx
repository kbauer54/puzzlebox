// src/components/LoginPage.tsx
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <main className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
              
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="email" placeholder="name@example.com" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" required />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">Login</button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account? <Link to="/register" className="text-decoration-none fw-bold text-warning">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}