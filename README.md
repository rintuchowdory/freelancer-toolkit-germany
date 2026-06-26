# Freelancer Toolkit Germany

> **Portfolio-Projekt** für den deutschen Arbeitsmarkt | A professional SaaS toolkit for German freelancers and small businesses.

[![CI — Lint, Type-Check & Build](https://github.com/rintuchowdory/freelancer-toolkit-germany/actions/workflows/ci.yml/badge.svg)](https://github.com/rintuchowdory/freelancer-toolkit-germany/actions/workflows/ci.yml)
[![CD — Deploy to GitHub Pages](https://github.com/rintuchowdory/freelancer-toolkit-germany/actions/workflows/deploy.yml/badge.svg)](https://github.com/rintuchowdory/freelancer-toolkit-germany/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Über das Projekt

**Freelancer Toolkit Germany** ist ein professionelles SaaS-Dashboard für deutsche Freelancer und Kleinunternehmer. Es wurde als Portfolio-Projekt entwickelt, um moderne Webentwicklungskompetenz, deutsches Steuerrecht-Know-how und professionelles UI/UX-Design zu demonstrieren.

Das Projekt konkurriert mit kleinen deutschen SaaS-Tools wie Debitoor, Lexoffice (Basis) und FastBill.

---

## Features

| Modul                       | Beschreibung                                                                   |
| --------------------------- | ------------------------------------------------------------------------------ |
| **Invoice Generator**       | Professionelle Rechnungen nach §14 UStG, PDF-Export, Rechnungsliste mit Status |
| **Kleinunternehmer-Prüfer** | §19 UStG Umsatzgrenzen-Checker mit Jahresprognose und Visualisierung           |
| **USt-Erinnerungen**        | Voranmeldungsfristen, Jahreserklärung, Benachrichtigungseinstellungen          |
| **ELSTER KI-Assistent**     | KI-gestützte Steuerhilfe, FAQ-Datenbank, offizielle Ressourcen                 |
| **Ausgabenkategorisierung** | Betriebsausgaben erfassen, EÜR-Export, steuerliche Absetzbarkeit               |
| **CRM Kontakte**            | Kundenverwaltung, Umsatz pro Kunde, Kommunikationshistorie                     |
| **Dashboard**               | KPI-Übersicht, Umsatz-Charts, Fristen-Kalender, Schnellaktionen                |

---

## Tech Stack

### Frontend

- **React 19** mit TypeScript 5.6
- **Tailwind CSS 4** mit shadcn/ui Komponenten
- **Recharts** für Datenvisualisierungen
- **Wouter** für clientseitiges Routing
- **Framer Motion** für Animationen
- **IBM Plex Sans** + **JetBrains Mono** (Neue Sachlichkeit Design)

### Build & Tooling

- **Vite 7** als Build-Tool
- **pnpm** als Package Manager
- **TypeScript** mit strikter Konfiguration
- **Prettier** für Code-Formatierung

### CI/CD

- **GitHub Actions** — 3 Workflows:
  - `ci.yml` — Lint, TypeScript-Check, Build auf jedem Push
  - `deploy.yml` — Automatisches Deployment auf GitHub Pages bei Push auf `main`
  - `pr-review.yml` — Code-Qualitätsprüfung bei Pull Requests

---

## Design-Philosophie

**Neue Sachlichkeit (New Objectivity)** — Deutsche Funktionalismus-Ästhetik

- Warmes Grau als Hintergrund (`#F7F6F3`) — evoziert Qualitätspapier
- Tiefes Schiefergrau für die Sidebar (`#1C1F26`) — Autorität und Fokus
- Bernstein-Gold als einziger Akzent (`#D4820A`) — deutsche Ingenieurskunst
- IBM Plex Sans für Überschriften — deutsches Erbe
- JetBrains Mono für alle Finanzzahlen — tabellarische Ziffern

---

## Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/rintuchowdory/freelancer-toolkit-germany.git
cd freelancer-toolkit-germany

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm dev

# TypeScript-Check
pnpm check

# Produktions-Build
pnpm build
```

---

## CI/CD Pipeline

```
Push to main
    │
    ├── CI Workflow (ci.yml)
    │   ├── Checkout
    │   ├── Setup Node.js 22 + pnpm
    │   ├── Cache pnpm dependencies
    │   ├── Install dependencies
    │   ├── TypeScript type-check
    │   └── Build production bundle
    │
    └── CD Workflow (deploy.yml)
        ├── Build production bundle
        ├── Configure GitHub Pages
        ├── Upload Pages artifact
        └── Deploy to GitHub Pages
```

---

## Projektstruktur

```
freelancer-toolkit-germany/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI: Lint, TypeCheck, Build
│       ├── deploy.yml      # CD: GitHub Pages Deployment
│       └── pr-review.yml   # PR: Code Quality Check
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx   # Sidebar + Header Shell
│   │   │   └── ui/                   # shadcn/ui Komponenten
│   │   ├── pages/
│   │   │   ├── DashboardHome.tsx     # KPI Dashboard
│   │   │   ├── InvoiceGenerator.tsx  # Rechnungsgenerator
│   │   │   ├── KleinunternehmerChecker.tsx
│   │   │   ├── VatReminders.tsx
│   │   │   ├── ElsterHelper.tsx
│   │   │   ├── ExpenseCategorization.tsx
│   │   │   ├── CrmContacts.tsx
│   │   │   └── Settings.tsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx      # Dark/Light Mode
│   │   ├── App.tsx                   # Router
│   │   └── index.css                 # Design Tokens
│   └── index.html
├── ideas.md                          # Design Brainstorm
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Lizenz

MIT License — Freie Verwendung für Portfolio-Zwecke.

---

_Entwickelt mit React 19, TypeScript, Tailwind CSS 4 und GitHub Actions CI/CD._
