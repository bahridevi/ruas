'use client';
// @ruas-icons/ui: komponen dasbor bergaya Ruas untuk React/Next.js. Tanpa langkah build; pasangkan ruas-ui.css.
// Teks bawaan berbahasa Indonesia; ganti lewat prop `labels` (bahasa lain siap pakai di bahasa.js). Ikon dari @ruas-icons/react.
import { Fragment, createContext, createElement as h, forwardRef, useCallback, useContext, useEffect, useId, useLayoutEffect as useLayoutEffectAsli, useMemo, useRef, useState } from 'react';
import {
  Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleCheck, CircleX, Close, CloudUpload, DotsHorizontal, Download, Eye, File as IkonBerkas,
  Info, Loader, Menu as IkonMenu, Minus, Printer, Search, Sort, Table, TrendingDown, TrendingUp, TriangleAlert,
} from '@ruas-icons/react';

// Di server (SSR) useLayoutEffect memicu peringatan; di sana tidak ada yang perlu diukur.
const useLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffectAsli;

const cx = (...a) => a.filter(Boolean).join(' ');
const angka = n => Number(n).toLocaleString('id-ID');
const pasangRef = (...refs) => el => refs.forEach(r => { if (typeof r === 'function') r(el); else if (r) r.current = el; });

export const LABEL = {
  bukaSemua: 'Buka semua', gulungSemua: 'Gulung semua', cetak: 'Cetak', memuat: 'Memuat…', tutup: 'Tutup', buka: 'Buka', gulung: 'Gulung',
  kodeOtp: 'Kode OTP', digit: (i, n) => `Digit ${i} dari ${n}`, pilihSemua: 'Pilih semua',
  ringkasan: 'Ringkasan', saringan: 'Saringan', daftar: 'Daftar', cari: 'Cari', cariContoh: 'Ketik untuk mencari di semua kolom',
  hapusSaringan: 'Hapus saringan', saringanAktif: n => `${n} saringan aktif`,
  jumlah: (a, b) => `${angka(a)} dari ${angka(b)}`, rentang: (a, b, n) => `${angka(a)}–${angka(b)} dari ${angka(n)}`,
  halaman: (a, b) => `Halaman ${angka(a)} dari ${angka(b)}`, sebelumnya: 'Sebelumnya', berikutnya: 'Berikutnya',
  barisPerHalaman: 'Baris per halaman', no: 'No', semua: 'Semua', saringKolom: k => `Saring ${k}`, urutkan: k => `Urutkan menurut ${k}`,
  kosong: 'Tidak ada data yang cocok dengan saringan. Coba hapus saringan.', kosongAwal: 'Belum ada data.',
  bukaRincian: 'Buka rincian', gulungRincian: 'Gulung rincian', bukaSemuaRincian: 'Buka semua rincian', gulungSemuaRincian: 'Gulung semua rincian',
  cetakHalaman: 'Cetak halaman ini', cetakSaringan: 'Cetak hasil saringan', gagalCetak: 'Gagal menyiapkan cetakan. Periksa koneksi, lalu coba lagi.',
  pilihBaris: n => `Pilih baris ${angka(n)}`, pilihHalaman: 'Pilih semua baris di halaman ini', dipilih: n => `${angka(n)} dipilih`, batalPilih: 'Batal pilih',
  kolom: 'Kolom', tampilkanKolom: 'Tampilkan kolom', unduhCsv: 'Unduh CSV', gagalUnduh: 'Gagal menyiapkan unduhan. Periksa koneksi, lalu coba lagi.',
  aksi: 'Aksi', navigasi: 'Navigasi utama', jejak: 'Jejak halaman', bukaMenu: 'Buka menu', tutupMenu: 'Tutup menu',
  ciutkanMenu: 'Ciutkan menu samping', lebarkanMenu: 'Lebarkan menu samping', lewati: 'Lewati ke isi',
  palet: 'Palet perintah', cariPerintah: 'Cari halaman atau perintah…', tanpaHasil: 'Tidak ada yang cocok.', hasil: n => `${angka(n)} hasil`,
  pemberitahuan: 'Pemberitahuan', pilihOpsi: 'Pilih…', opsiLagi: n => `${angka(n)} pilihan lain. Ketik untuk mempersempit.`,
  dari: 'Dari', sampai: 'Sampai', rentangSalah: 'Tanggal awal harus sebelum atau sama dengan tanggal akhir.',
  hariIni: 'Hari ini', tujuhHari: '7 hari terakhir', bulanIni: 'Bulan ini', bulanLalu: 'Bulan lalu', tahunIni: 'Tahun ini',
  tanggal: 'Tanggal', mingguIni: 'Minggu ini', tahunLalu: 'Tahun lalu', rentangTanggal: 'Rentang tanggal…', semuaTanggal: 'Semua tanggal', periode: 'Periode',
  seretBerkas: 'Seret berkas ke sini, atau', pilihBerkas: 'pilih berkas', hapusBerkas: nama => `Hapus ${nama}`,
  terlaluBesar: (nama, batas) => `${nama} lebih dari ${batas}.`, jenisSalah: nama => `${nama} bukan jenis berkas yang diterima.`, batasBerkas: batas => `Maksimal ${batas} per berkas.`,
  langkah: (i, n) => `Langkah ${i} dari ${n}`, selesai: 'selesai', naik: 'naik', turun: 'turun', tetap: 'tetap',
  tren: 'Tren', lihatTabel: 'Lihat tabel', sembunyikanTabel: 'Sembunyikan tabel', nilai: 'Nilai', label: 'Label',
  diputar: 'Sedang diputar', dijeda: 'Dijeda', level: 'Level',
};

// Cetak satu elemen saja; ruas-ui.css menyembunyikan sisanya dan membuka isi yang tergulung.
export function printElement(el, selesai) {
  if (!el) return;
  const akar = document.documentElement;
  const tutup = () => {
    el.classList.remove('ruas-dicetak');
    akar.classList.remove('ruas-cetak-aktif');
    window.removeEventListener('afterprint', tutup);
    selesai?.();
  };
  el.classList.add('ruas-dicetak');
  akar.classList.add('ruas-cetak-aktif');
  window.addEventListener('afterprint', tutup);
  window.print();
}

export const Button = forwardRef(function Button({ variant = 'secondary', size = 'md', loading, icon, children, className, disabled, type = 'button', ...p }, ref) {
  return h('button', {
    ref, type, disabled: disabled || loading, 'aria-busy': loading || undefined,
    className: cx('ruas-btn', `ruas-btn-${variant}`, size !== 'md' && `ruas-btn-${size}`, icon && (children == null || children === false || children === '') && 'ruas-btn-ikon', className), ...p,
  }, loading ? h(Loader, { size: 16, className: 'ruas-putar' }) : icon, children);
});

export function Badge({ tone = 'neutral', size = 'md', icon, children, className, ...p }) {
  return h('span', { className: cx('ruas-badge', `ruas-badge-${tone}`, size === 'sm' && 'ruas-badge-sm', className), ...p }, icon, children);
}

// Ikon tersemat bergaya Ruas: ubin Sudut Daun bernada. Tanpa label = hiasan (disembunyikan dari pembaca layar).
export function IconTile({ icon, tone = 'default', size = 'md', variant = 'soft', label, className, ...p }) {
  const peran = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return h('span', { className: cx('ruas-ikon', `ruas-ikon-${size}`, `ruas-ikon-${variant}`, tone !== 'default' && `ruas-ikon-${tone}`, className), ...peran, ...p }, icon);
}

const bintang = h('span', { className: 'ruas-wajib', 'aria-hidden': true }, ' *');
const galat = (id, error) => error && h('p', { id: `${id}-error`, className: 'ruas-galat', role: 'alert' }, h(TriangleAlert, { size: 16 }), error);
const deskripsi = (id, hint, error) => cx(hint && `${id}-hint`, error && `${id}-error`) || undefined;

// Label + petunjuk + galat untuk satu kontrol. `children` menerima atribut yang harus dipasang pada kontrol.
export function Field({ label, hint, error, required, id, className, children }) {
  const auto = useId();
  const fid = id || auto;
  return h('div', { className: cx('ruas-field', className) },
    label != null && h('label', { htmlFor: fid, className: 'ruas-label' }, label, required && bintang),
    children({ id: fid, 'aria-describedby': deskripsi(fid, hint, error), 'aria-invalid': error ? true : undefined, required }),
    hint && h('p', { id: `${fid}-hint`, className: 'ruas-hint' }, hint),
    galat(fid, error));
}

const isian = tag => forwardRef(function Isian({ label, hint, error, id, className, fieldClassName, ...p }, ref) {
  return h(Field, { label, hint, error, id, required: p.required, className: fieldClassName },
    a => h(tag, { ref, className: cx('ruas-input', className), ...a, ...p }));
});
export const Input = isian('input');
export const Textarea = isian('textarea');

export const Select = forwardRef(function Select({ label, hint, error, id, className, fieldClassName, options, placeholder, children, ...p }, ref) {
  return h(Field, { label, hint, error, id, required: p.required, className: fieldClassName }, a => h('div', { className: 'ruas-select' },
    h('select', { ref, className: cx('ruas-input', className), ...a, ...p },
      placeholder != null && h('option', { value: '', disabled: p.required }, placeholder),
      options ? options.map(o => typeof o === 'object'
        ? h('option', { key: o.value, value: o.value, disabled: o.disabled }, o.label)
        : h('option', { key: o, value: o }, o)) : children),
    h(ChevronDown, { size: 18 })));
});

const Pilih = forwardRef(function Pilih({ type, label, hint, indeterminate, className, id, ...p }, ref) {
  const auto = useId();
  const fid = id || auto;
  const dalam = useRef(null);
  useEffect(() => { if (dalam.current) dalam.current.indeterminate = !!indeterminate; }, [indeterminate]);
  const pasang = el => {
    dalam.current = el;
    if (typeof ref === 'function') ref(el); else if (ref) ref.current = el;
  };
  return h('div', { className: cx('ruas-pilih', className) },
    h('input', { ref: pasang, type, id: fid, 'aria-describedby': hint ? `${fid}-hint` : undefined, ...p }),
    h('div', null,
      h('label', { htmlFor: fid }, label),
      hint && h('span', { id: `${fid}-hint`, className: 'ruas-hint' }, hint)));
});
export const Checkbox = forwardRef((p, ref) => h(Pilih, { ...p, type: 'checkbox', ref }));
export const Radio = forwardRef((p, ref) => h(Pilih, { ...p, type: 'radio', ref }));
const rtl = el => !!el && getComputedStyle(el).direction === 'rtl';
// Rata kolom: 'left'/'right' dibaca sebagai awal/akhir baris, jadi ikut terbalik pada tulisan kanan-ke-kiri.
const rata = a => ({ left: 'start', right: 'end' })[a] || a;

// Sakelar nyala/mati: kotak centang dengan role="switch" (langsung berlaku, tanpa tombol Simpan).
// Sakelar: kenop persegi Sudut Daun yang bisa diklik atau digeser; rongga di belakang kenop terisi warna.
// Geseran ke akhir baris = nyala (ke kanan; ke kiri pada tulisan kanan-ke-kiri), ke awal = mati.
export const Switch = forwardRef(function Switch({ className, onClick, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, ...p }, ref) {
  const seret = useRef(null);
  const lepas = e => { e.currentTarget.style.removeProperty('--seret'); delete e.currentTarget.dataset.seret; };
  return h(Pilih, {
    ...p, type: 'checkbox', role: 'switch', className: cx('ruas-saklar', className), ref,
    onPointerDown: e => { onPointerDown?.(e); if (p.disabled || e.button) return; seret.current = { x: e.clientX, dx: 0, arah: rtl(e.currentTarget) ? -1 : 1 }; e.currentTarget.setPointerCapture?.(e.pointerId); },
    onPointerMove: e => {
      onPointerMove?.(e);
      const s = seret.current;
      if (!s) return;
      s.dx = (e.clientX - s.x) * s.arah;
      if (Math.abs(s.dx) < 3) return;
      e.currentTarget.dataset.seret = '';
      e.currentTarget.style.setProperty('--seret', `${s.dx}px`);
    },
    onPointerUp: e => { onPointerUp?.(e); lepas(e); },
    onPointerCancel: e => { onPointerCancel?.(e); lepas(e); seret.current = null; },
    onClick: e => {
      const s = seret.current;
      seret.current = null;
      // Saat onClick, centang sudah berbalik; batalkan bila hasilnya berlawanan dengan arah geseran.
      if (s && Math.abs(s.dx) > 4 && e.currentTarget.checked !== s.dx > 0) { e.preventDefault(); return; }
      onClick?.(e);
    },
  });
});

function Grup({ id, label, hint, error, required, className, children }) {
  return h('fieldset', { className: cx('ruas-grup', className), 'aria-describedby': deskripsi(id, hint, error), 'aria-invalid': error ? true : undefined },
    label != null && h('legend', { className: 'ruas-label' }, label, required && bintang),
    hint && h('p', { id: `${id}-hint`, className: 'ruas-hint' }, hint),
    children,
    galat(id, error));
}

// Nilai terkendali (value + onChange) atau mandiri (defaultValue).
function useNilai(value, defaultValue, onChange) {
  const [sendiri, setSendiri] = useState(defaultValue);
  const v = value === undefined ? sendiri : value;
  return [v, (x, ...lain) => { if (value === undefined) setSendiri(x); onChange?.(x, ...lain); }];
}

export function RadioGroup({ label, name, options, value, defaultValue, onChange, hint, error, required, inline, variant, disabled, className }) {
  const id = useId();
  const [v, pilih] = useNilai(value, defaultValue, onChange);
  const nama = name || id;
  return h(Grup, { id, label, hint, error, required, className },
    variant === 'segmented'
      ? h('div', { className: 'ruas-seg' }, options.map(o => h('label', { key: o.value },
        h('input', { type: 'radio', name: nama, value: o.value, checked: v === o.value, required, disabled: disabled || o.disabled, onChange: () => pilih(o.value) }),
        h('span', null, o.label))))
      : h('div', { className: cx('ruas-pilihan', inline && 'ruas-sebaris') }, options.map(o => h(Pilih, {
        key: o.value, type: 'radio', name: nama, value: o.value, label: o.label, hint: o.hint, checked: v === o.value,
        required, disabled: disabled || o.disabled, onChange: () => pilih(o.value),
      }))));
}

export function CheckboxGroup({ label, options, value, defaultValue = [], onChange, hint, error, required, inline, selectAll, disabled, labels, className }) {
  const L = { ...LABEL, ...labels };
  const id = useId();
  const [v, ubah] = useNilai(value, defaultValue, onChange);
  const bisa = options.filter(o => !o.disabled).map(o => o.value);
  const penuh = bisa.length > 0 && bisa.every(x => v.includes(x));
  return h(Grup, { id, label, hint, error, required, className },
    h('div', { className: cx('ruas-pilihan', inline && 'ruas-sebaris') },
      selectAll && h(Pilih, {
        type: 'checkbox', label: L.pilihSemua, className: 'ruas-pilih-semua', disabled, checked: penuh,
        indeterminate: !penuh && bisa.some(x => v.includes(x)),
        onChange: () => ubah(penuh ? v.filter(x => !bisa.includes(x)) : [...new Set([...v, ...bisa])]),
      }),
      options.map(o => h(Pilih, {
        key: o.value, type: 'checkbox', value: o.value, label: o.label, hint: o.hint, checked: v.includes(o.value), disabled: disabled || o.disabled,
        onChange: e => ubah(e.target.checked ? [...v, o.value] : v.filter(x => x !== o.value)),
      }))));
}

// Kotak OTP: satu kotak per digit, tempel/isi otomatis SMS (one-time-code) menyebar ke semua kotak.
export function Otp({ length = 6, value, defaultValue = '', onChange, onComplete, label, hint, error, disabled, autoFocus, name, alphanumeric, labels, className }) {
  const L = { ...LABEL, ...labels };
  const id = useId();
  const kotak = useRef([]);
  const [mentah, ubah] = useNilai(value, defaultValue, onChange);
  const v = mentah.slice(0, length);
  const bersih = s => (alphanumeric ? s.replace(/[^0-9a-z]/gi, '').toUpperCase() : s.replace(/\D/g, ''));
  const fokus = i => kotak.current[Math.max(0, Math.min(i, length - 1))]?.focus();
  // Fokus setelah nilai berubah ditunda sampai render berikutnya, agar pengalih fokus membaca nilai terbaru.
  const tuju = useRef(null);
  useEffect(() => { if (tuju.current != null) { fokus(tuju.current); tuju.current = null; } });
  const set = (s, ke) => {
    s = s.slice(0, length);
    if (s === v) return ke != null && fokus(ke);
    tuju.current = ke;
    ubah(s);
    if (s.length === length) onComplete?.(s);
  };
  const isi = (i, teks) => {
    const d = bersih(teks);
    if (d) set(v.slice(0, i) + d + v.slice(i + d.length), i + d.length);
  };
  const tombol = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (v[i]) set(v.slice(0, i) + v.slice(i + 1));
      else if (i > 0) set(v.slice(0, i - 1) + v.slice(i), i - 1);
    } else if (e.key === 'Delete') { e.preventDefault(); set(v.slice(0, i) + v.slice(i + 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); fokus(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); fokus(Math.min(i + 1, v.length)); }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); isi(i, e.key); }
  };
  // Papan ketik HP (tanpa keydown yang jelas) dan isi otomatis SMS sampai lewat onChange.
  const ganti = (i, e) => {
    let d = bersih(e.target.value);
    if (v[i] && d.length === 2) d = d.replace(v[i], '');
    isi(i, d);
  };
  return h('div', { className: cx('ruas-field', className) },
    h('span', { id: `${id}-l`, className: 'ruas-label' }, label ?? L.kodeOtp),
    h('div', { role: 'group', 'aria-labelledby': `${id}-l`, 'aria-describedby': deskripsi(id, hint, error), className: 'ruas-otp' },
      Array.from({ length }, (_, i) => h('input', {
        key: i, ref: el => { kotak.current[i] = el; }, className: 'ruas-input', value: v[i] || '', disabled,
        inputMode: alphanumeric ? 'text' : 'numeric', pattern: alphanumeric ? undefined : '[0-9]*', autoComplete: i === 0 ? 'one-time-code' : 'off',
        autoFocus: autoFocus && i === 0, enterKeyHint: i === length - 1 ? 'done' : 'next', spellCheck: false,
        'aria-label': L.digit(i + 1, length), 'aria-invalid': error ? true : undefined, 'data-terisi': v[i] ? '' : undefined,
        onKeyDown: e => tombol(i, e), onChange: e => ganti(i, e),
        onPaste: e => { e.preventDefault(); isi(i, e.clipboardData.getData('text')); },
        onFocus: e => { if (i > v.length) fokus(v.length); else e.target.select(); },
      }))),
    name && h('input', { type: 'hidden', name, value: v }),
    hint && h('p', { id: `${id}-hint`, className: 'ruas-hint' }, hint),
    galat(id, error));
}

// Tab ARIA: panah kiri/kanan, Home, End berpindah dan langsung membuka tab.
export function Tabs({ items, value, defaultValue, onChange, label, className }) {
  const id = useId();
  const tombol = useRef([]);
  const [aktif, pilih] = useNilai(value, defaultValue ?? items.find(t => !t.disabled)?.id, onChange);
  const geser = e => {
    const bisa = items.filter(t => !t.disabled);
    const i = bisa.findIndex(t => t.id === aktif);
    const r = rtl(e.currentTarget) ? -1 : 1;
    const ke = { ArrowRight: i + r, ArrowLeft: i - r, Home: 0, End: bisa.length - 1 }[e.key];
    if (ke === undefined || !bisa.length) return;
    e.preventDefault();
    const t = bisa[(ke + bisa.length) % bisa.length];
    pilih(t.id);
    tombol.current[items.indexOf(t)]?.focus();
  };
  const t = items.find(x => x.id === aktif);
  return h('div', { className: cx('ruas-tabs', className) },
    h('div', { role: 'tablist', 'aria-label': label, className: 'ruas-tablist', onKeyDown: geser },
      items.map((x, i) => h('button', {
        key: x.id, ref: el => { tombol.current[i] = el; }, type: 'button', role: 'tab', className: 'ruas-tab',
        id: `${id}-t${i}`, 'aria-selected': x.id === aktif, 'aria-controls': `${id}-p`, tabIndex: x.id === aktif ? 0 : -1,
        disabled: x.disabled, onClick: () => pilih(x.id),
      }, x.icon, h('span', null, x.label), x.badge != null && h('span', { className: 'ruas-tab-badge' }, x.badge)))),
    t && h('div', { role: 'tabpanel', id: `${id}-p`, 'aria-labelledby': `${id}-t${items.indexOf(t)}`, tabIndex: 0, className: 'ruas-tabpanel' }, t.content));
}

// Buka/gulung semua: perintah diteruskan ke setiap Section di dalamnya, termasuk kelompok bersarang.
const Perintah = createContext(null);
export function SectionGroup({ children, toolbar = true, labels, className }) {
  const L = { ...LABEL, ...labels };
  const luar = useContext(Perintah);
  const [perintah, setPerintah] = useState(null);
  const kirim = buka => setPerintah(p => ({ buka, n: (p?.n || 0) + 1 }));
  useEffect(() => { if (luar) kirim(luar.buka); }, [luar]);
  return h(Perintah.Provider, { value: perintah }, h('div', { className: cx('ruas-kelompok', className) },
    toolbar && h('div', { className: 'ruas-alat ruas-noprint' },
      h(Button, { size: 'sm', variant: 'ghost', icon: h(ChevronDown, { size: 16 }), onClick: () => kirim(true) }, L.bukaSemua),
      h(Button, { size: 'sm', variant: 'ghost', icon: h(ChevronUp, { size: 16 }), onClick: () => kirim(false) }, L.gulungSemua)),
    children));
}

// Bagian yang bisa digulung menjadi satu baris; `printable` menambah tombol Cetak untuk bagian ini saja.
export function Section({ title, meta, actions, children, defaultOpen = true, open, onOpenChange, printable, level = 3, labels, className, id }) {
  const L = { ...LABEL, ...labels };
  const isiId = useId();
  const akar = useRef(null);
  const [buka, ubah] = useNilai(open, defaultOpen, onOpenChange);
  const perintah = useContext(Perintah);
  useEffect(() => { if (perintah) ubah(perintah.buka); }, [perintah]);
  return h('section', { ref: akar, id, className: cx('ruas-bab', className) },
    h('div', { className: 'ruas-bab-kepala' },
      h(`h${level}`, { className: 'ruas-bab-judul' },
        h('button', { type: 'button', 'aria-expanded': buka, 'aria-controls': isiId, onClick: () => ubah(!buka) },
          h(ChevronDown, { size: 18, className: 'ruas-bab-chev' }),
          h('span', null, title),
          meta != null && meta !== '' && h('span', { className: 'ruas-bab-meta' }, meta))),
      (actions || printable) && h('div', { className: 'ruas-bab-aksi ruas-noprint' }, actions,
        printable && h(Button, { size: 'sm', variant: 'ghost', icon: h(Printer, { size: 16 }), onClick: () => printElement(akar.current) }, L.cetak))),
    h('div', { id: isiId, className: 'ruas-bab-isi', hidden: !buka }, children));
}

// Sel pohon untuk kolom pertama tabel bertingkat (mis. bagan akun): garis panduan per tingkat, tombol buka/gulung kecil.
// Tanpa onToggle = daun (titik). Aplikasi tetap memegang data mana yang terbuka.
export function TreeCell({ depth = 0, expanded, onToggle, label, labels, children, className }) {
  const L = { ...LABEL, ...labels };
  const aksi = `${expanded ? L.gulung : L.buka}${label != null ? ` ${label}` : ''}`;
  return h('span', { className: cx('ruas-pohon', className), style: { '--tingkat': depth } },
    onToggle
      ? h('button', { type: 'button', className: 'ruas-pohon-btn', 'aria-expanded': !!expanded, 'aria-label': aksi, title: aksi, onClick: onToggle }, h(ChevronRight, { size: 14 }))
      : h('span', { className: 'ruas-pohon-daun', 'aria-hidden': true }),
    children);
}

// Jendela modal dari <dialog> bawaan: fokus terkurung, Esc & klik latar menutup (dismissible), gulir latar terkunci.
// Isi dirender hanya saat terbuka; fokus awal ke [data-autofocus], isian pertama, lalu tombol kaki pertama.
// onSubmit = kotak menjadi <form>, jadi Enter mengirim dan tombol kaki boleh type="submit".
// alert = pesan galat di atas isi (toast halaman tertutup lapisan modal, jadi galat simpan ditampilkan di sini).
export function Dialog({ open, onClose, title, description, icon, alert, tone = 'default', size = 'md', footer, onSubmit, dismissible = true, labels, className, children, ...p }) {
  const L = { ...LABEL, ...labels };
  const ref = useRef(null);
  const turun = useRef(false);
  const judulId = useId(), deskId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector('[data-autofocus], .ruas-dialog-isi :is(input, select, textarea):not([disabled], [type="hidden"]), .ruas-dialog-kaki button:not([disabled])')?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);
  return h('dialog', {
    ref, className: cx('ruas-dialog', `ruas-dialog-${size}`, tone !== 'default' && `ruas-dialog-${tone}`, className),
    'aria-labelledby': judulId, 'aria-describedby': description ? deskId : undefined,
    onCancel: e => { e.preventDefault(); if (dismissible) onClose?.(); },
    onClose: () => { if (open) onClose?.(); }, // Esc kedua di Chrome tidak bisa dicegah: samakan status
    onMouseDown: e => { turun.current = e.target === e.currentTarget; },
    onClick: e => { if (dismissible && turun.current && e.target === e.currentTarget) onClose?.(); },
    ...p,
  }, open && h(onSubmit ? 'form' : 'div', { className: 'ruas-dialog-kotak', onSubmit },
    h('header', { className: 'ruas-dialog-kepala' },
      icon && h('span', { className: 'ruas-dialog-ikon', 'aria-hidden': true }, icon),
      h('div', { className: 'ruas-dialog-teks' },
        h('h2', { id: judulId, className: 'ruas-dialog-judul' }, title),
        description && h('p', { id: deskId, className: 'ruas-dialog-desk' }, description)),
      dismissible && h(Button, { variant: 'ghost', size: 'sm', icon: h(Close, { size: 18 }), 'aria-label': L.tutup, title: L.tutup, onClick: onClose })),
    h('div', { className: 'ruas-dialog-isi' },
      alert && h('p', { className: 'ruas-galat ruas-dialog-galat', role: 'alert' }, h(TriangleAlert, { size: 16 }), alert),
      children),
    footer && h('footer', { className: 'ruas-dialog-kaki' }, footer)));
}

// Kotak pesan (pengumuman/status). tone 'danger' dan 'warning' dibacakan segera (role=alert).
export function Alert({ tone = 'info', icon, title, aside, children, className, ...p }) {
  return h('div', { role: tone === 'danger' || tone === 'warning' ? 'alert' : 'status', className: cx('ruas-alert', `ruas-alert-${tone}`, className), ...p },
    icon && h('span', { className: 'ruas-alert-ikon', 'aria-hidden': true }, icon),
    h('div', { className: 'ruas-alert-teks' }, title && h('p', { className: 'ruas-alert-judul' }, title), children),
    aside && h('div', { className: 'ruas-alert-samping' }, aside));
}

// Kartu angka ringkas (KPI). `action` = tautan/tombol di kaki kartu, mis. <Link> dari Next.js.
// delta = perubahan dalam persen dibanding periode lalu (ikon + teks, bukan warna saja); invert = turun itu baik (mis. biaya).
// trend = deret angka untuk garis tren mini.
export function Stat({ label, value, hint, icon, tone = 'default', action, delta, deltaLabel, invert, trend, labels, className, ...p }) {
  const L = { ...LABEL, ...labels };
  const arah = delta > 0 ? 'naik' : delta < 0 ? 'turun' : 'tetap';
  const baik = invert ? delta < 0 : delta > 0;
  return h('div', { className: cx('ruas-stat', tone !== 'default' && `ruas-stat-${tone}`, className), ...p },
    h('div', { className: 'ruas-stat-kepala' }, h('p', { className: 'ruas-stat-label' }, label), icon && h('span', { className: 'ruas-stat-ikon', 'aria-hidden': true }, icon)),
    h('p', { className: 'ruas-stat-nilai' }, value),
    typeof delta === 'number' && h('p', { className: cx('ruas-stat-delta', delta !== 0 && (baik ? 'ruas-delta-baik' : 'ruas-delta-buruk')) },
      h(delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus, { size: 15, 'aria-hidden': true }),
      h('span', { className: 'ruas-sr' }, `${L[arah]} `),
      h('b', null, `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${Math.abs(delta).toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`),
      deltaLabel && h('span', null, deltaLabel)),
    hint && h('p', { className: 'ruas-stat-hint' }, hint),
    trend?.length > 1 && h('div', { className: 'ruas-stat-tren', 'aria-hidden': true }, h(Sparkline, { data: trend, height: 30 })),
    action && h('div', { className: 'ruas-stat-aksi' }, action));
}

const nilai = (c, r) => (c.value ? c.value(r) : r[c.key]);
// Elemen React/objek lain tidak ikut dicari (bukan "[object Object]"); tanggal dicari dalam format Indonesia.
const teks = x => (x == null || (typeof x === 'object' && !(x instanceof Date)) ? '' : x instanceof Date ? x.toLocaleDateString('id-ID') : String(x)).toLowerCase();
const opsi = o => (typeof o === 'object' ? o : { value: o, label: o });
const banding = (a, b) => (typeof a === 'number' && typeof b === 'number') || (a instanceof Date && b instanceof Date)
  ? a - b : String(a).localeCompare(String(b), 'id', { numeric: true, sensitivity: 'base' });
const tampilNilai = x => (typeof x === 'number' ? angka(x) : x instanceof Date ? x.toLocaleDateString('id-ID') : x);

// Olah data di browser: saring per kolom + cari semua kolom, lalu urutkan (kosong selalu di akhir).
export function applyTableState(rows, columns, { q = '', filters = {}, sort = null } = {}) {
  const kata = teks(q).split(/\s+/).filter(Boolean);
  const saring = columns.filter(c => filters[c.key] != null && filters[c.key] !== '');
  let hasil = rows.filter(r => saring.every(c => c.options
    ? String(nilai(c, r)) === String(filters[c.key])
    : teks(nilai(c, r)).includes(teks(filters[c.key])))
    && (!kata.length || (s => kata.every(k => s.includes(k)))(columns.map(c => teks(nilai(c, r))).join(' '))));
  const c = sort && columns.find(x => x.key === sort.key);
  if (c) {
    const arah = sort.dir === 'desc' ? -1 : 1;
    hasil = [...hasil].sort((a, b) => {
      const x = nilai(c, a), y = nilai(c, b);
      if (x == null || x === '' || y == null || y === '') return (x == null || x === '') - (y == null || y === '');
      return arah * banding(x, y);
    });
  }
  return hasil;
}

// Lapisan melayang dari popover bawaan browser: di lapisan atas (tidak terpotong overflow tabel/modal), Esc & klik di luar menutup.
// popover="auto" + pemicu = tombol pembuka asli (fokus kembali ke pemicu). Letak mengikuti pemicu; tersembunyi sampai letaknya dihitung.
function useLayang({ akhir = false, selebar = false } = {}) {
  const pemicu = useRef(null), layang = useRef(null);
  const [buka, setBuka] = useState(false);
  useEffect(() => {
    const el = layang.current, p = pemicu.current;
    if (!el?.showPopover) return;
    if (el.popover === 'auto' && p) p.popoverTargetElement = el;
    const letak = () => {
      const t = pemicu.current?.getBoundingClientRect();
      if (!t) return;
      if (selebar) el.style.width = `${t.width}px`;
      const w = el.offsetWidth, tg = el.offsetHeight;
      const kanan = akhir !== rtl(pemicu.current);
      el.style.left = `${Math.max(8, Math.min(kanan ? t.right - w : t.left, innerWidth - w - 8))}px`;
      el.style.top = `${t.bottom + 4 + tg > innerHeight && t.top - 4 - tg > 0 ? t.top - 4 - tg : t.bottom + 4}px`;
      el.dataset.letak = '';
    };
    const lepas = () => { removeEventListener('scroll', letak, true); removeEventListener('resize', letak); };
    const ganti = e => {
      const b = e.newState === 'open';
      setBuka(b);
      if (b) { letak(); addEventListener('scroll', letak, true); addEventListener('resize', letak); } else { delete el.dataset.letak; lepas(); }
    };
    el.addEventListener('toggle', ganti);
    return () => { el.removeEventListener('toggle', ganti); lepas(); };
  }, []);
  return { pemicu, layang, buka };
}

// Menu aksi (mis. "⋯" per baris): panah atas/bawah, Home/End, Enter; Esc/klik di luar menutup.
// items: [{ label, icon, onSelect, tone: 'danger', disabled }] dan '-' untuk garis pemisah.
export function Menu({ label, icon, items, align = 'end', variant = 'ghost', size = 'sm', children, labels, className }) {
  const L = { ...LABEL, ...labels };
  const id = useId();
  const { pemicu, layang, buka } = useLayang({ akhir: align === 'end' });
  const butir = () => [...(layang.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || [])];
  useEffect(() => { if (buka) butir()[0]?.focus(); }, [buka]);
  const geser = e => {
    const b = butir(), i = b.indexOf(document.activeElement);
    const ke = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: b.length - 1 }[e.key];
    if (e.key === 'Tab') layang.current.hidePopover();
    if (ke === undefined || !b.length) return;
    e.preventDefault();
    b[(ke + b.length) % b.length].focus();
  };
  const nama = label ?? L.aksi;
  return h(Fragment, null,
    h(Button, { ref: pemicu, variant, size, icon: icon === undefined ? h(DotsHorizontal, { size: 16 }) : icon, 'aria-label': children ? undefined : nama, title: children ? undefined : nama, 'aria-haspopup': 'menu', 'aria-expanded': buka, 'aria-controls': id, className }, children),
    h('div', { ref: layang, id, popover: 'auto', role: 'menu', 'aria-label': nama, className: 'ruas-layang ruas-menu', onKeyDown: geser },
      items.filter(Boolean).map((x, i) => x === '-'
        ? h('div', { key: i, role: 'separator', className: 'ruas-menu-garis' })
        : h('button', {
          key: i, type: 'button', role: 'menuitem', tabIndex: -1, disabled: x.disabled, className: cx('ruas-menu-butir', x.tone === 'danger' && 'ruas-menu-bahaya'),
          onClick: () => { layang.current.hidePopover(); x.onSelect?.(); },
        }, x.icon, h('span', null, x.label), x.hint && h('kbd', null, x.hint)))));
}

// Tampil/sembunyikan kolom tabel; minimal satu kolom tetap tampil.
function PilihKolom({ columns, sembunyi, alih, L }) {
  const id = useId();
  const { pemicu, layang, buka } = useLayang({ akhir: true });
  useEffect(() => { if (buka) layang.current.querySelector('input:not(:disabled)')?.focus(); }, [buka]);
  const tampil = columns.length - sembunyi.size;
  return h(Fragment, null,
    h(Button, { ref: pemicu, size: 'sm', variant: 'ghost', icon: h(Eye, { size: 16 }), 'aria-expanded': buka, 'aria-controls': id }, L.kolom, sembunyi.size ? h('span', { className: 'ruas-tab-badge' }, `${tampil}/${columns.length}`) : null),
    h('div', { ref: layang, id, popover: 'auto', role: 'group', 'aria-label': L.tampilkanKolom, className: 'ruas-layang ruas-layang-kolom' },
      h('p', { className: 'ruas-label' }, L.tampilkanKolom),
      columns.map(c => h(Checkbox, {
        key: c.key, label: c.label, checked: !sembunyi.has(c.key),
        disabled: c.hideable === false || (tampil === 1 && !sembunyi.has(c.key)), onChange: () => alih(c.key),
      }))));
}

// CSV pemisah titik koma (Excel berbahasa Indonesia), BOM UTF-8. Teks berawalan = + - @ diberi ' agar tidak dijalankan sebagai rumus.
const selCsv = x => {
  let s = x == null || (typeof x === 'object' && !(x instanceof Date)) ? '' : x instanceof Date ? x.toLocaleDateString('id-ID') : String(x);
  if (typeof x === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const toCsv = (rows, columns) => [columns.map(c => selCsv(c.label)), ...rows.map(r => columns.map(c => selCsv(c.csv ? c.csv(r) : nilai(c, r))))]
  .map(b => b.join(';')).join('\r\n');
export function downloadFile(nama, isi, type = 'text/csv;charset=utf-8') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([type.startsWith('text/csv') ? '﻿' + isi : isi], { type }));
  a.download = nama;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// Tabel standar: kontainer Ringkasan/Saringan/Daftar, urut per kolom, baris saring di bawah judul, nomor urut, paginasi, cetak.
// Mode server: beri `total` (jumlah hasil saringan) dan `onStateChange`; `rows` cukup baris halaman yang tampil.
// Kolom exportable: false (mis. tombol aksi) tidak ikut CSV maupun cetak.
const takCetak = c => (c.exportable === false ? 'ruas-tak-cetak' : undefined);

export function DataTable({
  title, columns, rows = [], rowKey, summary, actions, total, grandTotal, onStateChange, fetchAllRows, loading,
  detail, footer, filters, filtersActive = 0, onClearFilters, filterLabels = 'side', printHeader, printFooter, rowClassName, defaultDetailOpen, searchable = true,
  selectable, bulkActions, onSelectionChange, columnToggle, exportable, exportName, maxHeight,
  pageSizes = [10, 25, 50, 100], defaultPageSize, defaultOpen = true, emptyText, labels, className,
}) {
  const L = { ...LABEL, ...labels };
  const server = typeof total === 'number';
  const [st, setSt] = useState(() => ({ q: '', filters: {}, sort: null, page: 1, pageSize: defaultPageSize ?? pageSizes[0] }));
  const [cetak, setCetak] = useState(null);
  const [galatCetak, setGalatCetak] = useState('');
  const daftar = useRef(null);
  const tunda = useRef();
  const [buka, setBuka] = useState(() => new Set());
  const [sembunyi, setSembunyi] = useState(() => new Set(columns.filter(c => c.hidden).map(c => c.key)));
  const [pilih, setPilih] = useState(() => new Set());
  const tampil = columns.filter(c => !sembunyi.has(c.key));
  const ubahPilih = s => { setPilih(s); onSelectionChange?.([...s]); };

  const olah = useMemo(() => (server ? rows : applyTableState(rows, columns, st)), [server, rows, columns, st.q, st.filters, st.sort]);
  const n = server ? total : olah.length;
  const semua = grandTotal ?? (server ? total : rows.length);
  const halMaks = Math.max(1, Math.ceil(n / st.pageSize));
  const hal = Math.min(st.page, halMaks);
  const awal = (hal - 1) * st.pageSize;
  const baris = cetak ?? (server ? rows : olah.slice(awal, awal + st.pageSize));
  const noAwal = cetak ? 0 : awal;
  const nSaring = (st.q ? 1 : 0) + Object.values(st.filters).filter(v => v != null && v !== '').length + filtersActive;

  // Dipanggil saat mulai dan setiap perubahan; di mode server ditunda 250 ms agar mengetik tidak membanjiri server.
  useEffect(() => {
    if (!onStateChange) return;
    tunda.current = setTimeout(() => onStateChange({ ...st, page: hal }), server ? 250 : 0);
    return () => clearTimeout(tunda.current);
  }, [st]);
  useEffect(() => { if (cetak) printElement(daftar.current, () => setCetak(null)); }, [cetak]);

  const ubah = patch => setSt(s => ({ ...s, ...patch, page: 1 }));
  const saring = (k, v) => setSt(s => ({ ...s, filters: { ...s.filters, [k]: v }, page: 1 }));
  const urut = k => setSt(s => ({ ...s, page: 1, sort: s.sort?.key !== k ? { key: k, dir: 'asc' } : s.sort.dir === 'asc' ? { key: k, dir: 'desc' } : null }));
  const cetakSaringan = async () => {
    setGalatCetak('');
    try { setCetak(server ? await fetchAllRows(st) : olah); } catch { setGalatCetak(L.gagalCetak); }
  };
  const unduhCsv = async () => {
    setGalatCetak('');
    try {
      const rs = server ? await fetchAllRows(st) : olah;
      const nama = String(exportName ?? (typeof title === 'string' ? title : 'data')).replace(/[\\/:*?"<>|]+/g, '-').trim() || 'data';
      downloadFile(`${nama}.csv`, toCsv(rs, tampil.filter(c => c.exportable !== false)));
    } catch { setGalatCetak(L.gagalUnduh); }
  };
  const kunci = (r, i) => (typeof rowKey === 'function' ? rowKey(r) : rowKey ? r[rowKey] : i);
  // Rincian terbuka otomatis setiap data berganti (butuh rowKey), mis. akun yang dipilih lewat saringan.
  useEffect(() => {
    if (!detail || !defaultDetailOpen) return;
    const pilih = typeof defaultDetailOpen === 'function' ? defaultDetailOpen : () => true;
    setBuka(new Set(rows.filter(pilih).map((r, i) => kunci(r, i))));
  }, [rows]);
  const arahUrut = k => (st.sort?.key !== k ? 'none' : st.sort.dir === 'asc' ? 'ascending' : 'descending');
  const ikonUrut = k => h(st.sort?.key !== k ? Sort : st.sort.dir === 'asc' ? ChevronUp : ChevronDown, { size: 14 });
  const adaSaring = tampil.some(c => c.filter);
  const lebar = tampil.length + 1 + (detail ? 1 : 0) + (selectable ? 1 : 0);
  const kunciHal = baris.map((r, i) => kunci(r, noAwal + i));
  const semuaBuka = kunciHal.length > 0 && kunciHal.every(k => buka.has(k));
  const alih = k => setBuka(b => { const x = new Set(b); x.has(k) ? x.delete(k) : x.add(k); return x; });
  const halPenuh = kunciHal.length > 0 && kunciHal.every(k => pilih.has(k));
  const halSebagian = !halPenuh && kunciHal.some(k => pilih.has(k));
  const centang = (props, sel = 'td') => selectable && h(sel, { className: 'ruas-centang-sel ruas-noprint', scope: sel === 'th' ? 'col' : undefined },
    props && h('span', { className: 'ruas-pilih' }, h('input', { type: 'checkbox', ...props })));
  const kosongSel = () => [detail && h('td', { key: 'b', className: 'ruas-buka' }), selectable && h('td', { key: 'c', className: 'ruas-centang-sel ruas-noprint' }), h('td', { key: 'n', className: 'ruas-no' })];

  const kepala = h('thead', null,
    h('tr', null,
      detail && h('th', { scope: 'col', className: 'ruas-buka' }, h('span', { className: 'ruas-sr' }, L.bukaRincian)),
      centang({
        'aria-label': L.pilihHalaman, title: L.pilihHalaman, checked: halPenuh, disabled: !kunciHal.length,
        ref: el => { if (el) el.indeterminate = halSebagian; },
        onChange: () => { const s = new Set(pilih); kunciHal.forEach(k => (halPenuh ? s.delete(k) : s.add(k))); ubahPilih(s); },
      }, 'th'),
      h('th', { scope: 'col', className: 'ruas-no' }, L.no),
      tampil.map(c => h('th', { key: c.key, scope: 'col', className: takCetak(c), 'aria-sort': c.sortable ? arahUrut(c.key) : undefined, style: { textAlign: rata(c.align), width: c.width } },
        c.sortable ? h('button', { type: 'button', className: 'ruas-urut', title: L.urutkan(c.label), onClick: () => urut(c.key) }, c.label, ikonUrut(c.key)) : c.label))),
    adaSaring && h('tr', { className: 'ruas-saring-baris ruas-noprint' },
      kosongSel(),
      tampil.map(c => h('td', { key: c.key, className: takCetak(c) }, c.filter && (c.options
        ? h('div', { className: 'ruas-select' },
          h('select', { className: 'ruas-input ruas-input-kecil', 'aria-label': L.saringKolom(c.label), value: st.filters[c.key] ?? '', onChange: e => saring(c.key, e.target.value) },
            h('option', { value: '' }, L.semua), c.options.map(o => h('option', { key: opsi(o).value, value: opsi(o).value }, opsi(o).label))),
          h(ChevronDown, { size: 16 }))
        : h('input', { type: 'search', className: 'ruas-input ruas-input-kecil', 'aria-label': L.saringKolom(c.label), placeholder: L.saringKolom(c.label), value: st.filters[c.key] ?? '', onChange: e => saring(c.key, e.target.value) }))))));
  // Memuat tanpa baris = kerangka abu-abu seukuran halaman (maks. 5 baris) agar tata letak tidak meloncat.
  const kerangka = () => Array.from({ length: Math.min(st.pageSize, 5) }, (_, i) => h('tr', { key: i, 'aria-hidden': true },
    kosongSel(), tampil.map(c => h('td', { key: c.key, className: takCetak(c) }, h(Skeleton, { width: `${55 + ((i * 17 + c.key.length * 7) % 40)}%` })))));
  const badan = h('tbody', null,
    loading && !baris.length ? kerangka()
      : !baris.length ? h('tr', null, h('td', { colSpan: lebar, className: 'ruas-kosong' }, nSaring ? L.kosong : emptyText ?? L.kosongAwal))
        : baris.map((r, i) => {
          const k = kunciHal[i], terbuka = detail && buka.has(k), dipilih = selectable && pilih.has(k);
          return h(Fragment, { key: k },
            h('tr', { className: cx(terbuka && 'ruas-terbuka', dipilih && 'ruas-dipilih', rowClassName?.(r)) || undefined },
              detail && h('td', { className: 'ruas-buka' }, h('button', { type: 'button', className: 'ruas-buka-btn ruas-noprint', 'aria-expanded': !!terbuka, 'aria-label': terbuka ? L.gulungRincian : L.bukaRincian, title: terbuka ? L.gulungRincian : L.bukaRincian, onClick: () => alih(k) }, h(terbuka ? ChevronDown : ChevronRight, { size: 16 }))),
              centang({ 'aria-label': L.pilihBaris(noAwal + i + 1), checked: !!dipilih, onChange: () => { const s = new Set(pilih); s.has(k) ? s.delete(k) : s.add(k); ubahPilih(s); } }),
              h('td', { className: 'ruas-no' }, angka(noAwal + i + 1)),
              tampil.map(c => h('td', { key: c.key, className: takCetak(c), style: { textAlign: rata(c.align) } }, c.render ? c.render(r) : tampilNilai(nilai(c, r))))),
            terbuka && h('tr', { className: 'ruas-rincian' }, h('td', { colSpan: lebar }, detail(r))));
        }));
  const sel = footer && baris.length ? footer(server ? rows : olah) : null;
  const kaki = sel && h('tfoot', null, [].concat(sel).map((b, i) => h('tr', { key: i },
    kosongSel(),
    tampil.map(c => h('td', { key: c.key, className: takCetak(c), style: { textAlign: rata(c.align) } }, b[c.key] ?? null)))));
  const bilahPilih = selectable && pilih.size > 0 && h('div', { className: 'ruas-bilah-pilih ruas-noprint' },
    h('span', { className: 'ruas-bilah-jumlah' }, h(Check, { size: 16 }), L.dipilih(pilih.size)),
    h('div', { className: 'ruas-alat' }, bulkActions?.([...pilih], () => ubahPilih(new Set())),
      h(Button, { size: 'sm', variant: 'ghost', icon: h(Close, { size: 16 }), onClick: () => ubahPilih(new Set()) }, L.batalPilih)));
  const paging = h('div', { className: 'ruas-paging ruas-noprint' },
    h('span', { 'aria-live': 'polite' }, n ? L.rentang(awal + 1, Math.min(awal + st.pageSize, n), n) : L.jumlah(0, 0)),
    h('div', { className: 'ruas-paging-kanan' },
      h('label', null, L.barisPerHalaman, h('span', { className: 'ruas-select' },
        h('select', { className: 'ruas-input ruas-input-kecil', value: st.pageSize, onChange: e => ubah({ pageSize: +e.target.value }) },
          pageSizes.map(x => h('option', { key: x, value: x }, x))),
        h(ChevronDown, { size: 16 }))),
      h(Button, { size: 'sm', icon: h(ChevronLeft, { size: 16 }), disabled: hal <= 1, onClick: () => setSt(s => ({ ...s, page: hal - 1 })) }, L.sebelumnya),
      h('span', null, L.halaman(hal, halMaks)),
      h(Button, { size: 'sm', disabled: hal >= halMaks, onClick: () => setSt(s => ({ ...s, page: hal + 1 })) }, L.berikutnya, h(ChevronRight, { size: 16 }))));
  const tombolCetak = h('div', { className: 'ruas-alat' },
    detail && h(Button, { size: 'sm', variant: 'ghost', icon: h(semuaBuka ? ChevronUp : ChevronDown, { size: 16 }), disabled: !baris.length, 'aria-pressed': semuaBuka, onClick: () => setBuka(semuaBuka ? new Set() : new Set(kunciHal)) }, semuaBuka ? L.gulungSemuaRincian : L.bukaSemuaRincian),
    columnToggle && h(PilihKolom, { columns, sembunyi, L, alih: k => setSembunyi(s => { const x = new Set(s); x.has(k) ? x.delete(k) : x.add(k); return x; }) }),
    exportable && (!server || fetchAllRows) && h(Button, { size: 'sm', variant: 'ghost', icon: h(Download, { size: 16 }), disabled: !n, onClick: unduhCsv }, L.unduhCsv),
    h(Button, { size: 'sm', variant: 'ghost', icon: h(Printer, { size: 16 }), disabled: !baris.length, onClick: () => printElement(daftar.current) }, L.cetakHalaman),
    (!server || fetchAllRows) && h(Button, { size: 'sm', variant: 'ghost', icon: h(Printer, { size: 16 }), disabled: !n, onClick: cetakSaringan }, L.cetakSaringan));

  return h(Section, { title, meta: L.jumlah(n, semua), actions, defaultOpen, className: cx('ruas-datatable', className) },
    h(SectionGroup, { labels },
      summary && h(Section, { title: L.ringkasan, level: 4, className: 'ruas-noprint' }, summary),
      h(Section, { title: L.saringan, meta: nSaring ? L.saringanAktif(nSaring) : null, level: 4, className: 'ruas-noprint' },
        // Satu baris: saringan aplikasi, Cari, Hapus saringan (membungkus di layar sempit); label di kiri isian atau di atasnya.
        h('div', { className: cx('ruas-saringan', filterLabels === 'top' ? 'ruas-saringan-atas' : 'ruas-saringan-samping') },
          filters,
          searchable && h(Input, { type: 'search', label: L.cari, placeholder: L.cariContoh, value: st.q, onChange: e => ubah({ q: e.target.value }), fieldClassName: 'ruas-saringan-cari' }),
          h(Button, { icon: h(Close, { size: 16 }), disabled: !nSaring, onClick: () => { ubah({ q: '', filters: {} }); onClearFilters?.(); } }, L.hapusSaringan))),
      h('div', { ref: daftar },
        printHeader && h('div', { className: 'ruas-cetak-saja' }, printHeader),
        h(Section, { title: L.daftar, meta: n ? L.rentang(awal + 1, Math.min(awal + st.pageSize, n), n) : null, level: 4, actions: tombolCetak },
          galatCetak && h('p', { className: 'ruas-galat', role: 'alert' }, h(TriangleAlert, { size: 16 }), galatCetak),
          selectable && h('p', { className: 'ruas-sr', 'aria-live': 'polite' }, pilih.size ? L.dipilih(pilih.size) : ''),
          bilahPilih,
          loading && h('p', { className: 'ruas-sr', role: 'status' }, L.memuat),
          h('div', { className: 'ruas-tabel-gulir', style: maxHeight ? { maxHeight, overflowY: 'auto' } : undefined },
            h('table', { className: 'ruas-tabel', 'aria-busy': loading || undefined }, kepala, badan, kaki)),
          paging),
        printFooter && h('div', { className: 'ruas-cetak-saja' }, printFooter))));
}

/* ───────────── Kerangka dasbor ───────────── */

// Kerangka dasbor: menu samping (bisa diciutkan jadi ikon saja, diingat di browser; di HP menjadi laci), bilah atas, isi.
// nav: [{ title?, items: [{ href, label, icon, badge, active, onClick }] }]. linkAs = komponen tautan, mis. Link dari next/link.
export function AppShell({ brand, nav = [], header, actions, footer, children, linkAs = 'a', defaultCollapsed = false, labels, className }) {
  const L = { ...LABEL, ...labels };
  const navId = useId();
  const [ciut, setCiut] = useState(defaultCollapsed);
  const [laci, setLaci] = useState(false);
  const tombolLaci = useRef(null), samping = useRef(null), utama = useRef(null);
  useEffect(() => { try { const s = localStorage.getItem('ruas-ui-ciut'); if (s) setCiut(s === '1'); } catch {} }, []);
  const ciutkan = () => setCiut(c => { try { localStorage.setItem('ruas-ui-ciut', c ? '0' : '1'); } catch {} return !c; });
  // Laci terbuka: isi di belakang tidak bisa difokus (inert), Esc menutup dan fokus kembali ke tombol menu.
  useEffect(() => {
    if (utama.current) utama.current.inert = laci;
    if (!laci) return;
    samping.current?.querySelector('a[href], button')?.focus();
    const esc = e => { if (e.key === 'Escape') { setLaci(false); tombolLaci.current?.focus(); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [laci]);
  return h('div', { className: cx('ruas-shell', ciut && 'ruas-shell-ciut', laci && 'ruas-shell-laci', className) },
    h('a', { href: '#ruas-isi', className: 'ruas-lewati' }, L.lewati),
    h('aside', { ref: samping, id: navId, className: 'ruas-samping' },
      h('div', { className: 'ruas-merek' }, brand,
        h(Button, { variant: 'ghost', size: 'sm', className: 'ruas-laci-tutup', icon: h(Close, { size: 18 }), 'aria-label': L.tutupMenu, title: L.tutupMenu, onClick: () => { setLaci(false); tombolLaci.current?.focus(); } })),
      h('nav', { 'aria-label': L.navigasi, className: 'ruas-nav' }, nav.map((g, i) => h('div', { key: i, className: 'ruas-nav-grup' },
        g.title && h('p', { className: 'ruas-nav-judul' }, g.title),
        h('ul', null, g.items.map((x, j) => h('li', { key: x.href ?? j },
          h(linkAs, {
            href: x.href, className: 'ruas-nav-butir', 'aria-current': x.active ? 'page' : undefined, title: ciut ? x.label : undefined,
            onClick: e => { setLaci(false); x.onClick?.(e); },
          }, x.icon, h('span', { className: 'ruas-nav-teks' }, x.label), x.badge != null && h('span', { className: 'ruas-nav-badge' }, x.badge)))))))),
      h('button', { type: 'button', className: 'ruas-ciut-btn', 'aria-label': ciut ? L.lebarkanMenu : L.ciutkanMenu, title: ciut ? L.lebarkanMenu : L.ciutkanMenu, onClick: ciutkan },
        h(ChevronLeft, { size: 18 }), h('span', { className: 'ruas-nav-teks' }, L.ciutkanMenu))),
    laci && h('div', { className: 'ruas-tirai', 'aria-hidden': true, onClick: () => setLaci(false) }),
    h('div', { ref: utama, className: 'ruas-utama' },
      h('header', { className: 'ruas-atas' },
        h(Button, { ref: tombolLaci, variant: 'ghost', className: 'ruas-laci-btn', icon: h(IkonMenu, { size: 20 }), 'aria-label': L.bukaMenu, title: L.bukaMenu, 'aria-expanded': laci, 'aria-controls': navId, onClick: () => setLaci(true) }),
        h('div', { className: 'ruas-atas-isi' }, header),
        actions && h('div', { className: 'ruas-atas-aksi' }, actions)),
      h('main', { id: 'ruas-isi', tabIndex: -1, className: 'ruas-isi' }, children),
      footer && h('footer', { className: 'ruas-kaki' }, footer)));
}

// Jejak halaman (breadcrumb). Butir terakhir = halaman ini (aria-current).
export function Breadcrumb({ items, linkAs = 'a', labels, className }) {
  const L = { ...LABEL, ...labels };
  return h('nav', { 'aria-label': L.jejak, className: cx('ruas-jejak', className) }, h('ol', null, items.map((x, i) => {
    const akhir = i === items.length - 1;
    return h('li', { key: i }, akhir || !x.href ? h('span', { 'aria-current': akhir ? 'page' : undefined }, x.label) : h(linkAs, { href: x.href }, x.label));
  })));
}

// Pemberitahuan singkat (toast). Bungkus aplikasi dengan <ToastProvider>, lalu const toast = useToast(); toast({ title, tone }).
// Wadah memakai popover="manual" (lapisan atas) agar tetap terlihat di atas modal. Hilang sendiri setelah 5 detik
// (jeda saat disorot/difokus); tone 'danger' tetap tampil sampai ditutup. Teks dibacakan lewat wilayah aria-live.
const Roti = createContext(null);
const IKON_NADA = { success: CircleCheck, warning: TriangleAlert, danger: CircleX, info: Info };
function SatuToast({ t, tutup, L }) {
  const [jeda, setJeda] = useState(false);
  const lama = t.duration ?? (t.tone === 'danger' ? Infinity : 5000);
  useEffect(() => {
    if (jeda || !Number.isFinite(lama)) return;
    const w = setTimeout(() => tutup(t.id), lama);
    return () => clearTimeout(w);
  }, [jeda]);
  return h('div', {
    className: cx('ruas-toast', `ruas-toast-${t.tone}`),
    onMouseEnter: () => setJeda(true), onMouseLeave: () => setJeda(false), onFocus: () => setJeda(true), onBlur: () => setJeda(false),
  },
  h('span', { className: 'ruas-toast-ikon', 'aria-hidden': true }, h(IKON_NADA[t.tone] || Info, { size: 18 })),
  h('div', { className: 'ruas-toast-teks' },
    t.title && h('p', { className: 'ruas-toast-judul' }, t.title),
    t.description && h('p', null, t.description),
    t.action && h('div', { className: 'ruas-toast-aksi' }, t.action)),
  h(Button, { variant: 'ghost', size: 'sm', icon: h(Close, { size: 16 }), 'aria-label': L.tutup, title: L.tutup, onClick: () => tutup(t.id) }));
}
export function ToastProvider({ children, labels }) {
  const L = { ...LABEL, ...labels };
  const [daftar, setDaftar] = useState([]);
  const [umum, setUmum] = useState(['', '']);
  const wadah = useRef(null);
  const tutup = useCallback(id => setDaftar(d => d.filter(x => x.id !== id)), []);
  const toast = useCallback(t => {
    const x = { id: `${Date.now()}-${Math.random()}`, tone: 'info', ...(typeof t === 'string' ? { title: t } : t) };
    setDaftar(d => [...d, x].slice(-5));
    const ucap = [x.title, x.description].filter(s => typeof s === 'string').join('. ');
    setUmum(x.tone === 'danger' ? ['', ucap] : [ucap, '']);
    return x.id;
  }, []);
  useEffect(() => {
    const el = wadah.current;
    if (!el?.showPopover) return;
    const terbuka = el.matches(':popover-open');
    if (!daftar.length) { if (terbuka) el.hidePopover(); return; }
    if (el.contains(document.activeElement)) return;
    if (terbuka) el.hidePopover();
    el.showPopover(); // tampil ulang = naik ke atas modal yang dibuka belakangan
  }, [daftar]);
  return h(Roti.Provider, { value: toast }, children,
    h('div', { ref: wadah, popover: 'manual', role: 'region', 'aria-label': L.pemberitahuan, className: 'ruas-toasts' },
      daftar.map(t => h(SatuToast, { key: t.id, t, tutup, L }))),
    h('p', { className: 'ruas-sr', 'aria-live': 'polite' }, umum[0]),
    h('p', { className: 'ruas-sr', role: 'alert' }, umum[1]));
}
export function useToast() {
  const t = useContext(Roti);
  if (!t) throw new Error('useToast harus dipakai di dalam <ToastProvider>.');
  return t;
}

// Palet perintah (Ctrl+K / ⌘K): cari halaman atau aksi, panah atas/bawah, Enter, Esc.
// items: [{ id, label, group, icon, keywords, hint, onSelect }]; untuk pindah halaman, onSelect memanggil router.
export function CommandPalette({ items, open, onOpenChange, shortcut = true, placeholder, limit = 50, labels }) {
  const L = { ...LABEL, ...labels };
  const id = useId();
  const ref = useRef(null);
  const [buka, ubahBuka] = useNilai(open, false, onOpenChange);
  const [q, setQ] = useState('');
  const [aktif, setAktif] = useState(0);
  const kini = useRef();
  kini.current = { buka, ubahBuka };
  useEffect(() => {
    if (!shortcut) return;
    const f = e => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); kini.current.ubahBuka(!kini.current.buka); }
    };
    addEventListener('keydown', f);
    return () => removeEventListener('keydown', f);
  }, [shortcut]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (buka && !d.open) { setQ(''); setAktif(0); d.showModal(); d.querySelector('input')?.focus(); } else if (!buka && d.open) d.close();
  }, [buka]);
  const kata = teks(q).split(/\s+/).filter(Boolean);
  const hasil = items.filter(x => !x.disabled && kata.every(k => [x.label, x.group, ...(x.keywords || [])].map(teks).join(' ').includes(k))).slice(0, limit);
  const i = Math.max(0, Math.min(aktif, hasil.length - 1));
  useEffect(() => { if (buka) document.getElementById(`${id}-${i}`)?.scrollIntoView({ block: 'nearest' }); }, [i, buka]);
  const pilih = x => { ubahBuka(false); x.onSelect?.(); };
  const tombol = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (hasil.length) setAktif((i + (e.key === 'ArrowDown' ? 1 : -1) + hasil.length) % hasil.length);
    } else if (e.key === 'Enter' && hasil[i]) { e.preventDefault(); pilih(hasil[i]); }
  };
  return h('dialog', {
    ref, className: 'ruas-dialog ruas-dialog-md ruas-palet', 'aria-label': L.palet,
    onCancel: e => { e.preventDefault(); ubahBuka(false); },
    onClose: () => { if (kini.current.buka) ubahBuka(false); },
    onClick: e => { if (e.target === e.currentTarget) ubahBuka(false); },
  }, buka && h('div', { className: 'ruas-dialog-kotak' },
    h('div', { className: 'ruas-palet-cari' }, h(Search, { size: 18 }),
      h('input', {
        className: 'ruas-palet-input', role: 'combobox', 'aria-expanded': true, 'aria-controls': `${id}-l`, 'aria-autocomplete': 'list',
        'aria-activedescendant': hasil[i] ? `${id}-${i}` : undefined, 'aria-label': L.cariPerintah, placeholder: placeholder ?? L.cariPerintah,
        value: q, onChange: e => { setQ(e.target.value); setAktif(0); }, onKeyDown: tombol, spellCheck: false, autoComplete: 'off',
      }),
      h('kbd', null, 'Esc')),
    hasil.length
      ? h('ul', { id: `${id}-l`, role: 'listbox', 'aria-label': L.palet, className: 'ruas-palet-daftar' }, hasil.map((x, j) => h('li', {
        key: x.id ?? j, id: `${id}-${j}`, role: 'option', 'aria-selected': j === i, className: 'ruas-palet-butir',
        onMouseMove: () => { if (j !== i) setAktif(j); }, onClick: () => pilih(x),
      }, x.icon && h('span', { className: 'ruas-palet-ikon', 'aria-hidden': true }, x.icon), h('span', { className: 'ruas-palet-label' }, x.label),
      x.group && h('span', { className: 'ruas-palet-grup' }, x.group), x.hint && h('kbd', null, x.hint))))
      : h('p', { className: 'ruas-palet-kosong' }, L.tanpaHasil),
    h('p', { className: 'ruas-sr', 'aria-live': 'polite' }, L.hasil(hasil.length))));
}

/* ───────────── Isian lanjut ───────────── */

// Pilihan yang bisa dicari (combobox). options: string atau { value, label (teks), disabled }.
// Daftar dibatasi `limit` butir agar ringan; untuk data besar beri onSearch(q) dan isi options dari server.
export const Combobox = forwardRef(function Combobox({
  label, hint, error, required, options = [], value, defaultValue = '', onChange, onSearch, placeholder, emptyText, disabled, name, id, limit = 50, labels, className, fieldClassName,
}, ref) {
  const L = { ...LABEL, ...labels };
  const lid = useId();
  const [v, ubah] = useNilai(value, defaultValue, onChange);
  const [q, setQ] = useState(null); // null = tidak sedang mengetik
  const [aktif, setAktif] = useState(0);
  const { pemicu, layang, buka } = useLayang({ selebar: true });
  const semua = options.map(opsi);
  const terpilih = semua.find(o => String(o.value) === String(v));
  const kata = teks(q ?? '').split(/\s+/).filter(Boolean);
  const cocok = onSearch || !kata.length ? semua : semua.filter(o => kata.every(k => teks(o.label).includes(k)));
  const tampil = cocok.slice(0, limit);
  const i = Math.max(0, Math.min(aktif, tampil.length - 1));
  useEffect(() => { if (buka) document.getElementById(`${lid}-${i}`)?.scrollIntoView({ block: 'nearest' }); }, [i, buka]);
  const bukaL = () => { const el = layang.current; if (el?.showPopover && !el.matches(':popover-open')) el.showPopover(); };
  const tutupL = () => { const el = layang.current; if (el?.matches?.(':popover-open')) el.hidePopover(); setQ(null); };
  const pilih = o => { if (o.disabled) return; ubah(o.value); tutupL(); };
  const tombol = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!buka) { bukaL(); setAktif(Math.max(0, tampil.indexOf(terpilih))); return; }
      if (tampil.length) setAktif((i + (e.key === 'ArrowDown' ? 1 : -1) + tampil.length) % tampil.length);
    } else if (e.key === 'Enter' && buka && tampil[i]) { e.preventDefault(); pilih(tampil[i]); }
    else if (e.key === 'Escape' && buka) { e.preventDefault(); tutupL(); } // juga mencegah modal induk ikut tertutup
  };
  return h(Field, { label, hint, error, id, required, className: fieldClassName }, a => h('div', { ref: pemicu, className: 'ruas-combo' },
    h('input', {
      ref, ...a, className: cx('ruas-input', className), role: 'combobox', 'aria-expanded': buka, 'aria-controls': `${lid}-l`, 'aria-autocomplete': 'list',
      'aria-activedescendant': buka && tampil[i] ? `${lid}-${i}` : undefined, autoComplete: 'off', spellCheck: false, disabled,
      placeholder: placeholder ?? L.pilihOpsi, value: q ?? (terpilih ? String(terpilih.label) : ''),
      onChange: e => { setQ(e.target.value); setAktif(0); bukaL(); onSearch?.(e.target.value); },
      onClick: bukaL, onKeyDown: tombol,
      onBlur: () => { if (q === '') ubah(''); tutupL(); },
    }),
    h(ChevronDown, { size: 18 }),
    name && h('input', { type: 'hidden', name, value: v ?? '' }),
    h('div', { ref: layang, popover: 'manual', className: 'ruas-layang ruas-combo-layang' },
      h('ul', { id: `${lid}-l`, role: 'listbox', 'aria-label': typeof label === 'string' ? label : undefined },
        tampil.length ? tampil.map((o, j) => h('li', {
          key: o.value, id: `${lid}-${j}`, role: 'option', 'aria-selected': o === terpilih, 'aria-disabled': o.disabled || undefined,
          className: cx('ruas-combo-butir', j === i && 'ruas-aktif'),
          onMouseDown: e => e.preventDefault(), onMouseMove: () => { if (j !== i) setAktif(j); }, onClick: () => pilih(o),
        }, h('span', null, o.label), o === terpilih && h(Check, { size: 16 }))) : h('li', { role: 'presentation', className: 'ruas-combo-kosong' }, emptyText ?? L.tanpaHasil),
        cocok.length > tampil.length && h('li', { role: 'presentation', className: 'ruas-combo-kosong' }, L.opsiLagi(cocok.length - tampil.length))))));
});

// Tanggal lokal YYYY-MM-DD (bukan toISOString, yang bergeser ke UTC dan bisa mundur sehari di WIB).
const tgl = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const PRESET = {
  hariIni: d => [d, d],
  tujuhHari: d => [new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6), d],
  // Minggu dimulai Senin: getDay() Minggu = 0 → mundur 6 hari.
  mingguIni: d => [new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7), new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7 + 6)],
  bulanIni: d => [new Date(d.getFullYear(), d.getMonth(), 1), new Date(d.getFullYear(), d.getMonth() + 1, 0)],
  bulanLalu: d => [new Date(d.getFullYear(), d.getMonth() - 1, 1), new Date(d.getFullYear(), d.getMonth(), 0)],
  tahunIni: d => [new Date(d.getFullYear(), 0, 1), new Date(d.getFullYear(), 11, 31)],
  tahunLalu: d => [new Date(d.getFullYear() - 1, 0, 1), new Date(d.getFullYear() - 1, 11, 31)],
};
const PRESET_TOMBOL = ['hariIni', 'tujuhHari', 'bulanIni', 'bulanLalu', 'tahunIni'];
const PRESET_MENU = ['hariIni', 'mingguIni', 'bulanIni', 'tahunIni', 'tahunLalu'];
export const dateRangePreset = (kunci, kini = new Date()) => { const [a, b] = PRESET[kunci](kini); return { from: tgl(a), to: tgl(b) }; };

// Label cetak: "01/10/2026 – 15/10/2026", satu tanggal, atau "Semua tanggal" bila kosong.
const dmy = s => s.split('-').reverse().join('/');
export const dateRangeLabel = ({ from, to }, labels) => !from && !to ? { ...LABEL, ...labels }.semuaTanggal
  : from === to ? dmy(from) : `${from ? dmy(from) : '…'} – ${to ? dmy(to) : '…'}`;

// Pilihan aktif dibaca dari nilai: kosong = semua, sama dengan periode/preset = itu, selain itu = rentang bebas.
const cocokRentang = (v, period, presets) => !v.from && !v.to ? 'semua'
  : period && v.from === period.from && v.to === period.to ? 'periode'
  : presets.find(k => { const p = dateRangePreset(k); return p.from === v.from && p.to === v.to; }) || 'rentang';

// Rentang tanggal. Bawaan: dua <input type="date"> + tombol pilihan cepat. variant="select": satu menu Tanggal
// (Periode, preset, Rentang tanggal…, Semua tanggal); isian Dari–Sampai hanya muncul untuk Rentang tanggal….
// Nilai { from, to } berformat YYYY-MM-DD lokal; Semua = { from: '', to: '' }. onChange(nilai, pilihan).
export function DateRange({ label, hint, error, value, defaultValue = { from: '', to: '' }, onChange, variant, period, periodLabel, presets, min, max, required, disabled, labels, className }) {
  const L = { ...LABEL, ...labels };
  const id = useId();
  const menu = variant === 'select';
  const daftar = presets ?? (menu ? PRESET_MENU : PRESET_TOMBOL);
  const [bebas, setBebas] = useState(false);
  const [v, ubah] = useNilai(value, defaultValue, onChange);
  // Rentang tanggal… tetap terpilih walau isinya kebetulan sama dengan preset (kecuali dikosongkan dari luar).
  const pilihan = bebas && (v.from || v.to) ? 'rentang' : cocokRentang(v, period, daftar || []);
  const salah = v.from && v.to && v.from > v.to ? L.rentangSalah : null;
  if (menu) {
    const pilih = k => {
      setBebas(k === 'rentang');
      // Rentang tanggal… diisi awal dari rentang aktif; dari Semua: periode, atau bulan ini.
      ubah(k === 'semua' ? { from: '', to: '' } : k === 'periode' ? period : k !== 'rentang' ? dateRangePreset(k)
        : v.from && v.to ? v : period ?? dateRangePreset('bulanIni'), k);
    };
    return h('div', { className: cx('ruas-rentang-menu', className) },
      h(Select, { label: label ?? L.tanggal, hint, error, disabled, value: pilihan, onChange: e => pilih(e.target.value), options: [
        period && { value: 'periode', label: periodLabel ?? `${L.periode} (${dateRangeLabel(period, L)})` },
        ...(daftar || []).map(k => ({ value: k, label: L[k] })),
        { value: 'rentang', label: L.rentangTanggal }, { value: 'semua', label: L.semuaTanggal }].filter(Boolean) }),
      pilihan === 'rentang' && h('div', { role: 'group', 'aria-label': L.rentangTanggal, className: 'ruas-rentang-isian' },
        h(Input, { type: 'date', label: L.dari, value: v.from, min, max: v.to || max, disabled, 'aria-invalid': salah ? true : undefined, 'aria-describedby': salah ? `${id}-error` : undefined, onChange: e => ubah({ ...v, from: e.target.value }, 'rentang') }),
        h(Input, { type: 'date', label: L.sampai, value: v.to, min: v.from || min, max, disabled, 'aria-invalid': salah ? true : undefined, 'aria-describedby': salah ? `${id}-error` : undefined, onChange: e => ubah({ ...v, to: e.target.value }, 'rentang') }),
        galat(id, salah)));
  }
  return h(Grup, { id, label, hint, error: error ?? salah, required, className: cx('ruas-rentang', className) },
    h('div', { className: 'ruas-rentang-isian' },
      h(Input, { type: 'date', label: L.dari, value: v.from, min, max: v.to || max, required, disabled, 'aria-invalid': salah ? true : undefined, onChange: e => ubah({ ...v, from: e.target.value }) }),
      h(Input, { type: 'date', label: L.sampai, value: v.to, min: v.from || min, max, required, disabled, 'aria-invalid': salah ? true : undefined, onChange: e => ubah({ ...v, to: e.target.value }) })),
    daftar && daftar.length > 0 && h('div', { className: 'ruas-alat' }, daftar.map(k => {
      const p = dateRangePreset(k);
      return h(Button, { key: k, size: 'sm', disabled, 'aria-pressed': v.from === p.from && v.to === p.to, onClick: () => ubah(p) }, L[k]);
    })));
}

// Isian angka berpemisah ribuan, mis. Rupiah: <NumberInput prefix="Rp" />; bersen: decimals={2}. Nilai = number atau null.
// Format mengikuti locale lewat Intl (id-ID 1.250.000,50 · en-US 1,250,000.50 · fr-FR 1 250 000,50 · en-IN 12,50,000.50),
// selalu angka Latin; angka Arab-Hindi yang diketik dibaca biasa. Kursor tetap di posisi digit yang sama walau pemisah
// bertambah/berkurang. Negatif hanya bila min < 0. Maksimal 15 digit (batas presisi number).
const pemisahAngka = loc => {
  const b = new Intl.NumberFormat(loc, { numberingSystem: 'latn' }).formatToParts(1234567.5);
  return b.find(x => x.type === 'decimal')?.value ?? '.';
};
export const NumberInput = forwardRef(function NumberInput({ value, defaultValue = null, onChange, prefix, suffix, label, hint, error, id, min, decimals = 0, minDecimals = decimals, locale = 'id-ID', className, fieldClassName, onBlur, ...p }, ref) {
  const [v, ubah] = useNilai(value, defaultValue, onChange);
  // Teks selama mengetik, agar "12," dan "12,50" tidak dirapikan menjadi "12" / "12,5" di tengah ketikan.
  const [teks, setTeks] = useState(null);
  const el = useRef(null);
  const kursor = useRef(null);
  const des = useMemo(() => pemisahAngka(locale), [locale]);
  const fmt = useMemo(() => new Intl.NumberFormat(locale, { numberingSystem: 'latn', minimumFractionDigits: minDecimals, maximumFractionDigits: decimals }), [locale, minDecimals, decimals]);
  const fmtBulat = useMemo(() => new Intl.NumberFormat(locale, { numberingSystem: 'latn' }), [locale]);
  const kunci = c => /\d/.test(c) || (decimals > 0 && c === des) || (min < 0 && c === '-');
  const baca = s => {
    const neg = min < 0 && s.trim().startsWith('-');
    const i = decimals > 0 ? s.indexOf(des) : -1;
    const bulat = (i < 0 ? s : s.slice(0, i)).replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 15 - decimals);
    const pecahan = i < 0 ? null : s.slice(i + 1).replace(/\D/g, '').slice(0, decimals);
    return {
      nilai: bulat || pecahan != null ? Number(`${neg ? '-' : ''}${bulat || 0}.${pecahan || 0}`) : null,
      tampil: (neg ? '-' : '') + (bulat ? fmtBulat.format(BigInt(bulat)) : pecahan != null ? '0' : '') + (pecahan != null ? des + pecahan : ''),
    };
  };
  useLayoutEffect(() => {
    const x = el.current;
    if (kursor.current == null || !x) return;
    let i = 0, d = 0;
    while (i < x.value.length && d < kursor.current) { if (kunci(x.value[i])) d++; i++; }
    x.setSelectionRange(i, i);
    kursor.current = null;
  });
  const ganti = e => {
    let s = e.target.value.replace(/[٠-٩]/g, c => c.charCodeAt(0) - 0x660).replace(/[۰-۹]/g, c => c.charCodeAt(0) - 0x6F0);
    let pos = e.target.selectionStart ?? s.length;
    // Titik atau koma yang baru diketik (mis. dari numpad) = pemisah desimal, apa pun locale-nya.
    const ketik = e.nativeEvent?.data;
    if (decimals > 0 && (ketik === '.' || ketik === ',') && ketik !== des && s[pos - 1] === ketik) s = s.slice(0, pos - 1) + des + s.slice(pos);
    // ",5" ditampilkan "0,5": sisipkan nol di sini juga agar kursor tetap di belakang koma.
    if (decimals > 0 && /^\s*-?$/.test(s.slice(0, s.indexOf(des)))) { s = s.replace(des, '0' + des); if (pos > s.indexOf(des) - 1) pos++; }
    kursor.current = [...s.slice(0, pos)].filter(kunci).length;
    const { nilai, tampil } = baca(s);
    setTeks(tampil);
    ubah(nilai);
  };
  // Teks ketikan dipakai selama nilainya sama; bila nilai diubah dari luar atau isian ditinggalkan, tampil format penuh.
  const tampil = teks != null && baca(teks).nilai === v ? teks : v == null ? '' : fmt.format(v);
  return h(Field, { label, hint, error, id, required: p.required, className: fieldClassName }, a => h('div', { className: 'ruas-imbuh' },
    prefix && h('span', { className: 'ruas-imbuh-teks', 'aria-hidden': true }, prefix),
    h('input', { ref: pasangRef(el, ref), ...a, ...p, type: 'text', inputMode: decimals > 0 ? 'decimal' : 'numeric', autoComplete: 'off', className: cx('ruas-input', className), value: tampil, onChange: ganti, onBlur: e => { setTeks(null); onBlur?.(e); } }),
    suffix && h('span', { className: 'ruas-imbuh-teks', 'aria-hidden': true }, suffix)));
});

// Unggah berkas: seret-lepas atau pilih, pratinjau gambar, hapus per berkas. Jenis (accept) dan ukuran (maxSize, byte) diperiksa di browser;
// server tetap wajib memeriksa ulang. Nilai = larik File.
const ukuran = b => (b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toLocaleString('id-ID', { maximumFractionDigits: 1 })} MB`);
const jenisCocok = (f, accept) => !accept || accept.split(',').some(a => {
  a = a.trim().toLowerCase();
  return a.startsWith('.') ? f.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a;
});
function Pratinjau({ file }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file.type.startsWith('image/')) return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url ? h('img', { src: url, alt: '', className: 'ruas-berkas-gambar' }) : h('span', { className: 'ruas-berkas-gambar' }, h(IkonBerkas, { size: 18 }));
}
export function FileDrop({ label, hint, error, accept, multiple, maxSize, value, defaultValue = [], onChange, disabled, required, labels, className }) {
  const L = { ...LABEL, ...labels };
  const id = useId();
  const [v, ubah] = useNilai(value, defaultValue, onChange);
  const [seret, setSeret] = useState(false);
  const [tolak, setTolak] = useState('');
  const tambah = list => {
    const ok = [], salah = [];
    for (const f of list) {
      if (!jenisCocok(f, accept)) salah.push(L.jenisSalah(f.name));
      else if (maxSize && f.size > maxSize) salah.push(L.terlaluBesar(f.name, ukuran(maxSize)));
      else ok.push(f);
    }
    setTolak(salah.join(' '));
    if (ok.length) ubah(multiple ? [...v, ...ok] : ok.slice(0, 1));
  };
  const galatnya = error || tolak;
  const keterangan = [hint, maxSize && L.batasBerkas(ukuran(maxSize))].filter(Boolean);
  return h('div', { className: cx('ruas-field', className) },
    label != null && h('span', { className: 'ruas-label', id: `${id}-l` }, label, required && bintang),
    h('label', {
      className: cx('ruas-unggah', seret && 'ruas-unggah-seret', disabled && 'ruas-unggah-mati'),
      onDragOver: e => { e.preventDefault(); if (!disabled) setSeret(true); },
      onDragLeave: e => { if (!e.currentTarget.contains(e.relatedTarget)) setSeret(false); },
      onDrop: e => { e.preventDefault(); setSeret(false); if (!disabled) tambah([...e.dataTransfer.files]); },
    },
    h('input', {
      type: 'file', className: 'ruas-sr', accept, multiple, disabled, required: required && !v.length,
      'aria-labelledby': label != null ? `${id}-l` : undefined, 'aria-describedby': deskripsi(id, keterangan.length, galatnya), 'aria-invalid': galatnya ? true : undefined,
      onChange: e => { tambah([...e.target.files]); e.target.value = ''; },
    }),
    h(CloudUpload, { size: 28 }),
    h('span', null, L.seretBerkas, ' ', h('u', null, L.pilihBerkas))),
    keterangan.length > 0 && h('p', { id: `${id}-hint`, className: 'ruas-hint' }, keterangan.join(' ')),
    galat(id, galatnya),
    v.length > 0 && h('ul', { className: 'ruas-berkas' }, v.map((f, i) => h('li', { key: `${f.name}-${f.size}-${i}` },
      h(Pratinjau, { file: f }),
      h('span', { className: 'ruas-berkas-nama' }, f.name, h('small', null, ukuran(f.size))),
      h(Button, { variant: 'ghost', size: 'sm', icon: h(Close, { size: 16 }), disabled, 'aria-label': L.hapusBerkas(f.name), title: L.hapusBerkas(f.name), onClick: () => ubah(v.filter((_, j) => j !== i)) })))));
}

// Langkah formulir bertahap. Navigasi tetap milik aplikasi; onStepClick = langkah yang sudah selesai bisa dibuka lagi.
export function Stepper({ steps, current = 0, onStepClick, labels, className }) {
  const L = { ...LABEL, ...labels };
  return h('ol', { className: cx('ruas-langkah', className) }, steps.map((s, i) => {
    const isi = [
      h('span', { key: 'n', className: 'ruas-langkah-no', 'aria-hidden': true }, i < current ? h(Check, { size: 14 }) : i + 1),
      h('span', { key: 't', className: 'ruas-langkah-teks' },
        h('span', { className: 'ruas-sr' }, `${L.langkah(i + 1, steps.length)}${i < current ? `, ${L.selesai}` : ''}: `),
        h('span', { className: 'ruas-langkah-judul' }, s.label), s.hint && h('span', { className: 'ruas-hint' }, s.hint)),
    ];
    return h('li', { key: i, className: `ruas-langkah-${i < current ? 'selesai' : i === current ? 'kini' : 'nanti'}`, 'aria-current': i === current ? 'step' : undefined },
      onStepClick && i < current ? h('button', { type: 'button', onClick: () => onStepClick(i) }, isi) : h('div', null, isi));
  }));
}

/* ───────────── Angka & grafik ───────────── */

// Kerangka abu-abu saat memuat. Dekoratif (aria-hidden); umumkan "Memuat…" di tempat lain bila perlu.
export function Skeleton({ width, height, lines = 1, className }) {
  return lines > 1
    ? h('span', { className: cx('ruas-kerangka-grup', className), 'aria-hidden': true }, Array.from({ length: lines }, (_, i) => h('span', { key: i, className: 'ruas-kerangka', style: { width: i === lines - 1 ? '60%' : width, height } })))
    : h('span', { className: cx('ruas-kerangka', className), 'aria-hidden': true, style: { width, height } });
}

// Tampilan kosong: ikon, judul, penjelasan singkat, satu ajakan (tombol/tautan).
export function EmptyState({ icon, title, description, action, className }) {
  return h('div', { className: cx('ruas-hampa', className) },
    icon && h('span', { className: 'ruas-hampa-ikon', 'aria-hidden': true }, icon),
    h('p', { className: 'ruas-hampa-judul' }, title),
    description && h('p', { className: 'ruas-hint' }, description),
    action && h('div', { className: 'ruas-alat' }, action));
}

// Bilah kemajuan: batang Sudut Daun berisi deretan daun kecil. value null = tak tentu (sekumpulan daun bergerak kiri-kanan);
// active = daun mengalir ke kanan selama proses berjalan (mis. unggah).
export function Progress({ value = 0, max = 100, label, hint, tone = 'default', showValue = true, active, className }) {
  const id = useId();
  const tentu = value != null;
  const persen = tentu && max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return h('div', { className: cx('ruas-progres', tone !== 'default' && `ruas-progres-${tone}`, !tentu && 'ruas-progres-taktentu', active && tentu && persen < 100 && 'ruas-progres-jalan', className) },
    (label != null || (showValue && tentu)) && h('div', { className: 'ruas-progres-kepala' },
      label != null && h('span', { id, className: 'ruas-label' }, label),
      showValue && tentu && h('span', { className: 'ruas-progres-nilai' }, `${angka(Math.round(persen))}%`)),
    h('div', { role: 'progressbar', 'aria-labelledby': label != null ? id : undefined, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': tentu ? value : undefined, className: 'ruas-progres-jalur' },
      h('span', { style: tentu ? { width: `${persen}%` } : undefined })),
    hint && h('p', { className: 'ruas-hint' }, hint));
}

// Equalizer: daun-daun berdiri berisi daun kecil mendatar yang menyala dari bawah. values (0–1 per batang) = level nyata;
// tanpa values = hiasan "sedang diputar" yang bergerak naik-turun (diam bila playing=false atau pengguna memilih kurangi gerak).
export function Equalizer({ values, bars = 5, segments = 8, playing = true, label, height = 48, tone = 'default', labels, className }) {
  const L = { ...LABEL, ...labels };
  const n = Math.max(2, Math.round(segments));
  const nyata = Array.isArray(values);
  const daftar = nyata ? values.map(v => Math.max(0, Math.min(1, Number(v) || 0))) : Array.from({ length: bars }, () => null);
  const tanda = label ?? (nyata ? `${L.level}: ${daftar.map(v => `${Math.round(v * 100)}%`).join(', ')}` : playing ? L.diputar : L.dijeda);
  return h('div', {
    role: 'img', 'aria-label': tanda, className: cx('ruas-eq', tone !== 'default' && `ruas-progres-${tone}`, !nyata && playing && 'ruas-eq-main', className),
    style: { height, '--ruas-eq-n': n },
  }, daftar.map((v, i) => h('span', { key: i, className: 'ruas-eq-batang', style: nyata ? { '--isi': Math.round(v * n) / n } : { '--i': i } },
    h('span', { className: 'ruas-eq-daun' }), h('span', { className: 'ruas-eq-daun ruas-eq-nyala', style: nyata ? undefined : { animationTimingFunction: `steps(${n - 1}, jump-none)` } }))));
}

// Garis tren mini (mis. di kartu Stat). Dekoratif bila di dalam Stat; ringkasan awal → akhir untuk pembaca layar.
export function Sparkline({ data = [], height = 32, label, labels, className }) {
  const L = { ...LABEL, ...labels };
  if (data.length < 2) return null;
  const W = 100, lo = Math.min(...data), hi = Math.max(...data), r = hi - lo || 1;
  const pt = data.map((v, i) => [(i / (data.length - 1)) * W, 2 + (1 - (v - lo) / r) * (height - 4)]);
  const d = pt.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('');
  return h('svg', {
    viewBox: `0 0 ${W} ${height}`, preserveAspectRatio: 'none', height, className: cx('ruas-garis-mini', className),
    role: 'img', 'aria-label': label ?? `${L.tren}: ${angka(data[0])} → ${angka(data[data.length - 1])}`,
  }, h('path', { d: `${d}L${W},${height}L0,${height}Z`, className: 'ruas-garis-mini-area' }), h('path', { d, className: 'ruas-garis-mini-garis', vectorEffect: 'non-scaling-stroke' }));
}

function useLebar(ref, awal = 600) {
  const [w, setW] = useState(awal);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const x = Math.round(e.contentRect.width); if (x > 0) setW(x); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return w;
}
const ringkas = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 });
// Langkah sumbu "bulat" (1/2/2,5/5 × 10ⁿ) untuk ±4 garis bantu; puncak = kelipatan langkah terdekat di atas nilai terbesar.
const langkahBagus = m => { if (!(m > 0)) return 1; const p = 10 ** Math.floor(Math.log10(m)), n = m / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };

// Grafik satu seri berbasis SVG: garis bantu tipis, tooltip saat disorot/disentuh, tombol "Lihat tabel" untuk papan ketik, pembaca layar, dan cetak.
// ponytail: nilai negatif dipotong ke 0 dan hanya satu seri; tambah sumbu nol/legenda bila perlu grafik untung-rugi atau banyak seri.
function Grafik({ jenis, data = [], label, format = angka, height = 220, labels, className }) {
  const L = { ...LABEL, ...labels };
  const kanvas = useRef(null);
  const W = useLebar(kanvas);
  const [sorot, setSorot] = useState(null);
  const [tabel, setTabel] = useState(false);
  const n = data.length;
  const nilaiNya = data.map(d => Math.max(0, Number(d.value) || 0));
  const langkah = langkahBagus(Math.max(0, ...nilaiNya) / 4);
  const maks = Math.max(1, Math.ceil(Math.max(0, ...nilaiNya) / langkah)) * langkah;
  const ki = 44, ka = 10, at = 12, ba = 24, pw = Math.max(1, W - ki - ka), ph = Math.max(1, height - at - ba), dasar = at + ph;
  const pita = pw / Math.max(n, 1);
  const y = v => at + ph - (v / maks) * ph;
  const xt = i => ki + i * pita + pita / 2;
  const tiap = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(pw / 56))));
  const lb = Math.max(2, Math.min(pita * 0.62, 44)), sudut = Math.min(4, lb / 2);
  const tanda = n ? `${label ? `${label}: ` : ''}${n} data, terendah ${format(Math.min(...nilaiNya))}, tertinggi ${format(Math.max(...nilaiNya))}` : label;
  const garis = jenis === 'line' && n ? nilaiNya.map((v, i) => `${i ? 'L' : 'M'}${xt(i).toFixed(1)},${y(v).toFixed(1)}`).join('') : '';
  const s = sorot != null && sorot < n ? sorot : null;
  return h('figure', { className: cx('ruas-grafik', className) },
    h('div', { ref: kanvas, className: 'ruas-grafik-kanvas', style: { height } },
      h('svg', { viewBox: `0 0 ${W} ${height}`, width: '100%', height, role: 'img', 'aria-label': tanda, onPointerLeave: () => setSorot(null) },
        Array.from({ length: Math.round(maks / langkah) + 1 }, (_, k) => k * langkah).map(v => h('g', { key: v },
          h('line', { x1: ki, x2: ki + pw, y1: y(v), y2: y(v), className: v ? 'ruas-grafik-bantu' : 'ruas-grafik-dasar' }),
          h('text', { x: ki - 6, y: y(v), dy: '0.32em', textAnchor: 'end', className: 'ruas-grafik-teks' }, ringkas.format(v)))),
        data.map((d, i) => i % tiap === 0 && h('text', { key: i, x: xt(i), y: height - 6, textAnchor: 'middle', className: 'ruas-grafik-teks' }, d.label)),
        jenis === 'bar' && nilaiNya.map((v, i) => {
          const x = xt(i) - lb / 2, yy = y(v), tg = dasar - yy, r = Math.min(sudut, tg);
          return tg > 0 && h('path', { key: i, className: 'ruas-grafik-batang', 'data-sorot': s === i ? '' : undefined, d: `M${x},${dasar}V${yy + r}Q${x},${yy} ${x + r},${yy}H${x + lb - r}Q${x + lb},${yy} ${x + lb},${yy + r}V${dasar}Z` });
        }),
        jenis === 'line' && n > 0 && h(Fragment, null,
          h('path', { d: `${garis}L${xt(n - 1)},${dasar}L${xt(0)},${dasar}Z`, className: 'ruas-grafik-area' }),
          h('path', { d: garis, className: 'ruas-grafik-garis' }),
          s != null && h('line', { x1: xt(s), x2: xt(s), y1: at, y2: dasar, className: 'ruas-grafik-silang' }),
          s != null && h('circle', { cx: xt(s), cy: y(nilaiNya[s]), r: 4.5, className: 'ruas-grafik-titik' })),
        data.map((_, i) => h('rect', { key: `h${i}`, x: ki + i * pita, y: at, width: pita, height: ph, fill: 'transparent', onPointerEnter: () => setSorot(i), onPointerDown: () => setSorot(i) }))),
      s != null && h('div', {
        className: 'ruas-grafik-tip', 'aria-hidden': true,
        style: { left: Math.max(60, Math.min(xt(s), W - 60)), top: y(nilaiNya[s]) },
      }, h('span', null, data[s].label), h('b', null, format(data[s].value)))),
    h('div', { className: 'ruas-grafik-kaki ruas-noprint' },
      h(Button, { size: 'sm', variant: 'ghost', icon: h(Table, { size: 16 }), 'aria-expanded': tabel, onClick: () => setTabel(!tabel) }, tabel ? L.sembunyikanTabel : L.lihatTabel)),
    tabel && h('div', { className: 'ruas-tabel-gulir' }, h('table', { className: 'ruas-tabel' },
      label && h('caption', { className: 'ruas-sr' }, label),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, L.label), h('th', { scope: 'col', style: { textAlign: 'end' } }, L.nilai))),
      h('tbody', null, data.map((d, i) => h('tr', { key: i }, h('td', null, d.label), h('td', { style: { textAlign: 'end' } }, format(d.value))))))));
}
export const BarChart = p => h(Grafik, { ...p, jenis: 'bar' });
export const LineChart = p => h(Grafik, { ...p, jenis: 'line' });
