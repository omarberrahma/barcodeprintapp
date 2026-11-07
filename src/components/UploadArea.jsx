import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';

export default function UploadArea({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    parseExcelFile(e.target.files[0], false, onDataLoaded, setErrorMsg);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      parseExcelFile(files[0], false, onDataLoaded, setErrorMsg);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-slate-300 hover:border-primary hover:bg-slate-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
          <UploadCloud className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">ارفع ملف الإكسل هنا</h2>
        <p className="text-slate-500 mb-8">يدعم ملفات .xlsx و .xls</p>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />

        <button className="bg-primary hover:bg-primary_dark text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95">
          تصفح الملفات
        </button>
      </div>

      {errorMsg && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}