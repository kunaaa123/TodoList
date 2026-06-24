export interface ThaiHoliday {
  date: string // YYYY-MM-DD format
  nameTh: string
  nameEn: string
}

// Full local database for Thai official holidays 2026
const holidays2026: ThaiHoliday[] = [
  { date: '2026-01-01', nameTh: 'วันขึ้นปีใหม่', nameEn: "New Year's Day" },
  { date: '2026-03-03', nameTh: 'วันมาฆบูชา', nameEn: 'Makha Bucha Day' },
  { date: '2026-04-06', nameTh: 'วันจักรี', nameEn: 'Chakri Memorial Day' },
  { date: '2026-04-13', nameTh: 'วันสงกรานต์', nameEn: 'Songkran Festival' },
  { date: '2026-04-14', nameTh: 'วันสงกรานต์', nameEn: 'Songkran Festival' },
  { date: '2026-04-15', nameTh: 'วันสงกรานต์', nameEn: 'Songkran Festival' },
  { date: '2026-05-01', nameTh: 'วันแรงงานแห่งชาติ', nameEn: 'National Labour Day' },
  { date: '2026-05-04', nameTh: 'วันฉัตรมงคล', nameEn: 'Coronation Day' },
  { date: '2026-05-11', nameTh: 'วันพืชมงคล', nameEn: 'Royal Ploughing Ceremony' },
  { date: '2026-05-31', nameTh: 'วันวิสาขบูชา', nameEn: 'Visakha Bucha Day' },
  { date: '2026-06-03', nameTh: 'วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าฯ พระบรมราชินี', nameEn: "Queen Suthida's Birthday" },
  { date: '2026-07-28', nameTh: 'วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระวชิรเกล้าเจ้าอยู่หัว', nameEn: "King Vajiralongkorn's Birthday" },
  { date: '2026-07-29', nameTh: 'วันอาสาฬหบูชา', nameEn: 'Asahna Bucha Day' },
  { date: '2026-07-30', nameTh: 'วันเข้าพรรษา', nameEn: 'Buddhist Lent Day' },
  { date: '2026-08-12', nameTh: 'วันเฉลิยพระชนมพรรษาสมเด็จพระบรมราชชนนีพันปีหลวง / วันแม่แห่งชาติ', nameEn: "Queen Sirikit's Birthday / Mother's Day" },
  { date: '2026-10-13', nameTh: 'วันคล้ายวันสวรรคตพระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร', nameEn: "King Bhumibol Memorial Day" },
  { date: '2026-10-23', nameTh: 'วันปิยมหาราช', nameEn: 'Chulalongkorn Day' },
  { date: '2026-12-05', nameTh: 'วันคล้ายวันพระบรมราชสมภพพระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร / วันชาติ / วันพ่อแห่งชาติ', nameEn: "King Bhumibol's Birthday / National Day / Father's Day" },
  { date: '2026-12-10', nameTh: 'วันรัฐธรรมนูญ', nameEn: 'Constitution Day' },
  { date: '2026-12-31', nameTh: 'วันสิ้นปี', nameEn: "New Year's Eve" },
]

export const getThaiHoliday = (dateString: string): ThaiHoliday | undefined => {
  return holidays2026.find((h) => h.date === dateString)
}

export const isThaiHoliday = (dateString: string): boolean => {
  return holidays2026.some((h) => h.date === dateString)
}
