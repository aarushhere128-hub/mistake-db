// ==========================================
// FIREBASE
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyBIDPgCrrPPv99x9wXM6U8m12HmqaX6cS4",
  authDomain: "mistake-db.firebaseapp.com",
  projectId: "mistake-db",
  storageBucket: "mistake-db.firebasestorage.app",
  messagingSenderId: "151729819129",
  appId: "1:151729819129:web:7a375ed88aa8b28e240128"
};


// ==========================================
// INITIALIZE
// ==========================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// ==========================================
// MISTAKES
// ==========================================

const mistakesCollection =
    collection(db, "mistakes");


export async function addMistakeToDB(data) {

    const docRef =
        await addDoc(
            mistakesCollection,
            data
        );

    return docRef.id;
}


export async function getMistakesFromDB() {

    const snapshot =
        await getDocs(
            mistakesCollection
        );

    return snapshot.docs.map(
        document => ({

            id: document.id,

            ...document.data()

        })
    );
}


export async function deleteMistakeFromDB(
    mistakeId
) {

    await deleteDoc(
        doc(
            db,
            "mistakes",
            mistakeId
        )
    );
}


// ==========================================
// STUDY ENGINE SUBJECTS
// ==========================================

export async function getStudyEngineSubjects() {

    const collectionRef =
        collection(
            db,
            "studyEngineSubjects"
        );

    const snapshot =
        await getDocs(
            collectionRef
        );

    return snapshot.docs.map(
        document => ({

            id: document.id,

            ...document.data()

        })
    );
}
