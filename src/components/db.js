//https://console.firebase.google.com/u/0/project/webprogrammierung-asignment-a/
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCnP15zDG62yvDrxZaqjG5nQ2YRD3zNfrY",
    authDomain: "webprogrammierung-asignment-a.firebaseapp.com",
    projectId: "webprogrammierung-asignment-a",
    storageBucket: "webprogrammierung-asignment-a.appspot.com",
    messagingSenderId: "820037881044",
    appId: "1:820037881044:web:f3717a4192c358defdff41",
    measurementId: "G-90K1YF5LT5"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // evtl noch bucket mitgeben? https://firebase.google.com/docs/storage/web/start?hl=de

//crud functions


// C
export async function uploadPostCard(title_str,image_src,like_cnt){ 
  const docRef = await addDoc(collection(db, "Gallery"), {
    imgSrc: image_src,
    likes: like_cnt,
    title: title_str
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; //mitspeichern!!
}

// R
export async function getPostCards(){
  const querySnapshot = await getDocs(collection(db, "Gallery"));
  const postCards = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      likes: data.likes || 0,
      title: data.title || "",
      imgSrc: data.imgSrc || "public/user1-128x128.jpg",
    };
  });
 return postCards;
}

// U
export async function updatePostCard(title_str,image_src,like_cnt,id){
  const docRef = doc(db, "Gallery", id);
  await updateDoc(docRef, {
    imgSrc: image_src,
    likes: like_cnt,
    title: title_str
  });
}

// D
export async function deletePostCard(id){
  const docRef = doc(db, "Gallery", id);
  await deleteDoc(docRef);
}

export default db;

/*
sessionstorage ersatz

// Open a database
const request = indexedDB.open('myDatabase', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  // Create an object store
  const objectStore = db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = function(event) {
  const db = event.target.result;

  // Add an image to the object store
  const transaction = db.transaction(['images'], 'readwrite');
  const objectStore = transaction.objectStore('images');

  const imageBlob =; // Blob or ArrayBuffer of your image
  const newItem = { image: imageBlob };
  objectStore.add(newItem);

  transaction.oncomplete = function() {
    console.log('Image added to IndexedDB');
  };
};

request.onerror = function(event) {
  console.error('Error opening IndexedDB', event);
};

*/