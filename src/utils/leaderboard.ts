export interface LeaderboardEntry {
  id: string;
  nickname: string;
  cakeId: string;
  cakeName: string;
  totalScore: number;
  materialOrderScore: number; // Max 60
  miniGamePrecisionScore: number; // Max 25
  timeSpeedScore: number; // Max 15
  timeSpentSeconds: number;
  createdAt: string;
}

const STORAGE_KEY = 'traditional_cake_arcade_leaderboard_v1';

const INITIAL_SEED_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    nickname: 'Siti Rahma',
    cakeId: 'roti-jala',
    cakeName: 'Roti Jala & Kuah Kari Ayam',
    totalScore: 96,
    materialOrderScore: 60,
    miniGamePrecisionScore: 23,
    timeSpeedScore: 13,
    timeSpentSeconds: 64,
    createdAt: '2026-11-19T10:15:00.000Z',
  },
  {
    id: 'seed-2',
    nickname: 'Dimas Pratama',
    cakeId: 'timpan-aceh',
    cakeName: 'Timpan Aceh Isi Srikaya',
    totalScore: 92,
    materialOrderScore: 57,
    miniGamePrecisionScore: 22,
    timeSpeedScore: 13,
    timeSpentSeconds: 72,
    createdAt: '2026-11-19T14:22:00.000Z',
  },
  {
    id: 'seed-3',
    nickname: 'Nadia Putri',
    cakeId: 'kue-jongkong',
    cakeName: 'Kue Jongkong Lapis Gula Merah',
    totalScore: 89,
    materialOrderScore: 55,
    miniGamePrecisionScore: 22,
    timeSpeedScore: 12,
    timeSpentSeconds: 78,
    createdAt: '2026-11-19T16:40:00.000Z',
  },
  {
    id: 'seed-4',
    nickname: 'Rizky Maulana',
    cakeId: 'baytat-bengkulu',
    cakeName: 'Baytat Bengkulu',
    totalScore: 85,
    materialOrderScore: 53,
    miniGamePrecisionScore: 21,
    timeSpeedScore: 11,
    timeSpentSeconds: 88,
    createdAt: '2026-11-20T08:10:00.000Z',
  },
  {
    id: 'seed-5',
    nickname: 'Ayu Lestari',
    cakeId: 'kue-rangi',
    cakeName: 'Kue Rangi Saus Gula Merah',
    totalScore: 82,
    materialOrderScore: 52,
    miniGamePrecisionScore: 19,
    timeSpeedScore: 11,
    timeSpentSeconds: 79,
    createdAt: '2026-11-20T09:05:00.000Z',
  },
  {
    id: 'seed-6',
    nickname: 'Bagas Saputra',
    cakeId: 'bandros-keju',
    cakeName: 'Bandros Topping Keju',
    totalScore: 78,
    materialOrderScore: 49,
    miniGamePrecisionScore: 19,
    timeSpeedScore: 10,
    timeSpentSeconds: 85,
    createdAt: '2026-11-20T11:30:00.000Z',
  },
];

export function getLeaderboardEntries(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ENTRIES));
      return [...INITIAL_SEED_ENTRIES];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...INITIAL_SEED_ENTRIES];
    return parsed.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.timeSpentSeconds - b.timeSpentSeconds;
    });
  } catch {
    return [...INITIAL_SEED_ENTRIES];
  }
}

export function saveLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>
): LeaderboardEntry {
  const existing = getLeaderboardEntries();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `score-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [...existing, newEntry].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota error
  }
  return newEntry;
}

export function clearCustomLeaderboard(): LeaderboardEntry[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ENTRIES));
  } catch {
    // ignore
  }
  return [...INITIAL_SEED_ENTRIES];
}

export function getEvaluationMessage(score: number): {
  title: string;
  message: string;
  stars: number;
  badgeColor: string;
} {
  if (score >= 90) {
    return {
      title: 'Chef Master Nusantara!',
      message: 'Luar biasa! Kamu Chef Kue Tradisional Sejati!',
      stars: 3,
      badgeColor: '#15803D',
    };
  }
  if (score >= 80) {
    return {
      title: 'Koki Ahli Tradisional',
      message: 'Bagus! Kamu sudah menguasai resep ini dengan baik.',
      stars: 3,
      badgeColor: '#D97706',
    };
  }
  if (score >= 70) {
    return {
      title: 'Koki Muda Berbakat',
      message: 'Cukup baik! Tingkatkan lagi ketelitianmu.',
      stars: 2,
      badgeColor: '#B45309',
    };
  }
  return {
    title: 'Asisten Dapur Semangat',
    message: 'Jangan menyerah! Pelajari kembali resepnya dan coba lagi.',
    stars: 1,
    badgeColor: '#DC2626',
  };
}
