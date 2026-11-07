import React from 'react';
import { Settings2 } from 'lucide-react';

export default function PrintSettings({ config, setConfig }) {
  const toggleConfig = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSizeChange = (e) => {
    setConfig(prev => ({ ...prev, labelSize: e.target.value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6 mb-2">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-slate-500" />
        <h3 className="font-bold text-slate-700">إعدادات الطباعة</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          مقاس الملصق الحراري
        </label>
        <select
          value={config.labelSize || '40x20'}
          onChange={handleSizeChange}
          className="block w-full max-w-xs px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="40x20">40 × 20 مم (4x2 سم)</option>
          <option value="40x30">40 × 30 مم (4x3 سم)</option>
          <option value="50x25">50 × 25 مم (5x2.5 سم)</option>
          <option value="50x30">50 × 30 مم (5x3 سم)</option>
          <option value="60x40">60 × 40 مم (6x4 سم)</option>
          <option value="100x150">100 × 150 مم (بوليصات الشحن)</option>
        </select>
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