export type NotionStatus={configured:boolean;version:string};
export type NotionDatabases={knowledge:string;tasks:string;opportunities:string};
const STORAGE_KEY="campus-os-notion-v1";
export async function getNotionStatus():Promise<NotionStatus>{const response=await fetch("/api/notion");if(!response.ok)throw new Error("Notion status unavailable");return response.json();}
export function loadNotionDatabases():NotionDatabases|undefined{if(typeof window==="undefined")return undefined;try{const raw=window.localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):undefined}catch{return undefined}}
export function saveNotionDatabases(databases:NotionDatabases){if(typeof window!=="undefined")window.localStorage.setItem(STORAGE_KEY,JSON.stringify(databases))}
export async function bootstrapNotion():Promise<NotionDatabases>{const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"bootstrap"})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not create Notion databases");saveNotionDatabases(data.databases);return data.databases}
export async function syncToNotion(state:unknown,databases:NotionDatabases){const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"sync",state,databases})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not sync Campus OS to Notion");return data}
const EVENTS_KEY="campus-os-notion-events-v1";
type EventsSyncMemo={dataSourceId?:string;signature?:string};
function loadEventsMemo():EventsSyncMemo{try{return JSON.parse(window.localStorage.getItem(EVENTS_KEY)||"{}")}catch{return {}}}
export async function syncEventsToNotion(events:unknown[]){const memo=loadEventsMemo();const signature=JSON.stringify(events);if(memo.dataSourceId&&memo.signature===signature)return {skipped:true};const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"sync_events",events,dataSourceId:memo.dataSourceId})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not sync events to Notion");if(data.ok){try{window.localStorage.setItem(EVENTS_KEY,JSON.stringify({dataSourceId:data.dataSourceId,signature}))}catch{}}return data}
