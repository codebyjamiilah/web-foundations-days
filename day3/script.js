// ===== Starting data =====
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const CATEGORIES = ["personal", "work", "study"];

// Helper: trim, squash repeated spaces into one, lower-case
function normalize(text) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

// ===== 1. searchNotes =====
// Returns every note whose text contains the word (case-insensitive).
function searchNotes(word) {
  const target = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(target));
}

// ===== 2. longestNote =====
// Returns the note object with the most characters, or null if there are none.
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// ===== 3. countByCategory =====
// Returns an object such as { personal: 2, study: 2, work: 1 }.
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category] === undefined) {
      counts[note.category] = 0;
    }
    counts[note.category]++;
  }
  return counts;
}

// ===== 4. getSummary =====
// Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";
  const parts = [];
  for (const category of CATEGORIES) {
    if (counts[category]) {
      parts.push(`${counts[category]} ${category}`);
    }
  }
  if (parts.length === 0) {
    return `${notes.length} ${word}.`;
  }
  return `${notes.length} ${word}: ${parts.join(", ")}.`;
}

// ===== 5. isDuplicate =====
// True if a note with the same text exists (ignoring case and extra spaces).
function isDuplicate(text) {
  const target = normalize(text);
  return notes.some((note) => normalize(note.text) === target);
}

// ===== 6. addNote =====
// Adds a note only if all rules pass. Returns true if added, false otherwise.
function addNote(text, category) {
  if (typeof text !== "string") {
    console.log("Not added: text must be a string.");
    return false;
  }
  const cleaned = text.trim();
  if (cleaned.length < 1 || cleaned.length > 200) {
    console.log("Not added: text must be 1-200 characters.");
    return false;
  }
  if (isDuplicate(cleaned)) {
    console.log("Not added: a note with this text already exists.");
    return false;
  }
  if (!CATEGORIES.includes(category)) {
    console.log("Not added: category must be personal, work or study.");
    return false;
  }
  const nextId = notes.length === 0 ? 1 : Math.max(...notes.map((n) => n.id)) + 1;
  notes.push({ id: nextId, text: cleaned, category: category });
  return true;
}

// ===== TESTS =====
// (Expected output is written in the comment next to each call.)

console.log("--- searchNotes ---");
console.log(searchNotes("MILK")); // [ { id: 1, text: "Buy milk and bread", category: "personal" } ]
console.log(searchNotes("zebra")); // [] (no results)

console.log("--- longestNote ---");
console.log(longestNote()); // { id: 3, text: "Email the project report to Grace", category: "work" }
const savedNotes = notes; // keep the real list safe
notes = [];
console.log(longestNote()); // null (empty list)
notes = savedNotes;

console.log("--- countByCategory ---");
console.log(countByCategory()); // { personal: 2, study: 2, work: 1 }
notes = [];
console.log(countByCategory()); // {} (empty list)
notes = savedNotes;

console.log("--- getSummary ---");
console.log(getSummary()); // "5 notes: 2 personal, 1 work, 2 study."
notes = [savedNotes[0]];
console.log(getSummary()); // "1 note: 1 personal."
notes = savedNotes;

console.log("--- isDuplicate ---");
console.log(isDuplicate("  call   MUM ")); // true (case and extra spaces ignored)
console.log(isDuplicate("Walk the dog")); // false (not in the list)

console.log("--- addNote ---");
console.log(addNote("Water the plants", "personal")); // true
console.log(addNote("  water   THE plants ", "personal")); // logs duplicate reason, then false
console.log(addNote("   ", "work")); // logs length reason, then false
console.log(addNote("a".repeat(201), "work")); // logs length reason, then false
console.log(addNote("Plan the holiday", "home")); // logs category reason, then false

console.log("--- after adding ---");
console.log(getSummary()); // "6 notes: 3 personal, 1 work, 2 study."
