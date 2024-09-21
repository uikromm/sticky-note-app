// import { fakeData as notes } from "../assets/fakeData.js";
import { useEffect, useState, useContext } from "react";

import NoteCard from "../components/NoteCard.jsx";
import Controls from "../components/Controls.jsx";

import { NoteContext } from "../context/NoteContext";



import { db } from "../appwrite/databases";
const NotesPage = () => {
    const { notes, setNotes } = useContext(NoteContext);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await db.notes.list()
        setNotes(response.documents);
    };

    return (
        <div>
            {notes.map((note) => (
                <NoteCard note={note} key={note.$id} />
            ))}

            <Controls />
        </div>
    );
};


export default NotesPage;