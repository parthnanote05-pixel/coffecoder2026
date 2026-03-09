import React from 'react';
import { ShieldAlert, CheckCircle2, Info, AlertTriangle, FileText, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { AnalysisResult } from '../services/gemini';
import { cn } from '../utils/cn';

interface AnalysisResultsProps {
  result: AnalysisResult;
  file: File;
}

export function AnalysisResults({ result, file }: AnalysisResultsProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file && ((file as any) instanceof File || (file as any) instanceof Blob) && file.size > 0) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl('DOCUMENT_PREVIEW');
      }
    }
  }, [file]);

  const data = [
    { name: 'Score', value: result.confidenceScore },
    { name: 'Remaining', value: 100 - result.confidenceScore },
  ];

  const COLORS = result.isFake ? ['#ef4444', '#14141410'] : ['#10b981', '#14141410'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Left Column: Summary & Score */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-surface p-8 rounded-3xl border border-line shadow-xl shadow-ink/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <div className="w-2 h-2 rounded-full bg-accent/20" />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h3 className="col-header">Risk Assessment</h3>
            <Activity className="w-4 h-4 text-accent opacity-50" />
          </div>

          {previewUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden aspect-video bg-bg border border-line relative group shadow-inner flex items-center justify-center">
              {previewUrl === 'DOCUMENT_PREVIEW' ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-16 h-16 text-accent/20" />
                  <span className="text-[10px] font-mono text-ink-muted font-bold truncate max-w-[120px]">{file.name}</span>
                </div>
              ) : file.type.startsWith('video/') ? (
                <video src={previewUrl} className="w-full h-full object-cover" controls />
              ) : (
                <img src={previewUrl} alt="Analyzed" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              )}
              <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/10 transition-colors pointer-events-none" />
              <div className="absolute top-3 left-3 px-2 py-1 bg-ink text-bg text-[9px] font-mono uppercase tracking-[0.2em] rounded-md font-bold">
                SRC_PRV
              </div>
            </div>
          )}
          
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as any;
                      return (
                        <g>
                          <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" className="font-display text-4xl font-bold fill-ink">
                            {result.confidenceScore}%
                          </text>
                          <text x={cx} y={cy + 25} textAnchor="middle" dominantBaseline="middle" className="font-mono text-[9px] uppercase tracking-widest fill-ink-muted font-bold">
                            Confidence
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={cn(
            "mt-8 p-5 rounded-2xl flex items-center gap-4 border transition-colors",
            result.isFake 
              ? "bg-red-500/5 text-red-500 border-red-500/20" 
              : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              result.isFake ? "bg-red-500/10" : "bg-emerald-500/10"
            )}>
              {result.isFake ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Verdict</p>
              <p className="font-display font-bold text-lg leading-tight">{result.isFake ? 'Manipulation Detected' : 'Authenticity Verified'}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-line shadow-xl shadow-ink/5">
          <h3 className="col-header mb-6">File Intelligence</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-ink-muted font-medium">Identifier</span>
              <span className="font-mono text-xs font-bold truncate max-w-[160px]">{file.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-ink-muted font-medium">Format</span>
              <span className="font-mono text-xs font-bold uppercase">{file.type.split('/')[1]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-ink-muted font-medium">Payload</span>
              <span className="font-mono text-xs font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            {result.metadata.resolution && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-ink-muted font-medium">Resolution</span>
                <span className="font-mono text-xs font-bold">{result.metadata.resolution}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Detailed Findings */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-surface p-10 rounded-3xl border border-line shadow-xl shadow-ink/5 min-h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-bold text-xl">Forensic Analysis</h3>
            </div>
            <div className="font-mono text-[10px] text-ink-muted font-bold tracking-widest bg-bg px-3 py-1 rounded-full border border-line">
              REF_ID: {Math.random().toString(36).toUpperCase().slice(2, 10)}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {result.manipulationType.map((type) => (
              <span 
                key={type}
                className="px-4 py-1.5 bg-bg rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest border border-line text-ink/70"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="markdown-body prose prose-slate dark:prose-invert max-w-none">
            <Markdown>{result.findings}</Markdown>
          </div>

          {result.isFake && (
            <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-sm text-amber-500/90 leading-relaxed font-medium">
                <strong>Forensic Warning:</strong> This media contains high-confidence markers of digital synthesis. 
                The content should be treated as non-factual and potentially malicious in origin.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
