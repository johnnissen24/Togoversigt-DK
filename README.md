# Togoversigt Danmark – privat adgang

Denne version viser den eksisterende mobilvenlige togoversigt bag HTTP Basic Authentication.

## Render

1. Opret en ny **Web Service** fra GitHub-repositoryet (ikke Static Site).
2. Runtime: **Node**. Build Command: `npm install`. Start Command: `npm start`.
3. Under **Environment** oprettes:
   - `LOGIN_USER`: dit ønskede brugernavn
   - `LOGIN_PASSWORD`: en lang, unik adgangskode
4. Deploy. Render sætter selv `PORT` og giver en HTTPS-adresse.
5. Åbn den nye adresse i et privat browservindue og kontrollér, at der kræves login, og at tavlen virker efter login.
6. Når det er bekræftet, fjern den gamle offentlige **Static Site** fra Render, ellers kan den gamle URL stadig åbnes uden login.

**Sikkerhed:** Læg aldrig adgangskoden i GitHub, HTML eller README. Brug kun Renders Environment-indstillinger. HTTP Basic Authentication benytter browserens indbyggede loginboks; den kræver HTTPS, som Render leverer på sin offentlige adresse. Browseren kan huske login, og der er ingen separat log ud-knap. Denne simple løsning har ikke kontolåsning eller avanceret rate limiting.

**Bemærk:** Togoversigten henter fortsat data direkte fra MitTog i browseren. Login beskytter siden på din Render Web Service, ikke MitTogs offentlige datakilde eller eventuelle gamle kopier af HTML-filen.
