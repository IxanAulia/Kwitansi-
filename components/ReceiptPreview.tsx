import React from 'react';
import { ReceiptData } from '../types';
import { formatCurrency, numberToWords, formatDateIndo, getDayWord } from '../lib/utils';

interface Props {
  data: ReceiptData;
}

/**
 * Komponen Numb: Sekarang menggunakan font standar (Inter) agar seragam sesuai permintaan.
 * Tetap dipisahkan untuk memudahkan pengaturan ukuran/bold secara spesifik jika diperlukan.
 */
const Numb: React.FC<{ children: React.ReactNode; bold?: boolean; size?: string }> = ({ 
  children, 
  bold = false, 
  size = 'text-[12px]' 
}) => (
  <span className={`${size} ${bold ? 'font-bold' : 'font-normal'}`}>{children}</span>
);

const ReceiptPreview: React.FC<Props> = ({ data }) => {
  return (
    /* 
       Container Utama: Menggunakan font-sans (Inter) secara menyeluruh.
       Padding dan lebar diatur agar nyaman dipandang di layar dan pas saat dicetak.
    */
    <div id="receipt-document" className="receipt-container bg-white mx-auto w-[210mm] min-h-[160mm] p-[12mm] text-[11.5px] leading-tight font-sans flex flex-col text-black border border-gray-200 print:border-none shadow-sm print:shadow-none overflow-hidden">
      
      {/* HEADER SECTION - Memperpendek garis agar tidak terlalu panjang ke kanan */}
      <header className="mb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 w-fit">
            <div className="grid grid-cols-[100px_15px_180px] items-baseline">
              <span className="font-medium">No.</span>
              <span className="font-bold">:</span>
              <div className="border-b border-black border-dotted pb-0.5">
                <Numb bold size="text-[12px]">{data.no || '................'}</Numb>
              </div>
            </div>
            <div className="grid grid-cols-[100px_15px_180px] items-baseline">
              <span className="whitespace-nowrap font-medium">Kode Rekening</span>
              <span className="font-bold">:</span>
              <div className="border-b border-black border-dotted pb-0.5">
                <Numb bold size="text-[12px]">{data.kodeRekening || '-'}</Numb>
              </div>
            </div>
            <div className="grid grid-cols-[100px_15px_180px] items-baseline">
              <span className="font-medium">Tahun</span>
              <span className="font-bold">:</span>
              <div className="border-b border-black border-dotted pb-0.5">
                <Numb bold size="text-[12px]">{data.tahun || '-'}</Numb>
              </div>
            </div>
          </div>
          
          <div className="text-left flex flex-col text-[10px] leading-tight font-medium mr-2 opacity-80">
            <span className="underline">Asli</span>
            <span className="underline">Kedua</span>
            <span className="underline">Ketiga</span>
            <span className="underline">Keempat</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <h1 className="text-[18px] font-bold underline tracking-[0.25em] uppercase">TANDA PENERIMAAN</h1>
        </div>
      </header>

      {/* BODY SECTION */}
      <main className="flex-1 mt-6">
        <div className="space-y-3.5">
          <div className="grid grid-cols-[140px_20px_1fr] items-start">
            <span className="font-semibold">Sudah terima dari</span>
            <span className="text-center font-bold">:</span>
            <div className="font-bold border-b border-black border-dotted flex-1 pb-0.5 leading-tight">
              {data.payerName || '-'}
            </div>
          </div>
          
          <div className="grid grid-cols-[140px_20px_1fr] items-start">
            <span className="font-semibold">Uang banyaknya</span>
            <span className="text-center font-bold">:</span>
            <div className="font-bold border-b border-black border-dotted italic pb-0.5 leading-tight">
              {numberToWords(data.grandTotal)}
            </div>
          </div>

          <div className="grid grid-cols-[140px_20px_1fr] items-start">
            <span className="font-bold tracking-[0.5em] text-[12px]">YAITU</span>
            <span className="text-center font-bold">:</span>
            <div className="leading-relaxed text-justify">
              Pembayaran biaya perjalanan dinas an. <span className="font-bold underline uppercase">{data.recipientName || '................................'}</span> ke {data.location || '................'} Selama <Numb bold>{data.duration || '0'}</Numb> ({getDayWord(data.duration || 0)}) hari, berdasarkan SPPD No. <Numb bold>{data.sppdNumber || '................................'}</Numb> Tanggal {formatDateIndo(data.sppdDate)}, dengan perincian Sbb:
            </div>
          </div>
        </div>

        {/* LIST ITEMS - Memastikan uraian panjang tidak terpotong dan alignment rapi */}
        <div className="mt-5 space-y-2 ml-[40px]">
          {(data.items || []).map((item, index) => (
            <div key={item.id} className="grid grid-cols-[30px_1fr_auto] items-start gap-2 text-[11.5px]">
              <div className="text-left font-normal pt-0.5">{index + 1}.</div>
              <div className="font-medium pr-4 leading-normal">{item.description}</div>
              <div className="flex items-center gap-3 justify-end min-w-[320px] pt-0.5">
                <div className="w-8 text-center"><Numb>{item.quantity}</Numb></div>
                <div className="w-4 text-center text-[10px]">x</div>
                <div className="w-6 text-right">Rp</div>
                <div className="w-24 text-right"><Numb>{formatCurrency(item.unitPrice)}</Numb></div>
                <div className="w-8 text-center font-bold">= Rp</div>
                <div className="w-28 text-right font-bold"><Numb bold>{formatCurrency(item.total)}</Numb></div>
              </div>
            </div>
          ))}
        </div>

        {/* SUBTOTAL LINE - Menggunakan garis titik-titik untuk keseragaman */}
        <div className="flex justify-end mt-4">
            <div className="w-[320px] border-t border-black pt-2 flex justify-between items-baseline font-bold">
                <span className="text-[13px]">Rp</span>
                <div className="flex-1 mx-4 border-b border-black border-dotted h-0.5 mt-2"></div>
                <span><Numb bold size="text-[14px]">{formatCurrency(data.grandTotal)}</Numb></span>
            </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-10">
        <div className="grid grid-cols-2 gap-x-16">
          {/* KOLOM KIRI */}
          <div className="flex flex-col justify-between">
            <div className="text-center mb-8">
              <p className="text-[10px] italic leading-none mb-1">Setuju dibayar,</p>
              <p className="font-bold uppercase leading-tight text-[11px]">PENGGUNA ANGGARAN</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase leading-none text-[12.5px] tracking-wide">{data.penggunaAnggaran.name}</p>
              <p className="text-[11px] leading-none mt-2">Nip. <Numb bold size="text-[11px]">{data.penggunaAnggaran.nip}</Numb></p>
            </div>

            {/* JUMLAH RP - Font Diperbesar Sesuai Permintaan */}
            <div className="text-left mb-8 border-b-2 border-black pb-2">
               <div className="flex items-baseline justify-between">
                  <span className="font-black text-[15px] whitespace-nowrap uppercase italic underline">JUMLAH RP.</span>
                  <div className="flex items-baseline gap-1">
                     <Numb bold size="text-[28px]">{formatCurrency(data.grandTotal)}</Numb>
                     <span className="font-black text-[24px]"> , -</span>
                  </div>
               </div>
            </div>
            
            <div className="text-[10px] italic leading-snug mb-6 opacity-90">
              Barang / Pekerjaan yang di maksud telah diterima/ <br />
              Diselenggarakan dengan sempurna Pada tanggal ........................
            </div>

            <div className="text-center">
              <p className="font-bold uppercase text-[11px] leading-tight">Pejabat Pelaksana Teknis Kegiatan</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase leading-none text-[12.5px] tracking-wide">{data.pptk.name}</p>
              <p className="text-[11px] leading-none mt-2">Nip. <Numb bold size="text-[11px]">{data.pptk.nip}</Numb></p>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="flex flex-col justify-between">
            <div className="text-left mb-8">
              <div className="border-b border-black w-fit mb-4 font-bold min-w-[180px] pb-1 italic text-[12px]">
                Lhokseumawe, {formatDateIndo(data.date)}
              </div>
              <div className="relative">
                <p className="font-bold pl-16 underline mb-4 italic text-[11.5px]">Yang menerima,</p>
                <div className="space-y-3 ml-4">
                  <div className="grid grid-cols-[80px_15px_1fr] items-center">
                    <span className="font-medium">Nama</span><span className="text-center font-bold">:</span><span className="font-bold uppercase border-b border-black border-dotted">{data.recipientName || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[80px_15px_1fr] items-center">
                    <span className="font-medium">Pekerjaan</span><span className="text-center font-bold">:</span><span className="border-b border-black border-dotted font-medium">{data.recipientTitle || '-'}</span>
                  </div>
                  <div className="grid grid-cols-[80px_15px_1fr] items-center">
                    <span className="font-medium">Alamat</span><span className="text-center font-bold">:</span><span className="border-b border-black border-dotted font-medium">{data.recipientAddress || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <p className="italic font-bold text-[10px] leading-none mb-1">Lunas Dibayar,</p>
              <p className="font-bold uppercase text-[11px] leading-tight">Bendahara Pengeluaran</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase leading-none text-[12.5px] tracking-wide">{data.bendahara.name}</p>
              <p className="text-[11px] leading-none mt-2">Nip. <Numb bold size="text-[11px]">{data.bendahara.nip}</Numb></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReceiptPreview;