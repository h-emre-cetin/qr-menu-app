import { signInWithCustomToken, getAuth } from 'firebase/auth';
import '../config/firebase';  // Add this import

export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const auth = getAuth();
    const userCredential = await signInWithCustomToken(auth, data.customToken);
    const idToken = await userCredential.user.getIdToken();

    // Set up token refresh
    auth.onIdTokenChanged(async (user) => {
      if (user) {
        const newToken = await user.getIdToken();
        localStorage.setItem('idToken', newToken);
      }
    });

    return {
      idToken,
      businessId: data.businessId,
      businessName: data.businessName,
      menuId: data.menuId
    };
  } catch (error) {
    throw error;
  }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 401) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const newToken = await user.getIdToken(true);
        localStorage.setItem('idToken', newToken);
        return makeAuthenticatedRequest(url, options);
      } else {
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};