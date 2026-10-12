# NEXO · Plataforma de Ayuda — Mockup interactivo

Mockup de alta fidelidad de **NEXO**, la plataforma centralizada de ayuda tecnológica que **TRAMA Soluciones Digitales** implementa con un grupo piloto de organizaciones pequeñas.

**Ver el mockup en vivo:** https://gabrielcoder406.github.io/nexo-mockup/

> Proyecto académico — Instituto Superior Politécnico Córdoba (ISPC)
> Tecnicatura Superior en Desarrollo de Software · Competencias Comunicacionales II
> ABP: *Proyecto NEXO – Comunicación profesional integral* · Grupo 5 · Ciclo lectivo 2026 · Docente: Ana Rocco
>
> Integrantes: González González, Andrea · González Yrusta, Gabriel · Guzmán, Cristian

## Qué muestra

- **Espacio de trabajo:** solicitudes activas en tiempo real, tickets resueltos y compromiso de respuesta (< 24 horas).
- **Carga de solicitud en 4 campos:** asunto directo, categoría, descripción clara y adjunto. Valida títulos genéricos ("Urgente", "Ayuda") y descripciones vagas, e incluye los ejemplos de *redacción vaga vs. efectiva*.
- **Semáforo de prioridades:** Crítica (bloqueo total), Media (falla parcial) y Baja (consulta minoritaria).
- **Trazabilidad:** Recibido → En proceso → Esperando info → Resuelto, con número de ticket único (#TK).
- **Historial:** solución aplicada en cada caso cerrado y calificación de la atención.
- **Notificaciones** y panel de acompañamiento del programa piloto.

Todos los datos son de ejemplo. No hay backend: la simulación corre en el navegador.

## Demo en 1 minuto

1. Tocá **+ Nueva Solicitud**.
2. Tocá **Completar con la práctica del taller** (carga `[PRUEBA] Alta de Capacitación - Organización X`).
3. Elegí una prioridad del semáforo y tocá **Enviar Solicitud**.
4. Se genera el número **#TK-XXXX** y el ticket aparece en *Solicitudes activas*. A los pocos segundos llega el aviso del analista asignado.
5. Abrí la pestaña **Historial** para ver la solución aplicada de un caso cerrado y calificarlo.

## Tecnología

- React 18 + Tailwind CSS 3 + lucide-react
- Compilado con esbuild en un único `index.html` autocontenido (funciona sin conexión, salvo las fuentes)

## Estructura

```
index.html            Mockup compilado (lo que publica GitHub Pages)
src/NexoPortal.jsx    Componente React con toda la aplicación
src/main.jsx          Punto de entrada
src/tokens.css        Paleta de colores (modo claro y oscuro) y tipografías
src/input.css         Directivas de Tailwind
tailwind.config.js    Configuración de Tailwind (colores tomados de los tokens)
build.mjs             Script que genera index.html
```

## Compilar

```bash
npm install
npm run build   # regenera index.html
```
