import { useContext } from "react";

import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases.js"

const Color = ({ color }) => {
    const { selectedNote, notes, setNotes } = useContext(NoteContext)

    const changeColor = () => {

        try {
            const currentNoteIndex = notes.findIndex(
                (note) => note.$id === selectedNote.$id
            );

            const updatedNote = {
                ...notes[currentNoteIndex],
                colors: JSON.stringify(color),
            };

            const newNotes = [...notes];
            newNotes[currentNoteIndex] = updatedNote;
            setNotes(newNotes);

            db.notes.update(selectedNote.$id, {
                colors: JSON.stringify(color),
            });
        } catch (err) {
            alert("You have to select note that you want to change color 🙌")
        }

    };

    return (
        <div
            onClick={changeColor}
            className="color"
            style={{ backgroundColor: color.colorHeader }}
        ></div>
    );
};

export default Color;