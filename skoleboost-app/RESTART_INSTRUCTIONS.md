# Viktig: Restart instruksjoner

## Etter endring av Convex Environment Variables

Når du endrer environment variables i Convex Dashboard, må du **restarte Convex backend** for at endringene skal tre i kraft.

### Steg-for-steg:

1. **Stopp Convex** (hvis den kjører):
   - I terminalen hvor `npx convex dev` kjører, trykk `Ctrl+C`

2. **Start Convex på nytt**:
   ```bash
   cd skoleboost-app
   npx convex dev
   ```

3. **Verifiser at Convex starter**:
   - Du skal se din Convex URL i output
   - Du skal se "Deployed functions" melding

4. **Restart frontend** (anbefalt):
   ```bash
   # I en annen terminal
   cd skoleboost-app
   npm run dev
   ```

5. **Hard refresh browser**:
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

---

## Hvis problemet fortsatt vedvarer

### Sjekkliste:

1. ✅ **CLERK_SECRET_KEY** er riktig i Convex Dashboard (`sk_test_...`)
2. ✅ **Convex er restartet** etter endring av environment variables
3. ✅ **Frontend er restartet** (`npm run dev`)
4. ✅ **Browser er hard refreshed** (Ctrl+Shift+R / Cmd+Shift+R)

### Debug logging:

Sjekk browser console for:
- ✅ "Setting auth fetcher on Convex client..."
- ✅ "✅ Auth fetcher test successful, token available: ..."
- ✅ "Clerk token fetched for Convex request: ..."
- ❌ IKKE "No authorization header found in request"

### Hvis du fortsatt ser "No authorization header found":

1. **Sjekk Convex logs** i Convex Dashboard → Logs
2. **Sjekk at CLERK_SECRET_KEY faktisk er satt**:
   - Gå til Convex Dashboard → Settings → Environment Variables
   - Verifiser at `CLERK_SECRET_KEY` starter med `sk_test_`
   - Hvis den starter med `pk_test_`, er det feil!

3. **Prøv å slette og legge til CLERK_SECRET_KEY på nytt**:
   - Slett variabelen i Convex Dashboard
   - Legg den til på nytt med riktig Secret Key
   - Restart Convex

4. **Sjekk at du bruker riktig environment**:
   - I Convex Dashboard, sjekk at variablene er satt for "Development" (hvis du kjører `npx convex dev`)
   - Eller "Production" hvis du deployer

---

## Test sekvens

1. Endre `CLERK_SECRET_KEY` i Convex Dashboard (hvis nødvendig)
2. Restart Convex: `npx convex dev`
3. Restart frontend: `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R` / `Cmd+Shift+R`
5. Logg inn på nytt
6. Sjekk browser console for logging
7. Sjekk Convex Dashboard → Logs for "Successfully extracted Clerk user ID"

