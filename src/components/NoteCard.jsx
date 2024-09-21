import { db } from "../appwrite/databases.js";

import { useRef, useEffect, useState, useContext } from "react";

// COMPONENTS
import DeleteButton from "../components/DeleteButton.jsx";
import Spinner from "../icons/Spinner.jsx";
import { NoteContext } from "../context/NoteContext";

import { setNewOffset, autoGrow, setZIndex, bodyParser } from '../utils.js';


let mouseStartPos = { x: 0, y: 0 };

const NoteCard = ({ note }) => {
    const { setSelectedNote } = useContext(NoteContext);
    const cardRef = useRef(null);
    const textAreaRef = useRef(null);
    const keyUpTimer = useRef(null);


    const body = bodyParser(note.body);
    const colors = JSON.parse(note.colors);
    const [position, setPosition] = useState(JSON.parse(note.positions));

    const [saving, setSaving] = useState(false);


    // CARD FUNCTIONALITIES -> DRAGING, TEXTAREA, OFFSET
    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);
    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
            setZIndex(cardRef.current)
            setSelectedNote(note);


            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        }
    };
    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("positions", newPosition);
    };
    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };

        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        //3 - Update card top and left position.
        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPosition(newPosition);
    };

    // SAVING DATA
    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };
    const handleKeyUp = async () => {
        //1 - Initiate "saving" state
        setSaving(true);

        //2 - If we have a timer id, clear it so we can add another two seconds
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }

        //3 - Set timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);


    };


    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}>
            <div
                className="card-header"
                style={{ backgroundColor: colors.colorHeader }}
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
            >
                <DeleteButton noteId={note.$id} />

                {
                    saving && (
                        <div className="card-saving">
                            <Spinner color={colors.colorText} />
                            <span style={{ color: colors.colorText }}>Saving...</span>
                        </div>
                    )
                }
            </div>

            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    onKeyUp={handleKeyUp}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                ></textarea>
            </div>

        </div>
    )
};

export default NoteCard;
