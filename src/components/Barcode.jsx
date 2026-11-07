import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

export default function Barcode({ value, width = 1.5, height = 35 }) {
  const barcodeRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        const safeBarcode = String(value).trim();
        JsBarcode(barcodeRef.current, safeBarcode, {
          format: "CODE128",
          width: width,
          height: height,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#000000"
        });
        setError(false);
      } catch (err) {
        console.warn(`Could not generate barcode for: ${value}`, err);
        setError(true);
      }
    }
  }, [value, width, height]);

  if (error) {
    return (
      <div style={{ fontSize: '10px', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', border: '1px dashed #ccc', width: '90%', fontFamily: 'sans-serif' }}>
        رمز غير صالح للباركود
      </div>
    );
  }

  return <svg ref={barcodeRef}></svg>;
}