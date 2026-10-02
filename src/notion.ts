export type NotionStatus={configured:boolean;version:string};
export type NotionDatabases={knowledge:string;tasks:string;opportunities:string};
const STORAGE_KEY="campus-os-notion-v1";
export async function getNotionStatus():Promise<NotionStatus>{const response=await fetch("/api/notion");if(!response.ok)throw new Error("Notion status unavailable");return response.json();}
export function loadNotionDatabases():NotionDatabases|undefined{if(typeof window==="undefined")return undefined;try{const raw=window.localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):undefined}catch{return undefined}}
export function saveNotionDatabases(databases:NotionDatabases){if(typeof window!=="undefined")window.localStorage.setItem(STORAGE_KEY,JSON.stringify(databases))}
export async function bootstrapNotion():Promise<NotionDatabases>{const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"bootstrap"})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not create Notion databases");saveNotionDatabases(data.databases);return data.databases}
export async function syncToNotion(state:unknown,databases:NotionDatabases){const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"sync",state,databases})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not sync Campus OS to Notion");return data}
