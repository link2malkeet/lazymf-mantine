import { lazy, LazyExoticComponent } from "react";
declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };
type container<T> = {
  init: (sharedScope: unknown) => Promise<void>;
  get: (module: string) => Promise<() => T>;
};

const loadedScopes = new Map<string, Promise<unknown>>();

// Ensures a remote script is loaded only once.
export function loadScope(url: string, scope: string): Promise<unknown> {
  let p: Promise<unknown>;

  if (loadedScopes.has(url)) {
    p = loadedScopes.get(url)!;
  } else {
    const el = document.createElement("script");
    const promise = new Promise<void>((resolve, reject) => {
      el.src = url;
      el.type = "text/javascript";
      el.async = true;
      el.onload = () => resolve();
      el.onerror = reject;
    });

    loadedScopes.set(url, promise);
    document.head.appendChild(el);
    promise.finally(() => document.head.removeChild(el));
    p = promise;
  }

  return p.then(() => (window as any)[scope]);
}

// Loads a specific module from a remote container.
export async function loadModule<T>(
  url: string,
  scope: string,
  module: string
): Promise<T> {
  console.log("LOADING", scope, module, url);
  const startTime = performance.now();
  try {
    const container = (await loadScope(url, scope)) as T; // load the script
    await __webpack_init_sharing__("default"); // prepare the default shared scope
    await (container as any).init(__webpack_share_scopes__.default);
    const factory = await (container as any).get(module);
    const result = factory();
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`Module ${module} loaded in ${loadTime.toFixed(2)}ms`);
    return result;
  } catch (error) {
    console.error("Error loading module:", error);
    throw error;
  }
}

// Type for the remote configuration
type RemoteConfig = Record<string, string>;

// Creates a function to lazily load modules based on a remote configuration, returning React components that can be used in the application.
export function loadModuleFederationImport(
  remoteConfig: RemoteConfig
): (importStatement: string) => LazyExoticComponent<any> {
  return function loadLazy(importStatement: string): LazyExoticComponent<any> {
    const [imp, mod] = importStatement.split("/");
    const entry = remoteConfig[imp];
    const [windowName, url] = entry.split("@");

    return lazy(() => {
      console.log("LOADING INIT", imp, mod, windowName, url);
      return loadModule(url, windowName, `./${mod}`);
    });
  };
}
