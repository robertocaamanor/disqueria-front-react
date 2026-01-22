# Disquería Front - React Application

Aplicación frontend para el sistema de gestión de disquería, construida con React, TypeScript, Vite y TailwindCSS. Esta aplicación se conecta con la API NestJS de backend para gestionar un catálogo de artistas y álbumes musicales, así como pedidos de usuarios.

## 🚀 Tecnologías

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite 7** - Build tool y dev server
- **TailwindCSS** - Framework CSS utility-first
- **React Router v7** - Enrutamiento
- **Axios** - Cliente HTTP
- **i18next** - Internacionalización (Español/Inglés)
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
src/
├── api/                      # Clientes API
│   ├── auth.ts              # Autenticación (login, register)
│   ├── catalog.ts           # Artistas y álbumes
│   ├── orders.ts            # Gestión de pedidos
│   ├── users.ts             # Usuarios
│   └── client.ts            # Cliente Axios configurado
├── components/              # Componentes reutilizables
│   ├── Layout.tsx          # Layout principal con navegación
│   ├── ProtectedRoute.tsx  # HOC para rutas protegidas
│   ├── catalog/            # Componentes del catálogo
│   │   ├── CreateAlbumModal.tsx
│   │   └── CreateArtistModal.tsx
│   └── ui/                 # Componentes UI base
│       ├── Button.tsx
│       ├── ConfirmationModal.tsx
│       ├── Input.tsx
│       ├── LanguageSwitcher.tsx
│       └── Toast.tsx
├── context/                # Contextos de React
│   ├── AuthContext.tsx    # Estado de autenticación global
│   └── ToastContext.tsx   # Sistema de notificaciones
├── i18n/                  # Internacionalización
│   ├── config.ts          # Configuración i18next
│   └── locales/           
│       ├── en.json        # Traducciones inglés
│       └── es.json        # Traducciones español
├── pages/                 # Páginas principales
│   ├── CatalogPage.tsx   # Catálogo de artistas y álbumes
│   ├── LoginPage.tsx     # Inicio de sesión
│   ├── OrdersPage.tsx    # Historial de pedidos
│   └── RegisterPage.tsx  # Registro de usuarios
├── App.tsx               # Componente raíz
└── main.tsx             # Punto de entrada
```

## ✨ Características Principales

### 🔐 Autenticación
- Sistema de registro e inicio de sesión
- Autenticación basada en JWT
- Rutas protegidas con `ProtectedRoute`
- Persistencia de sesión con localStorage
- Contexto global de autenticación

### 📀 Gestión de Catálogo
- **Artistas**: Visualización, creación y gestión de artistas musicales
- **Álbumes**: Catálogo completo con información detallada (precio, año, género, país)
- Filtrado de álbumes por artista
- Modal de creación con validación de formularios
- Interfaz intuitiva con tarjetas visuales

### 🛒 Sistema de Pedidos
- Compra de álbumes desde el catálogo
- Confirmación de compra con modal
- Historial completo de pedidos del usuario
- Visualización de detalles: fecha, álbumes y total

### 🌍 Internacionalización (i18n)
- Soporte multiidioma (Español/Inglés)
- Detección automática del idioma del navegador
- Selector de idioma en la interfaz
- Traducciones completas de toda la aplicación

### 🎨 Interfaz de Usuario
- Diseño responsivo con TailwindCSS
- Sistema de notificaciones toast
- Componentes reutilizables y modulares
- Iconos con Lucide React
- Estados de carga y feedback visual

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- API Backend ejecutándose en `http://localhost:3005`

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de la build
npm run preview

# Ejecutar linter
npm run lint
```

### Configuración del API

El cliente HTTP está configurado para conectarse a `http://localhost:3005`. Para cambiar la URL del backend, edita el archivo:

```typescript
// src/api/client.ts
const API_URL = 'http://localhost:3005';
```

## 🛣️ Rutas de la Aplicación

- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/catalog` - Catálogo de artistas y álbumes (protegida)
- `/orders` - Historial de pedidos (protegida)
- `/` - Redirección a `/catalog` (protegida)

Las rutas protegidas requieren autenticación y redirigen a `/login` si el usuario no está autenticado.

## 🔑 API Endpoints Utilizados

La aplicación consume los siguientes endpoints del backend:

### Autenticación
- `POST /auth/login` - Inicio de sesión
- `POST /auth/register` - Registro de usuario

### Catálogo
- `GET /catalog/artists` - Lista de artistas
- `POST /catalog/artists` - Crear artista
- `GET /catalog/albums` - Lista de álbumes
- `POST /catalog/albums` - Crear álbum

### Pedidos
- `POST /orders` - Crear pedido
- `GET /orders/user/:userId` - Pedidos del usuario

### Usuarios
- `GET /users/:id` - Información del usuario

## 📦 Dependencias Principales

```json
{
  "axios": "^1.13.2",
  "i18next": "^25.8.0",
  "i18next-browser-languagedetector": "^8.2.0",
  "lucide-react": "^0.562.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-i18next": "^16.5.3",
  "react-router-dom": "^7.12.0"
}
```

## 🎯 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Vite
- `npm run build` - Compila TypeScript y genera build de producción
- `npm run lint` - Ejecuta ESLint para verificar código
- `npm run preview` - Preview de la build de producción

## 💡 Desarrollo

### Agregar Nuevas Páginas

1. Crear el componente en `src/pages/`
2. Agregar la ruta en `src/App.tsx`
3. Si es protegida, envolver en `<ProtectedRoute />`

### Agregar Nuevas Traducciones

1. Agregar claves en `src/i18n/locales/es.json`
2. Agregar claves en `src/i18n/locales/en.json`
3. Usar con `const { t } = useTranslation();` y `t('clave')`

### Crear Nuevos Endpoints

1. Agregar función en el archivo correspondiente de `src/api/`
2. Usar el cliente configurado: `import client from './client'`
3. El token JWT se inyecta automáticamente en las peticiones

## 🔒 Seguridad

- Los tokens JWT se almacenan en `localStorage`
- Los interceptores de Axios inyectan automáticamente el token en las cabeceras
- Las rutas protegidas verifican la autenticación
- El contexto de autenticación valida el estado del usuario

## 🤝 Integración con Backend

Esta aplicación está diseñada para trabajar con el backend NestJS ubicado en `disqueria-nestjs-api`. Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend.

## 📝 Licencia

Este proyecto es parte de un sistema de gestión de disquería con arquitectura de microservicios.
