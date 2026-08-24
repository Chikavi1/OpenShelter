export const dynamic = 'force-dynamic'
import { ImageResponse } from 'next/og'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { shelterEvents, shelterSettings } from '@/lib/db/schema'
import { getStorageProvider } from '@/lib/storage'
export const alt='Eventos'
export const size={width:1200,height:630}
export const contentType='image/png'
async function toDataUri(url:string,siteUrl:string):Promise<string|null>{ if(!url) return null; if(url.startsWith('data:')) return url; if(url.startsWith('/uploads/')){try{const k=url.replace(/^\/uploads\//,'');const b=await getStorageProvider().read(k) as unknown as Buffer;const e=k.split('.').pop()?.toLowerCase()||'jpeg';const m=e==='png'?'image/png':e==='webp'?'image/webp':'image/jpeg';return `data:${m};base64,${b.toString('base64')}`}catch{return null}} try{const f=url.startsWith('http')?url:`${siteUrl}${url.startsWith('/')?'':'/'}${url}`;const r=await fetch(f,{next:{revalidate:3600}});if(!r.ok) return null;const ct=r.headers.get('content-type')||'image/jpeg';const ab=await r.arrayBuffer();return `data:${ct};base64,${Buffer.from(ab).toString('base64')}`}catch{return null}}
export default async function Image(){
  const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||'https://keyrescata.netlify.app').replace(/\/$/,'')
  let appName=process.env.NEXT_PUBLIC_APP_NAME||'Key Rescata'
  let logoUrl:string|null=null
  let images:string[]=[]
  try{const db=getDb();const [evts,s]=await Promise.all([db.select({image:shelterEvents.image}).from(shelterEvents).limit(3), db.select({name:shelterSettings.name,logoUrl:shelterSettings.logoUrl}).from(shelterSettings).where(eq(shelterSettings.id,1)).limit(1)]); images=evts.map(e=>e.image).filter(Boolean) as string[]; if(s[0]?.name) appName=s[0].name; if(s[0]?.logoUrl) logoUrl=s[0].logoUrl }catch{}
  const logoData=logoUrl?await toDataUri(logoUrl,siteUrl):null
  const heroData=await toDataUri(images[0]||'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1100&q=80',siteUrl)
  return new ImageResponse((
    <div style={{display:'flex',width:'100%',height:'100%',background:'#F4F1DE'}}>
      <div style={{display:'flex',width:'55%',height:'100%',position:'relative',background:'#F2CC8F',overflow:'hidden'}}>
        {heroData?<img src={heroData} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}><span style={{fontSize:80}}></span></div>}
        {logoData && <div style={{position:'absolute',top:24,left:24,display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.96)',padding:'8px 14px',borderRadius:999}}><img src={logoData} alt="" style={{width:36,height:36,borderRadius:999,objectFit:'cover'}}/><span style={{fontSize:14,fontWeight:800,color:'#3D405B'}}>{appName}</span></div>}
      </div>
      <div style={{display:'flex',flexDirection:'column',width:'45%',height:'100%',padding:'36px 32px',justifyContent:'space-between'}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#E07A5F',textTransform:'uppercase' as any}}>Eventos</span>
          <h1 style={{fontSize:42,fontWeight:900,lineHeight:0.92,letterSpacing:-1.2,color:'#3D405B',margin:0}}>Jornadas y encuentros que salvan vidas</h1>
          <p style={{fontSize:14,lineHeight:1.6,color:'#3D405B',opacity:0.7,margin:0}}>Adopta, dona, aprende. Únete a nuestras próximas jornadas.</p>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'white',borderRadius:16,padding:'12px 14px'}}>
          <span style={{fontSize:11,fontWeight:700,color:'#3D405B',opacity:0.6}}>keyrescata.netlify.app/eventos</span>
          <span style={{background:'#3D405B',color:'white',fontSize:12,fontWeight:700,padding:'8px 14px',borderRadius:999}}>Ver eventos →</span>
        </div>
      </div>
    </div>
  ),{...size})
}
