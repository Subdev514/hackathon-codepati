import{TABLES,ROW_ID_PROPERTY,planSync,schemaRepair,plainTitle,externalEventFromRow}from"./_notionTables.js";
const NOTION_VERSION="2026-03-11";
const API="https://api.notion.com/v1";

function configured(){return Boolean(process.env.NOTION_TOKEN)}

async function notion(path,method="GET",body){
  if(!configured())throw new Error("Notion integration is not configured on this deployment.");
  for(let attempt=0;;attempt++){
    const response=await fetch(API+path,{method,headers:{"Authorization":"Bearer "+process.env.NOTION_TOKEN,"Notion-Version":NOTION_VERSION,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
    // Notion allows ~3 requests/second; back off and retry when rate limited.
    if(response.status===429&&attempt<3){await new Promise(r=>setTimeout(r,1000*(Number(response.headers.get("Retry-After"))||1)));continue}
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.message||"Notion API request failed ("+response.status+")");
    return data;
  }
}

async function createDatabase(title){
  return notion("/databases","POST",{parent:{type:"page_id",page_id:process.env.NOTION_PARENT_PAGE_ID},title:[{type:"text",text:{content:title}}],properties:{Name:{title:{}}}});
}

function textContent(value,max=1900){return String(value||"").slice(0,max)}

async function createPage(databaseId,title,children){
  return notion("/pages","POST",{parent:{database_id:databaseId},properties:{Name:{title:[{type:"text",text:{content:textContent(title,200)}}]}},children:children.slice(0,50).map(content=>({object:"block",type:"paragraph",paragraph:{rich_text:[{type:"text",text:{content:textContent(content)}}]}}))});
}

// ---- Mirrored tables (events, feedback, resources, guests, budget, polls, conflicts) ------
// Only NOTION_TOKEN is required. Each table lives on its own page, created under
// NOTION_PARENT_PAGE_ID when set, else at the workspace top level (personal access tokens),
// else under any page shared with the integration.

const TABLE_ICONS={events:"📅",feedback:"💬",resources:"📦",guests:"🎤",budget:"💰",polls:"🗳️",conflicts:"⚠️"};

async function retrieveDataSource(id){
  const source=await notion("/data_sources/"+id);
  return source.in_trash?null:source;
}

async function searchPages(query){
  const pages=[];let cursor;
  do{
    const page=await notion("/search","POST",{query,filter:{property:"object",value:"page"},page_size:100,start_cursor:cursor});
    pages.push(...page.results.filter(p=>!p.in_trash&&p.parent?.type!=="data_source_id"&&p.parent?.type!=="database_id"));
    cursor=page.has_more?page.next_cursor:undefined;
  }while(cursor);
  return pages;
}

function pageTitle(page){return plainTitle(Object.values(page.properties||{}).find(p=>p.type==="title")?.title)}

async function findDatabaseInPage(pageId,title){
  let cursor;
  do{
    const page=await notion("/blocks/"+pageId+"/children?page_size=100"+(cursor?"&start_cursor="+cursor:""));
    for(const block of page.results){
      if(block.type!=="child_database"||block.in_trash||block.child_database?.title!==title)continue;
      const id=(await notion("/databases/"+block.id)).data_sources?.[0]?.id;
      if(id)return retrieveDataSource(id);
    }
    cursor=page.has_more?page.next_cursor:undefined;
  }while(cursor);
  return null;
}

async function noAccessError(){
  const me=await notion("/users/me").catch(()=>({}));
  return new Error("The Notion integration"+(me.name?" \""+me.name+"\"":"")+" cannot see any page to build its tables in. In Notion, open any page → ••• → Connections → add the integration, then reload Campus OS.");
}

async function createTablePage(table,key){
  const body={properties:{title:{title:[{type:"text",text:{content:table.pageTitle}}]}},icon:{type:"emoji",emoji:TABLE_ICONS[key]},children:[{object:"block",type:"paragraph",paragraph:{rich_text:[{type:"text",text:{content:"Kept in sync automatically by Campus OS. Edits made here to synced rows are overwritten on the next sync; rows you add by hand are left alone."}}]}}]};
  // An unshared or mistyped NOTION_PARENT_PAGE_ID falls through to the token-only options below.
  if(process.env.NOTION_PARENT_PAGE_ID){try{return await notion("/pages","POST",{...body,parent:{type:"page_id",page_id:process.env.NOTION_PARENT_PAGE_ID}})}catch{}}
  // Workspace-level pages work for personal access tokens and public connections, not internal integrations.
  try{return await notion("/pages","POST",{...body,parent:{type:"workspace",workspace:true}})}catch{}
  const ownTitles=new Set(Object.values(TABLES).map(t=>t.pageTitle));
  const candidates=(await searchPages("")).filter(p=>!ownTitles.has(pageTitle(p)));
  const host=candidates.find(p=>p.parent?.type==="workspace")||candidates[0];
  if(!host)throw await noAccessError();
  return notion("/pages","POST",{...body,parent:{type:"page_id",page_id:host.id}});
}

async function createTableDatabase(table,pageId){
  const database=await notion("/databases","POST",{parent:{type:"page_id",page_id:pageId},title:[{type:"text",text:{content:table.databaseTitle}}],is_inline:true,initial_data_source:{properties:table.schema}});
  return database.data_sources[0].id;
}

async function resolveTable(key,requestedId){
  const table=TABLES[key];
  let source=null;
  const pinned=process.env[table.envDataSource];
  if(pinned){
    source=await retrieveDataSource(pinned);
    if(!source)throw new Error(table.envDataSource+" points to a table that is in the Notion trash.");
  }
  if(!source&&requestedId)source=await retrieveDataSource(requestedId).catch(()=>null);
  let page=null;
  if(!source){
    page=(await searchPages(table.pageTitle)).find(p=>pageTitle(p)===table.pageTitle)||null;
    if(page)source=await findDatabaseInPage(page.id,table.databaseTitle);
  }
  if(!source){
    if(!page)page=await createTablePage(table,key);
    return {dataSourceId:await createTableDatabase(table,page.id),url:page.url,created:true};
  }
  // Existing table: add missing columns, fix wrong types and rename the title column if needed.
  const repair=schemaRepair(table.schema,source.properties);
  if(repair)await notion("/data_sources/"+source.id,"PATCH",{properties:repair});
  return {dataSourceId:source.id,url:page?.url,repairedColumns:repair?Object.keys(repair).length:0};
}

async function listRows(dataSourceId){
  const rows=[];let cursor;
  do{
    const page=await notion("/data_sources/"+dataSourceId+"/query","POST",{page_size:100,start_cursor:cursor,filter:{property:ROW_ID_PROPERTY,rich_text:{is_not_empty:true}}});
    for(const row of page.results)rows.push({pageId:row.id,recordId:plainTitle(row.properties[ROW_ID_PROPERTY]?.rich_text)});
    cursor=page.has_more?page.next_cursor:undefined;
  }while(cursor);
  return rows;
}

async function syncTable(key,records,requestedId){
  const table=TABLES[key];
  const source=await resolveTable(key,requestedId);
  const plan=planSync(table,records,await listRows(source.dataSourceId));
  for(const record of plan.create)await notion("/pages","POST",{parent:{type:"data_source_id",data_source_id:source.dataSourceId},properties:table.properties(record)});
  for(const {pageId,record} of plan.update)await notion("/pages/"+pageId,"PATCH",{properties:table.properties(record)});
  for(const pageId of plan.trash)await notion("/pages/"+pageId,"PATCH",{in_trash:true});
  return {...source,counts:{created:plan.create.length,updated:plan.update.length,removed:plan.trash.length}};
}

// Events added by hand to the Notion events table, used as an external calendar for conflict detection.
async function readCalendar(requestedId){
  const source=await resolveTable("events",requestedId);
  const events=[];let cursor;
  do{
    const page=await notion("/data_sources/"+source.dataSourceId+"/query","POST",{page_size:100,start_cursor:cursor,filter:{property:ROW_ID_PROPERTY,rich_text:{is_empty:true}}});
    for(const row of page.results){const event=externalEventFromRow(row);if(event)events.push(event)}
    cursor=page.has_more?page.next_cursor:undefined;
  }while(cursor);
  return {dataSourceId:source.dataSourceId,events};
}

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  if(req.method==="OPTIONS"){res.status(204).end();return}
  if(req.method==="GET"){res.status(200).json({configured:configured(),version:NOTION_VERSION});return}
  if(req.method!=="POST"){res.status(405).json({error:"Method not allowed"});return}
  try{
    const body=req.body||{};
    if(body.action==="bootstrap"){
      const knowledge=await createDatabase("Campus OS · Knowledge");
      const tasks=await createDatabase("Campus OS · Tasks");
      const opportunities=await createDatabase("Campus OS · Opportunities");
      res.status(200).json({ok:true,databases:{knowledge:knowledge.id,tasks:tasks.id,opportunities:opportunities.id}});
      return;
    }
    if(body.action==="sync_table"){
      if(!configured()){res.status(200).json({ok:false,configured:false});return}
      if(!Object.hasOwn(TABLES,body.table)){res.status(400).json({error:"Unknown Notion table"});return}
      const result=await syncTable(body.table,Array.isArray(body.records)?body.records:[],body.dataSourceId);
      res.status(200).json({ok:true,configured:true,...result});
      return;
    }
    if(body.action==="read_calendar"){
      if(!configured()){res.status(200).json({ok:false,configured:false,events:[]});return}
      res.status(200).json({ok:true,configured:true,...await readCalendar(body.dataSourceId)});
      return;
    }
    if(body.action==="sync"){
      const db=body.databases||{};
      const state=body.state||{};
      const results={knowledge:[],tasks:[],opportunities:[]};
      if(db.knowledge)for(const item of (state.knowledge||[]).slice(0,40)){results.knowledge.push(await createPage(db.knowledge,item.title,[item.content,"Tags: "+(item.tags||[]).join(", "),"Campus entities: "+(item.linkedEntityIds||[]).join(", ")]))}
      if(db.tasks)for(const item of (state.tasks||[]).slice(0,40)){results.tasks.push(await createPage(db.tasks,item.title,[item.meta,"Status: "+(item.done?"complete":"open"),item.dueDate?"Due: "+item.dueDate:""]))}
      if(db.opportunities)for(const item of (state.savedOpportunities||[]).slice(0,40)){results.opportunities.push(await createPage(db.opportunities,item.title,["Entity: "+item.entityId,"Saved: "+item.savedAt]))}
      res.status(200).json({ok:true,counts:{knowledge:results.knowledge.length,tasks:results.tasks.length,opportunities:results.opportunities.length}});
      return;
    }
    res.status(400).json({error:"Unknown Notion action"});
  }catch(error){
    res.status(500).json({error:error instanceof Error?error.message:"Notion integration error"});
  }
}
