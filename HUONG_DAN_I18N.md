# Hướng dẫn i18n (VI/EN) của dự án Kanban

## 1. Mục tiêu
Người dùng bấm nút **VI** hoặc **EN** ở góc phải Header thì toàn bộ chữ trên giao diện (kể cả tiêu đề/mô tả công việc trong `data.json`, ngày tháng, `aria-label`) đổi ngay lập tức, **không reload trang**. Không dùng thư viện ngoài (như react-i18next), tự viết bằng Context.

## 2. Cài đặt kỹ thuật từng bước

### Bước 1 - Từ điển tiếng Việt, đồng thời là "nguồn" của kiểu key (`src/i18n/vi.ts`)
```ts
export const vi = {
  'app.title': 'Bảng công việc Kanban',
  'status.todo': 'Cần làm',
  'card.moveTo': 'Chuyển sang cột {status}',
  // ... các key khác
} as const

export type TranslationKey = keyof typeof vi
```
`TranslationKey` là kiểu hợp (union) của mọi key, ví dụ `'app.title' | 'status.todo' | ...`.

### Bước 2 - Từ điển tiếng Anh, bắt buộc đủ key (`src/i18n/en.ts`)
```ts
import type { TranslationKey } from './vi'

export const en: Record<TranslationKey, string> = {
  'app.title': 'Kanban Task Board',
  'status.todo': 'To do',
  'card.moveTo': 'Move to column {status}',
  // ...
}
```
Kiểu `Record<TranslationKey, string>` khiến TypeScript báo lỗi nếu `en` thiếu hoặc thừa key so với `vi`.

### Bước 3 - Gom từ điển và hàm hỗ trợ (`src/i18n/dictionary.ts`)
```ts
export const dictionaries: Record<Language, Record<TranslationKey, string>> = { vi, en }
export const LANGUAGE_STORAGE_KEY = 'kanban.lang'
export const LOCALES: Record<Language, string> = { vi: 'vi-VN', en: 'en-US' }

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}
```
`interpolate` thay `{status}`, `{count}`... bằng giá trị truyền vào.

### Bước 4 - LanguageContext (`src/context/LanguageContext.ts`)
```ts
export interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}
export const LanguageContext = createContext<LanguageContextValue | null>(null)
```
File này **chỉ tạo context** để không vi phạm rule `react-refresh/only-export-components`.

### Bước 5 - Provider (`src/context/LanguageProvider.tsx`)
```tsx
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next)   // (trong try/catch)
  }, [])

  const t = useCallback<LanguageContextValue['t']>(
    (key, params) => interpolate(dictionaries[language][key], params),
    [language],
  )

  useEffect(() => {
    document.documentElement.lang = language
    document.title = dictionaries[language]['app.title']
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
```
`readStoredLanguage` đọc `localStorage`, nếu không có hoặc sai giá trị thì dùng mặc định `'vi'`.

### Bước 6 - Hook (`src/hooks/useLanguage.ts` và `src/hooks/useTranslation.ts`)
```ts
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (context === null) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return context
}
```
```ts
export function useTranslation() {
  const { language, t } = useLanguage()
  const pick = useCallback((text: LocalizedText): string => text[language], [language])
  const date = useCallback((isoDate: string): string => formatDate(isoDate, language), [language])
  return { t, language, pick, date }
}
```
- `t(key)`: lấy chuỗi giao diện.
- `pick(text)`: lấy chuỗi song ngữ của dữ liệu (`title`, `description`).
- `date(iso)`: định dạng ngày theo ngôn ngữ.

### Bước 7 - Bọc ứng dụng (`src/main.tsx`)
```tsx
<BrowserRouter>
  <LanguageProvider>
    <TasksProvider>
      <App />
    </TasksProvider>
  </LanguageProvider>
</BrowserRouter>
```

### Bước 8 - Nút đổi ngôn ngữ (`src/components/LanguageSwitcher.tsx`)
```tsx
const { language, setLanguage, t } = useLanguage()
// ...
<button
  type="button"
  lang={option}
  aria-pressed={option === language}
  aria-label={t(option === 'vi' ? 'lang.vi' : 'lang.en')}
  onClick={() => setLanguage(option)}
>
  {option.toUpperCase()}
</button>
```

### Bước 9 - Dùng `t()` trong component (ví dụ `Card.tsx`)
```tsx
const { t, pick, date } = useTranslation()
// ...
<h3>{pick(task.title)}</h3>
<dd>{t('card.dueShort', { date: date(task.dueDate) })}</dd>
<button aria-label={t('card.moveTo', { status: t(`status.${next}`) })}>...</button>
```

### Bước 10 - Dữ liệu song ngữ trong `src/data/data.json`
```json
{
  "id": "task-001",
  "title": { "vi": "Thiết kế giao diện bảng Kanban", "en": "Design the Kanban board layout" },
  "description": { "vi": "...", "en": "..." },
  "status": "done",
  "priority": "high",
  "labels": ["design", "frontend"]
}
```
Mỗi chuỗi hiển thị có đủ `vi` và `en`; component chỉ gọi `pick(task.title)`. Những giá trị là **mã** (`status`, `priority`, `labels`) không dịch trong JSON mà dịch bằng key: `t('status.todo')`, `t('priority.high')`, `t('label.design')`. Tên người (`assignee`) là tên riêng nên không dịch.

## 3. Cách hoạt động
- Ngôn ngữ hiện tại là một **state** (`useState`) nằm trong `LanguageProvider`. Provider đưa state này vào Context.
- Mọi component gọi `useLanguage()`/`useTranslation()` đều "đăng ký" theo dõi Context. Khi `setLanguage` đổi state, React render lại tất cả component đó, và `t(key)` đọc từ từ điển của ngôn ngữ mới. Không có điều hướng hay tải lại trang nên không reload.
- `t` được tạo bằng `useCallback` phụ thuộc `[language]`, nên nó đổi tham chiếu khi ngôn ngữ đổi, đảm bảo các nơi dùng `t` luôn cập nhật.
- Lưu lựa chọn: `setLanguage` ghi `localStorage['kanban.lang']`; lần mở sau, `readStoredLanguage()` đọc lại.
- `useEffect` cập nhật `document.documentElement.lang` (cho trình đọc màn hình, dịch máy) và `document.title`.
- Ngày theo ngôn ngữ: `formatDate` dùng `Intl.DateTimeFormat('vi-VN' | 'en-US')`. Tiền tệ (nếu dùng) có `formatCurrency` trong `utils.ts` với locale `vi-VN`.

## 4. Sơ đồ luồng
```
Click nút VI/EN (LanguageSwitcher)
        |
        v
setLanguage('en')  --> localStorage.setItem('kanban.lang','en')
        |
        v
setLanguageState('en')  (state trong LanguageProvider đổi)
        |
        +--> useEffect: <html lang="en">, document.title
        |
        v
Context value mới { language:'en', t, setLanguage }
        |
        v
Mọi component dùng useLanguage()/useTranslation() render lại
        |
        v
t('status.todo') -> dictionaries['en']['status.todo'] -> "To do"
pick(task.title) -> task.title['en']
```

## 5. Thêm ngôn ngữ / thêm key, lỗi thường gặp

**Thêm key mới**
1. Thêm vào `vi.ts`: `'board.hello': 'Xin chào',`
2. Thêm vào `en.ts`: `'board.hello': 'Hello',` (thiếu sẽ báo lỗi TypeScript).
3. Dùng: `t('board.hello')`.

**Thêm ngôn ngữ (ví dụ Nhật `ja`)**
1. `types/index.ts`: `type Language = 'vi' | 'en' | 'ja'`.
2. Tạo `src/i18n/ja.ts` kiểu `Record<TranslationKey, string>`.
3. Thêm vào `dictionaries` và `LOCALES` (`ja: 'ja-JP'`), thêm `isLanguage`.
4. Thêm `'ja'` vào `OPTIONS` của `LanguageSwitcher`, thêm key `lang.ja`, và thêm `ja` vào mọi `LocalizedText` trong `data.json`.

**Lỗi thường gặp**
- Thiếu key: hiện lỗi biên dịch (hoặc `undefined` nếu ép kiểu). Luôn sửa `vi.ts` và `en.ts` cùng lúc.
- Key lệch giữa vi và en: gõ sai chính tả key; `Record<TranslationKey,string>` giúp phát hiện.
- Quên dịch `aria-label` (nút chỉ có icon): đọc màn hình vẫn nói ngôn ngữ cũ. Mọi `aria-label` phải đi qua `t()`.
- Quên `alt` ảnh theo ngôn ngữ, hoặc quên thiếu `en` trong `data.json` mới thêm.
- Dùng chữ cứng trong JSX thay vì `t()` nên không đổi khi bấm nút.

## 6. Ba câu hỏi vấn đáp
1. **Vì sao đổi ngôn ngữ không cần reload?** Ngôn ngữ là state trong Context; `setLanguage` làm state đổi nên React render lại các component dùng context, đây là cập nhật phía client.
2. **Làm sao nhớ ngôn ngữ lần sau?** Lưu vào `localStorage` khi `setLanguage`, và đọc ở giá trị khởi tạo `useState(readStoredLanguage)`.
3. **Vì sao tách Context, Provider, hook thành file riêng?** Để tránh cảnh báo `react-refresh/only-export-components` (một file chỉ nên export component hoặc không phải component), đồng thời code gọn, dễ tái sử dụng.
