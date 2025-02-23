import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyADUUlwjMhmodNc_P7qQ9yxO7pTkyRxXwA",
    authDomain: "qr-menu-d092c.firebaseapp.com",
    projectId: "qr-menu-d092c",
    storageBucket: "qr-menu-d092c.firebasestorage.app",
    messagingSenderId: "1077847269142",
    appId: "1:1077847269142:web:ce6db47923061b3451fa37",
    measurementId: "G-G7S0EB2WMM"
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics only if it's supported
const analytics = (async () => {
    if (await isSupported()) {
        return getAnalytics(app);
    }
    return null;
})();

export const auth = getAuth(app);
export { analytics };