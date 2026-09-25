# Toastify-All 🔔

> **The universal, modern toast notification engine for all JavaScript frameworks and platforms.**  
> One unified API across **React**, **Next.js**, **Vue 3**, **Angular**, **React Native**, **Svelte**, and **Vanilla HTML/JS**.

[![npm version](https://img.shields.io/npm/v/toastify-all.svg?style=flat-square)](https://www.npmjs.com/package/toastify-all)
[![npm downloads](https://img.shields.io/npm/dm/toastify-all.svg?style=flat-square)](https://www.npmjs.com/package/toastify-all)
[![bundle size](https://img.shields.io/bundlephobia/minzip/toastify-all?style=flat-square)](https://bundlephobia.com/package/toastify-all)

---

## 🎮 Live Interactive Demo

Try Toastify-All in real-time in your browser:  
👉 **[Open Live Interactive Playground](https://veereshpoojari.github.io/toastify-all/)**  
*(Customize positions, themes, transitions, test audio chimes, switch frameworks, and copy code snippets in 1 click)*

---

## 💡 Why Toastify-All? (In a world with so many toasters)

Most toast libraries lock you into a single framework: `react-toastify` only works in React, `vue-toastification` only works in Vue, and `ngx-toastr` only works in Angular. If you work in a monorepo, micro-frontends, or move between different projects, you have to learn, install, and style completely different toast libraries every time.

**Toastify-All eliminates framework lock-in forever.** You get the beauty of modern glassmorphism, the battle-tested power of React-Toastify, and first-class native adapters for every major framework in a single, lightweight package.

| Feature | **Toastify-All** 🔔 | `react-toastify` | `sonner` | `vue-toastification` | `ngx-toastr` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Multi-Framework Support** | 🌟 **React, Vue, Angular, RN, Vanilla** | ❌ React only | ❌ React only | ❌ Vue only | ❌ Angular only |
| **Next.js App Router Ready** | ✅ **`'use client'` built-in** | ⚠️ Needs manual wrapper | ✅ Built-in | N/A | N/A |
| **Modern Glassmorphic Design** | ✅ **Blur + Subtle Borders** | ❌ Boxy 2018 design | ✅ Minimalist | ❌ Standard | ❌ Standard |
| **System Theme Auto-Sync** | ✅ **Auto OS dark/light sync** | ❌ | ❌ | ❌ | ❌ |
| **Promise Toast (`toast.promise`)** | ✅ **Built-in** | ✅ Built-in | ✅ Built-in | ⚠️ Plugin | ❌ |
| **Zero-Asset Audio Chimes** | ✅ **Built-in (Web Audio API)** | ❌ | ❌ | ❌ | ❌ |
| **Direct CDN `<script>` tag** | ✅ **jsDelivr / unpkg** | ❌ | ❌ | ❌ | ❌ |
| **Swipe & Drag Dismiss** | ✅ **Desktop & Touch** | ✅ | ✅ | ✅ | ❌ |

---

## 📦 Installation

```bash
npm install toastify-all
# or
yarn add toastify-all
# or
pnpm add toastify-all
```

---

## 🚀 Quick Start by Platform

### 1. React & Next.js (App Router & Pages Router)

Place `<ToastContainer />` at the root of your application, then trigger `toast` from anywhere:

```jsx
import React from 'react';
import { ToastContainer, toast } from 'toastify-all/react';

export default function App() {
  const notify = () => {
    // Basic toast
    toast("Welcome to Toastify-All!");

    // Beautiful variants with colored or system theme
    toast.success("Profile saved successfully!", { theme: "colored" });
    toast.error("Failed to connect to server!");
    toast.warning("Your session is about to expire.");
    toast.info("A new update is available.");

    // Dynamic Promise Toast (Loading -> Success / Error)
    const uploadFile = () => new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(uploadFile(), {
      pending: "Uploading asset...",
      success: "Upload completed! 🚀",
      error: "Upload failed! ❌"
    });
  };

  return (
    <div>
      <button onClick={notify}>Show Notifications</button>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="system"
        transition="bounce"
      />
    </div>
  );
}
```

---

### 2. Vue 3 & Nuxt

In `main.js` / `main.ts`:

```javascript
import { createApp } from 'vue';
import { ToastifyAllPlugin } from 'toastify-all/vue';
import App from './App.vue';

const app = createApp(App);
app.use(ToastifyAllPlugin, {
  position: 'top-right',
  theme: 'system'
});
app.mount('#app');
```

In any Vue component:

```vue
<template>
  <button @click="showToast">Notify</button>
</template>

<script setup>
import { useToast } from 'toastify-all/vue';

const toast = useToast();

const showToast = () => {
  toast.success('Toastify-All works seamlessly in Vue 3!');
};
</script>
```

---

### 3. Angular

#### Standalone Setup (Angular 14+ / 15+ / 16+ / 17+)
In `main.ts` or `app.config.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNotifications } from 'toastify-all/angular';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideNotifications({
      position: 'top-right',
      theme: 'system'
    })
  ]
});
```

#### In your Component:

```typescript
import { Component } from '@angular/core';
import { NotificationService } from 'toastify-all/angular';

@Component({
  selector: 'app-root',
  template: `<button (click)="notify()">Trigger</button>`
})
export class AppComponent {
  constructor(private toast: NotificationService) {}

  notify() {
    this.toast.success('Toastify-All running in Angular!');
  }
}
```

---

### 4. React Native

Native alerts on iOS and native toasts on Android without browser DOM crashes:

```jsx
import React from 'react';
import { View, Button } from 'react-native';
import { toast, ToastContainer } from 'toastify-all/react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Show Toast"
        onPress={() => toast.success('Mobile notification works!')}
      />
      <ToastContainer />
    </View>
  );
}
```

---

### 5. Vanilla JavaScript (No Framework)

```javascript
import toast from 'toastify-all';

toast.configure({
  position: 'top-center',
  theme: 'colored'
});

toast.success('Vanilla JS toast!');
```

---

### 6. Direct CDN Browser `<script>` Tag

```html
<!DOCTYPE html>
<html>
<head>
  <title>Toastify-All CDN Demo</title>
  <!-- Load Toastify-All via jsDelivr -->
  <script src="https://cdn.jsdelivr.net/npm/toastify-all/dist/index.umd.js"></script>
</head>
<body>
  <button onclick="ToastifyAll.toast.success('Hello from CDN!')">Click Me</button>
</body>
</html>
```

---

## 🛠️ Complete API Reference

### Calling `toast`

| Method | Description |
| :--- | :--- |
| `toast(message, [options])` | Show a default toast |
| `toast.success(message, [options])` | Show a success toast (green) |
| `toast.error(message, [options])` | Show an error toast (red) |
| `toast.info(message, [options])` | Show an info toast (blue) |
| `toast.warning(message, [options])` / `toast.warn(...)` | Show a warning toast (amber) |
| `toast.loading(message, [options])` | Show a persistent loading spinner toast |
| `toast.promise(promise, states, [options])` | Automatically handles pending, success, and error states |
| `toast.update(id, newState)` | Update an active toast's content or state |
| `toast.dismiss([id])` | Dismiss a specific toast by ID, or all toasts if no ID is passed |
| `toast.isActive(id)` | Check if a toast is currently active on screen |
| `toast.clearWaitingQueue()` | Dismiss all toasts exceeding the queue limit |

---

### Configuration Options

Options can be set globally via `toast.configure(options)` or per-toast:

```javascript
toast.success("File uploaded", {
  title: "Upload Completed",
  position: "bottom-right",
  autoClose: 4000,
  theme: "system", // "light" | "dark" | "colored" | "system"
  transition: "slide", // "bounce" | "slide" | "zoom" | "flip"
  sound: true, // Subtle harmonic Web Audio chime
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  draggable: true,
  draggablePercent: 80,
  action: {
    label: "Undo",
    onClick: (id) => console.log("Undo clicked for toast", id)
  }
});
```

---

## 🌐 CDN Quick Start (No Bundler / Plain HTML)

If you are not using npm or a frontend framework, you can use Toastify-All directly from a global CDN without any build step:

```html
<!-- Include Toastify-All via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/toastify-all/dist/index.umd.js"></script>

<script>
  // Trigger notifications anytime
  ToastifyAll.toast.success("Welcome to Toastify-All!");
</script>
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# 1. Clone the repository
git clone https://github.com/VeereshPoojari/toastify-all.git

# 2. Install dependencies
npm install

# 3. Run test suite
npm test

# 4. Build bundles
npm run build
```