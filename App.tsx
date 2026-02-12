import React, { useState, useEffect, useCallback } from 'react';
import { ReceiptData, AppView } from './types';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import { ChevronLeft, FileText, Printer, History, Trash2, Edit3, Search, FilePlus, Download, Loader2, Save, X, Eye } from 'lucide-react';
import { formatCurrency } from './lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.FORM);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [history, setHistory] = useState<ReceiptData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formKey, setFormKey] = useState(Date.now());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingPdf, setIsSavingPdf] = useState(false);
  const [previewItem, setPreviewItem] = useState<ReceiptData | null>(null);

  const loadHistory = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem('receipt_history') || '[]');
    setHistory(saved);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handlePreview = (data: ReceiptData) => {
    setReceiptData(data);
    setCurrentView(AppView.PREVIEW);
    window.scrollTo(0, 0);
  };
  
  const saveToHistory = (data: ReceiptData) => {
    const localHistory = JSON.parse(localStorage.getItem('receipt_history') || '[]');
    const existingIndex = localHistory.findIndex((h: ReceiptData) => h.id === data.id);
    const updatedData = { ...data, timestamp: Date.now() };

    if (existingIndex > -1) {
      localHistory[existingIndex] = updatedData;
    } else {
      localHistory.push(updatedData);
    }
    
    const limitedHistory = localHistory.sort((a: any, b: any) => b.timestamp - a.timestamp).slice(0, 50);
    localStorage.setItem('receipt_history', JSON.stringify(limitedHistory));
    loadHistory();
    return updatedData;
  };

  const handlePrint = () => {
    if (!receiptData) return;
    setIsProcessing(true);
    saveToHistory(receiptData);
    
    setTimeout(() => {
      window.print();
      setIsProcessing(false);
    }, 500);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('receipt-document');
    if (!element || !receiptData) return;

    setIsSavingPdf(true);
    saveToHistory(receiptData);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [215, 165]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 215, 165);
      pdf.save(`Kwitansi_${receiptData.recipientName?.replace(/\s+/g, '_')}_${receiptData.no?.replace(/\//g, '-') || Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Gagal menyimpan PDF. Silakan gunakan tombol CETAK dan pilih 'Save as PDF'.");
    } finally {
      setIsSavingPdf(false);
    }
  };

  // FIXED: Logic 'Buat Baru' yang lebih agresif untuk browser tablet
  const handleCreateNew = () => {
    const isConfirmed = window.confirm("Mulai buat kwitansi baru? Seluruh data yang belum disimpan akan hilang.");
    if (isConfirmed) {
      // 1. Bersihkan data kwitansi
      setReceiptData(null);
      // 2. Berikan jeda mikro agar state null terdaftar
      setTimeout(() => {
        // 3. Update key untuk unmount/remount form
        setFormKey(Date.now());
        // 4. Pindah ke view form
        setCurrentView(AppView.FORM);
        // 5. Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const deleteFromHistory = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kwitansi ini dari riwayat?")) {
      const updated = history.filter(h => h.id !== id);
      localStorage.setItem('receipt_history', JSON.stringify(updated));
      setHistory(updated);
    }
  };

  const editFromHistory = (data: ReceiptData) => {
    setReceiptData(data);
    setFormKey(Date.now());
    setCurrentView(AppView.FORM);
    window.scrollTo(0, 0);
  };

  const printFromHistory = (data: ReceiptData) => {
    setReceiptData(data);
    setCurrentView(AppView.PREVIEW);
    setTimeout(() => {
        window.print();
    }, 500);
  };
  
  const handleExportHistory = () => {
    if (history.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(history, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `backup_kwitansi_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const filteredHistory = history.filter(item => 
    item.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setReceiptData(null); setTimeout(() => { setFormKey(Date.now()); setCurrentView(AppView.FORM); }, 50); }}>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-100">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="font-black text-gray-900 leading-none text-xl tracking-tight">E-KWITANSI</h1>
              <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-[0.2em] mt-1">DPRK LHOKSEUMAWE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {currentView === AppView.FORM ? (
              <>
                <button 
                  onClick={handleCreateNew}
                  className="bg-indigo-50 text-indigo-700 flex items-center gap-2 font-black transition-all px-6 py-2.5 rounded-xl hover:bg-indigo-100 active:scale-95 border border-indigo-100"
                >
                  <FilePlus size={20} />
                  BUAT BARU
                </button>
                <button 
                  onClick={() => { setCurrentView(AppView.HISTORY); loadHistory(); }}
                  className="bg-indigo-600 text-white flex items-center gap-2 font-black transition-all px-6 py-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95"
                >
                  <History size={20} />
                  RIWAYAT
                </button>
              </>
            ) : (
              <button 
                onClick={() => setCurrentView(AppView.FORM)}
                className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 font-bold transition-all px-4 py-2 rounded-xl hover:bg-indigo-50"
              >
                <ChevronLeft size={20} />
                Kembali ke Form
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        {currentView === AppView.FORM && (
          <ReceiptForm 
            key={formKey}
            onPreview={handlePreview} 
            initialData={receiptData}
          />
        )}

        {currentView === AppView.PREVIEW && receiptData && (
          <div className="animate-in fade-in zoom-in-95 duration-500 pb-20 overflow-x-auto">
            <ReceiptPreview data={receiptData} />
            
            <div className="max-w-[215mm] mx-auto mt-10 no-print bg-white border-2 border-dashed border-indigo-200 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center shadow-xl">
              <div className="bg-indigo-50 p-4 rounded-2xl h-fit text-indigo-600">
                <Printer size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-black text-indigo-900 text-lg uppercase tracking-tight">Finalisasi Kwitansi</h4>
                <p className="text-gray-500 mt-1 max-w-lg">Silakan pilih untuk langsung mencetak atau menyimpan dokumen sebagai file PDF.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                 <button 
                   onClick={handleDownloadPDF} 
                   disabled={isSavingPdf || isProcessing}
                   className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isSavingPdf ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                   {isSavingPdf ? "MENYIMPAN..." : "SIMPAN PDF"}
                 </button>
                 <button 
                   onClick={handlePrint} 
                   disabled={isSavingPdf || isProcessing}
                   className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Printer size={24} />}
                   {isProcessing ? "MEMPROSES..." : "CETAK SEKARANG"}
                 </button>
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.HISTORY && (
          <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-right duration-500 no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase">Riwayat Kwitansi</h2>
                  <p className="text-gray-500 font-medium tracking-tight">Daftar kwitansi yang telah dibuat dan disimpan.</p>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                      type="text"
                      placeholder="Cari Nama / No..."
                      className="pl-11 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl w-full md:w-[300px] focus:border-indigo-500 outline-none transition-all shadow-sm font-bold text-gray-900"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <button 
                    onClick={handleExportHistory}
                    className="bg-gray-700 text-white flex items-center gap-2 font-bold transition-all px-4 py-3 rounded-xl hover:bg-gray-800"
                    title="Export Backup (JSON)"
                  >
                    <Download size={20} />
                  </button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.length === 0 ? (
                <div className="col-span-full py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <History size={64} className="mb-4 opacity-10" />
                  <p className="font-bold text-lg">Belum ada riwayat.</p>
                  <button onClick={handleCreateNew} className="mt-4 text-indigo-600 font-bold hover:underline">Buat Kwitansi Pertama</button>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg w-fit mb-1">
                          {item.no || 'Tanpa No.'}
                        </span>
                        <span className="text-[11px] text-gray-400 font-bold">
                           {new Date(item.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <button 
                        onClick={() => setPreviewItem(item)}
                        className="bg-slate-100 p-2.5 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Klik untuk Pop-up Preview"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                    <div className="mb-6 flex-1">
                      <h4 className="font-black text-gray-900 uppercase text-lg line-clamp-2 leading-tight mb-2">{item.recipientName || 'TANPA NAMA'}</h4>
                      <div className="flex flex-col gap-1 text-sm text-gray-500 font-bold">
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span>Jabatan:</span>
                          <span className="text-gray-800">{item.recipientTitle || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span>Tujuan:</span>
                          <span className="text-gray-800">{item.location || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Biaya</span>
                          <span className="font-black text-indigo-600 text-lg">Rp {formatCurrency(item.grandTotal)}</span>
                       </div>
                       <div className="flex gap-1">
                          <button onClick={() => deleteFromHistory(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                          <button onClick={() => editFromHistory(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                          <button onClick={() => printFromHistory(item)} className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"><Printer size={18} /></button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 no-print">
          <div className="bg-white rounded-3xl w-full max-w-[230mm] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                 <FileText size={24} />
                 <h3 className="font-black uppercase tracking-tight">Pratinjau Kwitansi</h3>
              </div>
              <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-white/20 rounded-xl transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-100">
               <div className="bg-white p-2 rounded-sm shadow-inner min-w-fit">
                  <ReceiptPreview data={previewItem} />
               </div>
            </div>
            <div className="p-6 border-t bg-white flex justify-end gap-3">
               <button onClick={() => setPreviewItem(null)} className="px-6 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50">Tutup</button>
               <button 
                onClick={() => { setReceiptData(previewItem); setTimeout(() => { setFormKey(Date.now()); setCurrentView(AppView.PREVIEW); setPreviewItem(null); }, 50); }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700"
               >
                 BUKA HALAMAN CETAK
               </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t py-8 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
             <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white font-bold">D</div>
             <span className="text-xs font-black tracking-widest">DPRK LHOKSEUMAWE</span>
          </div>
          <p className="text-sm text-gray-400 font-bold text-center">
            E-Kwitansi SPPD Digital &copy; 2026 Sekretariat DPRK Lhokseumawe.
          </p>
          <div className="flex gap-6 text-gray-400 font-black text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Bantuan</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;