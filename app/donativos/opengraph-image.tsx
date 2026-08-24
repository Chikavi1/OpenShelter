export const dynamic = 'force-dynamic'
import { ImageResponse } from 'next/og'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { shelterSettings } from '@/lib/db/schema'
import { getStorageProvider } from '@/lib/storage'
export const alt = 'Donativos — Key Rescata'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
async function toDataUri(url: string, siteUrl: string): Promise<string | null> {
  if (!url) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('/uploads/')) { try { const key=url.replace(/^\/uploads\//,''); const buf=await getStorageProvider().read(key) as unknown as Buffer; const ext=key.split('.').pop()?.toLowerCase()||'jpeg'; const mime=ext==='png'?'image/png':ext==='webp'?'image/webp':'image/jpeg'; return `data:${mime};base64,${buf.toString('base64')}` } catch { return null } }
  try { const full=url.startsWith('http')?url:`${siteUrl}${url.startsWith('/')?'':'/'}${url}`; const res=await fetch(full,{next:{revalidate:3600}}); if(!res.ok) return null; const ct=res.headers.get('content-type')||'image/jpeg'; const ab=await res.arrayBuffer(); return `data:${ct};base64,${Buffer.from(ab).toString('base64')}` } catch { return null }
}
export default async function Image() {
  const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||'https://keyrescata.netlify.app').replace(/\/$/,'')
  let appName=process.env.NEXT_PUBLIC_APP_NAME||'Key Rescata'
  let logoUrl: string|null=process.env.NEXT_PUBLIC_LOGO_URL||null
  let supportTitle='Tu ayuda se convierte en patitas.'
  try{ const db=getDb(); const r=await db.select({name:shelterSettings.name,logoUrl:shelterSettings.logoUrl,supportTitle:shelterSettings.supportTitle}).from(shelterSettings).where(eq(shelterSettings.id,1)).limit(1); if(r[0]?.name) appName=r[0].name; if(r[0]?.logoUrl) logoUrl=r[0].logoUrl; if(r[0]?.supportTitle) supportTitle=r[0].supportTitle }catch{}
  const logoData=logoUrl?await toDataUri(logoUrl,siteUrl):null
  const heroData=await toDataUri('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1100&q=80',siteUrl)
  return new ImageResponse((
    <div style={{ display:'flex', width:'100%', height:'100%', background:'#F4F1DE' }}>
      <div style={{ display:'flex', width:'55%', height:'100%', position:'relative', background:'#3D405B', overflow:'hidden' }}>
        {heroData?<img src={heroData} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.95}}/>:<div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',height:'100%'}}><span style={{fontSize:96}}>💛</span></div>}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(61,64,91,0.75) 100%)' as any}}/>
        <div style={{position:'absolute',bottom:28,left:32,right:32, display:'flex', flexDirection:'column', gap:8}}>
          <span style={{display:'inline-flex',alignSelf:'flex-start',background:'#F2CC8F',color:'#3D405B',fontSize:11,fontWeight:800,letterSpacing:1,padding:'6px 12px',borderRadius:999}}>💛 100% al rescate</span>
          <p style={{color:'white',fontSize:14, fontWeight:700, margin:0}}>Donativos transparentes · Cada peso cuenta</p>
        </div>
        {logoData && <div style={{position:'absolute',top:24,left:24,display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.96)',padding:'8px 14px',borderRadius:999}}><img src={logoData} alt="" style={{width:36,height:36,borderRadius:999,objectFit:'cover',objectPosition:'center 30%' as any}}/><span style={{fontSize:14,fontWeight:800,color:'#3D405B'}}>{appName}</span></div>}
      </div>
      <div style={{display:'flex',flexDirection:'column',width:'45%',height:'100%',padding:'36px 32px',background:'#F4F1DE',justifyContent:'space-between'}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#E07A5F',textTransform:'uppercase' as any}}>Donativos y apoyo</span>
          <h1 style={{fontSize:40,fontWeight:900,lineHeight:0.92,letterSpacing:-1.2,color:'#3D405B',margin:0}}>{supportTitle}</h1>
          <p style={{fontSize:14,lineHeight:1.6,color:'#3D405B',opacity:0.7,margin:'4px 0 0 0'}}>Elige transferencia, PayPal o lo que prefieras. Transparencia total, directo al rescate.</p>
          <div style={{display:'flex',gap:8,marginTop:8}}><span style={{background:'#E07A5F',color:'white',fontSize:12,fontWeight:700,padding:'8px 14px',borderRadius:999}}>🧡 Donar ahora</span><span style={{background:'white',border:'1px solid rgba(61,64,91,0.12)',color:'#3D405B',fontSize:12,fontWeight:700,padding:'8px 14px',borderRadius:999}}>Transferencia · PayPal</span></div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'white',borderRadius:16,padding:'12px 14px'}}>
          <span style={{fontSize:11,fontWeight:700,color:'#3D405B',opacity:0.6}}>keyrescata.netlify.app/donar</span>
          <span style={{background:'#3D405B',color:'white',fontSize:12,fontWeight:700,padding:'8px 14px',borderRadius:999}}>Yo ayudo →</span>
        </div>
      </div>
    </div>
  ),{...size})
}
