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
    const MONTHLY_DUTY_TARGET_BY_NAME = {
        '南部 海': 3
    };
    const REQUIRED_EXTRA_DOCTOR_NAMES = new Set([
        '小澤牧人',
        '松岡 里紗'
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
        '2026-12-29': { erDay: ['今中 友香'], wardDay: ['吉井 直子', '大谷賢一郎'], wardNight: ['吉田竜太郎'] },
        '2026-12-30': { erDay: ['梁間 敢'], wardDay: ['西島 正剛', '田中 康史'], wardNight: ['近藤 和也'] },
        '2026-12-31': { erDay: ['三木 秀晃'], wardDay: ['佐々木 諭', '松本 大典'], wardNight: ['黒川 晟'] },
        '2027-01-01': { erDay: ['古田 寛人'], wardDay: ['藤田 光一', '山口星一郎'], wardNight: ['上野 峻輔'] },
        '2027-01-02': { erDay: ['焦 圭裕'], wardDay: ['金 容壱', '水本 綾'], wardNight: ['竹重 遼'] },
        '2027-01-03': { erDay: ['救急医'], wardDay: ['岩根 成豪', '北村 泰明'], wardNight: ['丹羽諒太郎'] }
    };

    // テンプレートv2「01_医師マスタ」時間外対応=〇 の56名 + 新規/臨時2名
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
        { name: '山口星一郎', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['火'] },
        { name: '岸 具宏', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['月', '水'] },
        { name: '椿 遥花', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '渡邊 有史', group: '副医長', holidayErDayPreferred: false, outpatientDays: ['木'] },
        { name: '箱谷 聡', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
        { name: '西岡 唯', group: '3-5年目', holidayErDayPreferred: false, outpatientDays: [] },
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
    function normalizeDoctorMatchName(n) { return normalizeName(n).replace(/\s+/g, ''); }
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
    function isAutoAssignableDoctor(doc) {
        return !isDutyExcludedDoctor(doc) && !isManualOnlyDoctor(doc);
    }
    function isYoshidaYaeDoctor(doc) {
        return normalizeName(doc.name) === '吉田 也恵';
    }
    function isIwataYukiyoDoctor(doc) {
        return normalizeName(doc.name) === '岩田 幸代';
    }
    function isIwataPreferredRole(doc, role, dateObj, dateStr) {
        if (!isIwataYukiyoDoctor(doc)) return false;
        if (role === 'erDay') return true;
        return role === 'wardNight' && dateObj && !isHoliday(dateObj, dateStr);
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
        return !isIwataYukiyoDoctor(doc) && !isFridayWardOnlyDoctor(doc) && isSeniorGroup(doc.group) && !isPriorityErNightDoctor(doc);
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
        if (isFridayWardOnlyDoctor(doc)) return !!(dateObj && dateObj.getDay() === 5);
        return canDoWardNightPrimaryDoctor(doc, dateObj, dateStr) || canDoWardNightBackupDoctor(doc);
    }
    function canDoErNightDoctor(doc) {
        return !isFridayWardOnlyDoctor(doc) && (isJunior(doc.group) || isPriorityErNightDoctor(doc));
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
        if (isWardDutyPriorityDoctor(doc)) holidayErDayPreferred = false;
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

    function migrateFormResponseRecord(record) {
        const preferredDates1 = Array.isArray(record && record.preferredDates1) ? record.preferredDates1 : [];
        const preferredDates2 = Array.isArray(record && record.preferredDates2) ? record.preferredDates2 : [];
        return {
            doctorName: (record && record.doctorName) || '',
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
            Object.entries((snapshot && snapshot.responses) || {}).forEach(([nameKey, record]) => {
                responses[nameKey] = migrateFormResponseRecord(record);
            });
            out[monthKey] = {
                importedAt: (snapshot && snapshot.importedAt) || '',
                responders: Array.isArray(snapshot && snapshot.responders) ? snapshot.responders : [],
                duplicateNames: Array.isArray(snapshot && snapshot.duplicateNames) ? snapshot.duplicateNames : [],
                notFound: Array.isArray(snapshot && snapshot.notFound) ? snapshot.notFound : [],
                responses
            };
        }
        return out;
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

    const STORAGE_KEYS = {
        doctors: 'doctors',
        shifts: 'shifts',
        specialDayRules: 'specialDayRules',
        savedMonths: 'savedMonths',
        formResponseStatus: 'formResponseStatus',
        formResponsesByMonth: 'formResponsesByMonth',
        syncConfig: 'sharedSaveConfig',
        syncClientId: 'sharedSaveClientId',
        syncRemoteMeta: 'sharedSaveRemoteMeta'
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
        const formResponseStatus = readStoredJson(STORAGE_KEYS.formResponseStatus, {}) || {};
        const storedMonthlyResponses = migrateFormResponsesByMonth(readStoredJson(STORAGE_KEYS.formResponsesByMonth, {}) || {});
        return {
            doctors,
            shifts: migrateShifts(readStoredJson(STORAGE_KEYS.shifts, {}) || {}),
            specialDayRules: readStoredJson(STORAGE_KEYS.specialDayRules, {}) || {},
            savedMonths: migrateSavedMonths(readStoredJson(STORAGE_KEYS.savedMonths, {}) || {}),
            formResponseStatus,
            formResponsesByMonth: Object.keys(storedMonthlyResponses).length > 0
                ? storedMonthlyResponses
                : buildLegacyMonthlyFormResponses(doctors, formResponseStatus)
        };
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

    function ensureRequiredExtraDoctors() {
        let changed = false;
        REQUIRED_EXTRA_DOCTOR_NAMES.forEach(name => {
            const exists = state.doctors.some(doc => normalizeDoctorMatchName(doc.name) === normalizeDoctorMatchName(name));
            if (exists) return;
            const defaultDoctor = DEFAULT_DOCTORS.find(doc => normalizeDoctorMatchName(doc.name) === normalizeDoctorMatchName(name));
            if (!defaultDoctor) return;
            state.doctors.push(buildDoctorFromDefault(defaultDoctor));
            changed = true;
        });
        return changed;
    }

    const syncState = {
        config: normalizeSyncConfig(readStoredJson(STORAGE_KEYS.syncConfig, {})),
        clientId: localStorage.getItem(STORAGE_KEYS.syncClientId) || generateId(),
        remoteMeta: readStoredJson(STORAGE_KEYS.syncRemoteMeta, { revision: '', updatedAt: '', updatedBy: '' }) || {},
        saveTimer: null,
        saveInFlight: false,
        saveQueued: false,
        queuedReason: '',
        lastConflictRevision: ''
    };
    localStorage.setItem(STORAGE_KEYS.syncClientId, syncState.clientId);

    // ===== DOM References =====
	    const els = {
	        currentMonthDisplay: document.getElementById('current-month-display'),
	        prevMonthBtn: document.getElementById('prev-month'),
	        nextMonthBtn: document.getElementById('next-month'),
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
        clearCurrentMonthBtn: document.getElementById('clear-current-month-btn'),
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
        state.formResponseStatus = snapshot.formResponseStatus || {};
        state.formResponsesByMonth = migrateFormResponsesByMonth(snapshot.formResponsesByMonth || {});
    }

    function saveLocalData() {
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
            saved: message || '共有保存済',
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
            updated ? `共有保存済 ${updated}` : '共有接続中',
            by ? `最終更新: ${updated} / ${by}` : '共有保存に接続しています'
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

    function requestSharedJsonp(params, timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            if (!isSharedSyncEnabled()) {
                reject(new Error('共有保存が設定されていません。'));
                return;
            }
            const callbackName = `__dutySync_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            const script = document.createElement('script');
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
                reject(new Error('共有保存に接続できませんでした。'));
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

    function handleSharedConflict(meta) {
        const revision = String((meta && meta.revision) || '');
        const previousConflictRevision = syncState.lastConflictRevision;
        syncState.lastConflictRevision = revision || syncState.lastConflictRevision;
        const updated = formatSyncTime(meta && meta.updatedAt);
        const by = (meta && meta.updatedBy) || '他の利用者';
        updateSyncStatus('conflict', '', `先に共有更新があります: ${updated} / ${by}`);
        if (revision && previousConflictRevision === revision) return;
        alert(`他の利用者が先に共有保存しました。\n\n共有保存は中断しました。必要に応じて「共有読込」で最新状態を確認してください。\n最終更新: ${updated || '不明'} / ${by}`);
    }

    async function saveSharedData(reason) {
        if (!isSharedSyncEnabled()) return;
        if (syncState.saveInFlight) {
            syncState.saveQueued = true;
            syncState.queuedReason = reason || syncState.queuedReason || '変更';
            return;
        }
        syncState.saveInFlight = true;
        updateSyncStatus('syncing');
        try {
            const meta = await requestSharedJsonp({ action: 'meta' });
            const remoteRevision = meta.empty ? '' : String(meta.revision || '');
            const localRevision = String((syncState.remoteMeta && syncState.remoteMeta.revision) || '');
            if (remoteRevision && remoteRevision !== localRevision) {
                handleSharedConflict(meta);
                return;
            }

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
            } else if (!nextMeta.empty && newRevisionNumber > oldRevisionNumber) {
                handleSharedConflict(nextMeta);
            } else {
                throw new Error(nextMeta.lastError || '共有保存の完了確認ができませんでした。');
            }
        } catch (err) {
            console.warn('Shared save error', err);
            updateSyncStatus('error', '', err && err.message ? err.message : '共有保存でエラーが発生しました。');
        } finally {
            syncState.saveInFlight = false;
            if (syncState.saveQueued) {
                const queuedReason = syncState.queuedReason || '変更';
                syncState.saveQueued = false;
                syncState.queuedReason = '';
                scheduleSharedSave(queuedReason);
            }
        }
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
            saveRemoteMeta();
            saveLocalData();
            renderDoctors();
            renderCalendar();
            renderSyncStatusFromMeta();
            if (addedRequiredDoctors) {
                updateSyncStatus('local-changed', '未共有変更あり', '新規医師マスタ追加はこの端末に保存済みです。共有するには「共有保存」を押してください。');
            }
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
        els.syncEndpointUrl.value = syncState.config.endpoint || '';
        els.syncAppKey.value = syncState.config.appKey || '';
        els.syncUserName.value = syncState.config.userName || '';
        els.syncSettingsModal.classList.remove('hidden');
    }

    function closeSyncSettings() {
        els.syncSettingsModal.classList.add('hidden');
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
        closeSyncSettings();
        renderSyncStatusFromMeta();
        if (isSharedSyncEnabled()) loadSharedData({ silent: false });
    }

    function disableSyncSettings() {
        if (!confirm('共有保存を無効化しますか？\nこの端末のローカル保存データは残ります。')) return;
        syncState.config = normalizeSyncConfig({});
        syncState.remoteMeta = { revision: '', updatedAt: '', updatedBy: '' };
        writeStoredJson(STORAGE_KEYS.syncConfig, syncState.config);
        saveRemoteMeta();
        closeSyncSettings();
        updateSyncStatus('local');
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
        if (isDutyExcludedDoctor(doc) || isManualOnlyDoctor(doc)) return false;
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
            role === 'erDay'
        ) > 0;
    }

    function isWeekendDate(dateObj) {
        const day = dateObj.getDay();
        return day === 0 || day === 6;
    }

    function isHolidayDutyDate(dateObj, dateStr) {
        return isHoliday(dateObj, dateStr) || isFixedSpecialDutyDate(dateStr);
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
        return [
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
            '岩田先生は平日病棟当直または救急日直のみ可能です',
            '固定不可曜日',
            '翌日が外来です',
            '不可日(第1希望)です',
            '不可日(第2希望)です',
            '不可日(第3希望)です',
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
        const manualOnly = isManualOnlyDoctor(doctor);
        const monthlyCount = getDoctorMonthlyCount(doctorId, dateStr);
        const cardiologyMonthlyLimit = getCardiologyMonthlyLimit(doctor);
        if (monthlyCount >= 3) errs.push('月3回が上限です');
        if (isDutyExcludedDoctor(doctor)) errs.push('当直除外メンバーです');
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
            errs.push('岩田先生は平日病棟当直または救急日直のみ可能です');
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
                if (erDayCount >= 1) errs.push('休日救急日中は月1回が上限です');
                // Exclusivity: has other shifts this month?
                if (hasNonErDayThisMonth(doctorId, dateStr)) errs.push('今月他の当直枠があるため休日救急日中に割り当てられません');
            } else if (role === 'erNight') {
                if (!canDoErNightDoctor(doctor)) errs.push('救急夜間は7年目以下、または岸先生のみ担当可能です');
            } else if (role === 'wardDay') {
                if (isPriorityErNightDoctor(doctor)) errs.push('岸先生は救急夜間または病棟当直のみ担当可能です');
                else if (!canDoWardDayDoctor(doctor)) errs.push('病棟は8年目以上のみ担当可能です');
            } else if (role === 'wardNight') {
                if (!canDoWardNightDoctor(doctor, dateObj, dateStr)) {
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

        if (isHolidayDutyDate(dateObj, dateStr) && getHolidayDutyCount(doctorId, dateStr) >= HOLIDAY_DUTY_MONTHLY_LIMIT) {
            errs.push(`土日祝は月${HOLIDAY_DUTY_MONTHLY_LIMIT}回が上限です`);
        }

        // 救急日直希望○の通常医師は、救急医固定以外の休日救急日中のみ担当
        if (doctor.holidayErDayPreferred && role !== 'erDay') {
            errs.push('救急日直希望○のため、救急日中以外には割り当て不可です');
        }

        // Month exclusivity reverse: has erDay this month → can't do other roles
        if (!manualOnly && role !== 'erDay' && hasErDayThisMonth(doctorId, dateStr)) {
            errs.push('今月休日救急日中を担当済みのため、他枠への割り当て不可です');
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

        // 5. Same week 2x
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

        // 6. Same-day duplicate (against saved state)
        if (getAssignedDoctorIdsForDate(dateStr, role).includes(doctorId)) {
            errs.push('同日の別枠に割り当て済みです');
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

    function removeDoctor(id) {
        if (!confirm('削除しますか？')) return;
        state.doctors = state.doctors.filter(d => d.id !== id);
        for (const date in state.shifts) {
            for (const role in state.shifts[date]) {
                if (state.shifts[date][role] === id) delete state.shifts[date][role];
            }
            if (Object.keys(state.shifts[date]).length === 0) delete state.shifts[date];
        }
        saveData('医師削除'); renderDoctors(); renderCalendar();
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

        const monthKey = getCurrentMonthKey();
        const responses = {};
        latestByName.forEach(({ doc, row }, normalizedName) => {
            const preferredDates1 = parseImportDateList(row.preferred1, y, m);
            const preferredDates2 = parseImportDateList(row.preferred2, y, m);
            responses[normalizedName] = {
                doctorName: doc.name,
                preferredDates1,
                preferredDates2,
                preferredDates: [...new Set([...preferredDates1, ...preferredDates2])],
                ngDates1: parseImportDateList(row.ng1, y, m),
                ngDates2: parseImportDateList(row.ng2, y, m),
                ngDates3: parseImportDateList(row.ng3, y, m),
                notes: cleanImportCell(row.notes)
            };
        });

        const duplicateNames = [...responseCounts.entries()]
            .filter(([, count]) => count > 1)
            .map(([name]) => name);
        const responders = [...latestByName.values()].map(({ doc }) => doc.name);
        const responderSet = new Set(responders.map(normalizeDoctorMatchName));
        const missingDoctors = state.doctors.filter(doc =>
            !isDutyExcludedDoctor(doc) &&
            !isManualOnlyDoctor(doc) &&
            !responderSet.has(normalizeDoctorMatchName(doc.name))
        );
        state.formResponsesByMonth[monthKey] = {
            importedAt: new Date().toISOString(),
            responders,
            duplicateNames,
            notFound,
            responses
        };
        state.formResponseStatus[monthKey] = {
            importedAt: state.formResponsesByMonth[monthKey].importedAt,
            responders,
            duplicateNames,
            notFound
        };

        return {
            monthKey,
            updated: latestByName.size,
            duplicateNames,
            notFound,
            missingDoctors
        };
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
        if (state.doctors.length === 0) {
            els.doctorList.innerHTML = '<li class="doctor-item" style="color:#aaa;">なし</li>'; return;
        }
        state.doctors.forEach(doc => {
            const count = getDoctorMonthlyCount(doc.id);
            const li = document.createElement('li');
            li.className = 'doctor-item';
            if (isFormNonResponder(doc)) li.classList.add('doctor-missing-response');
            if (count === 0) li.classList.add('doctor-zero-count');
            if (count >= 3) li.classList.add('doctor-max-count');
            const groupCls = getGroupBadgeClass(doc.group);
	            let badges = `<span class="badge-group ${groupCls}">${doc.group}</span>`;
	            if (doc.holidayErDayPreferred) badges += '<span class="badge-erday-pref">救急日中可</span>';
	            if (isWardDutyPriorityDoctor(doc)) badges += '<span class="badge-erday-pref">病棟優先</span>';
		            if (isDutyExcludedDoctor(doc)) badges += '<span class="badge-form-missing">当直除外</span>';
		            if (isFridayWardOnlyDoctor(doc)) badges += '<span class="badge-erday-pref">金曜病棟のみ</span>';
		            if (getMonthlyDutyTarget(doc) > 1) badges += `<span class="badge-erday-pref">月${getMonthlyDutyTarget(doc)}目標</span>`;
		            if (isIwataYukiyoDoctor(doc)) badges += '<span class="badge-erday-pref">平日病棟/救日</span>';
		            if (isManualOnlyDoctor(doc)) badges += '<span class="badge-form-missing">手動のみ</span>';
            if (isFormNonResponder(doc)) badges += '<span class="badge-form-missing">未回答</span>';
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
            const savedBadge = state.savedMonths[monthKey] ? ' <span class="saved-month-badge">保存済</span>' : '';
            const formBadge = state.formResponsesByMonth && state.formResponsesByMonth[monthKey]
                ? ' <span class="form-month-badge">フォーム済</span>'
                : '';
	        els.currentMonthDisplay.innerHTML = `${y}年 ${m + 1}月${savedBadge}${formBadge}`;
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
	        saveData('月保存');
	        renderCalendar();
	        alert(`${monthKey} を保存しました。\n保存した割り当て枠: ${shiftCount}件`);
	    }

	    els.saveMonthBtn.addEventListener('click', saveCurrentMonthSnapshot);

		    // ===== Modal =====
    function appendDoctorOption(sel, doc, labelSuffix = '') {
        if (!sel || !doc) return;
        const options = sel.options ? Array.from(sel.options) : Array.from(sel.querySelectorAll('option'));
        const exists = options.some(option => option.value === doc.id);
        if (exists) return;
        const opt = document.createElement('option');
        opt.value = doc.id;
        const suffix = labelSuffix ? ` / ${labelSuffix}` : '';
        opt.textContent = `${doc.name} [${doc.group}${suffix}] (${getDoctorMonthlyCount(doc.id)}回)`;
        sel.appendChild(opt);
    }

	    function populateModalSelects(roles) {
	        const currentShifts = state.shifts[editingDateStr] || {};
	        roles.forEach(role => {
	            const sel = els.selects[role];
	            sel.innerHTML = '<option value="">-- 未割り当て --</option>';
	            if (role === 'erDay') {
	                const eligible = state.doctors.filter(d =>
                        isAutoAssignableDoctor(d) &&
                        (d.holidayErDayPreferred || canDoErDaySpecialDoctor(d, editingDateObj, editingDateStr))
                    );
	                if (eligible.length > 0) {
	                    const og2 = document.createElement('optgroup');
	                    og2.label = '救急日中候補';
	                    eligible.forEach(doc => {
	                        appendDoctorOption(og2, doc);
	                    });
	                    sel.appendChild(og2);
	                }
	            } else if (role === 'wardDay') {
	                state.doctors.filter(d =>
                        isAutoAssignableDoctor(d) &&
	                    canDoWardDayDoctor(d) &&
	                    !d.holidayErDayPreferred &&
	                    canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'wardDay')
	                ).forEach(doc => {
	                    appendDoctorOption(sel, doc);
	                });
	            } else if (role === 'wardNight') {
	                state.doctors.filter(d =>
                        isAutoAssignableDoctor(d) &&
	                    canDoWardNightDoctor(d, editingDateObj, editingDateStr) &&
	                    !d.holidayErDayPreferred &&
	                    canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'wardNight')
	                ).forEach(doc => {
	                    appendDoctorOption(sel, doc);
	                });
	            } else if (role === 'erNight') {
	                state.doctors.filter(d =>
                        isAutoAssignableDoctor(d) &&
	                    canDoErNightDoctor(d) &&
	                    !d.holidayErDayPreferred &&
	                    canAutoAssignFixedFemaleDoctor(d, editingDateObj, 'erNight')
	                ).forEach(doc => {
	                    appendDoctorOption(sel, doc);
	                });
	            }
                state.doctors
                    .filter(d => isManualOnlyDoctor(d))
                    .forEach(doc => appendDoctorOption(sel, doc, '手動のみ'));
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

        // Per-select display state
        for (const [role, sel] of Object.entries(els.selects)) {
            sel.classList.remove('has-warning', 'has-soft-warning');
            if (sel.closest('.form-group').classList.contains('hidden') || sel.classList.contains('hidden')) continue;
            if (!sel.value) continue;
            const chk = issues.checks[role];
            if (!chk) continue;
            if (!chk.valid) {
                const isFatal = chk.error === '医師が見つかりません' || isHardRuleError(chk.error);
                sel.classList.add(isFatal ? 'has-warning' : 'has-soft-warning');
            }
            else if (chk.warning) sel.classList.add('has-soft-warning');
        }

        if (issues.fatalErrors.length || issues.overrideErrors.length || issues.warns.length) {
            els.modalWarnings.innerHTML =
                (issues.fatalErrors.length ? `<div class="modal-error">❌ 保存不可<br>${issues.fatalErrors.join('<br>')}</div>` : '') +
                (issues.overrideErrors.length ? `<div class="modal-warnings">⚠️ 一時許可できます<br>${issues.overrideErrors.join('<br>')}</div>` : '') +
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
                '以下の項目は一時的な例外として保存できます。\n保存しますか？\n\n' +
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
        saveData('割り付け保存'); closeModal(); renderCalendar();
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

	            const candidates = state.doctors.filter(doc => {
                    if (!isAutoAssignableDoctor(doc)) return false;
	                if (!needsFormNonResponderDuty(doc)) return false;
	                if (!doc.holidayErDayPreferred && !canDoErDaySpecialDoctor(doc, dObj, dStr)) return false;
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
                    if (!isAutoAssignableDoctor(doc)) return false;
	                if (!doc.holidayErDayPreferred && !canDoErDaySpecialDoctor(doc, dObj, dStr)) return false;
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
                    if (!isAutoAssignableDoctor(doc)) return false;
	                if (!doc.holidayErDayPreferred && !canDoErDaySpecialDoctor(doc, dObj, dStr)) return false;
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
                        if (isFixedSpecialDutyRole(dStr, role)) continue;
                        if (role === 'erDay' && isActiveFixedErDaySaturday(dObj)) continue;
                        const currentId = state.shifts[dStr][role];
                        if (currentId === doc.id) { assigned = true; break; }
                        if (!canReplaceSlotForNonResponder(currentId, allowSingleReplacement)) continue;

                        const original = currentId || null;
                        if (original) delete state.shifts[dStr][role];
                        if (getAssignedDoctorIdsForDate(dStr, role).includes(doc.id)) {
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
	            '・月4回以上は不可（最大3回まで）\n' +
	            '・土日祝はどの医師も月2回まで\n' +
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
			            '・椿先生・箱谷先生は当直除外メンバーとして自動候補から外します\n' +
			            '・小澤牧人先生は金曜病棟当直のみ、月1回まで候補にします\n' +
			            '・南部先生は月3回を目標に優先します（最大3回まで）\n' +
			            '・岩田先生は循環器月1回を優先し、平日病棟当直または救急日直に候補を絞ります\n' +
			            '・8月以降の土日救急日中は岸先生・古田先生・梁間先生・上野峻輔先生・近藤先生も候補にします（元の救急日中候補を優先）\n' +
			            '・松岡 里紗先生は手動選択のみで、自動割り振りには入れません\n' +
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
            const assignedToday = new Set(getAssignedDoctorIdsForDate(dStr));

            for (const role of roles) {
                if (isFixedSpecialDutyRole(dStr, role)) continue;
                if (state.shifts[dStr][role]) continue;

	                let candidates = state.doctors.filter(doc => {
	                    if (!isAutoAssignableDoctor(doc)) return false;
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

        saveLocalOnlyData('自動割り振り');
        renderCalendar();
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
        const noteAssigned = state.doctors.filter(doc =>
            getDoctorFormDataForMonth(doc).notes && getDoctorMonthlyCount(doc.id) > 0
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
        renderSyncStatusFromMeta();
        const loadedShared = await loadSharedData({ silent: true });
        if (state.doctors.length === 0) {
            state.doctors = buildDefaultDoctors();
            saveData('初期医師マスタ作成');
        } else if (ensureRequiredExtraDoctors()) {
            saveLocalOnlyData('新規医師マスタ追加');
        } else if (!loadedShared) {
            saveLocalData();
        }
        renderDoctors();
        renderCalendar();
    }
    init();
});
