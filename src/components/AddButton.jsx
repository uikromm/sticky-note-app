
import { db } from "../appwrite/databases.js";

import { useContext, useRef } from "react";

import Plus from "../icons/Plus.jsx";
import colors from "../assets/colors.json";

import { NoteContext } from "../context/NoteContext";

const AddButton = () => {
    const startingPos = useRef(10);
    const { setNotes } = useContext(NoteContext);

    const randomColor = Math.floor(Math.random() * 4);

    const addNote = async () => {
        const payload = {
            positions: JSON.stringify({
                x: startingPos.current,
                y: startingPos.current,
            }),
            colors: JSON.stringify(colors[randomColor])
        };

        startingPos.current += 10;

        const response = await db.notes.create(payload);
        setNotes((prevState) => [response, ...prevState]);
    };

    return (
        <div id="add-btn" onClick={addNote}>
            <Plus />
        </div>
    );
};

export default AddButton;