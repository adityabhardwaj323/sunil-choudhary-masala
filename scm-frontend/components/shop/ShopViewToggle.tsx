'use client';

import React, { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';

export default function ShopViewToggle() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="view-btns">
      <div 
        className={`view-btn ${view === 'grid' ? 'active' : ''}`}
        onClick={() => setView('grid')}
      >
        <LayoutGrid size={16} />
      </div>
      <div 
        className={`view-btn ${view === 'list' ? 'active' : ''}`}
        onClick={() => setView('list')}
      >
        <List size={16} />
      </div>
    </div>
  );
}
