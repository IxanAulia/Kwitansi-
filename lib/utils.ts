
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const numberToWords = (n: number): string => {
  if (n === 0) return "Nol";
  
  const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  let result = "";

  const convert = (num: number): string => {
    let temp = "";
    if (num < 12) {
      temp = " " + words[num];
    } else if (num < 20) {
      temp = convert(num - 10) + " belas";
    } else if (num < 100) {
      temp = convert(Math.floor(num / 10)) + " puluh" + convert(num % 10);
    } else if (num < 200) {
      temp = " seratus" + convert(num - 100);
    } else if (num < 1000) {
      temp = convert(Math.floor(num / 100)) + " ratus" + convert(num % 100);
    } else if (num < 2000) {
      temp = " seribu" + convert(num - 1000);
    } else if (num < 1000000) {
      temp = convert(Math.floor(num / 1000)) + " ribu" + convert(num % 1000);
    } else if (num < 1000000000) {
      temp = convert(Math.floor(num / 1000000)) + " juta" + convert(num % 1000000);
    } else if (num < 1000000000000) {
      temp = convert(Math.floor(num / 1000000000)) + " milyar" + convert(num % 1000000000);
    }
    return temp;
  };

  result = convert(n);
  const clean = result.replace(/\s+/g, ' ').trim();
  // Standard Indonesian: "Dua Juta Rupiah" (Capital Case)
  return clean.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Rupiah";
};

export const getDayWord = (n: number): string => {
  const words: Record<number, string> = {
    1: 'Satu', 2: 'Dua', 3: 'Tiga', 4: 'Empat', 5: 'Lima', 
    6: 'Enam', 7: 'Tujuh', 8: 'Delapan', 9: 'Sembilan', 10: 'Sepuluh'
  };
  return words[n] || n.toString();
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
