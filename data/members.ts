
export interface DprkMember {
  id: number;
  nama: string;
  jabatan: string;
}

// Data is derived from the SQL provided by the user
export const DPRK_MEMBERS: DprkMember[] = [
  { id: 1, nama: 'Faisal', jabatan: 'Ketua DPRK' },
  { id: 2, nama: 'Sudirman Amin, S.E.', jabatan: 'Wakil Ketua I DPRK' },
  { id: 3, nama: 'Zulya Zaini, S.H.', jabatan: 'Wakil Ketua II DPRK' },
  { id: 4, nama: 'Fauzan', jabatan: 'Anggota' },
  { id: 5, nama: 'Farhan Zuhri, S.Hum., M.Pd.', jabatan: 'Anggota' },
  { id: 6, nama: 'Sayed Fakhri', jabatan: 'Anggota' },
  { id: 7, nama: 'Hj. Nurhayati Aziz', jabatan: 'Anggota' },
  { id: 8, nama: 'Irwan Yusuf', jabatan: 'Anggota' },
  { id: 9, nama: 'Syahrul, S.T.', jabatan: 'Anggota' },
  { id: 10, nama: 'Julianti, S.Sos.', jabatan: 'Anggota' },
  { id: 11, nama: 'Masykurdin El Ahmady, S.Pd.I.', jabatan: 'Anggota' },
  { id: 12, nama: 'Hery Herman Saputra', jabatan: 'Anggota' },
  { id: 13, nama: 'Nuraida', jabatan: 'Anggota' },
  { id: 14, nama: 'Alfia', jabatan: 'Anggota' },
  { id: 15, nama: 'Haniful Ikbal', jabatan: 'Anggota' },
  { id: 16, nama: 'Said Fachri', jabatan: 'Anggota' },
  { id: 17, nama: 'Yusuf A', jabatan: 'Anggota' },
  { id: 18, nama: 'Wardhatul Jannah, A.Md.', jabatan: 'Anggota' },
  { id: 19, nama: 'Puteh, S.E.', jabatan: 'Anggota' },
  { id: 20, nama: 'Andar Asma, S.E.', jabatan: 'Anggota' },
  { id: 21, nama: 'Nurbayan, M.Sos.', jabatan: 'Anggota' },
  { id: 22, nama: 'Jailani Usman, S.H., M.H.', jabatan: 'Anggota' },
  { id: 23, nama: 'Zulkarnaini', jabatan: 'Anggota' },
  { id: 24, nama: 'Said Lutfie Manfalutie', jabatan: 'Anggota' },
  { id: 25, nama: 'Roma Juwita Hasibuan, S.I.A.N.', jabatan: 'Anggota' }
];

// Re-map jabatan names to match the ones in JABATAN_OPTIONS for consistency
export const MAPPED_DPRK_MEMBERS = DPRK_MEMBERS.map(member => {
    switch (member.jabatan) {
      case 'Ketua DPRK':
        return { ...member, jabatan: 'Ketua' };
      case 'Wakil Ketua I DPRK':
        return { ...member, jabatan: 'Wakil Ketua I' };
      case 'Wakil Ketua II DPRK':
        return { ...member, jabatan: 'Wakil Ketua II' };
      case 'Anggota':
        return { ...member, jabatan: 'Anggota DPRK' };
      default:
        return member;
    }
});
