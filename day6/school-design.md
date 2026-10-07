# School Database Design

## Tables

**students** stores each person who attends. It has an id (primary key),
a name, and a unique email so two students can't share one.

**courses** stores each subject offered. It has an id (primary key) and a title.

**enrolments** records that a student joined a course. It holds a
student_id and course_id (both foreign keys) plus the grade. A UNIQUE
rule on the pair stops a student enrolling on the same course twice.

## Relationships

- One student can have many enrolments, and one course can have many
  enrolments. Each of these is **one-to-many**.
- Between students and courses the relationship is **many-to-many**:
  a student takes many courses, and a course has many students.
- A relational table can't hold "a list of courses" in one cell cleanly,
  so we need a **join table** (enrolments). It turns one many-to-many
  into two one-to-many links, and it is also the natural place to store
  data about the link itself, like the grade.

## Index

I would add an index on `enrolments(course_id)`. Queries like "all
students on this course" and "students per course" search enrolments by
course_id. Without an index the database checks every row; with one it
jumps straight to the matching rows.

## SQL or NoSQL?

I would choose SQL. The data is highly structured and connected:
students, courses and enrolments always relate in the same way, and
I need rules such as unique emails and no duplicate enrolments. SQL
enforces these automatically with keys and constraints, and handles
JOINs and counts well. NoSQL is better for flexible, changing data or
huge scale, but this system needs consistency and clear relationships
more than flexibility.