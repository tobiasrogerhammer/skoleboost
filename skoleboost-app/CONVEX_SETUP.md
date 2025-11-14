# Convex Setup Guide

## Forutsetninger

**Viktig:** Convex krever Node.js versjon 20 eller høyere. Sjekk din versjon:

```bash
node --version
```

Hvis du har Node.js v18 eller lavere, må du oppgradere:

### Oppgrader Node.js

**Med nvm (anbefalt):**

```bash
# Installer nvm hvis du ikke har det
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Installer Node.js v20
nvm install 20
nvm use 20
```

**Eller last ned fra nodejs.org:**

- Gå til https://nodejs.org/
- Last ned LTS-versjonen (v20 eller høyere)

## Steg 1: Installer Convex CLI

```bash
npm install -g convex
```

## Steg 2: Logg inn på Convex

```bash
npx convex dev
```

Dette vil:

- Spørre deg om å logge inn (hvis du ikke allerede er innlogget)
- Opprette et nytt Convex-prosjekt (hvis du ikke har et)
- Generere en `.env.local` fil med `VITE_CONVEX_URL`
- Generere TypeScript-typer i `convex/_generated/` mappen

**Viktig:** Du må kjøre `npx convex dev` først for å generere API-typene. TypeScript-feil i IDE vil forsvinne når typene er generert.

## Steg 3: Seed databasen

Etter at Convex er satt opp, kan du seede databasen med initial data:

1. Gå til Convex Dashboard: https://dashboard.convex.dev
2. Velg ditt prosjekt
3. Gå til "Functions" og kjør `seed:seedCoupons` og `seed:seedEvents`

Eller bruk Convex CLI:

```bash
npx convex run seed:seedCoupons
npx convex run seed:seedEvents
```

## Steg 4: Start applikasjonen

I en terminal, start Convex dev server:

```bash
npm run convex:dev
```

I en annen terminal, start Vite dev server:

```bash
npm run dev
```

## Autentisering

Appen bruker `@convex-dev/auth` med Password provider. Når du oppretter en ny bruker gjennom login-siden, vil en bruker automatisk bli opprettet i `users` tabellen.

## Database Schema

- **users**: Brukerinformasjon, poeng, oppmøte
- **coupons**: Kafeteria kuponger
- **socialEvents**: Sosiale arrangementer
- **scheduleItems**: Timeplan (klasser, arrangementer, utflukter)
- **couponRedemptions**: Historikk over innløste kuponger
- **eventRegistrations**: Påmeldinger til arrangementer
- **achievements**: Prestasjoner og mål

## Viktige filer

- `convex/schema.ts`: Database schema
- `convex/auth.ts`: Autentiseringskonfigurasjon
- `convex/users.ts`: Bruker-relaterte queries og mutations
- `convex/coupons.ts`: Kupong queries
- `convex/schedule.ts`: Timeplan queries og mutations
- `convex/events.ts`: Arrangement queries og mutations
- `convex/seed.ts`: Seed data for utvikling
