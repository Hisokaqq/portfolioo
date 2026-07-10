# Alex Burtyn — Portfolio

An interactive 3D portfolio built with React and React Three Fiber.

🔗 **Live:** https://alexburtyn.com/

## Tech stack

- **React 18** + **Vite** — app & build tooling
- **React Three Fiber** + **drei** + **three** — 3D scenes, custom GLSL shaders
- **Framer Motion** (`framer-motion` / `framer-motion-3d`) & **GSAP** — animation
- **Tailwind CSS** — styling
- **React Router** — routing

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```
src/
  pages/        route-level views (Experience, Projects, Me_contact, SingleProject, NotFound)
  components/   UI + scene components
  3dmodels/     3D model components (Bubble, Phone)
  helpers/      shaders, animation variants, shared hooks
public/
  images/       project screenshots (WebP)
  phone.glb     3D phone model
```

## Routes

| Path                       | View                          |
| -------------------------- | ----------------------------- |
| `/`                        | Home / hero 3D scene          |
| `/me`                      | About + contact               |
| `/projects`               | Scrollable projects gallery   |
| `/projects/project/:id`    | Single project image viewer   |
| `*`                        | 404                           |
