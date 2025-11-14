# 🔧 Løsning for innloggingsfunksjonen

## Problemet
`getUserIdentity()` returnerer `null` i Convex queries/mutations, noe som betyr at Convex ikke klarer å verifisere JWT tokenet fra Clerk.

## Løsning 1: Legg til `aud: "convex"` i JWT Template (ANBEFALT)

Dette er den riktige løsningen. Convex forventer at JWT tokenet har `aud` claim satt til `"convex"`.

### Steg-for-steg:

1. **Gå til Clerk Dashboard:**
   - [Clerk Dashboard](https://dashboard.clerk.com)
   - Velg ditt application
   - Gå til **"JWT Templates"** (under "Configure")

2. **Rediger JWT Template:**
   - Finn template med navnet **`convex`** (eller opprett en ny hvis den ikke finnes)
   - Klikk på template for å redigere

3. **Legg til `aud` claim:**
   - Scroll ned til **"Claims"** seksjonen
   - Klikk **"Add claim"**
   - **Key:** `aud`
   - **Value:** `convex` (som string, ikke objekt)
   - Klikk **"Save"**

4. **Lagre og teste:**
   - Klikk **"Save"** for å lagre endringene
   - **Logg ut og logg inn på nytt** i appen (dette genererer et nytt token med `aud` claim)
   - Sjekk Convex logs - du skal nå se "Successfully extracted Clerk user ID: ..."

## Løsning 2: Hvis Løsning 1 ikke fungerer

Hvis `getUserIdentity()` fortsatt returnerer `null` etter at du har lagt til `aud` claim, kan det være at:

1. **CLERK_SECRET_KEY er ikke riktig konfigurert:**
   - Sjekk at `CLERK_SECRET_KEY` i Convex Dashboard starter med `sk_test_` (ikke `pk_test_`)
   - Restart Convex etter å ha oppdatert environment variabler

2. **Tokenet ikke sendes riktig:**
   - Sjekk browser console for "Clerk token fetched for Convex request: ..."
   - Dette betyr at tokenet sendes fra frontend

## Test

Etter å ha lagt til `aud: "convex"` claim:

1. **Logg ut og logg inn på nytt** i appen
2. **Sjekk Convex logs** for:
   - ✅ "Successfully extracted Clerk user ID: ..."
   - ❌ IKKE "getUserIdentity returned: null"

Hvis du fortsatt ser "getUserIdentity returned: null", kan det være at:
- `CLERK_SECRET_KEY` ikke er riktig konfigurert
- Tokenet ikke sendes riktig fra frontend
- Det er et annet problem med JWT tokenet

## Hvorfor dette skjer

Convex forventer at JWT tokenet har en `aud` (audience) claim satt til `"convex"` for å verifisere at tokenet er ment for Convex. Uten denne claimen kan Convex ikke verifisere tokenet, selv om `CLERK_SECRET_KEY` er riktig konfigurert.

## Eksempel på riktig JWT Template Claims

```json
{
  "sub": "{{user.id}}",
  "aud": "convex",
  "iss": "https://curious-peacock-42.clerk.accounts.dev",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Viktig:** `aud` claimen MÅ være satt til `"convex"` (med anførselstegn som string).

