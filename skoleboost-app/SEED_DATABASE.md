# Seed Database Guide

For å fylle databasen med initial data, kjør følgende kommandoer:

## Steg 1: Seed kuponger

```bash
npx convex run seed:seedCoupons
```

## Steg 2: Seed arrangementer

```bash
npx convex run seed:seedEvents
```

**For å legge til flere arrangementer** (hvis du allerede har kjørt seedEvents):

```bash
npx convex run seed:addMoreEvents
```

Dette legger til 9 nye arrangementer uten å sjekke om de allerede finnes.

## Steg 3: Seed timeplan og prestasjoner for en bruker

Etter at du har opprettet en bruker (gjennom login-siden), kan du seede timeplan og prestasjoner:

```bash
npx convex run seed:seedScheduleItems --userEmail "din@epost.no"
npx convex run seed:seedAchievements --userEmail "din@epost.no"
```

Eller bruk den kombinerte funksjonen:

```bash
npx convex run seed:seedAllForUser --userEmail "din@epost.no"
```

## Komplett seed-prosess

1. Seed kuponger og arrangementer (kan gjøres før bruker er opprettet):

```bash
npx convex run seed:seedCoupons
npx convex run seed:seedEvents
```

2. Opprett en bruker gjennom login-siden i appen

3. Seed timeplan og prestasjoner for brukeren:

```bash
npx convex run seed:seedAllForUser --userEmail "din@epost.no"
```

## Sjekk data i Convex Dashboard

1. Gå til https://dashboard.convex.dev
2. Velg ditt prosjekt
3. Gå til "Data" i menyen
4. Du skal nå se data i alle tabellene

## Merk

- Seed-funksjonene sjekker om data allerede eksisterer, så du kan kjøre dem flere ganger uten å få duplikater
- Du må være logget inn på Convex for å kjøre disse kommandoene
- `npx convex dev` må kjøre i en annen terminal
- For `seedScheduleItems` og `seedAchievements` må du erstatte `"din@epost.no"` med e-postadressen til brukeren du vil seede data for
