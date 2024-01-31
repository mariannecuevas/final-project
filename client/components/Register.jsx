import React, { useState } from 'react';

function SignIn() {
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleToggleMode = () => {
    setIsSignInMode(!isSignInMode);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4">
                {isSignInMode ? 'Sign In' : 'Getting Started'}
              </h2>
              <form onSubmit={handleSubmit}>
                {isSignInMode ? (
                  <>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username:
                      </label>
                      <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password:
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="newUsername" className="form-label">
                        Username:
                      </label>
                      <input
                        type="text"
                        id="newUsername"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        Password:
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isSignInMode ? 'Sign In' : 'Register'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={handleToggleMode}>
                    {isSignInMode ? 'New User' : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
