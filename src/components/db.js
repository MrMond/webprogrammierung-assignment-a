//https://console.firebase.google.com/u/0/project/webprogrammierung-asignment-a/
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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
const storage = getStorage(app);

//crud functions

// C
export async function uploadPostCard(title_str, imageStr, like_cnt) {
  //upload image to seperate storage
  const primaryKey = uuidv4();
  const storageRef = ref(storage, 'images/' + primaryKey + '.jpeg');
  var downloadURL = null

  // create jpg file out of encoded imageStr
  const byteChars = atob(imageStr.split(",")[1]);
  const byteNmbrs = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNmbrs[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNmbrs);
  const blob = new Blob([byteArray], { type: "image/jpeg" });

  try {
    const snapshot = await uploadBytes(storageRef, blob); //upload to storage
    console.log('File uploaded successfully:', snapshot);

    downloadURL = await getDownloadURL(storageRef); //acts as src for img components
    console.log('Download URL:', downloadURL);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  //upload post card to firebase
  const docRef = await addDoc(collection(db, "Gallery"), {
    imgSrc: downloadURL,
    likes: like_cnt,
    title: title_str
  });
  console.log("Document written with ID: ", docRef.id);
  return docRef.id; //save this in the postcard for downloading it later!!
}

// R
export async function getPostCards() {
  const querySnapshot = await getDocs(collection(db, "Gallery"));
  const postCards = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    let imgSrc = data.imgSrc || "public/error-image.jpg"; //error handling
    return {
      id: doc.id,
      likes: data.likes || 0,
      title: data.title || "",
      imgSrc: imgSrc,
    };
  });
  console.log(postCards)
  return postCards;
}

export async function getFAQTuples() { // only read functionality required
  const querySnapshot = await getDocs(collection(db, "FAQ"));
  const faqTuples = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      question: data.question || "error loading question",
      answer: data.answer || "error loading answer",
    };
  });
  console.log(faqTuples);
  return faqTuples;
}

// U
export async function updatePostCard(title_str, image_src, like_cnt, id) {
  const docRef = doc(db, "Gallery", id);
  await updateDoc(docRef, {
    imgSrc: image_src,
    likes: like_cnt,
    title: title_str
  });
}

// D
export async function deletePostCard(id) {
  const docRef = doc(db, "Gallery", id);
  await deleteDoc(docRef);
}

export default db;