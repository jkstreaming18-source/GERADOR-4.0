
import React, { useState, useRef } from 'react';
import { AppMode, AppState, CreateFunction, EditFunction, AspectRatio } from './types';
import { generateAIImage } from './geminiService';

// --- SVG ICONS ---
const Icons = {
  MainLogo: () => <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-blue-600" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Prompt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  Rocket: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"/></svg>,
  Magic: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 011.275 1.275L21 12l-5.813 1.912a2 2 0 01-1.275 1.275L12 21l-1.912-5.813a2 2 0 01-1.275-1.275L3 12l5.813-1.912a2 2 0 011.275-1.275L12 3z"/></svg>,
  Sticker: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m14 14-4-4"/><path d="m14 10-4 4"/></svg>,
  Logo: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  Comic: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.4 8.5 8.5 0 0 1 7.6 10.4 8.38 8.38 0 0 1-.9-3.8z"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  Retouch: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  Style: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  Layers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Key: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5"/></svg>
};

const RatioIcons = {
  '1:1': () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>,
  '4:3': () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/></svg>,
  '3:4': () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/></svg>,
  '16:9': () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/></svg>,
  '9:16': () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/></svg>,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: AppMode.CREATE,
    activeFunction: 'free',
    aspectRatio: '1:1',
    prompt: '',
    image1: null,
    image2: null,
    isGenerating: false,
    resultImage: null,
    showDualUpload: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const setMode = (mode: AppMode) => {
    setState(prev => ({
      ...prev,
      mode,
      activeFunction: mode === AppMode.CREATE ? 'free' : 'add-remove',
      showDualUpload: false
    }));
  };

  const setRatio = (ratio: AspectRatio) => {
    setState(prev => ({ ...prev, aspectRatio: ratio }));
  };

  const setActiveFunction = (fn: CreateFunction | EditFunction, requiresTwo: boolean = false) => {
    setState(prev => ({ ...prev, activeFunction: fn, showDualUpload: requiresTwo }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 0 | 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 0) setState(prev => ({ ...prev, image1: base64 }));
        if (target === 1) setState(prev => ({ ...prev, image1: base64 }));
        if (target === 2) setState(prev => ({ ...prev, image2: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (state.mode === AppMode.CREATE && !state.prompt) {
      alert("Por favor, descreva sua ideia.");
      return;
    }
    setState(prev => ({ ...prev, isGenerating: true, resultImage: null }));
    try {
      const result = await generateAIImage(
        state.prompt, state.mode, state.activeFunction,
        state.image1, state.image2, state.aspectRatio
      );
      setState(prev => ({ ...prev, resultImage: result, isGenerating: false }));
    } catch (error: any) {
      console.error(error);
      alert("Erro ao gerar: " + error.message);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const getRatioStyle = (ratio: AspectRatio) => {
    const map = { '1:1': '1/1', '4:3': '4/3', '3:4': '3/4', '16:9': '16/9', '9:16': '9/16' };
    return { aspectRatio: map[ratio] };
  };

  return (
    <div className="container">
      <header className="panel-header flex-col lg:flex-row text-center lg:text-left gap-4">
        <div className="flex items-center gap-4">
          <Icons.MainLogo />
          <div>
            <h1 className="panel-title">AI Studio</h1>
            <p className="panel-subtitle">Elite Image Engine</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6">
        <div className="prompt-section">
          <div className="section-title"><div className="w-4 h-4"><Icons.Prompt /></div>O QUE VOCÊ IMAGINA?</div>
          <textarea
            className="prompt-input"
            placeholder="Descreva cada detalhe da sua obra prima..."
            value={state.prompt}
            onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
          />
        </div>

        <div className="mode-toggle w-full">
          <button className={`mode-btn ${state.mode === AppMode.CREATE ? 'active' : ''}`} onClick={() => setMode(AppMode.CREATE)}>CRIAR</button>
          <button className={`mode-btn ${state.mode === AppMode.EDIT ? 'active' : ''}`} onClick={() => setMode(AppMode.EDIT)}>EDITAR</button>
        </div>

        <div>
          <div className="section-title">PROPORÇÃO DA TELA</div>
          <div className="ratio-toggle scrollbar-hide">
            {(['1:1', '4:3', '3:4', '16:9', '9:16'] as AspectRatio[]).map(r => (
              <button key={r} className={`ratio-btn ${state.aspectRatio === r ? 'active' : ''}`} onClick={() => setRatio(r)}>
                <div className="w-5 h-5">{RatioIcons[r]()}</div>
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="functions-section">
            <div className="section-title">FERRAMENTAS</div>
            <div className="functions-grid">
              {state.mode === AppMode.CREATE ? (
                <>
                  <div className={`function-card ${state.activeFunction === 'free' ? 'active' : ''}`} onClick={() => setActiveFunction('free')}><Icons.Magic /><div>Prompt</div></div>
                  <div className={`function-card ${state.activeFunction === 'sticker' ? 'active' : ''}`} onClick={() => setActiveFunction('sticker')}><Icons.Sticker /><div>Adesivo</div></div>
                  <div className={`function-card ${state.activeFunction === 'text' ? 'active' : ''}`} onClick={() => setActiveFunction('text')}><Icons.Logo /><div>Logo</div></div>
                  <div className={`function-card ${state.activeFunction === 'comic' ? 'active' : ''}`} onClick={() => setActiveFunction('comic')}><Icons.Comic /><div>HQ</div></div>
                </>
              ) : (
                <>
                  <div className={`function-card ${state.activeFunction === 'add-remove' ? 'active' : ''}`} onClick={() => setActiveFunction('add-remove')}><Icons.Plus /><div>Add</div></div>
                  <div className={`function-card ${state.activeFunction === 'retouch' ? 'active' : ''}`} onClick={() => setActiveFunction('retouch')}><Icons.Retouch /><div>Retoque</div></div>
                  <div className={`function-card ${state.activeFunction === 'style' ? 'active' : ''}`} onClick={() => setActiveFunction('style')}><Icons.Style /><div>Estilo</div></div>
                  <div className={`function-card ${state.activeFunction === 'compose' ? 'active' : ''}`} onClick={() => setActiveFunction('compose', true)}><Icons.Layers /><div>Unir</div></div>
                </>
              )}
            </div>
          </div>

          <div className="functions-section flex flex-col justify-end">
             {state.mode === AppMode.EDIT && (
              <>
                {!state.showDualUpload ? (
                  <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-8 h-8 opacity-30 mb-2"><Icons.Upload /></div>
                    <div className="text-[10px] uppercase font-black text-slate-400">Enviar Imagem Base</div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 0)} />
                    {state.image1 && <img src={state.image1} className="image-preview" />}
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="upload-area-dual flex-1" onClick={() => fileInput1Ref.current?.click()}>
                      <div className="w-6 h-6 opacity-30"><Icons.Upload /></div>
                      <input type="file" ref={fileInput1Ref} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 1)} />
                      {state.image1 && <img src={state.image1} className="image-preview" />}
                    </div>
                    <div className="upload-area-dual flex-1" onClick={() => fileInput2Ref.current?.click()}>
                      <div className="w-6 h-6 opacity-30"><Icons.Upload /></div>
                      <input type="file" ref={fileInput2Ref} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 2)} />
                      {state.image2 && <img src={state.image2} className="image-preview" />}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <button className="generate-btn" disabled={state.isGenerating} onClick={generateImage}>
          {state.isGenerating ? (
            <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <div className="w-7 h-7"><Icons.Rocket /></div>
              <span>LANÇAR GERAÇÃO</span>
            </>
          )}
        </button>

        <section className="visualization-container">
          <div className="image-frame" style={getRatioStyle(state.aspectRatio)}>
            {!state.resultImage && !state.isGenerating && (
              <div className="flex flex-col items-center opacity-10">
                <div className="w-32 h-32 mb-8 text-slate-200"><Icons.Rocket /></div>
                <div className="text-xl font-black tracking-[0.5em] uppercase text-slate-300">Pronto para Iniciar</div>
              </div>
            )}
            
            {state.isGenerating && (
              <div className="flex flex-col items-center">
                <div className="animate-spin w-20 h-20 border-[6px] border-blue-600 border-t-transparent rounded-full mb-8 shadow-[0_0_40px_rgba(37,99,235,0.2)]" />
                <div className="text-blue-600 font-black tracking-[0.3em] animate-pulse text-lg">CRIANDO ARTE...</div>
              </div>
            )}

            {state.resultImage && (
              <>
                <img src={state.resultImage} className="generated-image" alt="AI Generated Artwork" />
                <div className="image-actions">
                  <button className="action-btn" title="Refinar esta imagem" onClick={() => { setState(p => ({ ...p, mode: AppMode.EDIT, image1: state.resultImage, resultImage: null })); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                    <Icons.Edit />
                  </button>
                  <button className="action-btn" title="Baixar Original" onClick={() => { const l = document.createElement('a'); l.href = state.resultImage!; l.download = `ai-masterpiece-${Date.now()}.png`; l.click(); }}>
                    <Icons.Download />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      
      <footer className="mt-8 text-center text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase">
        AI Studio Professional • Powered by Gemini 3 Pro
      </footer>
    </div>
  );
};

export default App;
