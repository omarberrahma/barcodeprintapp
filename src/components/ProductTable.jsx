import React, { useRef } from 'react';
import { Search, Trash2, FilePlus, Inbox } from 'lucide-react';

export default function ProductTable({
  products,
  setProducts,
  searchQuery,
  setSearchQuery,
  onClearData,
  onMergeData
}) {
  const mergeFileInputRef = useRef(null);

  const filteredProducts = products.filter(p =>
    p.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllFilteredSelected = filteredProducts.length > 0 && filteredProducts.every(p => p.selected);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setProducts(products.map(p => {
      if (filteredProducts.find(fp => fp.id === p.id)) {
        return { ...p, selected: checked };
      }
      return p;
    }));
  };

  const toggleSelect = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const updateCopies = (id, newCopies) => {
    if (newCopies < 1) newCopies = 1;
    if (newCopies > 999) newCopies = 999;
    setProducts(products.map(p => p.id === id ? { ...p, copies: newCopies } : p));
  };

  const handleMergeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onMergeData(file);
    }
    if (mergeFileInputRef.current) mergeFileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المنتج أو الباركود..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-primary focus:border-primary block pr-10 p-3 outline-none transition-shadow"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button onClick={onClearData} className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors px-3 py-2 flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            تغيير الملف
          </button>
          <label className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition shadow-sm flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            دمج ملف آخر
            <input type="file" ref={mergeFileInputRef} onChange={handleMergeFileChange} accept=".xlsx, .xls" className="hidden" />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600">
          <div className="col-span-1 flex justify-center items-center">
            <input type="checkbox" checked={isAllFilteredSelected} onChange={handleSelectAll} className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer" />
          </div>
          <div className="col-span-5">اسم المنتج</div>
          <div className="col-span-3">الباركود</div>
          <div className="col-span-2 text-center">السعر</div>
          <div className="col-span-1 text-center">النسخ</div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
            <input type="checkbox" checked={isAllFilteredSelected} onChange={handleSelectAll} className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
            تحديد الكل
          </label>
          <span className="text-xs text-slate-500">{filteredProducts.length} منتج</span>
        </div>

        <div className="overflow-y-auto flex-1 p-2 md:p-0 bg-slate-50 md:bg-white">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">لا توجد نتائج</h3>
              <p className="text-sm text-slate-500">لم يتم العثور على منتجات تطابق بحثك.</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col gap-3">
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => toggleSelect(p.id)} className={`bg-white p-4 rounded-xl shadow-sm border transition-colors cursor-pointer ${p.selected ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <input type="checkbox" checked={p.selected} onChange={() => {}} onClick={(e) => e.stopPropagation()} className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2 leading-tight">{p.designation}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <div className="font-en text-xs text-slate-500 tracking-wider bg-slate-100 px-2 py-1 rounded">{p.barcode}</div>
                          <div className="font-bold text-secondary text-sm">{p.price ? p.price + ' دج' : '-'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-medium text-slate-500">عدد الملصقات:</span>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateCopies(p.id, p.copies - 1)} className="px-3 py-1 hover:bg-slate-200 text-slate-600 transition">-</button>
                        <input type="number" value={p.copies} onChange={(e) => updateCopies(p.id, parseInt(e.target.value) || 1)} min="1" max="999" className="w-12 text-center bg-transparent outline-none text-sm font-bold font-en py-1" />
                        <button onClick={() => updateCopies(p.id, p.copies + 1)} className="px-3 py-1 hover:bg-slate-200 text-slate-600 transition">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Rows */}
              <div className="hidden md:block">
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => toggleSelect(p.id)} className={`grid grid-cols-12 gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors items-center cursor-pointer ${p.selected ? 'bg-indigo-50/50 hover:bg-indigo-50/80' : ''}`}>
                    <div className="col-span-1 flex justify-center">
                      <input type="checkbox" checked={p.selected} onChange={() => {}} onClick={(e) => e.stopPropagation()} className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" />
                    </div>
                    <div className="col-span-5 font-medium text-slate-800 text-sm pr-2 line-clamp-2 leading-snug">{p.designation}</div>
                    <div className="col-span-3 font-en text-slate-500 text-sm tracking-wide">{p.barcode}</div>
                    <div className="col-span-2 text-center font-bold text-secondary text-sm">{p.price ? p.price + ' دج' : '-'}</div>
                    <div className="col-span-1 flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <input type="number" value={p.copies} onChange={(e) => updateCopies(p.id, parseInt(e.target.value) || 1)} min="1" max="999" className="w-16 border border-slate-300 rounded-lg px-2 py-1.5 text-center text-sm font-en focus:ring-2 focus:ring-primary outline-none bg-white shadow-inner" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}