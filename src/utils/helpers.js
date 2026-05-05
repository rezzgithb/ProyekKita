// Format angka ke Rupiah dengan pemisah ribuan
export function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return 'Rp 0';
  }
  return 'Rp ' + Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Parse string rupiah ke number
export function parseRupiah(str) {
  if (!str) return 0;
  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

// Validasi input angka positif
export function validatePositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

// Hitung luas tanah
export function calculateArea(panjang, lebar) {
  const p = parseFloat(panjang);
  const l = parseFloat(lebar);
  
  if (!validatePositiveNumber(panjang) || !validatePositiveNumber(lebar)) {
    return null;
  }
  
  return p * l;
}

// Generate ID unik
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format tanggal
export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format tanggal pendek
export function formatDateShort(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  });
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Clamp number between min and max
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Get greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}
