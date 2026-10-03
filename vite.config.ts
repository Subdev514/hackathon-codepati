import {defineConfig,loadEnv,type Plugin,type ViteDevServer} from "vite";import react from "@vitejs/plugin-react";

// Vercel runs api/*.js as serverless functions in production; this serves the same handler during `npm run dev`.
function campusApi():Plugin{return {name:"campus-os-api",configureServer(server:ViteDevServer){server.middlewares.use("/api/notion",async(req,res)=>{
let raw="";for await(const chunk of req)raw+=chunk;
const body=raw?JSON.parse(raw):undefined;
const shim={setHeader:(k:string,v:string)=>{res.setHeader(k,v)},status(code:number){res.statusCode=code;return shim},json(data:unknown){res.setHeader("Content-Type","application/json");res.end(JSON.stringify(data))},end(){res.end()}};
const {default:handler}=await server.ssrLoadModule("/api/notion.js");
await handler({method:req.method,body},shim);
})}}}

export default defineConfig(({mode})=>{
// Server-only secrets from .env (NOTION_TOKEN, ...) for the dev API. They are not exposed to the browser bundle.
for(const [key,value] of Object.entries(loadEnv(mode,process.cwd(),"")))if(!(key in process.env))process.env[key]=value;
return {plugins:[react(),campusApi()]};
});
