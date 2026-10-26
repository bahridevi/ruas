import type { FormEvent, ElementType, JSX, ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, InputHTMLAttributes, ReactNode, RefAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

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
  pilihBaris: (n: number) => string; pilihHalaman: string; dipilih: (n: number) => string; batalPilih: string;
  kolom: string; tampilkanKolom: string; unduhCsv: string; gagalUnduh: string;
  aksi: string; navigasi: string; jejak: string; bukaMenu: string; tutupMenu: string; ciutkanMenu: string; lebarkanMenu: string; lewati: string;
  palet: string; cariPerintah: string; tanpaHasil: string; hasil: (n: number) => string; pemberitahuan: string; pilihOpsi: string; opsiLagi: (n: number) => string;
  dari: string; sampai: string; rentangSalah: string; hariIni: string; tujuhHari: string; bulanIni: string; bulanLalu: string; tahunIni: string;
  tanggal: string; mingguIni: string; tahunLalu: string; rentangTanggal: string; semuaTanggal: string; periode: string;
  seretBerkas: string; pilihBerkas: string; hapusBerkas: (nama: string) => string; terlaluBesar: (nama: string, batas: string) => string; jenisSalah: (nama: string) => string; batasBerkas: (batas: string) => string;
  langkah: (i: number, n: number) => string; selesai: string; naik: string; turun: string; tetap: string;
  tren: string; lihatTabel: string; sembunyikanTabel: string; nilai: string; label: string;
  diputar: string; dijeda: string; level: string;
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
/** Ikon tersemat dalam ubin Sudut Daun. Tanpa `label` = hiasan; dengan `label` = gambar bermakna bagi pembaca layar. */
export declare function IconTile(props: HTMLAttributes<HTMLSpanElement> & {
  icon: ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'; size?: 'sm' | 'md' | 'lg'; variant?: 'soft' | 'solid' | 'outline'; label?: string;
}): JSX.Element;

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
/** Sakelar nyala/mati (role="switch"): untuk pengaturan yang langsung berlaku. */
export declare const Switch: ForwardRefExoticComponent<CheckProps & RefAttributes<HTMLInputElement>>;

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
  /** Tersembunyi saat awal (bisa dimunculkan lewat tombol Kolom). */ hidden?: boolean;
  /** false = tidak bisa disembunyikan. */ hideable?: boolean;
  /** false = tidak ikut Unduh CSV maupun cetak (mis. kolom tombol aksi). */ exportable?: boolean;
  /** Nilai sel untuk CSV bila berbeda dari value/key. */ csv?: (row: R) => unknown;
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
  label: ReactNode; value: ReactNode; hint?: ReactNode; icon?: ReactNode; tone?: Nada; labels?: Partial<Labels>;
  /** Perubahan (persen) dibanding periode lalu, mis. 12.5 atau -3. */ delta?: number;
  /** Teks pembanding, mis. "dari bulan lalu". */ deltaLabel?: ReactNode;
  /** true = turun itu baik (biaya, keluhan). */ invert?: boolean;
  /** Deret angka untuk garis tren mini. */ trend?: number[];
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
  /** Kotak centang per baris + "Pilih semua di halaman ini". Butuh rowKey. */ selectable?: boolean;
  /** Tombol aksi massal di bilah "n dipilih". */ bulkActions?: (keys: (string | number)[], clear: () => void) => ReactNode;
  onSelectionChange?: (keys: (string | number)[]) => void;
  /** Tombol Kolom: tampil/sembunyikan kolom. */ columnToggle?: boolean;
  /** Tombol Unduh CSV (hasil saringan; mode server butuh fetchAllRows). */ exportable?: boolean; exportName?: string;
  /** Tinggi maksimal area tabel, mis. "70vh": tabel bergulir di dalam dan judul kolom tetap terlihat. */ maxHeight?: string | number;
  loading?: boolean; pageSizes?: number[]; defaultPageSize?: number; defaultOpen?: boolean; emptyText?: ReactNode; className?: string;
}): JSX.Element;

export declare function toCsv<R>(rows: R[], columns: Column<R>[]): string;
export declare function downloadFile(name: string, content: string, type?: string): void;

export interface MenuItem { label: ReactNode; icon?: ReactNode; onSelect?: () => void; tone?: 'default' | 'danger'; disabled?: boolean; hint?: string }
/** Menu aksi (bawaan: tombol "⋯"). '-' = garis pemisah. */
export declare function Menu(props: Teks & { items: (MenuItem | '-' | false | null | undefined)[]; label?: string; icon?: ReactNode | null; align?: 'start' | 'end'; variant?: ButtonProps['variant']; size?: ButtonProps['size']; children?: ReactNode; className?: string }): JSX.Element;

export interface NavItem { href?: string; label: string; icon?: ReactNode; badge?: ReactNode; active?: boolean; onClick?: (e: unknown) => void }
/** Kerangka dasbor: menu samping (ciut = ikon saja; HP = laci), bilah atas, isi. */
export declare function AppShell(props: Teks & {
  brand?: ReactNode; nav?: { title?: ReactNode; items: NavItem[] }[]; header?: ReactNode; actions?: ReactNode; footer?: ReactNode; children?: ReactNode;
  /** Komponen tautan, mis. Link dari next/link. */ linkAs?: ElementType; defaultCollapsed?: boolean; className?: string;
}): JSX.Element;
export declare function Breadcrumb(props: Teks & { items: { label: ReactNode; href?: string }[]; linkAs?: ElementType; className?: string }): JSX.Element;

export interface ToastOptions { title?: ReactNode; description?: ReactNode; tone?: 'info' | 'success' | 'warning' | 'danger'; action?: ReactNode; /** ms; bawaan 5000, danger = sampai ditutup. */ duration?: number }
export declare function ToastProvider(props: Teks & { children?: ReactNode }): JSX.Element;
export declare function useToast(): (toast: string | ToastOptions) => string;

export interface CommandItem { id?: string; label: string; group?: string; icon?: ReactNode; keywords?: string[]; hint?: string; disabled?: boolean; onSelect?: () => void }
/** Palet perintah (Ctrl+K / ⌘K). */
export declare function CommandPalette(props: Teks & { items: CommandItem[]; open?: boolean; onOpenChange?: (open: boolean) => void; shortcut?: boolean; placeholder?: string; limit?: number }): JSX.Element;

/** Pilihan yang bisa dicari. Data besar: beri onSearch dan isi options dari server. */
export declare const Combobox: ForwardRefExoticComponent<Teks & {
  label?: ReactNode; hint?: ReactNode; error?: ReactNode; required?: boolean; options: (string | { value: string; label: string; disabled?: boolean })[];
  value?: string; defaultValue?: string; onChange?: (value: string) => void; onSearch?: (q: string) => void; placeholder?: string; emptyText?: ReactNode;
  disabled?: boolean; name?: string; id?: string; limit?: number; className?: string; fieldClassName?: string;
} & RefAttributes<HTMLInputElement>>;

export interface DateRangeValue { from: string; to: string }
export type DateRangePresetKey = 'hariIni' | 'tujuhHari' | 'mingguIni' | 'bulanIni' | 'bulanLalu' | 'tahunIni' | 'tahunLalu';
/** Pilihan aktif varian select: 'periode', kunci preset, 'rentang' (Rentang tanggal…) atau 'semua'. */
export type DateRangeChoice = DateRangePresetKey | 'periode' | 'rentang' | 'semua';
/** Label cetak: "01/10/2026 – 15/10/2026", satu tanggal, atau "Semua tanggal" bila from dan to kosong. */
export declare function dateRangeLabel(value: DateRangeValue, labels?: Partial<Labels>): string;
export declare function dateRangePreset(key: DateRangePresetKey, now?: Date): DateRangeValue;
/** Rentang tanggal (YYYY-MM-DD) + pilihan cepat. */
export declare function DateRange(props: Teks & {
  label?: ReactNode; hint?: ReactNode; error?: ReactNode; value?: DateRangeValue; defaultValue?: DateRangeValue;
  /** `choice` hanya dikirim varian select. */
  onChange?: (value: DateRangeValue, choice?: DateRangeChoice) => void;
  /** 'buttons' (bawaan): dua isian + tombol preset. 'select': satu menu Tanggal; isian Dari–Sampai muncul untuk Rentang tanggal…. */
  variant?: 'buttons' | 'select';
  /** Varian select: rentang bawaan aplikasi (mis. periode pembukuan), tampil sebagai pilihan pertama. */
  period?: DateRangeValue; periodLabel?: string;
  presets?: DateRangePresetKey[] | false; min?: string; max?: string; required?: boolean; disabled?: boolean; className?: string;
}): JSX.Element;

/** Isian angka berpemisah ribuan; Rupiah = prefix="Rp", bersen = decimals={2}. Nilai number atau null. */
export declare const NumberInput: ForwardRefExoticComponent<FieldBits & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'prefix' | 'min'> & {
  value?: number | null; defaultValue?: number | null; onChange?: (value: number | null) => void; prefix?: ReactNode; suffix?: ReactNode; /** < 0 = boleh negatif. */ min?: number;
  /** Angka di belakang koma yang boleh diketik (bawaan 0 = bulat). */ decimals?: number;
  /** Angka di belakang koma yang selalu tampil setelah isian ditinggalkan (bawaan = decimals, mis. 12,50). */ minDecimals?: number;
  /** Format pemisah ribuan/desimal, mis. 'en-US' (1,250,000.50), 'fr-FR', 'en-IN'. Bawaan 'id-ID'. */ locale?: string;
} & RefAttributes<HTMLInputElement>>;

/** Unggah berkas seret-lepas + pratinjau. maxSize dalam byte. Server tetap wajib memeriksa ulang. */
export declare function FileDrop(props: Teks & {
  label?: ReactNode; hint?: ReactNode; error?: ReactNode; accept?: string; multiple?: boolean; maxSize?: number;
  value?: File[]; defaultValue?: File[]; onChange?: (files: File[]) => void; disabled?: boolean; required?: boolean; className?: string;
}): JSX.Element;

export declare function Stepper(props: Teks & { steps: { label: ReactNode; hint?: ReactNode }[]; current?: number; onStepClick?: (index: number) => void; className?: string }): JSX.Element;

export declare function Skeleton(props: { width?: string | number; height?: string | number; lines?: number; className?: string }): JSX.Element;
export declare function EmptyState(props: { icon?: ReactNode; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }): JSX.Element;
/** value null = tak tentu (daun bergerak kiri-kanan); active = daun mengalir selama proses berjalan. */
export declare function Progress(props: { value?: number | null; active?: boolean; max?: number; label?: ReactNode; hint?: ReactNode; tone?: Nada; showValue?: boolean; className?: string }): JSX.Element;
/** Equalizer daun: values (0–1 per batang) = level nyata; tanpa values = hiasan "sedang diputar". */
export declare function Equalizer(props: Teks & { values?: number[]; bars?: number; segments?: number; playing?: boolean; label?: string; height?: number; tone?: Nada; className?: string }): JSX.Element;
export declare function Sparkline(props: Teks & { data: number[]; height?: number; label?: string; className?: string }): JSX.Element | null;

export interface ChartDatum { label: string; value: number }
interface ChartProps extends Teks { data: ChartDatum[]; /** Nama grafik (aria-label & judul tabel). */ label?: string; format?: (value: number) => string; height?: number; className?: string }
/** Grafik batang satu seri, tooltip + tombol "Lihat tabel". */ export declare function BarChart(props: ChartProps): JSX.Element;
/** Grafik garis satu seri, tooltip + tombol "Lihat tabel". */ export declare function LineChart(props: ChartProps): JSX.Element;
