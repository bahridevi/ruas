'use client';
// @ruas-icons/ui: komponen dasbor bergaya Ruas untuk React/Next.js. Tanpa langkah build; pasangkan ruas-ui.css.
// Teks bawaan berbahasa Indonesia; ganti lewat prop `labels`. Ikon dari @ruas-icons/react.
import { Fragment, createContext, createElement as h, forwardRef, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Close, Loader, Printer, Sort, TriangleAlert } from '@ruas-icons/react';

const cx = (...a) => a.filter(Boolean).join(' ');
const angka = n => Number(n).toLocaleString('id-ID');

export const LABEL = {
  bukaSemua: 'Buka semua', gulungSemua: 'Gulung semua', cetak: 'Cetak', memuat: 'Memuat…',
  kodeOtp: 'Kode OTP', digit: (i, n) => `Digit ${i} dari ${n}`, pilihSemua: 'Pilih semua',
  ringkasan: 'Ringkasan', saringan: 'Saringan', daftar: 'Daftar', cari: 'Cari', cariContoh: 'Ketik untuk mencari di semua kolom',
  hapusSaringan: 'Hapus saringan', saringanAktif: n => `${n} saringan aktif`,
  jumlah: (a, b) => `${angka(a)} dari ${angka(b)}`, rentang: (a, b, n) => `${angka(a)}–${angka(b)} dari ${angka(n)}`,
  halaman: (a, b) => `Halaman ${angka(a)} dari ${angka(b)}`, sebelumnya: 'Sebelumnya', berikutnya: 'Berikutnya',
  barisPerHalaman: 'Baris per halaman', no: 'No', semua: 'Semua', saringKolom: k => `Saring ${k}`, urutkan: k => `Urutkan menurut ${k}`,
  kosong: 'Tidak ada data yang cocok dengan saringan. Coba hapus saringan.', kosongAwal: 'Belum ada data.',
  bukaRincian: 'Buka rincian', gulungRincian: 'Gulung rincian', bukaSemuaRincian: 'Buka semua rincian', gulungSemuaRincian: 'Gulung semua rincian',
  cetakHalaman: 'Cetak halaman ini', cetakSaringan: 'Cetak hasil saringan', gagalCetak: 'Gagal menyiapkan cetakan. Periksa koneksi, lalu coba lagi.',
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
    className: cx('ruas-btn', `ruas-btn-${variant}`, size !== 'md' && `ruas-btn-${size}`, className), ...p,
  }, loading ? h(Loader, { size: 16, className: 'ruas-putar' }) : icon, children);
});

export function Badge({ tone = 'neutral', icon, children, className, ...p }) {
  return h('span', { className: cx('ruas-badge', `ruas-badge-${tone}`, className), ...p }, icon, children);
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
  return [v, x => { if (value === undefined) setSendiri(x); onChange?.(x); }];
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
    const ke = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: bisa.length - 1 }[e.key];
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
      h(Button, { size: 'sm', icon: h(ChevronDown, { size: 16 }), onClick: () => kirim(true) }, L.bukaSemua),
      h(Button, { size: 'sm', icon: h(ChevronUp, { size: 16 }), onClick: () => kirim(false) }, L.gulungSemua)),
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

// Tabel standar: kontainer Ringkasan/Saringan/Daftar, urut per kolom, baris saring di bawah judul, nomor urut, paginasi, cetak.
// Mode server: beri `total` (jumlah hasil saringan) dan `onStateChange`; `rows` cukup baris halaman yang tampil.
export function DataTable({
  title, columns, rows = [], rowKey, summary, actions, total, grandTotal, onStateChange, fetchAllRows, loading,
  detail, footer, filters, filtersActive = 0, onClearFilters, printHeader, printFooter, rowClassName,
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
  const kunci = (r, i) => (typeof rowKey === 'function' ? rowKey(r) : rowKey ? r[rowKey] : i);
  const arahUrut = k => (st.sort?.key !== k ? 'none' : st.sort.dir === 'asc' ? 'ascending' : 'descending');
  const ikonUrut = k => h(st.sort?.key !== k ? Sort : st.sort.dir === 'asc' ? ChevronUp : ChevronDown, { size: 14 });
  const adaSaring = columns.some(c => c.filter);
  const lebar = columns.length + (detail ? 2 : 1);
  const kunciHal = baris.map((r, i) => kunci(r, noAwal + i));
  const semuaBuka = kunciHal.length > 0 && kunciHal.every(k => buka.has(k));
  const alih = k => setBuka(b => { const x = new Set(b); x.has(k) ? x.delete(k) : x.add(k); return x; });

  const kepala = h('thead', null,
    h('tr', null,
      detail && h('th', { scope: 'col', className: 'ruas-buka' }, h('span', { className: 'ruas-sr' }, L.bukaRincian)),
      h('th', { scope: 'col', className: 'ruas-no' }, L.no),
      columns.map(c => h('th', { key: c.key, scope: 'col', 'aria-sort': c.sortable ? arahUrut(c.key) : undefined, style: { textAlign: c.align, width: c.width } },
        c.sortable ? h('button', { type: 'button', className: 'ruas-urut', title: L.urutkan(c.label), onClick: () => urut(c.key) }, c.label, ikonUrut(c.key)) : c.label))),
    adaSaring && h('tr', { className: 'ruas-saring-baris ruas-noprint' },
      detail && h('td', { className: 'ruas-buka' }),
      h('td', { className: 'ruas-no' }),
      columns.map(c => h('td', { key: c.key }, c.filter && (c.options
        ? h('div', { className: 'ruas-select' },
          h('select', { className: 'ruas-input ruas-input-kecil', 'aria-label': L.saringKolom(c.label), value: st.filters[c.key] ?? '', onChange: e => saring(c.key, e.target.value) },
            h('option', { value: '' }, L.semua), c.options.map(o => h('option', { key: opsi(o).value, value: opsi(o).value }, opsi(o).label))),
          h(ChevronDown, { size: 16 }))
        : h('input', { type: 'search', className: 'ruas-input ruas-input-kecil', 'aria-label': L.saringKolom(c.label), placeholder: L.saringKolom(c.label), value: st.filters[c.key] ?? '', onChange: e => saring(c.key, e.target.value) }))))));
  const badan = h('tbody', null,
    loading && !baris.length ? h('tr', null, h('td', { colSpan: lebar, className: 'ruas-kosong' }, L.memuat))
      : !baris.length ? h('tr', null, h('td', { colSpan: lebar, className: 'ruas-kosong' }, nSaring ? L.kosong : emptyText ?? L.kosongAwal))
        : baris.map((r, i) => {
          const k = kunciHal[i], terbuka = detail && buka.has(k);
          return h(Fragment, { key: k },
            h('tr', { className: cx(terbuka && 'ruas-terbuka', rowClassName?.(r)) || undefined },
              detail && h('td', { className: 'ruas-buka' }, h('button', { type: 'button', className: 'ruas-buka-btn ruas-noprint', 'aria-expanded': !!terbuka, 'aria-label': terbuka ? L.gulungRincian : L.bukaRincian, title: terbuka ? L.gulungRincian : L.bukaRincian, onClick: () => alih(k) }, h(terbuka ? ChevronDown : ChevronRight, { size: 16 }))),
              h('td', { className: 'ruas-no' }, angka(noAwal + i + 1)),
              columns.map(c => h('td', { key: c.key, style: { textAlign: c.align } }, c.render ? c.render(r) : tampilNilai(nilai(c, r))))),
            terbuka && h('tr', { className: 'ruas-rincian' }, h('td', { colSpan: lebar }, detail(r))));
        }));
  const sel = footer && baris.length ? footer(server ? rows : olah) : null;
  const kaki = sel && h('tfoot', null, [].concat(sel).map((b, i) => h('tr', { key: i },
    detail && h('td', { className: 'ruas-buka' }),
    h('td', { className: 'ruas-no' }),
    columns.map(c => h('td', { key: c.key, style: { textAlign: c.align } }, b[c.key] ?? null)))));
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
    h(Button, { size: 'sm', variant: 'ghost', icon: h(Printer, { size: 16 }), disabled: !baris.length, onClick: () => printElement(daftar.current) }, L.cetakHalaman),
    (!server || fetchAllRows) && h(Button, { size: 'sm', variant: 'ghost', icon: h(Printer, { size: 16 }), disabled: !n, onClick: cetakSaringan }, L.cetakSaringan));

  return h(Section, { title, meta: L.jumlah(n, semua), actions, defaultOpen, className: cx('ruas-datatable', className) },
    h(SectionGroup, { labels },
      summary && h(Section, { title: L.ringkasan, level: 4, className: 'ruas-noprint' }, summary),
      h(Section, { title: L.saringan, meta: nSaring ? L.saringanAktif(nSaring) : null, level: 4, className: 'ruas-noprint' },
        filters && h('div', { className: 'ruas-saringan-lain' }, filters),
        h('div', { className: 'ruas-saringan' },
          h(Input, { type: 'search', label: L.cari, placeholder: L.cariContoh, value: st.q, onChange: e => ubah({ q: e.target.value }) }),
          h(Button, { icon: h(Close, { size: 16 }), disabled: !nSaring, onClick: () => { ubah({ q: '', filters: {} }); onClearFilters?.(); } }, L.hapusSaringan))),
      h('div', { ref: daftar },
        printHeader && h('div', { className: 'ruas-cetak-saja' }, printHeader),
        h(Section, { title: L.daftar, meta: n ? L.rentang(awal + 1, Math.min(awal + st.pageSize, n), n) : null, level: 4, actions: tombolCetak },
          galatCetak && h('p', { className: 'ruas-galat', role: 'alert' }, h(TriangleAlert, { size: 16 }), galatCetak),
          h('div', { className: 'ruas-tabel-gulir' }, h('table', { className: 'ruas-tabel', 'aria-busy': loading || undefined }, kepala, badan, kaki)),
          paging),
        printFooter && h('div', { className: 'ruas-cetak-saja' }, printFooter))));
}
