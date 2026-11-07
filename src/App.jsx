import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import UploadArea from './components/UploadArea';
import ProductTable from './components/ProductTable';
import PrintSettings from './components/PrintSettings';
import Barcode from './components/Barcode';
import { saveData, loadData, saveConfig, loadConfig, clearData as dbClearData } from './db';
import { Printer, Loader2 } from 'lucide-react';
import { parseExcelFile } from './utils/excelParser';

const LABEL_SIZES = {
  '40x30': { width: 40, height: 30, titleSize: '10px', footerSize: '9px', priceSize: '10px', padding: '1.5mm', titleMarginBottom: '1mm', footerMarginTop: '1mm', barcodeMargin: 4 },
  '50x25': { width: 50, height: 25, titleSize: '10px', footerSize: '9px', priceSize: '10px', padding: '1mm 2mm', titleMarginBottom: '1mm', footerMarginTop: '1mm', barcodeMargin: 4 },
  '50x30': { width: 50, height: 30, titleSize: '11px', footerSize: '10px', priceSize: '11px', padding: '1.5mm 2mm', titleMarginBottom: '1mm', footerMarginTop: '1mm', barcodeMargin: 4 },
  '60x40': { width: 60, height: 40, titleSize: '13px', footerSize: '12px', priceSize: '13px', padding: '2mm 3mm', titleMarginBottom: '1.5mm', footerMarginTop: '1.5mm', barcodeMargin: 6 },
  '100x150': { width: 100, height: 150, titleSize: '24px', footerSize: '20px', priceSize: '24px', padding: '5mm', titleMarginBottom: '5mm', footerMarginTop: '5mm', barcodeMargin: 10 }
};

const PrintStyles = ({ sizeId }) => {
  const size = LABEL_SIZES[sizeId] || LABEL_SIZES['50x30'];
  const css = `
    @media print {
      @page {
        size: ${size.width}mm ${size.height}mm;
      }
      .label-card {
        width: ${size.width}mm !important;
        height: ${size.height}mm !important;
        padding: ${size.padding} !important;
      }
      .label-title {
        font-size: ${size.titleSize} !important;
        margin-bottom: ${size.titleMarginBottom} !important;
      }
      .barcode-container svg {
        max-width: ${size.width - size.barcodeMargin}mm !important;
      }
      .label-footer {
        font-size: ${size.footerSize} !important;
        margin-top: ${size.footerMarginTop} !important;
      }
      .label-price {
        font-size: ${size.priceSize} !important;
      }
    }
  `;
  return <style>{css}</style>;
};

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [config, setConfig] = useState({ showName: true, showBarcode: true, showPrice: true, labelSize: '50x30' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedData = await loadData();
      if (storedData && storedData.length > 0) {
        setProducts(storedData);
      }
      const storedConfig = await loadConfig();
      if (storedConfig) {
        setConfig(storedConfig);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveData(products);
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading) {
      saveConfig(config);
    }
  }, [config, loading]);

  const handleDataLoaded = (newProducts, append = false) => {
    if (append) {
      setProducts(prev => [...prev, ...newProducts]);
    } else {
      setProducts(newProducts);
      setSearchQuery('');
    }
  };

  const handleClearData = async () => {
    if (window.confirm('هل أنت متأكد أنك تريد مسح القائمة الحالية ورفع ملف جديد؟')) {
      setProducts([]);
      setSearchQuery('');
      await dbClearData();
    }
  };

  const selectedCount = useMemo(() => {
    return products.filter(p => p.selected && p.copies > 0).length;
  }, [products]);

  const totalProducts = products.length;

  const triggerPrint = () => {
    const itemsToPrint = products.filter(p => p.selected && p.copies > 0);
    if (itemsToPrint.length === 0) return;

    setIsPrinting(true);

    // Short delay to allow React to render the print area with Barcode components
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 1000); // 1s to ensure jsbarcode SVG generation completes
  };

  if (loading) return null;

  return (
    <div className="pb-20 md:pb-10 font-sans">
      <PrintStyles sizeId={config.labelSize} />
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">طابعة الباركود الذكية</h1>
                <p className="text-xs text-slate-500">
                  طباعة ملصقات {config.labelSize?.replace('x', '×')} مم
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium px-3 py-1 bg-slate-100 rounded-lg text-slate-600">
                إجمالي: {totalProducts}
              </span>
              <span className="text-sm font-medium px-3 py-1 bg-indigo-50 rounded-lg text-indigo-600">
                المحدد: {selectedCount}
              </span>
              <button
                onClick={triggerPrint}
                disabled={selectedCount === 0}
                className="bg-secondary hover:bg-secondary_dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                طباعة
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
        {products.length === 0 ? (
          <UploadArea onDataLoaded={handleDataLoaded} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PrintSettings config={config} setConfig={setConfig} />
            <ProductTable
              products={products}
              setProducts={setProducts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onClearData={handleClearData}
              onMergeData={(file) => {
                parseExcelFile(file, true, handleDataLoaded, (msg) => {
                  if (msg) alert(msg);
                });
              }}
            />
          </div>
        )}
      </main>

      {products.length > 0 && selectedCount > 0 && (
        <div className="md:hidden fixed bottom-6 left-0 right-0 px-4 z-50 no-print animate-in fade-in slide-in-from-bottom-10">
          <button onClick={triggerPrint} className="w-full bg-secondary text-white p-4 rounded-2xl font-bold shadow-xl shadow-secondary/30 flex justify-between items-center active:scale-95 transition-transform">
            <span className="flex items-center gap-2">
              <Printer className="w-6 h-6" />
              طباعة المحدد
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">{selectedCount} منتج</span>
          </button>
        </div>
      )}

      {isPrinting && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center no-print">
          <Loader2 className="animate-spin text-primary w-16 h-16 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">جاري تجهيز الملصقات...</h3>
          <p className="text-slate-500 mt-2">يرجى الانتظار، سيتم فتح نافذة الطباعة قريباً.</p>
        </div>
      )}

      {/* Hidden Print Area rendered via Portal */}
      {createPortal(
        <>
          {products.filter(p => p.selected && p.copies > 0).flatMap((p) =>
            Array.from({ length: p.copies }).map((_, i) => (
              <div key={`${p.id}-${i}`} className="label-card">
                {config.showName ? <div className="label-title">{p.designation}</div> : <div style={{height: '11px', marginBottom:'1mm'}}></div>}
                <div className="barcode-container">
                   {config.showBarcode ? <Barcode value={p.barcode} /> : null}
                </div>
                <div className="label-footer">
                  <span>{config.showBarcode ? p.barcode : ''}</span>
                  {config.showPrice && p.price ? <span className="label-price">{p.price} دج</span> : <span></span>}
                </div>
              </div>
            ))
          )}
        </>,
        document.getElementById('print-area')
      )}

    </div>
  );
}

export default App;