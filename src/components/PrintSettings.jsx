import React from 'react';
import { Settings2 } from 'lucide-react';

export default function PrintSettings({ config, setConfig }) {
  const toggleConfig = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <Settings2 className="w-5 h-5 text-slate-500" />
        <h3 className="font-bold text-slate-700">إعدادات الطباعة</h3>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showName}
            onChange={() => toggleConfig('showName')}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
          />
          <span className="text-sm text-slate-700">إظهار اسم المنتج</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showBarcode}
            onChange={() => toggleConfig('showBarcode')}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
          />
          <span className="text-sm text-slate-700">إظهار الباركود</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showPrice}
            onChange={() => toggleConfig('showPrice')}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
          />
          <span className="text-sm text-slate-700">إظهار السعر</span>
        </label>
      </div>
    </div>
  );
}