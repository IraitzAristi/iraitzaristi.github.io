# Bezero Kontuen Kudeatzailea

**Customer account and password manager** · C# / .NET · console application

A program written in C# to manage a company's customer accounts and passwords
(for a company, "AllSecurity"): create accounts, search them, and keep their
credentials organized by platform and type. The project has two versions, and
the interesting part is the jump between them.

## From v1 to v2: the evolution

**v1** solved the problem the most direct way: a single `Program.cs`, data stored
in arrays and a procedural approach. It worked, but everything lived in one file.

**v2** is a full rewrite applying **object-oriented programming**, splitting
responsibilities into modules. That redesign is what turns an exercise into a
project:

- **`Kontua`** — the Account class, with private fields, getters/setters and a
  constructor using null-coalescing (`?? ""`) to guard against null values.
- **`Estatistikak`** — real-time statistics with `Dictionary<string,int>`,
  counting accounts by type and by platform.
- **`Fitxategiak_kudeatu`** — import and export from files, parsing lines with
  `File.ReadAllLines` and `.Split(",")` to persist the data.
- **`Segurtasuna`** — a **security audit** module that walks every account and
  flags those using weak passwords (fewer than 8 characters), reporting how many
  and which ones are insecure.

## What it demonstrates

- Real **object-oriented** design: encapsulation, modularity and separation of
  responsibilities.
- Command of C# data structures: arrays, `List<>` and `Dictionary<>`.
- **File persistence** (import/export) and data parsing.
- A **security mindset**: the password audit module comes from thinking not only
  about "storing data", but about detecting weak credentials.
- The ability to **iterate and refactor**: taking a project from a procedural
  version to a maintainable OOP architecture.

## Technologies

C# · .NET · OOP (classes, getters/setters, modularity) · `List` · `Dictionary` ·
file handling · console interface.

## Code

- Version 2 (current, OOP): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea-v2>
- Version 1 (original, procedural): <https://github.com/IraitzAristi/Bezero-Kontuen-Kudeatzailea>

> Status: in development. v2 keeps growing with new advanced search and
> statistics features.
