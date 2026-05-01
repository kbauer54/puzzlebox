// src/components/RegisterPage.tsx
import type { User } from '../types';

type Props = {
  onLogin: (u: User) => void;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function RegisterPage({ onLogin, onClose, onSwitchToLogin }: Props) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary mock registration
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const mockUser: User = { uid: '456', name: username, coins: 0, isBanned: false, role: 'registered' };
    onLogin(mockUser);
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0 rounded-3">
          
          <div className="modal-header border-0 pb-0">
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body p-4 p-md-5 pt-0">
            <h2 className="text-center mb-4 fw-bold">Create Account</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" required />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="confirmPassword" required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-warning btn-lg fw-bold">Sign Up</button>
              </div>
            </form>
            
            <div className="text-center mt-4">
              <p className="mb-0">
                Already have an account?{' '}
                <button className="btn btn-link text-decoration-none fw-bold p-0 align-baseline" onClick={onSwitchToLogin}>
                  Log in here
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}