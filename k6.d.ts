// Declare k6 modules
declare module 'k6/http' {
    export interface Response {
      status: number;
      body: any;
      headers: { [key: string]: string };
      timings: any;
    }
    
    export function get(url: string): Response;
    export function batch(requests: Array<[string, string]>): Response[];
  }
  
  declare module 'k6' {
    export function sleep(time: number): void;
    export function check(response: any, checks: { [key: string]: (r: any) => boolean }): boolean;
  }