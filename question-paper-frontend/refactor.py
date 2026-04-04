import sys

def process(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Base wrappers
    content = content.replace('text-[var(--text-primary)] font-body min-h-screen flex flex-col selection:bg-primary/30 relative', 'text-on-surface font-body min-h-screen relative flex flex-col')
    
    # Remove gradients and glowing effect imports
    content = content.replace('<div className="fixed top-1/4 -left-96 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />\n      <div className="fixed bottom-1/4 -right-96 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />', '')
    content = content.replace('import { GlowingEffect } from "../components/ui/GlowingEffect";\n', '')
    
    # Remove GlowingEffect tags completely
    while True:
        glow_start = content.find('<GlowingEffect')
        if glow_start == -1:
            break
        glow_end = content.find('/>', glow_start) + 2
        content = content[:glow_start] + content[glow_end:]
    
    # Filter Repository Aside
    content = content.replace('glass-card p-6 sm:p-8 rounded-3xl lg:sticky lg:top-24 shadow-xl', 'bg-surface-container-low p-6 sm:p-8 rounded-md lg:sticky lg:top-24 shadow-ambient border border-outline-variant/30')
    content = content.replace('text-white', 'text-on-surface')
    content = content.replace('text-slate-400', 'text-on-surface-variant')
    
    # Inputs
    content = content.replace('bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none placeholder:text-slate-600 font-body', 'bg-surface-container border border-outline-variant focus:border-primary focus:border-2 focus:bg-surface-container-high transition-all text-on-surface py-2 px-3 rounded-md outline-none placeholder:text-on-surface-variant/50 font-body')
    content = content.replace('bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-3 rounded-t outline-none font-body cursor-pointer appearance-none', 'bg-surface-container border border-outline-variant focus:border-primary focus:border-2 focus:bg-surface-container-high transition-all text-on-surface py-2 px-3 rounded-md outline-none font-body cursor-pointer appearance-none')
    content = content.replace('bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:bg-white/10 focus:ring-0 transition-all text-white py-2 px-2 rounded-t outline-none font-body cursor-pointer appearance-none text-sm', 'bg-surface-container border border-outline-variant focus:border-primary focus:border-2 focus:bg-surface-container-high transition-all text-on-surface py-2 px-2 rounded-md outline-none font-body cursor-pointer appearance-none text-sm')
    
    content = content.replace('bg-[#0f1930]', 'bg-surface-container')
    
    content = content.replace('bg-gradient-to-r from-primary to-primary-dim text-[#060e20] py-3 rounded-full font-bold font-headline transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20', 'btn-primary py-3 rounded-md hover:scale-[1.02] active:scale-95 shadow-ambient')
    content = content.replace('border border-white/10 hover:bg-white/5 text-slate-300 py-3 rounded-full', 'border border-outline-variant/30 hover:bg-surface-container-high text-on-surface py-3 rounded-md')
    
    # Content Title
    content = content.replace('bg-white/5 px-4 py-2 rounded-full border border-white/5', 'bg-surface-container-high px-4 py-2 rounded-md border border-outline-variant/30')
    
    # Empty State
    content = content.replace('glass-card rounded-[2rem] p-12 flex flex-col items-center justify-center text-center opacity-80 h-64 border-dashed border-white/20 border-2 bg-transparent', 'bg-surface-container-low rounded-md p-12 flex flex-col items-center justify-center text-center h-64 border-dashed border-outline-variant/50 border-2')
    content = content.replace('text-slate-600', 'text-on-surface-variant')
    
    # Item Card
    content = content.replace('relative rounded-[2rem] border border-white/5', 'relative rounded-md border border-outline-variant/30 overflow-hidden')
    content = content.replace('glass-card p-8 rounded-[2rem] flex flex-col justify-between group hover:bg-[#192540]/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full', 'bg-surface-container-low p-8 rounded-md flex flex-col justify-between group hover:bg-surface-container-high hover:shadow-ambient transition-all duration-500 h-full')
    content = content.replace('bg-primary/10 text-primary px-3 py-1 rounded-full font-label text-xs font-bold tracking-wider border border-primary/20', 'bg-primary/10 text-primary px-3 py-1 rounded-md font-label text-xs font-bold tracking-wider border border-primary/20')
    content = content.replace('text-slate-500 font-label text-xs font-bold bg-white/5 px-2 py-1 rounded border border-white/5 tracking-widest', 'text-on-surface-variant font-label text-xs font-bold bg-surface-container-high px-2 py-1 rounded-md border border-outline-variant/30 tracking-widest')
    content = content.replace('group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary', 'group-hover:text-primary')
    content = content.replace('border-white/5 mt-auto', 'border-outline-variant/30 mt-auto')
    content = content.replace('w-10 h-10 rounded-xl bg-gradient-to-br from-[#a3a6ff]/20 to-[#c180ff]/20 flex items-center justify-center border border-white/10 group-hover:border-primary/30', 'w-10 h-10 rounded-md bg-secondary/20 flex items-center justify-center border border-secondary/30 text-secondary')
    content = content.replace('text-slate-500 tracking-widest uppercase', 'text-on-surface-variant tracking-widest uppercase')
    content = content.replace('bg-white/5 hover:bg-gradient-to-r hover:from-primary hover:to-primary-dim p-3 rounded-full text-slate-300 hover:text-[#060e20] transition-all duration-300 shadow-lg active:scale-90', 'bg-surface-container hover:bg-primary p-3 rounded-md text-on-surface hover:text-on-primary transition-all duration-300 shadow-ambient active:scale-90')
    
    # Pagination
    content = content.replace('rounded-full border border-white/10 glass-card text-slate-300 hover:bg-primary/20', 'rounded-md border border-outline-variant/30 bg-surface-container-high text-on-surface hover:bg-surface-container-highest')
    content = content.replace('glass-card rounded-full p-1.5 border border-white/10', 'bg-surface-container-high rounded-md p-1.5 border border-outline-variant/30')
    content = content.replace('rounded-full font-bold font-headline text-sm transition-all', 'rounded-md font-bold font-headline text-sm transition-all')
    content = content.replace('bg-primary text-[#060e20] shadow-[0_0_15px_rgba(163,166,255,0.4)]', 'bg-primary text-on-primary shadow-ambient')
    content = content.replace('text-slate-400 hover:bg-white/10 hover:text-white', 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface')

    # Footer
    content = content.replace('border-t border-[var(--border-subtle)] bg-[var(--bg-nav)]', 'border-t border-outline-variant/30 bg-surface-container-low')
    content = content.replace('text-[#a3a6ff]', 'text-primary')
    content = content.replace('text-[var(--text-muted)]', 'text-on-surface-variant')
    
    content = content.replace('text-slate-500', 'text-on-surface-variant')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process('d:/Work/2. Web/Node/My Projects/QP-Repository/question-paper-frontend/src/pages/DownloadPage.js')
print('DownloadPage.js Processed')
