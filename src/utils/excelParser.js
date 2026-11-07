export const parseExcelFile = async (file, append = false, onDataLoaded, setErrorMsg) => {
  if (!file) return;
  setErrorMsg('');

  if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
    setErrorMsg("يرجى رفع ملف إكسل بصيغة .xlsx أو .xls");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      processExcelData(json, append, onDataLoaded, setErrorMsg);
    } catch (err) {
      console.error("Excel parse error:", err);
      setErrorMsg("حدث خطأ أثناء قراءة الملف. تأكد من أنه ملف إكسل سليم وغير محمي بكلمة مرور.");
    }
  };
  reader.onerror = () => {
    setErrorMsg("فشل في قراءة الملف.");
  };
  reader.readAsArrayBuffer(file);
};

const processExcelData = (json, append, onDataLoaded, setErrorMsg) => {
  const newProducts = [];
  let nextId = Date.now(); // Simple ID generation

  json.forEach((item) => {
    // Dynamic key matching for robust parsing (case insensitive)
    const getVal = (keys) => {
      const foundKey = Object.keys(item).find((k) => keys.includes(k.toLowerCase().trim()));
      return foundKey ? item[foundKey] : undefined;
    };

    const designation = getVal(['désignation', 'désignation autres', 'designation', 'name', 'اسم', 'الاسم', 'produit', 'product', 'article']);
    const barcode = getVal(['barcode', 'code à barre', 'code a barre', 'code', 'الباركود', 'باركود', 'ean']);
    let price = getVal(['prix vente o1', 'prix vente o', 'prix', 'price', 'السعر', 'سعر', 'سعر البيع']);

    // Clean up price formatting
    if (price !== undefined && price !== null) {
      let pStr = String(price).trim();
      const pNum = parseFloat(pStr.replace(',', '.').replace(/[^0-9.-]+/g, ""));
      if (!isNaN(pNum)) price = pNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      else price = pStr;
    }

    // We need at least a name or a barcode to consider it a valid row
    if (designation || barcode) {
      newProducts.push({
        id: nextId++,
        designation: String(designation || 'منتج بدون اسم').trim(),
        barcode: String(barcode || '000000000000').trim(),
        price: price ? String(price) : '',
        selected: !append, // Auto select if it's the first upload, unselect if appending
        copies: 1
      });
    }
  });

  if (newProducts.length === 0) {
    setErrorMsg("الملف المرفوع لا يحتوي على أعمدة معروفة (اسم، باركود، سعر). يرجى التأكد من عناوين الأعمدة.");
    return;
  }

  setErrorMsg('');
  onDataLoaded(newProducts, append);
};
