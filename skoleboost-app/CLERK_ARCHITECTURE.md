# Clerk Authentication Architecture

Dette dokumentet forklarer hvordan Clerk autentisering er satt opp i appen.

## Oversikt

Appen bruker Clerk for autentisering og Convex som database. Clerk håndterer brukeropprettelse, innlogging, og sesjonshåndtering, mens Convex lagrer brukerdata og håndterer applogikk.

## Arkitektur

```
┌─────────────────┐
│   React App     │
│  (Frontend)     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│  Clerk          │  │  Convex      │
│  (Auth Service) │  │  (Database)  │
└─────────────────┘  └──────────────┘
         │                 │
         │                 │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Webhook        │
         │  (Sync Users)   │
         └─────────────────┘
```

## Filstruktur

### Frontend (React)

#### 1. `src/main.tsx` - App Initialization

- **ClerkProvider**: Wrapper som gir Clerk-kontekst til hele appen
- **ConvexProviderWithAuth**: Custom provider som legger til Clerk JWT-token i alle Convex-forespørsler
- **Token Flow**:
  - Henter Clerk JWT-token via `getToken()`
  - Legger til token i `Authorization: Bearer <token>` header
  - Alle Convex-forespørsler inkluderer nå Clerk-autentisering

#### 2. `src/App.tsx` - Main App Component

- **SignedIn/SignedOut**: Clerk-komponenter som viser forskjellig innhold basert på innloggingsstatus
- **useAuth()**: Henter Clerk user-objekt
- **Automatisk brukeropprettelse**: Hvis bruker er logget inn i Clerk men ikke finnes i Convex, opprettes brukeren automatisk

#### 3. `src/components/LoginPage.tsx` - Authentication UI

- **useSignIn()**: Hook for innlogging
- **useSignUp()**: Hook for registrering
- **Email Verification**: Håndterer e-postverifisering med kode
- **User Creation**: Oppretter bruker i Convex etter vellykket Clerk-registrering

### Backend (Convex)

#### 4. `convex/clerkAuth.ts` - Authentication Helper

- **getClerkUserId()**: Dekoder JWT-token fra request headers
- Ekstraherer Clerk user ID fra token's `sub` claim
- Brukes av alle Convex queries/mutations for å identifisere brukeren

#### 5. `convex/auth.ts` - Webhook Handler

- **clerkWebhook**: HTTP endpoint som mottar webhooks fra Clerk
- **Events**: Lytter til `user.created` og `user.updated` events
- **Automatisk synkronisering**: Oppretter/oppdaterer brukere i Convex når de opprettes i Clerk

#### 6. `convex/http.ts` - HTTP Router

- Definerer `/clerk-webhook` endpoint
- Ruter webhook-forespørsler til `clerkWebhook` handler

#### 7. `convex/users.ts` - User Queries/Mutations

- **getCurrentUser**: Henter bruker basert på Clerk user ID
- **createUser**: Oppretter bruker i Convex (bruker Clerk user ID som `studentId`)
- Alle funksjoner bruker `getClerkUserId()` for autentisering

## Autentiseringsflyt

### 1. Brukeropprettelse (Sign Up)

```
User → LoginPage → Clerk.signUp.create()
                    ↓
              Email Verification (hvis påkrevd)
                    ↓
              Clerk Session Created
                    ↓
         ConvexProviderWithAuth legger til JWT token
                    ↓
         LoginPage.createUser() → Convex
                    ↓
         User opprettet i Convex database
```

### 2. Innlogging (Sign In)

```
User → LoginPage → Clerk.signIn.create()
                    ↓
              Clerk Session Created
                    ↓
         ConvexProviderWithAuth legger til JWT token
                    ↓
         App.tsx → getCurrentUser() → Convex
                    ↓
         User data hentet fra Convex
```

### 3. Webhook Synkronisering

```
Clerk → Webhook → /clerk-webhook
                    ↓
         Verifiserer webhook signature
                    ↓
         user.created/user.updated event
                    ↓
         Oppretter/oppdaterer bruker i Convex
```

## Token Flow

1. **Bruker logger inn** → Clerk oppretter JWT-token
2. **Frontend henter token** → `getToken()` fra Clerk
3. **Token legges til requests** → `Authorization: Bearer <token>` header
4. **Convex mottar request** → Dekoder token i `getClerkUserId()`
5. **User ID ekstraheres** → Fra token's `sub` claim
6. **Query/Mutation kjører** → Med autentisert user ID

## Miljøvariabler

### Frontend (`.env.local`)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CONVEX_URL=https://...
```

### Backend (Convex Dashboard)

```env
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## Viktige Punkter

1. **Clerk user ID lagres i `studentId` feltet** i Convex `users` tabellen
2. **Alle Convex queries/mutations** bruker `getClerkUserId()` for autentisering
3. **Webhook synkroniserer** brukere automatisk fra Clerk til Convex
4. **JWT-token** sendes automatisk med alle Convex-forespørsler
5. **Frontend oppretter også bruker** hvis webhook ikke har fyrt ennå

## Feilhåndtering

- **"Not authenticated"**: Token mangler eller er ugyldig
- **"User not found"**: Bruker finnes i Clerk men ikke i Convex (opprettes automatisk)
- **"Email taken"**: E-post allerede registrert (bytter til innlogging)
- **"Missing requirements"**: Email verification påkrevd

## Sikkerhet

- JWT-tokens verifiseres av Convex
- Webhook-signaturer verifiseres med `svix`
- Alle sensitive operasjoner krever autentisering
- Clerk håndterer passord-hashing og -validering
