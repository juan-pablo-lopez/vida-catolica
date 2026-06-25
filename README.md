# Vida Católica

Aplicación web de recursos espirituales para católicos hispanohablantes. Incluye guías de oración, lecturas bíblicas y series devocionales con seguimiento de progreso.

**Demo:** https://juan-pablo-lopez.github.io/vida-catolica/

---

## Recursos disponibles

| Recurso | Descripción |
|---|---|
| **Citas Bíblicas** | Lector de la Biblia Latinoamérica 1995 por libro, capítulo y versículo |
| **Visitas al Santísimo** | Serie de 31 días de visitas de San Alfonso María de Ligorio |
| **Santo Rosario** | Guía completa con los cuatro tipos de misterios y visualización de cuentas |
| **Manto de María** | Consagración mariana de 46 días con seguimiento de progreso diario |

## Stack

- **React 19** + **TypeScript**
- **Vite 7** (build y dev server)
- **React Router 7** — HashRouter con base `/vida-catolica/`
- **gh-pages** — despliegue en GitHub Pages

## Desarrollo

```bash
cd frontend
npm install
npm run dev       # servidor en http://localhost:5173
```

## Scripts

```bash
npm run build     # compila TypeScript y genera dist/
npm run preview   # previsualiza el build localmente
npm run lint      # ESLint
npm run deploy    # build + push a GitHub Pages
```

## Estructura

```
frontend/
├── src/
│   ├── resources/        # módulos de cada recurso
│   │   ├── citas-biblicas/
│   │   ├── visitas/
│   │   ├── rosario/
│   │   └── manto/
│   ├── shared/           # componentes reutilizables
│   ├── App.tsx           # rutas
│   └── Landing.tsx       # página de inicio
└── public/
    └── data/             # JSON con oraciones, misterios, visitas y consagración
```

## Características

- Progreso persistido en `localStorage` (visitas y manto)
- Detección automática del misterio del rosario según el día de la semana
- Generación de QR y copia de enlace para compartir recursos
- Diseño responsivo mobile-first con soporte de safe-area para iOS
