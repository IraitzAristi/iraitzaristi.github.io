# Bezero Kontuen Kudeatzailea

**Client account & password manager** · C#/.NET · console application

A program written in C# to manage the client accounts and passwords of a company
("AllSecurity"): create and search accounts, and keep their credentials organized
by platform and type. The project has two versions, and the interesting part is
the jump between them.

## From v1 to v2: the process

**v1** solved the problem the most direct way: a single `Program.cs`, data stored
in arrays, procedural code. It worked, but everything lived in one file.

**v2** is a full rewrite, applying **object-oriented programming** and splitting
the code into modules.

- **`Kontua`** (Account): the Account class, with private fields, getters/setters
  and a constructor using `?? ""` to guard against null values.
- **`Estatistikak`** (Statistics): real-time statistics using
  `Dictionary<string,int>`, counting accounts by type and by platform.
- **`Fitxategiak_kudeatu`** (File handling): imports from and exports to files.
- **`Segurtasuna`** (Security): a **security-audit** module that analyzes every
  account and flags those with weak passwords (fewer than 8 characters). It scores
  each password and gives security recommendations.

## What it demonstrates

- **OOP** design: encapsulation and modularity.
- C# data structures: arrays, `List<>` and `Dictionary<>`.
- **File persistence**: (import/export) and data analysis.
- **Security mindset**: the password-audit module came from thinking about how to
  detect weak credentials.
- **Iteration and refactoring**: taking a project from a procedural version to a
  maintainable OOP architecture.

## Technologies

C# · .NET · OOP (classes, getters/setters, modularity) · `List` · `Dictionary` ·
file handling · console interface.

## Code

- v2 (OOP): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea-v2>
- v1 (procedural): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea>

> Status: in development. v2 keeps growing with new advanced-search and statistics features.
