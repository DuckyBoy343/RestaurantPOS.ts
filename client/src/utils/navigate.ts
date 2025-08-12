import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function navigate(router: AppRouterInstance, path: string) {
  // Check if the Electron IPC function exists on the window object
  if (window.electron && window.electron.navigate) {
    // We are in the Electron app, use IPC
    console.log('Navigating via Electron IPC...');
    window.electron.navigate(path);
  } else {
    // We are in a regular web browser, use the Next.js router
    console.log('Navigating via Next.js router...');
    router.push(path);
  }
}