import { useState, useCallback, useRef } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:#0f1117;}
  ::-webkit-scrollbar-thumb{background:#2a2d3a;border-radius:3px;}
  .sidebar-link{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:8px;cursor:pointer;transition:all .15s;color:#8b8fa8;font-size:14px;}
  .sidebar-link:hover{background:#1a1200;color:#f97316;}
  .sidebar-link.active{background:#1a1200;color:#f97316;}
  .tool-card{background:#13151f;border:1px solid #1e2130;border-radius:14px;padding:28px;cursor:pointer;transition:all .2s;}
  .tool-card:hover{border-color:#f97316;transform:translateY(-2px);box-shadow:0 8px 32px rgba(249,115,22,0.15);}
  .badge{font-size:11px;font-weight:500;padding:3px 10px;border-radius:20px;}
  .badge-ia{background:#1a0e00;color:#fb923c;}
  .badge-popular{background:#1a2010;color:#86efac;}
  .badge-seo{background:#101a30;color:#93c5fd;}
  .badge-conv{background:#1a1010;color:#fca5a5;}
  .badge-otim{background:#1a1820;color:#c4b5fd;}
  .badge-breve{background:#1a1a1a;color:#9ca3af;}
  .stat-card{background:#13151f;border:1px solid #1e2130;border-radius:12px;padding:24px 28px;}
  .gen-btn{cursor:pointer;border:none;border-radius:9px;padding:13px 28px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;transition:all .2s;width:100%;}
  .gen-btn:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-1px);}
  .gen-btn:disabled{opacity:.45;cursor:not-allowed;}
  .sec-btn{cursor:pointer;border:1px solid #252840;border-radius:9px;padding:11px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;transition:all .2s;background:transparent;color:#8b8fa8;}
  .sec-btn:hover:not(:disabled){border-color:#f97316;color:#c4c6d4;}
  .sec-btn:disabled{opacity:.4;cursor:not-allowed;}
  .input-f{background:#0d0f18;border:1px solid #1e2130;border-radius:9px;color:#e2e4f0;font-family:'Inter',sans-serif;font-size:14px;padding:11px 15px;width:100%;outline:none;transition:border .15s;}
  .input-f:focus{border-color:#f97316;}
  .input-f::placeholder{color:#3a3d52;}
  textarea.input-f{resize:vertical;min-height:80px;line-height:1.55;}
  select.input-f{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;cursor:pointer;}
  .result-box{background:#0d0f18;border:1px solid #1e2130;border-radius:12px;padding:24px;min-height:200px;}
  .copy-btn{cursor:pointer;background:#1a1000;border:1px solid #2a1800;border-radius:7px;color:#8b8fa8;font-family:'Inter',sans-serif;font-size:12px;padding:6px 14px;transition:all .2s;}
  .copy-btn:hover{background:#2a1800;color:#fed7aa;}
  .back-btn{cursor:pointer;background:transparent;border:1px solid #1e2130;border-radius:8px;color:#8b8fa8;font-family:'Inter',sans-serif;font-size:13px;padding:8px 16px;display:flex;align-items:center;gap:6px;transition:all .2s;}
  .back-btn:hover{border-color:#f97316;color:#c4c6d4;}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .shimmer{height:13px;border-radius:4px;background:linear-gradient(90deg,#1a1000 25%,#2a1800 50%,#1a1000 75%);background-size:200% 100%;animation:shimmer 1.3s infinite;margin-bottom:10px;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spin{animation:spin 1s linear infinite;display:inline-block;}
  .search-bar{background:#0d0f18;border:1px solid #1e2130;border-radius:9px;color:#e2e4f0;font-family:'Inter',sans-serif;font-size:14px;padding:10px 16px 10px 40px;width:320px;outline:none;}
  .search-bar::placeholder{color:#3a3d52;}
  .drop-zone{border:2px dashed #252840;border-radius:12px;padding:40px 32px;text-align:center;cursor:pointer;transition:all .2s;background:#0a0c14;}
  .drop-zone:hover,.drop-zone.drag-over{border-color:#f97316;background:#0f0a00;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .fade-in{animation:fadeIn .3s ease forwards;}
  .tag-pill{background:#1a0e00;border:1px solid #6a3000;border-radius:6px;padding:4px 10px;font-size:11px;color:#fb923c;}
`;

const TOOLS = [
  {
    id:"brand",icon:"🌐",color:"#4f8ef7",gradient:"linear-gradient(135deg,#1a3a6a,#2d5aa0)",
    badge:"IA Avançada",badgeClass:"badge-ia",label:"Brand Copier",
    desc:"Copie o branding de qualquer site e gere guidelines completos com IA",stat:"Novo!",
    fields:[
      {key:"url",label:"URL DO SITE",placeholder:"https://exemplo.com.br",type:"input"},
      {key:"brand",label:"NOME DA MARCA",placeholder:"Nome da empresa ou marca",type:"input"},
      {key:"tone",label:"TOM DE VOZ",type:"select",options:["Profissional","Inovador","Minimalista","Ousado","Sofisticado"]},
    ],
    prompt:(d)=>`Crie um Brand Guidelines completo para a marca "${d.brand}" (site: ${d.url}). Tom: ${d.tone}. Inclua: 1) Proposta de Valor 2) Personalidade (5 adjetivos) 3) Tom de Voz 4) Mensagens-chave (3) 5) Headlines (5) 6) Tagline (3 opções) 7) Públicos-alvo.`,
  },
  {
    id:"ads",icon:"📢",color:"#c45de0",gradient:"linear-gradient(135deg,#4a1a6a,#7c3aaa)",
    badge:"Popular",badgeClass:"badge-popular",label:"Gerador de Anúncios",
    desc:"Envie a foto do produto e a IA cria os anúncios automaticamente",stat:"1.2k anúncios criados",
    hasImageUpload:true,
    fields:[
      {key:"product",label:"PRODUTO / SERVIÇO",placeholder:"Detectado automaticamente pela IA...",type:"input"},
      {key:"desc",label:"DESCRIÇÃO",placeholder:"Detectada automaticamente pela IA...",type:"textarea"},
      {key:"platform",label:"PLATAFORMA",type:"select",options:["Facebook/Instagram","Google Ads","TikTok","Todas as plataformas"]},
      {key:"objective",label:"OBJETIVO",type:"select",options:["Conversão / Vendas","Geração de Leads","Reconhecimento de Marca","Tráfego para Site"]},
    ],
    prompt:(d)=>`Crie 3 anúncios de alta conversão em português brasileiro para ${d.platform||"Facebook/Instagram"} sobre "${d.product}". Descrição: ${d.desc}. Objetivo: ${d.objective||"Conversão / Vendas"}.\n\nEscreva TODO o conteúdo em português do Brasil.\n\nPara cada anúncio:\n📢 ANÚNCIO [N]\nTítulo Principal: (máx 30 chars)\nTítulo Secundário: (máx 30 chars)\nDescrição: (máx 125 chars)\nCTA: (texto do botão)\nHook: (gancho para stories/vídeo)\n\nUse gatilhos mentais e seja direto.`,
  },
  {
    id:"product",icon:"📄",color:"#4fb8f7",gradient:"linear-gradient(135deg,#0a2a4a,#1a4a7a)",
    badge:"SEO",badgeClass:"badge-seo",label:"Descrições de Produtos",
    desc:"Gere descrições otimizadas que convertem visitantes em compradores",stat:"890 descrições criadas",
    fields:[
      {key:"product",label:"NOME DO PRODUTO",placeholder:"Ex: Tênis Running Pro X500",type:"input"},
      {key:"features",label:"CARACTERÍSTICAS PRINCIPAIS",placeholder:"Liste os features e especificações",type:"textarea"},
      {key:"audience",label:"PÚBLICO-ALVO",type:"select",options:["Consumidor Final","Profissionais","Jovens 18-25","Executivos","Atletas","Mães"]},
      {key:"tone",label:"TOM",type:"select",options:["Persuasivo","Técnico","Emocional","Luxuoso","Casual"]},
    ],
    prompt:(d)=>`Crie uma descrição SEO-otimizada para "${d.product}". Características: ${d.features}. Público: ${d.audience}. Tom: ${d.tone}.\n\n🔤 TÍTULO SEO:\n📝 DESCRIÇÃO CURTA: (2-3 frases)\n📄 DESCRIÇÃO COMPLETA: (máx 250 palavras)\n🏷️ META DESCRIPTION: (máx 155 chars)\n🔑 PALAVRAS-CHAVE: (5-8 keywords)`,
  },
  {
    id:"email",icon:"✉️",color:"#4fde8f",gradient:"linear-gradient(135deg,#0a3020,#1a5a38)",
    badge:"Conversão",badgeClass:"badge-conv",label:"Email Marketing",
    desc:"Crie emails promocionais que aumentam suas vendas",stat:"567 emails criados",
    fields:[
      {key:"product",label:"PRODUTO / OFERTA",placeholder:"O que você está promovendo?",type:"input"},
      {key:"offer",label:"OFERTA / BENEFÍCIO",placeholder:"Ex: 50% de desconto, bônus exclusivo...",type:"input"},
      {key:"audience",label:"SEGMENTO",type:"select",options:["Lista Geral","Leads Frios","Clientes Ativos","Carrinho Abandonado","Reengajamento"]},
      {key:"type",label:"TIPO DE EMAIL",type:"select",options:["Lançamento","Promoção / Desconto","Sequência de Nutrição","Black Friday","Boas-vindas"]},
    ],
    prompt:(d)=>`Crie um email de marketing completo para "${d.product}". Oferta: ${d.offer}. Segmento: ${d.audience}. Tipo: ${d.type}.\n\n📧 ASSUNTO 1: (curiosidade)\n📧 ASSUNTO 2: (urgência)\n📧 ASSUNTO 3: (benefício)\n📧 PRÉ-HEADER:\n\n---\n✉️ CORPO: [Saudação → Gancho → Solução → Prova Social → CTA → P.S.]`,
  },
  {
    id:"titles",icon:"T",color:"#f97316",gradient:"linear-gradient(135deg,#3a1a0a,#6a3010)",iconStyle:{fontFamily:"Georgia",fontWeight:700,fontSize:20},
    badge:"Otimização",badgeClass:"badge-otim",label:"Títulos Irresistíveis",
    desc:"Otimize títulos para máximo impacto e conversão",stat:"1.8k títulos otimizados",
    fields:[
      {key:"topic",label:"TÓPICO / CONTEÚDO",placeholder:"Sobre o que é o conteúdo?",type:"input"},
      {key:"context",label:"CONTEXTO",placeholder:"Onde será usado? Blog, YouTube, landing page...",type:"input"},
      {key:"style",label:"ESTILO",type:"select",options:["Como fazer","Listas (X motivos)","Pergunta provocativa","Choque / Surpresa","Benefício direto","Storytelling"]},
      {key:"audience",label:"PÚBLICO",type:"select",options:["Empreendedores","Profissionais de Marketing","E-commerce","Criadores de Conteúdo","Pequenas Empresas"]},
    ],
    prompt:(d)=>`Crie 10 títulos irresistíveis sobre "${d.topic}". Contexto: ${d.context}. Estilo: ${d.style}. Público: ${d.audience}.\n\nPara cada:\n[N] Título\n💡 Técnica: (gatilho usado)\n📊 Potencial: (Alto/Médio + motivo)`,
  },
  {
    id:"universal",icon:"✦",color:"#f97316",gradient:"linear-gradient(135deg,#2a1a4a,#4a2a7a)",
    badge:"IA Avançada",badgeClass:"badge-ia",label:"Gerador Universal",
    desc:"Ferramenta completa para qualquer tipo de conteúdo personalizado",stat:"2.3k conteúdos gerados",
    fields:[
      {key:"type",label:"TIPO DE CONTEÚDO",type:"select",options:["Post para Instagram","Thread Twitter/X","Script de Vídeo","Roteiro de Stories","Bio / Sobre","FAQ","Press Release","Proposta Comercial"]},
      {key:"brand",label:"MARCA / EMPRESA",placeholder:"Nome e contexto da marca",type:"input"},
      {key:"brief",label:"BRIEFING",placeholder:"Descreva o que precisa, objetivo, informações relevantes...",type:"textarea"},
      {key:"tone",label:"TOM DE VOZ",type:"select",options:["Profissional","Casual","Inspirador","Urgente","Humorístico","Luxuoso","Técnico"]},
    ],
    prompt:(d)=>`Crie um(a) ${d.type} para "${d.brand}". Tom: ${d.tone}. Briefing: ${d.brief}. Entregue pronto para uso, formatado e completo.`,
  },
];

const NAV = [
  {icon:"⊞",label:"Dashboard"},{icon:"🏪",label:"Lojas"},{icon:"📦",label:"Produtos"},
  {icon:"📄",label:"Páginas"},{icon:"⚡",label:"Criar Página IA"},{icon:"✍️",label:"Copywriting",active:true},
  {icon:"🎨",label:"Criativos"},{icon:"💬",label:"AU Chat"},{icon:"🏷️",label:"Marcas"},{icon:"⭐",label:"Avaliações"},
];

export default function AU4Copywriting() {
  const [view, setView] = useState("dashboard");
  const [activeTool, setActiveTool] = useState(null);
  const [form, setForm] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [totalGenerated, setTotalGenerated] = useState(5200);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const openTool = (tool) => {
    setActiveTool(tool); setForm({}); setResult("");
    setImageBase64(null); setImagePreview(null); setAnalysisDone(false);
    setView("tool");
  };

  const loadImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageBase64(e.target.result.split(",")[1]);
      setAnalysisDone(false);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageBase64) return;
    setAnalyzing(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: "Analise a imagem de produto e retorne SOMENTE JSON válido sem markdown.",
          messages: [{
            role: "user",
            content: [
              { type:"image", source:{ type:"base64", media_type:imageMime, data:imageBase64 } },
              { type:"text", text:`Retorne este JSON exato:
{
  "product": "nome completo do produto com marca se visível",
  "desc": "2-3 frases descrevendo benefícios e diferenciais visíveis na imagem"
}` }
            ]
          }]
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("")||"{}";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setForm(prev=>({ ...prev, product:parsed.product||"", desc:parsed.desc||"" }));
      setAnalysisDone(true);
    } catch { setAnalysisDone(true); }
    setAnalyzing(false);
  };

  const generate = useCallback(async () => {
    setLoading(true); setResult("");
    try {
      let messages;
      const platform = form.platform || "Facebook/Instagram";
      const objective = form.objective || "Conversão / Vendas";

      if (activeTool.id === "ads" && imageBase64) {
        messages = [{
          role: "user",
          content: [
            { type:"image", source:{ type:"base64", media_type:imageMime, data:imageBase64 } },
            { type:"text", text:`Você é um copywriter expert em anúncios. Analise a imagem deste produto e crie 3 anúncios persuasivos em português brasileiro para ${platform}. Objetivo: ${objective}.${form.product ? ` Produto: ${form.product}.` : ""}${form.desc ? ` Contexto adicional: ${form.desc}.` : ""}

IMPORTANTE: Todo o conteúdo deve ser escrito em português do Brasil.

Para cada anúncio use exatamente este formato:
📢 ANÚNCIO [N]
Título Principal: (máx 30 chars — impactante)
Título Secundário: (máx 30 chars — benefício chave)
Descrição: (máx 125 chars — persuasiva com CTA implícito)
CTA: (texto do botão de ação)
Hook: (frase de abertura para stories/reels/TikTok)

Use elementos visuais do produto para criar copy específico e convincente. Aplique urgência, prova social e benefício emocional. Escreva em português brasileiro.` }
          ]
        }];
      } else {
        messages = [{ role:"user", content:activeTool.prompt(form) }];
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "Você é um copywriter de nível mundial especializado em marketing digital e conversão. Escreva sempre em português brasileiro. Seja criativo, direto e orientado a resultados.",
          messages,
        }),
      });
      const data = await res.json();
      setResult(data.content?.map(b=>b.text||"").join("")||"Erro ao gerar.");
      setTotalGenerated(n=>n+1);
    } catch { setResult("Erro de conexão. Tente novamente."); }
    setLoading(false);
  }, [form, activeTool, imageBase64, imageMime]);

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const canGenerate = activeTool && (
    activeTool.id==="ads"
      ? (imageBase64 || form.product?.trim())
      : activeTool.fields.filter(f=>f.type==="input"||f.type==="textarea").every(f=>form[f.key]?.trim())
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0a0c14", fontFamily:"'Inter',sans-serif", color:"#e2e4f0" }}>
      <style>{G}</style>

      {/* SIDEBAR */}
      <div style={{ width:220, background:"#0d0f18", borderRight:"1px solid #1e2130", display:"flex", flexDirection:"column", padding:"0 12px 20px", flexShrink:0, position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
        <div style={{ padding:"20px 8px 24px", borderBottom:"1px solid #1e2130", marginBottom:8 }}>
          <span style={{ fontSize:28, fontWeight:800, background:"linear-gradient(135deg,#f97316,#fb923c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-1px" }}>CopyFire</span>
        </div>
        <nav style={{ flex:1 }}>
          {NAV.map(n=>(
            <div key={n.label} className={`sidebar-link ${n.active?"active":""}`} onClick={()=>n.active&&setView("dashboard")}>
              <span style={{ fontSize:16 }}>{n.icon}</span><span>{n.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ fontSize:11, color:"#3a3d52", padding:"0 8px" }}>© 2026 CopyFire — Todos os direitos reservados</div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto" }}>
        {/* Topbar */}
        <div style={{ borderBottom:"1px solid #1e2130", padding:"0 32px", background:"#0a0c14", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
            <h1 style={{ fontSize:20, fontWeight:600, color:"#f97316" }}>Dashboard</h1>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#3a3d52" }}>🔍</span>
                <input className="search-bar" placeholder="Buscar produtos, páginas..." />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#13151f", border:"1px solid #1e2130", borderRadius:9, padding:"7px 14px" }}>
                <span>🧠</span><span style={{ fontSize:13, fontWeight:500 }}>Créditos</span>
                <span style={{ fontSize:13, color:"#fb923c" }}>∞</span>
                <span style={{ color:"#4f8ef7", cursor:"pointer", marginLeft:4 }}>+</span>
              </div>
              <div style={{ fontSize:18, color:"#555", cursor:"pointer" }}>🔔</div>
              <div style={{ width:36, height:36, background:"linear-gradient(135deg,#f97316,#fb923c)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14 }}>M</div>
            </div>
          </div>
        </div>

        <div style={{ padding:"32px 32px 48px" }}>

          {/* DASHBOARD */}
          {view==="dashboard" && (
            <>
              <div style={{ background:"linear-gradient(135deg,#13120a 0%,#1a0e00 50%,#13120a 100%)", border:"1px solid #4a2a00", borderRadius:16, padding:"36px 40px", marginBottom:28, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <h2 style={{ fontSize:34, fontWeight:700, color:"#f97316", letterSpacing:"-0.02em", marginBottom:10 }}>Estúdio de Copywriting</h2>
                  <p style={{ fontSize:15, color:"#8b8fa8", lineHeight:1.6 }}>Crie conteúdo persuasivo que converte com o poder da<br/>inteligência artificial</p>
                </div>
                <div style={{ display:"flex", gap:16 }}>
                  <div className="stat-card" style={{ minWidth:160, textAlign:"center" }}>
                    <div style={{ fontSize:32, fontWeight:700, letterSpacing:"-0.02em" }}>{totalGenerated.toLocaleString("pt-BR")}</div>
                    <div style={{ fontSize:13, color:"#8b8fa8", marginTop:4 }}>Conteúdos Criados</div>
                  </div>
                  <div className="stat-card" style={{ minWidth:160, textAlign:"center" }}>
                    <div style={{ fontSize:32, fontWeight:700, color:"#4fde8f", letterSpacing:"-0.02em" }}>85%</div>
                    <div style={{ fontSize:13, color:"#8b8fa8", marginTop:4 }}>Taxa de Conversão</div>
                  </div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
                {TOOLS.map(tool=>(
                  <div key={tool.id} className="tool-card" onClick={()=>openTool(tool)}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                      <div style={{ width:52, height:52, borderRadius:12, background:tool.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:tool.iconStyle?undefined:22, ...(tool.iconStyle||{}), color:tool.color }}>{tool.icon}</div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                        <span className={`badge ${tool.badgeClass}`}>{tool.badge}</span>
                        {tool.hasImageUpload && <span style={{ fontSize:10, background:"#1a0e00", color:"#f97316", padding:"2px 7px", borderRadius:4, border:"1px solid #3a2060" }}>📸 Visão IA</span>}
                      </div>
                    </div>
                    <h3 style={{ fontSize:16, fontWeight:600, color:"#e2e4f0", marginBottom:8 }}>{tool.label}</h3>
                    <p style={{ fontSize:13, color:"#5a5e75", lineHeight:1.55, marginBottom:20 }}>{tool.desc}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #1e2130", paddingTop:14 }}>
                      <span style={{ fontSize:12, color:"#5a5e75" }}>{tool.stat}</span>
                      <span style={{ fontSize:16, color:"#4fde8f" }}>📈</span>
                    </div>
                  </div>
                ))}
                <div className="tool-card" style={{ opacity:.5, cursor:"default" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                    <div style={{ width:52, height:52, borderRadius:12, background:"linear-gradient(135deg,#1a1a2a,#2a2a3a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>➕</div>
                    <span className="badge badge-breve">Em breve</span>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:600, color:"#8b8fa8", marginBottom:8 }}>Templates Premium</h3>
                  <p style={{ fontSize:13, color:"#3a3d52", lineHeight:1.55, marginBottom:20 }}>Acesse nossa biblioteca de templates profissionais</p>
                  <div style={{ display:"flex", justifyContent:"space-between", borderTop:"1px solid #1e2130", paddingTop:14 }}>
                    <span style={{ fontSize:12, color:"#3a3d52" }}>Em breve</span>
                    <span style={{ color:"#3a3d52" }}>📈</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TOOL VIEW */}
          {view==="tool" && activeTool && (
            <div style={{ maxWidth:820 }}>
              <button className="back-btn" onClick={()=>setView("dashboard")} style={{ marginBottom:28 }}>← Voltar ao Dashboard</button>

              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:activeTool.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:activeTool.iconStyle?undefined:24, ...(activeTool.iconStyle||{}), color:activeTool.color }}>{activeTool.icon}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <h2 style={{ fontSize:24, fontWeight:700, color:"#e2e4f0" }}>{activeTool.label}</h2>
                    <span className={`badge ${activeTool.badgeClass}`}>{activeTool.badge}</span>
                    {activeTool.hasImageUpload && <span style={{ fontSize:11, background:"#1a0e00", color:"#fb923c", padding:"3px 9px", borderRadius:5, border:"1px solid #6a3000" }}>✦ Visão IA</span>}
                  </div>
                  <p style={{ fontSize:14, color:"#5a5e75" }}>{activeTool.desc}</p>
                </div>
              </div>

              {/* IMAGE UPLOAD ZONE */}
              {activeTool.hasImageUpload && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:"#5a5e75", letterSpacing:"0.1em", marginBottom:10, fontWeight:500 }}>FOTO DO PRODUTO</div>

                  {!imagePreview ? (
                    <div
                      className={`drop-zone${dragOver?" drag-over":""}`}
                      onClick={()=>fileRef.current?.click()}
                      onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                      onDragLeave={()=>setDragOver(false)}
                      onDrop={e=>{e.preventDefault();setDragOver(false);loadImage(e.dataTransfer.files[0])}}
                    >
                      <div style={{ fontSize:40, marginBottom:14, opacity:.35 }}>📸</div>
                      <div style={{ fontSize:15, color:"#8b8fa8", fontWeight:600, marginBottom:6 }}>Arraste a foto do produto aqui</div>
                      <div style={{ fontSize:13, color:"#3a3d52", marginBottom:20 }}>ou clique para selecionar · JPG, PNG, WEBP</div>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#2a1060,#4a1a8a)", border:"1px solid #5a2aaa", borderRadius:9, padding:"10px 22px", fontSize:13, color:"#c4b5fd", fontWeight:500, cursor:"pointer" }}>
                        📂 Escolher imagem
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>loadImage(e.target.files[0])} />
                    </div>
                  ) : (
                    <div style={{ background:"#13151f", border:"1px solid #4a2a00", borderRadius:14, overflow:"hidden" }} className="fade-in">
                      <div style={{ display:"flex" }}>
                        {/* Image preview */}
                        <div style={{ width:200, flexShrink:0, position:"relative" }}>
                          <img src={imagePreview} alt="produto" style={{ width:"100%", height:200, objectFit:"cover", display:"block" }}/>
                          <button
                            onClick={()=>{setImagePreview(null);setImageBase64(null);setAnalysisDone(false);setForm({});}}
                            style={{ position:"absolute", top:10, right:10, background:"#000c", border:"none", borderRadius:"50%", width:28, height:28, color:"#fff", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                        </div>
                        {/* Analysis panel */}
                        <div style={{ flex:1, padding:"22px 26px", display:"flex", flexDirection:"column", justifyContent:"center", gap:14 }}>
                          {!analysisDone ? (
                            <>
                              <div style={{ fontSize:15, color:"#c4c6d4", fontWeight:600 }}>Imagem carregada! 🎉</div>
                              <div style={{ fontSize:13, color:"#5a5e75", lineHeight:1.55 }}>
                                Clique em <strong style={{color:"#c4b5fd"}}>Analisar com IA</strong> e o Claude vai identificar o produto e preencher todos os campos automaticamente — sem você digitar nada.
                              </div>
                              <div style={{ display:"flex", gap:10 }}>
                                <button className="gen-btn" disabled={analyzing} onClick={analyzeImage}
                                  style={{ width:"auto", padding:"10px 22px", background:"linear-gradient(135deg,#c2410c,#ea580c)", color:"#fff", fontSize:13 }}>
                                  {analyzing ? <><span className="spin" style={{marginRight:6}}>⚙</span>Analisando imagem...</> : "🔍 Analisar com IA"}
                                </button>
                                <button className="sec-btn" onClick={()=>setAnalysisDone(true)} style={{ fontSize:13, padding:"10px 18px" }}>Preencher manualmente</button>
                              </div>
                            </>
                          ) : (
                            <div className="fade-in">
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                                <span style={{ fontSize:20 }}>✅</span>
                                <span style={{ fontSize:15, color:"#4fde8f", fontWeight:600 }}>Produto identificado!</span>
                              </div>
                              {form.product && <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                                <span className="tag-pill">📦 {form.product}</span>
                              </div>}
                              <div style={{ fontSize:13, color:"#5a5e75" }}>
                                Campos preenchidos automaticamente. Ajuste abaixo se necessário e clique em gerar.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FORM */}
              <div style={{ background:"#13151f", border:"1px solid #1e2130", borderRadius:14, padding:28, marginBottom:20 }}>
                {activeTool.hasImageUpload && (
                  <div style={{ fontSize:12, color: imageBase64?"#4fde8f88":"#3a3d52", marginBottom:18, display:"flex", alignItems:"center", gap:7 }}>
                    <span style={{ fontSize:8 }}>●</span>
                    {imageBase64 ? "Imagem carregada — campos opcionais, a IA usará a foto como referência principal" : "Sem imagem — preencha os campos manualmente"}
                  </div>
                )}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                  {activeTool.fields.map(f=>(
                    <div key={f.key} style={{ gridColumn:f.type==="textarea"?"1/-1":undefined }}>
                      <label style={{ fontSize:11, color:"#5a5e75", letterSpacing:"0.1em", display:"block", marginBottom:8, fontWeight:500 }}>{f.label}</label>
                      {f.type==="input" && <input className="input-f" placeholder={f.placeholder} value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})}/>}
                      {f.type==="textarea" && <textarea className="input-f" placeholder={f.placeholder} value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})}/>}
                      {f.type==="select" && (
                        <select className="input-f" value={form[f.key]||f.options[0]} onChange={e=>setForm({...form,[f.key]:e.target.value})}>
                          {f.options.map(o=><option key={o}>{o}</option>)}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:22 }}>
                  <button className="gen-btn" disabled={loading||!canGenerate} onClick={generate}
                    style={{ background:loading?"#1a0800":`linear-gradient(135deg,${activeTool.color},${activeTool.color}88)`, color:"#fff" }}>
                    {loading ? <><span className="spin" style={{marginRight:8}}>⚙</span>Gerando com IA...</> : `✦ Gerar ${activeTool.label}`}
                  </button>
                </div>
              </div>

              {/* RESULT */}
              <div className="result-box">
                {loading ? (
                  <div>
                    <div style={{ fontSize:13, color:"#5a5e75", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ color:activeTool.color }} className="spin">✦</span>
                      {imageBase64 && activeTool.id==="ads" ? "Analisando imagem e criando anúncios..." : "Escrevendo com IA..."}
                    </div>
                    {[95,75,85,65,80,70].map((w,i)=><div key={i} className="shimmer" style={{ width:`${w}%`, animationDelay:`${i*.1}s` }}/>)}
                  </div>
                ) : result ? (
                  <div className="fade-in">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                      <div style={{ fontSize:13, color:activeTool.color, display:"flex", alignItems:"center", gap:6 }}>✦ Conteúdo gerado com sucesso</div>
                      <button className="copy-btn" onClick={copy}>{copied?"✓ Copiado!":"⎘ Copiar"}</button>
                    </div>
                    <div style={{ fontSize:14, color:"#c4c6d4", lineHeight:1.85, whiteSpace:"pre-wrap" }}>{result}</div>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:160, gap:12 }}>
                    <div style={{ fontSize:36, opacity:.12 }}>{activeTool.icon}</div>
                    <div style={{ fontSize:13, color:"#3a3d52", textAlign:"center" }}>
                      {activeTool.hasImageUpload ? "Envie uma foto do produto ou preencha os campos e clique em gerar" : "Preencha os campos acima e clique em gerar"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
