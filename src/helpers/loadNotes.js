import { collection, getDocs } from "firebase/firestore/lite";
import { useDispatch } from "react-redux";
import { FirebaseDB } from "../firebase/config";

export const loadNotes = async (uid = "") => {
  if (!uid) throw new Error("el UID del usuario no existe");

  const collecctionRef = collection(FirebaseDB, `${uid}/journal/notes`);
  const docs = await getDocs(collecctionRef);

  const notes = [];
  docs.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() });
  });
  //console.log(notes);
  return notes;
};
