document.addEventListener('DOMContentLoaded', () => {
    // ===== Constants =====
    const GROUPS = ['3-5年目', '6-7年目', '副医長', '医長', '副部長', '部長', '副部長以上'];
    const GROUP_PRIORITY = { '3-5年目': 0, '6-7年目': 1, '副医長': 2, '医長': 3, '副部長': 4, '部長': 5, '副部長以上': 5 };
    const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
    const ROLE_LABELS = {
        wardDay: '🏥病棟(日中)', wardNight: '🏥病棟(夜間)',
        erDay: '🚑救急(日中)', erNight: '🚑救急(夜間)'
    };
    const DEPARTMENT_BY_NAME = {
        '久保山知彦': 'ﾘｳﾏﾁ膠原病内科',
        '焦 圭裕': 'ﾘｳﾏﾁ膠原病内科',
        '藤木 陽平': 'ﾘｳﾏﾁ膠原病内科',
        '金武あゆみ': 'ﾘｳﾏﾁ膠原病内科',
        '中島 康哉': '血液内科',
        '丹羽諒太郎': '血液内科',
        '南部 海': '血液内科',
        '垣内 誠司': '血液内科',
        '富垣 成': '血液内科',
        '梁間 敢': '血液内科',
        '藤岡周太郎': '血液内科',
        '藤本健太郎': '血液内科',
        '上野 峻輔': '呼吸器内科',
        '中村 基寛': '呼吸器内科',
        '古田 寛人': '呼吸器内科',
        '吉井 直子': '呼吸器内科',
        '堀川 真衣': '呼吸器内科',
        '大谷賢一郎': '呼吸器内科',
        '朝岡 拓哉': '呼吸器内科',
        '西島 正剛': '呼吸器内科',
        '吉田 也恵': '腫瘍内科',
        '金 容壱': '腫瘍内科',
        '上野 裕美子': '循環器内科',
        '佐々木 諭': '循環器内科',
        '岩根 成豪': '循環器内科',
        '岩田 幸代': '循環器内科',
        '松本 大典': '循環器内科',
        '竹重 遼': '循環器内科',
        '三木 秀晃': '消化器内科',
        '北村 泰明': '消化器内科',
        '吉田竜太郎': '消化器内科',
        '春山 忠佑': '消化器内科',
        '東 祐介': '消化器内科',
        '松井 佐織': '消化器内科',
        '池田 響': '消化器内科',
        '薮内 寛幸': '消化器内科',
        '藤田 光一': '消化器内科',
        '近藤 和也': '消化器内科',
        '酒牧 弘誠': '消化器内科',
        '今中 友香': '腎臓内科',
        '服部 洸輝': '腎臓内科',
        '水本 綾': '腎臓内科',
        '田中 康史': '総合内科',
        '梶川 道子': '糖尿病･内分泌内科',
        '津本 一秀': '糖尿病･内分泌内科',
        '渡邉 陽香': '糖尿病･内分泌内科',
        '黒川 晟': '糖尿病･内分泌内科',
        '上田 直子': '脳血管神経内科',
        '安部 裕子': '脳血管神経内科',
        '山口星一郎': '脳血管神経内科',
        '岸 具宏': '脳血管神経内科',
        '椿 遥花': '脳血管神経内科',
        '渡邊 有史': '脳血管神経内科',
        '箱谷 聡': '脳血管神経内科',
        '西岡 唯': '脳血管神経内科',
        '重岡 靖': '腫瘍内科',
    };
    const PRIORITY_ER_NIGHT_DOCTOR_NAMES = new Set(['岸 具宏']);
    const WEEKDAY_WARD_NIGHT_CHIEF_NAMES = new Set(['垣内 誠司', '松本 大典']);
    const FEMALE_DOCTOR_NAMES = new Set([
        '吉井 直子',
        '吉田 也恵',
        '岩田 幸代',
        '松井 佐織',
        '水本 綾',
        '梶川 道子',
        '上田 直子',
        '安部 裕子'
    ]);
    const WARD_DAY_ONLY_DOCTOR_NAMES = new Set([
        '吉井 直子'
    ]);

    // テンプレートv2「01_医師マスタ」時間外対応=〇 の56名
    const DEFAULT_DOCTORS = [
        { name: '久保山知彦', group: '医長', holidayErDayPreferred: false, outpatientDays: ['火', '水'] },
        { name: '焦 圭裕', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['火', '金'] },
        { name: '藤木 陽平', group: '部長', holidayErDayPreferred: true, outpatientDays: ['月', '木', '金'] },
        { name: '金武あゆみ', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '中島 康哉', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '丹羽諒太郎', group: '医長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '南部 海', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['月'] },
        { name: '垣内 誠司', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '富垣 成', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['水', '木'] },
        { name: '梁間 敢', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['火', '水'] },
        { name: '藤岡周太郎', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['水', '金'] },
        { name: '藤本健太郎', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '上野 峻輔', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火', '水'] },
        { name: '中村 基寛', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['金'] },
        { name: '古田 寛人', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['月', '金'] },
        { name: '吉井 直子', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['火', '金'] },
        { name: '堀川 真衣', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '大谷賢一郎', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '金'] },
        { name: '朝岡 拓哉', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '西島 正剛', group: '副部長', holidayErDayPreferred: true, outpatientDays: ['水', '金'] },
        { name: '吉田 也恵', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '木', '金'] },
        { name: '金 容壱', group: '部長', holidayErDayPreferred: true, outpatientDays: ['月', '火', '水', '木'] },
        { name: '上野 裕美子', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['火'] },
        { name: '佐々木 諭', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '岩根 成豪', group: '医長', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '岩田 幸代', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '木'] },
        { name: '松本 大典', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '竹重 遼', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['火', '金'] },
        { name: '三木 秀晃', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['月', '木'] },
        { name: '北村 泰明', group: '部長', holidayErDayPreferred: true, outpatientDays: ['水', '金'] },
        { name: '吉田竜太郎', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['水', '木'] },
        { name: '春山 忠佑', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '東 祐介', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '松井 佐織', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '金'] },
        { name: '池田 響', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火', '木'] },
        { name: '薮内 寛幸', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['金'] },
        { name: '藤田 光一', group: '部長', holidayErDayPreferred: true, outpatientDays: ['火', '木'] },
        { name: '近藤 和也', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '酒牧 弘誠', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '今中 友香', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '服部 洸輝', group: '医長', holidayErDayPreferred: true, outpatientDays: ['火', '金'] },
        { name: '水本 綾', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '木'] },
        { name: '田中 康史', group: '部長', holidayErDayPreferred: true, outpatientDays: ['月', '火', '水', '木', '金'] },
        { name: '梶川 道子', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '水', '木'] },
        { name: '津本 一秀', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水', '木'] },
        { name: '渡邉 陽香', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['火'] },
        { name: '黒川 晟', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '金'] },
        { name: '上田 直子', group: '部長', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '安部 裕子', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '水'] },
        { name: '山口星一郎', group: '副医長', holidayErDayPreferred: true, outpatientDays: ['火'] },
        { name: '岸 具宏', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '椿 遥花', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '渡邊 有史', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['木'] },
        { name: '箱谷 聡', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '西岡 唯', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '重岡 靖', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '水', '木', '金'] },
    ];

    function buildDefaultDoctors() {
        return DEFAULT_DOCTORS.map(d => ({
            id: generateId(),
            name: d.name,
            group: d.group,
            department: DEPARTMENT_BY_NAME[normalizeName(d.name)] || '',
            outpatientDays: d.outpatientDays || [],
            holidayErDayPreferred: d.holidayErDayPreferred,
            ngDates1: [], ngDates2: [], ngDates3: [],
            notes: '', preferredDates1: [], preferredDates2: [], preferredDates: []
        }));
    }

    // ===== Group Helpers =====
    function isJunior(g) { return g === '3-5年目' || g === '6-7年目'; }
    function isSeniorGroup(g) { return g === '副医長' || g === '医長' || g === '副部長' || g === '部長' || g === '副部長以上'; }

    function getGroupBadgeClass(g) {
        return { '3-5年目': 'badge-group-35', '6-7年目': 'badge-group-67', '副医長': 'badge-group-fuku', '医長': 'badge-group-ichou', '副部長': 'badge-group-fukubucho', '部長': 'badge-group-bucho', '副部長以上': 'badge-group-bucho' }[g] || '';
    }

    function normalizeGroupName(group) {
        const g = String(group || '').trim().replace(/–/g, '-');
        const map = {
            '3-5年目群': '3-5年目',
            '3-5年目': '3-5年目',
            '6-7年目群': '6-7年目',
            '6-7年目': '6-7年目',
            '副医長群': '副医長',
            '副医長': '副医長',
            '医長群': '医長',
            '医長': '医長',
            '副部長': '副部長',
            '部長': '部長',
            '副部長以上群': '副部長以上',
            '副部長以上': '副部長以上'
        };
        return map[g] || null;
    }

    // ===== Utilities =====
    function normalizeName(n) { return (n || '').trim().replace(/\u3000/g, ' ').replace(/\s+/g, ' ').trim(); }
    function normalizeDoctorMatchName(n) { return normalizeName(n).replace(/\s+/g, ''); }
    function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }
    function getDepartmentByName(name) { return DEPARTMENT_BY_NAME[normalizeName(name)] || ''; }
    function isCardiologyDoctor(doc) {
        return (doc.department || getDepartmentByName(doc.name)) === '循環器内科';
    }
    function isPriorityErNightDoctor(doc) {
        return PRIORITY_ER_NIGHT_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isFemaleDoctor(doc) {
        return FEMALE_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isWardDayOnlyDoctor(doc) {
        return WARD_DAY_ONLY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isFemaleSundayWardDaySlot(doc, dateObj, role) {
        return isFemaleDoctor(doc) && role === 'wardDay' && dateObj && dateObj.getDay() === 0;
    }
    function canAutoAssignFixedFemaleDoctor(doc, dateObj, role) {
        return !isFemaleDoctor(doc) || isFemaleSundayWardDaySlot(doc, dateObj, role);
    }
    function canWeekdayWardNightChief(doc, dateObj, dateStr) {
        return doc.group === '部長' &&
            WEEKDAY_WARD_NIGHT_CHIEF_NAMES.has(normalizeName(doc.name)) &&
            !doc.holidayErDayPreferred &&
            dateObj &&
            !isHoliday(dateObj, dateStr);
    }
    function isWeekendPrioritySeniorDoctor(doc) {
        return (doc.group === '副部長' || doc.group === '部長' || doc.group === '副部長以上') && !isCardiologyDoctor(doc);
    }
    function canDoWardDayDoctor(doc) {
        return isSeniorGroup(doc.group) && !isPriorityErNightDoctor(doc);
    }
    function canDoWardNightPrimaryDoctor(doc, dateObj, dateStr) {
        return isSeniorGroup(doc.group) &&
            !isPriorityErNightDoctor(doc) &&
            (doc.group !== '部長' || canWeekdayWardNightChief(doc, dateObj, dateStr));
    }
    function canDoWardNightBackupDoctor(doc) {
        return doc.group === '6-7年目' && !isPriorityErNightDoctor(doc);
    }
    function canDoWardNightDoctor(doc, dateObj, dateStr) {
        return canDoWardNightPrimaryDoctor(doc, dateObj, dateStr) || canDoWardNightBackupDoctor(doc);
    }
    function canDoErNightDoctor(doc) {
        return isJunior(doc.group) || isPriorityErNightDoctor(doc);
    }

    function formatDateStr(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    function getMonthKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    function parseFlexibleDate(str, refYear, refMonth) {
        if (!str) return null;
        str = str.trim();
        let m;
        m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
        m = str.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        if (m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
        m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (m) return `${m[3]}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
        m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
        if (m) return `20${m[3]}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
        m = str.match(/^(\d{1,2})-(\d{1,2})$/);
        if (m) return `${refYear}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
        m = str.match(/^(\d{1,2})\/(\d{1,2})$/);
        if (m) return `${refYear}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
        m = str.match(/(\d{1,2})月(\d{1,2})日/);
        if (m) return `${refYear}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
        m = str.match(/^(\d{1,2})$/);
        if (m && refMonth) return `${refYear}-${String(refMonth).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
        return null;
    }

    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
                else inQuotes = !inQuotes;
            } else if (line[i] === ',' && !inQuotes) {
                result.push(current); current = '';
            } else {
                current += line[i];
            }
        }
        result.push(current);
        return result;
    }

    function cleanImportCell(value) {
        if (value === null || value === undefined) return '';
        if (value instanceof Date) return formatDateStr(value);
        return String(value).replace(/^"|"$/g, '').trim();
    }

    function normalizeImportHeader(value) {
        return cleanImportCell(value)
            .replace(/^\uFEFF/, '')
            .replace(/[\s\n\r　（）()]/g, '')
            .replace(/[①１]/g, '1')
            .replace(/[②２]/g, '2')
            .replace(/[③３]/g, '3')
            .replace(/任意/g, '');
    }

    function findImportColumn(headers, aliases) {
        const normalizedHeaders = headers.map(normalizeImportHeader);
        return aliases.reduce((found, alias) => {
            if (found >= 0) return found;
            return normalizedHeaders.indexOf(normalizeImportHeader(alias));
        }, -1);
    }

    function parseImportDateList(value, refYear, refMonth) {
        const text = cleanImportCell(value);
        if (!text) return [];
        return text
            .split(/[,、\s]+/)
            .map(s => parseFlexibleDate(s.trim(), refYear, refMonth))
            .filter(Boolean);
    }

    function buildFormRowsFromAoA(rows) {
        const nonEmptyRows = rows.filter(row => row.some(cell => cleanImportCell(cell)));
        if (nonEmptyRows.length === 0) return [];
        const headerRowIndex = nonEmptyRows.findIndex(row => {
            const headers = row.map(normalizeImportHeader);
            const hasName = headers.includes('医師名') || headers.includes('名前');
            const hasDutyFields = headers.some(h => h.startsWith('希望日')) || headers.some(h => h.startsWith('不可日'));
            return hasName && hasDutyFields;
        });
        if (headerRowIndex < 0) {
            throw new Error('フォーム回答の見出し行が見つかりません。医師名・希望日・不可日の列を確認してください。');
        }
        const headers = nonEmptyRows[headerRowIndex];
        const columns = {
            name: findImportColumn(headers, ['名前', '医師名']),
            preferred1: findImportColumn(headers, ['希望日1', '希望日①']),
            preferred2: findImportColumn(headers, ['希望日2', '希望日②']),
            ng1: findImportColumn(headers, ['不可日1', '不可日①']),
            ng2: findImportColumn(headers, ['不可日2', '不可日②']),
            ng3: findImportColumn(headers, ['不可日3', '不可日③']),
            notes: findImportColumn(headers, ['備考', '備考任意'])
        };
        if (columns.name < 0) {
            throw new Error('医師名または名前の列が見つかりません。');
        }
        return nonEmptyRows.slice(headerRowIndex + 1).map(row => ({
            name: cleanImportCell(row[columns.name]),
            preferred1: columns.preferred1 >= 0 ? row[columns.preferred1] : '',
            preferred2: columns.preferred2 >= 0 ? row[columns.preferred2] : '',
            ng1: columns.ng1 >= 0 ? row[columns.ng1] : '',
            ng2: columns.ng2 >= 0 ? row[columns.ng2] : '',
            ng3: columns.ng3 >= 0 ? row[columns.ng3] : '',
            notes: columns.notes >= 0 ? cleanImportCell(row[columns.notes]) : ''
        })).filter(row => row.name);
    }

    function readCsvRows(text) {
        return text.replace(/^\uFEFF/, '')
            .split(/\r?\n/)
            .filter(l => l.trim() !== '')
            .map(parseCSVLine);
    }

    function readWorkbookRows(arrayBuffer) {
        if (typeof XLSX === 'undefined') {
            throw new Error('Excel読込ライブラリが読み込まれていません。画面を再読み込みしてください。');
        }
        const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
        const preferred = ['フォームの回答 1', '02_フォーム回答_入力', '04_アプリ取込_月次更新'];
        const sheetNames = [
            ...preferred.filter(name => wb.SheetNames.includes(name)),
            ...wb.SheetNames.filter(name => !preferred.includes(name))
        ];
        for (const sheetName of sheetNames) {
            const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
                header: 1,
                raw: false,
                dateNF: 'yyyy-mm-dd',
                defval: ''
            });
            try {
                if (buildFormRowsFromAoA(rows).length > 0) return rows;
            } catch (e) {
                // 次のシートを確認する
            }
        }
        return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd',
            defval: ''
        });
    }

    // ===== Data Migration =====
    function migrateDoctor(doc) {
        const defaultDoctor = DEFAULT_DOCTORS.find(d => normalizeName(d.name) === normalizeName(doc.name));
        let group = normalizeGroupName(doc.group) || '3-5年目';
        if (defaultDoctor && group === '副部長以上') group = defaultDoctor.group;
        if (defaultDoctor && normalizeName(doc.name) === '松井 佐織') group = defaultDoctor.group;
        let holidayErDayPreferred = !!doc.holidayErDayPreferred;
        if (!normalizeGroupName(doc.group)) {
            if (doc.isSenior) {
                group = doc.canDoWeekendER ? '医長' : '副医長';
                holidayErDayPreferred = !!doc.canDoWeekendER;
            }
        }
        const outpatientDays = defaultDoctor ? (defaultDoctor.outpatientDays || []) : (doc.outpatientDays || []);
        const preferredDates1 = doc.preferredDates1 || [];
        const preferredDates2 = doc.preferredDates2 || [];
        const preferredDates = [...new Set([
            ...preferredDates1,
            ...preferredDates2,
            ...(doc.preferredDates || [])
        ])];
        return {
            id: doc.id, name: doc.name, group,
            department: doc.department || getDepartmentByName(doc.name),
            outpatientDays,
            holidayErDayPreferred,
            ngDates1: doc.ngDates1 || doc.hardNgDates || [],
            ngDates2: doc.ngDates2 || doc.softNgDates || [],
            ngDates3: doc.ngDates3 || [],
            notes: doc.notes || '',
            preferredDates1,
            preferredDates2,
            preferredDates
        };
    }

    function migrateShifts(shifts) {
        const out = {};
        for (const date in shifts) {
            out[date] = {};
            for (const role in shifts[date]) {
                if (role === 'ward') out[date].wardNight = shifts[date][role];
                else if (role === 'er') out[date].erNight = shifts[date][role];
                else out[date][role] = shifts[date][role];
            }
            const [yy, mm, dd] = String(date).split('-').map(Number);
            const dateObj = new Date(yy, (mm || 1) - 1, dd || 1);
            if (dateObj.getDay() === 6 && out[date].wardDay) {
                if (!out[date].wardNight) out[date].wardNight = out[date].wardDay;
                delete out[date].wardDay;
            }
            if (Object.keys(out[date]).length === 0) delete out[date];
        }
        return out;
    }

    function migrateSavedMonths(savedMonths) {
        const out = {};
        for (const [monthKey, snapshot] of Object.entries(savedMonths || {})) {
            out[monthKey] = {
                ...(snapshot || {}),
                shifts: migrateShifts((snapshot && snapshot.shifts) || {})
            };
        }
        return out;
    }

    // ===== State =====
    let pendingNgDates = [];
    let editingDateStr = null;
    let editingDateObj = null;

	    const rawDoctors = JSON.parse(localStorage.getItem('doctors')) || [];
	    const rawShifts = JSON.parse(localStorage.getItem('shifts')) || {};
	    const rawSavedMonths = migrateSavedMonths(JSON.parse(localStorage.getItem('savedMonths')) || {});

	    const state = {
	        currentDate: new Date(),
	        doctors: rawDoctors.map(migrateDoctor),
	        shifts: migrateShifts(rawShifts),
	        holidays: {},
	        specialDayRules: JSON.parse(localStorage.getItem('specialDayRules')) || {},
	        savedMonths: rawSavedMonths,
	        formResponseStatus: JSON.parse(localStorage.getItem('formResponseStatus')) || {}
	    };

    // ===== DOM References =====
    const els = {
        currentMonthDisplay: document.getElementById('current-month-display'),
        prevMonthBtn: document.getElementById('prev-month'),
        nextMonthBtn: document.getElementById('next-month'),
	        todayBtn: document.getElementById('today-btn'),
	        autoAssignBtn: document.getElementById('auto-assign-btn'),
	        exportExcelBtn: document.getElementById('export-excel-btn'),
	        saveMonthBtn: document.getElementById('save-month-btn'),
	        calendarGrid: document.getElementById('calendar-grid'),
        doctorList: document.getElementById('doctor-list'),
        addDoctorForm: document.getElementById('add-doctor-form'),
        newDocName: document.getElementById('new-doctor-name'),
        newDocGroup: document.getElementById('new-doctor-group'),
        newDocHolidayErDay: document.getElementById('new-doctor-holiday-er-day'),
        newDocOutpt: document.getElementById('new-doctor-outpatient'),
        ngDateVal: document.getElementById('ng-date-val'),
        ngWeightVal: document.getElementById('ng-weight-val'),
        addNgBtn: document.getElementById('add-ng-btn'),
        pendingNgList: document.getElementById('pending-ng-list'),
        formCsvUpload: document.getElementById('form-csv-upload'),
        clearAllBtn: document.getElementById('clear-all-data-btn'),
        modal: document.getElementById('assignment-modal'),
        modalOverlay: document.getElementById('modal-overlay'),
        closeModalBtn: document.getElementById('close-modal'),
        cancelAssignmentBtn: document.getElementById('cancel-assignment'),
        saveAssignmentBtn: document.getElementById('save-assignment'),
        modalDateDisplay: document.getElementById('modal-date-display'),
        modalWarnings: document.getElementById('modal-warnings'),
        selectDayType: document.getElementById('select-day-type'),
        selects: {
            wardDay: document.getElementById('select-ward-day'),
            wardNight: document.getElementById('select-ward-night'),
            erDay: document.getElementById('select-er-day'),
            erNight: document.getElementById('select-er-night'),
        },
        fgs: {
            wardDay: document.getElementById('fg-ward-day'),
            wardNight: document.getElementById('fg-ward-night'),
            erDay: document.getElementById('fg-er-day'),
            erNight: document.getElementById('fg-er-night'),
        }
    };

    // ===== Persistence =====
    function saveData() {
	        localStorage.setItem('doctors', JSON.stringify(state.doctors));
	        localStorage.setItem('shifts', JSON.stringify(state.shifts));
	        localStorage.setItem('specialDayRules', JSON.stringify(state.specialDayRules));
	        localStorage.setItem('savedMonths', JSON.stringify(state.savedMonths));
	        localStorage.setItem('formResponseStatus', JSON.stringify(state.formResponseStatus));
	    }

    // ===== Holidays & Day Types =====
    async function fetchHolidays() {
        try {
            const res = await fetch('https://holidays-jp.github.io/api/v1/date.json');
            if (res.ok) state.holidays = await res.json();
        } catch (e) { console.warn('Holiday API Error', e); }
    }

    // 第1・第3土曜日かどうか判定
    function isFixedErDaySaturday(dateObj) {
        if (dateObj.getDay() !== 6) return false;
        const nth = Math.floor((dateObj.getDate() - 1) / 7) + 1;
        return nth === 1 || nth === 3;
    }

    function isHoliday(dateObj, dateStr) {
        const special = state.specialDayRules[dateStr];
        if (special === 'weekday') return false;
        if (special === 'holiday') return true;
        return dateObj.getDay() === 0 || dateObj.getDay() === 6 || !!state.holidays[dateStr];
    }

    function getRequiredRoles(dateObj, dateStr) {
        const isHol = isHoliday(dateObj, dateStr);
        if (!isHol) return ['wardNight', 'erNight'];
        if (dateObj.getDay() === 6) return ['wardNight', 'erDay', 'erNight'];
        return ['wardDay', 'wardNight', 'erDay', 'erNight'];
    }

    function getRoleLabelForDayType(role, dateObj, isHol) {
        if (role === 'wardNight' && isHol && dateObj.getDay() === 6) return '🏥病棟';
        return ROLE_LABELS[role];
    }

    function getRoleLabel(role, dateObj, dateStr) {
        return getRoleLabelForDayType(role, dateObj, isHoliday(dateObj, dateStr));
    }

	    // ===== Monthly Stats =====
	    function getCurrentMonthKey() { return getMonthKey(state.currentDate); }

	    function getMonthKeyFromDateStr(dateStr) {
	        return dateStr.slice(0, 7);
	    }

	    function getShiftForDate(dateStr) {
	        if (state.shifts[dateStr]) return state.shifts[dateStr];
	        if (getMonthKeyFromDateStr(dateStr) === getCurrentMonthKey()) return {};
	        const savedMonth = state.savedMonths[getMonthKeyFromDateStr(dateStr)];
	        return (savedMonth && savedMonth.shifts && savedMonth.shifts[dateStr]) || {};
	    }

    function getCurrentFormResponseStatus() {
        return state.formResponseStatus[getCurrentMonthKey()] || null;
    }

    function hasFormResponseStatus() {
        const status = getCurrentFormResponseStatus();
        return !!(status && Array.isArray(status.responders));
    }

    function getCurrentResponderSet() {
        const status = getCurrentFormResponseStatus();
        return new Set(((status && status.responders) || []).map(normalizeDoctorMatchName));
    }

    function isFormNonResponder(doc) {
        if (!hasFormResponseStatus()) return false;
        return !getCurrentResponderSet().has(normalizeDoctorMatchName(doc.name));
    }

    function getFormNonResponderDoctors() {
        if (!hasFormResponseStatus()) return [];
        return state.doctors.filter(doc => isFormNonResponder(doc));
    }

    function needsFormNonResponderDuty(doc) {
        return isFormNonResponder(doc) && getDoctorMonthlyCount(doc.id) === 0;
    }

    function getDoctorMonthlyCount(doctorId, excludeDate) {
        let count = 0;
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m) {
                for (const val of Object.values(sh)) { if (val === doctorId) count++; }
            }
        }
        return count;
    }

    function hasErDayThisMonth(doctorId, excludeDate) {
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m && sh.erDay === doctorId) return true;
        }
        return false;
    }

    function isWeekendDate(dateObj) {
        const day = dateObj.getDay();
        return day === 0 || day === 6;
    }

    function getWeekendDutyCount(doctorId, excludeDate) {
        let count = 0;
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m && isWeekendDate(sd)) {
                for (const val of Object.values(sh)) {
                    if (val === doctorId) count++;
                }
            }
        }
        return count;
    }

    function hasNonErDayThisMonth(doctorId, excludeDate) {
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m) {
                for (const [role, val] of Object.entries(sh)) {
                    if (role !== 'erDay' && val === doctorId) return true;
                }
            }
        }
        return false;
    }

    function findDoctorName(id) {
        if (!id) return null;
        const doc = state.doctors.find(d => d.id === id);
        if (doc) return doc.name;
        return null;
    }

    function getDoctorPreferenceRank(doc, dateStr) {
        if ((doc.preferredDates1 || []).includes(dateStr)) return 1;
        if ((doc.preferredDates2 || []).includes(dateStr)) return 2;
        if ((doc.preferredDates || []).includes(dateStr)) return 2;
        return 0;
    }

    function getDoctorNoteWarning(doc) {
        const note = (doc.notes || '').trim();
        if (!note) return null;
        const compact = note.replace(/\s+/g, ' ');
        const shortNote = compact.length > 80 ? compact.slice(0, 80) + '...' : compact;
        if (compact.includes('絶対')) return `備考に「絶対」あり（要確認）: ${shortNote}`;
        return `備考あり（要確認）: ${shortNote}`;
    }

    function getWarningLabels(warning) {
        const labels = [];
        if (!warning) return labels;
        if (warning.includes('不可日(第2希望)')) labels.push('NG第2');
        if (warning.includes('不可日(第3希望)')) labels.push('NG第3');
        if (warning.includes('備考に「絶対」')) labels.push('絶対備考');
        else if (warning.includes('備考あり')) labels.push('備考');
        return labels;
    }

    function setShiftBadgeMainText(badge, text) {
        badge.textContent = '';
        const main = document.createElement('span');
        main.className = 'shift-main';
        main.textContent = text;
        badge.appendChild(main);
    }

    function appendWarningLabels(badge, warning) {
        getWarningLabels(warning).forEach(label => {
            const chip = document.createElement('span');
            chip.className = label === '絶対備考' ? 'warning-label warning-label-strong' : 'warning-label';
            chip.textContent = label;
            badge.appendChild(chip);
        });
    }

    function isHardRuleError(error) {
        if (!error) return false;
        return [
            '上限に達しています',
            '休日救急日中希望がOFFです',
            '休日救急日中は月1回が上限です',
            '月2回が上限です',
            '今月他の当直枠があります',
            '今月他の当直枠があるため',
            '救急夜間は7年目以下',
            '病棟は8年目以上のみ担当可能です',
            '病棟夜間は8年目以上、または不足時6-7年目のみ担当可能です',
            '部長は病棟夜間に割り当て不可です',
            '部長はこの病棟夜間枠に割り当て不可です',
            '岸先生は救急夜間枠のみ担当可能です',
            '救急日直希望○のため',
            '今月休日救急日中を担当済み',
            '部長は平日救急夜間に割り当て不可です',
            '吉井先生は日曜病棟日中のみ担当可能です',
            '翌日が外来です',
            '不可日(第1希望)です',
            '不可日(第2希望)です',
            '不可日(第3希望)です',
            '連続当直禁止',
            '同一週にすでに当直があります',
            '土日は月1回が上限です',
            '同日の別枠に割り当て済みです'
        ].some(token => error.includes(token));
    }

    // ===== Assignment Rule Checking =====
    function checkAssignmentRule(doctorId, role, dateObj) {
        if (!doctorId) return { valid: true, error: null, warning: null };
        const dateStr = formatDateStr(dateObj);
        const errs = [];
        const warns = [];
        // --- Regular doctor ---
        const doctor = state.doctors.find(d => d.id === doctorId);
        if (!doctor) return { valid: false, error: '医師が見つかりません', warning: null };
        if (getDoctorMonthlyCount(doctorId, dateStr) >= 2) errs.push('月2回が上限です');
        if (isWardDayOnlyDoctor(doctor) && !isFemaleSundayWardDaySlot(doctor, dateObj, role)) {
            errs.push('吉井先生は日曜病棟日中のみ担当可能です');
        }

        // 1. Role-Group constraints
        if (role === 'erDay') {
            if (!doctor.holidayErDayPreferred) errs.push('休日救急日中希望がOFFです');
            // Monthly erDay limit (1回)
            let erDayCount = 0;
            const y = state.currentDate.getFullYear(), mo = state.currentDate.getMonth();
            for (const [ds, sh] of Object.entries(state.shifts)) {
                const sd = new Date(ds);
                if (sd.getFullYear() === y && sd.getMonth() === mo && sh.erDay === doctorId && ds !== dateStr) erDayCount++;
            }
            if (erDayCount >= 1) errs.push('休日救急日中は月1回が上限です');
            // Exclusivity: has other shifts this month?
            if (hasNonErDayThisMonth(doctorId, dateStr)) errs.push('今月他の当直枠があるため休日救急日中に割り当てられません');
        } else if (role === 'erNight') {
            if (!canDoErNightDoctor(doctor)) errs.push('救急夜間は7年目以下、または岸先生のみ担当可能です');
        } else if (role === 'wardDay') {
            if (isPriorityErNightDoctor(doctor)) errs.push('岸先生は救急夜間枠のみ担当可能です');
            else if (!canDoWardDayDoctor(doctor)) errs.push('病棟は8年目以上のみ担当可能です');
        } else if (role === 'wardNight') {
            if (isPriorityErNightDoctor(doctor)) {
                errs.push('岸先生は救急夜間枠のみ担当可能です');
            } else if (!canDoWardNightDoctor(doctor, dateObj, dateStr)) {
                errs.push(doctor.group === '部長' ? '部長はこの病棟夜間枠に割り当て不可です' : '病棟夜間は8年目以上、または不足時6-7年目のみ担当可能です');
            }
        }

        if (
            doctor.group === '部長' &&
            !isHoliday(dateObj, dateStr) &&
            role !== 'wardNight'
        ) {
            errs.push('部長は平日救急夜間に割り当て不可です');
        }

        if (isWeekendDate(dateObj) && getWeekendDutyCount(doctorId, dateStr) >= 1) {
            errs.push('土日は月1回が上限です');
        }

        // 救急日直希望○の通常医師は、救急医固定以外の休日救急日中のみ担当
        if (doctor.holidayErDayPreferred && role !== 'erDay') {
            errs.push('救急日直希望○のため、救急日中以外には割り当て不可です');
        }

        // Month exclusivity reverse: has erDay this month → can't do other roles
        if (role !== 'erDay' && hasErDayThisMonth(doctorId, dateStr)) {
            errs.push('今月休日救急日中を担当済みのため、他枠への割り当て不可です');
        }

        // 2. Outpatient: 翌日外来は夜間当直のみ考慮し、日直(日中)では考慮しない
        if ((role === 'wardNight' || role === 'erNight') && doctor.outpatientDays && doctor.outpatientDays.length > 0) {
            const nextDay = new Date(dateObj); nextDay.setDate(nextDay.getDate() + 1);
            if (doctor.outpatientDays.includes(DAY_NAMES[nextDay.getDay()])) errs.push('翌日が外来です');
        }

        // 3. NG Dates
        const ng1 = doctor.ngDates1 || [];
        const ng2 = doctor.ngDates2 || [];
        const ng3 = doctor.ngDates3 || [];
        if (ng1.includes(dateStr)) errs.push('不可日(第1希望)です');
        else if (ng2.includes(dateStr)) errs.push('不可日(第2希望)です');
        else if (ng3.includes(dateStr)) errs.push('不可日(第3希望)です');

        if (isFemaleDoctor(doctor) && !isFemaleSundayWardDaySlot(doctor, dateObj, role)) {
            warns.push('固定女性医師は原則、日曜病棟日中のみです');
        }

        const noteWarning = getDoctorNoteWarning(doctor);
        if (noteWarning) warns.push(noteWarning);

        // 4. Consecutive shifts
        const prevDay = new Date(dateObj); prevDay.setDate(prevDay.getDate() - 1);
        const nextDay2 = new Date(dateObj); nextDay2.setDate(nextDay2.getDate() + 1);
	        if (Object.values(getShiftForDate(formatDateStr(prevDay))).includes(doctorId)) errs.push('前日も当直です（連続当直禁止）');
	        if (Object.values(getShiftForDate(formatDateStr(nextDay2))).includes(doctorId)) errs.push('翌日も当直です（連続当直禁止）');

        // 5. Same week 2x
        const weekStart = new Date(dateObj);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        let weekCount = 0;
        for (let i = 0; i < 7; i++) {
            const wd = new Date(weekStart);
            wd.setDate(weekStart.getDate() + i);
            const wds = formatDateStr(wd);
            if (wds === dateStr) continue;
	            if (Object.values(getShiftForDate(wds)).includes(doctorId)) weekCount++;
        }
        if (weekCount >= 1) errs.push('同一週にすでに当直があります（週2回禁止）');

        // 6. Same-day duplicate (against saved state)
        const dayShifts = state.shifts[dateStr] || {};
        for (const [r, id] of Object.entries(dayShifts)) {
            if (r !== role && id === doctorId) { errs.push('同日の別枠に割り当て済みです'); break; }
        }

        return {
            valid: errs.length === 0,
            error: errs.length ? errs.join(' / ') : null,
            warning: warns.length ? warns.join(' / ') : null
        };
    }

    function getDayAssignmentIssues(dateObj, dateStr, includeWarnings = false) {
        const issues = [];
        const dayShifts = state.shifts[dateStr] || {};
        getRequiredRoles(dateObj, dateStr).forEach(role => {
            if (role === 'erDay' && isFixedErDaySaturday(dateObj)) return;
            const doctorId = dayShifts[role];
            if (!doctorId) return;
            const rule = checkAssignmentRule(doctorId, role, dateObj);
            const roleLabel = getRoleLabel(role, dateObj, dateStr);
            if (!rule.valid) issues.push(roleLabel + ': ' + rule.error);
            else if (includeWarnings && rule.warning) issues.push(roleLabel + ': ' + rule.warning);
        });
        return issues;
    }

    function getDayExceptionIssues(dateObj, dateStr) {
        return getDayAssignmentIssues(dateObj, dateStr, false);
    }

    // ===== NG Dates UI =====
    function renderPendingNgs() {
        els.pendingNgList.innerHTML = '';
        const labelMap = { hard: '第1希望不可', soft: '第2希望不可', soft3: '第3希望不可' };
        pendingNgDates.forEach((ng, i) => {
            const li = document.createElement('li');
            li.className = `pending-ng-item ${ng.type === 'hard' ? 'hard' : 'soft'}`;
            li.innerHTML = `<span>${ng.date} (${labelMap[ng.type]})</span> <span class="remove-ng" data-idx="${i}">x</span>`;
            els.pendingNgList.appendChild(li);
        });
        document.querySelectorAll('.remove-ng').forEach(btn => {
            btn.addEventListener('click', e => { pendingNgDates.splice(e.currentTarget.dataset.idx, 1); renderPendingNgs(); });
        });
    }

    els.addNgBtn.addEventListener('click', () => {
        const d = els.ngDateVal.value;
        if (d) { pendingNgDates.push({ date: d, type: els.ngWeightVal.value }); els.ngDateVal.value = ''; renderPendingNgs(); }
    });

    // ===== Doctor Management =====
    els.addDoctorForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = normalizeName(els.newDocName.value);
        if (!name) return;
        const group = els.newDocGroup.value;
        const holidayErDayPreferred = els.newDocHolidayErDay.checked;
        const outpt = [];
        DAY_NAMES.forEach(d => { if (els.newDocOutpt.value.includes(d)) outpt.push(d); });
        const ng1 = pendingNgDates.filter(n => n.type === 'hard').map(n => n.date);
        const ng2 = pendingNgDates.filter(n => n.type === 'soft').map(n => n.date);
        const ng3 = pendingNgDates.filter(n => n.type === 'soft3').map(n => n.date);

        state.doctors.push({
            id: generateId(), name, group, outpatientDays: outpt, holidayErDayPreferred,
            ngDates1: ng1, ngDates2: ng2, ngDates3: ng3, notes: '', preferredDates: []
        });
        els.newDocName.value = ''; els.newDocGroup.value = '3-5年目';
        els.newDocHolidayErDay.checked = false; els.newDocOutpt.value = '';
        pendingNgDates = []; renderPendingNgs();
        saveData(); renderDoctors(); renderCalendar();
    });

    function removeDoctor(id) {
        if (!confirm('削除しますか？')) return;
        state.doctors = state.doctors.filter(d => d.id !== id);
        for (const date in state.shifts) {
            for (const role in state.shifts[date]) {
                if (state.shifts[date][role] === id) delete state.shifts[date][role];
            }
            if (Object.keys(state.shifts[date]).length === 0) delete state.shifts[date];
        }
        saveData(); renderDoctors(); renderCalendar();
    }

    function applyFormResponseRows(rows) {
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth() + 1;
        const latestByName = new Map();
        const responseCounts = new Map();
        const notFound = [];
        const notFoundSet = new Set();

        rows.forEach(row => {
            const normalizedN = normalizeDoctorMatchName(row.name);
            if (!normalizedN) return;
            const doc = state.doctors.find(d => normalizeDoctorMatchName(d.name) === normalizedN);
            if (!doc) {
                if (!notFoundSet.has(normalizedN)) {
                    notFound.push(row.name);
                    notFoundSet.add(normalizedN);
                }
                return;
            }
            responseCounts.set(normalizedN, (responseCounts.get(normalizedN) || 0) + 1);
            latestByName.set(normalizedN, { doc, row });
        });

        latestByName.forEach(({ doc, row }) => {
            doc.preferredDates1 = parseImportDateList(row.preferred1, y, m);
            doc.preferredDates2 = parseImportDateList(row.preferred2, y, m);
            doc.preferredDates = [...new Set([...doc.preferredDates1, ...doc.preferredDates2])];
            doc.ngDates1 = parseImportDateList(row.ng1, y, m);
            doc.ngDates2 = parseImportDateList(row.ng2, y, m);
            doc.ngDates3 = parseImportDateList(row.ng3, y, m);
            doc.notes = cleanImportCell(row.notes);
        });

        const duplicateNames = [...responseCounts.entries()]
            .filter(([, count]) => count > 1)
            .map(([name]) => name);
        const responders = [...latestByName.values()].map(({ doc }) => doc.name);
        const responderSet = new Set(responders.map(normalizeDoctorMatchName));
        const missingDoctors = state.doctors.filter(doc =>
            !responderSet.has(normalizeDoctorMatchName(doc.name))
        );
        state.formResponseStatus[getCurrentMonthKey()] = {
            importedAt: new Date().toISOString(),
            responders,
            duplicateNames,
            notFound
        };

        return {
            updated: latestByName.size,
            duplicateNames,
            notFound,
            missingDoctors
        };
    }

    function showFormImportResult(result) {
        let msg = `${result.updated}名のフォーム回答を更新しました。`;
        msg += '\n外来曜日はアプリ内医師マスタを使用します。';
        msg += `\n\n回答済み: ${result.updated}名`;
        msg += `\n未回答: ${result.missingDoctors.length}名`;
        if (result.missingDoctors.length > 0) {
            msg += `\n${result.missingDoctors.map(d => d.name).join('、')}`;
        }
        if (result.duplicateNames.length > 0) {
            msg += `\n\n重複回答: ${result.duplicateNames.length}名（後の回答を採用）\n${result.duplicateNames.join('、')}`;
        }
        if (result.notFound.length > 0) {
            msg += `\n\n⚠️ 以下の医師名は一致しませんでした:\n${result.notFound.join('\n')}`;
        }
        alert(msg);
    }

    // ===== Form Import: Google Form Response =====
    els.formCsvUpload.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const rows = file.name.toLowerCase().endsWith('.xlsx')
                    ? readWorkbookRows(evt.target.result)
                    : readCsvRows(evt.target.result);
                const formRows = buildFormRowsFromAoA(rows);
                const result = applyFormResponseRows(formRows);
                saveData(); renderDoctors(); renderCalendar();
                showFormImportResult(result);
            } catch (err) {
                alert('フォーム回答を取り込めませんでした。\n\n' + (err && err.message ? err.message : err));
            }
            els.formCsvUpload.value = '';
        };
        if (file.name.toLowerCase().endsWith('.xlsx')) reader.readAsArrayBuffer(file);
        else reader.readAsText(file, 'UTF-8');
    });

    // ===== Clear All =====
	    els.clearAllBtn.addEventListener('click', () => {
	        if (!confirm('全データを消去しますか？')) return;
	        state.doctors = []; state.shifts = {}; state.specialDayRules = {}; state.savedMonths = {}; state.formResponseStatus = {};
	        saveData(); renderDoctors(); renderCalendar();
	    });

    // ===== Rendering: Doctor List =====
    function renderDoctors() {
        els.doctorList.innerHTML = '';
        if (state.doctors.length === 0) {
            els.doctorList.innerHTML = '<li class="doctor-item" style="color:#aaa;">なし</li>'; return;
        }
        state.doctors.forEach(doc => {
            const count = getDoctorMonthlyCount(doc.id);
            const li = document.createElement('li');
            li.className = 'doctor-item';
            const groupCls = getGroupBadgeClass(doc.group);
            let badges = `<span class="badge-group ${groupCls}">${doc.group}</span>`;
            if (doc.holidayErDayPreferred) badges += '<span class="badge-erday-pref">救急日中可</span>';
            if (isFormNonResponder(doc)) badges += '<span class="badge-form-missing">未回答</span>';
            const opStr = doc.outpatientDays?.length ? doc.outpatientDays.join('・') : 'なし';
            const ngCount = (doc.ngDates1 || []).length + (doc.ngDates2 || []).length + (doc.ngDates3 || []).length;
            const ngStr = ngCount > 0 ? ` / NG:${ngCount}日` : '';
            const erDayFlag = hasErDayThisMonth(doc.id) ? ' / 🚑日中済' : '';
            const noteFlag = doc.notes ? (doc.notes.includes('絶対') ? ' / 絶対備考' : ' / 備考あり') : '';
            li.innerHTML = `
                <div class="doctor-info">
                    <span class="doctor-name">${doc.name} ${badges}</span>
                    <span class="doctor-meta">外来: ${opStr}${ngStr}${erDayFlag}${noteFlag}</span>
                    <span class="doctor-count">今月: ${count}回</span>
                </div>
                <button class="remove-doctor-btn" data-id="${doc.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>`;
            els.doctorList.appendChild(li);
        });
        els.doctorList.querySelectorAll('.remove-doctor-btn').forEach(b =>
            b.addEventListener('click', e => removeDoctor(e.currentTarget.dataset.id))
        );
    }

    // ===== Rendering: Calendar =====
	    function renderCalendar() {
	        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
	        const monthKey = getMonthKey(state.currentDate);
	        const savedLabel = state.savedMonths[monthKey] ? '（保存済）' : '';
	        els.currentMonthDisplay.textContent = `${y}年 ${m + 1}月${savedLabel}`;
        els.calendarGrid.innerHTML = '';
        const fd = new Date(y, m, 1), ld = new Date(y, m + 1, 0);
        const td = new Date();
        const isCurr = td.getFullYear() === y && td.getMonth() === m;

        for (let i = 0; i < fd.getDay(); i++) {
            const e = document.createElement('div'); e.className = 'calendar-day empty';
            els.calendarGrid.appendChild(e);
        }

        for (let d = 1; d <= ld.getDate(); d++) {
            const dObj = new Date(y, m, d);
            const dStr = formatDateStr(dObj);
            const isHol = isHoliday(dObj, dStr);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            if (dObj.getDay() === 0) dayDiv.classList.add('sun');
            if (dObj.getDay() === 6) dayDiv.classList.add('sat');
            if (state.holidays[dStr]) dayDiv.classList.add('hol');
            if (state.specialDayRules[dStr] === 'holiday') dayDiv.classList.add('hol');
            if (isCurr && d === td.getDate()) dayDiv.classList.add('today');

            const holName = state.holidays[dStr] || '';
            const overrideTag = state.specialDayRules[dStr]
                ? ` <span class="override-label">[${state.specialDayRules[dStr] === 'weekday' ? '平日扱' : '休日扱'}]</span>` : '';
            const exceptionIssues = getDayExceptionIssues(dObj, dStr);
            if (exceptionIssues.length > 0) dayDiv.classList.add('has-exception');
            dayDiv.innerHTML = `<div class="day-number">${d} <span class="hol-name">${holName}${overrideTag}</span></div>`;
            if (exceptionIssues.length > 0) {
                const exceptionLabel = document.createElement('span');
                exceptionLabel.className = 'exception-label';
                exceptionLabel.textContent = '例外';
                exceptionLabel.title = exceptionIssues.join(' / ');
                dayDiv.querySelector('.day-number').appendChild(exceptionLabel);
            }

            const cont = document.createElement('div'); cont.className = 'shift-slots';
            const roles = getRequiredRoles(dObj, dStr);
            const daySh = state.shifts[dStr] || {};

            roles.forEach(role => {
                const badge = document.createElement('div');
                badge.className = `shift-badge ${role}`;
                // 第1・第3土曜の救急日中は救急医固定
                if (role === 'erDay' && isFixedErDaySaturday(dObj)) {
                    badge.textContent = `${getRoleLabel(role, dObj, dStr)}: 救急医固定`;
                    badge.title = '第1・第3土曜は救急医が固定担当';
                    cont.appendChild(badge);
                    return;
                }
                const id = daySh[role];
                if (id) {
                    const docName = findDoctorName(id);
                    if (docName) {
                        const rule = checkAssignmentRule(id, role, dObj);
                        setShiftBadgeMainText(badge, `${getRoleLabel(role, dObj, dStr)}: ${docName}`);
                        if (!rule.valid) { badge.classList.add('warning'); badge.title = rule.error; }
                        else if (rule.warning) {
                            badge.classList.add('soft-warning');
                            badge.title = rule.warning;
                            appendWarningLabels(badge, rule.warning);
                        }
                    } else {
                        badge.classList.add('empty'); badge.textContent = `${getRoleLabel(role, dObj, dStr)}: 不明`;
                    }
                } else {
                    badge.classList.add('empty'); badge.textContent = `${getRoleLabel(role, dObj, dStr)}: 未割当`;
                }
                cont.appendChild(badge);
            });
            dayDiv.appendChild(cont);
            dayDiv.addEventListener('click', () => openModal(dObj, dStr));
            els.calendarGrid.appendChild(dayDiv);
        }
        renderDoctors();
    }

    // ===== Month Navigation =====
	    els.prevMonthBtn.addEventListener('click', () => { state.currentDate.setMonth(state.currentDate.getMonth() - 1); renderCalendar(); });
	    els.nextMonthBtn.addEventListener('click', () => { state.currentDate.setMonth(state.currentDate.getMonth() + 1); renderCalendar(); });
	    els.todayBtn.addEventListener('click', () => { state.currentDate = new Date(); renderCalendar(); });

	    function cloneData(value) {
	        return JSON.parse(JSON.stringify(value || {}));
	    }

	    function pickEntriesForMonth(source, monthKey) {
	        const picked = {};
	        for (const [key, value] of Object.entries(source || {})) {
	            if (key.startsWith(monthKey)) picked[key] = cloneData(value);
	        }
	        return picked;
	    }

	    function saveCurrentMonthSnapshot() {
	        const monthKey = getCurrentMonthKey();
	        const monthShifts = pickEntriesForMonth(state.shifts, monthKey);
	        const monthSpecialRules = pickEntriesForMonth(state.specialDayRules, monthKey);
	        const shiftCount = Object.values(monthShifts).reduce((sum, day) => sum + Object.keys(day || {}).length, 0);

	        if (!confirm(`${monthKey} を保存します。\n保存済み月は翌月以降の連続当直・同一週判定にも参照されます。\n\n保存しますか？`)) return;

	        state.savedMonths[monthKey] = {
	            savedAt: new Date().toISOString(),
	            shifts: monthShifts,
	            specialDayRules: monthSpecialRules
	        };
	        saveData();
	        renderCalendar();
	        alert(`${monthKey} を保存しました。\n保存した割り当て枠: ${shiftCount}件`);
	    }

	    els.saveMonthBtn.addEventListener('click', saveCurrentMonthSnapshot);

	    // ===== Modal =====
    function populateModalSelects(roles) {
        const currentShifts = state.shifts[editingDateStr] || {};
        roles.forEach(role => {
            const sel = els.selects[role];
            sel.innerHTML = '<option value="">-- 未割り当て --</option>';
            if (role === 'erDay') {
                const eligible = state.doctors.filter(d => d.holidayErDayPreferred);
                if (eligible.length > 0) {
                    const og2 = document.createElement('optgroup');
                    og2.label = '救急日中希望者';
                    eligible.forEach(doc => {
                        const opt = document.createElement('option');
                        opt.value = doc.id;
                        opt.textContent = `${doc.name} [${doc.group}] (${getDoctorMonthlyCount(doc.id)}回)`;
                        og2.appendChild(opt);
                    });
                    sel.appendChild(og2);
                }
            } else if (role === 'wardDay') {
                state.doctors.filter(d =>
                    canDoWardDayDoctor(d) &&
                    !d.holidayErDayPreferred &&
                    canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'wardDay')
                ).forEach(doc => {
                    const opt = document.createElement('option');
                    opt.value = doc.id;
                    opt.textContent = `${doc.name} [${doc.group}] (${getDoctorMonthlyCount(doc.id)}回)`;
                    sel.appendChild(opt);
                });
            } else if (role === 'wardNight') {
                state.doctors.filter(d =>
                    canDoWardNightDoctor(d, editingDateObj, editingDateStr) &&
                    !d.holidayErDayPreferred &&
                    canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'wardNight')
                ).forEach(doc => {
                    const opt = document.createElement('option');
                    opt.value = doc.id;
                    opt.textContent = `${doc.name} [${doc.group}] (${getDoctorMonthlyCount(doc.id)}回)`;
                    sel.appendChild(opt);
                });
            } else if (role === 'erNight') {
                state.doctors.filter(d =>
                    canDoErNightDoctor(d) &&
                    !d.holidayErDayPreferred &&
                    canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'erNight')
                ).forEach(doc => {
                    const opt = document.createElement('option');
                    opt.value = doc.id;
                    opt.textContent = `${doc.name} [${doc.group}] (${getDoctorMonthlyCount(doc.id)}回)`;
                    sel.appendChild(opt);
                });
            }
            // Ensure current assignee is in the list
            const curId = currentShifts[role];
            if (curId) {
                let found = false;
                for (const o of sel.options) { if (o.value === curId) { found = true; break; } }
                if (!found) {
                    const n = findDoctorName(curId);
                    if (n) { const opt = document.createElement('option'); opt.value = curId; opt.textContent = `${n} (対象外)`; sel.appendChild(opt); }
                }
            }
        });
    }

    function updateModalRoles() {
        const saved = {};
        for (const [role, sel] of Object.entries(els.selects)) { if (sel.value) saved[role] = sel.value; }

        const override = els.selectDayType.value;
        let isHol;
        if (override === 'weekday') isHol = false;
        else if (override === 'holiday') isHol = true;
        else isHol = isHoliday(editingDateObj, editingDateStr);

        let roles = !isHol
            ? ['wardNight', 'erNight']
            : (editingDateObj.getDay() === 6 ? ['wardNight', 'erDay', 'erNight'] : ['wardDay', 'wardNight', 'erDay', 'erNight']);
        // 第1・第3土曜の救急日中は固定 → セレクト非表示
        const fixedErDay = editingDateObj && isHol && isFixedErDaySaturday(editingDateObj);
        if (fixedErDay) roles = roles.filter(r => r !== 'erDay');
        ['wardDay', 'wardNight', 'erDay', 'erNight'].forEach(r => {
            if (roles.includes(r)) els.fgs[r].classList.remove('hidden');
            else { els.fgs[r].classList.add('hidden'); els.selects[r].value = ''; }
        });
        els.fgs.wardDay.querySelector('label').textContent = '🏥 病棟日中（8年目以上）';
        const weekdayWardNightChiefNote = !isHol
            ? ' / 不足時6-7年目可 / 部長は垣内・松本のみ可'
            : ' / 不足時6-7年目可 / 部長除く';
        els.fgs.wardNight.querySelector('label').textContent =
            (isHol && editingDateObj.getDay() === 6)
                ? `🏥 病棟（8年目以上${weekdayWardNightChiefNote}）`
                : `🏥 ${getRoleLabelForDayType('wardNight', editingDateObj, isHol).replace('🏥', '').trim()}（8年目以上${weekdayWardNightChiefNote}）`;
        els.fgs.erNight.querySelector('label').textContent = '🚑 救急夜間（7年目以下 / 岸先生優先）';
        // 固定枠の案内表示
        if (fixedErDay) {
            els.fgs.erDay.classList.remove('hidden');
            els.fgs.erDay.querySelector('label').textContent = '🚑 救急日中 ― 救急医固定（第1・第3土曜）';
            els.selects.erDay.classList.add('hidden');
        } else if (roles.includes('erDay')) {
            els.fgs.erDay.querySelector('label').textContent = '🚑 救急日中 [特別枠]（救急日中希望者）';
            els.selects.erDay.classList.remove('hidden');
        }
        populateModalSelects(roles);
        for (const [role, id] of Object.entries(saved)) {
            if (roles.includes(role) && els.selects[role]) {
                const exists = Array.from(els.selects[role].options).some(o => o.value === id);
                if (exists) els.selects[role].value = id;
            }
        }
    }

    function openModal(dObj, dStr) {
        editingDateStr = dStr; editingDateObj = dObj;
        els.modalDateDisplay.textContent = `${dObj.getFullYear()}/${dObj.getMonth() + 1}/${dObj.getDate()} (${DAY_NAMES[dObj.getDay()]})`;
        els.selectDayType.value = state.specialDayRules[dStr] || '';
        updateModalRoles();
        const dS = state.shifts[dStr] || {};
        const roles = getRequiredRoles(dObj, dStr);
        roles.forEach(r => { if (els.selects[r]) els.selects[r].value = dS[r] || ''; });
        updateModalState();
        els.modal.classList.remove('hidden');
    }

    function collectModalIssues() {
        const fatalErrors = [], overrideErrors = [], warns = [], checks = {};
        const override = els.selectDayType.value;
        let modalIsHol;
        if (override === 'weekday') modalIsHol = false;
        else if (override === 'holiday') modalIsHol = true;
        else modalIsHol = isHoliday(editingDateObj, editingDateStr);
        // Cross-check: same doctor in multiple roles
        const selectedMap = {};
        for (const [role, sel] of Object.entries(els.selects)) {
            if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden') || !sel.value) continue;
            if (!selectedMap[sel.value]) selectedMap[sel.value] = [];
            selectedMap[sel.value].push(role);
        }
        for (const [id, roles] of Object.entries(selectedMap)) {
            if (roles.length > 1) {
                const n = findDoctorName(id);
                fatalErrors.push(`${n || id} が複数枠に割り当てられています`);
            }
        }
        for (const [role, sel] of Object.entries(els.selects)) {
            if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden') || !sel.value) continue;
            const chk = checkAssignmentRule(sel.value, role, editingDateObj);
            checks[role] = chk;
            if (!chk.valid) {
                const msg = `${getRoleLabelForDayType(role, editingDateObj, modalIsHol)}: ${chk.error}`;
                if (chk.error === '医師が見つかりません' || isHardRuleError(chk.error)) fatalErrors.push(msg);
                else overrideErrors.push(msg);
            } else if (chk.warning) {
                warns.push(`${getRoleLabelForDayType(role, editingDateObj, modalIsHol)}: ${chk.warning}`);
            }
        }
        return { fatalErrors, overrideErrors, warns, checks };
    }

    function updateModalState() {
        const issues = collectModalIssues();
        const errs = issues.fatalErrors.concat(issues.overrideErrors);

        // Per-select display state
        for (const [role, sel] of Object.entries(els.selects)) {
            sel.classList.remove('has-warning', 'has-soft-warning');
            if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden')) continue;
            if (!sel.value) continue;
            const chk = issues.checks[role];
            if (!chk) continue;
            if (!chk.valid) sel.classList.add('has-warning');
            else if (chk.warning) sel.classList.add('has-soft-warning');
        }

        if (errs.length || issues.warns.length) {
            els.modalWarnings.innerHTML =
                (errs.length ? `<div class="modal-error">❌ ${errs.join('<br>')}</div>` : '') +
                (issues.warns.length ? `<div class="modal-warnings">⚠️ ${issues.warns.join('<br>')}</div>` : '');
            els.modalWarnings.classList.remove('hidden');
        } else {
            els.modalWarnings.classList.add('hidden');
        }
    }

    function closeModal() { els.modal.classList.add('hidden'); }

    function saveAssignment() {
        const issues = collectModalIssues();
        if (issues.fatalErrors.length > 0) {
            alert('保存できません。\n\n' + issues.fatalErrors.join('\n'));
            return;
        }
        if (issues.overrideErrors.length > 0) {
            const ok = confirm(
                '以下のルール違反があります。\n例外として保存しますか？\n\n' +
                issues.overrideErrors.join('\n')
            );
            if (!ok) return;
        }

        // Save day type override
        const override = els.selectDayType.value;
        if (override) state.specialDayRules[editingDateStr] = override;
        else delete state.specialDayRules[editingDateStr];

        // Determine roles
        let isHol;
        if (override === 'weekday') isHol = false;
        else if (override === 'holiday') isHol = true;
        else isHol = isHoliday(editingDateObj, editingDateStr);
        let roles = !isHol
            ? ['wardNight', 'erNight']
            : (editingDateObj.getDay() === 6 ? ['wardNight', 'erDay', 'erNight'] : ['wardDay', 'wardNight', 'erDay', 'erNight']);
        if (isHol && isFixedErDaySaturday(editingDateObj)) roles = roles.filter(r => r !== 'erDay');

        if (!state.shifts[editingDateStr]) state.shifts[editingDateStr] = {};
        // Clear all roles for this day then set active ones
        delete state.shifts[editingDateStr].wardDay;
        delete state.shifts[editingDateStr].wardNight;
        delete state.shifts[editingDateStr].erDay;
        delete state.shifts[editingDateStr].erNight;
        roles.forEach(r => {
            if (!els.selects[r].classList.contains('hidden') && els.selects[r].value) state.shifts[editingDateStr][r] = els.selects[r].value;
        });
        if (Object.keys(state.shifts[editingDateStr]).length === 0) delete state.shifts[editingDateStr];
        saveData(); closeModal(); renderCalendar();
    }

    Object.values(els.selects).forEach(sc => sc.addEventListener('change', updateModalState));
    els.selectDayType.addEventListener('change', () => { updateModalRoles(); updateModalState(); });
    els.closeModalBtn.addEventListener('click', closeModal);
    els.cancelAssignmentBtn.addEventListener('click', closeModal);
    els.saveAssignmentBtn.addEventListener('click', saveAssignment);
    els.modalOverlay.addEventListener('click', closeModal);

    // ===== Auto Assign =====
    function scoreDoctorForAutoAssign(doc, dateStr, role) {
        const count = getDoctorMonthlyCount(doc.id);
        const dateObj = new Date(dateStr);
        const weekend = isWeekendDate(dateObj);
        const isSunday = dateObj.getDay() === 0;
        let score = count === 0
            ? 0
            : 1000000 + (GROUP_PRIORITY[doc.group] || 0) * 100000 + count * 1000;

        if (needsFormNonResponderDuty(doc)) score -= 500000;
        if (role === 'erNight' && isPriorityErNightDoctor(doc)) score -= 50000;
        if (isWeekendPrioritySeniorDoctor(doc)) {
            if (weekend) score -= 35000;
            if (!weekend && role === 'wardNight') score += 45000;
        }
        if (isFemaleDoctor(doc)) {
            if (role === 'wardDay' && isSunday) score -= 180000;
            else if (role === 'wardDay' && weekend) score -= 40000;
            else score += 120000;
        }

        const prefRank = getDoctorPreferenceRank(doc, dateStr);
        if (prefRank === 1) score -= 30000;
        else if (prefRank === 2) score -= 15000;

        if ((doc.ngDates2 || []).includes(dateStr)) score += 60000;
        else if ((doc.ngDates3 || []).includes(dateStr)) score += 30000;

        score += Math.random() * 100;
        return score;
    }

    function getAssignableErDayDates(y, m, ld) {
        const dates = [];
        for (let d = 1; d <= ld; d++) {
            const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
            if (!isHoliday(dObj, dStr)) continue;
            if (isFixedErDaySaturday(dObj)) continue; // 第1・第3土曜は救急医固定
            dates.push({ dObj, dStr });
        }
        return dates;
    }

    function assignRegularErDayForNonResponders(erDayDates) {
        let made = 0;
        erDayDates.forEach(({ dObj, dStr }) => {
            if (!state.shifts[dStr]) state.shifts[dStr] = {};
            if (state.shifts[dStr].erDay) return;

            const candidates = state.doctors.filter(doc => {
                if (!needsFormNonResponderDuty(doc)) return false;
                if (!doc.holidayErDayPreferred) return false;
                if (!canAutoAssignFixedFemaleDoctor(doc, dObj, 'erDay')) return false;
                const chk = checkAssignmentRule(doc.id, 'erDay', dObj);
                return chk.valid;
            }).map(doc => ({
                doc,
                score: scoreDoctorForAutoAssign(doc, dStr, 'erDay')
            })).sort((a, b) => a.score - b.score);

            if (candidates.length > 0) {
                state.shifts[dStr].erDay = candidates[0].doc.id;
                made++;
            }
        });
        return made;
    }

    function assignRegularErDayByPreference(erDayDates, preferenceRank) {
        let made = 0;
        erDayDates.forEach(({ dObj, dStr }) => {
            if (!state.shifts[dStr]) state.shifts[dStr] = {};
            if (state.shifts[dStr].erDay) return;

            const candidates = state.doctors.filter(doc => {
                if (!doc.holidayErDayPreferred) return false;
                if (!canAutoAssignFixedFemaleDoctor(doc, dObj, 'erDay')) return false;
                if (getDoctorPreferenceRank(doc, dStr) !== preferenceRank) return false;
                const chk = checkAssignmentRule(doc.id, 'erDay', dObj);
                return chk.valid;
            }).map(doc => ({
                doc,
                score: scoreDoctorForAutoAssign(doc, dStr, 'erDay')
            })).sort((a, b) => a.score - b.score);

            if (candidates.length > 0) {
                state.shifts[dStr].erDay = candidates[0].doc.id;
                made++;
            }
        });
        return made;
    }

    function assignRegularErDayWithoutPreference(erDayDates) {
        let made = 0;
        erDayDates.forEach(({ dObj, dStr }) => {
            if (!state.shifts[dStr]) state.shifts[dStr] = {};
            if (state.shifts[dStr].erDay) return;

            const candidates = state.doctors.filter(doc => {
                if (!doc.holidayErDayPreferred) return false;
                if (!canAutoAssignFixedFemaleDoctor(doc, dObj, 'erDay')) return false;
                if (getDoctorPreferenceRank(doc, dStr) !== 0) return false;
                const chk = checkAssignmentRule(doc.id, 'erDay', dObj);
                return chk.valid;
            }).map(doc => ({
                doc,
                score: scoreDoctorForAutoAssign(doc, dStr, 'erDay')
            })).sort((a, b) => a.score - b.score);

            if (candidates.length > 0) {
                state.shifts[dStr].erDay = candidates[0].doc.id;
                made++;
            }
        });
        return made;
    }

    function canReplaceSlotForNonResponder(currentId, allowSingleReplacement) {
        if (!currentId) return true;
        const currentDoc = state.doctors.find(d => d.id === currentId);
        if (!currentDoc) return false;
        if (isFormNonResponder(currentDoc)) return false;
        const currentCount = getDoctorMonthlyCount(currentDoc.id);
        return currentCount > 1 || allowSingleReplacement;
    }

    function tryAssignZeroNonResponders(y, m, ld) {
        const stillUnassigned = [];
        let made = 0;
        const targets = getFormNonResponderDoctors().filter(doc => getDoctorMonthlyCount(doc.id) === 0);

        targets.forEach(doc => {
            let assigned = false;
            for (const allowSingleReplacement of [false, true]) {
                if (assigned) break;
                for (let d = 1; d <= ld && !assigned; d++) {
                    const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
                    const roles = getRequiredRoles(dObj, dStr);
                    if (!state.shifts[dStr]) state.shifts[dStr] = {};

                    for (const role of roles) {
                        if (role === 'erDay' && isFixedErDaySaturday(dObj)) continue;
                        const currentId = state.shifts[dStr][role];
                        if (currentId === doc.id) { assigned = true; break; }
                        if (!canReplaceSlotForNonResponder(currentId, allowSingleReplacement)) continue;

                        const original = currentId || null;
                        if (original) delete state.shifts[dStr][role];
                        if (Object.values(state.shifts[dStr]).includes(doc.id)) {
                            if (original) state.shifts[dStr][role] = original;
                            continue;
                        }
                        const chk = checkAssignmentRule(doc.id, role, dObj);
                        if (chk.valid) {
                            state.shifts[dStr][role] = doc.id;
                            assigned = true;
                            made++;
                            break;
                        }
                        if (original) state.shifts[dStr][role] = original;
                    }
                }
            }
            if (!assigned) stillUnassigned.push(doc);
        });

        return { made, stillUnassigned };
    }

    els.autoAssignBtn.addEventListener('click', () => {
        if (state.doctors.length === 0) return alert('医師を登録してください。');
        if (!confirm(
            '未割り当て枠を自動生成します。\n\n' +
            '適用ルール:\n' +
            '・通常医師は月1回を優先\n' +
            '・救急日直希望○は固定枠以外の休日救急日中のみ\n' +
            '・フォーム未回答者は月1回を最優先します\n' +
            '・全員1回後の残枠は、回数より下の学年を優先\n' +
            '・救急日中は第一希望を全体優先→第二希望→通常候補\n' +
            '・NG第1/第2/第3希望は禁止\n' +
            '・連続当直 / 同一週2回は禁止\n' +
            '・月3回以上は不可（全員2回まで）\n' +
            '・土日はどの医師も月1回まで\n' +
            '・土曜は病棟1枠 + 救急日中/夜間の3枠です\n' +
            '・病棟夜間が不足する場合は6-7年目も補充候補にします\n' +
            '・非循環器の部長/副部長は土日を優先します\n' +
            '・固定女性医師8名は原則、日曜病棟日中のみ優先します\n' +
            '・吉井先生は日曜病棟日中のみ担当します\n' +
            '・岸先生は救急夜間枠のみ担当します\n' +
            '・平日病棟に入る部長は垣内先生・松本先生のみです\n' +
            '・翌日外来は夜間当直のみ禁止（日中は対象外）\n' +
            '・備考欄は自動解釈せず要確認警告として扱います'
        )) return;

        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        const ld = new Date(y, m + 1, 0).getDate();
        let made = 0, skipped = 0;

        // === Pass 1: Assign erDay for all holidays ===
        const erDayDates = getAssignableErDayDates(y, m, ld);
        made += assignRegularErDayForNonResponders(erDayDates); // 未回答の救急日中希望者を先に確保
        made += assignRegularErDayByPreference(erDayDates, 1); // 第一希望を月全体で先に確保
        made += assignRegularErDayByPreference(erDayDates, 2); // 次に第二希望
        made += assignRegularErDayWithoutPreference(erDayDates); // その後、希望なし候補
        skipped += erDayDates.filter(({ dStr }) => !(state.shifts[dStr] && state.shifts[dStr].erDay)).length;

        // === Pass 2: Assign wardDay, wardNight, erNight ===
        for (let d = 1; d <= ld; d++) {
            const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
            const roles = getRequiredRoles(dObj, dStr).filter(r => r !== 'erDay');
            if (!state.shifts[dStr]) state.shifts[dStr] = {};
            const assignedToday = new Set(Object.values(state.shifts[dStr]).filter(Boolean));

            for (const role of roles) {
                if (state.shifts[dStr][role]) continue;

                let candidates = state.doctors.filter(doc => {
                    if (doc.holidayErDayPreferred) return false;
                    if (role === 'wardDay' && !canDoWardDayDoctor(doc)) return false;
                    if (role === 'wardNight' && !canDoWardNightDoctor(doc, dObj, dStr)) return false;
                    if (role === 'erNight' && !canDoErNightDoctor(doc)) return false;
                    if (hasErDayThisMonth(doc.id)) return false;
                    if (assignedToday.has(doc.id)) return false;
                    const chk = checkAssignmentRule(doc.id, role, dObj);
                    return chk.valid;
                });

                if (role === 'wardNight') {
                    const primaryWardCandidates = candidates.filter(doc =>
                        canDoWardNightPrimaryDoctor(doc, dObj, dStr)
                    );
                    if (primaryWardCandidates.length > 0) {
                        candidates = primaryWardCandidates;
                    }
                }

                const fixedFemalePreferredCandidates = candidates.filter(doc =>
                    canAutoAssignFixedFemaleDoctor(doc, dObj, role)
                );
                const nonResponderCandidates = candidates.filter(doc =>
                    needsFormNonResponderDuty(doc)
                );
                if (nonResponderCandidates.length > 0) {
                    candidates = nonResponderCandidates;
                } else if (fixedFemalePreferredCandidates.length > 0) {
                    candidates = fixedFemalePreferredCandidates;
                }

                if (candidates.length === 0) { skipped++; continue; }

                candidates = candidates.map(doc => {
                    return { doc, score: scoreDoctorForAutoAssign(doc, dStr, role) };
                }).sort((a, b) => a.score - b.score);

                const chosen = candidates[0].doc;
                state.shifts[dStr][role] = chosen.id;
                assignedToday.add(chosen.id);
                made++;
            }
        }

        const nonResponderFix = tryAssignZeroNonResponders(y, m, ld);
        made += nonResponderFix.made;

        saveData(); renderCalendar();
        let msg = `${made}件割り当てました。`;
        if (skipped > 0) msg += `\n⚠️ ${skipped}枠は条件を満たす医師がおらず未割り当てです。`;
        const unassignedDoctors = state.doctors.filter(doc => getDoctorMonthlyCount(doc.id) === 0);
        if (unassignedDoctors.length > 0) {
            const names = unassignedDoctors.map(d => d.name).join('、');
            msg += `\n⚠️ 月1回未達の通常医師: ${unassignedDoctors.length}名\n${names}`;
        }
        const unassignedNonResponders = nonResponderFix.stillUnassigned.filter(doc => getDoctorMonthlyCount(doc.id) === 0);
        if (unassignedNonResponders.length > 0) {
            msg += `\n⚠️ フォーム未回答で月1回未達: ${unassignedNonResponders.length}名\n${unassignedNonResponders.map(d => d.name).join('、')}`;
        }
        const noteAssigned = state.doctors.filter(doc => doc.notes && getDoctorMonthlyCount(doc.id) > 0);
        if (noteAssigned.length > 0) {
            msg += `\n⚠️ 備考ありの割り当てがあります。カレンダーの警告を確認してください。`;
        }
        alert(msg);
    });

    // ===== Excel Export =====
	    els.exportExcelBtn.addEventListener('click', () => {
	        if (typeof XLSX === 'undefined') return alert('ライブラリ読み込み中です。少々お待ちを。');
	        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
	        const ld = new Date(y, m + 1, 0).getDate();
	        const wb = XLSX.utils.book_new();
	        const surnameOverrides = {
	            '久保山知彦': '久保山',
	            '金武あゆみ': '金武',
	            '丹羽諒太郎': '丹羽',
	            '藤岡周太郎': '藤岡',
	            '藤本健太郎': '藤本',
	            '大谷賢一郎': '大谷',
	            '吉田竜太郎': '吉田',
	            '山口星一郎': '山口'
	        };
	        const surname = name => {
	            const normalized = normalizeName(name);
	            if (!normalized) return '';
	            if (surnameOverrides[normalized]) return surnameOverrides[normalized];
	            return normalized.split(' ')[0];
	        };
	        const n = id => surname(findDoctorName(id) || '');
	        const COL_DAYS = ['日', '月', '火', '水', '木', '金', '土'];
	        const firstDayOfWeek = new Date(y, m, 1).getDay();
	        const weeks = [[]];

	        for (let i = 0; i < firstDayOfWeek; i++) weeks[0].push(null);
	        for (let d = 1; d <= ld; d++) {
	            if (weeks[weeks.length - 1].length === 7) weeks.push([]);
	            weeks[weeks.length - 1].push(d);
	        }
	        while (weeks[weeks.length - 1].length < 7) weeks[weeks.length - 1].push(null);

	        const dateLabel = (day, dObj, dStr) => {
	            const holidayName = state.holidays[dStr];
	            if (holidayName && dObj.getDay() !== 0 && dObj.getDay() !== 6) return `${day} ${holidayName}`;
	            if (state.specialDayRules[dStr] === 'holiday' && dObj.getDay() !== 0 && dObj.getDay() !== 6) return `${day} 祝`;
	            return String(day);
	        };

	        const dutyLinesForDay = (day, mode) => {
	            if (day === null) return '';
	            const dObj = new Date(y, m, day);
	            const dStr = formatDateStr(dObj);
	            const isHol = isHoliday(dObj, dStr);
	            const isSaturdayHoliday = isHol && dObj.getDay() === 6;
	            const shifts = state.shifts[dStr] || {};
	            const lines = [];
	            const erDayName = isFixedErDaySaturday(dObj) ? '固定' : n(shifts.erDay);

	            if (mode === 'ward') {
	                if (isSaturdayHoliday) {
	                    if (shifts.wardNight) lines.push(n(shifts.wardNight));
	                } else if (isHol) {
	                    if (shifts.wardDay) lines.push(`日 ${n(shifts.wardDay)}`);
	                    if (shifts.wardNight) lines.push(`夜 ${n(shifts.wardNight)}`);
	                } else if (shifts.wardNight) {
	                    lines.push(n(shifts.wardNight));
	                }
	            } else if (mode === 'er') {
	                if (isHol) {
	                    if (erDayName) lines.push(`日 ${erDayName}`);
	                    if (shifts.erNight) lines.push(`夜 ${n(shifts.erNight)}`);
	                } else if (shifts.erNight) {
	                    lines.push(n(shifts.erNight));
	                }
	            } else {
	                if (isSaturdayHoliday) {
	                    if (shifts.wardNight) lines.push(`病 ${n(shifts.wardNight)}`);
	                    if (erDayName) lines.push(`救日 ${erDayName}`);
	                    if (shifts.erNight) lines.push(`救夜 ${n(shifts.erNight)}`);
	                } else if (isHol) {
	                    if (shifts.wardDay) lines.push(`病日 ${n(shifts.wardDay)}`);
	                    if (shifts.wardNight) lines.push(`病夜 ${n(shifts.wardNight)}`);
	                    if (erDayName) lines.push(`救日 ${erDayName}`);
	                    if (shifts.erNight) lines.push(`救夜 ${n(shifts.erNight)}`);
	                } else {
	                    if (shifts.wardNight) lines.push(`病 ${n(shifts.wardNight)}`);
	                    if (shifts.erNight) lines.push(`救 ${n(shifts.erNight)}`);
	                }
	            }

	            return lines.join('\n');
	        };

	        const appendCalendarSheet = (sheetName, title, mode) => {
	            const data = [[title, '', '', '', '', '', ''], COL_DAYS];
	            weeks.forEach(week => {
	                data.push(week.map(day => {
	                    if (day === null) return '';
	                    const dObj = new Date(y, m, day);
	                    return dateLabel(day, dObj, formatDateStr(dObj));
	                }));
	                data.push(week.map(day => dutyLinesForDay(day, mode)));
	            });

	            const ws = XLSX.utils.aoa_to_sheet(data);
	            ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
	            ws['!freeze'] = { xSplit: 0, ySplit: 2 };
	            ws['!cols'] = Array(7).fill({ wch: mode === 'all' ? 18 : 16 });
	            ws['!rows'] = [
	                { hpt: 30 },
	                { hpt: 22 },
	                ...weeks.flatMap(() => [{ hpt: 20 }, { hpt: mode === 'all' ? 86 : 66 }])
	            ];

	            const border = {
	                top: { style: 'thin', color: { rgb: 'D1D5DB' } },
	                bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
	                left: { style: 'thin', color: { rgb: 'D1D5DB' } },
	                right: { style: 'thin', color: { rgb: 'D1D5DB' } }
	            };
	            const weekendFill = { patternType: 'solid', fgColor: { rgb: 'F3F4F6' } };
	            const weekdayFill = { patternType: 'solid', fgColor: { rgb: 'FFFFFF' } };
	            const headerFill = { patternType: 'solid', fgColor: { rgb: 'E5E7EB' } };

	            const setCellStyle = (r, c, style) => {
	                const addr = XLSX.utils.encode_cell({ r, c });
	                if (!ws[addr]) ws[addr] = { t: 's', v: '' };
	                ws[addr].s = style;
	            };

	            setCellStyle(0, 0, {
	                font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
	                fill: { patternType: 'solid', fgColor: { rgb: '374151' } },
	                alignment: { horizontal: 'center', vertical: 'center' },
	                border
	            });
	            for (let c = 1; c < 7; c++) setCellStyle(0, c, ws[XLSX.utils.encode_cell({ r: 0, c: 0 })].s);

	            for (let c = 0; c < 7; c++) {
	                setCellStyle(1, c, {
	                    font: { bold: true, sz: 11, color: { rgb: c === 0 ? '991B1B' : (c === 6 ? '1D4ED8' : '111827') } },
	                    fill: headerFill,
	                    alignment: { horizontal: 'center', vertical: 'center' },
	                    border
	                });
	            }

	            weeks.forEach((week, wi) => {
	                const dateRow = 2 + wi * 2;
	                const dutyRow = dateRow + 1;
	                week.forEach((day, c) => {
	                    const dObj = day === null ? null : new Date(y, m, day);
	                    const dStr = dObj ? formatDateStr(dObj) : null;
	                    const isGrayDay = dObj && (isHoliday(dObj, dStr) || dObj.getDay() === 0 || dObj.getDay() === 6);
	                    const dayColor = !dObj ? '9CA3AF' : (dObj.getDay() === 6 ? '1D4ED8' : (isGrayDay ? '991B1B' : '111827'));
	                    const fill = isGrayDay ? weekendFill : weekdayFill;

	                    setCellStyle(dateRow, c, {
	                        font: { bold: true, sz: 13, color: { rgb: dayColor } },
	                        fill,
	                        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
	                        border
	                    });
	                    setCellStyle(dutyRow, c, {
	                        font: { sz: 14, color: { rgb: '111827' } },
	                        fill,
	                        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
	                        border
	                    });
	                });
	            });
	            XLSX.utils.book_append_sheet(wb, ws, sheetName);
	        };

	        appendCalendarSheet('病棟カレンダー', `${y}年${m + 1}月 病棟`, 'ward');
	        appendCalendarSheet('救急カレンダー', `${y}年${m + 1}月 救急`, 'er');
	        appendCalendarSheet('全体カレンダー', `${y}年${m + 1}月 全体`, 'all');

        XLSX.writeFile(wb, `当直表_${y}年${m + 1}月.xlsx`);
    });

    // ===== Init =====
    async function init() {
        await fetchHolidays();
        if (state.doctors.length === 0) {
            state.doctors = buildDefaultDoctors();
        }
        saveData(); // Persist migrated data
        renderCalendar();
    }
    init();
});
