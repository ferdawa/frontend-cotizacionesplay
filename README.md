# 🎮 CotizacionesPlay - Frontend

Aplicación web React para comparar precios de videojuegos PS4 y PS5 en tiendas chilenas. Interfaz moderna y responsive que consume la API de CotizacionesPlay.

## 📋 Características

- ✨ **Diseño Moderno**: UI con gradientes, glassmorphism y animaciones suaves usando Tailwind CSS
- 🎯 **Comparación de Precios**: Visualiza y compara precios de múltiples tiendas en tiempo real
- ⏱️ **Sistema de Cooldown**: Contador en tiempo real para próximas actualizaciones
- 📊 **Análisis Automático**: Muestra diferencias de precio y ahorro potencial
- 🏆 **Mejor Precio Destacado**: Identifica automáticamente la mejor oferta
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil
- 🔗 **Enlaces Directos**: Acceso rápido a las páginas de las tiendas

## 🚀 Instalación

### Requisitos

- Node.js 16 o superior
- npm o yarn
- Backend de CotizacionesPlay corriendo (ver repositorio backend)

### Pasos

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd frontend-cotizacionesplay
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:3001
```

Para producción, usa la URL de tu API desplegada:

```env
REACT_APP_API_URL=https://tu-api.render.com
```

4. Inicia el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

### `npm start`

Ejecuta la aplicación en modo desarrollo.  
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

La página se recargará automáticamente cuando hagas cambios.

### `npm test`

Ejecuta el test runner en modo interactivo.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.  
Optimiza el build para mejor rendimiento.

La construcción está minificada y los nombres de archivo incluyen hashes.

## 🏗️ Estructura del Proyecto

```
frontend-cotizacionesplay/
├── public/
│   ├── index.html        # HTML principal
│   ├── manifest.json     # PWA manifest
│   └── favicon.ico       # Favicon
├── src/
│   ├── App.js            # Componente principal
│   ├── App.css           # Estilos del componente principal
│   ├── index.js          # Punto de entrada
│   ├── index.css         # Estilos globales + Tailwind
│   └── logo.svg          # Logo de React
├── .env                  # Variables de entorno
├── package.json
└── tailwind.config.js    # Configuración de Tailwind CSS
```

## 🎨 Tecnologías

- **React 19** - Biblioteca de UI
- **Tailwind CSS 3** - Framework de CSS utility-first
- **Axios** - Cliente HTTP para llamadas a la API
- **Lucide React** - Iconos modernos
- **React Scripts** - Tooling y configuración de Create React App

## 🎯 Funcionalidades

### Selector de Juegos

- Grid responsive con todos los juegos disponibles
- Imágenes de portada de alta calidad
- Indicador visual de juego seleccionado
- Badge de plataforma (PS4/PS5)
- Temporizador de cooldown por juego

### Panel de Comparación

- Precios actuales de todas las tiendas
- Resaltado del mejor precio
- Enlaces directos a cada tienda
- Timestamp de última actualización
- Botón de actualización con cooldown

### Análisis de Precios

- Diferencia entre precio más alto y más bajo
- Porcentaje de ahorro potencial
- Visualización clara y colorida

## 🔧 Configuración

### Variables de Entorno

| Variable            | Descripción         | Valor por defecto       |
| ------------------- | ------------------- | ----------------------- |
| `REACT_APP_API_URL` | URL del backend API | `http://localhost:3001` |

### Tailwind CSS

El proyecto usa Tailwind CSS 3 con configuración personalizada. Para modificar la configuración, edita `tailwind.config.js`.

## 🚀 Deployment

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno:
   - `REACT_APP_API_URL`: URL de tu API en producción
3. Build command: `npm run build`
4. Publish directory: `build`

### Vercel

1. Importa el proyecto en Vercel
2. Configura la variable de entorno `REACT_APP_API_URL`
3. Vercel detectará automáticamente que es un proyecto Create React App

### Build Manual

```bash
npm run build
```

Esto generará una carpeta `build/` con los archivos estáticos optimizados que puedes servir con cualquier servidor web (nginx, Apache, etc.)

## 🎨 Personalización

### Colores

Los colores principales se definen en las clases de Tailwind:

- **Primario**: `purple-600` y `pink-600`
- **Fondo**: `slate-900`
- **Superficie**: `slate-800` con opacidad
- **Texto**: `white` y `slate-300`
- **Éxito**: `green-500`
- **Advertencia**: `orange-500`
- **Error**: `red-500`

### Gradientes

El gradiente principal es:

```css
bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
```

Puedes modificarlo en `App.js` o crear tus propios gradientes personalizados.

## 🐛 Troubleshooting

### El backend no se conecta

Verifica que:

1. El backend esté corriendo en el puerto correcto
2. La variable `REACT_APP_API_URL` esté configurada correctamente
3. CORS esté habilitado en el backend

### Estilos de Tailwind no se aplican

1. Reinicia el servidor de desarrollo
2. Verifica que `index.css` contenga las directivas de Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📱 Progressive Web App (PWA)

El proyecto incluye un `manifest.json` básico. Para convertirlo en una PWA completa:

1. Activa el service worker en `index.js`
2. Personaliza el `manifest.json` con tus iconos y configuración
3. Genera iconos en diferentes tamaños (192x192, 512x512)

## 📄 Licencia

ISC

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 🔗 Enlaces Relacionados

- [Repositorio Backend](../backend-cotizacionesplay)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
