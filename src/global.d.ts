// // global.d.ts

declare global {
  interface IContextMeta {
    $statusCode?: number;
    $statusMessage?: string;
    $responseType?: string;
    $responseHeaders?: any;
    [key: string]: any;
  }
}

export {};
