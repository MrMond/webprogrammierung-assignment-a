import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

async function uploadPostCard(title_str,image_src,like_cnt){
  const docRef = await addDoc(collection(db, "Gallery"), {
    imgSrc: image_src,
    likes: like_cnt,
    title: title_str
    });
    console.log("Document written with ID: ", docRef.id);
}


export default uploadPostCard;