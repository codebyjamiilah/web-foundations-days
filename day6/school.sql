PRAGMA foreign_keys = ON;

CREATE TABLE students (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    id    INTEGER PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE enrolments (
    id         INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id  INTEGER NOT NULL,
    grade      TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id)  REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);

INSERT INTO students (name, email) VALUES
    ('Amina', 'amina@example.com'),
    ('Brian', 'brian@example.com'),
    ('Chloe', 'chloe@example.com'),
    ('David', 'david@example.com');

INSERT INTO courses (title) VALUES
    ('Maths'),
    ('Art'),
    ('Science');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
    (1, 1, 'A'),
    (1, 2, 'B'),
    (2, 1, 'C'),
    (3, 3, 'B'),
    (3, 1, 'A');

-- 1. All courses for one student (by name)
SELECT courses.title, enrolments.grade
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses    ON courses.id = enrolments.course_id
WHERE students.name = 'Amina';

-- 2. All students on one course
SELECT students.name
FROM courses
JOIN enrolments ON enrolments.course_id = courses.id
JOIN students   ON students.id = enrolments.student_id
WHERE courses.title = 'Maths';

-- 3. Number of students per course
SELECT courses.title, COUNT(enrolments.id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id, courses.title;

-- 4. Students with no enrolments
SELECT students.name
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.id IS NULL;

-- 5. Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 2 AND course_id = 1;