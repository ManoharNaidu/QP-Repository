import sys

def process(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Layout Base
    content = content.replace('text-[var(--text-primary)] min-h-screen flex flex-col selection:bg-primary/30 relative', 'text-on-surface min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] relative flex flex-col')
    
    # Toast
    content = content.replace('shadow-2xl backdrop-blur-md flex items-center gap-3 border ${', 'bg-surface-container-high shadow-ambient flex items-center gap-3 border ${')
    content = content.replace('text-red-200 bg-red-900/40 border-red-500/30', 'text-error bg-error/10 border-error')
    content = content.replace('text-green-200 bg-green-900/40 border-green-500/30', 'text-secondary bg-secondary/10 border-secondary/30')
    
    # Background Ambient and inner glows
    content = content.replace('<div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>\n        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none"></div>', '')
    content = content.replace('<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>', '')
    
    # Title formatting
    content = content.replace('text-white', 'text-on-surface')
    content = content.replace('text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary', 'text-primary')
    content = content.replace('text-slate-400', 'text-on-surface-variant')
    
    # Glass Cards -> Surface containers
    content = content.replace('glass-card rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden', 'bg-surface-container-low rounded-md p-8 md:p-12 shadow-ambient border border-outline-variant/30 relative overflow-hidden')
    content = content.replace('glass-card rounded-3xl p-8 flex flex-col justify-between flex-grow', 'bg-surface-container-low rounded-md p-8 shadow-ambient border border-outline-variant/30 flex flex-col justify-between flex-grow')
    content = content.replace('glass-card rounded-3xl p-8 bg-gradient-to-br from-primary/5 to-transparent border-t border-l border-white/5', 'bg-surface-container-low rounded-md p-8 shadow-ambient border border-outline-variant/30')
    
    # Input replacements
    content = content.replace('w-full bg-white/5 border-b-2 border-white/10 hover:border-white/20 focus:border-primary focus:ring-0 text-white px-4 py-3 rounded-t-lg transition-all placeholder:text-slate-500 font-body outline-none text-on-surface', 'w-full bg-surface-container border border-outline-variant focus:border-primary focus:border-2 focus:bg-surface-container-high text-on-surface px-4 py-3 rounded-md transition-all placeholder:text-on-surface-variant/50 font-body outline-none')
    content = content.replace('w-full bg-white/5 border-b-2 border-white/10 hover:border-white/20 focus:border-primary focus:ring-0 text-white px-4 py-3 rounded-t-lg transition-all placeholder:text-slate-500 font-body outline-none', 'w-full bg-surface-container border border-outline-variant focus:border-primary focus:border-2 focus:bg-surface-container-high text-on-surface px-4 py-3 rounded-md transition-all placeholder:text-on-surface-variant/50 font-body outline-none')
    
    # Badges/Categories
    content = content.replace('border-primary/50 bg-primary/20 text-primary', 'border-primary bg-primary text-on-primary')
    content = content.replace('border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-slate-200', 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:border-outline-variant hover:text-on-surface')
    
    # Submit form button
    content = content.replace('group relative w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-dim rounded-full text-on-primary font-bold shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:shadow-[0_0_30px_rgba(163,166,255,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none', 'btn-primary flex items-center justify-center gap-3 w-full sm:w-auto px-10 disabled:opacity-50 disabled:pointer-events-none shadow-ambient')
    
    # Secondary icons and blocks
    content = content.replace('border-white/5 flex items-center gap-4', 'border-outline-variant/30 flex items-center gap-4')
    content = content.replace('text-slate-500 uppercase', 'text-on-surface-variant uppercase')
    content = content.replace('w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all', 'w-10 h-10 rounded-md bg-surface-container flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all border border-outline-variant/30')

    # Footer
    content = content.replace('border-t border-[var(--border-subtle)] bg-[var(--bg-nav)]', 'border-t border-outline-variant/30 bg-surface-container-low')
    content = content.replace('text-[var(--text-muted)]', 'text-on-surface-variant')
    content = content.replace('text-[#a3a6ff]', 'text-primary')
    content = content.replace('text-[#c180ff]', 'text-secondary')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process('d:/Work/2. Web/Node/My Projects/QP-Repository/question-paper-frontend/src/pages/FeedbackPage.js')
print('FeedbackPage.js Processed')
