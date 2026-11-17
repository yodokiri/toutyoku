document.addEventListener('DOMContentLoaded', () => {
    // ===== Constants =====
    const GROUPS = ['3-5年目', '6-7年目', '副医長', '医長', '副部長', '部長', '副部長以上'];
    const GROUP_PRIORITY = { '3-5年目': 0, '6-7年目': 1, '副医長': 2, '医長': 3, '副部長': 4, '部長': 5, '副部長以上': 5 };
    const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
    const ROLE_LABELS = {
        wardDay: '🏥病棟(日中)', wardNight: '🏥病棟(夜間)',
        erDay: '🚑救急(日中)', erNight: '🚑救急(夜間)'
    };
    const ROLE_ORDER = ['wardDay', 'wardNight', 'erDay', 'erNight'];
    const MOBILE_SURNAME_BY_COMPACT_NAME = Object.freeze({
        '久保山知彦': '久保山',
        '金武あゆみ': '金武',
        '丹羽諒太郎': '丹羽',
        '藤岡周太郎': '藤岡',
        '藤本健太郎': '藤本',
        '前田晃宏': '前田',
        '大谷賢一郎': '大谷',
        '吉田竜太郎': '吉田',
        '山口星一郎': '山口',
        '小澤牧人': '小澤',
        '福嶌愛': '福嶌',
        '蘆田健毅': '蘆田'
    });
    // 名前の字を直した医師（古い字 → 正しい字。どちらも空白を除いた形）。保存済みのデータは読み込むときに正しい字へ直し、
    // 古い字の名前（古い版の画面が足した医師、フォームの回答）も同じ医師として扱う（2026-11-15 利用者: 正式は「蘆田 健毅」）
    const DOCTOR_NAME_CORRECTIONS = Object.freeze({
        '蘆田建毅': '蘆田健毅'
    });
    const CORRECTED_DOCTOR_NAMES = new Set(Object.values(DOCTOR_NAME_CORRECTIONS));
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
        '蘆田健毅': '循環器内科',
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
        '前田晃宏': '腎臓内科',
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
        '福嶌愛': '脳血管神経内科',
        '重岡 靖': '腫瘍内科',
        '小澤牧人': '循環器内科',
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
    const WARD_DUTY_PRIORITY_DOCTOR_NAMES = new Set([
        '山口星一郎'
    ]);
    const FIXED_FEMALE_RULE_EXEMPT_DOCTOR_NAMES = new Set([
        '吉田 也恵',
        '岩田 幸代'
    ]);
    const DUTY_EXCLUDED_DOCTOR_NAMES = new Set([
        '椿 遥花',
        '箱谷 聡'
    ]);
    const FRIDAY_WARD_ONLY_DOCTOR_NAMES = new Set([
        '小澤牧人'
    ]);
    const MANUAL_ONLY_DOCTOR_NAMES = new Set([
        '松岡 里紗'
    ]);
    const ER_NIGHT_ONLY_DOCTOR_NAMES = new Set([
        '福嶌愛',
        '前田晃宏'
    ]);
    const THURSDAY_WARD_NIGHT_ONLY_DOCTOR_NAMES = new Set([
        '蘆田健毅'
    ]);
    const SATURDAY_ER_DAY_EXTRA_DOCTOR_NAMES = new Set([
        '久保山知彦'
    ]);
    const SPECIAL_ER_DAY_EXTRA_DOCTOR_NAMES = new Set([
        '岸 具宏',
        '古田 寛人',
        '梁間 敢',
        '上野 峻輔',
        '近藤 和也'
    ]);
    const WEEKEND_ER_DAY_EXTRA_START_DATE = new Date(2026, 7, 1);
    const CARDIOLOGY_MONTHLY_LIMIT_ONE_DOCTOR_NAMES = new Set([
        '小澤牧人',
        '岩田 幸代'
    ]);
    const CARDIOLOGY_MONTHLY_LIMIT = 2;
    const HOLIDAY_DUTY_MONTHLY_LIMIT = 2;
    // 医師一覧の「個別設定」で「休日上限の緩和」を付けた医師の土日祝上限
    const RELAXED_HOLIDAY_DUTY_MONTHLY_LIMIT = 3;
    // 土日祝の病棟（土曜の病棟・日祝の病棟日中/夜間）を、科の人数に応じた割合に近づける（2026-11-09 利用者「人数比」）。
    // 自動割り振りで、点数の差がこの幅に収まる候補の中から、科の偏りが小さくなる先生を選ぶ。
    // 幅の目安は年度内の土日祝の当直1〜2回分（1回 = 総回数25000 + 土日祝35000）。月の回数（1回 = 1000000）や
    // 日曜病棟日中の女性医師優先（-180000）の差はこの幅を超えるので崩さない。
    const HOLIDAY_WARD_DEPARTMENT_BALANCE_SCORE_BAND = 100000;
    const MONTHLY_DUTY_TARGET_BY_NAME = {
        '南部 海': 3
    };
    const REQUIRED_EXTRA_DOCTOR_NAMES = new Set([
        '小澤牧人',
        '松岡 里紗',
        '福嶌愛',
        '前田晃宏',
        '蘆田健毅'
    ]);
    const FIXED_WEEKDAY_NG_BY_NAME = {
        '黒川 晟': new Set([0, 1]), // 日・月（水曜外来は残すため火曜夜間は不可）
        '津本 一秀': new Set([1, 3]), // 月・水
        '渡邉 陽香': new Set([1, 3, 4]) // 月・水・木
    };
    const FIXED_EXTERNAL_DUTY_NAMES = new Set(['救急医']);
    const FIXED_SPECIAL_DUTIES_BY_DATE = {
        '2026-09-19': { erDay: ['救急医'], erNight: ['南部 海'], wardNight: ['岸 具宏'] },
        '2026-09-20': { erDay: ['薮内 寛幸'], erNight: ['中島 康哉'], wardDay: ['竹重 遼'], wardNight: ['丹羽諒太郎'] },
        '2026-09-21': { erDay: ['上野 裕美子'], erNight: ['西岡 唯'], wardDay: ['水本 綾', '松井 佐織'], wardNight: ['池田 響'] },
        '2026-09-22': { erDay: ['藤岡周太郎'], erNight: ['渡邉 陽香'], wardDay: ['岩田 幸代', '金 容壱'], wardNight: ['久保山知彦'] },
        '2026-09-23': { erDay: ['救急医'], erNight: ['堀川 真衣'], wardDay: ['吉井 直子', '大谷賢一郎'], wardNight: ['春山 忠佑'] },
        '2026-12-29': { erDay: ['岸 具宏'], wardDay: ['吉井 直子', '大谷賢一郎'], wardNight: ['吉田竜太郎'] }, // 救急日中は2026-11-06に今中先生→岸先生へ変更
        '2026-12-30': { erDay: ['梁間 敢'], wardDay: ['西島 正剛', '田中 康史'], wardNight: ['近藤 和也'] },
        '2026-12-31': { erDay: ['三木 秀晃'], wardDay: ['佐々木 諭'], wardNight: ['黒川 晟'] },
        '2027-01-01': { erDay: ['古田 寛人'], wardDay: ['藤田 光一', '山口星一郎'], wardNight: ['上野 峻輔'] },
        '2027-01-02': { erDay: ['焦 圭裕'], wardDay: ['金 容壱', '水本 綾'], wardNight: ['竹重 遼'] },
        '2027-01-03': { erDay: ['救急医'], wardDay: ['岩根 成豪', '北村 泰明'], wardNight: ['丹羽諒太郎'] }
    };
    // 固定表の救急日中のうち、「休日救急日中を担当した月は他枠不可」に数えない担当（例外的に入った分）
    const FIXED_ER_DAY_EXCLUSIVITY_EXEMPT_BY_DATE = {
        '2026-12-29': ['岸 具宏'] // 今中先生の代わりに例外的に担当。12月の他枠にも入れる（2026-11-06 利用者）
    };

    // 現行マスタ。入退職後も過去の割り付けを表示できるよう、在籍期間付きで保持する。
    // dutyPaused / wardNightAllowed / holidayLimitRelaxed は「個別設定」の初期値。画面で保存した値が優先される。
    const DEFAULT_DOCTORS = [
        { name: '久保山知彦', group: '医長', holidayErDayPreferred: false, outpatientDays: ['火', '水'], holidayLimitRelaxed: true },
        { name: '焦 圭裕', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['火', '金'] },
        { name: '藤木 陽平', group: '部長', holidayErDayPreferred: true, outpatientDays: ['月', '木', '金'] },
        { name: '金武あゆみ', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '中島 康哉', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '丹羽諒太郎', group: '医長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '南部 海', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['月'] },
        { name: '垣内 誠司', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '富垣 成', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['水', '木'], availableUntil: '2026-10-31' },
        { name: '梁間 敢', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['火', '水'], holidayLimitRelaxed: true },
        { name: '藤岡周太郎', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['水', '金'] },
        { name: '藤本健太郎', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [], availableUntil: '2026-09-30' },
        { name: '前田晃宏', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [], availableFrom: '2026-10-01' },
        { name: '上野 峻輔', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火', '水'] },
        { name: '中村 基寛', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['金'] },
        { name: '古田 寛人', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['月', '金'], holidayLimitRelaxed: true },
        { name: '吉井 直子', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['火', '金'] },
        { name: '堀川 真衣', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '大谷賢一郎', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '金'] },
        { name: '朝岡 拓哉', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '西島 正剛', group: '副部長', holidayErDayPreferred: true, outpatientDays: ['水', '金'] },
        { name: '吉田 也恵', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '木', '金'] },
        { name: '金 容壱', group: '部長', holidayErDayPreferred: true, outpatientDays: ['月', '火', '水', '木'], wardNightAllowed: true },
        { name: '上野 裕美子', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['火'] },
        { name: '佐々木 諭', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '岩根 成豪', group: '医長', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '岩田 幸代', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '木'] },
        { name: '松本 大典', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '火'], availableUntil: '2026-10-31' },
        { name: '蘆田健毅', group: '部長', holidayErDayPreferred: false, outpatientDays: [], availableFrom: '2026-10-01' },
        { name: '竹重 遼', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['火', '金'] },
        { name: '三木 秀晃', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['月', '木'], holidayLimitRelaxed: true },
        { name: '北村 泰明', group: '部長', holidayErDayPreferred: true, outpatientDays: ['水', '金'], wardNightAllowed: true },
        { name: '吉田竜太郎', group: '副部長', holidayErDayPreferred: false, outpatientDays: ['水', '木'] },
        { name: '春山 忠佑', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '東 祐介', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '松井 佐織', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '金'] },
        { name: '池田 響', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火', '木'] },
        { name: '薮内 寛幸', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['金'] },
        { name: '藤田 光一', group: '部長', holidayErDayPreferred: true, outpatientDays: ['火', '木'] },
        { name: '近藤 和也', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '火'] },
        { name: '酒牧 弘誠', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '今中 友香', group: '6-7年目', holidayErDayPreferred: false, outpatientDays: ['水'], dutyPaused: true }, // 2026-11-07 一覧に戻す際、休止中として戻す（11/19・11/22・12/29の差し替えから休職と推定）
        { name: '服部 洸輝', group: '医長', holidayErDayPreferred: true, outpatientDays: ['火', '金'] },
        { name: '水本 綾', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '木'] },
        { name: '田中 康史', group: '部長', holidayErDayPreferred: true, outpatientDays: ['月', '火', '水', '木', '金'] },
        { name: '梶川 道子', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '水', '木'] },
        { name: '津本 一秀', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水', '木'] },
        { name: '渡邉 陽香', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: ['火'] },
        { name: '黒川 晟', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火', '水', '金'] },
        { name: '上田 直子', group: '部長', holidayErDayPreferred: false, outpatientDays: ['水'] },
        { name: '安部 裕子', group: '部長', holidayErDayPreferred: false, outpatientDays: ['火', '水'] },
        { name: '山口星一郎', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火'] },
        { name: '岸 具宏', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '椿 遥花', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '渡邊 有史', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['木'] },
        { name: '箱谷 聡', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [], availableUntil: '2026-10-31' }, // 2026-11-07 利用者依頼で一覧から外す
        { name: '西岡 唯', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [], availableUntil: '2026-09-30' },
        { name: '福嶌愛', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [], availableFrom: '2026-10-01' },
        { name: '重岡 靖', group: '部長', holidayErDayPreferred: false, outpatientDays: ['月', '水', '木', '金'] },
        { name: '小澤牧人', group: '医長', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '松岡 里紗', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
    ];

    function buildDoctorFromDefault(d) {
        return {
            id: generateId(),
            name: d.name,
            group: d.group,
            department: DEPARTMENT_BY_NAME[normalizeName(d.name)] || '',
            outpatientDays: d.outpatientDays || [],
            holidayErDayPreferred: d.holidayErDayPreferred,
            availableFrom: d.availableFrom || '',
            availableUntil: d.availableUntil || '',
            dutyPaused: !!d.dutyPaused,
            wardNightAllowed: !!d.wardNightAllowed,
            holidayLimitRelaxed: !!d.holidayLimitRelaxed,
            ngDates1: [], ngDates2: [], ngDates3: [],
            notes: '', preferredDates1: [], preferredDates2: [], preferredDates: []
        };
    }

    function buildDefaultDoctors() {
        return DEFAULT_DOCTORS.map(buildDoctorFromDefault);
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
    function normalizeDoctorMatchName(n) {
        const compact = normalizeName(n).replace(/\s+/g, '');
        return Object.prototype.hasOwnProperty.call(DOCTOR_NAME_CORRECTIONS, compact) ? DOCTOR_NAME_CORRECTIONS[compact] : compact;
    }
    // 古い字の名前を正しい字に直す（字を直した医師は空白も除く）。ほかの名前はそのまま返す
    function correctDoctorName(n) {
        const compact = normalizeName(n).replace(/\s+/g, '');
        if (Object.prototype.hasOwnProperty.call(DOCTOR_NAME_CORRECTIONS, compact)) return DOCTOR_NAME_CORRECTIONS[compact];
        if (CORRECTED_DOCTOR_NAMES.has(compact)) return compact;
        return n;
    }
    // 名前の並び（回答した医師など）を正しい字に直す。直した結果で同じ医師が2回出たら、後の方を外す
    function correctDoctorNameList(names) {
        const seen = new Set();
        return (Array.isArray(names) ? names : []).map(correctDoctorName).filter(name => {
            const key = normalizeDoctorMatchName(name);
            if (!CORRECTED_DOCTOR_NAMES.has(key)) return true;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    // フォームの文字（備考など）をHTMLとして画面に入れるときは必ずこれを通す（2026-11-14）
    function escapeHtml(value) {
        return String(value === null || value === undefined ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }
    function getDepartmentByName(name) { return DEPARTMENT_BY_NAME[normalizeName(name)] || ''; }
    function parseDateStr(dateStr) {
        const [yy, mm, dd] = String(dateStr || '').split('-').map(Number);
        if (!yy || !mm || !dd) return null;
        return new Date(yy, mm - 1, dd);
    }
    function getFixedSpecialDuties(dateStr) {
        return FIXED_SPECIAL_DUTIES_BY_DATE[dateStr] || null;
    }
    function isFixedSpecialDutyDate(dateStr) {
        return !!getFixedSpecialDuties(dateStr);
    }
    function getFixedSpecialDutyEntries(dateStr, role) {
        const duties = getFixedSpecialDuties(dateStr);
        return duties && Array.isArray(duties[role]) ? duties[role] : [];
    }
    function isFixedSpecialDutyRole(dateStr, role) {
        return getFixedSpecialDutyEntries(dateStr, role).length > 0;
    }
    function getFixedSpecialDutyRoles(dateStr) {
        const duties = getFixedSpecialDuties(dateStr);
        if (!duties) return [];
        return ROLE_ORDER.filter(role => getFixedSpecialDutyEntries(dateStr, role).length > 0);
    }
    function isExternalFixedDutyName(name) {
        return FIXED_EXTERNAL_DUTY_NAMES.has(normalizeName(name));
    }
    function findDoctorByName(name) {
        const target = normalizeDoctorMatchName(name);
        return state.doctors.find(doc => normalizeDoctorMatchName(doc.name) === target) || null;
    }
    function getFixedDutyDoctorId(name) {
        if (!name || isExternalFixedDutyName(name)) return null;
        const doc = findDoctorByName(name);
        return doc ? doc.id : null;
    }
    function getFixedDutyDoctorIds(dateStr, role = null) {
        const roles = role ? [role] : getFixedSpecialDutyRoles(dateStr);
        const ids = [];
        roles.forEach(r => {
            getFixedSpecialDutyEntries(dateStr, r).forEach(name => {
                const id = getFixedDutyDoctorId(name);
                if (id) ids.push(id);
            });
        });
        return ids;
    }
    function getFixedDutyDisplayNames(dateStr, role) {
        return getFixedSpecialDutyEntries(dateStr, role).map(name => {
            const doc = isExternalFixedDutyName(name) ? null : findDoctorByName(name);
            return doc ? doc.name : name;
        });
    }
    function getAssignedDoctorIdsForDate(dateStr, excludeRole = null) {
        const ids = [];
        const dayShifts = getShiftForDate(dateStr);
        for (const [role, val] of Object.entries(dayShifts)) {
            if (role === excludeRole || isFixedSpecialDutyRole(dateStr, role)) continue;
            if (val) ids.push(val);
        }
        getFixedSpecialDutyRoles(dateStr).forEach(role => {
            if (role === excludeRole) return;
            ids.push(...getFixedDutyDoctorIds(dateStr, role));
        });
        return ids;
    }
    function getDoctorDepartment(doc) {
        return (doc && (doc.department || getDepartmentByName(doc.name))) || '';
    }
    function getAssignedDepartmentsForDate(dateStr, excludeRole = null) {
        return new Set(getAssignedDoctorIdsForDate(dateStr, excludeRole)
            .map(id => state.doctors.find(doc => doc.id === id))
            .map(getDoctorDepartment)
            .filter(Boolean));
    }
    function hasSameDepartmentAssignmentForDate(doc, dateStr, excludeRole = null) {
        const department = getDoctorDepartment(doc);
        return !!department && getAssignedDepartmentsForDate(dateStr, excludeRole).has(department);
    }
    function preferDifferentDepartmentCandidates(candidates, dateStr, excludeRole = null) {
        const differentDepartmentCandidates = candidates.filter(doc =>
            !hasSameDepartmentAssignmentForDate(doc, dateStr, excludeRole)
        );
        return differentDepartmentCandidates.length > 0 ? differentDepartmentCandidates : candidates;
    }
    function forEachFixedDutyEntry(callback) {
        for (const [dateStr, duties] of Object.entries(FIXED_SPECIAL_DUTIES_BY_DATE)) {
            const dateObj = parseDateStr(dateStr);
            for (const [role, names] of Object.entries(duties || {})) {
                (names || []).forEach(name => {
                    callback({ dateStr, dateObj, role, name, doctorId: getFixedDutyDoctorId(name) });
                });
            }
        }
    }
    function isFixedErDayExclusivityExempt(dateStr, doctorId) {
        const names = FIXED_ER_DAY_EXCLUSIVITY_EXEMPT_BY_DATE[dateStr] || [];
        return names.some(name => getFixedDutyDoctorId(name) === doctorId);
    }
    function countFixedDutiesForDoctor(doctorId, predicate = null) {
        let count = 0;
        forEachFixedDutyEntry(entry => {
            if (entry.doctorId !== doctorId) return;
            if (!predicate || predicate(entry.dateStr, entry.dateObj, entry.role)) count++;
        });
        return count;
    }
    function formatFixedDutyRoleSummary(dateStr, role) {
        const names = getFixedDutyDisplayNames(dateStr, role);
        if (names.length === 0) return '';
        return `${ROLE_LABELS[role]}: ${names.join('・')}`;
    }
    function formatFixedDutySummary(dateStr) {
        return getFixedSpecialDutyRoles(dateStr)
            .map(role => formatFixedDutyRoleSummary(dateStr, role))
            .filter(Boolean)
            .join(' / ');
    }
    function isCardiologyDoctor(doc) {
        return (doc.department || getDepartmentByName(doc.name)) === '循環器内科';
    }
    function getCardiologyMonthlyLimit(doc) {
        if (!isCardiologyDoctor(doc)) return null;
        if (CARDIOLOGY_MONTHLY_LIMIT_ONE_DOCTOR_NAMES.has(normalizeName(doc.name))) return 1;
        return CARDIOLOGY_MONTHLY_LIMIT;
    }
    function isPriorityErNightDoctor(doc) {
        return PRIORITY_ER_NIGHT_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isFemaleDoctor(doc) {
        const name = normalizeName(doc.name);
        return FEMALE_DOCTOR_NAMES.has(name) && !FIXED_FEMALE_RULE_EXEMPT_DOCTOR_NAMES.has(name);
    }
    function isWardDayOnlyDoctor(doc) {
        return WARD_DAY_ONLY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isWardDutyPriorityDoctor(doc) {
        return WARD_DUTY_PRIORITY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isDutyExcludedDoctor(doc) {
        return DUTY_EXCLUDED_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isFridayWardOnlyDoctor(doc) {
        return FRIDAY_WARD_ONLY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isManualOnlyDoctor(doc) {
        return MANUAL_ONLY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isErNightOnlyDoctor(doc) {
        return ER_NIGHT_ONLY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    function isThursdayWardNightOnlyDoctor(doc) {
        return THURSDAY_WARD_NIGHT_ONLY_DOCTOR_NAMES.has(normalizeName(doc.name));
    }
    // 医師一覧の「個別設定」で付け外しする項目（医師データとして共有保存される）
    function isDutyPausedDoctor(doc) {
        return !!(doc && doc.dutyPaused);
    }
    function hasWardNightPermission(doc) {
        return !!(doc && doc.wardNightAllowed);
    }
    function isHolidayLimitRelaxedDoctor(doc) {
        return !!(doc && doc.holidayLimitRelaxed);
    }
    function getHolidayDutyMonthlyLimit(doc) {
        return isHolidayLimitRelaxedDoctor(doc) ? RELAXED_HOLIDAY_DUTY_MONTHLY_LIMIT : HOLIDAY_DUTY_MONTHLY_LIMIT;
    }
    // 「休日上限の緩和」の医師は、休日救急日中まわり（月1回まで・同じ月の他枠不可）を手動では一時許可（黄）として表示する。
    // 自動割り振りは従来どおり、これらに当たる候補を使わない（2026-11-07 安部先生の指摘）。
    // 手動は2026-11-07から、同じ日に同じ先生などを除き、どの規則もチェックを付ければ保存できる（collectModalIssues）。
    function withHolidayRelaxedOverride(doc, message) {
        return isHolidayLimitRelaxedDoctor(doc) ? `${message}（休日上限の緩和：手動例外可）` : message;
    }
    function getTodayDateStr() {
        return formatDateStr(new Date());
    }
    function isDoctorActiveOnDate(doc, dateObj) {
        if (!doc || !dateObj) return false;
        const dateStr = formatDateStr(dateObj);
        if (doc.availableFrom && dateStr < doc.availableFrom) return false;
        if (doc.availableUntil && dateStr > doc.availableUntil) return false;
        return true;
    }
    function isDoctorActiveInMonth(doc, monthDate = state.currentDate) {
        if (!doc || !monthDate) return false;
        const y = monthDate.getFullYear();
        const m = monthDate.getMonth();
        const monthStart = formatDateStr(new Date(y, m, 1));
        const monthEnd = formatDateStr(new Date(y, m + 1, 0));
        return (!doc.availableFrom || doc.availableFrom <= monthEnd) &&
            (!doc.availableUntil || doc.availableUntil >= monthStart);
    }
    function isAutoAssignableDoctor(doc, dateObj = state.currentDate) {
        return isDoctorActiveOnDate(doc, dateObj) &&
            !isDutyExcludedDoctor(doc) &&
            !isManualOnlyDoctor(doc) &&
            !isDutyPausedDoctor(doc);
    }
    function isYoshidaYaeDoctor(doc) {
        return normalizeName(doc.name) === '吉田 也恵';
    }
    function isIwataYukiyoDoctor(doc) {
        return normalizeName(doc.name) === '岩田 幸代';
    }
    function isIwataPreferredRole(doc, role, dateObj, dateStr) {
        if (!isIwataYukiyoDoctor(doc)) return false;
        return role === 'wardNight';
    }
    function canDoSaturdayErDayExtraDoctor(doc, dateObj, dateStr) {
        return SATURDAY_ER_DAY_EXTRA_DOCTOR_NAMES.has(normalizeName(doc.name)) &&
            dateObj &&
            dateObj.getDay() === 6 &&
            !isFixedErDaySaturday(dateObj);
    }
    function isSpecialErDayExtraDate(dateObj) {
        return !!(dateObj && dateObj.getMonth() === 8 && dateObj.getDate() >= 19 && dateObj.getDate() <= 23);
    }
    function isExpandedWeekendErDayExtraDate(dateObj) {
        if (!dateObj) return false;
        const day = dateObj.getDay();
        if (day !== 0 && day !== 6) return false;
        const dateOnly = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        return dateOnly >= WEEKEND_ER_DAY_EXTRA_START_DATE;
    }
    function isActiveFixedErDaySaturday(dateObj) {
        return isFixedErDaySaturday(dateObj) && !isSpecialErDayExtraDate(dateObj);
    }
    function canDoSpecialErDayExtraDoctor(doc, dateObj) {
        return SPECIAL_ER_DAY_EXTRA_DOCTOR_NAMES.has(normalizeName(doc.name)) &&
            (isSpecialErDayExtraDate(dateObj) || isExpandedWeekendErDayExtraDate(dateObj));
    }
    function canDoErDaySpecialDoctor(doc, dateObj, dateStr) {
        return canDoSaturdayErDayExtraDoctor(doc, dateObj, dateStr) ||
            canDoSpecialErDayExtraDoctor(doc, dateObj) ||
            isIwataPreferredRole(doc, 'erDay', dateObj, dateStr);
    }
    function isFallbackErDayCandidate(doc, dateObj, dateStr) {
        return !doc.holidayErDayPreferred && canDoErDaySpecialDoctor(doc, dateObj, dateStr);
    }
    function getMonthlyDutyTarget(doc) {
        return MONTHLY_DUTY_TARGET_BY_NAME[normalizeName(doc.name)] || 1;
    }
    function getFixedWeekdayNgDays(doc) {
        return FIXED_WEEKDAY_NG_BY_NAME[normalizeName(doc.name)] || null;
    }
    function formatFixedWeekdayNgDays(doc) {
        const days = getFixedWeekdayNgDays(doc);
        return days ? [...days].map(dayIdx => DAY_NAMES[dayIdx]).join('・') : '';
    }
    function isFixedWeekdayNgDate(doc, dateObj) {
        const days = getFixedWeekdayNgDays(doc);
        return !!(days && dateObj && days.has(dateObj.getDay()));
    }
    function isFemaleSundayWardDaySlot(doc, dateObj, role) {
        return isFemaleDoctor(doc) && role === 'wardDay' && dateObj && dateObj.getDay() === 0;
    }
    function canAutoAssignFixedFemaleDoctor(doc, dateObj, role) {
        return !isFemaleDoctor(doc) || isFemaleSundayWardDaySlot(doc, dateObj, role);
    }
    function canWeekdayWardNightChief(doc, dateObj, dateStr) {
        if (isThursdayWardNightOnlyDoctor(doc)) {
            return doc.group === '部長' &&
                !doc.holidayErDayPreferred &&
                dateObj &&
                dateObj.getDay() === 4;
        }
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
        return !isErNightOnlyDoctor(doc) &&
            !isThursdayWardNightOnlyDoctor(doc) &&
            !isIwataYukiyoDoctor(doc) &&
            !isFridayWardOnlyDoctor(doc) &&
            isSeniorGroup(doc.group) &&
            !isPriorityErNightDoctor(doc);
    }
    function canDoWardNightPrimaryDoctor(doc, dateObj, dateStr) {
        if (isIwataPreferredRole(doc, 'wardNight', dateObj, dateStr)) return true;
        return isSeniorGroup(doc.group) &&
            (doc.group !== '部長' || canWeekdayWardNightChief(doc, dateObj, dateStr));
    }
    function canDoWardNightBackupDoctor(doc) {
        return doc.group === '6-7年目' && !isPriorityErNightDoctor(doc);
    }
    function canDoWardNightDoctor(doc, dateObj, dateStr) {
        if (isErNightOnlyDoctor(doc)) return false;
        if (isThursdayWardNightOnlyDoctor(doc)) {
            return !!(dateObj && dateObj.getDay() === 4 && canDoWardNightPrimaryDoctor(doc, dateObj, dateStr));
        }
        if (isFridayWardOnlyDoctor(doc)) return !!(dateObj && dateObj.getDay() === 5);
        return canDoWardNightPrimaryDoctor(doc, dateObj, dateStr) || canDoWardNightBackupDoctor(doc);
    }
    // 「病棟夜間も可」の医師は、手動でのみ病棟夜間に選べる。自動割り振りの候補判定は canDoWardNightDoctor のまま。
    function canDoWardNightByPermission(doc) {
        return hasWardNightPermission(doc) && !isErNightOnlyDoctor(doc) && !isDutyExcludedDoctor(doc);
    }
    // 個別設定「この月は病棟当直も可」（2026-11-16）。救急日中可の医師を、設定した月だけ病棟日中・病棟夜間の候補にする。
    // 手動で選ぶときだけ（自動割り振りは救急日中可の医師を候補から先に外す）。月は枠の日付で決める（表示中の月ではない）。
    // その月に休日救急日中を担当していれば、他枠不可の規則はそのまま効く。wardDutyMonths は 'YYYY-MM' の配列で、空なら持たない
    function normalizeWardDutyMonths(value) {
        return [...new Set((Array.isArray(value) ? value : [])
            .map(String)
            .filter(key => /^\d{4}-(0[1-9]|1[0-2])$/.test(key)))].sort();
    }
    function getWardDutyMonths(doc) {
        return Array.isArray(doc && doc.wardDutyMonths) ? doc.wardDutyMonths : [];
    }
    function canUseWardDutyMonthSetting(doc) {
        return !!(doc && doc.holidayErDayPreferred) && !isErNightOnlyDoctor(doc) && !isDutyExcludedDoctor(doc);
    }
    function hasMonthlyWardDutyPermission(doc, dateOrMonthStr) {
        return canUseWardDutyMonthSetting(doc) &&
            getWardDutyMonths(doc).includes(String(dateOrMonthStr || '').slice(0, 7));
    }
    function canDoWardRoleByMonthPermission(doc, role, dateStr) {
        if (!hasMonthlyWardDutyPermission(doc, dateStr)) return false;
        if (role === 'wardDay') return canDoWardDayDoctor(doc);
        return role === 'wardNight';
    }
    function canDoErNightDoctor(doc) {
        if (isThursdayWardNightOnlyDoctor(doc)) return false;
        return !isFridayWardOnlyDoctor(doc) &&
            (isErNightOnlyDoctor(doc) || isJunior(doc.group) || isPriorityErNightDoctor(doc));
    }

    function formatDateStr(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    function startOfSunday(date) {
        const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        result.setDate(result.getDate() - result.getDay());
        return result;
    }
    function addCalendarDays(date, amount) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
    }
    function setCurrentMonthFromDate(date) {
        state.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    function getDoctorNameParts(name) {
        const normalized = normalizeName(name);
        if (!normalized) return { surname: '', given: '' };
        const spaced = normalized.split(' ');
        if (spaced.length > 1) {
            return { surname: spaced[0], given: spaced.slice(1).join('') };
        }
        const compact = normalizeDoctorMatchName(normalized);
        const surname = MOBILE_SURNAME_BY_COMPACT_NAME[compact];
        if (!surname) return { surname: normalized, given: '' };
        return { surname, given: compact.slice(surname.length) };
    }
    function getMobileDoctorDisplayName(name, dateObj) {
        const normalized = normalizeName(name);
        if (!normalized || isExternalFixedDutyName(normalized)) return normalized;
        const parts = getDoctorNameParts(normalized);
        if (!parts.given) return parts.surname;
        const duplicateCount = state.doctors
            .filter(doc => isDoctorActiveOnDate(doc, dateObj))
            .map(doc => getDoctorNameParts(doc.name).surname)
            .filter(surname => surname === parts.surname)
            .length;
        return duplicateCount > 1 ? `${parts.surname}${parts.given.charAt(0)}` : parts.surname;
    }
    function formatMobileWeekRange(startDate) {
        const endDate = addCalendarDays(startDate, 6);
        if (startDate.getFullYear() !== endDate.getFullYear()) {
            return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日〜${endDate.getFullYear()}年${endDate.getMonth() + 1}月${endDate.getDate()}日`;
        }
        if (startDate.getMonth() !== endDate.getMonth()) {
            return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日〜${endDate.getMonth() + 1}月${endDate.getDate()}日`;
        }
        return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日〜${endDate.getDate()}日`;
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

    // 2026年10月用からのフォームは見出しが「当直希望日①」「当直不可日①」になったため、先頭の「当直」を外して
    // 「希望日1」「不可日1」として読む（2026-11-14。外さないと第1希望日・第1不可日を黙って読み飛ばしていた）
    function normalizeImportHeader(value) {
        return cleanImportCell(value)
            .replace(/^\uFEFF/, '')
            .replace(/[\s\n\r　（）()]/g, '')
            .replace(/[①１]/g, '1')
            .replace(/[②２]/g, '2')
            .replace(/[③３]/g, '3')
            .replace(/任意/g, '')
            .replace(/^当直/, '');
    }

    // 取り込みに使わないと分かっている見出し（正規化後）。希望日③は使うか未決定で、今は読まない
    const KNOWN_UNUSED_FORM_HEADERS = new Set(['希望日3']);

    function findImportColumn(headers, aliases) {
        const normalizedHeaders = headers.map(normalizeImportHeader);
        return aliases.reduce((found, alias) => {
            if (found >= 0) return found;
            return normalizedHeaders.indexOf(normalizeImportHeader(alias));
        }, -1);
    }

    function isRealDateStr(dateStr) {
        const dateObj = parseDateStr(dateStr);
        return !!dateObj && formatDateStr(dateObj) === dateStr;
    }

    // dates は従来の parseImportDateList と同じ結果。invalid は読めなかった語（実在しない日付を含む）で、結果表示に使う
    function parseImportDateListDetailed(value, refYear, refMonth) {
        const text = cleanImportCell(value);
        const dates = [];
        const invalid = [];
        if (!text) return { dates, invalid };
        text.split(/[,、\s]+/).forEach(token => {
            const trimmed = token.trim();
            if (!trimmed) return;
            const parsed = parseFlexibleDate(trimmed, refYear, refMonth);
            if (parsed) dates.push(parsed);
            if (!parsed || !isRealDateStr(parsed)) invalid.push(trimmed);
        });
        return { dates, invalid };
    }

    function parseImportDateList(value, refYear, refMonth) {
        return parseImportDateListDetailed(value, refYear, refMonth).dates;
    }

    const FORM_DATE_FIELDS = [
        { key: 'preferred1', label: '希望日1' },
        { key: 'preferred2', label: '希望日2' },
        { key: 'ng1', label: '不可日1' },
        { key: 'ng2', label: '不可日2' },
        { key: 'ng3', label: '不可日3' }
    ];

    function hasFormDateColumns(columns) {
        return !!columns && FORM_DATE_FIELDS.some(field => columns[field.key] >= 0);
    }

    function buildFormRowsFromAoA(rows) {
        return readFormSheet(rows).rows;
    }

    // 見出し行を探して、列の位置（columns）と回答の行（rows）を返す。空のシートは columns: null
    function readFormSheet(rows) {
        const nonEmptyRows = rows.filter(row => Array.isArray(row) && row.some(cell => cleanImportCell(cell)));
        if (nonEmptyRows.length === 0) return { rows: [], columns: null, unusedColumns: [] };
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
        const formRows = nonEmptyRows.slice(headerRowIndex + 1).map(row => ({
            name: cleanImportCell(row[columns.name]),
            preferred1: columns.preferred1 >= 0 ? row[columns.preferred1] : '',
            preferred2: columns.preferred2 >= 0 ? row[columns.preferred2] : '',
            ng1: columns.ng1 >= 0 ? row[columns.ng1] : '',
            ng2: columns.ng2 >= 0 ? row[columns.ng2] : '',
            ng3: columns.ng3 >= 0 ? row[columns.ng3] : '',
            notes: columns.notes >= 0 ? cleanImportCell(row[columns.notes]) : ''
        })).filter(row => row.name);
        // 「希望日」「不可日」を含むのに、どの列にも当たらなかった見出し（見出しの書き方が変わったときに気づくため）
        const mappedIndexes = new Set(Object.values(columns).filter(index => index >= 0));
        const unusedColumns = headers
            .map((header, index) => ({ header, index }))
            .filter(({ header, index }) => {
                if (mappedIndexes.has(index)) return false;
                const normalized = normalizeImportHeader(header);
                return /希望日|不可日/.test(normalized) && !KNOWN_UNUSED_FORM_HEADERS.has(normalized);
            })
            .map(({ header }) => cleanImportCell(header).replace(/\s+/g, ' '));
        return { rows: formRows, columns, unusedColumns };
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
    // 個別設定は保存済みの値を優先し、未保存（旧データ）ならマスタの初期値を使う
    function readDoctorSettingFlag(doc, defaultDoctor, key) {
        if (typeof doc[key] === 'boolean') return doc[key];
        return !!(defaultDoctor && defaultDoctor[key]);
    }

    function migrateDoctor(doc) {
        // 名前の字を直した医師は、同じ医師（同じ id）のまま名前だけ直す（2026-11-15）
        doc = { ...(doc || {}), name: correctDoctorName(doc && doc.name) };
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
        if (isWardDutyPriorityDoctor(doc)) holidayErDayPreferred = false;
        const outpatientDays = defaultDoctor ? (defaultDoctor.outpatientDays || []) : (doc.outpatientDays || []);
        const preferredDates1 = doc.preferredDates1 || [];
        const preferredDates2 = doc.preferredDates2 || [];
        const preferredDates = [...new Set([
            ...preferredDates1,
            ...preferredDates2,
            ...(doc.preferredDates || [])
        ])];
        // 「この月は病棟当直も可」の月。設定の無い医師には項目を足さない（共有データの医師の中身を変えないため）
        const wardDutyMonths = normalizeWardDutyMonths(doc.wardDutyMonths);
        return {
            id: doc.id, name: doc.name, group,
            department: doc.department || getDepartmentByName(doc.name),
            outpatientDays,
            holidayErDayPreferred,
            availableFrom: defaultDoctor ? (defaultDoctor.availableFrom || '') : (doc.availableFrom || ''),
            availableUntil: defaultDoctor ? (defaultDoctor.availableUntil || '') : (doc.availableUntil || ''),
            dutyPaused: readDoctorSettingFlag(doc, defaultDoctor, 'dutyPaused'),
            wardNightAllowed: readDoctorSettingFlag(doc, defaultDoctor, 'wardNightAllowed'),
            holidayLimitRelaxed: readDoctorSettingFlag(doc, defaultDoctor, 'holidayLimitRelaxed'),
            ...(wardDutyMonths.length > 0 ? { wardDutyMonths } : {}),
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

    function migrateFormResponseRecord(record) {
        const preferredDates1 = Array.isArray(record && record.preferredDates1) ? record.preferredDates1 : [];
        const preferredDates2 = Array.isArray(record && record.preferredDates2) ? record.preferredDates2 : [];
        return {
            doctorName: correctDoctorName((record && record.doctorName) || '') || '',
            preferredDates1,
            preferredDates2,
            preferredDates: [...new Set([
                ...preferredDates1,
                ...preferredDates2,
                ...((record && record.preferredDates) || [])
            ])],
            ngDates1: Array.isArray(record && record.ngDates1) ? record.ngDates1 : [],
            ngDates2: Array.isArray(record && record.ngDates2) ? record.ngDates2 : [],
            ngDates3: Array.isArray(record && record.ngDates3) ? record.ngDates3 : [],
            notes: (record && record.notes) || ''
        };
    }

    function migrateFormResponsesByMonth(formResponsesByMonth) {
        const out = {};
        for (const [monthKey, snapshot] of Object.entries(formResponsesByMonth || {})) {
            const responses = {};
            // 名前の字を直した医師の回答は、正しい字の鍵へ移す。同じ月に両方あれば正しい字の方を使う（2026-11-15）
            const corrected = [];
            Object.entries((snapshot && snapshot.responses) || {}).forEach(([nameKey, record]) => {
                const compact = normalizeName(nameKey).replace(/\s+/g, '');
                if (Object.prototype.hasOwnProperty.call(DOCTOR_NAME_CORRECTIONS, compact)) {
                    corrected.push([DOCTOR_NAME_CORRECTIONS[compact], record]);
                    return;
                }
                responses[nameKey] = migrateFormResponseRecord(record);
            });
            corrected.forEach(([nameKey, record]) => {
                if (responses[nameKey]) return;
                const migrated = migrateFormResponseRecord(record);
                responses[nameKey] = { ...migrated, doctorName: migrated.doctorName || nameKey };
            });
            out[monthKey] = {
                importedAt: (snapshot && snapshot.importedAt) || '',
                responders: correctDoctorNameList(snapshot && snapshot.responders),
                duplicateNames: correctDoctorNameList(snapshot && snapshot.duplicateNames),
                notFound: Array.isArray(snapshot && snapshot.notFound) ? snapshot.notFound : [],
                responses
            };
        }
        return out;
    }

    // 月ごとの回答の記録（古い形）も、回答した医師の名前を正しい字に直す。ほかの項目はそのまま
    function migrateFormResponseStatus(formResponseStatus) {
        const out = {};
        for (const [monthKey, status] of Object.entries(formResponseStatus || {})) {
            if (!status || typeof status !== 'object') {
                out[monthKey] = status;
                continue;
            }
            out[monthKey] = { ...status };
            if (Array.isArray(status.responders)) out[monthKey].responders = correctDoctorNameList(status.responders);
            if (Array.isArray(status.duplicateNames)) out[monthKey].duplicateNames = correctDoctorNameList(status.duplicateNames);
        }
        return out;
    }

    // 古い版の画面（名前を直す前のアプリ）が、直した名前の医師を「一覧にいない」と見て古い字の医師をもう1人足し、
    // それが共有されたときに、1人にまとめる。割り当ての多い方を残し、もう一方の割り当ては残す方へつけ替える（2026-11-15）
    function mergeCorrectedDoctorDuplicates(target) {
        if (!target || !Array.isArray(target.doctors)) return 0;
        const groups = new Map();
        target.doctors.forEach(doc => {
            const key = normalizeDoctorMatchName(doc && doc.name);
            if (!doc || !doc.id || !CORRECTED_DOCTOR_NAMES.has(key)) return;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(doc);
        });
        const shiftMaps = [target.shifts, ...Object.values(target.savedMonths || {}).map(saved => saved && saved.shifts)]
            .filter(shifts => shifts && typeof shifts === 'object');
        const remap = new Map();
        groups.forEach(docs => {
            if (docs.length < 2) return;
            const counts = new Map(docs.map(doc => [doc.id, 0]));
            shiftMaps.forEach(shifts => Object.values(shifts).forEach(day => Object.values(day || {}).forEach(id => {
                if (counts.has(id)) counts.set(id, counts.get(id) + 1);
            })));
            const keep = docs.reduce((best, doc) => (counts.get(doc.id) > counts.get(best.id) ? doc : best), docs[0]);
            docs.forEach(doc => {
                if (doc !== keep && doc.id !== keep.id) remap.set(doc.id, keep.id);
            });
        });
        if (remap.size === 0) return 0;
        target.doctors = target.doctors.filter(doc => !(doc && remap.has(doc.id)));
        shiftMaps.forEach(shifts => Object.values(shifts).forEach(day => {
            if (!day || typeof day !== 'object') return;
            Object.keys(day).forEach(role => {
                if (remap.has(day[role])) day[role] = remap.get(day[role]);
            });
        }));
        console.info('Merged duplicate doctors after the name correction:', remap.size);
        return remap.size;
    }

    function buildLegacyMonthlyFormResponses(doctors, formResponseStatus) {
        const statuses = Object.entries(formResponseStatus || {})
            .filter(([, status]) => status && Array.isArray(status.responders) && status.responders.length > 0)
            .sort((a, b) => String((b[1] && b[1].importedAt) || '').localeCompare(String((a[1] && a[1].importedAt) || '')));
        if (statuses.length === 0) return {};

        const [monthKey, status] = statuses[0];
        const responderSet = new Set((status.responders || []).map(normalizeDoctorMatchName));
        const responses = {};
        doctors.forEach(doc => {
            if (!responderSet.has(normalizeDoctorMatchName(doc.name))) return;
            const record = migrateFormResponseRecord({
                doctorName: doc.name,
                preferredDates1: doc.preferredDates1 || [],
                preferredDates2: doc.preferredDates2 || [],
                preferredDates: doc.preferredDates || [],
                ngDates1: doc.ngDates1 || [],
                ngDates2: doc.ngDates2 || [],
                ngDates3: doc.ngDates3 || [],
                notes: doc.notes || ''
            });
            responses[normalizeDoctorMatchName(doc.name)] = record;
        });
        return {
            [monthKey]: {
                importedAt: status.importedAt || '',
                responders: status.responders || [],
                duplicateNames: status.duplicateNames || [],
                notFound: status.notFound || [],
                responses
            }
        };
    }

    // ===== State =====
    let pendingNgDates = [];
    let editingDateStr = null;
    let editingDateObj = null;
    let assignmentReturnFocus = null;
    let modalOverrideAckKey = '';
    let syncSettingsReturnFocus = null;

    const STORAGE_KEYS = {
        doctors: 'doctors',
        shifts: 'shifts',
        specialDayRules: 'specialDayRules',
        savedMonths: 'savedMonths',
        formResponseStatus: 'formResponseStatus',
        formResponsesByMonth: 'formResponsesByMonth',
        syncConfig: 'sharedSaveConfig',
        syncClientId: 'sharedSaveClientId',
        syncRemoteMeta: 'sharedSaveRemoteMeta',
        // 共有保存の保存先を自動で替えたか（替えた・手で戻した）の記録。1台につき1回だけ替えるため（2026-11-15）
        syncMove: 'sharedSaveMove'
    };

    function readStoredJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            console.warn('Storage parse error:', key, err);
            return fallback;
        }
    }

    function writeStoredJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function normalizeSyncConfig(config) {
        return {
            endpoint: String((config && config.endpoint) || '').trim(),
            appKey: String((config && config.appKey) || '').trim(),
            userName: String((config && config.userName) || '').trim()
        };
    }

    function loadLocalSnapshot() {
        const rawDoctors = readStoredJson(STORAGE_KEYS.doctors, []);
        const doctors = (Array.isArray(rawDoctors) ? rawDoctors : []).map(migrateDoctor);
        const formResponseStatus = migrateFormResponseStatus(readStoredJson(STORAGE_KEYS.formResponseStatus, {}) || {});
        const storedMonthlyResponses = migrateFormResponsesByMonth(readStoredJson(STORAGE_KEYS.formResponsesByMonth, {}) || {});
        const snapshot = {
            doctors,
            shifts: migrateShifts(readStoredJson(STORAGE_KEYS.shifts, {}) || {}),
            specialDayRules: readStoredJson(STORAGE_KEYS.specialDayRules, {}) || {},
            savedMonths: migrateSavedMonths(readStoredJson(STORAGE_KEYS.savedMonths, {}) || {}),
            formResponseStatus,
            formResponsesByMonth: Object.keys(storedMonthlyResponses).length > 0
                ? storedMonthlyResponses
                : buildLegacyMonthlyFormResponses(doctors, formResponseStatus)
        };
        mergeCorrectedDoctorDuplicates(snapshot);
        return snapshot;
    }

    const localSnapshot = loadLocalSnapshot();

    const state = {
        currentDate: new Date(),
        doctors: localSnapshot.doctors,
        shifts: localSnapshot.shifts,
        holidays: {},
        specialDayRules: localSnapshot.specialDayRules,
        savedMonths: localSnapshot.savedMonths,
        formResponseStatus: localSnapshot.formResponseStatus,
        formResponsesByMonth: localSnapshot.formResponsesByMonth
    };

    const mobileMedia = window.matchMedia('(max-width: 767px)');
    const viewState = {
        mobileWeekStart: null,
        mobileActiveDate: new Date(),
        mobileMedia,
        activeMobilePanel: 'calendar'
    };

    // 在籍終了日のないマスタ医師は、共有データから消えていても読み込み時に一覧へ戻す（2026-11-07 利用者依頼）。
    // 一覧の「×」（削除）は廃止済み。一覧から外す医師は DEFAULT_DOCTORS の availableUntil で外す。
    function getRequiredDoctorNames() {
        return new Set([
            ...REQUIRED_EXTRA_DOCTOR_NAMES,
            ...DEFAULT_DOCTORS.filter(doc => !doc.availableUntil).map(doc => doc.name)
        ]);
    }

    // 戻した医師の名前を返す（戻した医師がいなければ空の配列）
    function ensureRequiredExtraDoctors() {
        const added = [];
        getRequiredDoctorNames().forEach(name => {
            const exists = state.doctors.some(doc => normalizeDoctorMatchName(doc.name) === normalizeDoctorMatchName(name));
            if (exists) return;
            const defaultDoctor = DEFAULT_DOCTORS.find(doc => normalizeDoctorMatchName(doc.name) === normalizeDoctorMatchName(name));
            if (!defaultDoctor) return;
            state.doctors.push(buildDoctorFromDefault(defaultDoctor));
            added.push(defaultDoctor.name);
        });
        return added;
    }

    const syncState = {
        config: normalizeSyncConfig(readStoredJson(STORAGE_KEYS.syncConfig, {})),
        clientId: localStorage.getItem(STORAGE_KEYS.syncClientId) || generateId(),
        remoteMeta: readStoredJson(STORAGE_KEYS.syncRemoteMeta, { revision: '', updatedAt: '', updatedBy: '' }) || {},
        saveTimer: null,
        saveInFlight: false,
        saveQueued: false,
        queuedReason: '',
        lastConflictRevision: '',
        // saveLocalData のたびに増える。共有保存の時点から変更がないかを見る
        localEditSeq: 0,
        // 自動割り振り（saveLocalOnlyData）や戻した医師など、まだ共有していない変更があるか
        unsharedLocalChanges: false,
        // フォーム回答の自動取り込み（2026-11-14）。この端末の画面の間だけの状態で、保存しない
        formImport: {
            available: false,
            // Apps Script側がフォームの自動作成に対応しているか（load の応答の formImport.create。2026-11-15）
            create: false,
            // Apps Script側の一覧に登録されている月（load の応答の formImport.months）。無い版の Apps Script では null
            months: null,
            generation: 0,
            byMonth: {},
            diagnostics: {}
        }
    };
    localStorage.setItem(STORAGE_KEYS.syncClientId, syncState.clientId);

    // ===== DOM References =====
	    const els = {
	        appHeader: document.querySelector('.app-header'),
	        headerActions: document.querySelector('.header-actions'),
	        appContainer: document.querySelector('.app-container'),
	        sidebar: document.querySelector('.sidebar'),
	        calendarSection: document.querySelector('.calendar-section'),
	        currentMonthDisplay: document.getElementById('current-month-display'),
	        prevMonthBtn: document.getElementById('prev-month'),
	        nextMonthBtn: document.getElementById('next-month'),
            mobileActionsToggle: document.getElementById('mobile-actions-toggle'),
            mobileCalendarTab: document.getElementById('mobile-calendar-tab'),
            mobileDoctorsTab: document.getElementById('mobile-doctors-tab'),
            prevWeekBtn: document.getElementById('prev-week'),
            nextWeekBtn: document.getElementById('next-week'),
            mobileWeekRange: document.getElementById('mobile-week-range'),
            mobileTargetMonth: document.getElementById('mobile-target-month'),
            syncStatus: document.getElementById('sync-status'),
            syncSaveBtn: document.getElementById('sync-save-btn'),
            syncRefreshBtn: document.getElementById('sync-refresh-btn'),
            syncSettingsBtn: document.getElementById('sync-settings-btn'),
            syncSettingsModal: document.getElementById('sync-settings-modal'),
            syncSettingsOverlay: document.getElementById('sync-settings-overlay'),
            closeSyncSettingsBtn: document.getElementById('close-sync-settings'),
            cancelSyncSettingsBtn: document.getElementById('cancel-sync-settings'),
            saveSyncSettingsBtn: document.getElementById('save-sync-settings'),
            disableSyncSettingsBtn: document.getElementById('disable-sync-settings'),
            syncEndpointUrl: document.getElementById('sync-endpoint-url'),
            syncAppKey: document.getElementById('sync-app-key'),
            syncUserName: document.getElementById('sync-user-name'),
            doctorSettingsModal: document.getElementById('doctor-settings-modal'),
            doctorSettingsOverlay: document.getElementById('doctor-settings-overlay'),
            closeDoctorSettingsBtn: document.getElementById('close-doctor-settings'),
            cancelDoctorSettingsBtn: document.getElementById('cancel-doctor-settings'),
            saveDoctorSettingsBtn: document.getElementById('save-doctor-settings'),
            doctorSettingsName: document.getElementById('doctor-settings-name'),
            doctorSettingPaused: document.getElementById('doctor-setting-paused'),
            doctorSettingWardNight: document.getElementById('doctor-setting-ward-night'),
            doctorSettingWardMonthRow: document.getElementById('doctor-setting-ward-month-row'),
            doctorSettingWardMonth: document.getElementById('doctor-setting-ward-month'),
            doctorSettingWardMonthTitle: document.getElementById('doctor-setting-ward-month-title'),
            doctorSettingHolidayRelaxed: document.getElementById('doctor-setting-holiday-relaxed'),
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
        formImportPanel: document.getElementById('form-import-panel'),
        formImportSummary: document.getElementById('form-import-summary'),
        formImportBody: document.getElementById('form-import-body'),
        formImportAutoStatus: document.getElementById('form-import-auto-status'),
        formCreateBtn: document.getElementById('form-create-btn'),
        formCreateModal: document.getElementById('form-create-modal'),
        formCreateOverlay: document.getElementById('form-create-overlay'),
        closeFormCreateBtn: document.getElementById('close-form-create'),
        cancelFormCreateBtn: document.getElementById('cancel-form-create'),
        submitFormCreateBtn: document.getElementById('submit-form-create'),
        formCreateInput: document.getElementById('form-create-input'),
        formCreateMonth: document.getElementById('form-create-month'),
        formCreateDeadlineGroup: document.getElementById('form-create-deadline-group'),
        formCreateDeadline: document.getElementById('form-create-deadline'),
        formCreateDoctorSummary: document.getElementById('form-create-doctor-summary'),
        formCreateDoctorList: document.getElementById('form-create-doctor-list'),
        formCreateNote: document.getElementById('form-create-note'),
        formCreateProgress: document.getElementById('form-create-progress'),
        formCreateResult: document.getElementById('form-create-result'),
        clearCurrentMonthBtn: document.getElementById('clear-current-month-btn'),
	        clearAllBtn: document.getElementById('clear-all-data-btn'),
	        modal: document.getElementById('assignment-modal'),
        modalOverlay: document.getElementById('modal-overlay'),
        closeModalBtn: document.getElementById('close-modal'),
        cancelAssignmentBtn: document.getElementById('cancel-assignment'),
        saveAssignmentBtn: document.getElementById('save-assignment'),
        modalDateDisplay: document.getElementById('modal-date-display'),
        modalWarnings: document.getElementById('modal-warnings'),
        overrideConfirm: document.getElementById('override-confirm'),
        overrideConfirmCheckbox: document.getElementById('override-confirm-checkbox'),
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
    function buildPersistedSnapshot() {
        return {
            schemaVersion: 3,
            savedAt: new Date().toISOString(),
            doctors: state.doctors,
            shifts: state.shifts,
            specialDayRules: state.specialDayRules,
            savedMonths: state.savedMonths,
            formResponseStatus: state.formResponseStatus,
            formResponsesByMonth: state.formResponsesByMonth
        };
    }

    function applyPersistedSnapshot(snapshot) {
        if (!snapshot || typeof snapshot !== 'object') return;
        state.doctors = (Array.isArray(snapshot.doctors) ? snapshot.doctors : []).map(migrateDoctor);
        state.shifts = migrateShifts(snapshot.shifts || {});
        state.specialDayRules = snapshot.specialDayRules || {};
        state.savedMonths = migrateSavedMonths(snapshot.savedMonths || {});
        state.formResponseStatus = migrateFormResponseStatus(snapshot.formResponseStatus || {});
        state.formResponsesByMonth = migrateFormResponsesByMonth(snapshot.formResponsesByMonth || {});
        mergeCorrectedDoctorDuplicates(state);
    }

    function saveLocalData() {
        syncState.localEditSeq++;
        writeStoredJson(STORAGE_KEYS.doctors, state.doctors);
        writeStoredJson(STORAGE_KEYS.shifts, state.shifts);
        writeStoredJson(STORAGE_KEYS.specialDayRules, state.specialDayRules);
        writeStoredJson(STORAGE_KEYS.savedMonths, state.savedMonths);
        writeStoredJson(STORAGE_KEYS.formResponseStatus, state.formResponseStatus);
        writeStoredJson(STORAGE_KEYS.formResponsesByMonth, state.formResponsesByMonth);
    }

    function saveRemoteMeta() {
        writeStoredJson(STORAGE_KEYS.syncRemoteMeta, syncState.remoteMeta || {});
    }

    // ===== 共有保存の保存先の引っ越し（2026-11-15） =====
    // 古い公開（2つ）のURLが入っている端末を、次に開いたときに、新しい公開のURLへ替える。合言葉と名前はそのまま使う。
    // このコードは公開リポジトリで誰でも読めるので、URLはそのまま書かない。新しいURLを、古い公開のデプロイIDを鍵にして
    // 暗号化して載せる（AES-GCM。鍵は SHA-256(keyPrefix + s + ':' + デプロイID)）。古いURLを持つ端末だけが開ける
    const SHARED_ENDPOINT_MOVE = {
        id: 'ych-2026-11',
        keyPrefix: 'toutyoku-shared-move:v1:',
        entries: [
            // 古い公開1
            { s: 'Hp+VPdcf4qX9zMi8rchScA==', i: 'CU8o7FEbkqXBGBed', d: 'wmUXXva91/XYtIPisQPkwxA1hyROKudmhDV8Xl1E3ffHJg34naXBAq2G4c6SJazxOSkC9LuH9QFRLKrdybdaIEAsQzIols9Wc+Vr0pJhsprmcIE5g4ugokdC4mj046lprPb0yAYtz4BnCUhs7R3sR/0pLOwIFoJhYG8o6DwB1Aw=' },
            // 古い公開2
            { s: 'E8GZSf2UnFTqX/cEhlJGkw==', i: '1YVNSXOVq/+CLUf2', d: 'LsLMNbgJJXl/zclCUGKfgIgWD/1COVhs6QfcO51GWVoLSj6+vx+9Z4aVHcx3sYqWzR5E5fa4/+OwX8yLDnMsE/89k7vfGS1gesTkAyjU7GG+w0tAFH1VRa/hpRkZT/WBXM/ZFcqf0RP7/21kPFgHwoDglQpu5qjgAG0fT21lJLo=' }
        ]
    };
    const SHARED_ENDPOINT_MOVE_TIMEOUT_MS = 10000;

    function getAppsScriptDeploymentId(endpoint) {
        const match = String(endpoint || '').match(/\/s\/([A-Za-z0-9_-]{20,})(?=[/?#]|$)/);
        return match ? match[1] : '';
    }

    function decodeBase64Bytes(text) {
        return Uint8Array.from(atob(text), ch => ch.charCodeAt(0));
    }

    // 古い公開のURLなら、引っ越し先（新しい公開）のURLを返す。ほかのURLでは暗号が開かないので '' を返す
    async function findMovedSharedEndpoint(endpoint) {
        const deploymentId = getAppsScriptDeploymentId(endpoint);
        if (!deploymentId || !window.crypto || !window.crypto.subtle) return '';
        const encoder = new TextEncoder();
        for (const entry of SHARED_ENDPOINT_MOVE.entries) {
            try {
                const raw = await window.crypto.subtle.digest('SHA-256', encoder.encode(`${SHARED_ENDPOINT_MOVE.keyPrefix}${entry.s}:${deploymentId}`));
                const key = await window.crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
                const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: decodeBase64Bytes(entry.i) }, key, decodeBase64Bytes(entry.d));
                const next = new TextDecoder().decode(plain).trim();
                if (/^https?:\/\/\S+$/.test(next)) return next;
            } catch (err) {
                // この古い公開のURLではない
            }
        }
        return '';
    }

    function readSharedEndpointMoveRecord() {
        const record = readStoredJson(STORAGE_KEYS.syncMove, null);
        return record && record.id === SHARED_ENDPOINT_MOVE.id ? record : null;
    }

    // 起動時に、共有保存を読む前に呼ぶ。替えるのは1台につき1回だけで、手で古いURLに戻した端末は替えない。
    // 新しい保存先から読めて、そこにデータが入っているときだけ替える。読めなければ何も変えず、今までどおり古い保存先を使う
    async function moveSharedEndpointIfNeeded() {
        if (!isSharedSyncEnabled() || readSharedEndpointMoveRecord()) return false;
        const previousConfig = syncState.config;
        const previousMeta = syncState.remoteMeta;
        try {
            const next = await findMovedSharedEndpoint(previousConfig.endpoint);
            if (!next || next === previousConfig.endpoint) return false;
            syncState.config = normalizeSyncConfig({ ...previousConfig, endpoint: next });
            const meta = await requestSharedJsonp({ action: 'meta' }, SHARED_ENDPOINT_MOVE_TIMEOUT_MS);
            // 空の保存先に替えると、この端末の内容が自動で保存されて上書きのもとになるので替えない
            if (!meta || meta.empty || !meta.revision) throw new Error('新しい共有保存にデータがありません。');
            writeStoredJson(STORAGE_KEYS.syncConfig, syncState.config);
            syncState.remoteMeta = { revision: '', updatedAt: '', updatedBy: '' };
            saveRemoteMeta();
            writeStoredJson(STORAGE_KEYS.syncMove, { id: SHARED_ENDPOINT_MOVE.id, result: 'moved', at: new Date().toISOString() });
            console.info('Shared endpoint moved to the new deployment');
            return true;
        } catch (err) {
            // どこで失敗しても、元の保存先のまま起動を続ける（途中まで書いた分も元に戻す）
            syncState.config = previousConfig;
            syncState.remoteMeta = previousMeta;
            try {
                writeStoredJson(STORAGE_KEYS.syncConfig, previousConfig);
                saveRemoteMeta();
            } catch (restoreErr) {
                console.warn('Shared endpoint move restore error', restoreErr);
            }
            console.warn('Shared endpoint move skipped', err);
            return false;
        }
    }

    // 「共有設定」で、新しい保存先から古い保存先へ手で戻したときは、この端末ではもう自動で替えない（手順書の「戻し方」）
    async function rememberSharedEndpointRollback(previousEndpoint, nextEndpoint) {
        if (!previousEndpoint || !nextEndpoint || previousEndpoint === nextEndpoint) return;
        const movedTo = await findMovedSharedEndpoint(nextEndpoint);
        if (movedTo && movedTo === previousEndpoint) {
            writeStoredJson(STORAGE_KEYS.syncMove, { id: SHARED_ENDPOINT_MOVE.id, result: 'rolled-back', at: new Date().toISOString() });
        }
    }

    function isSharedSyncEnabled() {
        return !!(syncState.config && syncState.config.endpoint);
    }

    function getSyncUserName() {
        return syncState.config.userName || '未設定の利用者';
    }

    function formatSyncTime(iso) {
        if (!iso) return '';
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function updateSyncStatus(kind, message, title) {
        if (!els.syncStatus) return;
        const enabled = isSharedSyncEnabled();
        const resolvedKind = enabled ? kind : 'local';
        const labelMap = {
            local: 'ローカル保存',
            ready: '共有接続中',
            pending: '共有保存待ち',
            syncing: '共有同期中',
            saved: message || '共有同期済',
            'local-changed': message || '未共有変更あり',
            conflict: '他者更新あり',
            error: '共有保存エラー'
        };
        els.syncStatus.className = `sync-status sync-${resolvedKind}`;
        els.syncStatus.textContent = labelMap[resolvedKind] || labelMap.local;
        els.syncStatus.title = title || (enabled
            ? `共有保存: ${syncState.config.endpoint}`
            : 'この端末のブラウザ内に保存しています');
        if (els.syncSaveBtn) els.syncSaveBtn.disabled = !enabled;
        if (els.syncRefreshBtn) els.syncRefreshBtn.disabled = !enabled;
    }

    function renderSyncStatusFromMeta() {
        if (!isSharedSyncEnabled()) {
            updateSyncStatus('local');
            return;
        }
        const updated = formatSyncTime(syncState.remoteMeta && syncState.remoteMeta.updatedAt);
        const by = (syncState.remoteMeta && syncState.remoteMeta.updatedBy) || '';
        updateSyncStatus(
            syncState.remoteMeta && syncState.remoteMeta.revision ? 'saved' : 'ready',
            updated ? `共有同期済 ${updated}` : '共有接続中',
            by ? `最終共有更新: ${updated} / ${by}` : '共有保存に接続しています'
        );
    }

    function buildSharedUrl(params) {
        const url = new URL(syncState.config.endpoint);
        Object.entries(params || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) url.searchParams.set(key, value);
        });
        if (syncState.config.appKey) url.searchParams.set('appKey', syncState.config.appKey);
        return url.toString();
    }

    // 共有保存の読み出し（JSONP）。まず、Googleのログイン情報（Cookie）を付けずに読む。
    // 個人のGoogleアカウントにログインしたふだんのブラウザで、院内アカウントの公開をログイン情報付きで読むと、
    // 「共有保存に接続できませんでした」になる（ログイン情報なしなら読める。2026-11-15）。
    // ログイン情報なしで読めなかったときだけ、これまでの読み方で1回読み直す（古い公開を使う端末の動きを変えないため）
    function requestSharedJsonp(params, timeoutMs = 15000) {
        return requestSharedJsonpOnce(params, timeoutMs, true).catch(err => {
            if (err && err.sharedConnectFailed) return requestSharedJsonpOnce(params, timeoutMs, false);
            throw err;
        });
    }

    function requestSharedJsonpOnce(params, timeoutMs, withoutLogin) {
        return new Promise((resolve, reject) => {
            if (!isSharedSyncEnabled()) {
                reject(new Error('共有保存が設定されていません。'));
                return;
            }
            const callbackName = `__dutySync_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const script = document.createElement('script');
            // crossOrigin = 'anonymous' でログイン情報を付けない。応答に Access-Control-Allow-Origin が要る
            // （Apps Scriptの応答は、転送の前後とも * を返す。2026-11-15確認）
            if (withoutLogin) script.crossOrigin = 'anonymous';
            let timer = null;
            const cleanup = () => {
                if (timer) clearTimeout(timer);
                delete window[callbackName];
                if (script.parentNode) script.parentNode.removeChild(script);
            };
            window[callbackName] = payload => {
                cleanup();
                if (payload && payload.ok) resolve(payload);
                else reject(new Error((payload && payload.error) || '共有保存の応答が不正です。'));
            };
            script.onerror = () => {
                cleanup();
                const error = new Error('共有保存に接続できませんでした。');
                error.sharedConnectFailed = true;
                reject(error);
            };
            timer = setTimeout(() => {
                cleanup();
                reject(new Error('共有保存の応答がタイムアウトしました。'));
            }, timeoutMs);
            try {
                script.src = buildSharedUrl({ ...params, callback: callbackName, t: Date.now() });
            } catch (err) {
                cleanup();
                reject(err);
                return;
            }
            document.head.appendChild(script);
        });
    }

    async function postSharedSnapshot(reason, expectedRevision) {
        const body = new URLSearchParams();
        body.set('action', 'save');
        body.set('appKey', syncState.config.appKey || '');
        body.set('expectedRevision', expectedRevision || '');
        body.set('updatedBy', getSyncUserName());
        body.set('clientId', syncState.clientId);
        body.set('reason', reason || '変更');
        body.set('snapshot', JSON.stringify(buildPersistedSnapshot()));
        await fetch(syncState.config.endpoint, {
            method: 'POST',
            mode: 'no-cors',
            body
        });
    }

    function handleSharedConflict(meta, options = {}) {
        const revision = String((meta && meta.revision) || '');
        const updated = formatSyncTime(meta && meta.updatedAt);
        const by = (meta && meta.updatedBy) || '他の利用者';
        updateSyncStatus('conflict', '', `先に共有更新があります: ${updated} / ${by}`);
        // 自動取り込みの重なり（quiet）は警告を出さない。同じ版の警告を繰り返さないための記録にも残さない
        // （残すと、その後に手で「共有保存」を押したときの警告が出なくなるため。2026-11-14）
        if (options.quiet) return;
        const previousConflictRevision = syncState.lastConflictRevision;
        syncState.lastConflictRevision = revision || syncState.lastConflictRevision;
        if (revision && previousConflictRevision === revision) return;
        alert(`他の利用者が先に共有保存しました。\n\n共有保存は中断しました。必要に応じて「共有読込」で最新状態を確認してください。\n最終更新: ${updated || '不明'} / ${by}`);
    }

    // 戻り値: 'disabled' | 'queued' | 'conflict' | 'saved' | 'error'（既存の呼び出し元は戻り値を使わない）
    // options.quietConflict: 競合しても alert を出さない（フォーム回答の自動取り込みで使う）
    async function saveSharedData(reason, options = {}) {
        if (!isSharedSyncEnabled()) return 'disabled';
        if (syncState.saveInFlight) {
            syncState.saveQueued = true;
            syncState.queuedReason = reason || syncState.queuedReason || '変更';
            return 'queued';
        }
        syncState.saveInFlight = true;
        updateSyncStatus('syncing');
        let outcome = 'error';
        try {
            const meta = await requestSharedJsonp({ action: 'meta' });
            const remoteRevision = meta.empty ? '' : String(meta.revision || '');
            const localRevision = String((syncState.remoteMeta && syncState.remoteMeta.revision) || '');
            if (remoteRevision && remoteRevision !== localRevision) {
                handleSharedConflict(meta, { quiet: !!options.quietConflict });
                outcome = 'conflict';
                return outcome;
            }

            const editSeqAtPost = syncState.localEditSeq;
            await postSharedSnapshot(reason, remoteRevision);
            await new Promise(resolve => setTimeout(resolve, 1200));

            const nextMeta = await requestSharedJsonp({ action: 'meta' });
            const oldRevisionNumber = Number(remoteRevision || 0);
            const newRevisionNumber = Number(nextMeta.revision || 0);
            if (!nextMeta.empty && newRevisionNumber > oldRevisionNumber && nextMeta.clientId === syncState.clientId) {
                syncState.remoteMeta = {
                    revision: String(nextMeta.revision || ''),
                    updatedAt: nextMeta.updatedAt || '',
                    updatedBy: nextMeta.updatedBy || ''
                };
                saveRemoteMeta();
                renderSyncStatusFromMeta();
                if (syncState.localEditSeq === editSeqAtPost) syncState.unsharedLocalChanges = false;
                outcome = 'saved';
            } else if (!nextMeta.empty && newRevisionNumber > oldRevisionNumber) {
                handleSharedConflict(nextMeta, { quiet: !!options.quietConflict });
                outcome = 'conflict';
            } else {
                throw new Error(nextMeta.lastError || '共有保存の完了確認ができませんでした。');
            }
        } catch (err) {
            console.warn('Shared save error', err);
            updateSyncStatus('error', '', err && err.message ? err.message : '共有保存でエラーが発生しました。');
            outcome = 'error';
        } finally {
            syncState.saveInFlight = false;
            if (syncState.saveQueued) {
                const queuedReason = syncState.queuedReason || '変更';
                syncState.saveQueued = false;
                syncState.queuedReason = '';
                scheduleSharedSave(queuedReason);
            }
        }
        return outcome;
    }

    function scheduleSharedSave(reason) {
        if (!isSharedSyncEnabled()) return;
        if (syncState.saveTimer) clearTimeout(syncState.saveTimer);
        updateSyncStatus('pending');
        syncState.saveTimer = setTimeout(() => {
            syncState.saveTimer = null;
            saveSharedData(reason || '変更');
        }, 700);
    }

    function saveData(reason = '変更') {
        saveLocalData();
        scheduleSharedSave(reason);
    }

    function saveLocalOnlyData(reason = '変更') {
        saveLocalData();
        if (isSharedSyncEnabled()) {
            syncState.unsharedLocalChanges = true;
            updateSyncStatus('local-changed', '未共有変更あり', `${reason} はこの端末に保存済みです。共有するには「共有保存」を押してください。`);
        }
    }

    function saveSharedNow() {
        if (!isSharedSyncEnabled()) {
            alert('共有保存が設定されていません。');
            return;
        }
        if (!confirm('現在の内容を共有保存しますか？')) return;
        saveLocalData();
        saveSharedData('手動共有保存');
    }

    async function loadSharedData(options = {}) {
        if (!isSharedSyncEnabled()) {
            updateSyncStatus('local');
            return false;
        }
        updateSyncStatus('syncing');
        try {
            const result = await requestSharedJsonp({ action: 'load' });
            // Apps Script側がフォーム回答の読み出しに対応しているときだけ、自動取り込みを動かす。
            // 対応前のApps Scriptに知らない読み出しを送ると、エラーが共有保存側に記録されるため（2026-11-14）
            syncState.formImport.available = !!(result && result.formImport && result.formImport.enabled === true);
            syncState.formImport.months = result && result.formImport && Array.isArray(result.formImport.months)
                ? result.formImport.months.map(String)
                : null;
            syncState.formImport.create = syncState.formImport.available && result.formImport.create === true;
            renderFormCreateButton();
            if (result.empty) {
                syncState.remoteMeta = { revision: '', updatedAt: '', updatedBy: '' };
                saveRemoteMeta();
                renderSyncStatusFromMeta();
                if (!options.silent) alert('共有保存はまだ空です。この端末の内容を次回保存時に共有へ反映します。');
                return false;
            }

            applyPersistedSnapshot(result.snapshot || {});
            const addedRequiredDoctors = ensureRequiredExtraDoctors();
            syncState.remoteMeta = {
                revision: String(result.revision || ''),
                updatedAt: result.updatedAt || '',
                updatedBy: result.updatedBy || ''
            };
            syncState.lastConflictRevision = '';
            syncState.unsharedLocalChanges = addedRequiredDoctors.length > 0;
            syncState.formImport.generation++;
            saveRemoteMeta();
            saveLocalData();
            renderDoctors();
            renderCalendar();
            renderSyncStatusFromMeta();
            if (addedRequiredDoctors.length > 0) {
                updateSyncStatus('local-changed', '未共有変更あり', `一覧に戻した医師があります（${addedRequiredDoctors.join('、')}）。この端末に保存済みです。共有するには「共有保存」を押してください。`);
            }
            startFormAutoImport({ attempt: options.formImportAttempt || 0 });
            if (!options.silent) alert('共有保存から最新データを読み込みました。');
            return true;
        } catch (err) {
            console.warn('Shared load error', err);
            updateSyncStatus('error', '', err && err.message ? err.message : '共有保存を読み込めませんでした。');
            if (!options.silent) alert('共有保存を読み込めませんでした。\n\n' + (err && err.message ? err.message : err));
            return false;
        }
    }

    function openSyncSettings() {
        syncSettingsReturnFocus = viewState.mobileMedia.matches && els.mobileActionsToggle
            ? els.mobileActionsToggle
            : document.activeElement;
        els.syncEndpointUrl.value = syncState.config.endpoint || '';
        els.syncAppKey.value = syncState.config.appKey || '';
        els.syncUserName.value = syncState.config.userName || '';
        els.syncSettingsModal.classList.remove('hidden');
        els.syncSettingsModal.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(() => els.closeSyncSettingsBtn.focus());
    }

    function closeSyncSettings() {
        els.syncSettingsModal.classList.add('hidden');
        els.syncSettingsModal.setAttribute('aria-hidden', 'true');
        if (syncSettingsReturnFocus && syncSettingsReturnFocus.isConnected) syncSettingsReturnFocus.focus();
        syncSettingsReturnFocus = null;
    }

    function saveSyncSettings() {
        const previousConfig = syncState.config;
        const nextConfig = normalizeSyncConfig({
            endpoint: els.syncEndpointUrl.value,
            appKey: els.syncAppKey.value,
            userName: els.syncUserName.value
        });
        if (nextConfig.endpoint) {
            try {
                new URL(nextConfig.endpoint);
            } catch (err) {
                alert('Apps Script WebアプリURLを確認してください。');
                return;
            }
        }
        syncState.config = nextConfig;
        if (previousConfig.endpoint !== nextConfig.endpoint || previousConfig.appKey !== nextConfig.appKey) {
            syncState.remoteMeta = { revision: '', updatedAt: '', updatedBy: '' };
            saveRemoteMeta();
        }
        writeStoredJson(STORAGE_KEYS.syncConfig, syncState.config);
        rememberSharedEndpointRollback(previousConfig.endpoint, nextConfig.endpoint)
            .catch(err => console.warn('Shared endpoint rollback check error', err));
        closeSyncSettings();
        renderSyncStatusFromMeta();
        if (isSharedSyncEnabled()) loadSharedData({ silent: false });
    }

    function disableSyncSettings() {
        if (!confirm('共有保存を無効化しますか？\nこの端末のローカル保存データは残ります。')) return;
        syncState.config = normalizeSyncConfig({});
        syncState.remoteMeta = { revision: '', updatedAt: '', updatedBy: '' };
        syncState.unsharedLocalChanges = false;
        syncState.formImport.available = false;
        syncState.formImport.create = false;
        syncState.formImport.months = null;
        syncState.formImport.generation++;
        syncState.formImport.byMonth = {};
        writeStoredJson(STORAGE_KEYS.syncConfig, syncState.config);
        saveRemoteMeta();
        closeSyncSettings();
        updateSyncStatus('local');
        renderFormImportPanel();
        renderFormCreateButton();
    }

    els.syncSettingsBtn.addEventListener('click', openSyncSettings);
    els.closeSyncSettingsBtn.addEventListener('click', closeSyncSettings);
    els.cancelSyncSettingsBtn.addEventListener('click', closeSyncSettings);
    els.syncSettingsOverlay.addEventListener('click', closeSyncSettings);
    els.saveSyncSettingsBtn.addEventListener('click', saveSyncSettings);
    els.disableSyncSettingsBtn.addEventListener('click', disableSyncSettings);
    if (els.syncSaveBtn) els.syncSaveBtn.addEventListener('click', saveSharedNow);
    els.syncRefreshBtn.addEventListener('click', () => loadSharedData({ silent: false }));

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

    function isHolidayWithRules(dateObj, dateStr, specialRules = state.specialDayRules) {
        const special = specialRules && specialRules[dateStr];
        if (special === 'weekday') return false;
        if (special === 'holiday') return true;
        return dateObj.getDay() === 0 || dateObj.getDay() === 6 || !!state.holidays[dateStr];
    }

    function isHoliday(dateObj, dateStr) {
        return isHolidayWithRules(dateObj, dateStr, state.specialDayRules);
    }

    function getRequiredRoles(dateObj, dateStr) {
        const isHol = isHoliday(dateObj, dateStr);
        const baseRoles = !isHol
            ? ['wardNight', 'erNight']
            : (dateObj.getDay() === 6 ? ['wardNight', 'erDay', 'erNight'] : ['wardDay', 'wardNight', 'erDay', 'erNight']);
        const roleSet = new Set(baseRoles);
        getFixedSpecialDutyRoles(dateStr).forEach(role => roleSet.add(role));
        return ROLE_ORDER.filter(role => roleSet.has(role));
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

    function getFiscalYearStartYear(dateObj = state.currentDate) {
        return dateObj.getMonth() >= 3 ? dateObj.getFullYear() : dateObj.getFullYear() - 1;
    }

    function isMonthKeyInFiscalYear(monthKey, fiscalStartYear) {
        const [year, month] = String(monthKey).split('-').map(Number);
        if (!year || !month) return false;
        if (year === fiscalStartYear && month >= 4) return true;
        if (year === fiscalStartYear + 1 && month <= 3) return true;
        return false;
    }

	    function getShiftForDate(dateStr) {
	        if (state.shifts[dateStr]) return state.shifts[dateStr];
	        if (getMonthKeyFromDateStr(dateStr) === getCurrentMonthKey()) return {};
	        const savedMonth = state.savedMonths[getMonthKeyFromDateStr(dateStr)];
	        return (savedMonth && savedMonth.shifts && savedMonth.shifts[dateStr]) || {};
	    }

    function hasMonthEntries(source, monthKey) {
        return Object.keys(source || {}).some(key => key.startsWith(monthKey));
    }

    function withMobileMonthContext(dateObj, callback) {
        const monthKey = getMonthKey(dateObj);
        const savedMonth = state.savedMonths[monthKey];
        const previousDate = state.currentDate;
        const previousShifts = state.shifts;
        const previousSpecialDayRules = state.specialDayRules;
        const hasWorkingMonth = hasMonthEntries(state.shifts, monthKey) ||
            hasMonthEntries(state.specialDayRules, monthKey);

        if (savedMonth && !hasWorkingMonth) {
            state.shifts = { ...state.shifts, ...cloneData(savedMonth.shifts) };
            state.specialDayRules = { ...state.specialDayRules, ...cloneData(savedMonth.specialDayRules) };
        }
        setCurrentMonthFromDate(dateObj);
        try {
            return callback();
        } finally {
            state.currentDate = previousDate;
            state.shifts = previousShifts;
            state.specialDayRules = previousSpecialDayRules;
        }
    }

    function ensureEditableMonthLoaded(dateObj) {
        const monthKey = getMonthKey(dateObj);
        const savedMonth = state.savedMonths[monthKey];
        if (!savedMonth) return;
        const hasWorkingMonth = hasMonthEntries(state.shifts, monthKey) ||
            hasMonthEntries(state.specialDayRules, monthKey);
        if (hasWorkingMonth) return;

        Object.assign(state.shifts, cloneData(savedMonth.shifts));
        Object.assign(state.specialDayRules, cloneData(savedMonth.specialDayRules));
    }

    function countShiftEntriesForDoctor(shifts, doctorId, specialRules) {
        const stats = { total: 0, holiday: 0 };
        for (const [dateStr, dayShifts] of Object.entries(shifts || {})) {
            const [yy, mm, dd] = String(dateStr).split('-').map(Number);
            const dateObj = new Date(yy, (mm || 1) - 1, dd || 1);
            const isHol = isHolidayWithRules(dateObj, dateStr, specialRules) || isFixedSpecialDutyDate(dateStr);
            for (const [role, val] of Object.entries(dayShifts || {})) {
                if (isFixedSpecialDutyRole(dateStr, role)) continue;
                if (val === doctorId) {
                    stats.total++;
                    if (isHol) stats.holiday++;
                }
            }
        }
        return stats;
    }

    function getDoctorFiscalYearDutyStats(doctorId) {
        const fiscalStartYear = getFiscalYearStartYear(state.currentDate);
        const combinedShifts = {};
        const combinedSpecialRules = {};

        for (const [monthKey, snapshot] of Object.entries(state.savedMonths || {})) {
            if (!isMonthKeyInFiscalYear(monthKey, fiscalStartYear)) continue;
            Object.assign(combinedShifts, (snapshot && snapshot.shifts) || {});
            Object.assign(combinedSpecialRules, (snapshot && snapshot.specialDayRules) || {});
        }

        for (const [dateStr, dayShifts] of Object.entries(state.shifts || {})) {
            if (!isMonthKeyInFiscalYear(getMonthKeyFromDateStr(dateStr), fiscalStartYear)) continue;
            combinedShifts[dateStr] = dayShifts;
        }
        Object.assign(combinedSpecialRules, state.specialDayRules || {});

        const stats = countShiftEntriesForDoctor(combinedShifts, doctorId, combinedSpecialRules);
        forEachFixedDutyEntry(({ dateStr, dateObj, doctorId: fixedDoctorId }) => {
            if (fixedDoctorId !== doctorId) return;
            if (!isMonthKeyInFiscalYear(getMonthKeyFromDateStr(dateStr), fiscalStartYear)) return;
            stats.total++;
            if (isHolidayWithRules(dateObj, dateStr, combinedSpecialRules) || isFixedSpecialDutyDate(dateStr)) stats.holiday++;
        });
        return stats;
    }

    function getCurrentFormResponseStatus() {
        const monthKey = getCurrentMonthKey();
        const monthly = state.formResponsesByMonth && state.formResponsesByMonth[monthKey];
        if (monthly) {
            return {
                importedAt: monthly.importedAt || '',
                responders: monthly.responders || [],
                duplicateNames: monthly.duplicateNames || [],
                notFound: monthly.notFound || []
            };
        }
        return state.formResponseStatus[monthKey] || null;
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
        if (!isDoctorActiveInMonth(doc)) return false;
        if (isDutyExcludedDoctor(doc) || isManualOnlyDoctor(doc) || isDutyPausedDoctor(doc)) return false;
        return !getCurrentResponderSet().has(normalizeDoctorMatchName(doc.name));
    }

    function getFormNonResponderDoctors() {
        if (!hasFormResponseStatus()) return [];
        return state.doctors.filter(doc => isFormNonResponder(doc));
    }

    function needsFormNonResponderDuty(doc) {
        return isFormNonResponder(doc) && getDoctorMonthlyCount(doc.id) === 0;
    }

    function getDoctorLegacyFormData(doc) {
        const preferredDates1 = doc.preferredDates1 || [];
        const preferredDates2 = doc.preferredDates2 || [];
        return {
            preferredDates1,
            preferredDates2,
            preferredDates: [...new Set([
                ...preferredDates1,
                ...preferredDates2,
                ...(doc.preferredDates || [])
            ])],
            ngDates1: doc.ngDates1 || [],
            ngDates2: doc.ngDates2 || [],
            ngDates3: doc.ngDates3 || [],
            notes: doc.notes || ''
        };
    }

    function getEmptyFormData() {
        return {
            preferredDates1: [],
            preferredDates2: [],
            preferredDates: [],
            ngDates1: [],
            ngDates2: [],
            ngDates3: [],
            notes: ''
        };
    }

    function getDoctorFormDataForMonth(doc, monthKey = getCurrentMonthKey()) {
        const monthly = state.formResponsesByMonth && state.formResponsesByMonth[monthKey];
        if (monthly && monthly.responses) {
            return monthly.responses[normalizeDoctorMatchName(doc.name)] || getEmptyFormData();
        }
        return getDoctorLegacyFormData(doc);
    }

    function getDoctorFormDataForDate(doc, dateStr) {
        return getDoctorFormDataForMonth(doc, dateStr ? getMonthKeyFromDateStr(dateStr) : getCurrentMonthKey());
    }

    function getDoctorMonthlyCount(doctorId, excludeDate) {
        let count = 0;
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m) {
                for (const [role, val] of Object.entries(sh)) {
                    if (isFixedSpecialDutyRole(ds, role)) continue;
                    if (val === doctorId) count++;
                }
            }
        }
        count += countFixedDutiesForDoctor(doctorId, (ds, sd) =>
            (!excludeDate || ds !== excludeDate) &&
            sd.getFullYear() === y &&
            sd.getMonth() === m
        );
        return count;
    }

    function getDoctorMonthlyRoleCount(doctorId, roles, excludeDate) {
        const roleSet = new Set(roles || []);
        let count = 0;
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() !== y || sd.getMonth() !== m) continue;
            for (const [role, val] of Object.entries(sh)) {
                if (isFixedSpecialDutyRole(ds, role)) continue;
                if (roleSet.has(role) && val === doctorId) count++;
            }
        }
        count += countFixedDutiesForDoctor(doctorId, (ds, sd, role) =>
            (!excludeDate || ds !== excludeDate) &&
            sd.getFullYear() === y &&
            sd.getMonth() === m &&
            roleSet.has(role)
        );
        return count;
    }

    function hasErDayThisMonth(doctorId, excludeDate) {
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m && !isFixedSpecialDutyRole(ds, 'erDay') && sh.erDay === doctorId) return true;
        }
        return countFixedDutiesForDoctor(doctorId, (ds, sd, role) =>
            (!excludeDate || ds !== excludeDate) &&
            sd.getFullYear() === y &&
            sd.getMonth() === m &&
            role === 'erDay' &&
            !isFixedErDayExclusivityExempt(ds, doctorId)
        ) > 0;
    }

    function isWeekendDate(dateObj) {
        const day = dateObj.getDay();
        return day === 0 || day === 6;
    }

    function isHolidayDutyDate(dateObj, dateStr) {
        return isHoliday(dateObj, dateStr) || isFixedSpecialDutyDate(dateStr);
    }

    function isStoredHolidayDutyDate(dateObj, dateStr) {
        const monthKey = getMonthKeyFromDateStr(dateStr);
        const savedMonth = state.savedMonths && state.savedMonths[monthKey];
        const savedRules = (savedMonth && savedMonth.specialDayRules) || {};
        const specialRules = { ...savedRules, ...(state.specialDayRules || {}) };
        return isHolidayWithRules(dateObj, dateStr, specialRules) || isFixedSpecialDutyDate(dateStr);
    }

    function findAdjacentMonthHolidayWeekConflict(doctorId, dateObj, dateStr) {
        if (!isStoredHolidayDutyDate(dateObj, dateStr)) return null;

        const dayOfMonth = dateObj.getDate();
        const lastDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
        const ranges = [];

        if (dayOfMonth <= 7) {
            const previousMonthLastDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 0);
            ranges.push({
                direction: 'previous',
                dates: Array.from({ length: 7 }, (_, index) => {
                    const date = new Date(previousMonthLastDay);
                    date.setDate(previousMonthLastDay.getDate() - index);
                    return date;
                })
            });
        }
        if (dayOfMonth > lastDayOfMonth - 7) {
            ranges.push({
                direction: 'next',
                dates: Array.from({ length: 7 }, (_, index) =>
                    new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, index + 1)
                )
            });
        }

        for (const range of ranges) {
            for (const adjacentDate of range.dates) {
                const adjacentDateStr = formatDateStr(adjacentDate);
                if (!isStoredHolidayDutyDate(adjacentDate, adjacentDateStr)) continue;
                if (getAssignedDoctorIdsForDate(adjacentDateStr).includes(doctorId)) {
                    return { direction: range.direction, dateStr: adjacentDateStr };
                }
            }
        }
        return null;
    }

    function getHolidayDutyCount(doctorId, excludeDate) {
        let count = 0;
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m && isHolidayDutyDate(sd, ds)) {
                for (const [role, val] of Object.entries(sh)) {
                    if (isFixedSpecialDutyRole(ds, role)) continue;
                    if (val === doctorId) count++;
                }
            }
        }
        count += countFixedDutiesForDoctor(doctorId, (ds, sd) =>
            (!excludeDate || ds !== excludeDate) &&
            sd.getFullYear() === y &&
            sd.getMonth() === m &&
            isHolidayDutyDate(sd, ds)
        );
        return count;
    }

    function hasNonErDayThisMonth(doctorId, excludeDate) {
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
        for (const [ds, sh] of Object.entries(state.shifts)) {
            if (excludeDate && ds === excludeDate) continue;
            const sd = new Date(ds);
            if (sd.getFullYear() === y && sd.getMonth() === m) {
                for (const [role, val] of Object.entries(sh)) {
                    if (isFixedSpecialDutyRole(ds, role)) continue;
                    if (role !== 'erDay' && val === doctorId) return true;
                }
            }
        }
        return countFixedDutiesForDoctor(doctorId, (ds, sd, role) =>
            (!excludeDate || ds !== excludeDate) &&
            sd.getFullYear() === y &&
            sd.getMonth() === m &&
            role !== 'erDay'
        ) > 0;
    }

    function findDoctorName(id) {
        if (!id) return null;
        const doc = state.doctors.find(d => d.id === id);
        if (doc) return doc.name;
        return null;
    }

    function getDoctorPreferenceRank(doc, dateStr) {
        const formData = getDoctorFormDataForDate(doc, dateStr);
        if ((formData.preferredDates1 || []).includes(dateStr)) return 1;
        if ((formData.preferredDates2 || []).includes(dateStr)) return 2;
        if ((formData.preferredDates || []).includes(dateStr)) return 2;
        return 0;
    }

    function getDoctorNoteWarning(doc, dateStr = null) {
        const formData = getDoctorFormDataForDate(doc, dateStr);
        const note = (formData.notes || '').trim();
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

    function hasNoteWarning(warning) {
        return !!warning && (warning.includes('備考に「絶対」') || warning.includes('備考あり'));
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
            if (label === '絶対備考') chip.className = 'warning-label warning-label-strong';
            else if (label === '備考') chip.className = 'warning-label warning-label-note';
            else chip.className = 'warning-label';
            chip.textContent = label;
            badge.appendChild(chip);
        });
    }

    function isHardRuleError(error) {
        if (!error) return false;
        const hardTokens = [
            '上限に達しています',
            '休日救急日中希望がOFFです',
            '休日救急日中は月1回が上限です',
            '今月他の当直枠があります',
            '今月他の当直枠があるため',
            '救急夜間は7年目以下',
            '病棟は8年目以上のみ担当可能です',
            '病棟夜間は8年目以上、または不足時6-7年目のみ担当可能です',
            '部長は病棟夜間に割り当て不可です',
            '部長はこの病棟夜間枠に割り当て不可です',
            '岸先生は救急夜間枠のみ担当可能です',
            '岸先生は救急夜間または病棟当直のみ担当可能です',
            '救急日直希望○のため',
            '今月休日救急日中を担当済み',
            '部長は平日救急夜間に割り当て不可です',
            '吉井先生は日曜病棟日中のみ担当可能です',
            '当直除外メンバーです',
            '吉田也恵先生は日中枠に割り当て不可です',
            '小澤牧人先生は金曜病棟当直のみ可能です',
            '小澤牧人先生は月1回までです',
            '岩田先生は平日・土日祝の病棟当直のみ可能です',
            '在籍期間外です',
            '救急夜間のみ担当可能です',
            '木曜日の病棟夜間のみ担当可能です',
            '固定不可曜日',
            '翌日が外来です',
            '不可日(第1希望)です',
            '不可日(第2希望)です',
            '不可日(第3希望)です',
            '前月最終週の休日にも当直があります',
            '翌月第一週の休日にも当直があります',
            '同日の別枠に割り当て済みです'
        ];
        // checkAssignmentRule は項目を ' / ' でつなぐ。「手動例外可」と書いた項目は、保存不可の語を含んでいても一時許可として扱う
        // 手動では2026-11-07から、ここに当たる項目も赤い注意として出し、チェックを付ければ保存できる（止めるのは isBlockingManualError だけ）
        return error.split(' / ').some(part =>
            !part.includes('手動例外可') && hardTokens.some(token => part.includes(token))
        );
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
        const manualOnly = isManualOnlyDoctor(doctor);
        const monthlyCount = getDoctorMonthlyCount(doctorId, dateStr);
        const cardiologyMonthlyLimit = getCardiologyMonthlyLimit(doctor);
        if (!isDoctorActiveOnDate(doctor, dateObj)) errs.push('在籍期間外です');
        if (isErNightOnlyDoctor(doctor) && role !== 'erNight') {
            errs.push('内科専攻医枠のため救急夜間のみ担当可能です');
        }
        if (isThursdayWardNightOnlyDoctor(doctor) && !(role === 'wardNight' && dateObj.getDay() === 4)) {
            errs.push('蘆田先生は木曜日の病棟夜間のみ担当可能です');
        }
        if (monthlyCount >= 3) errs.push('月3回が上限です');
        if (isDutyExcludedDoctor(doctor)) errs.push('当直除外メンバーです');
        // 休止は今日以降の枠だけを判定する（休止前の過去の割り当ては警告しない）
        if (isDutyPausedDoctor(doctor) && dateStr >= getTodayDateStr()) {
            errs.push('当直休止中です（手動例外可）');
        }
        if (cardiologyMonthlyLimit && monthlyCount >= cardiologyMonthlyLimit) {
            errs.push(`循環器内科は月${cardiologyMonthlyLimit}回までです（手動例外可）`);
        }
        if (
            isWardDutyPriorityDoctor(doctor) &&
            (role === 'wardDay' || role === 'wardNight') &&
            getDoctorMonthlyRoleCount(doctorId, ['wardDay', 'wardNight'], dateStr) >= 1
        ) {
            errs.push('山口先生は病棟当直月1回までです（手動例外可）');
        }
        if (isYoshidaYaeDoctor(doctor) && (role === 'wardDay' || role === 'erDay')) {
            errs.push('吉田也恵先生は日中枠に割り当て不可です');
        }
        if (isIwataYukiyoDoctor(doctor) && !isIwataPreferredRole(doctor, role, dateObj, dateStr)) {
            errs.push('岩田先生は平日・土日祝の病棟当直のみ可能です');
        }
        if (isFridayWardOnlyDoctor(doctor) && !(role === 'wardNight' && dateObj.getDay() === 5)) {
            errs.push('小澤牧人先生は金曜病棟当直のみ可能です');
        }
        if (isFridayWardOnlyDoctor(doctor) && monthlyCount >= 1) {
            errs.push('小澤牧人先生は月1回までです');
        }
        if (isFixedWeekdayNgDate(doctor, dateObj)) {
            errs.push(`固定不可曜日(${formatFixedWeekdayNgDays(doctor)})です`);
        }
        if (isWardDayOnlyDoctor(doctor) && !isFemaleSundayWardDaySlot(doctor, dateObj, role)) {
            errs.push('吉井先生は日曜病棟日中のみ担当可能です');
        }

        // 1. Role-Group constraints
        if (!manualOnly) {
            if (role === 'erDay') {
                if (!doctor.holidayErDayPreferred && !canDoErDaySpecialDoctor(doctor, dateObj, dateStr)) {
                    errs.push('休日救急日中希望がOFFです');
                }
                // Monthly erDay limit (1回)
                let erDayCount = 0;
                const y = state.currentDate.getFullYear(), mo = state.currentDate.getMonth();
                for (const [ds, sh] of Object.entries(state.shifts)) {
                    const sd = new Date(ds);
                    if (sd.getFullYear() === y && sd.getMonth() === mo && sh.erDay === doctorId && ds !== dateStr) erDayCount++;
                }
                if (erDayCount >= 1) errs.push(withHolidayRelaxedOverride(doctor, '休日救急日中は月1回が上限です'));
                // Exclusivity: has other shifts this month?
                if (hasNonErDayThisMonth(doctorId, dateStr)) errs.push(withHolidayRelaxedOverride(doctor, '今月他の当直枠があるため休日救急日中に割り当てられません'));
            } else if (role === 'erNight') {
                if (!canDoErNightDoctor(doctor)) errs.push('救急夜間は7年目以下、または岸先生のみ担当可能です');
            } else if (role === 'wardDay') {
                if (isPriorityErNightDoctor(doctor)) errs.push('岸先生は救急夜間または病棟当直のみ担当可能です');
                else if (!canDoWardDayDoctor(doctor)) errs.push('病棟は8年目以上のみ担当可能です');
            } else if (role === 'wardNight') {
                if (
                    !canDoWardNightDoctor(doctor, dateObj, dateStr) &&
                    !canDoWardNightByPermission(doctor) &&
                    !canDoWardRoleByMonthPermission(doctor, 'wardNight', dateStr)
                ) {
                    errs.push(doctor.group === '部長' ? '部長はこの病棟夜間枠に割り当て不可です' : '病棟夜間は8年目以上、または不足時6-7年目のみ担当可能です');
                }
            }
        }

        if (
            !manualOnly &&
            doctor.group === '部長' &&
            !isHoliday(dateObj, dateStr) &&
            role !== 'wardNight'
        ) {
            errs.push('部長は平日救急夜間に割り当て不可です');
        }

        const holidayDutyLimit = getHolidayDutyMonthlyLimit(doctor);
        if (isHolidayDutyDate(dateObj, dateStr) && getHolidayDutyCount(doctorId, dateStr) >= holidayDutyLimit) {
            errs.push(`土日祝は月${holidayDutyLimit}回が上限です`);
        }

        // 救急日直希望○の通常医師は、救急医固定以外の休日救急日中のみ担当
        // （「病棟夜間も可」の医師は病棟夜間も可。「この月は病棟当直も可」の月は病棟日中・病棟夜間も可）
        if (
            doctor.holidayErDayPreferred &&
            role !== 'erDay' &&
            !(role === 'wardNight' && canDoWardNightByPermission(doctor)) &&
            !canDoWardRoleByMonthPermission(doctor, role, dateStr)
        ) {
            errs.push('救急日直希望○のため、救急日中以外には割り当て不可です');
        }

        // Month exclusivity reverse: has erDay this month → can't do other roles
        if (!manualOnly && role !== 'erDay' && hasErDayThisMonth(doctorId, dateStr)) {
            errs.push(withHolidayRelaxedOverride(doctor, '今月休日救急日中を担当済みのため、他枠への割り当て不可です'));
        }

        // 2. Outpatient: 翌日外来は夜間当直のみ考慮し、日直(日中)では考慮しない
        if (!isFridayWardOnlyDoctor(doctor) && (role === 'wardNight' || role === 'erNight') && doctor.outpatientDays && doctor.outpatientDays.length > 0) {
            const nextDay = new Date(dateObj); nextDay.setDate(nextDay.getDate() + 1);
            if (doctor.outpatientDays.includes(DAY_NAMES[nextDay.getDay()])) errs.push('翌日が外来です');
        }

        // 3. NG Dates
        const formData = getDoctorFormDataForDate(doctor, dateStr);
        const ng1 = formData.ngDates1 || [];
        const ng2 = formData.ngDates2 || [];
        const ng3 = formData.ngDates3 || [];
        if (ng1.includes(dateStr)) errs.push('不可日(第1希望)です');
        else if (ng2.includes(dateStr)) errs.push('不可日(第2希望)です');
        else if (ng3.includes(dateStr)) errs.push('不可日(第3希望)です');

        if (isFemaleDoctor(doctor) && !isFemaleSundayWardDaySlot(doctor, dateObj, role)) {
            warns.push('固定女性医師は原則、日曜病棟日中のみです');
        }

        const noteWarning = getDoctorNoteWarning(doctor, dateStr);
        if (noteWarning) warns.push(noteWarning);

        // 4. Consecutive shifts
        const prevDay = new Date(dateObj); prevDay.setDate(prevDay.getDate() - 1);
        const nextDay2 = new Date(dateObj); nextDay2.setDate(nextDay2.getDate() + 1);
	        if (getAssignedDoctorIdsForDate(formatDateStr(prevDay)).includes(doctorId)) errs.push('前日も当直です（連続当直禁止）');
	        if (getAssignedDoctorIdsForDate(formatDateStr(nextDay2)).includes(doctorId)) errs.push('翌日も当直です（連続当直禁止）');

        // 5. Avoid holiday duty in both the last 7 days of one month and first 7 days of the next month
        const adjacentHolidayConflict = findAdjacentMonthHolidayWeekConflict(doctorId, dateObj, dateStr);
        if (adjacentHolidayConflict && adjacentHolidayConflict.direction === 'previous') {
            errs.push(`前月最終週の休日にも当直があります（${adjacentHolidayConflict.dateStr}、月またぎ休日連続禁止）`);
        } else if (adjacentHolidayConflict && adjacentHolidayConflict.direction === 'next') {
            errs.push(`翌月第一週の休日にも当直があります（${adjacentHolidayConflict.dateStr}、月またぎ休日連続禁止）`);
        }

        // 6. Same week 2x
        const weekStart = new Date(dateObj);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        let weekCount = 0;
        for (let i = 0; i < 7; i++) {
            const wd = new Date(weekStart);
            wd.setDate(weekStart.getDate() + i);
            const wds = formatDateStr(wd);
            if (wds === dateStr) continue;
	            if (getAssignedDoctorIdsForDate(wds).includes(doctorId)) weekCount++;
        }
        if (weekCount >= 1) errs.push('同一週にすでに当直があります（週2回禁止）');

        // 7. Same-day duplicate (against saved state)
        if (getAssignedDoctorIdsForDate(dateStr, role).includes(doctorId)) {
            errs.push('同日の別枠に割り当て済みです');
        }

        if (hasSameDepartmentAssignmentForDate(doctor, dateStr, role)) {
            warns.push(`同じ日に同じ科（${getDoctorDepartment(doctor)}）の医師が割り当てられています`);
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
            if (isFixedSpecialDutyRole(dateStr, role)) return;
            if (role === 'erDay' && isActiveFixedErDaySaturday(dateObj)) return;
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
        if (!els.pendingNgList) return;
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

    if (els.addNgBtn) {
        els.addNgBtn.addEventListener('click', () => {
            const d = els.ngDateVal.value;
            if (d) { pendingNgDates.push({ date: d, type: els.ngWeightVal.value }); els.ngDateVal.value = ''; renderPendingNgs(); }
        });
    }

    // ===== Doctor Management =====
    if (els.addDoctorForm) {
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
            saveData('医師追加'); renderDoctors(); renderCalendar();
        });
    }

    // 医師一覧からの削除（×）は2026-11-07に廃止した。削除すると全期間の割り当てが消えるため。
    // 退職などで外す医師は DEFAULT_DOCTORS の availableUntil（在籍終了日）で外し、休職などは個別設定の「当直休止」を使う。

    // フォーム回答の1か月分を作る（state は変えない）。y・m は取り込む月（m は1〜12）。
    // 表示中の月に依存しないので、自動取り込みでは表示中以外の月にも使う（2026-11-14）
    function buildFormMonthData(rows, y, m) {
        const monthDate = new Date(y, m - 1, 1);
        const monthKey = getMonthKey(monthDate);
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

        const responses = {};
        const invalidDates = [];
        const dateStats = { total: 0, inMonth: 0 };
        latestByName.forEach(({ doc, row }, normalizedName) => {
            const parsed = {};
            FORM_DATE_FIELDS.forEach(field => {
                const detail = parseImportDateListDetailed(row[field.key], y, m);
                parsed[field.key] = detail.dates;
                detail.invalid.forEach(value => invalidDates.push({ name: doc.name, field: field.label, value }));
                detail.dates.forEach(dateStr => {
                    dateStats.total++;
                    if (dateStr.startsWith(`${monthKey}-`)) dateStats.inMonth++;
                });
            });
            responses[normalizedName] = {
                doctorName: doc.name,
                preferredDates1: parsed.preferred1,
                preferredDates2: parsed.preferred2,
                preferredDates: [...new Set([...parsed.preferred1, ...parsed.preferred2])],
                ngDates1: parsed.ng1,
                ngDates2: parsed.ng2,
                ngDates3: parsed.ng3,
                notes: cleanImportCell(row.notes)
            };
        });

        const duplicateNames = [...responseCounts.entries()]
            .filter(([, count]) => count > 1)
            .map(([name]) => name);
        const responders = [...latestByName.values()].map(({ doc }) => doc.name);
        const responderSet = new Set(responders.map(normalizeDoctorMatchName));
        const missingDoctors = state.doctors.filter(doc =>
            isDoctorActiveInMonth(doc, monthDate) &&
            !isDutyExcludedDoctor(doc) &&
            !isManualOnlyDoctor(doc) &&
            !isDutyPausedDoctor(doc) &&
            !responderSet.has(normalizeDoctorMatchName(doc.name))
        );
        return {
            monthKey,
            data: {
                importedAt: new Date().toISOString(),
                responders,
                duplicateNames,
                notFound,
                responses
            },
            updated: latestByName.size,
            duplicateNames,
            notFound,
            missingDoctors,
            invalidDates,
            dateStats
        };
    }

    function storeFormMonthData(monthKey, data) {
        state.formResponsesByMonth[monthKey] = data;
        state.formResponseStatus[monthKey] = {
            importedAt: data.importedAt,
            responders: data.responders,
            duplicateNames: data.duplicateNames,
            notFound: data.notFound
        };
    }

    // ファイルからの取り込み。表示中の月へ入れる（従来どおり）
    function applyFormResponseRows(rows) {
        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth() + 1;
        const built = buildFormMonthData(rows, y, m);
        storeFormMonthData(built.monthKey, built.data);
        syncState.formImport.diagnostics[built.monthKey] = { via: 'file', at: Date.now(), invalidDates: built.invalidDates };
        return {
            monthKey: built.monthKey,
            updated: built.updated,
            duplicateNames: built.duplicateNames,
            notFound: built.notFound,
            missingDoctors: built.missingDoctors,
            invalidDates: built.invalidDates
        };
    }

    function formatInvalidDateItem(item) {
        return `${item.name} ${item.field}「${item.value}」`;
    }

    function showFormImportResult(result) {
        let msg = `${result.monthKey} のフォーム回答を更新しました。`;
        msg += `\n更新: ${result.updated}名`;
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
        if (result.unusedColumns && result.unusedColumns.length > 0) {
            msg += `\n\n⚠️ 見出しが読めず、取り込んでいない列があります（その列の回答は反映されません）:\n${result.unusedColumns.join('\n')}`;
        }
        if (result.invalidDates && result.invalidDates.length > 0) {
            const shown = result.invalidDates.slice(0, 10).map(formatInvalidDateItem);
            const more = result.invalidDates.length > shown.length ? `\nほか${result.invalidDates.length - shown.length}件` : '';
            msg += `\n\n⚠️ 読めなかった日付: ${result.invalidDates.length}件（反映されません）\n${shown.join('\n')}${more}`;
        }
        alert(msg);
    }

    // 自動取り込みで「変わったか」を見るための比較用の文字列。取り込み日時（importedAt）は含めない。
    // 並び順の違いだけでは変わったことにしない。新しく足した項目ではなく、従来からある項目だけで比べる
    function getFormMonthSignature(monthData) {
        if (!monthData) return '';
        const sortedList = list => (Array.isArray(list) ? list.map(value => String(value)) : []).sort();
        const responses = monthData.responses || {};
        const normalizedResponses = {};
        Object.keys(responses).sort().forEach(key => {
            normalizedResponses[key] = migrateFormResponseRecord(responses[key]);
        });
        return JSON.stringify({
            responders: sortedList(monthData.responders),
            duplicateNames: sortedList(monthData.duplicateNames),
            notFound: sortedList(monthData.notFound),
            responses: normalizedResponses
        });
    }

    // ===== Form Import: 自動取り込み（2026-11-14） =====
    // 共有読込に成功した後、Apps Script側が対応していれば（load の応答に formImport.enabled: true）、
    // 今月・来月と、表示中の月・その翌月（今月より前の月は除く）の回答を月ごとに読み、内容が変わった月だけ取り込む。
    // Google側の一覧に登録された月は、シートの内容を正とする（手動のファイル取り込みも、次の共有読込でシートの内容に戻る）。
    // 空のシート・見出しが読めない・回答0名・日付の月が違う・読み出し失敗のときは、取り込み済みの回答を変えない。
    // まだ共有していない変更（自動割り振りなど）があるときは、この端末にだけ取り込み、共有保存しない。
    const FORM_AUTO_IMPORT_REASON = 'フォーム回答自動取込';
    const FORM_AUTO_IMPORT_TIMEOUT_MS = 20000;

    function getFormAutoImportMonths() {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // フォームは2〜3か月前に集めるので、Apps Script側が一覧の月を返すときは、その月（今月以降、6か月分まで）を読む
        if (Array.isArray(syncState.formImport.months)) {
            const thisMonthKey = getMonthKey(thisMonth);
            return [...new Set(syncState.formImport.months)]
                .filter(monthKey => /^\d{4}-\d{2}$/.test(monthKey) && monthKey >= thisMonthKey)
                .sort()
                .slice(0, 6);
        }
        const shownMonth = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), 1);
        const candidates = [
            thisMonth,
            new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 1),
            shownMonth,
            new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1)
        ];
        const seen = new Set();
        return candidates
            .filter(monthDate => monthDate >= thisMonth)
            .map(getMonthKey)
            .filter(monthKey => {
                if (seen.has(monthKey)) return false;
                seen.add(monthKey);
                return true;
            })
            .sort();
    }

    // 読み出した1か月分の応答を調べる。state は変えない。取り込むときだけ data を返す
    function evaluateFormAutoImport(item) {
        const monthKey = item.monthKey;
        const [y, m] = monthKey.split('-').map(Number);
        const at = Date.now();
        if (item.error) {
            const reason = item.error && item.error.message ? item.error.message : String(item.error);
            return { status: { kind: 'error', at, message: `回答を読み出せませんでした（${reason}）` } };
        }
        const payload = item.payload;
        if (!payload || payload.month !== monthKey) {
            return { status: { kind: 'error', at, message: '読み出した回答の月が一致しませんでした' } };
        }
        if (payload.found !== true) {
            return { status: { kind: 'none', at, found: false } };
        }
        if (!Array.isArray(payload.values)) {
            return { status: { kind: 'error', at, found: true, message: '回答シートの形式が読めませんでした' } };
        }
        const existing = state.formResponsesByMonth && state.formResponsesByMonth[monthKey];
        const existingResponders = existing && Array.isArray(existing.responders) ? existing.responders : [];
        let sheet;
        try {
            sheet = readFormSheet(payload.values);
        } catch (err) {
            return { status: { kind: 'error', at, found: true, message: err && err.message ? err.message : String(err) } };
        }
        if (!sheet.columns) {
            return { status: { kind: 'empty', at, found: true, keptExisting: existingResponders.length > 0, notFound: [], invalidDates: [] } };
        }
        if (!hasFormDateColumns(sheet.columns)) {
            return { status: { kind: 'error', at, found: true, message: '回答シートに希望日・不可日の列が見つかりませんでした' } };
        }
        if (sheet.unusedColumns.length > 0) {
            // 一部の日付の列だけ読めないまま取り込むと、その列の回答が黙って消えるので取り込まない
            return { status: { kind: 'error', at, found: true, unusedColumns: sheet.unusedColumns, message: `読めない見出しの列があるため取り込みませんでした（${sheet.unusedColumns.join('、')}）` } };
        }
        const built = buildFormMonthData(sheet.rows, y, m);
        const diagnostics = { notFound: built.notFound, invalidDates: built.invalidDates };
        if (built.data.responders.length === 0) {
            // headerOk: 見出しは読めた（見出しだけのシートや、名前が一致しない回答だけのシート）。空のシートと見分けるため（2026-11-15）
            return { status: { kind: 'empty', at, found: true, headerOk: true, keptExisting: existingResponders.length > 0, ...diagnostics } };
        }
        if (built.dateStats.total >= 3 && built.dateStats.inMonth * 2 < built.dateStats.total) {
            return { status: { kind: 'error', at, found: true, message: `回答の日付の多くが${m}月ではありません。Google側の一覧の月とシートを確認してください` } };
        }
        if (existing && getFormMonthSignature(existing) === getFormMonthSignature(built.data)) {
            return { status: { kind: 'unchanged', at, found: true, responders: built.data.responders.length, ...diagnostics } };
        }
        const afterSet = new Set(built.data.responders.map(normalizeDoctorMatchName));
        return {
            data: built.data,
            status: {
                kind: 'updated',
                at,
                found: true,
                shared: 'pending',
                before: existing ? existingResponders.length : null,
                after: built.data.responders.length,
                removed: existingResponders.filter(name => !afterSet.has(normalizeDoctorMatchName(name))),
                ...diagnostics
            }
        };
    }

    function setFormAutoImportShared(monthKeys, shared) {
        monthKeys.forEach(monthKey => {
            const status = syncState.formImport.byMonth[monthKey];
            if (status && status.kind === 'updated') status.shared = shared;
        });
    }

    // loadSharedData() の成功後に呼ぶ。options.attempt は競合で読み直した回数（1回まで）
    async function startFormAutoImport(options = {}) {
        if (!isSharedSyncEnabled() || !syncState.formImport.available) return;
        const generation = syncState.formImport.generation;
        const isCurrent = () => generation === syncState.formImport.generation;
        const attempt = options.attempt || 0;
        let monthKeys = [];
        try {
            monthKeys = getFormAutoImportMonths();
            if (monthKeys.length === 0) return;
            monthKeys.forEach(monthKey => {
                const previous = syncState.formImport.byMonth[monthKey];
                syncState.formImport.byMonth[monthKey] = { kind: 'checking', at: Date.now(), found: previous ? previous.found : undefined };
            });
            renderFormImportPanel();

            const items = await Promise.all(monthKeys.map(monthKey =>
                requestSharedJsonp({ action: 'formResponses', month: monthKey }, FORM_AUTO_IMPORT_TIMEOUT_MS)
                    .then(payload => ({ monthKey, payload }))
                    .catch(error => ({ monthKey, error }))
            ));
            // 待っている間に共有読込がやり直されたら、この結果は使わない
            if (!isCurrent()) return;

            // 応答がそろったら、途中で待たずに比べて取り込む（取り込む月は応答ごとに決まっていて、表示中の月には依存しない）
            const updates = [];
            items.forEach(item => {
                const result = evaluateFormAutoImport(item);
                syncState.formImport.byMonth[item.monthKey] = result.status;
                if (result.status.kind === 'updated' || result.status.kind === 'unchanged' || Array.isArray(result.status.unusedColumns)) {
                    syncState.formImport.diagnostics[item.monthKey] = {
                        via: 'auto',
                        at: result.status.at,
                        invalidDates: result.status.invalidDates || [],
                        unusedColumns: result.status.unusedColumns || []
                    };
                }
                if (result.data) updates.push({ monthKey: item.monthKey, data: result.data });
            });
            if (updates.length === 0) return;

            const updatedKeys = updates.map(update => update.monthKey);
            updates.forEach(update => storeFormMonthData(update.monthKey, update.data));
            if (syncState.unsharedLocalChanges) {
                // 自動割り振りなど、まだ共有していない変更を、取り込みのついでに共有しない
                saveLocalOnlyData(FORM_AUTO_IMPORT_REASON);
                setFormAutoImportShared(updatedKeys, 'local');
                renderDoctors();
                renderCalendar();
                return;
            }
            saveLocalData();
            setFormAutoImportShared(updatedKeys, 'saving');
            renderDoctors();
            renderCalendar();

            const outcome = await saveSharedData(FORM_AUTO_IMPORT_REASON, { quietConflict: true });
            if (!isCurrent()) return;
            if (outcome === 'saved') {
                setFormAutoImportShared(updatedKeys, 'saved');
            } else if (outcome === 'queued') {
                setFormAutoImportShared(updatedKeys, 'queued');
            } else if (outcome === 'conflict' && attempt < 1) {
                // 他の端末が先に共有保存していた。保存せずに読み直し、もう一度だけ比べる
                setFormAutoImportShared(updatedKeys, 'retrying');
                renderFormImportPanel();
                const reloaded = await loadSharedData({ silent: true, formImportAttempt: attempt + 1 });
                if (!reloaded && isCurrent()) setFormAutoImportShared(updatedKeys, 'conflict');
            } else if (outcome === 'conflict') {
                setFormAutoImportShared(updatedKeys, 'conflict');
            } else {
                setFormAutoImportShared(updatedKeys, 'error');
            }
        } catch (err) {
            console.warn('Form auto import error', err);
            if (isCurrent()) {
                monthKeys.forEach(monthKey => {
                    const status = syncState.formImport.byMonth[monthKey];
                    if (status && status.kind === 'checking') {
                        syncState.formImport.byMonth[monthKey] = { kind: 'error', at: Date.now(), message: '自動取り込みでエラーが起きました' };
                    }
                });
            }
        } finally {
            renderFormImportPanel();
        }
    }

    // ===== Form Import: 結果の表示（表示中の月。フォームの文字は textContent で入れる） =====
    function formatClockTime(ms) {
        if (!ms) return '';
        const date = new Date(ms);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }

    function describeFormAutoImportStatus(status) {
        if (!status) return '';
        const time = formatClockTime(status.at);
        if (status.kind === 'checking') return '自動取り込み: 確認しています…';
        if (status.kind === 'none') return `自動取り込み: この月の回答シートは、Google側の一覧にありません（${time} 確認）`;
        if (status.kind === 'error') return `自動取り込み: 取り込めませんでした。${status.message || ''}（${time}）`;
        if (status.kind === 'empty') {
            const unmatched = (status.notFound || []).length > 0 ? `名前が一致しない回答が${status.notFound.length}件あります。` : '';
            return status.keptExisting
                ? `自動取り込み: シートに取り込める回答がないため、取り込み済みの回答を残しました。${unmatched}（${time} 確認）`
                : `自動取り込み: シートにまだ取り込める回答がありません${status.headerOk ? '（見出しは読めました）' : ''}。${unmatched}（${time} 確認）`;
        }
        if (status.kind === 'unchanged') return `自動取り込み: 変更なし（${time} 確認）`;
        if (status.kind === 'updated') {
            const count = status.before === null ? `${status.after}名` : `${status.before}名→${status.after}名`;
            const sharedText = {
                saving: '共有保存しています…',
                saved: '共有保存しました。',
                queued: '共有保存の順番を待っています。',
                local: 'この端末にだけ取り込みました。ほかにまだ共有していない変更があるため、内容を確認してから「共有保存」を押してください。',
                retrying: '他の端末の保存と重なったため、読み直しています…',
                conflict: '他の端末の保存と重なったため、共有保存していません。「共有読込」を押してください。',
                error: '共有保存できませんでした（この端末には取り込んであります）。'
            }[status.shared] || '';
            return `自動取り込み: ${time} に取り込みました（回答 ${count}）。${sharedText}`;
        }
        return '';
    }

    function isFormAutoImportProblem(status) {
        if (!status) return false;
        if (status.kind === 'error') return true;
        return status.kind === 'updated' && ['local', 'conflict', 'error'].includes(status.shared);
    }

    function renderFormImportPanel() {
        if (!els.formImportSummary || !els.formImportBody || !els.formImportAutoStatus) return;
        const m = state.currentDate.getMonth() + 1;
        const monthKey = getCurrentMonthKey();
        const monthData = state.formResponsesByMonth && state.formResponsesByMonth[monthKey];
        const autoStatus = syncState.formImport.byMonth[monthKey];
        const diagnostics = syncState.formImport.diagnostics[monthKey];
        const invalidDates = diagnostics && Array.isArray(diagnostics.invalidDates) ? diagnostics.invalidDates : [];
        const unusedColumns = diagnostics && Array.isArray(diagnostics.unusedColumns) ? diagnostics.unusedColumns : [];
        const notFound = monthData && Array.isArray(monthData.notFound) ? monthData.notFound : [];
        const duplicateNames = monthData && Array.isArray(monthData.duplicateNames) ? monthData.duplicateNames : [];
        const responders = monthData && Array.isArray(monthData.responders) ? monthData.responders : [];
        const missing = monthData ? getFormNonResponderDoctors() : [];

        const title = document.createElement('span');
        title.className = 'form-import-title';
        title.textContent = `${m}月のフォーム回答`;
        const counts = document.createElement('span');
        counts.className = 'form-import-counts';
        counts.textContent = monthData ? `回答${responders.length}名・未回答${missing.length}名` : 'まだ取り込んでいません';
        els.formImportSummary.replaceChildren(title, counts);
        const removed = autoStatus && autoStatus.kind === 'updated' && Array.isArray(autoStatus.removed) ? autoStatus.removed : [];
        if (notFound.length || invalidDates.length || unusedColumns.length || removed.length || isFormAutoImportProblem(autoStatus)) {
            const alertBadge = document.createElement('span');
            alertBadge.className = 'form-import-alert';
            alertBadge.textContent = '要確認';
            els.formImportSummary.appendChild(alertBadge);
        }

        const lines = [];
        const addLine = (text, isAlert) => {
            const li = document.createElement('li');
            if (isAlert) li.className = 'is-alert';
            li.textContent = text;
            lines.push(li);
        };
        if (monthData) {
            const importedAt = formatSyncTime(monthData.importedAt);
            if (importedAt) addLine(`取り込み: ${importedAt}`);
            addLine(missing.length ? `未回答（${missing.length}名）: ${missing.map(doc => doc.name).join('、')}` : '未回答: なし');
            if (notFound.length) addLine(`名前が一致しない回答（${notFound.length}件）: ${notFound.join('、')}`, true);
            if (duplicateNames.length) addLine(`複数回答（後の回答を採用）: ${duplicateNames.join('、')}`);
        } else {
            addLine('「フォーム回答取込」でファイルを選ぶか、自動取り込みで入ります。');
        }
        if (unusedColumns.length) {
            addLine(`見出しが読めず取り込んでいない列: ${unusedColumns.join('、')}`, true);
        }
        if (invalidDates.length) {
            addLine(`読めなかった日付（${invalidDates.length}件、反映されません）: ${invalidDates.map(formatInvalidDateItem).join('、')}`, true);
        }
        if (removed.length) addLine(`前回の取り込みにあって、シートにない回答: ${removed.join('、')}`, true);
        els.formImportBody.replaceChildren(...lines);

        const statusText = describeFormAutoImportStatus(autoStatus);
        els.formImportAutoStatus.textContent = statusText;
        els.formImportAutoStatus.classList.toggle('hidden', !statusText);
        els.formImportAutoStatus.classList.toggle('is-alert', isFormAutoImportProblem(autoStatus));
    }

    // ===== Form Import: Google Form Response =====
    els.formCsvUpload.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        const autoStatus = syncState.formImport.byMonth[getCurrentMonthKey()];
        if (autoStatus && autoStatus.found === true) {
            const label = `${state.currentDate.getFullYear()}年${state.currentDate.getMonth() + 1}月`;
            const ok = confirm(
                `${label}は、フォーム回答の自動取り込みの対象です（Google側の一覧に登録されています）。\n` +
                'ファイルの内容で置き換えても、次に共有読込したとき、シートの内容と違えばシートの内容に戻ります。\n\n' +
                '続けますか？'
            );
            if (!ok) {
                els.formCsvUpload.value = '';
                return;
            }
        }
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const rows = file.name.toLowerCase().endsWith('.xlsx')
                    ? readWorkbookRows(evt.target.result)
                    : readCsvRows(evt.target.result);
                const sheet = readFormSheet(rows);
                const result = applyFormResponseRows(sheet.rows);
                result.unusedColumns = sheet.unusedColumns || [];
                syncState.formImport.diagnostics[result.monthKey].unusedColumns = result.unusedColumns;
                saveData('フォーム回答取込'); renderDoctors(); renderCalendar();
                showFormImportResult(result);
            } catch (err) {
                alert('フォーム回答を取り込めませんでした。\n\n' + (err && err.message ? err.message : err));
            }
            els.formCsvUpload.value = '';
        };
        if (file.name.toLowerCase().endsWith('.xlsx')) reader.readAsArrayBuffer(file);
        else reader.readAsText(file, 'UTF-8');
    });

    // ===== フォームの自動作成（2026-11-15） =====
    // Apps Script側が対応していれば（load の応答の formImport.create が true）、サイドバーに「次の月のフォームを作る」を出す。
    // 月と締め切りを選ぶと、Apps Scriptが院内アカウントのドライブに、その月のフォームと回答のスプレッドシートを作り、
    // 一覧（DutyApp_Forms）に1行書く（その月の回答は自動取り込みの対象になる）。作るのは2027年2月以降の月だけ（Code.gs の
    // FORM_IMPORT_FROM と同じ）。医師名の選択肢は、この端末の医師一覧のうち、その月に在籍し、当直除外・当直休止でない先生。
    // 作る依頼は POST（共有保存と同じく応答は読めない）で送り、結果は formInfo（JSONP）で読む。二重に作らないのは Apps Script 側
    const FORM_CREATE_FROM_MONTH = '2027-02';
    const FORM_CREATE_MONTH_CHOICES = 6;
    const FORM_CREATE_POST_TIMEOUT_MS = 90000;
    const FORM_CREATE_WAIT_MS = 60000;
    const FORM_CREATE_POLL_MS = 3000;
    const FORM_CREATE_EXPECTED_TITLES = ['医師名', '当直希望日①', '希望日②', '希望日③', '当直不可日①', '不可日②', '不可日③', '備考（任意）'];
    let formCreateBusy = false;
    let formCreateReturnFocus = null;

    function isFormCreateAvailable() {
        return isSharedSyncEnabled() && syncState.formImport.available && syncState.formImport.create === true;
    }

    function renderFormCreateButton() {
        if (!els.formCreateBtn) return;
        els.formCreateBtn.classList.toggle('hidden', !isFormCreateAvailable());
    }

    function isFormCreateOpen() {
        return !!(els.formCreateModal && !els.formCreateModal.classList.contains('hidden'));
    }

    function formatFormMonthLabel(monthKey) {
        const [y, m] = String(monthKey).split('-').map(Number);
        return `${y}年${m}月`;
    }

    function formatFormDeadlineLabel(dateStr) {
        const [, m, d] = String(dateStr).split('-').map(Number);
        return `${m}月${d}日`;
    }

    function isFormMonthRegistered(monthKey) {
        return Array.isArray(syncState.formImport.months) && syncState.formImport.months.includes(monthKey);
    }

    // 来月から6か月分（2027年1月以前は出さない）。一覧に登録済みの月は「作成済み」として選べる（リンクを見るだけ）
    function getFormCreateMonthChoices() {
        const today = new Date();
        const nextKey = getMonthKey(new Date(today.getFullYear(), today.getMonth() + 1, 1));
        const startKey = nextKey > FORM_CREATE_FROM_MONTH ? nextKey : FORM_CREATE_FROM_MONTH;
        const [y, m] = startKey.split('-').map(Number);
        return Array.from({ length: FORM_CREATE_MONTH_CHOICES }, (_, i) => {
            const monthKey = getMonthKey(new Date(y, m - 1 + i, 1));
            return { monthKey, registered: isFormMonthRegistered(monthKey) };
        });
    }

    function getFormCreateMonthDate(monthKey) {
        const [y, m] = monthKey.split('-').map(Number);
        return new Date(y, m - 1, 1);
    }

    // 医師名の選択肢: その月に在籍し、当直除外・当直休止でない先生（手動のみの先生は入れる。2027年1月用と同じ）
    function getFormCreateDoctorNames(monthKey) {
        const monthDate = getFormCreateMonthDate(monthKey);
        return state.doctors
            .filter(doc => isDoctorActiveInMonth(doc, monthDate) && !isDutyExcludedDoctor(doc) && !isDutyPausedDoctor(doc))
            .map(doc => normalizeName(doc.name))
            .filter(Boolean);
    }

    function getFormCreatePausedDoctorNames(monthKey) {
        const monthDate = getFormCreateMonthDate(monthKey);
        return state.doctors
            .filter(doc => isDoctorActiveInMonth(doc, monthDate) && !isDutyExcludedDoctor(doc) && isDutyPausedDoctor(doc))
            .map(doc => normalizeName(doc.name));
    }

    // 締め切りの初期値: その月の3か月前の26日（2027年1月用は10月26日）。今日より前なら、今日から1週間後（月の前日まで）
    function getDefaultFormDeadline(monthKey) {
        const monthDate = getFormCreateMonthDate(monthKey);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let deadline = new Date(monthDate.getFullYear(), monthDate.getMonth() - 3, 26);
        if (deadline < today) {
            deadline = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
            const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0);
            if (deadline > lastDay) deadline = lastDay;
        }
        return formatDateStr(deadline);
    }

    function updateFormCreateInputs(resetDeadline) {
        const monthKey = els.formCreateMonth.value;
        if (!monthKey) return;
        const registered = isFormMonthRegistered(monthKey);
        if (resetDeadline) els.formCreateDeadline.value = getDefaultFormDeadline(monthKey);
        els.formCreateDeadlineGroup.classList.toggle('hidden', registered);
        const names = getFormCreateDoctorNames(monthKey);
        const paused = getFormCreatePausedDoctorNames(monthKey);
        els.formCreateDoctorSummary.textContent = `医師名の選択肢（${names.length}名。${formatFormMonthLabel(monthKey)}に在籍し、当直除外・当直休止でない先生）`;
        els.formCreateDoctorList.textContent = names.join('、') + (paused.length > 0 ? `\n当直休止のため入れない先生: ${paused.join('、')}` : '');
        els.formCreateNote.textContent = registered
            ? `${formatFormMonthLabel(monthKey)}用は、Google側の一覧に登録済みです。作り直さずに、記録してあるリンクを表示します。`
            : '院内アカウントのGoogleドライブに、フォームと回答のスプレッドシートを作ります。質問は2027年1月用と同じです（医師名・当直希望日①〜③・当直不可日①〜③・備考）。回答は、アプリを開いたときに自動で取り込みます。締め切りの日になっても受付は止まりません。';
        els.submitFormCreateBtn.textContent = registered ? 'リンクを見る' : '作る';
    }

    function showFormCreateInput() {
        els.formCreateInput.classList.remove('hidden');
        els.formCreateProgress.classList.add('hidden');
        els.formCreateResult.classList.add('hidden');
        els.formCreateResult.replaceChildren();
        els.submitFormCreateBtn.classList.remove('hidden');
        els.submitFormCreateBtn.disabled = false;
    }

    function openFormCreate() {
        if (!els.formCreateModal) return;
        formCreateReturnFocus = document.activeElement;
        if (!formCreateBusy) {
            if (!isFormCreateAvailable()) return;
            const choices = getFormCreateMonthChoices();
            els.formCreateMonth.replaceChildren(...choices.map(choice => {
                const option = document.createElement('option');
                option.value = choice.monthKey;
                option.textContent = `${formatFormMonthLabel(choice.monthKey)}用${choice.registered ? '（作成済み）' : ''}`;
                return option;
            }));
            const first = choices.find(choice => !choice.registered) || choices[0];
            els.formCreateMonth.value = first.monthKey;
            showFormCreateInput();
            updateFormCreateInputs(true);
        }
        els.formCreateModal.classList.remove('hidden');
        els.formCreateModal.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(() => els.closeFormCreateBtn.focus());
    }

    function closeFormCreate() {
        if (!els.formCreateModal) return;
        els.formCreateModal.classList.add('hidden');
        els.formCreateModal.setAttribute('aria-hidden', 'true');
        if (formCreateReturnFocus && formCreateReturnFocus.isConnected) formCreateReturnFocus.focus();
        formCreateReturnFocus = null;
    }

    function withFormCreateTimeout(promise, ms) {
        let timer = null;
        return Promise.race([
            promise,
            new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('フォームを作る依頼の応答がタイムアウトしました。')), ms); })
        ]).finally(() => clearTimeout(timer));
    }

    async function postFormCreate(monthKey, deadline, doctors, requestId) {
        const body = new URLSearchParams();
        body.set('action', 'createForm');
        body.set('appKey', syncState.config.appKey || '');
        body.set('month', monthKey);
        body.set('deadline', deadline);
        body.set('doctors', JSON.stringify(doctors));
        body.set('updatedBy', getSyncUserName());
        body.set('requestId', requestId);
        await fetch(syncState.config.endpoint, { method: 'POST', mode: 'no-cors', body });
    }

    // 作る依頼の結果を formInfo で読む。結果が記録されるまで（作っている途中なら）少し待って読み直す
    async function waitFormCreateResult(monthKey, requestId) {
        const started = Date.now();
        let lastError = null;
        let notRunningCount = 0;
        for (;;) {
            try {
                const info = await requestSharedJsonp({ action: 'formInfo', month: monthKey, requestId }, 20000);
                if (info.result) return { info };
                lastError = null;
                // 作っている途中の印も結果も無いのが続くときは、依頼が届かなかった
                notRunningCount = info.running ? 0 : notRunningCount + 1;
                if (notRunningCount >= 3) return { info, error: new Error('フォームを作る依頼が、Google側に届かなかったようです。') };
            } catch (err) {
                lastError = err;
                if (/Invalid app key|APP_KEY|Unknown action|month must be/.test((err && err.message) || '')) return { error: err };
            }
            if (Date.now() - started > FORM_CREATE_WAIT_MS) {
                return { error: lastError || new Error('結果を確かめられませんでした。') , timedOut: true };
            }
            await new Promise(resolve => setTimeout(resolve, FORM_CREATE_POLL_MS));
        }
    }

    function isGoogleFormLink(url) {
        return /^https:\/\/(docs\.google\.com|forms\.gle)\//.test(String(url || ''));
    }

    function appendFormCreateLink(list, url, text) {
        if (!isGoogleFormLink(url)) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = text;
        li.appendChild(a);
        list.appendChild(li);
    }

    function describeFormCreateChecks(checks) {
        const lines = [];
        const add = (text, alert) => lines.push({ text, alert: !!alert });
        const yesNo = (value, yes, no) => (value === true ? yes : (value === false ? no : '確かめられませんでした'));
        add(`公開: ${yesNo(checks.published, 'している', 'していない（フォームの編集画面の右上の「公開」を押してください）')}`, checks.published !== true);
        add(`回答の受付: ${yesNo(checks.acceptingResponses, '受け付けている', '受け付けていない')}`, checks.acceptingResponses !== true);
        add(`回答者のログイン: ${checks.requiresLogin === null || checks.requiresLogin === undefined
            ? '設定を読めませんでした（ログアウトした状態でリンクを開き、質問が出るか確かめてください）'
            : yesNo(checks.requiresLogin, '要る（院外の先生が回答できないことがあります）', '要らない')}`, checks.requiresLogin === true);
        add(`回答の編集: ${yesNo(checks.allowsResponseEdits, 'できる', 'できない')}`, checks.allowsResponseEdits !== true);
        add(`医師名の選択肢: ${checks.choiceCount}名`, !(checks.choiceCount > 0));
        add(`日付の質問: ${checks.dateItemsIncludeYear ? '年も選ぶ形' : '年を選ばない形'}`, !checks.dateItemsIncludeYear);
        const titles = Array.isArray(checks.itemTitles) ? checks.itemTitles : [];
        const sameTitles = titles.length === FORM_CREATE_EXPECTED_TITLES.length && titles.every((title, i) => title === FORM_CREATE_EXPECTED_TITLES[i]);
        add(`質問: ${sameTitles ? '8問（2027年1月用と同じ）' : titles.join('・')}`, !sameTitles);
        const header = Array.isArray(checks.responseHeader) ? checks.responseHeader : [];
        const headerOk = FORM_CREATE_EXPECTED_TITLES.every(title => header.includes(title));
        add(`回答のシート: ${checks.responseSheetName || '不明'}（見出し ${header.length}列${headerOk ? '' : '。質問の見出しがそろっていません'}）`, !headerOk);
        return lines;
    }

    // kind: 'created'（作った）| 'already'（登録済みだった）| 'error'
    function renderFormCreateResult(monthKey, kind, entry, checks, message) {
        const label = formatFormMonthLabel(monthKey);
        const nodes = [];
        const title = document.createElement('p');
        title.className = 'form-create-result-title' + (kind === 'error' ? ' is-error' : '');
        title.textContent = kind === 'created'
            ? `${label}用のフォームを作りました。`
            : (kind === 'already' ? `${label}用は、Google側の一覧に登録済みです（作り直していません）。` : `${label}用のフォームを作れませんでした。`);
        nodes.push(title);
        if (message) {
            const p = document.createElement('p');
            p.className = kind === 'error' ? 'modal-error' : 'sync-help-text';
            p.textContent = message;
            nodes.push(p);
        }
        if (entry && isGoogleFormLink(entry.formUrl)) {
            const group = document.createElement('div');
            group.className = 'form-group';
            const labelEl = document.createElement('label');
            labelEl.htmlFor = 'form-create-url';
            labelEl.textContent = '先生方に送るリンク（回答用）';
            const row = document.createElement('div');
            row.className = 'form-create-link-row';
            const input = document.createElement('input');
            input.id = 'form-create-url';
            input.type = 'text';
            input.readOnly = true;
            input.value = entry.formUrl;
            const copy = document.createElement('button');
            copy.type = 'button';
            copy.className = 'btn-secondary';
            copy.textContent = 'コピー';
            copy.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(input.value);
                } catch (err) {
                    input.focus();
                    input.select();
                    try { document.execCommand('copy'); } catch (copyErr) { /* 選んだ状態のまま */ }
                }
                copy.textContent = 'コピーしました';
                setTimeout(() => { copy.textContent = 'コピー'; }, 2000);
            });
            row.append(input, copy);
            group.append(labelEl, row);
            nodes.push(group);
        } else if (entry && kind !== 'error') {
            const p = document.createElement('p');
            p.className = 'sync-help-text';
            p.textContent = '一覧に回答用のリンクが記録されていません（手で登録した月です）。';
            nodes.push(p);
        }
        if (entry) {
            const links = document.createElement('ul');
            links.className = 'form-create-links';
            appendFormCreateLink(links, entry.formUrl, '回答の画面を開く');
            appendFormCreateLink(links, entry.editUrl, 'フォームの編集画面を開く（院内アカウント）');
            appendFormCreateLink(links, entry.sheetUrl, '回答のスプレッドシートを開く');
            if (links.children.length > 0) nodes.push(links);
            if (entry.deadline) {
                const p = document.createElement('p');
                p.className = 'sync-help-text';
                p.textContent = `締め切り（説明に書いた日）: ${entry.deadline}${entry.createdAt ? ` ／ 作った日時: ${entry.createdAt}` : ''}`;
                nodes.push(p);
            }
        }
        if (checks) {
            const list = document.createElement('ul');
            list.className = 'form-create-checks';
            describeFormCreateChecks(checks).forEach(line => {
                const li = document.createElement('li');
                li.textContent = line.text;
                if (line.alert) li.classList.add('is-alert');
                list.appendChild(li);
            });
            nodes.push(list);
        }
        if (kind !== 'error') {
            const p = document.createElement('p');
            p.className = 'sync-help-text';
            p.textContent = '回答は、アプリを開いたとき（共有読込のとき）に自動で取り込みます。締め切りの日になっても受付は止まりません。止めるときは、フォームの編集画面の「回答」で受付を止めてください。';
            nodes.push(p);
        }
        els.formCreateResult.replaceChildren(...nodes);
        els.formCreateResult.classList.remove('hidden');
        els.formCreateInput.classList.add('hidden');
        els.formCreateProgress.classList.add('hidden');
        els.submitFormCreateBtn.classList.add('hidden');
    }

    // 作った月・登録済みの月を、自動取り込みの対象の月に入れ、その月の回答を読む（共有読込はしない。未共有の変更を消さないため）
    function applyFormCreateMonths(info) {
        if (!info || !Array.isArray(info.months)) return;
        syncState.formImport.months = info.months.map(String);
        startFormAutoImport();
    }

    async function submitFormCreate() {
        if (formCreateBusy || !isFormCreateAvailable()) return;
        const monthKey = els.formCreateMonth.value;
        if (!/^\d{4}-\d{2}$/.test(monthKey) || monthKey < FORM_CREATE_FROM_MONTH) return;
        const label = formatFormMonthLabel(monthKey);
        if (isFormMonthRegistered(monthKey)) {
            formCreateBusy = true;
            els.submitFormCreateBtn.disabled = true;
            try {
                const info = await requestSharedJsonp({ action: 'formInfo', month: monthKey }, 20000);
                if (info.entry) renderFormCreateResult(monthKey, 'already', info.entry, null, '');
                else renderFormCreateResult(monthKey, 'error', null, null, 'Google側の一覧に、この月の行が見つかりませんでした。「共有読込」を押してから、もう一度開いてください。');
                applyFormCreateMonths(info);
            } catch (err) {
                renderFormCreateResult(monthKey, 'error', null, null, (err && err.message) || String(err));
            } finally {
                formCreateBusy = false;
                els.submitFormCreateBtn.disabled = false;
            }
            return;
        }
        const deadline = els.formCreateDeadline.value;
        if (!isRealDateStr(deadline)) {
            alert('締め切りの日付を入れてください。');
            els.formCreateDeadline.focus();
            return;
        }
        if (deadline >= `${monthKey}-01`) {
            alert(`締め切りは、${label}より前の日にしてください。`);
            els.formCreateDeadline.focus();
            return;
        }
        const doctors = getFormCreateDoctorNames(monthKey);
        if (doctors.length === 0) {
            alert('医師名の選択肢がありません。');
            return;
        }
        const lines = [
            `${label}用のフォームを作りますか？`,
            '',
            `締め切り（説明に書く日）: ${formatFormDeadlineLabel(deadline)}`,
            `医師名の選択肢: ${doctors.length}名`,
            '',
            '院内アカウントのGoogleドライブに、フォームと回答のスプレッドシートを作ります。'
        ];
        if (deadline < formatDateStr(new Date())) lines.splice(3, 0, '※ 締め切りが今日より前の日です');
        if (!confirm(lines.join('\n'))) return;

        formCreateBusy = true;
        els.submitFormCreateBtn.disabled = true;
        els.formCreateInput.classList.add('hidden');
        els.formCreateProgress.textContent = `${label}用のフォームを作っています…（1分ほどかかることがあります。この画面を閉じても、作るのは止まりません）`;
        els.formCreateProgress.classList.remove('hidden');
        const requestId = `fc-${generateId()}`;
        let outcome;
        try {
            try {
                await withFormCreateTimeout(postFormCreate(monthKey, deadline, doctors, requestId), FORM_CREATE_POST_TIMEOUT_MS);
            } catch (err) {
                // 届いていることもあるので、結果を読みにいく
                console.warn('Form create request error', err);
            }
            outcome = await waitFormCreateResult(monthKey, requestId);
        } catch (err) {
            outcome = { error: err };
        }
        const info = outcome.info || null;
        const result = info && info.result;
        let summary;
        if (result && result.state === 'done') {
            const kind = result.already ? 'already' : 'created';
            renderFormCreateResult(monthKey, kind, info.entry, result.checks || null, '');
            applyFormCreateMonths(info);
            summary = kind === 'created' ? `${label}用のフォームを作りました。` : `${label}用は、Google側の一覧に登録済みでした（作り直していません）。`;
        } else {
            let message = result && result.error
                ? result.error
                : ((outcome.error && outcome.error.message) || '結果を確かめられませんでした。');
            if (outcome.timedOut) message += ' 少し待ってから「共有読込」を押し、もう一度この画面を開いて確かめてください（作れていれば「作成済み」と出ます）。';
            renderFormCreateResult(monthKey, 'error', info && info.entry, null, message);
            summary = `${label}用のフォームを作れませんでした。\n\n${message}`;
        }
        formCreateBusy = false;
        els.submitFormCreateBtn.disabled = false;
        // 待っている間に画面を閉じていたら、結果を知らせる
        if (!isFormCreateOpen()) alert(`${summary}\n\n「次の月のフォームを作る」を開き、その月を選ぶと、リンクを見られます。`);
    }

    if (els.formCreateModal) {
        els.formCreateBtn.addEventListener('click', openFormCreate);
        els.closeFormCreateBtn.addEventListener('click', closeFormCreate);
        els.cancelFormCreateBtn.addEventListener('click', closeFormCreate);
        els.formCreateOverlay.addEventListener('click', closeFormCreate);
        els.submitFormCreateBtn.addEventListener('click', submitFormCreate);
        els.formCreateMonth.addEventListener('change', () => updateFormCreateInputs(true));
    }

    // ===== Clear Data =====
    function clearCurrentMonthAssignments() {
        const monthKey = getCurrentMonthKey();
        const label = `${state.currentDate.getFullYear()}年${state.currentDate.getMonth() + 1}月`;
        const shiftCount = Object.entries(state.shifts || {})
            .filter(([dateStr]) => dateStr.startsWith(monthKey))
            .reduce((sum, [, dayShifts]) => sum + Object.keys(dayShifts || {}).length, 0);
        const specialRuleCount = Object.keys(state.specialDayRules || {})
            .filter(dateStr => dateStr.startsWith(monthKey)).length;
        const hasSavedMonth = !!(state.savedMonths && state.savedMonths[monthKey]);

        const ok = confirm(
            `${label} の割り付けだけを消去します。\n\n` +
            `削除対象: 割り付け ${shiftCount}件 / 日種別上書き ${specialRuleCount}件 / 月保存 ${hasSavedMonth ? 'あり' : 'なし'}\n\n` +
            '医師マスタ、フォーム回答の不可日・希望日、他の月の割り付けは残ります。\n\n' +
            '実行しますか？'
        );
        if (!ok) return;

        for (const dateStr of Object.keys(state.shifts || {})) {
            if (dateStr.startsWith(monthKey)) delete state.shifts[dateStr];
        }
        for (const dateStr of Object.keys(state.specialDayRules || {})) {
            if (dateStr.startsWith(monthKey)) delete state.specialDayRules[dateStr];
        }
        if (state.savedMonths) delete state.savedMonths[monthKey];

        saveData('当月の割り付け消去');
        renderCalendar();
        alert(`${label} の割り付けを消去しました。`);
    }

    els.clearCurrentMonthBtn.addEventListener('click', clearCurrentMonthAssignments);

	    els.clearAllBtn.addEventListener('click', () => {
	        if (!confirm('全データを消去しますか？')) return;
	        state.doctors = []; state.shifts = {}; state.specialDayRules = {}; state.savedMonths = {}; state.formResponseStatus = {}; state.formResponsesByMonth = {};
	        saveData('全データ消去'); renderDoctors(); renderCalendar();
	    });

    // ===== Rendering: Doctor List =====
    function renderDoctors() {
        els.doctorList.innerHTML = '';
        const visibleDoctors = state.doctors.filter(doc => isDoctorActiveInMonth(doc));
        if (visibleDoctors.length === 0) {
            els.doctorList.innerHTML = '<li class="doctor-item" style="color:#aaa;">なし</li>'; return;
        }
        visibleDoctors.forEach(doc => {
            const count = getDoctorMonthlyCount(doc.id);
            const li = document.createElement('li');
            li.className = 'doctor-item';
            if (isFormNonResponder(doc)) li.classList.add('doctor-missing-response');
            if (isDutyPausedDoctor(doc)) li.classList.add('doctor-paused');
            else if (count === 0) li.classList.add('doctor-zero-count');
            if (count >= 3) li.classList.add('doctor-max-count');
            const groupCls = getGroupBadgeClass(doc.group);
	            let badges = `<span class="badge-group ${groupCls}">${doc.group}</span>`;
	            if (doc.holidayErDayPreferred) badges += '<span class="badge-erday-pref">救急日中可</span>';
	            if (isWardDutyPriorityDoctor(doc)) badges += '<span class="badge-erday-pref">病棟優先</span>';
		            if (isDutyExcludedDoctor(doc)) badges += '<span class="badge-form-missing">当直除外</span>';
		            if (isFridayWardOnlyDoctor(doc)) badges += '<span class="badge-erday-pref">金曜病棟のみ</span>';
		            if (getMonthlyDutyTarget(doc) > 1) badges += `<span class="badge-erday-pref">月${getMonthlyDutyTarget(doc)}目標</span>`;
		            if (isIwataYukiyoDoctor(doc)) badges += '<span class="badge-erday-pref">病棟当直</span>';
		            if (isManualOnlyDoctor(doc)) badges += '<span class="badge-form-missing">手動のみ</span>';
                    if (isErNightOnlyDoctor(doc)) badges += '<span class="badge-erday-pref">救急夜間のみ</span>';
                    if (isThursdayWardNightOnlyDoctor(doc)) badges += '<span class="badge-erday-pref">木曜病棟夜間のみ</span>';
            if (isFormNonResponder(doc)) badges += '<span class="badge-form-missing">未回答</span>';
            if (isDutyPausedDoctor(doc)) badges += '<span class="badge-form-missing">休止中</span>';
            if (hasWardNightPermission(doc)) badges += '<span class="badge-erday-pref">病棟夜間可</span>';
            if (hasMonthlyWardDutyPermission(doc, getCurrentMonthKey())) badges += `<span class="badge-erday-pref">${state.currentDate.getMonth() + 1}月 病棟可</span>`;
            if (isHolidayLimitRelaxedDoctor(doc)) badges += `<span class="badge-erday-pref">休日月${RELAXED_HOLIDAY_DUTY_MONTHLY_LIMIT}回</span>`;
            const opStr = doc.outpatientDays?.length ? doc.outpatientDays.join('・') : 'なし';
            const formData = getDoctorFormDataForMonth(doc);
            const ngCount = (formData.ngDates1 || []).length + (formData.ngDates2 || []).length + (formData.ngDates3 || []).length;
            const ngStr = ngCount > 0 ? ` / NG:${ngCount}日` : '';
            const fixedNgStr = getFixedWeekdayNgDays(doc) ? ` / 固定NG:${formatFixedWeekdayNgDays(doc)}` : '';
            const erDayFlag = hasErDayThisMonth(doc.id) ? ' / 🚑日中済' : '';
            const noteFlag = formData.notes ? (formData.notes.includes('絶対') ? ' / 絶対備考' : ' / 備考あり') : '';
            li.innerHTML = `
                <div class="doctor-info">
                    <span class="doctor-name">${doc.name} ${badges}</span>
                    <span class="doctor-meta">外来: ${opStr}${ngStr}${fixedNgStr}${erDayFlag}${noteFlag}</span>
                    <span class="doctor-count">今月: ${count}回</span>
                </div>
                <div class="doctor-actions">
                    <button type="button" class="doctor-settings-btn" data-id="${doc.id}" aria-label="${doc.name}の個別設定" title="${doc.name}の個別設定">設定</button>
                </div>`;
            els.doctorList.appendChild(li);
        });
        els.doctorList.querySelectorAll('.doctor-settings-btn').forEach(b =>
            b.addEventListener('click', e => openDoctorSettings(e.currentTarget.dataset.id))
        );
    }

    // ===== Doctor Settings (個別設定) =====
    let doctorSettingsTargetId = null;
    let doctorSettingsReturnFocus = null;
    // 「この月は病棟当直も可」の対象の月（開いたときに表示していた月）
    let doctorSettingsMonthKey = '';

    function isDoctorSettingsOpen() {
        return !!(els.doctorSettingsModal && !els.doctorSettingsModal.classList.contains('hidden'));
    }

    function openDoctorSettings(id) {
        const doc = state.doctors.find(d => d.id === id);
        if (!doc || !els.doctorSettingsModal) return;
        doctorSettingsTargetId = id;
        doctorSettingsReturnFocus = document.activeElement;
        els.doctorSettingsName.textContent = `${doc.name}（${doc.group}）`;
        els.doctorSettingPaused.checked = isDutyPausedDoctor(doc);
        els.doctorSettingWardNight.checked = hasWardNightPermission(doc);
        doctorSettingsMonthKey = getCurrentMonthKey();
        els.doctorSettingWardMonthRow.classList.toggle('hidden', !canUseWardDutyMonthSetting(doc));
        els.doctorSettingWardMonthTitle.textContent =
            `${state.currentDate.getFullYear()}年${state.currentDate.getMonth() + 1}月は病棟当直も可`;
        els.doctorSettingWardMonth.checked = getWardDutyMonths(doc).includes(doctorSettingsMonthKey);
        els.doctorSettingHolidayRelaxed.checked = isHolidayLimitRelaxedDoctor(doc);
        els.doctorSettingsModal.classList.remove('hidden');
        els.doctorSettingsModal.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(() => els.closeDoctorSettingsBtn.focus());
    }

    function closeDoctorSettings() {
        if (!els.doctorSettingsModal) return;
        els.doctorSettingsModal.classList.add('hidden');
        els.doctorSettingsModal.setAttribute('aria-hidden', 'true');
        doctorSettingsTargetId = null;
        doctorSettingsMonthKey = '';
        if (doctorSettingsReturnFocus && doctorSettingsReturnFocus.isConnected) doctorSettingsReturnFocus.focus();
        doctorSettingsReturnFocus = null;
    }

    function focusDoctorSettingsButton(id) {
        const button = Array.from(els.doctorList.querySelectorAll('.doctor-settings-btn'))
            .find(b => b.dataset.id === id);
        if (button) button.focus();
    }

    function saveDoctorSettings() {
        const id = doctorSettingsTargetId;
        const doc = state.doctors.find(d => d.id === id);
        if (!doc) { closeDoctorSettings(); return; }
        const next = {
            dutyPaused: els.doctorSettingPaused.checked,
            wardNightAllowed: els.doctorSettingWardNight.checked,
            holidayLimitRelaxed: els.doctorSettingHolidayRelaxed.checked
        };
        // 「この月は病棟当直も可」は月ごとに付け外しする（ほかの月の設定は変えない）
        const monthKey = doctorSettingsMonthKey;
        let nextWardDutyMonths = null;
        if (monthKey && !els.doctorSettingWardMonthRow.classList.contains('hidden')) {
            const months = getWardDutyMonths(doc);
            const wanted = els.doctorSettingWardMonth.checked;
            if (months.includes(monthKey) !== wanted) {
                nextWardDutyMonths = normalizeWardDutyMonths(
                    wanted ? [...months, monthKey] : months.filter(key => key !== monthKey)
                );
            }
        }
        const changed = Object.keys(next).some(key => !!doc[key] !== next[key]) || nextWardDutyMonths !== null;
        closeDoctorSettings();
        if (!changed) return;
        Object.assign(doc, next);
        if (nextWardDutyMonths) {
            if (nextWardDutyMonths.length > 0) doc.wardDutyMonths = nextWardDutyMonths;
            else delete doc.wardDutyMonths;
        }
        saveData('医師設定変更');
        renderDoctors();
        renderCalendar();
        focusDoctorSettingsButton(id);
    }

    if (els.doctorSettingsModal) {
        els.closeDoctorSettingsBtn.addEventListener('click', closeDoctorSettings);
        els.cancelDoctorSettingsBtn.addEventListener('click', closeDoctorSettings);
        els.saveDoctorSettingsBtn.addEventListener('click', saveDoctorSettings);
        els.doctorSettingsOverlay.addEventListener('click', closeDoctorSettings);
    }

    // ===== Rendering: Calendar =====
    function renderPeriodHeader() {
	        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
	        const monthKey = getMonthKey(state.currentDate);
            const savedBadge = state.savedMonths[monthKey] ? ' <span class="saved-month-badge">保存済</span>' : '';
            const formBadge = state.formResponsesByMonth && state.formResponsesByMonth[monthKey]
                ? ' <span class="form-month-badge">フォーム済</span>'
                : '';
	        els.currentMonthDisplay.innerHTML = `${y}年 ${m + 1}月${savedBadge}${formBadge}`;
            if (els.mobileTargetMonth) {
                els.mobileTargetMonth.textContent = `操作対象: ${y}年${m + 1}月`;
            }
            renderFormImportPanel();
    }

    function makeDateInteractive(element, dObj, dStr, onOpen) {
        const fullDate = `${dObj.getFullYear()}年${dObj.getMonth() + 1}月${dObj.getDate()}日（${DAY_NAMES[dObj.getDay()]}）`;
        element.dataset.date = dStr;
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        if (!element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', `${fullDate}の当直を編集`);
        }
        element.addEventListener('click', onOpen);
        element.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            onOpen();
        });
    }

	    function renderDesktopMonth() {
	        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
            renderPeriodHeader();
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
            if (isFixedSpecialDutyDate(dStr)) dayDiv.classList.add('has-fixed-duty');
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
            if (isFixedSpecialDutyDate(dStr)) {
                const fixedLabel = document.createElement('span');
                fixedLabel.className = 'fixed-duty-label';
                fixedLabel.textContent = '固定';
                fixedLabel.title = formatFixedDutySummary(dStr);
                dayDiv.querySelector('.day-number').appendChild(fixedLabel);
            }

            const cont = document.createElement('div'); cont.className = 'shift-slots';
            const roles = getRequiredRoles(dObj, dStr);
            const daySh = state.shifts[dStr] || {};

            roles.forEach(role => {
                const badge = document.createElement('div');
                badge.className = `shift-badge ${role}`;
                if (isFixedSpecialDutyRole(dStr, role)) {
                    const names = getFixedDutyDisplayNames(dStr, role);
                    badge.classList.add('fixed-duty');
                    setShiftBadgeMainText(badge, `${getRoleLabel(role, dObj, dStr)}: 固定 ${names.join('・')}`);
                    badge.title = 'シルバーウィーク・年末年始の固定担当です';
                    cont.appendChild(badge);
                    return;
                }
                // 第1・第3土曜の救急日中は救急医固定
                if (role === 'erDay' && isActiveFixedErDaySaturday(dObj)) {
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
                            if (hasNoteWarning(rule.warning)) badge.classList.add('note-warning');
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
            makeDateInteractive(dayDiv, dObj, dStr, () => openModal(dObj, dStr));
            els.calendarGrid.appendChild(dayDiv);
        }
        renderDoctors();
    }

    function createMobileRoleCell(dObj, dStr, role, requiredRoles, dayShifts, isHol) {
        const cell = document.createElement('div');
        cell.className = `shift-badge mobile-role-cell ${role}`;
        const fullRoleLabel = getRoleLabelForDayType(role, dObj, isHol);

        if (!requiredRoles.includes(role)) {
            cell.classList.add('not-required');
            cell.textContent = '－';
            cell.title = `${fullRoleLabel}: 対象外`;
            return cell;
        }

        if (isFixedSpecialDutyRole(dStr, role)) {
            const fullNames = getFixedDutyDisplayNames(dStr, role);
            const shortNames = fullNames.map(name => getMobileDoctorDisplayName(name, dObj));
            cell.classList.add('fixed-duty');
            cell.textContent = shortNames.join('・');
            cell.title = `${fullRoleLabel}: 固定 ${fullNames.join('・')}`;
            return cell;
        }

        if (role === 'erDay' && isActiveFixedErDaySaturday(dObj)) {
            cell.classList.add('fixed-duty');
            cell.textContent = '救急医';
            cell.title = `${fullRoleLabel}: 救急医固定`;
            return cell;
        }

        const doctorId = dayShifts[role];
        if (!doctorId) {
            cell.classList.add('empty');
            cell.textContent = '未';
            cell.title = `${fullRoleLabel}: 未割当`;
            return cell;
        }

        const doctorName = findDoctorName(doctorId);
        if (!doctorName) {
            cell.classList.add('empty');
            cell.textContent = '不明';
            cell.title = `${fullRoleLabel}: 医師が見つかりません`;
            return cell;
        }

        cell.textContent = getMobileDoctorDisplayName(doctorName, dObj);
        cell.title = `${fullRoleLabel}: ${doctorName}`;
        const rule = withMobileMonthContext(dObj, () => checkAssignmentRule(doctorId, role, dObj));
        if (!rule.valid) {
            cell.classList.add('warning');
            cell.title += ` / ${rule.error}`;
        } else if (rule.warning) {
            cell.classList.add('soft-warning');
            if (hasNoteWarning(rule.warning)) cell.classList.add('note-warning');
            cell.title += ` / ${rule.warning}`;
        }
        return cell;
    }

    function openMobileDate(dObj, dStr) {
        ensureEditableMonthLoaded(dObj);
        viewState.mobileActiveDate = new Date(dObj.getFullYear(), dObj.getMonth(), dObj.getDate());
        setCurrentMonthFromDate(dObj);
        renderMobileWeek();
        const refreshedRow = els.calendarGrid.querySelector(`[data-date="${dStr}"]`);
        if (refreshedRow) refreshedRow.focus();
        openModal(dObj, dStr);
    }

    function renderMobileWeek() {
        if (!viewState.mobileWeekStart) {
            viewState.mobileActiveDate = new Date(state.currentDate);
            viewState.mobileWeekStart = startOfSunday(viewState.mobileActiveDate);
        }

        renderPeriodHeader();
        els.calendarGrid.innerHTML = '';
        if (els.mobileWeekRange) {
            els.mobileWeekRange.textContent = formatMobileWeekRange(viewState.mobileWeekStart);
        }

        const todayStr = formatDateStr(new Date());
        const targetMonthKey = getCurrentMonthKey();
        for (let offset = 0; offset < 7; offset++) {
            const dObj = addCalendarDays(viewState.mobileWeekStart, offset);
            const dStr = formatDateStr(dObj);
            const renderData = withMobileMonthContext(dObj, () => ({
                requiredRoles: getRequiredRoles(dObj, dStr),
                dayShifts: state.shifts[dStr] || {},
                isHol: isHoliday(dObj, dStr),
                specialDayRule: state.specialDayRules[dStr] || '',
                exceptionIssues: getDayExceptionIssues(dObj, dStr)
            }));
            const row = document.createElement('div');
            row.className = 'calendar-day mobile-week-row';
            if (dObj.getDay() === 0) row.classList.add('sun');
            if (dObj.getDay() === 6) row.classList.add('sat');
            if (state.holidays[dStr] || renderData.specialDayRule === 'holiday') row.classList.add('hol');
            if (dStr === todayStr) row.classList.add('today');
            if (getMonthKey(dObj) !== targetMonthKey) row.classList.add('outside-target-month');
            if (isFixedSpecialDutyDate(dStr)) row.classList.add('has-fixed-duty');
            const exceptionIssues = renderData.exceptionIssues;
            if (exceptionIssues.length > 0) {
                row.classList.add('has-exception');
                row.title = exceptionIssues.join(' / ');
            }

            const dateCell = document.createElement('div');
            dateCell.className = 'mobile-date-cell';
            const dateMain = document.createElement('span');
            dateMain.className = 'mobile-date-main';
            dateMain.textContent = `${dObj.getMonth() + 1}/${dObj.getDate()}`;
            const dateDay = document.createElement('span');
            dateDay.className = 'mobile-date-day';
            dateDay.textContent = DAY_NAMES[dObj.getDay()];
            dateCell.append(dateMain, dateDay);
            if (state.holidays[dStr]) {
                const holidayMark = document.createElement('span');
                holidayMark.className = 'mobile-holiday-mark';
                holidayMark.textContent = '祝';
                holidayMark.title = state.holidays[dStr];
                dateCell.appendChild(holidayMark);
            }
            row.appendChild(dateCell);

            ROLE_ORDER.forEach(role => {
                row.appendChild(createMobileRoleCell(
                    dObj,
                    dStr,
                    role,
                    renderData.requiredRoles,
                    renderData.dayShifts,
                    renderData.isHol
                ));
            });

            const roleSummary = ROLE_ORDER.map(role => {
                const cell = row.querySelector(`.mobile-role-cell.${role}`);
                return cell && cell.title
                    ? cell.title
                    : `${getRoleLabelForDayType(role, dObj, renderData.isHol)}: 対象外`;
            }).join('、');
            row.setAttribute('aria-label', `${dObj.getFullYear()}年${dObj.getMonth() + 1}月${dObj.getDate()}日（${DAY_NAMES[dObj.getDay()]}）、${roleSummary}。当直を編集`);
            makeDateInteractive(row, dObj, dStr, () => openMobileDate(dObj, dStr));
            els.calendarGrid.appendChild(row);
        }
        renderDoctors();
    }

    // その月にまだ1枠も割り当てていない（固定表を除く）ときは、未割当の枠を目立たせない（2026-11-15 利用者）
    function hasMonthAssignments(monthKey) {
        return Object.entries(state.shifts || {}).some(([dateStr, dayShifts]) =>
            dateStr.startsWith(`${monthKey}-`) &&
            Object.entries(dayShifts || {}).some(([role, id]) => id && !isFixedSpecialDutyRole(dateStr, role)));
    }

    function renderCalendar() {
        els.calendarGrid.classList.toggle('is-month-unassigned', !hasMonthAssignments(getCurrentMonthKey()));
        if (viewState.mobileMedia.matches) renderMobileWeek();
        else renderDesktopMonth();
    }

    function moveMobileWeek(amount) {
        if (!viewState.mobileWeekStart) viewState.mobileWeekStart = startOfSunday(state.currentDate);
        viewState.mobileWeekStart = addCalendarDays(viewState.mobileWeekStart, amount * 7);
        viewState.mobileActiveDate = addCalendarDays(viewState.mobileWeekStart, 3);
        setCurrentMonthFromDate(viewState.mobileActiveDate);
        renderCalendar();
    }

    // ===== Month / Week Navigation =====
	    els.prevMonthBtn.addEventListener('click', () => {
            if (viewState.mobileMedia.matches) {
                const target = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
                state.currentDate = target;
                viewState.mobileActiveDate = new Date(target);
                viewState.mobileWeekStart = startOfSunday(target);
            } else {
                state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
            }
            renderCalendar();
        });
	    els.nextMonthBtn.addEventListener('click', () => {
            if (viewState.mobileMedia.matches) {
                const target = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
                state.currentDate = target;
                viewState.mobileActiveDate = new Date(target);
                viewState.mobileWeekStart = startOfSunday(target);
            } else {
                state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
            }
            renderCalendar();
        });
	    els.todayBtn.addEventListener('click', () => {
            state.currentDate = new Date();
            viewState.mobileActiveDate = new Date();
            viewState.mobileWeekStart = startOfSunday(viewState.mobileActiveDate);
            renderCalendar();
        });
        if (els.prevWeekBtn) els.prevWeekBtn.addEventListener('click', () => moveMobileWeek(-1));
        if (els.nextWeekBtn) els.nextWeekBtn.addEventListener('click', () => moveMobileWeek(1));

        function setMobilePanel(panel) {
            const nextPanel = panel === 'doctors' ? 'doctors' : 'calendar';
            viewState.activeMobilePanel = nextPanel;
            if (els.appContainer) {
                els.appContainer.dataset.mobileView = nextPanel;
                els.appContainer.classList.toggle('mobile-doctors-active', nextPanel === 'doctors');
            }
            if (els.mobileCalendarTab) {
                els.mobileCalendarTab.setAttribute('aria-selected', String(nextPanel === 'calendar'));
                els.mobileCalendarTab.setAttribute('tabindex', nextPanel === 'calendar' ? '0' : '-1');
                els.mobileCalendarTab.classList.toggle('is-active', nextPanel === 'calendar');
            }
            if (els.mobileDoctorsTab) {
                els.mobileDoctorsTab.setAttribute('aria-selected', String(nextPanel === 'doctors'));
                els.mobileDoctorsTab.setAttribute('tabindex', nextPanel === 'doctors' ? '0' : '-1');
                els.mobileDoctorsTab.classList.toggle('is-active', nextPanel === 'doctors');
            }
        }

        function setMobileActionsOpen(isOpen) {
            if (!els.mobileActionsToggle || !els.appHeader) return;
            els.mobileActionsToggle.setAttribute('aria-expanded', String(isOpen));
            els.appHeader.classList.toggle('mobile-actions-open', isOpen);
        }

        if (els.mobileCalendarTab) {
            els.mobileCalendarTab.addEventListener('click', () => setMobilePanel('calendar'));
        }
        if (els.mobileDoctorsTab) {
            els.mobileDoctorsTab.addEventListener('click', () => setMobilePanel('doctors'));
        }
        [els.mobileCalendarTab, els.mobileDoctorsTab].filter(Boolean).forEach(tab => {
            tab.addEventListener('keydown', event => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                event.preventDefault();
                const nextPanel = viewState.activeMobilePanel === 'calendar' ? 'doctors' : 'calendar';
                setMobilePanel(nextPanel);
                (nextPanel === 'calendar' ? els.mobileCalendarTab : els.mobileDoctorsTab).focus();
            });
        });
        if (els.mobileActionsToggle) {
            els.mobileActionsToggle.addEventListener('click', () => {
                setMobileActionsOpen(els.mobileActionsToggle.getAttribute('aria-expanded') !== 'true');
            });
        }
        if (els.headerActions) {
            els.headerActions.addEventListener('click', event => {
                if (viewState.mobileMedia.matches && event.target.closest('button, label')) {
                    setMobileActionsOpen(false);
                }
            });
        }
        document.addEventListener('click', event => {
            if (!viewState.mobileMedia.matches || !els.appHeader || els.appHeader.contains(event.target)) return;
            setMobileActionsOpen(false);
        });

        let lastMobileMode = viewState.mobileMedia.matches;
        const handleMobileMediaChange = event => {
            const nextMobileMode = Boolean(event.matches);
            if (nextMobileMode === lastMobileMode) return;
            lastMobileMode = nextMobileMode;
            if (nextMobileMode) {
                viewState.mobileActiveDate = new Date(state.currentDate);
                viewState.mobileWeekStart = startOfSunday(viewState.mobileActiveDate);
            } else {
                setCurrentMonthFromDate(viewState.mobileActiveDate || state.currentDate);
                setMobileActionsOpen(false);
            }
            renderCalendar();
        };
        if (viewState.mobileMedia.addEventListener) {
            viewState.mobileMedia.addEventListener('change', handleMobileMediaChange);
        } else {
            viewState.mobileMedia.addListener(handleMobileMediaChange);
        }
        let mobileResizeFrame = null;
        window.addEventListener('resize', () => {
            if (mobileResizeFrame) window.cancelAnimationFrame(mobileResizeFrame);
            mobileResizeFrame = window.requestAnimationFrame(() => {
                mobileResizeFrame = null;
                handleMobileMediaChange({ matches: viewState.mobileMedia.matches });
            });
        });
        setMobilePanel('calendar');

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
	        saveData('月保存');
	        renderCalendar();
	        alert(`${monthKey} を保存しました。\n保存した割り当て枠: ${shiftCount}件`);
	    }

	    els.saveMonthBtn.addEventListener('click', saveCurrentMonthSnapshot);

		    // ===== Modal =====
    function appendDoctorOption(sel, doc, labelSuffix = '') {
        if (!sel || !doc) return null;
        const options = sel.options ? Array.from(sel.options) : Array.from(sel.querySelectorAll('option'));
        const exists = options.some(option => option.value === doc.id);
        if (exists) return null;
        const opt = document.createElement('option');
        opt.value = doc.id;
        const suffix = labelSuffix ? ` / ${labelSuffix}` : '';
        opt.textContent = `${doc.name} [${doc.group}${suffix}] (${getDoctorMonthlyCount(doc.id)}回)`;
        sel.appendChild(opt);
        return opt;
    }

    function getModalRoleCandidateFilter(role) {
        // 休止・手動のみなどを除いた、枠ごとの通常の候補条件（従来の候補一覧と同じ）
        if (role === 'erDay') {
            return d => d.holidayErDayPreferred || canDoErDaySpecialDoctor(d, editingDateObj, editingDateStr);
        }
        if (role === 'wardDay') {
            return d => canDoWardDayDoctor(d) &&
                !d.holidayErDayPreferred &&
                canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'wardDay');
        }
        if (role === 'wardNight') {
            return d => canDoWardNightDoctor(d, editingDateObj, editingDateStr) &&
                !d.holidayErDayPreferred &&
                canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'wardNight');
        }
        if (role === 'erNight') {
            return d => canDoErNightDoctor(d) &&
                !d.holidayErDayPreferred &&
                canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'erNight');
        }
        return () => false;
    }

    function populateModalSelects(roles) {
        const currentShifts = state.shifts[editingDateStr] || {};
        roles.forEach(role => {
            const sel = els.selects[role];
            sel.innerHTML = '<option value="">-- 未割り当て --</option>';
            const isRoleCandidate = getModalRoleCandidateFilter(role);
            const isWardNightPermissionCandidate = d => role === 'wardNight' && canDoWardNightByPermission(d);
            const isWardMonthPermissionCandidate = d => canDoWardRoleByMonthPermission(d, role, editingDateStr);
            const eligible = state.doctors.filter(d =>
                isAutoAssignableDoctor(d, editingDateObj) && isRoleCandidate(d)
            );
            if (role === 'erDay') {
                if (eligible.length > 0) {
                    const og2 = document.createElement('optgroup');
                    og2.label = '救急日中候補';
                    eligible.forEach(doc => {
                        appendDoctorOption(og2, doc);
                    });
                    sel.appendChild(og2);
                }
            } else {
                eligible.forEach(doc => {
                    appendDoctorOption(sel, doc);
                });
            }
            // 個別設定で「病棟夜間も可」にした医師（手動選択のみ）
            state.doctors
                .filter(d => isAutoAssignableDoctor(d, editingDateObj) && isWardNightPermissionCandidate(d))
                .forEach(doc => appendDoctorOption(sel, doc, '病棟夜間可'));
            // 個別設定で「この月は病棟当直も可」にした医師（手動選択のみ。この日の月に設定があるときだけ）
            state.doctors
                .filter(d => isAutoAssignableDoctor(d, editingDateObj) && isWardMonthPermissionCandidate(d))
                .forEach(doc => appendDoctorOption(sel, doc, `${Number(editingDateStr.slice(5, 7))}月 病棟可`));
            state.doctors
                .filter(d => isDoctorActiveOnDate(d, editingDateObj) && isManualOnlyDoctor(d))
                .forEach(doc => appendDoctorOption(sel, doc, '手動のみ'));
            // 個別設定で「当直休止」にした医師は末尾に表示する（選ぶと保存前に確認が出る）
            state.doctors
                .filter(d =>
                    isDutyPausedDoctor(d) &&
                    isDoctorActiveOnDate(d, editingDateObj) &&
                    !isDutyExcludedDoctor(d) &&
                    !isManualOnlyDoctor(d) &&
                    (isRoleCandidate(d) || isWardNightPermissionCandidate(d) || isWardMonthPermissionCandidate(d))
                )
                .forEach(doc => appendDoctorOption(sel, doc, '休止中'));
            // 条件に合わない先生も、手動では一覧の最後から選べる（選ぶと注意が出て、チェックを付ければ保存できる。2026-11-07 利用者）
            const listedDoctorIds = new Set(Array.from(sel.options).map(option => option.value));
            const outOfConditionDoctors = state.doctors.filter(d =>
                isDoctorActiveOnDate(d, editingDateObj) && !listedDoctorIds.has(d.id)
            );
            if (outOfConditionDoctors.length > 0) {
                const outGroup = document.createElement('optgroup');
                outGroup.label = '条件外の先生（選ぶと注意が出ます）';
                outOfConditionDoctors.forEach(doc => {
                    const option = appendDoctorOption(outGroup, doc, '条件外');
                    if (option) option.dataset.outOfCondition = '1';
                });
                sel.appendChild(outGroup);
            }
	            // Ensure current assignee is in the list
	            const curId = currentShifts[role];
            if (curId) {
                let found = false;
                for (const o of sel.options) { if (o.value === curId) { found = true; break; } }
                if (!found) {
                    const n = findDoctorName(curId);
                    if (n) { const opt = document.createElement('option'); opt.value = curId; opt.textContent = `${n} (対象外)`; opt.dataset.outOfCondition = '1'; sel.appendChild(opt); }
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
        roles = ROLE_ORDER.filter(role => roles.includes(role) || isFixedSpecialDutyRole(editingDateStr, role));
        roles = roles.filter(role => !isFixedSpecialDutyRole(editingDateStr, role));
        // 第1・第3土曜の救急日中は固定 → セレクト非表示
        const fixedErDay = editingDateObj && isHol && isActiveFixedErDaySaturday(editingDateObj);
        if (fixedErDay) roles = roles.filter(r => r !== 'erDay');
        ['wardDay', 'wardNight', 'erDay', 'erNight'].forEach(r => {
            if (roles.includes(r)) els.fgs[r].classList.remove('hidden');
            else { els.fgs[r].classList.add('hidden'); els.selects[r].value = ''; }
        });
        els.fgs.wardDay.querySelector('label').textContent = '🏥 病棟日中（8年目以上）';
        const weekdayWardNightChiefNote = ' / 不足時6-7年目可 / 部長は個別指定者のみ可';
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
            els.fgs.erDay.querySelector('label').textContent = '🚑 救急日中 [特別枠]（救急日中候補者）';
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
        assignmentReturnFocus = document.activeElement;
        editingDateStr = dStr; editingDateObj = dObj;
        els.modalDateDisplay.textContent = `${dObj.getFullYear()}/${dObj.getMonth() + 1}/${dObj.getDate()} (${DAY_NAMES[dObj.getDay()]})`;
        if (isFixedSpecialDutyDate(dStr)) {
            const fixedNote = document.createElement('span');
            fixedNote.className = 'fixed-duty-modal-note';
            fixedNote.textContent = `固定: ${formatFixedDutySummary(dStr)}`;
            els.modalDateDisplay.appendChild(document.createElement('br'));
            els.modalDateDisplay.appendChild(fixedNote);
        }
        els.selectDayType.value = state.specialDayRules[dStr] || '';
        updateModalRoles();
        const dS = state.shifts[dStr] || {};
        const roles = getRequiredRoles(dObj, dStr).filter(role => !isFixedSpecialDutyRole(dStr, role));
        roles.forEach(r => { if (els.selects[r]) els.selects[r].value = dS[r] || ''; });
        els.overrideConfirmCheckbox.checked = false;
        modalOverrideAckKey = '';
        updateModalState();
        els.modal.classList.remove('hidden');
        els.modal.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(() => els.closeModalBtn.focus());
    }

    // 手動でも保存できない（チェックを付けても保存できない）項目：医師データなし、同じ日に同じ先生（2026-11-07 利用者）
    function isBlockingManualError(error) {
        return String(error || '').split(' / ').some(part =>
            part === '医師が見つかりません' || part.includes('同日の別枠に割り当て済みです')
        );
    }

    // 画面で選んでいる割り当て（保存すると書き込まれる内容）
    function getModalSelectedShifts() {
        const selected = {};
        for (const [role, sel] of Object.entries(els.selects)) {
            if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden') || !sel.value) continue;
            selected[role] = sel.value;
        }
        return selected;
    }

    // 画面で選んでいる内容を保存したものとして判定する。
    // 保存済みの割り当てと比べると、同じ日の中で先生を別の枠へ移すだけでも「同日の別枠」で止まるため（2026-11-07）
    function withModalSelectedShifts(callback) {
        const hadDay = Object.prototype.hasOwnProperty.call(state.shifts, editingDateStr);
        const savedDay = state.shifts[editingDateStr];
        const modalDay = { ...(savedDay || {}) };
        ['wardDay', 'wardNight', 'erDay', 'erNight'].forEach(role => delete modalDay[role]);
        Object.assign(modalDay, getModalSelectedShifts());
        state.shifts[editingDateStr] = modalDay;
        try {
            return callback();
        } finally {
            if (hadDay) state.shifts[editingDateStr] = savedDay;
            else delete state.shifts[editingDateStr];
        }
    }

    // 手動の割り当ての判定（2026-11-07 利用者の依頼で、同じ日に同じ先生などを除き、規則に当たってもチェックを付ければ保存できる）
    //   blockingErrors: 保存不可 / strongOverrideErrors: 以前は保存不可だった規則（赤） / overrideErrors: 一時許可（黄） / warns: 注意のみ
    function collectModalIssues() {
        const blockingErrors = [], strongOverrideErrors = [], overrideErrors = [], warns = [], levels = {};
        const LEVEL_RANK = { warn: 1, override: 2, strong: 3, blocking: 4 };
        const raiseLevel = (role, level) => {
            if (!levels[role] || LEVEL_RANK[level] > LEVEL_RANK[levels[role]]) levels[role] = level;
        };
        const override = els.selectDayType.value;
        let modalIsHol;
        if (override === 'weekday') modalIsHol = false;
        else if (override === 'holiday') modalIsHol = true;
        else modalIsHol = isHoliday(editingDateObj, editingDateStr);
        // Cross-check: same doctor in multiple roles
        const selectedMap = {};
        for (const [role, doctorId] of Object.entries(getModalSelectedShifts())) {
            if (!selectedMap[doctorId]) selectedMap[doctorId] = [];
            selectedMap[doctorId].push(role);
        }
        for (const [id, roles] of Object.entries(selectedMap)) {
            if (roles.length > 1) {
                const n = findDoctorName(id);
                blockingErrors.push(`${n || id} が複数枠に割り当てられています（同じ日に同じ先生は不可）`);
                roles.forEach(role => raiseLevel(role, 'blocking'));
            }
        }
        const selectedDepartments = {};
        for (const id of Object.keys(selectedMap)) {
            const doctor = state.doctors.find(doc => doc.id === id);
            const department = getDoctorDepartment(doctor);
            if (!department) continue;
            if (!selectedDepartments[department]) selectedDepartments[department] = [];
            selectedDepartments[department].push(doctor);
        }
        const sameDepartmentIds = new Set();
        for (const [department, doctors] of Object.entries(selectedDepartments)) {
            if (doctors.length > 1) {
                warns.push(`同じ科（${department}）の医師が同日に入っています: ${doctors.map(doc => doc.name).join('・')}`);
                doctors.forEach(doc => {
                    sameDepartmentIds.add(doc.id);
                    selectedMap[doc.id].forEach(role => raiseLevel(role, 'warn'));
                });
            }
        }
        withModalSelectedShifts(() => {
            for (const [role, sel] of Object.entries(els.selects)) {
                if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden') || !sel.value) continue;
                const chk = checkAssignmentRule(sel.value, role, editingDateObj);
                const roleLabel = getRoleLabelForDayType(role, editingDateObj, modalIsHol);
                const setLevel = level => raiseLevel(role, level);
                let error = chk.error;
                // 画面の中での重複は上の「複数枠」で知らせるので、同日の別枠の項目は重ねて出さない
                if (error && selectedMap[sel.value].length > 1) {
                    error = error.split(' / ').filter(part => !part.includes('同日の別枠に割り当て済みです')).join(' / ') || null;
                }
                const selectedOption = sel.selectedOptions[0];
                const outOfCondition = !!(selectedOption && selectedOption.dataset.outOfCondition === '1');
                if (error) {
                    const msg = `${roleLabel}: ${error}`;
                    if (isBlockingManualError(error)) { blockingErrors.push(msg); setLevel('blocking'); }
                    else if (isHardRuleError(error)) { strongOverrideErrors.push(msg); setLevel('strong'); }
                    else { overrideErrors.push(msg); setLevel('override'); }
                } else if (outOfCondition) {
                    // 一覧の「条件外の先生」から選び、規則の文言には当たらない場合も注意を出す
                    strongOverrideErrors.push(`${roleLabel}: この枠の候補の条件に合いません（条件外の先生）`);
                    setLevel('strong');
                }
                if (!chk.error && chk.warning) {
                    // 画面の中の同じ科の重なりは上の「同じ科」の注意で知らせるので、枠ごとには重ねて出さない
                    const warning = sameDepartmentIds.has(sel.value)
                        ? chk.warning.split(' / ').filter(part => !part.includes('同じ日に同じ科')).join(' / ')
                        : chk.warning;
                    if (warning) {
                        warns.push(`${roleLabel}: ${warning}`);
                        setLevel('warn');
                    }
                }
            }
        });
        return { blockingErrors, strongOverrideErrors, overrideErrors, warns, levels };
    }

    function updateModalState() {
        const issues = collectModalIssues();

        // Per-select display state
        for (const [role, sel] of Object.entries(els.selects)) {
            sel.classList.remove('has-warning', 'has-soft-warning');
            if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden')) continue;
            if (!sel.value) continue;
            const level = issues.levels[role];
            if (level === 'blocking' || level === 'strong') sel.classList.add('has-warning');
            else if (level === 'override' || level === 'warn') sel.classList.add('has-soft-warning');
        }

        // 規則に当たる割り当ては、注意を確認してチェックを付けると保存できる。注意の中身が変わったらチェックを外す
        const ackItems = [...issues.strongOverrideErrors, ...issues.overrideErrors];
        const needsAck = issues.blockingErrors.length === 0 && ackItems.length > 0;
        const ackKey = needsAck ? ackItems.join('\n') : '';
        if (ackKey !== modalOverrideAckKey) {
            els.overrideConfirmCheckbox.checked = false;
            modalOverrideAckKey = ackKey;
        }
        els.overrideConfirm.classList.toggle('hidden', !needsAck);
        els.overrideConfirm.classList.toggle('is-strong', issues.strongOverrideErrors.length > 0);
        els.saveAssignmentBtn.disabled = needsAck && !els.overrideConfirmCheckbox.checked;

        const ackNote = needsAck ? '（下のチェックを付けると保存できます）' : '';
        if (issues.blockingErrors.length || ackItems.length || issues.warns.length) {
            // 注意にはフォームの備考（回答者が書いた文字）が入るので、HTMLとして解釈させない（2026-11-14）
            const joinEscaped = items => items.map(escapeHtml).join('<br>');
            els.modalWarnings.innerHTML =
                (issues.blockingErrors.length ? `<div class="modal-error">❌ 保存不可<br>${joinEscaped(issues.blockingErrors)}</div>` : '') +
                (issues.strongOverrideErrors.length ? `<div class="modal-error">❗ 規則に当たります${ackNote}<br>${joinEscaped(issues.strongOverrideErrors)}</div>` : '') +
                (issues.overrideErrors.length ? `<div class="modal-warnings">⚠️ 一時許可できます${ackNote}<br>${joinEscaped(issues.overrideErrors)}</div>` : '') +
                (issues.warns.length ? `<div class="modal-warnings">⚠️ ${joinEscaped(issues.warns)}</div>` : '');
            els.modalWarnings.classList.remove('hidden');
        } else {
            els.modalWarnings.classList.add('hidden');
        }
    }

    function closeModal(options = {}) {
        const restoreFocus = options.restoreFocus !== false;
        els.modal.classList.add('hidden');
        els.modal.setAttribute('aria-hidden', 'true');
        if (restoreFocus && assignmentReturnFocus && assignmentReturnFocus.isConnected) assignmentReturnFocus.focus();
        assignmentReturnFocus = null;
    }

    function saveAssignment() {
        const issues = collectModalIssues();
        if (issues.blockingErrors.length > 0) {
            alert('保存できません。\n\n' + issues.blockingErrors.join('\n'));
            return;
        }
        const needsAck = issues.strongOverrideErrors.length > 0 || issues.overrideErrors.length > 0;
        if (needsAck && !els.overrideConfirmCheckbox.checked) {
            alert('規則に当たる割り当てがあります。\n注意を確認して「注意を確認したうえで保存する」にチェックを付けてから保存してください。');
            els.overrideConfirmCheckbox.focus();
            return;
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
        roles = ROLE_ORDER.filter(role => roles.includes(role) || isFixedSpecialDutyRole(editingDateStr, role));
        roles = roles.filter(role => !isFixedSpecialDutyRole(editingDateStr, role));
        if (isHol && isActiveFixedErDaySaturday(editingDateObj)) roles = roles.filter(r => r !== 'erDay');

        if (!state.shifts[editingDateStr]) state.shifts[editingDateStr] = {};
        // Clear all roles for this day then set active ones
        delete state.shifts[editingDateStr].wardDay;
        delete state.shifts[editingDateStr].wardNight;
        delete state.shifts[editingDateStr].erDay;
        delete state.shifts[editingDateStr].erNight;
        roles.forEach(r => {
            const group = els.selects[r].closest('.form-group');
            if (!group.classList.contains('hidden') && !els.selects[r].classList.contains('hidden') && els.selects[r].value) state.shifts[editingDateStr][r] = els.selects[r].value;
        });
        if (Object.keys(state.shifts[editingDateStr]).length === 0) delete state.shifts[editingDateStr];
        const savedDateStr = editingDateStr;
        saveData('割り付け保存');
        closeModal({ restoreFocus: false });
        renderCalendar();
        const refreshedDate = els.calendarGrid.querySelector(`[data-date="${savedDateStr}"]`);
        if (refreshedDate) refreshedDate.focus();
    }

    Object.values(els.selects).forEach(sc => sc.addEventListener('change', updateModalState));
    els.selectDayType.addEventListener('change', () => { updateModalRoles(); updateModalState(); });
    els.overrideConfirmCheckbox.addEventListener('change', updateModalState);
    els.closeModalBtn.addEventListener('click', closeModal);
    els.cancelAssignmentBtn.addEventListener('click', closeModal);
    els.saveAssignmentBtn.addEventListener('click', saveAssignment);
    els.modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', event => {
        const assignmentOpen = !els.modal.classList.contains('hidden');
        const syncSettingsOpen = !els.syncSettingsModal.classList.contains('hidden');
        const doctorSettingsOpen = isDoctorSettingsOpen();
        const formCreateOpen = isFormCreateOpen();
        if (event.key === 'Escape') {
            if (assignmentOpen) closeModal();
            else if (syncSettingsOpen) closeSyncSettings();
            else if (doctorSettingsOpen) closeDoctorSettings();
            else if (formCreateOpen) closeFormCreate();
            else {
                const actionsWereOpen = els.mobileActionsToggle && els.mobileActionsToggle.getAttribute('aria-expanded') === 'true';
                setMobileActionsOpen(false);
                if (actionsWereOpen) els.mobileActionsToggle.focus();
            }
            return;
        }
        if (event.key !== 'Tab' || (!assignmentOpen && !syncSettingsOpen && !doctorSettingsOpen && !formCreateOpen)) return;
        const activeModal = assignmentOpen ? els.modal
            : (syncSettingsOpen ? els.syncSettingsModal : (doctorSettingsOpen ? els.doctorSettingsModal : els.formCreateModal));
        const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
        // フォームの自動作成の画面は、隠れた部分（入力・結果）を含むので、見えている要素だけにする。リンクと開閉の見出しも含める（2026-11-15）
        const focusable = activeModal === els.formCreateModal
            ? Array.from(activeModal.querySelectorAll(`${focusableSelector}, summary, a[href]`))
                .filter(element => !element.closest('.hidden') && element.getClientRects().length > 0)
            : Array.from(activeModal.querySelectorAll(focusableSelector)).filter(element => !element.classList.contains('hidden'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    // ===== Auto Assign =====
    // 土日祝の病棟（土曜の病棟・日祝の病棟日中/夜間。固定表の日を含む）。自動割り振りで科の偏りを減らす対象（2026-11-09）
    function isHolidayWardSlot(dateObj, dateStr, role) {
        return (role === 'wardDay' || role === 'wardNight') &&
            (isHoliday(dateObj, dateStr) || isFixedSpecialDutyDate(dateStr));
    }
    function getHolidayWardDepartmentKey(doc) {
        return getDoctorDepartment(doc) || `doctor:${doc.id}`;
    }
    // 自動割り振りでその枠に入りうるか（大まかな条件だけで、不可日・回数などの規則は見ない）。病棟夜間は補充候補（6-7年目）を除く。
    function isRoughAutoAssignCandidate(doc, dateObj, dateStr, role) {
        if (!isAutoAssignableDoctor(doc, dateObj) || doc.holidayErDayPreferred) return false;
        if (!canAutoAssignFixedFemaleDoctor(doc, dateObj, role)) return false;
        if (role === 'wardDay') return canDoWardDayDoctor(doc);
        if (role === 'wardNight') return canDoWardNightDoctor(doc, dateObj, dateStr) && canDoWardNightPrimaryDoctor(doc, dateObj, dateStr);
        if (role === 'erNight') return canDoErNightDoctor(doc);
        return false;
    }
    // 救急日中を割り振った後に、その月の次の2つを数える。
    // - pool: 固定表以外の土日祝の病棟に自動で入れる先生の数（科ごと = 科の人数）。当直休止・在籍外・救急日直希望の先生と、
    //   その月に休日救急日中を担当する先生は数えない
    // - holidayWardOnlyIds: 土日祝の病棟にしか入れない先生（平日の病棟夜間・救急夜間に入らない部長、日曜病棟日中のみの女性医師など）
    function getHolidayWardDepartmentPlan(y, m, ld) {
        const idsByDepartment = {};
        const holidayWardIds = new Set();
        const otherSlotIds = new Set();
        for (let d = 1; d <= ld; d++) {
            const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
            getRequiredRoles(dObj, dStr).forEach(role => {
                if (role === 'erDay' || isFixedSpecialDutyRole(dStr, role)) return;
                const holidayWard = isHolidayWardSlot(dObj, dStr, role);
                state.doctors.forEach(doc => {
                    if (!isRoughAutoAssignCandidate(doc, dObj, dStr, role)) return;
                    if (!holidayWard) {
                        otherSlotIds.add(doc.id);
                        return;
                    }
                    if (hasErDayThisMonth(doc.id)) return;
                    holidayWardIds.add(doc.id);
                    const key = getHolidayWardDepartmentKey(doc);
                    if (!idsByDepartment[key]) idsByDepartment[key] = new Set();
                    idsByDepartment[key].add(doc.id);
                });
            });
        }
        const pool = {};
        Object.entries(idsByDepartment).forEach(([key, ids]) => { pool[key] = ids.size; });
        const holidayWardOnlyIds = new Set([...holidayWardIds].filter(id => !otherSlotIds.has(id)));
        return { pool, holidayWardOnlyIds };
    }
    // その月の土日祝の病棟の担当数を科ごとに数える（手で入れた分・固定表の分を含む）
    function getHolidayWardDepartmentCounts(y, m, ld) {
        const counts = {};
        const addDoctor = doctorId => {
            const doc = state.doctors.find(d => d.id === doctorId);
            if (!doc) return;
            const key = getHolidayWardDepartmentKey(doc);
            counts[key] = (counts[key] || 0) + 1;
        };
        for (let d = 1; d <= ld; d++) {
            const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
            if (!isHoliday(dObj, dStr) && !isFixedSpecialDutyDate(dStr)) continue;
            const dayShifts = state.shifts[dStr] || {};
            ['wardDay', 'wardNight'].forEach(role => {
                if (isFixedSpecialDutyRole(dStr, role)) getFixedDutyDoctorIds(dStr, role).forEach(addDoctor);
                else if (dayShifts[role]) addDoctor(dayShifts[role]);
            });
        }
        return counts;
    }
    // 点数順に並べた候補のうち、最良の点数との差が HOLIDAY_WARD_DEPARTMENT_BALANCE_SCORE_BAND 以内の先生から、次の順で選ぶ。
    // 1. 土日祝の病棟にしか入れず、今月まだ0回の先生（月1回を優先するため）
    // 2. 科の人数に対して今月の土日祝の病棟が少ない科の先生（(担当数 + 0.5) / 人数 が小さい科）
    // 3. 点数の良い先生
    function pickHolidayWardBalancedCandidate(sortedCandidates, plan, departmentCounts) {
        const bestScore = sortedCandidates[0].score;
        const getRank = doc => (plan.holidayWardOnlyIds.has(doc.id) && getDoctorMonthlyCount(doc.id) === 0) ? 0 : 1;
        const getLoad = doc => {
            const key = getHolidayWardDepartmentKey(doc);
            return ((departmentCounts[key] || 0) + 0.5) / Math.max(1, plan.pool[key] || 0);
        };
        let chosen = sortedCandidates[0];
        let chosenRank = getRank(chosen.doc);
        let chosenLoad = getLoad(chosen.doc);
        sortedCandidates.forEach(candidate => {
            if (candidate.score > bestScore + HOLIDAY_WARD_DEPARTMENT_BALANCE_SCORE_BAND) return;
            const rank = getRank(candidate.doc);
            const load = getLoad(candidate.doc);
            if (rank < chosenRank || (rank === chosenRank && load < chosenLoad - 1e-9)) {
                chosen = candidate;
                chosenRank = rank;
                chosenLoad = load;
            }
        });
        return chosen.doc;
    }

    function scoreDoctorForAutoAssign(doc, dateStr, role) {
        const count = getDoctorMonthlyCount(doc.id);
        const dateObj = new Date(dateStr);
        const weekend = isWeekendDate(dateObj);
        const isSunday = dateObj.getDay() === 0;
        const isHolidaySlot = isHoliday(dateObj, dateStr);
        const fiscalStats = getDoctorFiscalYearDutyStats(doc.id);
        const monthlyTarget = getMonthlyDutyTarget(doc);
        let score = count === 0
            ? 0
            : count * 1000000 + (GROUP_PRIORITY[doc.group] || 0) * 10000;

        if (monthlyTarget > 1 && count < monthlyTarget) score -= (monthlyTarget - count) * 2250000;
        if (count === 0 && isIwataPreferredRole(doc, role, dateObj, dateStr)) score -= 450000;
        score += fiscalStats.total * 25000;
        if (isHolidaySlot) score += fiscalStats.holiday * 35000;
        if (needsFormNonResponderDuty(doc)) score -= 500000;
        if (role === 'erNight' && isPriorityErNightDoctor(doc)) score -= 50000;
        if (role === 'erDay' && isFallbackErDayCandidate(doc, dateObj, dateStr)) score += 3000000;
        if (isWardDutyPriorityDoctor(doc) && (role === 'wardDay' || role === 'wardNight')) score -= 120000;
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

        const formData = getDoctorFormDataForDate(doc, dateStr);
        if ((formData.ngDates2 || []).includes(dateStr)) score += 60000;
        else if ((formData.ngDates3 || []).includes(dateStr)) score += 30000;

        score += Math.random() * 100;
        return score;
    }

    function getAssignableErDayDates(y, m, ld) {
        const dates = [];
        for (let d = 1; d <= ld; d++) {
            const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
            if (!isHoliday(dObj, dStr)) continue;
            if (isActiveFixedErDaySaturday(dObj)) continue; // 第1・第3土曜は救急医固定（9/19-9/23は例外）
            if (isFixedSpecialDutyRole(dStr, 'erDay')) continue;
            dates.push({ dObj, dStr });
        }
        return dates;
    }

    function assignRegularErDayForNonResponders(erDayDates) {
        let made = 0;
        erDayDates.forEach(({ dObj, dStr }) => {
            if (!state.shifts[dStr]) state.shifts[dStr] = {};
            if (state.shifts[dStr].erDay) return;

	            let candidates = state.doctors.filter(doc => {
                    if (!isAutoAssignableDoctor(doc, dObj)) return false;
	                if (!needsFormNonResponderDuty(doc)) return false;
	                if (!doc.holidayErDayPreferred && !canDoErDaySpecialDoctor(doc, dObj, dStr)) return false;
	                if (!canAutoAssignFixedFemaleDoctor(doc, dObj, 'erDay')) return false;
	                const chk = checkAssignmentRule(doc.id, 'erDay', dObj);
	                return chk.valid;
            }).map(doc => ({
                doc,
                score: scoreDoctorForAutoAssign(doc, dStr, 'erDay')
            }));
            const preferredCandidates = preferDifferentDepartmentCandidates(
                candidates.map(candidate => candidate.doc),
                dStr,
                'erDay'
            );
            const preferredIds = new Set(preferredCandidates.map(doc => doc.id));
            candidates = candidates
                .filter(candidate => preferredIds.has(candidate.doc.id))
                .sort((a, b) => a.score - b.score);

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

	            let candidates = state.doctors.filter(doc => {
                    if (!isAutoAssignableDoctor(doc, dObj)) return false;
	                if (!doc.holidayErDayPreferred && !canDoErDaySpecialDoctor(doc, dObj, dStr)) return false;
	                if (!canAutoAssignFixedFemaleDoctor(doc, dObj, 'erDay')) return false;
	                if (getDoctorPreferenceRank(doc, dStr) !== preferenceRank) return false;
	                const chk = checkAssignmentRule(doc.id, 'erDay', dObj);
                return chk.valid;
            }).map(doc => ({
                doc,
                score: scoreDoctorForAutoAssign(doc, dStr, 'erDay')
            }));
            const preferredCandidates = preferDifferentDepartmentCandidates(
                candidates.map(candidate => candidate.doc),
                dStr,
                'erDay'
            );
            const preferredIds = new Set(preferredCandidates.map(doc => doc.id));
            candidates = candidates
                .filter(candidate => preferredIds.has(candidate.doc.id))
                .sort((a, b) => a.score - b.score);

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

	            let candidates = state.doctors.filter(doc => {
                    if (!isAutoAssignableDoctor(doc, dObj)) return false;
	                if (!doc.holidayErDayPreferred && !canDoErDaySpecialDoctor(doc, dObj, dStr)) return false;
	                if (!canAutoAssignFixedFemaleDoctor(doc, dObj, 'erDay')) return false;
	                if (getDoctorPreferenceRank(doc, dStr) !== 0) return false;
	                const chk = checkAssignmentRule(doc.id, 'erDay', dObj);
                return chk.valid;
            }).map(doc => ({
                doc,
                score: scoreDoctorForAutoAssign(doc, dStr, 'erDay')
            }));
            const preferredCandidates = preferDifferentDepartmentCandidates(
                candidates.map(candidate => candidate.doc),
                dStr,
                'erDay'
            );
            const preferredIds = new Set(preferredCandidates.map(doc => doc.id));
            candidates = candidates
                .filter(candidate => preferredIds.has(candidate.doc.id))
                .sort((a, b) => a.score - b.score);

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
            for (const avoidSameDepartment of [true, false]) {
                if (assigned) break;
                for (const allowSingleReplacement of [false, true]) {
                    if (assigned) break;
                    for (let d = 1; d <= ld && !assigned; d++) {
                        const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
                        const roles = getRequiredRoles(dObj, dStr);
                        if (!state.shifts[dStr]) state.shifts[dStr] = {};

                        for (const role of roles) {
                            if (isFixedSpecialDutyRole(dStr, role)) continue;
                            if (role === 'erDay' && isActiveFixedErDaySaturday(dObj)) continue;
                            // 救急日中可の医師は、自動では休日救急日中だけに入れる（「病棟夜間も可」「この月は病棟当直も可」は手動のみ。2026-11-16）
                            if (doc.holidayErDayPreferred && role !== 'erDay') continue;
                            // 「病棟夜間も可」だけで病棟夜間に入れる医師は、自動割り振りでは使わない
                            if (role === 'wardNight' && !canDoWardNightDoctor(doc, dObj, dStr)) continue;
                            const currentId = state.shifts[dStr][role];
                            if (currentId === doc.id) { assigned = true; break; }
                            if (!canReplaceSlotForNonResponder(currentId, allowSingleReplacement)) continue;

                            const original = currentId || null;
                            if (original) delete state.shifts[dStr][role];
                            if (getAssignedDoctorIdsForDate(dStr, role).includes(doc.id)) {
                                if (original) state.shifts[dStr][role] = original;
                                continue;
                            }
                            if (avoidSameDepartment && hasSameDepartmentAssignmentForDate(doc, dStr, role)) {
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
	            '・通常医師は月1回を優先し、以降も回数が平等になるよう優先\n' +
	            '・救急日直希望○は固定枠以外の休日救急日中のみ\n' +
	            '・シルバーウィーク・年末年始の固定表は表示と回数に反映し、自動割り振りでは上書きしません\n' +
	            '・フォーム未回答者は月1回を最優先します\n' +
	            '・年度内（4月〜翌3月）の総当直回数が少ない医師を優先します\n' +
	            '・土日祝枠では年度内の土日祝回数が少ない医師を優先します\n' +
	            '・全員1回後の残枠は、月内回数の少ない医師を優先\n' +
	            '・救急日中は第一希望を全体優先→第二希望→通常候補\n' +
	            '・NG第1/第2/第3希望は禁止\n' +
	            '・連続当直 / 同一週2回は禁止\n' +
	            '・前月最終週と翌月第一週の休日を同じ医師が連続して担当するのは禁止\n' +
	            '・同じ日は、可能な限り異なる科の医師を割り当てます\n' +
	            '・土日祝の病棟（土曜の病棟・日祝の病棟日中/夜間）は平日より先に割り振り、科の人数に応じた割合に近づくよう、偏っている科の先生を後回しにします（土日祝の病棟にしか入れない先生の月1回目を先に確保します）\n' +
	            '・月4回以上は不可（最大3回まで）\n' +
	            `・土日祝は月${HOLIDAY_DUTY_MONTHLY_LIMIT}回まで（個別設定で「休日上限の緩和」を付けた医師は月${RELAXED_HOLIDAY_DUTY_MONTHLY_LIMIT}回まで）\n` +
	            '・「休日上限の緩和」の医師も、休日救急日中の月1回・同じ月の他枠不可は自動割り振りでは守ります\n' +
	            '・自動割り振りはこれらの規則を守ります。手動では、規則に当たっても注意を確認してチェックを付ければ保存できます（同じ日に同じ先生は不可）\n' +
	            '・個別設定で「当直休止」を付けた医師は、自動割り振りの対象から外します\n' +
	            '・個別設定の「病棟夜間も可」「この月は病棟当直も可」は手動選択用です。自動割り振りでは使いません\n' +
	            '・固定不可曜日は不可\n' +
	            '・土曜は病棟1枠 + 救急日中/夜間の3枠です\n' +
            '・病棟夜間が不足する場合は6-7年目も補充候補にします\n' +
            '・非循環器の部長/副部長は土日を優先します\n' +
            '・固定女性医師8名は原則、日曜病棟日中のみ優先します\n' +
            '・吉井先生は日曜病棟日中のみ担当します\n' +
	            '・岸先生は救急夜間枠と病棟当直枠に候補として入れます\n' +
		            '・山口先生は救急日直ではなく病棟当直を優先します\n' +
		            '・循環器内科は自動割り振りでは月2回までにします（小澤先生・岩田先生は月1回、手動例外可）\n' +
		            '・山口先生は自動割り振りでは病棟当直月1回までにします（手動例外可）\n' +
		            '・吉田也恵先生は固定女性医師ルールから外し、日中枠には入れません\n' +
			            '・久保山先生は土曜救急日中の候補にします（第1・第3土曜は固定）\n' +
			            '・椿先生は当直除外メンバーとして自動候補から外します\n' +
			            '・小澤牧人先生は金曜病棟当直のみ、月1回まで候補にします\n' +
			            '・南部先生は月3回を目標に優先します（最大3回まで）\n' +
			            '・岩田先生は循環器月1回を優先し、平日・土日祝の病棟当直に候補を絞ります\n' +
			            '・8月以降の土日救急日中は岸先生・古田先生・梁間先生・上野峻輔先生・近藤先生も候補にします（元の救急日中候補を優先）\n' +
			            '・松岡 里紗先生は手動選択のみで、自動割り振りには入れません\n' +
		            '・平日病棟に入る部長は個別指定者のみです\n' +
                    '・福嶌愛先生・前田晃宏先生は2026年10月から救急夜間のみです\n' +
                    '・蘆田健毅先生は2026年10月から木曜日の病棟夜間のみです\n' +
                    '・西岡唯先生・藤本健太郎先生は2026年10月以降、候補外です\n' +
                    '・松本大典先生は2026年11月以降、候補外です\n' +
                    '・箱谷先生は2026年11月以降、一覧と候補から外します\n' +
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
        // 先に土日祝の病棟を日付順に、次に残りの枠（平日の病棟夜間・救急夜間）を日付順に割り振る（2026-11-09）。
        // 土日祝の病棟は科の人数に応じた割合に近づける。平日を先に割り振ると、人数の少ない科の先生が平日で月1回目を使い、
        // 土日祝に回せる先生が残らないため。
        const holidayWardPlan = getHolidayWardDepartmentPlan(y, m, ld);
        for (const holidayWardPhase of [true, false]) {
            for (let d = 1; d <= ld; d++) {
                const dObj = new Date(y, m, d), dStr = formatDateStr(dObj);
                const roles = getRequiredRoles(dObj, dStr)
                    .filter(r => r !== 'erDay' && isHolidayWardSlot(dObj, dStr, r) === holidayWardPhase);
                if (!state.shifts[dStr]) state.shifts[dStr] = {};
                if (roles.length === 0) continue;
                const assignedToday = new Set(getAssignedDoctorIdsForDate(dStr));

                for (const role of roles) {
                    if (isFixedSpecialDutyRole(dStr, role)) continue;
                    if (state.shifts[dStr][role]) continue;

                    let candidates = state.doctors.filter(doc => {
                        if (!isAutoAssignableDoctor(doc, dObj)) return false;
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

                    candidates = preferDifferentDepartmentCandidates(candidates, dStr, role);

                    if (candidates.length === 0) { skipped++; continue; }

                    candidates = candidates.map(doc => {
                        return { doc, score: scoreDoctorForAutoAssign(doc, dStr, role) };
                    }).sort((a, b) => a.score - b.score);

                    const chosen = holidayWardPhase
                        ? pickHolidayWardBalancedCandidate(candidates, holidayWardPlan, getHolidayWardDepartmentCounts(y, m, ld))
                        : candidates[0].doc;
                    state.shifts[dStr][role] = chosen.id;
                    assignedToday.add(chosen.id);
                    made++;
                }
            }
        }

        const nonResponderFix = tryAssignZeroNonResponders(y, m, ld);
        made += nonResponderFix.made;

        saveLocalOnlyData('自動割り振り');
        renderCalendar();
        let msg = `${made}件割り当てました。`;
        if (skipped > 0) msg += `\n⚠️ ${skipped}枠は条件を満たす医師がおらず未割り当てです。`;
        const unassignedDoctors = state.doctors.filter(doc =>
            isDoctorActiveInMonth(doc) && !isDutyPausedDoctor(doc) && getDoctorMonthlyCount(doc.id) === 0
        );
        if (unassignedDoctors.length > 0) {
            const names = unassignedDoctors.map(d => d.name).join('、');
            msg += `\n⚠️ 月1回未達の通常医師: ${unassignedDoctors.length}名\n${names}`;
        }
        const unassignedNonResponders = nonResponderFix.stillUnassigned.filter(doc => getDoctorMonthlyCount(doc.id) === 0);
        if (unassignedNonResponders.length > 0) {
            msg += `\n⚠️ フォーム未回答で月1回未達: ${unassignedNonResponders.length}名\n${unassignedNonResponders.map(d => d.name).join('、')}`;
        }
        const noteAssigned = state.doctors.filter(doc =>
            isDoctorActiveInMonth(doc) &&
            getDoctorFormDataForMonth(doc).notes &&
            getDoctorMonthlyCount(doc.id) > 0
        );
        if (noteAssigned.length > 0) {
            msg += `\n⚠️ 備考ありの割り当てがあります。カレンダーの警告を確認してください。`;
        }
        if (isSharedSyncEnabled()) {
            msg += '\n\n共有保存はまだしていません。内容を確認してから、画面上部の「共有保存」を押してください。';
        }
        alert(msg);
    });

	    // ===== Excel Export =====
		    els.exportExcelBtn.addEventListener('click', () => {
		        if (typeof XLSX === 'undefined') return alert('ライブラリ読み込み中です。少々お待ちを。');
		        const y = state.currentDate.getFullYear(), m = state.currentDate.getMonth();
		        const ld = new Date(y, m + 1, 0).getDate();
		        const wb = XLSX.utils.book_new();
		        const n = id => findDoctorName(id) || '';
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
	            const namesForRole = role => {
	                const fixedNames = getFixedDutyDisplayNames(dStr, role);
	                if (fixedNames.length > 0) return fixedNames;
	                if (role === 'erDay' && isActiveFixedErDaySaturday(dObj)) return ['固定'];
	                return shifts[role] ? [n(shifts[role])] : [];
	            };
	            const wardDayNames = namesForRole('wardDay');
	            const wardNightNames = namesForRole('wardNight');
	            const erDayNames = namesForRole('erDay');
	            const erNightNames = namesForRole('erNight');
	            const wardDayText = wardDayNames.join('・');
	            const wardNightText = wardNightNames.join('・');
	            const erDayText = erDayNames.join('・');
	            const erNightText = erNightNames.join('・');

	            if (mode === 'ward') {
	                if (isSaturdayHoliday) {
	                    if (wardNightText) lines.push(wardNightText);
	                } else if (isHol) {
	                    if (wardDayText) lines.push(`日 ${wardDayText}`);
	                    if (wardNightText) lines.push(`夜 ${wardNightText}`);
	                } else {
	                    if (wardDayText) lines.push(`日 ${wardDayText}`);
	                    if (wardNightText) lines.push(wardNightText);
	                }
	            } else if (mode === 'er') {
	                if (isHol) {
	                    if (erDayText) lines.push(`日 ${erDayText}`);
	                    if (erNightText) lines.push(`夜 ${erNightText}`);
	                } else {
	                    if (erDayText) lines.push(`日 ${erDayText}`);
	                    if (erNightText) lines.push(erNightText);
	                }
	            } else {
	                if (isSaturdayHoliday) {
	                    if (wardNightText) lines.push(`病 ${wardNightText}`);
	                    if (erDayText) lines.push(`救日 ${erDayText}`);
	                    if (erNightText) lines.push(`救夜 ${erNightText}`);
	                } else if (isHol) {
	                    if (wardDayText) lines.push(`病日 ${wardDayText}`);
	                    if (wardNightText) lines.push(`病夜 ${wardNightText}`);
	                    if (erDayText) lines.push(`救日 ${erDayText}`);
	                    if (erNightText) lines.push(`救夜 ${erNightText}`);
	                } else {
	                    if (wardDayText) lines.push(`病日 ${wardDayText}`);
	                    if (wardNightText) lines.push(`病 ${wardNightText}`);
	                    if (erDayText) lines.push(`救日 ${erDayText}`);
	                    if (erNightText) lines.push(`救 ${erNightText}`);
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
		            ws['!cols'] = Array(7).fill({ wch: mode === 'all' ? 24 : 20 });
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
        // 古い公開のURLのままの端末は、ここで新しい公開へ替える（読めなければ替えない。2026-11-15）
        try {
            await moveSharedEndpointIfNeeded();
        } catch (err) {
            console.warn('Shared endpoint move error', err);
        }
        renderSyncStatusFromMeta();
        const loadedShared = await loadSharedData({ silent: true });
        if (state.doctors.length === 0) {
            state.doctors = buildDefaultDoctors();
            saveData('初期医師マスタ作成');
        } else if (ensureRequiredExtraDoctors().length > 0) {
            saveLocalOnlyData('新規医師マスタ追加');
        } else if (!loadedShared) {
            saveLocalData();
        }
        renderDoctors();
        renderCalendar();
    }
    init();
});
