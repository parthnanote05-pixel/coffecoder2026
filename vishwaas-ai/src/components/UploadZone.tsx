import React, { useCallback, useState, useEffect } from 'react';
import { Upload, FileWarning, CheckCircle2, ShieldAlert, Loader2, FileText, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  selectedFile: File | null;
}

export function UploadZone({ onFileSelect, isAnalyzing, selectedFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile && ((selectedFile as any) instanceof File || (selectedFile as any) instanceof Blob)) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl('DOCUMENT_PREVIEW');
      }
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const isAllowed = file.type.startsWith('image/') || 
                       file.type.startsWith('video/') || 
                       file.type === 'application/pdf' || 
                       file.type.startsWith('text/') ||
                       file.name.endsWith('.pdf') ||
                       file.name.endsWith('.docx') ||
                       file.name.endsWith('.txt');

      if (!isAllowed) {
        alert("Invalid file type. Please upload an image, video, or document (PDF, DOCX, TXT).");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("File too large. Maximum size is 20MB.");
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("File too large. Maximum size is 20MB.");
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative w-full min-h-[360px] border border-line rounded-3xl flex flex-col items-center justify-center transition-all duration-500 overflow-hidden group",
        isDragging ? "border-accent bg-accent/5 scale-[1.005]" : "bg-surface/40 backdrop-blur-md shadow-inner",
        isAnalyzing && "pointer-events-none"
      )}
    >
      <input
        type="file"
        accept="image/*,video/*,.pdf,.docx,.txt"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />
      
      {/* Tech UI Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-accent/20 m-6" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-accent/20 m-6" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-accent/20 m-6" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-accent/20 m-6" />

      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-bg/90"
          >
            {previewUrl === 'DOCUMENT_PREVIEW' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <FileText className="w-24 h-24 text-accent/40" />
                  <div className="absolute inset-0 blur-xl bg-accent/10 animate-pulse" />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted font-bold">{selectedFile?.name}</p>
              </div>
            ) : selectedFile?.type.startsWith('video/') ? (
              <video 
                src={previewUrl} 
                className="w-full h-full object-cover opacity-50 grayscale contrast-125"
                muted 
                loop 
                autoPlay 
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover opacity-50 grayscale contrast-125"
                referrerPolicy="no-referrer"
              />
            )}
            
            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="w-full h-[2px] bg-accent/10 absolute top-0 overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent w-1/4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    animate={{ x: ['-100%', '400%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div className="relative">
                  <Loader2 className="w-14 h-14 animate-spin text-accent mb-6" />
                  <div className="absolute inset-0 blur-2xl bg-accent/20 animate-pulse" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.4em] font-bold text-accent">Neural Analysis in Progress</p>
                <div className="mt-4 flex gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-8 text-center px-8 z-10"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] border border-line flex items-center justify-center bg-surface shadow-xl group-hover:border-accent/50 transition-all duration-500 group-hover:rotate-6">
                <Upload className="w-10 h-10 text-ink-muted group-hover:text-accent transition-colors" />
              </div>
              <motion.div 
                className="absolute -inset-4 border border-dashed border-accent/10 rounded-[2.5rem]"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div>
              <p className="font-display font-semibold text-2xl tracking-tight text-ink">Initialize Forensic Protocol</p>
              <p className="text-[11px] text-ink-muted mt-3 uppercase tracking-[0.3em] font-bold">Drag media/docs or click to secure upload</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
