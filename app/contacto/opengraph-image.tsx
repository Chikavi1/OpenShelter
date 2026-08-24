export const dynamic = 'force-dynamic'
import { ImageResponse } from 'next/og'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { shelterSettings } from '@/lib/db/schema'
import { getStorageProvider } from '@/lib/storage'
export const alt='Contacto'
export const size={width:1200,height:630}
export const contentType='image/png'
async function toDataUri(url:string,siteUrl:string):Promise<string|null>{ if(!url) return null; if(url.startsWith('data:')) return url; if(url.startsWith('/uploads/')){try{const k=url.replace(/^\/uploads\//,'');const b=await getStorageProvider().read(k) as unknown as Buffer;const e=k.split('.').pop()?.toLowerCase()||'jpeg';const m=e==='png'?'image/png':e==='webp'?'image/webp':'image/jpeg';return `data:${m};base64,${b.toString('base64')}`}catch{return null}} try{const f=url.startsWith('http')?url:`${siteUrl}${url.startsWith('/')?'':'/'}${url}`;const r=await fetch(f,{next:{revalidate:3600}});if(!r.ok) return null;const ct=r.headers.get('content-type')||'image/jpeg';const ab=await r.arrayBuffer();return `data:${ct};base64,${Buffer.from(ab).toString('base64')}`}catch{return null}}
export default async function Image(){
  const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||'https://keyrescata.netlify.app').replace(/\/$/,'')
  let appName=process.env.NEXT_PUBLIC_APP_NAME||'Key Rescata'
  let logoUrl:string|null=null
  try{const db=getDb();const r=await db.select({name:shelterSettings.name,logoUrl:shelterSettings.logoUrl}).from(shelterSettings).where(eq(shelterSettings.id,1)).limit(1); if(r[0]?.name) appName=r[0].name; if(r[0]?.logoUrl) logoUrl=r[0].logoUrl }catch{}
  const logoData=logoUrl?await toDataUri(logoUrl,siteUrl):null
  const heroData=await toDataUri('https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1100&q=80',siteUrl)
  return new ImageResponse((
    <div style={{display:'flex',width:'100%',height:'100%',background:'#F4F1DE'}}>
      <div style={{display:'flex',width:'54%',height:'100%',position:'relative',background:'#3D405B',overflow:'hidden'}}>
        {heroData?<img src={heroData} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.9}}/>:<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}><span style={{fontSize:80}}>📍</span></div>}
        {logoData && <div style={{position:'absolute',top:24,left:24,display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.96)',padding:'8px 14px',borderRadius:999}}><img src={logoData} alt="" style={{width:36,height:36,borderRadius:999,objectFit:'cover',objectPosition:'center 30%' as any}}/><span style={{fontSize:14,fontWeight:800,color:'#3D405B'}}>{appName}</span></div>}
      </div>
      <div style={{display:'flex',flexDirection:'column',width:'46%',height:'100%',padding:'36px 32px',justifyContent:'space-between'}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#E07A5F',textTransform:'uppercase' as any}}>Contacto</span>
          <h1 style={{fontSize:42,fontWeight:900,lineHeight:0.92,letterSpacing:-1.2,color:'#3D405B',margin:0}}>Estamos aquí para ayudarte</h1>
          <p style={{fontSize:14,lineHeight:1.6,color:'#3D405B',opacity:0.7,margin:0}}>Escríbenos, visítanos o únete como voluntario. Cada mensaje cuenta.</p>
          <div style={{display:'flex',gap:8,marginTop:8}}><span style={{background:'#81B29A',color:'white',fontSize:12,fontWeight:700,padding:'8px 14px',borderRadius:999}}>📩 Contáctanos</span></div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'white',borderRadius:16,padding:'12px 14px'}}>
          <span style={{fontSize:11,fontWeight:700,color:'#3D405B',opacity:0.6}}>keyrescata.netlify.app/contacto</span>
        </div>
      </div>
    </div>
  ),{...size})
}
