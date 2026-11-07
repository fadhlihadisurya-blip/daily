import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot as required
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears to be offline or network restricted.');
    }
  }
}

// Quick Google Login helper
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Upsert user profile
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Pengguna Mutaba\'ah',
          photoURL: result.user.photoURL || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw error;
  }
}

// Register with Email/Password
export async function registerWithEmail(name: string, email: string, pass: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    if (name.trim()) {
      await updateProfile(user, { displayName: name.trim() });
    }
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || email,
        displayName: name.trim() || 'Pengguna Mutaba\'ah',
        photoURL: '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return user;
  } catch (error) {
    console.error('Email Registration Error:', error);
    throw error;
  }
}

// Login with Email/Password
export async function loginWithEmail(email: string, pass: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error) {
    console.error('Email Login Error:', error);
    throw error;
  }
}

// Update user profile display name
export async function updateUserProfileName(newName: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Pengguna belum login.');

  const trimmed = newName.trim();
  if (!trimmed) throw new Error('Nama lengkap tidak boleh kosong.');

  await updateProfile(user, { displayName: trimmed });
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      displayName: trimmed,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return user;
}

// Change user password with re-authentication
export async function changeUserPassword(currentPass: string, newPass: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Pengguna belum login.');

  if (newPass.length < 6) {
    throw new Error('Password baru minimal 6 karakter.');
  }

  // Re-authenticate first to verify current password
  const credential = EmailAuthProvider.credential(user.email, currentPass);
  await reauthenticateWithCredential(user, credential);

  // Update to new password
  await updatePassword(user, newPass);
  return true;
}

// Quick Logout helper
export async function logoutUser() {
  await signOut(auth);
}
