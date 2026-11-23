// import { cert, getApps, initializeApp } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';

// function getAdminApp() {
//   if (getApps().length) return getApps()[0];
//   const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
//   if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
//     throw new Error('Missing Firebase Admin environment variables.');
//   }
//   return initializeApp({
//     credential: cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey,
//     }),
//   });
// }

// export const adminDb = getFirestore(getAdminApp());



import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  const existingApp = getApps().find(
    (app) => app.name === '[DEFAULT]'
  );

  if (existingApp) return existingApp;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  '\n'
);

  // if (
  //   !process.env.FIREBASE_PROJECT_ID ||
  //   !process.env.FIREBASE_CLIENT_EMAIL ||
  //   !privateKey
  // ) {
  //   throw new Error('Missing Firebase Admin environment variables.');
  // }

  console.log('Firebase Admin environment check:', {
  projectId: Boolean(process.env.FIREBASE_PROJECT_ID),
  clientEmail: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
  privateKey: Boolean(privateKey),
});

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !privateKey
) {
  throw new Error('Missing Firebase Admin environment variables.');
}

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_target, property) {
    const db = getFirestore(getAdminApp());
    const value = Reflect.get(db, property, db);

    return typeof value === 'function' ? value.bind(db) : value;
  },
});
