# Deployment notes — Taha Traders

## Local development

1. `backend/.env` — copy from `.env.example`
2. Default uses in-memory MongoDB (`USE_MEMORY_DB=true`) and auto-seeds demo data (`SEED_ON_START=true`).
3. For persistent MongoDB: set `USE_MEMORY_DB=false` and provide `MONGODB_URI`.
4. Start API: `npm run start:dev --prefix backend` (port 3001)
5. Start storefront: `npm run dev --prefix frontend` (port 5173)
6. Start admin: `npm run dev --prefix admin` (port 5174)

Admin login:
- Email: `admin@tahatraders.local`
- Password: `ChangeMeAdmin123!`

## Production checklist

- Set strong `JWT_SECRET` and `ADMIN_PASSWORD`
- `COOKIE_SECURE=true` behind HTTPS
- `USE_MEMORY_DB=false` with managed MongoDB
- Configure Cloudinary credentials
- Confirm WhatsApp number, email, hours, map URL in Admin → Settings
- Replace demo products with real inventory
- Deploy `frontend/dist` and `admin/dist` to static hosting
- Deploy NestJS API to Node host
- Restrict CORS origins
- Keep `/admin` behind auth (already cookie-protected)
