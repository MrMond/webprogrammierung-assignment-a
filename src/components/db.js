//https://console.firebase.google.com/u/0/project/webprogrammierung-asignment-a/
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
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
export async function uploadPostCard(title_str,imageStr,like_cnt){ 
  //upload image to seperate storage
  const primaryKey = uuidv4();
  const storageRef = ref(storage, 'images/' + primaryKey);
  var downloadURL = null

  try {
    const snapshot = await uploadString(storageRef, imageStr);
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
export async function getPostCards(){
  const querySnapshot = await getDocs(collection(db, "Gallery"));
  const postCards = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    let imgSrc
    try{
      imgSrc = data.imgSrc; // it is faulty here, as I need to download from the link firebase provides first.
      imgSrc = imgSrc.split(',')[1];//remove preamble
      imgSrc = atob(imgSrc);//convert to binary
    } catch {
      imgSrc = "public/error-image.jpg"
    }
    
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