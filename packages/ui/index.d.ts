import type { FormEvent, JSX, ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, InputHTMLAttributes, ReactNode, RefAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export declare const LABEL: Labels;
export interface Labels {
  bukaSemua: string; gulungSemua: string; cetak: string; memuat: string; tutup: string; buka: string; gulung: string;
  kodeOtp: string; digit: (i: number, n: number) => string; pilihSemua: string;
  ringkasan: string; saringan: string; daftar: string; cari: string; cariContoh: string;
  hapusSaringan: string; saringanAktif: (n: number) => string;
  jumlah: (a: number, b: number) => string; rentang: (a: number, b: number, n: number) => string;
  halaman: (a: number, b: number) => string; sebelumnya: string; berikutnya: string;
  barisPerHalaman: string; no: string; semua: string; saringKolom: (k: string) => string; urutkan: (k: string) => string;
  kosong: string; kosongAwal: string; bukaRincian: string; gulungRincian: string; bukaSemuaRincian: string; gulungSemuaRincian: string; cetakHalaman: string; cetakSaringan: string; gagalCetak: string;
}
type Teks = { labels?: Partial<Labels> };

export declare function printElement(el: HTMLElement | null, selesai?: () => void): void;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  /** Ikon di kiri, mis. <Plus size={16} /> dari @ruas-icons/react. Tombol ikon saja wajib aria-label. */
  icon?: ReactNode;
}
export declare const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  icon?: ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;

interface FieldBits { label?: ReactNode; hint?: ReactNode; error?: ReactNode; fieldClassName?: string }
export interface FieldControlProps { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true; required?: boolean }
export declare function Field(props: { label?: ReactNode; hint?: ReactNode; error?: ReactNode; required?: boolean; id?: string; className?: string; children: (control: FieldControlProps) => ReactNode }): JSX.Element;
export declare const Input: ForwardRefExoticComponent<FieldBits & InputHTMLAttributes<HTMLInputElement> & RefAttributes<HTMLInputElement>>;
export declare const Textarea: ForwardRefExoticComponent<FieldBits & TextareaHTMLAttributes<HTMLTextAreaElement> & RefAttributes<HTMLTextAreaElement>>;
export type Option = string | { value: string; label: ReactNode; disabled?: boolean };
export declare const Select: ForwardRefExoticComponent<FieldBits & SelectHTMLAttributes<HTMLSelectElement> & { options?: Option[]; placeholder?: string } & RefAttributes<HTMLSelectElement>>;

export interface CheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { label: ReactNode; hint?: ReactNode; indeterminate?: boolean }
export declare const Checkbox: ForwardRefExoticComponent<CheckProps & RefAttributes<HTMLInputElement>>;
export declare const Radio: ForwardRefExoticComponent<CheckProps & RefAttributes<HTMLInputElement>>;

export interface ChoiceOption { value: string; label: ReactNode; hint?: ReactNode; disabled?: boolean }
interface GroupBits { label?: ReactNode; hint?: ReactNode; error?: ReactNode; required?: boolean; inline?: boolean; disabled?: boolean; className?: string; options: ChoiceOption[] }
export declare function RadioGroup(props: GroupBits & { name?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; variant?: 'list' | 'segmented' }): JSX.Element;
export declare function CheckboxGroup(props: GroupBits & Teks & { value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void; selectAll?: boolean }): JSX.Element;

export declare function Otp(props: Teks & {
  length?: number; value?: string; defaultValue?: string; onChange?: (value: string) => void; onComplete?: (value: string) => void;
  label?: ReactNode; hint?: ReactNode; error?: ReactNode; disabled?: boolean; autoFocus?: boolean;
  /** Nama input tersembunyi untuk <form>. */ name?: string; alphanumeric?: boolean; className?: string;
}): JSX.Element;

export interface TabItem { id: string; label: ReactNode; content: ReactNode; icon?: ReactNode; badge?: ReactNode; disabled?: boolean }
export declare function Tabs(props: { items: TabItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; label: string; className?: string }): JSX.Element;

export declare function SectionGroup(props: Teks & { children?: ReactNode; toolbar?: boolean; className?: string }): JSX.Element;
export declare function Section(props: Teks & {
  title: ReactNode; meta?: ReactNode; actions?: ReactNode; children?: ReactNode; defaultOpen?: boolean; open?: boolean;
  onOpenChange?: (open: boolean) => void; printable?: boolean; level?: 2 | 3 | 4 | 5 | 6; className?: string; id?: string;
}): JSX.Element;

export interface Column<R> {
  key: string;
  /** Teks judul kolom (juga dipakai label urut & saring). */ label: string;
  value?: (row: R) => unknown; render?: (row: R) => ReactNode;
  sortable?: boolean; filter?: boolean;
  /** Saringan pilihan (dropdown) alih-alih teks. */ options?: Option[];
  align?: 'left' | 'center' | 'right'; width?: string | number;
}
export interface TableState { q: string; filters: Record<string, string>; sort: { key: string; dir: 'asc' | 'desc' } | null; page: number; pageSize: number }
/** Sel kolom pertama tabel bertingkat: garis panduan per tingkat + tombol buka/gulung. Tanpa onToggle = daun. */
export declare function TreeCell(props: Teks & {
  depth?: number; expanded?: boolean; onToggle?: () => void;
  /** Nama simpul untuk aria-label tombol, mis. kode akun ("Buka 11"). */ label?: string;
  children?: ReactNode; className?: string;
}): JSX.Element;

/** Jendela modal dari <dialog> bawaan (fokus terkurung, Esc, klik latar). Isi dirender hanya saat open. */
export declare function Dialog(props: Teks & Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onSubmit'> & {
  open: boolean; onClose?: () => void; title: ReactNode; description?: ReactNode;
  /** Ikon di kotak berwarna kiri judul. */ icon?: ReactNode;
  /** Pesan galat di atas isi (role=alert), mis. gagal menyimpan. */ alert?: ReactNode;
  /** Warna garis atas & ikon: default = bambu, danger untuk konfirmasi hapus. */ tone?: 'default' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Tombol di kaki (kanan). */ footer?: ReactNode;
  /** Diisi = kotak menjadi <form>; Enter mengirim, tombol kaki boleh type="submit". */ onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  /** false = Esc/klik latar tidak menutup dan tanpa tombol ×. */ dismissible?: boolean;
  children?: ReactNode; className?: string;
}): JSX.Element;

type Nada = 'default' | 'success' | 'warning' | 'danger' | 'info';
/** Kotak pesan berwarna nada; danger/warning memakai role=alert, lainnya role=status. */
export declare function Alert(props: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: Nada; icon?: ReactNode; title?: ReactNode;
  /** Isi di kanan (turun ke bawah di HP), mis. lencana status. */ aside?: ReactNode;
  children?: ReactNode;
}): JSX.Element;
/** Kartu angka ringkas (KPI). */
export declare function Stat(props: HTMLAttributes<HTMLDivElement> & {
  label: ReactNode; value: ReactNode; hint?: ReactNode; icon?: ReactNode; tone?: Nada;
  /** Tautan di kaki kartu, mis. <Link href="…">Kelola</Link>. */ action?: ReactNode;
}): JSX.Element;

export declare function applyTableState<R>(rows: R[], columns: Column<R>[], state?: Partial<TableState>): R[];
export declare function DataTable<R>(props: Teks & {
  title: ReactNode; columns: Column<R>[]; rows?: R[]; rowKey?: keyof R | ((row: R) => string | number);
  summary?: ReactNode; actions?: ReactNode;
  /** Mode server: jumlah hasil saringan; `rows` cukup baris halaman ini. */ total?: number;
  /** Jumlah seluruh data sebelum disaring (untuk "x dari y"). */ grandTotal?: number;
  onStateChange?: (state: TableState) => void;
  /** Mode server: ambil semua baris hasil saringan untuk "Cetak hasil saringan". */ fetchAllRows?: (state: TableState) => Promise<R[]>;
  /** Baris rincian yang bisa dibuka per baris (tombol di kolom pertama, plus "Buka semua rincian"). */ detail?: (row: R) => ReactNode;
  /** Baris total di kaki tabel (satu objek, atau larik untuk beberapa baris): isi per kunci kolom, dihitung dari SEMUA hasil saringan (mode server: rows). */ footer?: (rows: R[]) => Partial<Record<string, ReactNode>> | Partial<Record<string, ReactNode>>[];
  /** Hanya tercetak (kop surat, tanda tangan) saat Cetak halaman ini / hasil saringan. */ printHeader?: ReactNode; printFooter?: ReactNode;
  /** Rincian langsung terbuka (semua, atau baris yang memenuhi syarat) setiap `rows` berganti. Butuh rowKey. */ defaultDetailOpen?: boolean | ((row: R) => boolean);
  /** false = sembunyikan kotak Cari (mis. API server tidak mendukung pencarian). */ searchable?: boolean;
  /** Kelas tambahan per baris, mis. warna kondisi. */ rowClassName?: (row: R) => string | undefined;
  /** Saringan tambahan milik aplikasi (periode, rentang tanggal…) di bagian Saringan. */ filters?: ReactNode;
  /** Jumlah saringan tambahan yang aktif (ikut "x saringan aktif"). */ filtersActive?: number;
  /** Dipanggil oleh "Hapus saringan" agar aplikasi mengosongkan saringan tambahannya. */ onClearFilters?: () => void;
  loading?: boolean; pageSizes?: number[]; defaultPageSize?: number; defaultOpen?: boolean; emptyText?: ReactNode; className?: string;
}): JSX.Element;
