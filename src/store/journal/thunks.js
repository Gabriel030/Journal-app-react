//aca despacho acciones asyncronas

import { async } from "@firebase/util";
import { TornadoTwoTone } from "@mui/icons-material";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { fileUpload } from "../../helpers/fileUpload";
import { loadNotes } from "../../helpers/loadNotes";
import {
  addNewEmptyNote,
  deleteNoteById,
  deletingNote,
  noteDeleted,
  savingNewNote,
  setActiveNote,
  setNotes,
  setPhotosToActiveNotes,
  setSaving,
  updateNote,
} from "./journalSlice";

//se usa start para indicar que se INICIA el proceso
export const startNewNote = () => {
  return async (dispatch, getState) => {
    dispatch(savingNewNote());
    //console.log("startNewNote");
    //getState, es una funcion que me trae datos del usuario en el store
    //console.log(getState());

    const { uid } = getState().auth;

    const newNote = {
      title: "",
      body: "",
      date: new Date().getTime(),
    };

    //establezco el camino a firbase donde quiero guardar la nota
    //este path esta en la base de firebase
    const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`));
    await setDoc(newDoc, newNote);

    //le agrego el id que crea firebase al crear la nota
    newNote.id = newDoc.id;
    //console.log({ newDoc, setDocResp });

    //para crear la nota le paso el payload que seria la nota
    dispatch(addNewEmptyNote(newNote));
    dispatch(setActiveNote(newNote));
    //dispatch

    //dispatch (newNote)

    //dispatch
  };
};

export const startLoadingNotes = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    if (!uid) throw new Error("el UID del usuario no existe");

    const notes = await loadNotes(uid);

    dispatch(setNotes(notes));
  };
};

export const startSaveNote = () => {
  //el gateState es una funcion q me trae los datos el user
  return async (dispatch, getState) => {
    dispatch(setSaving());

    //necesito crear el url para poder llevar la nota a la BD en firebase
    ///BG7DZKGXA9eZ9nlRo8304EtVrSH3/journal/notes

    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    // Anteriormente yo inclui un id en el usuario activo, tengo q eliminarlo
    const noteToFireStore = { ...note };
    //funcion q me permite borrar una clave/valor de un objeto
    delete noteToFireStore.id;
    console.log("guardado");

    //referenciar el documento
    const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);

    //impactar la base de datos
    //el merge lo q hace es combinar, si estoy mandando algo, y en la bd hay algo q no estoy mandando, se mergea, osea se conserva tanto lo q mando como lo q esta en BD
    await setDoc(docRef, noteToFireStore, { merge: true });
    dispatch(updateNote(note));
  };
};

export const startUploadingFiles = (files = []) => {
  return async (dispatch) => {
    dispatch(setSaving());
    console.log(files);

    //MULTIPLES PETICIONES SIMULTANEA

    //await fileUpload(files[0]);

    //EN SECUENCIA, osea un archivo a la vez
    /* 
      files.forEach( async(file) => {
        await fileUpload(file)
      })
    
    */
    // EN SIMULTANEO, todas al mismo tiempo

    const fileUploadPromises = [];

    for (const file of files) {
      //lo que hago haga es crear un array de promesas, NO LAS ESTOY DISPARANDO
      fileUploadPromises.push(fileUpload(file));
    }

    //DISPARO EL ARRAAY DE PROMESES, VAN EN SIMULTANEO
    const photosUrls = await Promise.all(fileUploadPromises);
    //console.log(photosUrls);
    dispatch(setPhotosToActiveNotes(photosUrls));
    //ahora tengo q montar las urls que recibi de cloudinary en la nota activa
  };
};

export const startDeletingNote = () => {
  return async (dispatch, getState) => {
    dispatch(deletingNote());
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    console.log({ uid, note });

    const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);
    await deleteDoc(docRef);
    dispatch(deleteNoteById(note.id));

    dispatch(noteDeleted());
  };
};
