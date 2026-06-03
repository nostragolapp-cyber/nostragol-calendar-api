# Nostragol Google Calendar

Este proyecto puede crear eventos en el calendario `nostragolapp@gmail.com` usando una cuenta de servicio de Google Cloud.

## Configuracion

1. Guarda la llave JSON descargada desde Google Cloud en:

   ```txt
   secrets/nostragol-calendar-service-account.json
   ```

2. Verifica que `.env` tenga estos valores:

   ```txt
   GOOGLE_CALENDAR_ID=nostragolapp@gmail.com
   GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./secrets/nostragol-calendar-service-account.json
   GOOGLE_CALENDAR_TIME_ZONE=America/Santiago
   ```

3. Confirma que el calendario este compartido con:

   ```txt
   nostragol-calendar@nostragol-calendar.iam.gserviceaccount.com
   ```

   El permiso debe ser `Hacer cambios en eventos`.

## Crear un evento

```bash
npm run calendar:create -- --title "Cierre pronosticos Chile vs Argentina" --start "2026-06-04T19:30:00" --end "2026-06-04T20:00:00" --description "Recordar publicar/cerrar pronosticos en Nostragol" --reminder-minutes "1440,60,10"
```

## Levantar la app con API

```bash
npm run dev
```

Luego abre:

```txt
http://localhost:3000
```

La pantalla de Nostragol envia el formulario a:

```txt
POST /api/calendar/events
```

Ejemplo de cuerpo JSON:

```json
{
  "title": "Cierre pronosticos Nostragol",
  "start": "2026-06-05T13:00",
  "end": "2026-06-05T13:20",
  "description": "Evento creado desde la app Nostragol.",
  "reminderMinutes": [1440, 60, 10]
}
```

La llamada debe incluir el header:

```txt
X-Nostragol-Api-Key: valor-de-NOSTRAGOL_ADMIN_API_KEY
```

Para produccion, este servidor debe subirse como backend seguro. La app movil debe llamar a esa URL publica; no debe incluir la llave JSON dentro del APK ni del frontend.

## Probar sin crear evento

```bash
npm run calendar:create -- --title "Prueba Nostragol" --start "2026-06-04T10:00:00" --end "2026-06-04T10:30:00" --description "Evento de prueba" --reminder-minutes "60,10" --dry-run
```

La carpeta `secrets/` y el archivo `.env` estan protegidos por `.gitignore`.
