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

let subjects = [];


// ==========================================
// DOM
// ==========================================

const subjectSelect =
    document.getElementById(
        "mistakeSubject"
    );

const chapterSelect =
    document.getElementById(
        "mistakeChapter"
    );

const saveMistakeBtn =
    document.getElementById(
        "saveMistakeBtn"
    );

const mistakesList =
    document.getElementById(
        "mistakesList"
    );


// ==========================================
// LOAD STUDY ENGINE DATA
// ==========================================

async function loadStudyEngineData() {

    try {

        const latestSubjects =
            await getStudyEngineSubjects();

        subjects =
            Array.isArray(latestSubjects)
                ? latestSubjects
                : [];

        populateSubjects();

        renderSubjectChapterList();

    } catch (error) {

        console.error(
            "Failed to load Study Engine data:",
            error
        );

        subjectSelect.innerHTML = `

            <option value="">
                Failed to load subjects
            </option>

        `;

        renderSubjectChapterList();

    }

}


// ==========================================
// POPULATE SUBJECT DROPDOWN
// ==========================================

function populateSubjects() {

    subjectSelect.innerHTML = `

        <option value="">
            Select subject
        </option>

    `;


    subjects.forEach(
        subject => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                subject.id;

            option.textContent =
                subject.name;

            subjectSelect.appendChild(
                option
            );

        }
    );

}


// ==========================================
// POPULATE CHAPTER DROPDOWN
// ==========================================

function populateChapters() {

    const subjectId =
        subjectSelect.value;


    chapterSelect.innerHTML = "";


    if (!subjectId) {

        chapterSelect.innerHTML = `

            <option value="">
                Select a subject first
            </option>

        `;

        return;

    }


    const subject =
        subjects.find(
            subject =>
                subject.id === subjectId
        );


    if (
        !subject ||
        !Array.isArray(subject.chapters) ||
        subject.chapters.length === 0
    ) {

        chapterSelect.innerHTML = `

            <option value="">
                No chapters available
            </option>

        `;

        return;

    }


    chapterSelect.innerHTML = `

        <option value="">
            Select chapter
        </option>

    `;


    subject.chapters.forEach(
        chapter => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                chapter.id;

            option.textContent =
                chapter.name;

            chapterSelect.appendChild(
                option
            );

        }
    );

}


// ==========================================
// RENDER SUBJECT + CHAPTER LIST
// ==========================================

function renderSubjectChapterList() {

    const container =
        document.getElementById(
            "subjectsList"
        );


    if (!container) {

        console.warn(
            "subjectsList element not found."
        );

        return;

    }


    container.innerHTML = "";


    if (subjects.length === 0) {

        container.innerHTML = `

            <p class="empty-message">
                No subjects found.
            </p>

        `;

        return;

    }


    subjects.forEach(
        subject => {

            const group =
                document.createElement(
                    "div"
                );

            group.className =
                "subject-group";


            // ==================================
            // SUBJECT HEADER
            // ==================================

            const header =
                document.createElement(
                    "button"
                );

            header.type =
                "button";

            header.className =
                "subject-header";


            const chapters =
                Array.isArray(
                    subject.chapters
                )
                    ? subject.chapters
                    : [];


            header.innerHTML = `

                <span class="subject-header-left">

                    <span class="arrow">
                        ▶
                    </span>

                    ${escapeHTML(
                        subject.name
                    )}

                </span>

                <span class="subject-header-right">

                    ${chapters.length}
                    chapter${chapters.length === 1 ? "" : "s"}

                </span>

            `;


            // ==================================
            // CHAPTER CONTAINER
            // ==================================

            const chapterContainer =
                document.createElement(
                    "div"
                );

            chapterContainer.className =
                "subject-chapters hidden";


            // ==================================
            // TOGGLE SUBJECT
            // ==================================

            header.addEventListener(
                "click",
                () => {

                    const isHidden =
                        chapterContainer.classList.contains(
                            "hidden"
                        );


                    chapterContainer.classList.toggle(
                        "hidden"
                    );


                    const arrow =
                        header.querySelector(
                            ".arrow"
                        );


                    if (arrow) {

                        arrow.textContent =
                            isHidden
                                ? "▼"
                                : "▶";

                    }

                }
            );


            // ==================================
            // CHAPTERS
            // ==================================

            if (chapters.length === 0) {

                chapterContainer.innerHTML = `

                    <div class="empty-message">

                        No chapters added yet.

                    </div>

                `;

            } else {

                chapters.forEach(
                    chapter => {

                        const chapterItem =
                            document.createElement(
                                "div"
                            );

                        chapterItem.className =
                            "chapter-item";


                        chapterItem.innerHTML = `

                            <span>
                                ${escapeHTML(
                                    chapter.name
                                )}
                            </span>

                        `;


                        chapterContainer.appendChild(
                            chapterItem
                        );

                    }
                );

            }


            group.appendChild(
                header
            );

            group.appendChild(
                chapterContainer
            );


            container.appendChild(
                group
            );

        }
    );

}


// ==========================================
// LOAD MISTAKES
// ==========================================

async function loadMistakes() {

    mistakesList.innerHTML =
        "<p>Loading mistakes...</p>";


    try {

        mistakes =
            await getMistakesFromDB();


        if (!Array.isArray(mistakes)) {

            mistakes = [];

        }


        renderMistakes();

    } catch (error) {

        console.error(error);

        mistakesList.innerHTML =
            "<p>Failed to load mistakes.</p>";

    }

}


// ==========================================
// RENDER MISTAKES
// ==========================================

function renderMistakes() {

    if (mistakes.length === 0) {

        mistakesList.innerHTML =
            "<p>No mistakes recorded yet.</p>";

        return;

    }


    mistakesList.innerHTML = "";


    mistakes.forEach(
        mistake => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "mistake-card";


            const subject =
                subjects.find(
                    s =>
                        s.id ===
                        mistake.subjectId
                );


            const chapter =
                subject?.chapters?.find(
                    c =>
                        c.id ===
                        mistake.chapterId
                );


            div.innerHTML = `

                <h3>
                    ${escapeHTML(
                        mistake.question
                    )}
                </h3>

                <p>

                    <strong>
                        ${escapeHTML(
                            subject?.name ||
                            "Unknown subject"
                        )}
                    </strong>

                    —

                    ${escapeHTML(
                        chapter?.name ||
                        "Unknown chapter"
                    )}

                </p>

                <p>

                    <strong>
                        Type:
                    </strong>

                    ${escapeHTML(
                        mistake.mistakeType ||
                        "Not specified"
                    )}

                </p>

                <p>

                    <strong>
                        What went wrong:
                    </strong>

                    ${escapeHTML(
                        mistake.explanation ||
                        "Not recorded"
                    )}

                </p>

                <p>

                    <strong>
                        How to fix:
                    </strong>

                    ${escapeHTML(
                        mistake.fix ||
                        "Not recorded"
                    )}

                </p>

                <button
                    class="delete-btn"
                    data-id="${escapeHTML(
                        mistake.id
                    )}"
                >
                    Delete
                </button>

            `;


            div
                .querySelector(
                    ".delete-btn"
                )
                .addEventListener(
                    "click",
                    () =>
                        deleteMistake(
                            mistake.id
                        )
                );


            mistakesList.appendChild(
                div
            );

        }
    );

}


// ==========================================
// SAVE MISTAKE
// ==========================================

async function saveMistake() {

    const subjectId =
        subjectSelect.value;


    const chapterId =
        chapterSelect.value;


    const question =
        document
            .getElementById(
                "mistakeQuestion"
            )
            .value
            .trim();


    const mistakeType =
        document
            .getElementById(
                "mistakeType"
            )
            .value;


    const explanation =
        document
            .getElementById(
                "mistakeExplanation"
            )
            .value
            .trim();


    const fix =
        document
            .getElementById(
                "mistakeFix"
            )
            .value
            .trim();


    if (!subjectId) {

        alert(
            "Select a subject."
        );

        return;

    }


    if (!chapterId) {

        alert(
            "Select a chapter."
        );

        return;

    }


    if (!question) {

        alert(
            "Enter the question or problem."
        );

        return;

    }


    const mistake = {

        subjectId:
            subjectId,

        chapterId:
            chapterId,

        question:
            question,

        mistakeType:
            mistakeType,

        explanation:
            explanation,

        fix:
            fix,

        priority:
            1,

        timesRepeated:
            0,

        createdAt:
            new Date().toISOString(),

        lastReviewed:
            null

    };


    saveMistakeBtn.disabled =
        true;


    saveMistakeBtn.textContent =
        "Saving...";


    try {

        await addMistakeToDB(
            mistake
        );


        document
            .getElementById(
                "mistakeQuestion"
            )
            .value = "";


        document
            .getElementById(
                "mistakeExplanation"
            )
            .value = "";


        document
            .getElementById(
                "mistakeFix"
            )
            .value = "";


        await loadMistakes();


    } catch (error) {

        console.error(error);

        alert(
            "Failed to save mistake."
        );

    }


    saveMistakeBtn.disabled =
        false;


    saveMistakeBtn.textContent =
        "Save Mistake";

}


// ==========================================
// DELETE MISTAKE
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

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// EVENTS
// ==========================================

subjectSelect.addEventListener(
    "change",
    populateChapters
);


saveMistakeBtn.addEventListener(
    "click",
    saveMistake
);


// ==========================================
// INITIAL LOAD
// ==========================================

async function initialize() {

    await loadStudyEngineData();

    await loadMistakes();

}


initialize();
