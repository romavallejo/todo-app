# Todo App

## 🧪 Credenciales de prueba

Para explorar la aplicación sin necesidad de crear una cuenta, puedes usar las siguientes credenciales de prueba:

| Campo | Valor |
|---|---|
| **Email** | `user@gmail.com` |
| **Contraseña** | `123456` |

> ⚠️ Esta cuenta es solo para propósitos de demostración. No almacenes información sensible con ella.

## 📖 Descripción

Es una aplicación móvil de gestión de tareas de cualquier ambito. Permite crear listas de tareas personalizadas, organizarlas por prioridad y categoría, hacer seguimiento del progreso, y explorar listas públicas compartidas por otros usuarios.

El proyecto fue construido como una aplicación full-stack con un backend en **Quarkus** y un frontend en **React Native con Expo**, siguiendo principios de arquitectura Clean en el servidor.

### ✨ Funcionalidades principales

- 🔐 Autenticación con Firebase (login y registro)
- ✅ Creación y gestión de todos con prioridad, fecha límite y categorías
- 📋 Listas de todos con control de visibilidad pública/privada
- 📊 Seguimiento de progreso por lista
- 🌐 Explorador de listas públicas con búsqueda
- 💬 Comentarios en listas públicas
- 📋 Copiar listas públicas a tu cuenta
- 🌙 Soporte de tema oscuro y claro

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.76+ | Framework base |
| [Expo](https://expo.dev/) | SDK 52 | Toolchain y build |
| [Expo Router](https://expo.github.io/router/) | v4 | Navegación basada en archivos |
| [NativeWind](https://www.nativewind.dev/) | v4 | Clases Tailwind en RN |
| [Firebase](https://firebase.google.com/) | v11 | Autenticación |
| TypeScript | 5+ | Tipado estático |

### Backend
| Tecnología | Uso |
|---|---|
| [Quarkus](https://quarkus.io/) | Framework Java para el API REST |
| Panache + Hibernate | ORM y acceso a datos |
| MySQL | Base de datos relacional |
| Firebase Admin SDK | Verificación de tokens JWT |

---

## ⚙️ Variables de entorno

El archivo `.env` en la raíz del proyecto se debería ver algo así.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=.
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_BACKEND_URL=https:...
```

---

## 🚀 Instalación

### Prerequisitos

- **Node.js** >= 18
- **Yarn** >= 1.22
- El backend de Quarkus corriendo localmente o en un servidor accesible

### 1. Clonar el repositorio

```bash
git clone https://github.com/romavallejo/todo-app
cd todo-app
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores reales.

---

## ▶️ Cómo ejecutar

### Web (recomendado para desarrollo rápido)

```bash
yarn expo start --web
```

Abre [http://localhost:8081](http://localhost:8081) en tu navegador.

### iOS (requiere macOS + Xcode)

```bash
yarn expo start --ios
```

### Android (requiere Android Studio o dispositivo físico)

```bash
yarn expo start --android
```

### Expo Go (cualquier dispositivo físico)

```bash
yarn expo start
```

Escanea el código QR con la app **Expo Go** en tu teléfono.

---

## 🔗 Backend

Este frontend consume el API REST del proyecto backend correspondiente construido con Quarkus. 

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.
