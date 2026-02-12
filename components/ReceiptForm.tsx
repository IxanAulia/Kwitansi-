import React, { useState, useEffect } from 'react';
import { ReceiptData, ReceiptItem } from '../types';
import { PERWAL_RATES, DEFAULT_SIGNATORIES } from '../constants';
import { MAPPED_DPRK_MEMBERS } from '../data/members';
import { Plus, Trash2, Calculator, Printer, Minus, RotateCcw, Info, Eye } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface Props {
  onPreview: (data: ReceiptData) => void;
  initialData?: ReceiptData | null;
}

const COMMON_ITEMS = [
  "Uang Harian",
  "Uang Saku",
  "Uang Representatif",
  "Uang Penginapan",
  "Biaya Penginapan / Hotel",
  "Uang Transportasi (PP)",
  "Tiket Pesawat (PP)",
  "Airport Tax",
  "Taxi Bandara",
  "Biaya Transportasi Lokal",
  "Biaya Sewa Kendaraan",
  "Biaya Tol & Parkir"
];

const JABATAN_OPTIONS = [
  "Ketua",
  "Wakil Ketua I",
  "Wakil Ketua II",
  "Anggota DPRK",
  "Sekwan",
  "Kabag",
  "Kasubbag",
  "ADC",
  "Pamtup",
  "Supir",
  "Bendahara",
  "Tenaga Ahli",
  "Staf"
];

const getRoleClassification = (title?: string): 'pimpinan' | 'anggota' | 'lainnya' => {
  if (!title) return 'lainnya';
  if (['Ketua', 'Wakil Ketua I', 'Wakil Ketua II'].includes(title)) {
    return 'pimpinan';
  }
  if (title === 'Anggota DPRK') {
    return 'anggota';
  }
  return 'lainnya';
};

const ReceiptForm: React.FC<Props> = ({ onPreview, initialData }) => {
  const getDefaultItem = (): ReceiptItem => ({
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unitPrice: 0,
    total: 0
  });

  const getDefaultState = () => ({
    id: crypto.randomUUID(),
    no: '',
    kodeRekening: '5.1.02.04.01.0001',
    tahun: new Date().getFullYear().toString(),
    payerName: 'Bendahara Pengeluaran Sekretariat DPRK Lhokseumawe',
    recipientName: '',
    recipientTitle: JABATAN_OPTIONS[3],
    recipientAddress: 'Lhokseumawe',
    location: '', 
    date: new Date().toISOString().split('T')[0],
    sppdNumber: '',
    sppdDate: new Date().toISOString().split('T')[0],
    duration: 3,
    lodgingOption: 'flat-rate' as 'flat-rate' | 'at-cost',
    lodgingActualCost: 0,
    items: [getDefaultItem()],
    grandTotal: 0,
    penggunaAnggaran: DEFAULT_SIGNATORIES.penggunaAnggaran,
    pptk: DEFAULT_SIGNATORIES.pptk,
    bendahara: DEFAULT_SIGNATORIES.bendahara
  });

  const [formData, setFormData] = useState<Partial<ReceiptData>>(initialData || getDefaultState());
  const [lodgingOption, setLodgingOption] = useState<'flat-rate' | 'at-cost'>('flat-rate');
  const [lodgingActualCost, setLodgingActualCost] = useState<number>(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setLodgingOption(initialData.lodgingOption || 'flat-rate');
      setLodgingActualCost(initialData.lodgingActualCost || 0);
    } else {
      setFormData(getDefaultState());
      setLodgingOption('flat-rate');
      setLodgingActualCost(0);
    }
  }, [initialData]);

  const handleAutoFill = () => {
    const currentLocation = formData.location;
    if (!currentLocation) {
        alert("Silakan pilih tujuan terlebih dahulu.");
        return;
    }
    
    const rate = PERWAL_RATES[currentLocation];
    if (!rate) {
        alert(`Data tarif untuk lokasi "${currentLocation}" belum tersedia di sistem.`);
        return;
    }

    const role = getRoleClassification(formData.recipientTitle);
    const lodgingPlafon = rate.lodging[role];
    const representationRate = rate.representation[role];
    const dur = Number(formData.duration) || 1;

    // Filter out previous auto-generated items
    const manualItems = (formData.items || []).filter(item => {
        const desc = item.description.toLowerCase();
        return !desc.includes('uang harian') && 
               !desc.includes('penginapan') && 
               !desc.includes('representatif') && 
               !desc.includes('transportasi (pp)');
    });

    const autoItems: ReceiptItem[] = [];

    // 1. Uang Harian
    autoItems.push({
        id: crypto.randomUUID(),
        description: `Uang Harian ${rate.location}`,
        quantity: dur,
        unitPrice: rate.dailyAllowance,
        total: dur * rate.dailyAllowance
    });

    // 2. Penginapan
    let lodgingUnitPrice = 0;
    const lodgingQuantity = Math.max(0, dur - 1);

    if (lodgingOption === 'flat-rate') {
        // Flat rate 30% dari plafon (Sesuai Perwal untuk tanpa kuitansi)
        lodgingUnitPrice = Math.round(0.30 * lodgingPlafon);
    } else {
        // At-Cost (Sesuai kuitansi hotel, tidak boleh melebihi plafon)
        lodgingUnitPrice = Math.min(lodgingActualCost || 0, lodgingPlafon);
    }
    
    if (lodgingQuantity > 0 && lodgingUnitPrice > 0) {
        autoItems.push({
            id: crypto.randomUUID(),
            description: `Biaya Penginapan ${rate.location}${lodgingOption === 'flat-rate' ? ' (Flat 30%)' : ''}`,
            quantity: lodgingQuantity,
            unitPrice: lodgingUnitPrice,
            total: lodgingQuantity * lodgingUnitPrice
        });
    }

    // 3. Uang Representatif (Biasanya hanya untuk Pimpinan/Eselon II)
    if (representationRate > 0) {
        autoItems.push({
            id: crypto.randomUUID(),
            description: `Uang Representatif`,
            quantity: dur,
            unitPrice: representationRate,
            total: dur * representationRate
        });
    }
    
    // 4. Transport (Placeholder)
    autoItems.push({
        id: crypto.randomUUID(),
        description: `Uang Transportasi (PP)`,
        quantity: 1,
        unitPrice: 0,
        total: 0,
    });

    const allItems = [...manualItems, ...autoItems];
    const newTotal = allItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0);

    setFormData(prev => ({
        ...prev,
        items: allItems,
        grandTotal: newTotal,
        lodgingOption: lodgingOption,
        lodgingActualCost: lodgingActualCost
    }));
  };

  const updateItem = (id: string, field: keyof ReceiptItem, value: any) => {
    setFormData(prev => {
      const updatedItems = (prev.items || []).map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          const qty = field === 'quantity' ? (value === '' ? 0 : Number(value)) : item.quantity;
          const price = field === 'unitPrice' ? (value === '' ? 0 : Number(value)) : item.unitPrice;
          updated.total = (qty || 0) * (price || 0);
          return updated;
        }
        return item;
      });
      return {
        ...prev,
        items: updatedItems,
        grandTotal: updatedItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0)
      };
    });
  };

  const removeItem = (id: string) => {
    setFormData(prev => {
      const updatedItems = (prev.items || []).filter(item => item.id !== id);
      return {
        ...prev,
        items: updatedItems,
        grandTotal: updatedItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0)
      };
    });
  };

  const addManualItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), getDefaultItem()]
    }));
  };

  const adjustDuration = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      duration: Math.max(1, (prev.duration || 1) + amount)
    }));
  };
  
  const handleRecipientNameChange = (name: string) => {
    const selectedMember = MAPPED_DPRK_MEMBERS.find(member => member.nama === name);
    if (selectedMember) {
      setFormData(prev => ({
        ...prev,
        recipientName: selectedMember.nama,
        recipientTitle: selectedMember.jabatan
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipientName: name
      }));
    }
  };

  const handlePreview = () => {
    const completeData = { 
      ...formData, 
      lodgingOption: lodgingOption,
      lodgingActualCost: lodgingActualCost,
      timestamp: Date.now(),
      grandTotal: (formData.items || []).reduce((acc, item) => acc + (Number(item.total) || 0), 0)
    } as ReceiptData;

    onPreview(completeData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-10">
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row gap-6 items-center border border-indigo-400">
        <div className="bg-white/20 p-3 rounded-2xl">
          <Info size={32} />
        </div>
        <div>
          <h4 className="font-black text-lg">Alur Cepat Pembuatan Kwitansi:</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm font-bold opacity-90">
             <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs">1</span>
                Isi Nama, Tujuan & Opsi Penginapan
             </div>
             <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs">2</span>
                Klik "Hitung Perwal"
             </div>
             <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs">3</span>
                Pratinjau & Cetak
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-8 no-print transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Printer className="text-indigo-600" size={32} /> Input Data Kwitansi
            </h2>
            <p className="text-gray-500 mt-1 font-medium">Lengkapi rincian biaya perjalanan dinas di bawah ini.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => confirm("Reset semua input?") && setFormData(getDefaultState())}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors p-2"
              title="Reset Form"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-700 tracking-wider">Nomor Kwitansi</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all font-bold text-black bg-white" 
              placeholder="Contoh: 001/SPPD/2026"
              value={formData.no}
              onChange={e => setFormData({ ...formData, no: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-700 tracking-wider">Tahun Anggaran</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all font-bold text-black bg-white" 
              value={formData.tahun}
              onChange={e => setFormData({ ...formData, tahun: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-700 tracking-wider">Kode Rekening</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all font-bold text-black bg-white" 
              value={formData.kodeRekening}
              onChange={e => setFormData({ ...formData, kodeRekening: e.target.value })}
            />
          </div>
        </div>

        <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
            Identitas Penerima
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-600 uppercase">Nama Lengkap</label>
              <input 
                list="dprk-members"
                className="w-full border-2 border-white rounded-xl p-3 focus:border-indigo-500 outline-none shadow-sm transition-all font-black text-black bg-white" 
                placeholder="Pilih atau ketik Nama..."
                value={formData.recipientName}
                onChange={e => handleRecipientNameChange(e.target.value)}
              />
              <datalist id="dprk-members">
                {MAPPED_DPRK_MEMBERS.map(member => (
                  <option key={member.id} value={member.nama} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-600 uppercase">Jabatan / Pekerjaan</label>
              <select 
                className="w-full border-2 border-white rounded-xl p-3 focus:border-indigo-500 outline-none shadow-sm transition-all bg-white font-bold text-black"
                value={formData.recipientTitle}
                onChange={e => setFormData({ ...formData, recipientTitle: e.target.value })}
              >
                {JABATAN_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 col-span-full">
              <label className="text-xs font-black text-gray-600 uppercase">Alamat</label>
              <input 
                className="w-full border-2 border-white rounded-xl p-3 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold text-black bg-white" 
                placeholder="Contoh: Jl. Merdeka No. 1 Lhokseumawe"
                value={formData.recipientAddress}
                onChange={e => setFormData({ ...formData, recipientAddress: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4 shadow-inner">
          <h3 className="text-sm font-black text-indigo-900 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
            Rincian Perjalanan Dinas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-800 uppercase">Tujuan (Prov/Kota)</label>
                <select 
                  className="w-full border-2 border-white rounded-xl p-3 focus:border-indigo-500 outline-none shadow-sm transition-all font-black text-black bg-white"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="">Pilih Tujuan</option>
                  {Object.keys(PERWAL_RATES).sort().map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-800 uppercase">Durasi (Hari)</label>
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border-2 border-white">
                  <button onClick={() => adjustDuration(-1)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Minus size={16} /></button>
                  <input type="number" className="w-full text-center font-bold outline-none bg-transparent text-black" value={formData.duration} readOnly />
                  <button onClick={() => adjustDuration(1)} className="p-2 hover:bg-green-50 text-green-500 rounded-lg transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-800 uppercase">Nomor SPPD</label>
                <input 
                  className="w-full border-2 border-white rounded-xl p-3 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold text-black bg-white" 
                  placeholder="090/..../2026"
                  value={formData.sppdNumber}
                  onChange={e => setFormData({ ...formData, sppdNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-800 uppercase">Tgl SPPD</label>
                <input 
                  type="date"
                  className="w-full border-2 border-white rounded-xl p-3 focus:border-indigo-500 outline-none shadow-sm transition-all font-bold text-black bg-white" 
                  value={formData.sppdDate}
                  onChange={e => setFormData({ ...formData, sppdDate: e.target.value })}
                />
              </div>
            </div>
             <div className="space-y-2 col-span-full">
                <label className="text-xs font-black text-indigo-800 uppercase">Opsi Biaya Penginapan</label>
                <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-xl shadow-sm border-2 border-white">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setLodgingOption('flat-rate')}>
                        <input type="radio" id="flat-rate" name="lodging" checked={lodgingOption === 'flat-rate'} onChange={() => {}} className="accent-indigo-600 w-5 h-5 cursor-pointer" />
                        <label className="font-bold text-gray-800 cursor-pointer group-hover:text-indigo-600">Tanpa Kuitansi (Flat 30%)</label>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setLodgingOption('at-cost')}>
                        <input type="radio" id="at-cost" name="lodging" checked={lodgingOption === 'at-cost'} onChange={() => {}} className="accent-indigo-600 w-5 h-5 cursor-pointer" />
                        <label className="font-bold text-gray-800 cursor-pointer group-hover:text-indigo-600">Sesuai Kuitansi (At-Cost)</label>
                    </div>
                    {lodgingOption === 'at-cost' && (
                        <div className="relative flex-1 animate-in fade-in slide-in-from-left duration-300">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp.</span>
                            <input
                                type="number"
                                placeholder="Biaya Riil / Malam"
                                className="w-full border-2 border-indigo-100 rounded-lg p-2 pl-10 focus:border-indigo-500 outline-none transition-all font-black text-black bg-white"
                                value={lodgingActualCost || ''}
                                onChange={e => setLodgingActualCost(Number(e.target.value))}
                            />
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              Rincian Biaya Pengeluaran
            </h3>
            <button 
              onClick={addManualItem}
              className="bg-slate-100 text-slate-700 flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black hover:bg-indigo-600 hover:text-white transition-all border border-slate-200 shadow-sm"
            >
              <Plus size={18} /> TAMBAH ITEM MANUAL
            </button>
          </div>
          
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            <datalist id="common-travel-items">
              {COMMON_ITEMS.map(item => <option key={item} value={item} />)}
            </datalist>

            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <tr>
                  <th className="p-4 w-[45%]">Keterangan</th>
                  <th className="p-4 w-[10%] text-center">Qty</th>
                  <th className="p-4 w-[20%] text-right">Harga Satuan (Rp.)</th>
                  <th className="p-4 w-[20%] text-right">Subtotal</th>
                  <th className="p-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(formData.items || []).map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-3">
                      <input 
                        list="common-travel-items"
                        className="w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-500 p-1 font-bold text-black"
                        placeholder="Ketik rincian..."
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="number"
                        className="w-full bg-transparent text-center outline-none border-b border-transparent focus:border-indigo-500 p-1 font-bold text-black"
                        value={item.quantity === 0 ? "" : item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-gray-400 font-bold">Rp.</span>
                        <input 
                          type="number"
                          className="w-[120px] bg-transparent text-right outline-none border-b border-transparent focus:border-indigo-500 p-1 font-black text-black"
                          value={item.unitPrice === 0 ? "" : item.unitPrice}
                          onChange={e => updateItem(item.id, 'unitPrice', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="p-3 font-black text-indigo-700 text-right">
                      Rp. {formatCurrency(item.total)}
                    </td>
                    <td className="p-3">
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 text-white">
                <tr>
                  <td colSpan={3} className="p-6 text-right font-black tracking-widest uppercase text-xs opacity-70">Total Yang Diterima</td>
                  <td colSpan={2} className="p-6 text-2xl font-black text-right">
                    <span className="text-indigo-400 mr-2 text-sm">Rp.</span>
                    {formatCurrency(formData.grandTotal || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 pt-8 border-t border-gray-100">
          <button 
            onClick={handleAutoFill}
            className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-8 py-4 rounded-2xl hover:bg-emerald-200 transition-all font-black text-sm uppercase tracking-widest border border-emerald-200 shadow-sm active:scale-95"
          >
            <Calculator size={20} />
            Hitung Perwal
          </button>
          <button 
            onClick={handlePreview}
            className="bg-indigo-600 text-white px-12 py-4 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all flex items-center gap-4 shadow-xl shadow-indigo-100 active:scale-95 group"
          >
            <Eye size={28} className="group-hover:rotate-12 transition-transform" />
            PRATINJAU
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;