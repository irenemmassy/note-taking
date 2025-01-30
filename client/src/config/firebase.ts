import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  AuthError 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATtKWCMPpWteiyFJEoRqUlCb2OgWj0_eM",
  authDomain: "note-taking-3.firebaseapp.com",
  projectId: "note-taking-3",
  storageBucket: "note-taking-3.firebasestorage.app",
  messagingSenderId: "491074702698",
  appId: "1:491074702698:web:c8067a9ef6946c113aa913"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper function to get error message
const getAuthErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    default:
      return 'Authentication failed. Please try again';
  }
};

// Authentication functions
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to log out');
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
export default app; 