# Taha Traders

Premium wholesale tailoring-materials website and admin panel.

## Stack

- **Frontend** — React, TypeScript, Vite, Tailwind, React Three Fiber (selective 3D)
- **Admin** — React, TypeScript, Vite, Tailwind
- **Backend** — NestJS, MongoDB (in-memory supported for local demo), JWT httpOnly cookies, Cloudinary uploads

## Quick start

From the project root:

```bash
npm run dev
```

This starts:

- API — http://localhost:3001/api
- Website + Admin — http://localhost:5173

Admin panel: **http://localhost:5173/admin**

- Email: `admin@tahatraders.local`
- Password: `ChangeMeAdmin123!`

Or run apps separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Copy `backend/.env.example` to `backend/.env` if needed.

### Admin login

- Email: `admin@tahatraders.local`
- Password: `ChangeMeAdmin123!`

Change these before production.

## Confirmed business info

See [REQUIREMENTS.md](REQUIREMENTS.md) and [DESIGN.md](DESIGN.md).

Demo products/categories are labeled **Demo** until real inventory is uploaded in Admin.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md).
