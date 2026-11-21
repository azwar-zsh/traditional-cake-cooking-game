import React, { useState, useEffect } from 'react';
import { CAKES_DATA, CakeRecipe } from './data/cakesData';
import { CakeIllustration, ChefCharacter } from './components/CakeIllustrations';
import { CookingArena, ScoreBreakdown } from './components/CookingArena';
import {
  LeaderboardEntry,
  getLeaderboardEntries,
  saveLeaderboardEntry,
  getEvaluationMessage,
  clearCustomLeaderboard,
} from './utils/leaderboard';
import { soundFX } from './utils/sound';
import {
  Play,
  Trophy,
  BookOpen,
  Star,
  Clock,
  ChefHat,
  Volume2,
  VolumeX,
  RotateCcw,
  Award,
  CheckCircle2,
  Sparkles,
  User,
  HelpCircle,
  ArrowRight,
  X,
} from 'lucide-react';

type ScreenState =
  | 'LANDING'
  | 'MENU_SELECTOR'
  | 'COOKING_GAME'
  | 'SCORE_REPORT'
  | 'LEADERBOARD';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('LANDING');
  const [nickname, setNickname] = useState<string>(() => {
    return localStorage.getItem('tccg_player_nickname') || '';
  });
  const [nicknameInput, setNicknameInput] = useState<string>(nickname);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [previewRecipeCake, setPreviewRecipeCake] = useState<CakeRecipe | null>(null);

  const [selectedCake, setSelectedCake] = useState<CakeRecipe>(CAKES_DATA[0]);
  const [lastScoreReport, setLastScoreReport] = useState<ScoreBreakdown | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>('ALL');
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    setLeaderboard(getLeaderboardEntries());
  }, []);

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundFX.muted = next;
  };

  // Start flow from Landing -> Nickname Popup -> Menu Selector
  const handleClickStartPlay = () => {
    soundFX.playPop(580);
    if (!nickname.trim()) {
      setNicknameInput('');
      setIsNicknameModalOpen(true);
    } else {
      setScreen('MENU_SELECTOR');
    }
  };

  const handleConfirmNickname = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = nicknameInput.trim() || 'Chef Muda';
    setNickname(cleaned);
    localStorage.setItem('tccg_player_nickname', cleaned);
    setIsNicknameModalOpen(false);
    soundFX.playSuccess();
    setScreen('MENU_SELECTOR');
  };

  const handleSelectCakeToCook = (cake: CakeRecipe) => {
    soundFX.playPop(640);
    setSelectedCake(cake);
    setScreen('COOKING_GAME');
  };

  const handleFinishCooking = (breakdown: ScoreBreakdown) => {
    setLastScoreReport(breakdown);
    const activeName = nickname.trim() || 'Chef Muda';
    saveLeaderboardEntry({
      nickname: activeName,
      cakeId: selectedCake.id,
      cakeName: selectedCake.name,
      totalScore: breakdown.totalScore,
      materialOrderScore: breakdown.materialOrderScore,
      miniGamePrecisionScore: breakdown.miniGamePrecisionScore,
      timeSpeedScore: breakdown.timeSpeedScore,
      timeSpentSeconds: breakdown.timeSpentSeconds,
    });
    setLeaderboard(getLeaderboardEntries());
    setScreen('SCORE_REPORT');
  };

  const filteredLeaderboard =
    leaderboardFilter === 'ALL'
      ? leaderboard
      : leaderboard.filter((entry) => entry.cakeId === leaderboardFilter);

  const topThree = filteredLeaderboard.slice(0, 3);
  const remainingRanks = filteredLeaderboard.slice(3);

  // If in active gameplay, render full-viewport CookingArena
  if (screen === 'COOKING_GAME') {
    return (
      <CookingArena
        cake={selectedCake}
        nickname={nickname || 'Chef Muda'}
        muted={muted}
        onToggleMute={handleToggleMute}
        onExitToMenu={() => setScreen('MENU_SELECTOR')}
        onFinishGame={handleFinishCooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9ED] text-[#3E2723] flex flex-col">
      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 border-b border-[#E6D5B8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setScreen('LANDING')}
            className="text-lg sm:text-xl font-bold tracking-tight text-[#3E2723] font-display whitespace-nowrap shrink-0 cursor-pointer"
          >
            Traditional Cake Cooking Game
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#6D4C41]">
            <button
              onClick={() => setScreen('LANDING')}
              className={`hover:text-[#D97706] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                screen === 'LANDING' ? 'text-[#D97706] underline underline-offset-4' : ''
              }`}
            >
              Beranda
            </button>
            <button
              onClick={handleClickStartPlay}
              className={`hover:text-[#D97706] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                screen === 'MENU_SELECTOR' ? 'text-[#D97706] underline underline-offset-4' : ''
              }`}
            >
              Pilihan Kue
            </button>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-[#D97706] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Panduan Bermain
            </button>
            <button
              onClick={() => {
                setLeaderboard(getLeaderboardEntries());
                setScreen('LEADERBOARD');
              }}
              className={`hover:text-[#D97706] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                screen === 'LEADERBOARD' ? 'text-[#D97706] underline underline-offset-4' : ''
              }`}
            >
              Leaderboard
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-lg border border-[#D6C1A0] bg-white hover:bg-[#FEF3C7] text-[#5D4037] transition-colors cursor-pointer"
              aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setNicknameInput(nickname);
                setIsNicknameModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {nickname ? `Koki: ${nickname}` : 'Mulai Bermain'}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================
          1. BERANDA / LANDING SCREEN
         ================================================================= */}
      {screen === 'LANDING' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 lg:py-14 space-y-14">
          {/* Hero Split Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 cols: Title, Tagline, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-bold text-[#15803D] tracking-wide">
                Arcade Edition · Edukasi Kuliner Nusantara Interaktif
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3E2723] leading-[1.12] font-display"
                style={{ textWrap: 'balance' }}
              >
                Masak, Pelajari & Lestarikan Kue Tradisional Indonesia
              </h1>

              <p className="text-base sm:text-lg text-[#5D4037] max-w-2xl leading-relaxed">
                <span className="font-bold text-[#92400E]">
                  &ldquo;Learn, Play, Cook, and Preserve Traditional Cakes.&rdquo;
                </span>{' '}
                Masuki dapur virtual bersama Chef Sari! Rasakan serunya meracik bahan, mengaduk
                adonan dengan meteran kecepatan, hingga memanggang 6 kue tradisional autentik
                Nusantara tanpa perlu membuat akun.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={handleClickStartPlay}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-base shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Mulai Bermain
                </button>

                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-white hover:bg-[#FEF3C7] text-[#3E2723] border border-[#D6C1A0] font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <HelpCircle className="w-4 h-4 text-[#D97706]" />
                  Panduan Bermain
                </button>

                <button
                  onClick={() => {
                    setLeaderboard(getLeaderboardEntries());
                    setScreen('LEADERBOARD');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#10B981]/40 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Trophy className="w-4 h-4 text-[#15803D]" />
                  Leaderboard
                </button>
              </div>

              {/* Control hint line */}
              <div className="text-xs text-[#795548] pt-1">
                Mekanisme Permainan: Drag & Drop Bahan · Takaran Resep · Putar Aduk Adonan · Timing
                Bar Kematangan · Urutan Langkah
              </div>
            </div>

            {/* Right 5 cols: Warm Kitchen Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border-2 border-[#E6D5B8] p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-[#F3E8D6]">
                  <ChefCharacter mood="excited" className="w-24 h-24 shrink-0 animate-float-slow" />
                  <div>
                    <div className="text-xs font-bold text-[#D97706]">Selamat Datang di Dapur!</div>
                    <h2 className="text-xl font-bold text-[#3E2723]">Chef Sari Siap Membimbing</h2>
                    <p className="text-xs text-[#6D4C41] mt-1">
                      Pilih salah satu dari 6 resep kue Nusantara dan raih skor sempurna 100 poin!
                    </p>
                  </div>
                </div>

                {/* Mini 6-Cake Preview Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {CAKES_DATA.map((cake) => (
                    <button
                      key={cake.id}
                      onClick={() => {
                        setSelectedCake(cake);
                        handleClickStartPlay();
                      }}
                      className="p-2.5 rounded-xl bg-[#FFF9ED] hover:bg-[#FEF3C7] border border-[#E6D5B8] flex flex-col items-center text-center transition-colors cursor-pointer group"
                    >
                      <CakeIllustration
                        cakeId={cake.id}
                        className="w-20 h-14 group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[11px] font-bold text-[#3E2723] mt-1 line-clamp-1">
                        {cake.name.split(' ')[0]} {cake.name.split(' ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3-Column Educational Value & Scoring Transparency Strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E6D5B8]">
            <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8]">
              <div className="text-xs font-bold text-[#D97706]">01. Resep Autentik Modul</div>
              <h3 className="text-lg font-bold text-[#3E2723] mt-1">
                6 Kue Tradisional Nusantara
              </h3>
              <p className="text-xs text-[#6D4C41] mt-2 leading-relaxed">
                Dilengkapi takaran gramasi akurat mulai dari Roti Jala Kari Ayam, Timpan Aceh
                Srikaya, Kue Rangi, Bandros Keju, Baytat Bengkulu, hingga Kue Jongkong.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8]">
              <div className="text-xs font-bold text-[#15803D]">02. Simulasi Interaktif</div>
              <h3 className="text-lg font-bold text-[#3E2723] mt-1">
                5 Variasi Mini-Game Memasak
              </h3>
              <p className="text-xs text-[#6D4C41] mt-2 leading-relaxed">
                Bukan sekadar kuis statis! Seret bahan ke panci, putar pengocok adonan dengan
                meteran kecepatan, dan angkat kue tepat di zona hijau agar tidak gosong.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6D5B8]">
              <div className="text-xs font-bold text-[#92400E]">03. Evaluasi Transparan</div>
              <h3 className="text-lg font-bold text-[#3E2723] mt-1">
                Rubrik Skor 100 Poin & Podium
              </h3>
              <p className="text-xs text-[#6D4C41] mt-2 leading-relaxed">
                Penilaian objektif dari Ketepatan Bahan & Urutan (60 Poin), Presisi Mini-Game (25
                Poin), serta Kecepatan Waktu (15 Poin) yang tercatat di Papan Peringkat.
              </p>
            </div>
          </section>
        </main>
      )}

      {/* =================================================================
          3. HALAMAN PILIHAN KUE (MENU SELECTOR - 6 TRADITIONAL CAKES)
         ================================================================= */}
      {screen === 'MENU_SELECTOR' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6D5B8] pb-5">
            <div>
              <div className="text-xs font-bold text-[#D97706]">
                Halo Koki {nickname || 'Muda'} · Pilih Tantangan Resepmu
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3E2723] font-display mt-1">
                Pilihan 6 Kue Tradisional Nusantara
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setNicknameInput(nickname);
                  setIsNicknameModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D6C1A0] bg-white hover:bg-[#FEF3C7] text-xs font-bold text-[#5D4037] cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#D97706]" />
                Ganti Nama ({nickname || 'Chef Muda'})
              </button>
            </div>
          </div>

          {/* 6 Cake Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAKES_DATA.map((cake, index) => (
              <article
                key={cake.id}
                className="bg-white rounded-2xl border border-[#E6D5B8] overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5 shadow-xs"
              >
                <div>
                  {/* Visual Illustration Header */}
                  <div
                    className="p-5 flex items-center justify-center relative border-b border-[#F3E8D6]"
                    style={{ backgroundColor: cake.bgTint }}
                  >
                    <CakeIllustration cakeId={cake.id} className="w-44 h-32" />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-[#8D6E63] font-medium">
                      <span>0{index + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{cake.region}</span>
                      <span aria-hidden="true">·</span>
                      <span>Tingkat {cake.difficulty}</span>
                    </div>

                    <h2 className="text-xl font-bold text-[#3E2723] leading-snug">
                      {cake.name}
                    </h2>

                    <p className="text-xs text-[#5D4037] leading-relaxed">
                      {cake.shortDesc}
                    </p>

                    <div className="pt-2 border-t border-[#F3E8D6] flex items-center justify-between text-xs text-[#6D4C41] font-mono-tabular">
                      <span>5 Tahap Mini-Game</span>
                      <span>Waktu: {cake.timeLimitSeconds} dtk</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2.5">
                  <button
                    onClick={() => setPreviewRecipeCake(cake)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#D6C1A0] bg-[#FFF9ED] hover:bg-[#FEF3C7] text-[#5D4037] font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
                    Pelajari Resep
                  </button>
                  <button
                    onClick={() => handleSelectCakeToCook(cake)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    Mulai Masak
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {/* =================================================================
          5. HALAMAN HASIL (SCORE REPORT)
         ================================================================= */}
      {screen === 'SCORE_REPORT' && lastScoreReport && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
          {(() => {
            const evalInfo = getEvaluationMessage(lastScoreReport.totalScore);
            return (
              <div className="bg-white rounded-3xl border-2 border-[#E6D5B8] p-6 sm:p-10 shadow-xs space-y-8">
                {/* Top Celebration Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#F3E8D6]">
                  <div className="flex items-center gap-5">
                    <ChefCharacter
                      mood={lastScoreReport.totalScore >= 70 ? 'excited' : 'happy'}
                      className="w-28 h-28 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#D97706]">
                        Laporan Evaluasi Praktikum · Koki {nickname || 'Muda'}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723] font-display mt-1">
                        {selectedCake.name} Selesai Disajikan!
                      </h1>
                      <p className="text-sm font-semibold text-[#15803D] mt-1.5">
                        &ldquo;{evalInfo.message}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Final Cake & Stars */}
                  <div className="flex flex-col items-center bg-[#FFF9ED] px-6 py-4 rounded-2xl border border-[#E6D5B8]">
                    <CakeIllustration cakeId={selectedCake.id} className="w-32 h-24" />
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1, 2, 3].map((st) => (
                        <Star
                          key={st}
                          className={`w-6 h-6 ${
                            st <= evalInfo.stars
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-[#D6C1A0]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Big Total Score & 3 Transparent Components Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 bg-[#FFF9ED] rounded-2xl border border-[#F59E0B]/50 p-6 text-center space-y-2">
                    <div className="text-xs font-bold text-[#92400E]">NILAI AKHIR</div>
                    <div className="text-6xl font-extrabold text-[#3E2723] font-mono-tabular">
                      {lastScoreReport.totalScore}
                    </div>
                    <div className="text-xs font-semibold text-[#6D4C41]">
                      dari Maksimal 100 Poin
                    </div>
                    <div className="pt-2 text-xs text-[#795548] font-mono-tabular">
                      Waktu Selesai: {lastScoreReport.timeSpentSeconds} detik · Kesalahan:{' '}
                      {lastScoreReport.mistakesCount}x
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <h2 className="text-base font-bold text-[#3E2723]">
                      Rincian 3 Komponen Penilaian:
                    </h2>

                    {/* 1. Ketepatan Urutan & Bahan (60) */}
                    <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E6D5B8] space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#3E2723]">
                          1. Ketepatan Urutan & Bahan Baku
                        </span>
                        <span className="font-mono-tabular text-[#15803D]">
                          {lastScoreReport.materialOrderScore} / 60 Poin
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F5EBE0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#15803D]"
                          style={{
                            width: `${(lastScoreReport.materialOrderScore / 60) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 2. Presisi Mini-Game (25) */}
                    <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E6D5B8] space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#3E2723]">
                          2. Presisi & Akurasi Tindakan Mini-Game
                        </span>
                        <span className="font-mono-tabular text-[#D97706]">
                          {lastScoreReport.miniGamePrecisionScore} / 25 Poin
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F5EBE0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D97706]"
                          style={{
                            width: `${(lastScoreReport.miniGamePrecisionScore / 25) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 3. Kecepatan Menyelesaikan (15) */}
                    <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E6D5B8] space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#3E2723]">
                          3. Kecepatan Menyelesaikan (Waktu)
                        </span>
                        <span className="font-mono-tabular text-[#0284C7]">
                          {lastScoreReport.timeSpeedScore} / 15 Poin
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#F5EBE0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0284C7]"
                          style={{
                            width: `${(lastScoreReport.timeSpeedScore / 15) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Educational Takeaway Box */}
                <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 text-xs text-[#065F46] space-y-1">
                  <div className="font-bold">Indikator Keberhasilan & Tips Praktik {selectedCake.name}:</div>
                  <p>{selectedCake.successIndicator}</p>
                  <p className="text-[#047857] font-medium">Tips: {selectedCake.practicalTip}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setScreen('COOKING_GAME')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Main Lagi
                    </button>
                    <button
                      onClick={() => setScreen('MENU_SELECTOR')}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[#D6C1A0] bg-white hover:bg-[#FEF3C7] text-[#3E2723] font-bold text-sm transition-colors cursor-pointer"
                    >
                      Pilih Kue Lain
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setLeaderboard(getLeaderboardEntries());
                      setScreen('LEADERBOARD');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-sm transition-colors cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    Lihat Papan Peringkat
                  </button>
                </div>
              </div>
            );
          })()}
        </main>
      )}

      {/* =================================================================
          6. PAPAN PERINGKAT / LOCAL LEADERBOARD
         ================================================================= */}
      {screen === 'LEADERBOARD' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6D5B8] pb-5">
            <div>
              <div className="text-xs font-bold text-[#15803D]">
                Hall of Fame · Penyimpanan Lokal (LocalStorage)
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3E2723] font-display mt-1">
                Papan Peringkat Koki Kue Tradisional
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleClickStartPlay}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Masak & Cetak Skor Baru
              </button>
              <button
                onClick={() => setLeaderboard(clearCustomLeaderboard())}
                className="px-3.5 py-2.5 rounded-xl border border-[#D6C1A0] bg-white hover:bg-[#FEE2E2] text-xs font-semibold text-[#795548] cursor-pointer"
              >
                Reset Skor
              </button>
            </div>
          </div>

          {/* Interactive Filter Tabs by Cake Type */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F5EBE0] rounded-xl">
            <button
              onClick={() => setLeaderboardFilter('ALL')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                leaderboardFilter === 'ALL'
                  ? 'bg-white text-[#3E2723] shadow-xs'
                  : 'text-[#6D4C41] hover:text-[#3E2723]'
              }`}
            >
              Semua Kue ({leaderboard.length})
            </button>
            {CAKES_DATA.map((cake) => (
              <button
                key={cake.id}
                onClick={() => setLeaderboardFilter(cake.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  leaderboardFilter === cake.id
                    ? 'bg-white text-[#3E2723] shadow-xs'
                    : 'text-[#6D4C41] hover:text-[#3E2723]'
                }`}
              >
                {cake.name}
              </button>
            ))}
          </div>

          {/* Top 3 Podium (Juara 1, 2, dan 3) */}
          {topThree.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-2">
              {/* Juara 2 */}
              {topThree[1] ? (
                <div className="bg-white rounded-2xl border-2 border-[#CBD5E1] p-5 text-center space-y-2 order-2 md:order-1">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#F1F5F9] border-2 border-[#94A3B8] flex items-center justify-center text-[#475569] font-extrabold text-sm">
                    #2
                  </div>
                  <div className="text-xs font-bold text-[#64748B]">JUARA 2 · MEDALI PERAK</div>
                  <h3 className="text-lg font-extrabold text-[#3E2723]">{topThree[1].nickname}</h3>
                  <div className="text-xs text-[#6D4C41]">{topThree[1].cakeName}</div>
                  <div className="text-3xl font-extrabold text-[#3E2723] font-mono-tabular pt-1">
                    {topThree[1].totalScore}{' '}
                    <span className="text-xs font-semibold text-[#8D6E63]">poin</span>
                  </div>
                  <div className="text-xs text-[#8D6E63] font-mono-tabular">
                    Waktu: {topThree[1].timeSpentSeconds} detik
                  </div>
                </div>
              ) : (
                <div className="hidden md:block order-1" />
              )}

              {/* Juara 1 (Center Elevated Podium) */}
              {topThree[0] && (
                <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#F59E0B] p-6 text-center space-y-2.5 shadow-sm order-1 md:order-2 md:-translate-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#FEF3C7] border-2 border-[#D97706] flex items-center justify-center text-[#B45309]">
                    <Trophy className="w-7 h-7 text-[#D97706]" />
                  </div>
                  <div className="text-xs font-extrabold text-[#D97706]">
                    JUARA 1 · PIALA EMAS NUSANTARA
                  </div>
                  <h3 className="text-xl font-extrabold text-[#3E2723]">{topThree[0].nickname}</h3>
                  <div className="text-xs font-medium text-[#6D4C41]">{topThree[0].cakeName}</div>
                  <div className="text-4xl font-extrabold text-[#D97706] font-mono-tabular pt-1">
                    {topThree[0].totalScore}{' '}
                    <span className="text-xs font-semibold text-[#8D6E63]">poin</span>
                  </div>
                  <div className="text-xs text-[#795548] font-mono-tabular">
                    Bahan/Urutan: {topThree[0].materialOrderScore}/60 · Presisi:{' '}
                    {topThree[0].miniGamePrecisionScore}/25 · Waktu: {topThree[0].timeSpentSeconds}s
                  </div>
                </div>
              )}

              {/* Juara 3 */}
              {topThree[2] ? (
                <div className="bg-white rounded-2xl border-2 border-[#D97706]/50 p-5 text-center space-y-2 order-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#FEF3C7]/60 border-2 border-[#B45309] flex items-center justify-center text-[#92400E] font-extrabold text-sm">
                    #3
                  </div>
                  <div className="text-xs font-bold text-[#92400E]">JUARA 3 · MEDALI PERUNGGU</div>
                  <h3 className="text-lg font-extrabold text-[#3E2723]">{topThree[2].nickname}</h3>
                  <div className="text-xs text-[#6D4C41]">{topThree[2].cakeName}</div>
                  <div className="text-3xl font-extrabold text-[#3E2723] font-mono-tabular pt-1">
                    {topThree[2].totalScore}{' '}
                    <span className="text-xs font-semibold text-[#8D6E63]">poin</span>
                  </div>
                  <div className="text-xs text-[#8D6E63] font-mono-tabular">
                    Waktu: {topThree[2].timeSpentSeconds} detik
                  </div>
                </div>
              ) : (
                <div className="hidden md:block order-3" />
              )}
            </section>
          )}

          {/* Table for Ranks 4 and below (plus full transparent view) */}
          <section className="bg-white rounded-2xl border border-[#E6D5B8] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F3E8D6] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#3E2723]">
                Daftar Lengkap Peringkat Koki ({filteredLeaderboard.length} Catatan Skor)
              </h2>
              <span className="text-xs text-[#795548]">
                Diurutkan berdasarkan Skor Tertinggi & Waktu Tercepat
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6D5B8] bg-[#FFF9ED] text-xs font-bold text-[#6D4C41]">
                    <th className="py-3.5 px-5">Peringkat</th>
                    <th className="py-3.5 px-5">Nama Pemain</th>
                    <th className="py-3.5 px-5">Kue Tradisional</th>
                    <th className="py-3.5 px-5 text-right">Bahan & Urutan</th>
                    <th className="py-3.5 px-5 text-right">Presisi</th>
                    <th className="py-3.5 px-5 text-right">Waktu</th>
                    <th className="py-3.5 px-5 text-right">Skor Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E8D6] text-sm">
                  {filteredLeaderboard.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-[#FFF9ED]/70 transition-colors ${
                        idx < 3 ? 'bg-[#FFFDF9] font-semibold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono-tabular font-bold text-[#78350F]">
                        #{idx + 1}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-[#3E2723]">{entry.nickname}</td>
                      <td className="py-3.5 px-5 text-[#5D4037]">{entry.cakeName}</td>
                      <td className="py-3.5 px-5 text-right font-mono-tabular text-xs text-[#5D4037]">
                        {entry.materialOrderScore}/60
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono-tabular text-xs text-[#5D4037]">
                        {entry.miniGamePrecisionScore}/25
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono-tabular text-xs text-[#5D4037]">
                        {entry.timeSpentSeconds} dtk
                      </td>
                      <td className="py-3.5 px-5 text-right font-mono-tabular font-extrabold text-[#15803D]">
                        {entry.totalScore} / 100
                      </td>
                    </tr>
                  ))}
                  { remainingRanks.length === 0 && filteredLeaderboard.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-[#8D6E63]">
                        Belum ada catatan skor untuk kategori kue ini. Ayo jadilah koki pertama!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* =================================================================
          2. POP-UP INPUT NAMA PEMAIN (NICKNAME MODAL)
         ================================================================= */}
      {isNicknameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#D97706] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChefCharacter mood="happy" className="w-14 h-14" />
                <div>
                  <div className="text-xs font-bold text-[#D97706]">Tanpa Login / Akun</div>
                  <h3 className="text-xl font-bold text-[#3E2723]">Masukkan Nama Koki</h3>
                </div>
              </div>
              <button
                onClick={() => setIsNicknameModalOpen(false)}
                className="p-1.5 rounded-lg text-[#795548] hover:bg-[#FEF3C7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmNickname} className="space-y-4">
              <div>
                <label
                  htmlFor="nickname-input"
                  className="block text-xs font-bold text-[#5D4037] mb-1.5"
                >
                  Nama Panggilan (Nickname) untuk Papan Peringkat:
                </label>
                <input
                  id="nickname-input"
                  type="text"
                  required
                  maxLength={24}
                  placeholder="Contoh: Chef Sari, Budi, Putri..."
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D6C1A0] bg-white text-[#3E2723] font-semibold text-sm focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNicknameModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D6C1A0] text-xs font-bold text-[#5D4037] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer"
                >
                  Lanjut Pilih Kue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          PANDUAN BERMAIN MODAL
         ================================================================= */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#D97706] rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E6D5B8] pb-4">
              <div>
                <div className="text-xs font-bold text-[#D97706]">Panduan & Aturan Skor</div>
                <h3 className="text-2xl font-bold text-[#3E2723]">
                  Cara Bermain Traditional Cake Cooking Game
                </h3>
              </div>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#3E2723] text-white text-xs font-bold cursor-pointer"
              >
                Mengerti
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#4E342E] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#FFF9ED] border border-[#E6D5B8]">
                <span className="font-bold text-[#78350F]">1. Pilih Nama & Kue Tradisional:</span>{' '}
                Masukkan nickname kamu lalu pilih salah satu dari 6 resep kue tradisional Indonesia
                (Roti Jala, Timpan Aceh, Kue Rangi, Bandros Keju, Baytat Bengkulu, atau Kue
                Jongkong).
              </div>
              <div className="p-3.5 rounded-xl bg-[#FFF9ED] border border-[#E6D5B8]">
                <span className="font-bold text-[#78350F]">2. Selesaikan 5 Mini-Game Interaktif:</span>{' '}
                Tiap kue memiliki tahapan unik: memilih takaran bahan baku, menyeret (Drag & Drop)
                bahan ke panci/mangkuk, mengaduk adonan dengan meteran kecepatan (Speed Gauge),
                menekan tombol tepat di Zona Hijau (Timing Bar), dan menyusun urutan prosedur kerja.
              </div>
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40">
                <span className="font-bold text-[#065F46]">3. Sistem Penilaian (Skor 0–100):</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Ketepatan Urutan & Bahan: 60 Poin</li>
                  <li>Presisi & Akurasi Tindakan Mini-Game: 25 Poin</li>
                  <li>Kecepatan Menyelesaikan (Waktu): 15 Poin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL DETAIL RESEP & MODUL PRAKTIKUM
         ================================================================= */}
      {previewRecipeCake && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#D97706] rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E6D5B8] pb-4">
              <div>
                <div className="text-xs font-bold text-[#D97706]">
                  Modul Praktik Pengolahan Kue Nusantara · {previewRecipeCake.region}
                </div>
                <h3 className="text-2xl font-bold text-[#3E2723]">{previewRecipeCake.name}</h3>
                <p className="text-xs text-[#6D4C41] mt-0.5">
                  Perkiraan Hasil: {previewRecipeCake.yieldText}
                </p>
              </div>
              <button
                onClick={() => setPreviewRecipeCake(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#3E2723] text-white text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previewRecipeCake.ingredientGroups.map((grp, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#FFF9ED] border border-[#E6D5B8] space-y-2"
                >
                  <h4 className="text-sm font-bold text-[#78350F]">{grp.groupTitle}</h4>
                  <ul className="space-y-1 text-xs text-[#4E342E] list-disc list-inside">
                    {grp.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#3E2723]">Prosedur Kerja:</h4>
              <ol className="space-y-1.5 text-xs text-[#4E342E] list-decimal list-inside">
                {previewRecipeCake.procedureSummary.map((st, i) => (
                  <li key={i} className="leading-relaxed">
                    {st}
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 text-xs text-[#065F46] space-y-1">
              <div className="font-bold">Indikator Keberhasilan:</div>
              <p>{previewRecipeCake.successIndicator}</p>
              <div className="font-bold pt-1">Tips Praktik:</div>
              <p>{previewRecipeCake.practicalTip}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  const target = previewRecipeCake;
                  setPreviewRecipeCake(null);
                  handleSelectCakeToCook(target);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs cursor-pointer"
              >
                <ChefHat className="w-4 h-4" />
                Langsung Masak {previewRecipeCake.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Quiet Footer */}
      <footer className="border-t border-[#E6D5B8] bg-[#FFFDF9] px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#795548]">
          <span>Traditional Cake Cooking Game — Learn, Play, Cook, and Preserve Traditional Cakes.</span>
          <span>6 Resep Autentik Kue Nusantara · Edukasi Kuliner Interaktif</span>
        </div>
      </footer>
    </div>
  );
}
