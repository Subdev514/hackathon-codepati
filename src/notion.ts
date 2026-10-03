export type NotionStatus={configured:boolean;version:string};
export type NotionDatabases={knowledge:string;tasks:string;opportunities:string};
const STORAGE_KEY="campus-os-notion-v1";
export async function getNotionStatus():Promise<NotionStatus>{const response=await fetch("/api/notion");if(!response.ok)throw new Error("Notion status unavailable");return response.json();}
export function loadNotionDatabases():NotionDatabases|undefined{if(typeof window==="undefined")return undefined;try{const raw=window.localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):undefined}catch{return undefined}}
export function saveNotionDatabases(databases:NotionDatabases){if(typeof window!=="undefined")window.localStorage.setItem(STORAGE_KEY,JSON.stringify(databases))}
export async function bootstrapNotion():Promise<NotionDatabases>{const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"bootstrap"})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not create Notion databases");saveNotionDatabases(data.databases);return data.databases}
export async function syncToNotion(state:unknown,databases:NotionDatabases){const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"sync",state,databases})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not sync Campus OS to Notion");return data}
export type NotionTable="events"|"feedback"|"resources"|"guests"|"budget"|"polls"|"conflicts";
const TABLE_KEY="campus-os-notion-table-";
// The skip window lets a reload re-check the Notion table (missing columns, deleted rows) after a while.
const TABLE_RECHECK_MS=10*60*1000;
type TableSyncMemo={dataSourceId?:string;signature?:string;syncedAt?:number};
function loadTableMemo(table:NotionTable):TableSyncMemo{try{return JSON.parse(window.localStorage.getItem(TABLE_KEY+table)||"{}")}catch{return {}}}
// Table syncs run one at a time so several tables changing together stay under Notion's rate limit.
let tableQueue:Promise<unknown>=Promise.resolve();
export function syncTableToNotion(table:NotionTable,records:unknown[]){const run=tableQueue.then(()=>syncTableNow(table,records));tableQueue=run.catch(()=>undefined);return run}
export type NotionCalendar={configured:boolean;events:import("./domain").ExternalEvent[]};
// Reads events that were added by hand to the Notion events table, for conflict detection.
export async function readNotionCalendar():Promise<NotionCalendar>{const memo=loadTableMemo("events");const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"read_calendar",dataSourceId:memo.dataSourceId})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not read the Notion calendar");return {configured:data.configured!==false,events:Array.isArray(data.events)?data.events:[]}}
async function syncTableNow(table:NotionTable,records:unknown[]){const memo=loadTableMemo(table);const signature=JSON.stringify(records);if(memo.dataSourceId&&memo.signature===signature&&Date.now()-(memo.syncedAt||0)<TABLE_RECHECK_MS)return {skipped:true};const response=await fetch("/api/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"sync_table",table,records,dataSourceId:memo.dataSourceId})});const data=await response.json();if(!response.ok)throw new Error(data.error||"Could not sync "+table+" to Notion");if(data.ok){try{window.localStorage.setItem(TABLE_KEY+table,JSON.stringify({dataSourceId:data.dataSourceId,signature,syncedAt:Date.now()}))}catch{}}return data}
