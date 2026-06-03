# Deploy del backend Nostragol Calendar

Ruta recomendada para MVP: Render Web Service.

## 1. Crear secretos

Genera el JSON de la cuenta de servicio en base64:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\pablo\Downloads\NostragolAPP\secrets\nostragol-calendar-service-account.json"))
```

Genera una clave admin nueva para produccion:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 2. Subir el backend

En Render:

1. Crea un `Web Service`.
2. Conecta el repo de Nostragol.
3. Usa:

   ```txt
   Build Command: npm install
   Start Command: npm start
   ```

4. Agrega estas variables de entorno:

   ```txt
   GOOGLE_CALENDAR_ID=nostragolapp@gmail.com
   GOOGLE_CALENDAR_TIME_ZONE=America/Santiago
   GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=<base64-del-json>
   NOSTRAGOL_ADMIN_API_KEY=<clave-admin-produccion>
   NOSTRAGOL_ALLOWED_ORIGINS=https://tu-backend.onrender.com,capacitor://localhost,http://localhost
   ```

5. Deploy.

## 3. Probar el backend publicado

```powershell
Invoke-RestMethod -Uri "https://tu-backend.onrender.com/api/health" -Method Get
```

Para crear evento:

```powershell
$body = @{
  title = "Prueba produccion Nostragol"
  start = "2026-06-06T10:00"
  end = "2026-06-06T10:20"
  description = "Evento creado desde backend publicado."
  reminderMinutes = @(60,10)
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "https://tu-backend.onrender.com/api/calendar/events" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ "X-Nostragol-Api-Key" = "<clave-admin-produccion>" } `
  -Body $body
```

## 4. Conectar la app movil

Edita `dist/config.js`:

```js
window.NOSTRAGOL_API_BASE_URL = "https://tu-backend.onrender.com";
```

Luego recompila/sincroniza la app movil con Capacitor.

Importante: la llave JSON de Google nunca debe ir dentro de la app movil. La clave admin tampoco es ideal como seguridad definitiva dentro de una app publica; para produccion con usuarios reales, el siguiente paso es login/admin con roles.
