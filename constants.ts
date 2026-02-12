import { PerwalRate, Signatory } from './types';

// Standar Biaya Masukan (SBM) Perjalanan Dinas DPRK Lhokseumawe
// Dikelompokkan berdasarkan klaster wilayah dan kategori jabatan
export const PERWAL_RATES: Record<string, PerwalRate> = {
  // --- PROVINSI ACEH ---
  'Banda Aceh': { location: 'Banda Aceh', dailyAllowance: 360000, lodging: { pimpinan: 3500000, anggota: 1500000, lainnya: 950000 }, representation: { pimpinan: 250000, anggota: 125000, lainnya: 0 } },
  'Lhokseumawe': { location: 'Lhokseumawe', dailyAllowance: 300000, lodging: { pimpinan: 1500000, anggota: 1000000, lainnya: 750000 }, representation: { pimpinan: 200000, anggota: 100000, lainnya: 0 } },
  'Sabang': { location: 'Sabang', dailyAllowance: 360000, lodging: { pimpinan: 2500000, anggota: 1200000, lainnya: 800000 }, representation: { pimpinan: 200000, anggota: 100000, lainnya: 0 } },
  'Langsa': { location: 'Langsa', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Subulussalam': { location: 'Subulussalam', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Besar (Jantho)': { location: 'Aceh Besar (Jantho)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Jaya (Calang)': { location: 'Aceh Jaya (Calang)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Barat (Meulaboh)': { location: 'Aceh Barat (Meulaboh)', dailyAllowance: 340000, lodging: { pimpinan: 2500000, anggota: 1200000, lainnya: 800000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Barat Daya (Blangpidie)': { location: 'Aceh Barat Daya (Blangpidie)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Selatan (Tapaktuan)': { location: 'Aceh Selatan (Tapaktuan)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Singkil': { location: 'Aceh Singkil', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Tamiang (Karang Baru)': { location: 'Aceh Tamiang (Karang Baru)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Tengah (Takengon)': { location: 'Aceh Tengah (Takengon)', dailyAllowance: 340000, lodging: { pimpinan: 2500000, anggota: 1200000, lainnya: 800000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Tenggara (Kutacane)': { location: 'Aceh Tenggara (Kutacane)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Timur (Idi Rayeuk)': { location: 'Aceh Timur (Idi Rayeuk)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Aceh Utara (Lhoksukon)': { location: 'Aceh Utara (Lhoksukon)', dailyAllowance: 300000, lodging: { pimpinan: 1500000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Bener Meriah (Redelong)': { location: 'Bener Meriah (Redelong)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Bireuen': { location: 'Bireuen', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Gayo Lues (Blangkejeren)': { location: 'Gayo Lues (Blangkejeren)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Nagan Raya (Suka Makmue)': { location: 'Nagan Raya (Suka Makmue)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Pidie (Sigli)': { location: 'Pidie (Sigli)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Pidie Jaya (Meureudu)': { location: 'Pidie Jaya (Meureudu)', dailyAllowance: 340000, lodging: { pimpinan: 2000000, anggota: 1000000, lainnya: 650000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },
  'Simeulue (Sinabang)': { location: 'Simeulue (Sinabang)', dailyAllowance: 360000, lodging: { pimpinan: 2500000, anggota: 1200000, lainnya: 800000 }, representation: { pimpinan: 150000, anggota: 75000, lainnya: 0 } },

  // --- LUAR PROVINSI ACEH ---
  'Medan': { location: 'Medan', dailyAllowance: 370000, lodging: { pimpinan: 4000000, anggota: 1700000, lainnya: 1100000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Padang': { location: 'Padang', dailyAllowance: 380000, lodging: { pimpinan: 3800000, anggota: 1600000, lainnya: 1000000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Pekanbaru': { location: 'Pekanbaru', dailyAllowance: 400000, lodging: { pimpinan: 3900000, anggota: 1650000, lainnya: 1150000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Batam / Kepulauan Riau': { location: 'Batam / Kepulauan Riau', dailyAllowance: 450000, lodging: { pimpinan: 4200000, anggota: 1800000, lainnya: 1200000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Jambi': { location: 'Jambi', dailyAllowance: 370000, lodging: { pimpinan: 3500000, anggota: 1500000, lainnya: 950000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Palembang': { location: 'Palembang', dailyAllowance: 390000, lodging: { pimpinan: 3850000, anggota: 1625000, lainnya: 1050000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Jakarta': { location: 'Jakarta', dailyAllowance: 530000, lodging: { pimpinan: 5739000, anggota: 1934000, lainnya: 1500000 }, representation: { pimpinan: 500000, anggota: 250000, lainnya: 0 } },
  'Bandung': { location: 'Bandung', dailyAllowance: 430000, lodging: { pimpinan: 4500000, anggota: 1800000, lainnya: 1250000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Semarang': { location: 'Semarang', dailyAllowance: 400000, lodging: { pimpinan: 4100000, anggota: 1700000, lainnya: 1100000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Yogyakarta': { location: 'Yogyakarta', dailyAllowance: 420000, lodging: { pimpinan: 4200000, anggota: 1750000, lainnya: 1150000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Surabaya': { location: 'Surabaya', dailyAllowance: 450000, lodging: { pimpinan: 4800000, anggota: 1850000, lainnya: 1300000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Denpasar': { location: 'Denpasar', dailyAllowance: 480000, lodging: { pimpinan: 5200000, anggota: 1900000, lainnya: 1400000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Makassar': { location: 'Makassar', dailyAllowance: 430000, lodging: { pimpinan: 4300000, anggota: 1780000, lainnya: 1200000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Manado': { location: 'Manado', dailyAllowance: 410000, lodging: { pimpinan: 4150000, anggota: 1720000, lainnya: 1100000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Balikpapan / Samarinda': { location: 'Balikpapan / Samarinda', dailyAllowance: 430000, lodging: { pimpinan: 4200000, anggota: 1800000, lainnya: 1250000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Pontianak': { location: 'Pontianak', dailyAllowance: 370000, lodging: { pimpinan: 3750000, anggota: 1600000, lainnya: 1000000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Ambon': { location: 'Ambon', dailyAllowance: 350000, lodging: { pimpinan: 3600000, anggota: 1550000, lainnya: 950000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } },
  'Jayapura': { location: 'Jayapura', dailyAllowance: 550000, lodging: { pimpinan: 5800000, anggota: 2000000, lainnya: 1500000 }, representation: { pimpinan: 300000, anggota: 150000, lainnya: 0 } }
};

export const DEFAULT_SIGNATORIES: Record<string, Signatory> = {
  penggunaAnggaran: {
    name: 'BUKHARI, S.Sos.M.Si',
    title: 'PENGGUNA ANGGARAN',
    nip: '19701025 199103 1 002'
  },
  pptk: {
    name: 'DRS. YURFAN',
    title: 'PEJABAT PELAKSANA TEKNIS KEGIATAN',
    nip: '19680207 199312 1 003'
  },
  bendahara: {
    name: 'RATNA DEWI, SE',
    title: 'BENDAHARA PENGELUARAN',
    nip: '19750101 200501 2 001'
  }
};