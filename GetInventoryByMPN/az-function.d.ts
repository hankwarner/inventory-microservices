import { Inventory } from '../services/ManhattanService';

export * from "@azure/functions";

declare module "@azure/functions" {
  // Define the response types
  export interface Response {
    status?: number;
    headers?: {
      [key: string]: string
    }
    body: Inventory | string;
  }
}