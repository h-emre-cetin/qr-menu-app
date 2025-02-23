import React, { useState } from 'react';
import { makeAuthenticatedRequest } from '../services/auth';

const AuthTest = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const testAuth = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        'http://localhost:8080/api/test/protected',
        { method: 'GET' }
      );

      const data = await response.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <div>
      <h2>Authentication Test</h2>
      <button onClick={testAuth}>Test Protected Route</button>
      
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Success!</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AuthTest;