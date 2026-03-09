import React, { useState, useEffect } from 'react';
import { Shield, History, Info, ExternalLink, Github, AlertCircle, Moon, Sun, Search, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadZone } from './components/UploadZone';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeMedia, AnalysisResult } from './services/gemini';
import { cn } from './utils/cn';

interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  result: AnalysisResult;
}

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load history and theme from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('vishwaas_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history");
      }
    }

    const savedTheme = localStorage.getItem('vishwaas_theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save history and theme to localStorage
  useEffect(() => {
    localStorage.setItem('vishwaas_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('vishwaas_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentResult(null);
    setCurrentFile(file);

    try {
      const result = await analyzeMedia(file);
      setCurrentResult(result);
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        timestamp: Date.now(),
        result
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Analysis failed. Please ensure the file is valid and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('vishwaas_history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink selection:bg-accent/30">
      {/* Header */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-xl leading-none font-display">VISHWAAS-AI</h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-ink-muted mt-1 font-mono">Digital Trust Engine</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <a href="#" className="text-[11px] uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors">Forensics</a>
            <a href="#" className="text-[11px] uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors">Intelligence</a>
            <a href="#" className="text-[11px] uppercase tracking-widest font-semibold text-ink-muted hover:text-ink transition-colors">API</a>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 hover:bg-ink/5 rounded-xl transition-all active:scale-95 text-ink-muted hover:text-ink"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-6 w-[1px] bg-line mx-2" />
            <button className="p-2.5 hover:bg-ink/5 rounded-xl transition-all text-ink-muted hover:text-ink">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 space-y-20">
        {/* Hero Section */}
        <section className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-accent">v3.1 Neural Engine Active</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-semibold tracking-tight leading-[1.05] font-display"
          >
            Verify <span className="text-accent">Authenticity</span> in the Age of AI.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-xl text-ink-muted font-light leading-relaxed max-w-2xl"
          >
            Vishwaas-AI provides military-grade deepfake detection and digital forensic verification 
            for media professionals, journalists, and security agencies.
          </motion.p>
        </section>

        {/* Upload Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-surface border border-line rounded-lg">
                <Search className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Analysis Terminal</h3>
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-mono">Channel: SECURE_SCAN_01</p>
              </div>
            </div>
          </div>
          
          <UploadZone 
            onFileSelect={handleFileSelect} 
            isAnalyzing={isAnalyzing} 
            selectedFile={currentFile}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {currentResult && currentFile && (
            <section key="results" className="pt-20 border-t border-line">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-bold text-2xl">Forensic Report</h3>
                </div>
                <button 
                  onClick={() => {
                    setCurrentResult(null);
                    setCurrentFile(null);
                  }}
                  className="text-[11px] uppercase tracking-widest font-bold text-ink-muted hover:text-ink transition-colors"
                >
                  Close Report
                </button>
              </div>
              <AnalysisResults result={currentResult} file={currentFile} />
            </section>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history.length > 0 && (
          <section className="pt-20 border-t border-line">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-2xl">Recent Intelligence</h3>
              </div>
              <button 
                onClick={clearHistory}
                className="text-[11px] uppercase tracking-widest font-bold text-ink-muted hover:text-ink transition-colors"
              >
                Purge History
              </button>
            </div>

            <div className="bg-surface rounded-3xl border border-line overflow-hidden shadow-xl shadow-ink/5">
              <div className="grid grid-cols-4 px-8 py-5 bg-ink/5 border-b border-line">
                <span className="col-header">Identifier</span>
                <span className="col-header">Status</span>
                <span className="col-header">Confidence</span>
                <span className="col-header">Timestamp</span>
              </div>
              <div className="divide-y divide-line">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="data-row grid grid-cols-4 px-8 py-6 items-center group"
                    onClick={() => {
                      setCurrentResult(item.result);
                      setCurrentFile({ name: item.fileName, size: 0, type: 'unknown/unknown' } as any);
                      window.scrollTo({ top: 800, behavior: 'smooth' });
                    }}
                  >
                    <span className="text-sm font-semibold truncate pr-4 group-hover:text-accent transition-colors">{item.fileName}</span>
                    <div className="flex">
                      <span className={cn(
                        "text-[9px] uppercase font-bold tracking-[0.15em] px-3 py-1 rounded-full",
                        item.result.isFake ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      )}>
                        {item.result.isFake ? 'Manipulated' : 'Verified'}
                      </span>
                    </div>
                    <span className="data-value text-sm font-bold">{item.result.confidenceScore}%</span>
                    <span className="text-xs text-ink-muted font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-20 bg-surface/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-xl font-display">VISHWAAS-AI</span>
            </div>
            <p className="text-base text-ink-muted max-w-md leading-relaxed font-light">
              The global standard for digital authenticity. We provide the tools necessary 
              to navigate a world where seeing is no longer believing.
            </p>
          </div>
          
          <div>
            <h4 className="col-header mb-6">System</h4>
            <ul className="space-y-4 text-sm text-ink-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Neural Engine</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Forensic API</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Whitepaper</a></li>
            </ul>
          </div>

          <div>
            <h4 className="col-header mb-6">Network</h4>
            <div className="flex gap-5">
              <a href="#" className="p-3 bg-surface border border-line rounded-2xl hover:border-accent transition-all hover:-translate-y-1">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-surface border border-line rounded-2xl hover:border-accent transition-all hover:-translate-y-1">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-line text-[9px] uppercase tracking-[0.4em] text-ink-muted text-center font-mono">
          © 2026 Vishwaas Digital Trust Systems. Built for the future of truth.
        </div>
      </footer>
    </div>
  );
}
