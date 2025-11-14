# Hvordan deaktivere CAPTCHA i Clerk Dashboard

CAPTCHA-feilene ("Blocked script execution in 'about:blank'") oppstår fordi Clerk bruker Cloudflare Turnstile CAPTCHA som lager en sandboxed iframe. Den beste løsningen er å deaktivere CAPTCHA i Clerk Dashboard.

## Steg-for-steg instruksjoner:

1. **Gå til Clerk Dashboard**
   - Åpne [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Logg inn på din Clerk-konto

2. **Velg ditt application**
   - Klikk på application-en din fra listen

3. **Gå til Bot Protection settings**
   - I venstre meny, klikk på **"User & Authentication"**
   - Klikk på **"Bot Protection"** i undermenyen

4. **Deaktiver CAPTCHA**
   - Under **"CAPTCHA"** seksjonen
   - Sett **"CAPTCHA Provider"** til **"None"** eller **"Disabled"**
   - Eller deaktiver **"Enable CAPTCHA"** toggle

5. **Lagre endringene**
   - Klikk **"Save"** eller **"Apply"**

6. **Test appen**
   - Last inn appen på nytt i nettleseren
   - CAPTCHA-feilene skal nå være borte

## Alternativ: Ignorer feilene i development

Hvis du ikke vil deaktivere CAPTCHA, kan du trygt ignorere disse feilene i development:

- De påvirker ikke funksjonaliteten
- CAPTCHA vil fortsatt fungere i production
- Feilene er kun visuelle advarsler i console

## Merk

- CAPTCHA er viktig for å beskytte mot bots i production
- Det er trygt å deaktivere det i development for en bedre utvikleropplevelse
- Husk å aktivere det igjen før du deployer til production
