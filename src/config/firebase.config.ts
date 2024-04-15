import { initializeApp, cert } from "firebase-admin/app";


import serviceAccount from '../config/adminsdk.json';
import * as firebaseAdmin from 'firebase-admin' 

const sv = serviceAccount as firebaseAdmin.ServiceAccount;

export const app = initializeApp({
    credential: cert(sv),
    storageBucket: 'datn-a9176.appspot.com'
})