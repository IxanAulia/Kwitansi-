
export interface PerwalRate {
  location: string;
  dailyAllowance: number;
  lodging: {
    pimpinan: number;
    anggota: number;
    lainnya: number;
  };
  representation: {
    pimpinan: number;
    anggota: number;
    lainnya: number;
  };
}

export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Signatory {
  name: string;
  title: string;
  nip: string;
}

export interface ReceiptData {
  id: string;
  timestamp: number;
  no: string;
  kodeRekening: string;
  tahun: string;
  payerName: string;
  recipientName: string;
  recipientTitle: string;
  recipientAddress: string;
  items: ReceiptItem[];
  grandTotal: number;
  date: string;
  location: string;
  sppdNumber: string;
  sppdDate: string;
  duration: number;
  // New fields for lodging logic
  lodgingOption?: 'flat-rate' | 'at-cost';
  lodgingActualCost?: number;
  // Signatories
  penggunaAnggaran: Signatory;
  pptk: Signatory;
  bendahara: Signatory;
}

export enum AppView {
  FORM = 'FORM',
  PREVIEW = 'PREVIEW',
  HISTORY = 'HISTORY'
}