// ==========================================
// MISTAKE DB
// ==========================================

import {
    addMistakeToDB,
    getMistakesFromDB,
    deleteMistakeFromDB,
    getStudyEngineSubjects
} from "./firebase.js";


// ==========================================
// STATE
// ==========================================

let mistakes = [];


// ==========================================
// DOM
// ==========================================

const addMistakeBtn =
    document.getElementById("addMistakeBtn");

const mistakesList =
    document.getElementById("mistakesList");


// ==========================================
// LOAD MISTAKES
// ==========================================

async function loadMistakes() {

    mistakesList.innerHTML =
        "<p>Loading mistakes...</p>";

    try {

        mistakes =
            await getMistakesFromDB();

        renderMistakes();

    } catch (error) {

        console.error(error);

        mistakesList.innerHTML =
            "<p>Failed to load mistakes.</p>";

    }
}


// ==========================================
// RENDER
// ==========================================

function renderMistakes() {

    if (mistakes.length === 0) {

        mistakesList.innerHTML =
            "<p>No mistakes recorded yet.</p>";

        return;
    }


    mistakesList.innerHTML = "";


    mistakes.forEach(mistake => {

        const div =
            document.createElement("div");

        div.className =
            "mistake-card";


        div.innerHTML = `

            <h3>
                ${escapeHTML(
                    mistake.question || "Untitled mistake"
                )}
            </h3>

            <p>
                <strong>Type:</strong>
                ${escapeHTML(
                    mistake.mistakeType || "Not specified"
                )}
            </p>

            <p>
                <strong>How to fix:</strong>
                ${escapeHTML(
                    mistake.fix || "Not specified"
                )}
            </p>

            <button
                class="delete-btn"
                data-id="${mistake.id}"
            >
                Delete
            </button>

        `;


        const deleteButton =
            div.querySelector(".delete-btn");


        deleteButton.addEventListener(
            "click",
            () => deleteMistake(mistake.id)
        );


        mistakesList.appendChild(div);

    });
}


// ==========================================
// ADD MISTAKE
// ==========================================

async function addMistake() {

    const question =
        prompt("What was your mistake?");


    if (!question ||
        !question.trim()) {

        return;
    }


    const mistakeType =
        prompt(
            "Mistake type?\n\nExample: Conceptual, Calculation, Memory"
        );


    const fix =
        prompt(
            "How should you fix it?"
        );


    const mistake = {

        question:
            question.trim(),

        mistakeType:
            mistakeType
                ? mistakeType.trim()
                : "",

        fix:
            fix
                ? fix.trim()
                : "",

        priority: 1,

        timesRepeated: 0,

        createdAt:
            new Date().toISOString(),

        lastReviewed: null

    };


    try {

        await addMistakeToDB(
            mistake
        );

        await loadMistakes();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to save mistake."
        );

    }
}


// ==========================================
// DELETE
// ==========================================

async function deleteMistake(
    mistakeId
) {

    const confirmed =
        confirm(
            "Delete this mistake?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteMistakeFromDB(
            mistakeId
        );

        await loadMistakes();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete mistake."
        );

    }
}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ==========================================
// EVENTS
// ==========================================

addMistakeBtn.addEventListener(
    "click",
    addMistake
);


// ==========================================
// START
// ==========================================

loadMistakes();
