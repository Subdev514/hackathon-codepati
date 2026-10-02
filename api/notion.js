const NOTION_VERSION="2026-03-11";
const API="https://api.notion.com/v1";

function configured(){return Boolean(process.env.NOTION_TOKEN&&process.env.NOTION_PARENT_PAGE_ID)}

async function notion(path,method="GET",body){
  if(!configured())throw new Error("Notion integration is not configured on this deployment.");
  const response=await fetch(API+path,{method,headers:{"Authorization":"Bearer "+process.env.NOTION_TOKEN,"Notion-Version":NOTION_VERSION,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.message||"Notion API request failed ("+response.status+")");
  return data;
}

async function createDatabase(title){
  return notion("/databases","POST",{parent:{type:"page_id",page_id:process.env.NOTION_PARENT_PAGE_ID},title:[{type:"text",text:{content:title}}],properties:{Name:{title:{}}}});
}

function textContent(value,max=1900){return String(value||"").slice(0,max)}

async function createPage(databaseId,title,children){
  return notion("/pages","POST",{parent:{database_id:databaseId},properties:{Name:{title:[{type:"text",text:{content:textContent(title,200)}}]}},children:children.slice(0,50).map(content=>({object:"block",type:"paragraph",paragraph:{rich_text:[{type:"text",text:{content:textContent(content)}}]}}))});
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
