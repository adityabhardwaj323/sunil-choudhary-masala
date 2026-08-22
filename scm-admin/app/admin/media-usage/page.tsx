'use client';

import { useState, useEffect } from 'react';
import { Loader2, PieChart, Image as ImageIcon, FileText } from 'lucide-react';

interface MediaUsage {
  gallery: { current: number; max: number };
  blog: { current: number; max: number };
  total: { current: number; max: number };
}

export default function MediaUsagePage() {
  const [usage, setUsage] = useState<MediaUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/media-usage')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load media usage');
        return res.json();
      })
      .then(data => setUsage(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-saffron" size={32} /></div>;
  if (error) return <div className="text-brand-red p-6">{error}</div>;
  if (!usage) return null;

  const getPercentage = (current: number, max: number) => Math.min(100, Math.round((current / max) * 100));

  const ProgressBar = ({ current, max, label, icon: Icon, colorClass }: any) => {
    const percentage = getPercentage(current, max);
    const isWarning = percentage >= 80;
    const isDanger = percentage >= 100;
    
    let barColor = colorClass;
    if (isDanger) barColor = 'bg-brand-red';
    else if (isWarning) barColor = 'bg-saffron';

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${barColor} bg-opacity-10 text-charcoal`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{label}</h3>
              <p className="text-stone-500 text-sm">Active CMS Media</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-charcoal">{current}</span>
            <span className="text-stone-400"> / {max}</span>
          </div>
        </div>
        
        <div className="w-full bg-stone-100 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${barColor}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-stone-500 font-medium">
          <span>0%</span>
          <span>{percentage}% Used</span>
          <span>100%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal mb-2">CMS Media Storage</h2>
        <p className="text-stone-500">Monitor your Cloudinary free-tier usage for Gallery and Blog images. Product images are tracked separately.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressBar 
          current={usage.total.current} 
          max={usage.total.max} 
          label="Total Media Limit" 
          icon={PieChart} 
          colorClass="bg-charcoal" 
        />
        <div className="space-y-6">
          <ProgressBar 
            current={usage.gallery.current} 
            max={usage.gallery.max} 
            label="Gallery Images" 
            icon={ImageIcon} 
            colorClass="bg-blue-500" 
          />
          <ProgressBar 
            current={usage.blog.current} 
            max={usage.blog.max} 
            label="Blog Featured Images" 
            icon={FileText} 
            colorClass="bg-emerald-500" 
          />
        </div>
      </div>
    </div>
  );
}
