import { db } from "../appwrite/databases";

import { useContext } from "react";

import Trash from "../icons/Trash";
import { NoteContext } from "../context/NoteContext";

const DeleteButton = ({ noteId }) => {
    const { setNotes } = useContext(NoteContext);


    const handleDelete = async (e) => {
        const isConfirmDelete = confirm('Are you sure you want to delete 🚮')
        if (isConfirmDelete) {
            db.notes.delete(noteId);
            setNotes((prevState) =>
                prevState.filter((note) => note.$id !== noteId)
            );
        }
    };

    return (
        <div onClick={handleDelete}>
            <Trash />
        </div>
    );
};

export default DeleteButton;