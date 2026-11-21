import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  CakeRecipe,
  CookingStage,
  SequenceStepItem,
} from '../data/cakesData';
import {
  CakeIllustration,
  ChefCharacter,
  IngredientIcon,
} from './CakeIllustrations';
import { soundFX } from '../utils/sound';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RotateCw,
  Flame,
  BookOpen,
  ArrowLeft,
  Volume2,
  VolumeX,
  Hand,
} from 'lucide-react';

export interface ScoreBreakdown {
  totalScore: number;
  materialOrderScore: number; // max 60
  miniGamePrecisionScore: number; // max 25
  timeSpeedScore: number; // max 15
  timeSpentSeconds: number;
  mistakesCount: number;
}

interface CookingArenaProps {
  cake: CakeRecipe;
  nickname: string;
  muted: boolean;
  onToggleMute: () => void;
  onExitToMenu: () => void;
  onFinishGame: (breakdown: ScoreBreakdown) => void;
}

export const CookingArena: React.FC<CookingArenaProps> = ({
  cake,
  nickname,
  muted,
  onToggleMute,
  onExitToMenu,
  onFinishGame,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cake.timeLimitSeconds);
  const [isRecipeDrawerOpen, setIsRecipeDrawerOpen] = useState(false);

  // Transparent 3-component scoring state (Max: 60 + 25 + 15 = 100)
  const [materialOrderPenalty, setMaterialOrderPenalty] = useState(0); // deducted from 60
  const [precisionPenalty, setPrecisionPenalty] = useState(0); // deducted from 25
  const [mistakesCount, setMistakesCount] = useState(0);

  // Feedback banner & Chef mood
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [chefMood, setChefMood] = useState<'happy' | 'excited' | 'oops' | 'focus'>('happy');
  const [stageCompleted, setStageCompleted] = useState(false);

  // 1. MULTI_CHOICE state
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  // 2. DRAG_DROP state
  const [droppedItemIds, setDroppedItemIds] = useState<string[]>([]);
  const [dragOverVessel, setDragOverVessel] = useState(false);

  // 3. STIRRING state
  const [stirProgress, setStirProgress] = useState(0); // 0 to targetRotations
  const [stirSpeed, setStirSpeed] = useState(0); // 0 to 100 gauge
  const [whiskAngle, setWhiskAngle] = useState(0);
  const bowlRef = useRef<HTMLDivElement | null>(null);
  const lastAngleRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);

  // 4. TIMING_TAP state
  const [timingCursor, setTimingCursor] = useState(10); // 0 to 100
  const timingDirectionRef = useRef<1 | -1>(1);
  const [timingLocked, setTimingLocked] = useState(false);

  // 5. SEQUENCING state
  const [selectedSequenceIds, setSelectedSequenceIds] = useState<string[]>([]);

  const currentStage: CookingStage = cake.stages[currentStageIdx];

  // Deterministic shuffle for sequence items per stage
  const shuffledSequenceItems = useMemo(() => {
    if (!currentStage.sequenceItems) return [];
    const copy = [...currentStage.sequenceItems];
    // Deterministic swap so order isn't already 1-2-3-4
    return [copy[2], copy[0], copy[3], copy[1]].filter(Boolean);
  }, [currentStage]);

  // Global countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset stage state when stage index changes
  useEffect(() => {
    setStageCompleted(false);
    setFeedback(null);
    setChefMood('focus');
    setSelectedChoices([]);
    setDroppedItemIds([]);
    setDragOverVessel(false);
    setStirProgress(0);
    setStirSpeed(0);
    setWhiskAngle(0);
    lastAngleRef.current = null;
    setTimingCursor(15);
    timingDirectionRef.current = 1;
    setTimingLocked(false);
    setSelectedSequenceIds([]);
  }, [currentStageIdx]);

  // Decay stir speed gauge smoothly
  useEffect(() => {
    if (currentStage.type !== 'STIRRING' || stageCompleted) return;
    const interval = setInterval(() => {
      setStirSpeed((prev) => Math.max(0, prev - 5));
    }, 120);
    return () => clearInterval(interval);
  }, [currentStage.type, stageCompleted]);

  // Oscillate timing bar cursor at 60fps
  useEffect(() => {
    if (currentStage.type !== 'TIMING_TAP' || stageCompleted || timingLocked) return;
    let animId: number;
    let lastTime = performance.now();
    const speed = (currentStage.cursorSpeed || 1.3) * 58; // units per second

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      setTimingCursor((prev) => {
        let next = prev + timingDirectionRef.current * speed * dt;
        if (next >= 98) {
          next = 98;
          timingDirectionRef.current = -1;
        } else if (next <= 2) {
          next = 2;
          timingDirectionRef.current = 1;
        }
        return next;
      });
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [currentStage.type, currentStage.cursorSpeed, stageCompleted, timingLocked]);

  // Calculate live scores
  const liveMaterialScore = Math.max(0, 60 - materialOrderPenalty);
  const livePrecisionScore = Math.max(0, 25 - precisionPenalty);
  const timeSpent = cake.timeLimitSeconds - timeLeft;
  const timeRatioRemaining = timeLeft / cake.timeLimitSeconds;
  const liveTimeScore =
    timeLeft === 0
      ? 2
      : timeRatioRemaining >= 0.45
      ? 15
      : Math.max(3, Math.round(15 * (timeRatioRemaining / 0.45)));
  const liveTotalScore = Math.max(
    0,
    Math.min(100, liveMaterialScore + livePrecisionScore + liveTimeScore)
  );

  // Advance to next stage or finish game
  const triggerStageSuccess = (customMessage?: string) => {
    if (stageCompleted) return;
    soundFX.playSuccess();
    setStageCompleted(true);
    setChefMood('excited');
    setFeedback({
      type: 'success',
      text: customMessage || 'Hebat! Langkah kamu tepat!',
    });

    setTimeout(() => {
      if (currentStageIdx + 1 < cake.stages.length) {
        setCurrentStageIdx((prev) => prev + 1);
      } else {
        soundFX.playFanfare();
        onFinishGame({
          totalScore: liveTotalScore,
          materialOrderScore: liveMaterialScore,
          miniGamePrecisionScore: livePrecisionScore,
          timeSpeedScore: liveTimeScore,
          timeSpentSeconds: Math.max(1, timeSpent),
          mistakesCount,
        });
      }
    }, 1350);
  };

  const triggerMistake = (
    category: 'material' | 'precision',
    pointsLost: number,
    message: string
  ) => {
    soundFX.playError();
    setChefMood('oops');
    setMistakesCount((prev) => prev + 1);
    if (category === 'material') {
      setMaterialOrderPenalty((prev) => Math.min(60, prev + pointsLost));
    } else {
      setPrecisionPenalty((prev) => Math.min(25, prev + pointsLost));
    }
    setFeedback({
      type: 'error',
      text: message,
    });
  };

  // --- HANDLERS FOR 1. MULTI_CHOICE ---
  const handleToggleChoice = (choiceId: string) => {
    if (stageCompleted) return;
    soundFX.playPop(540);
    setSelectedChoices((prev) =>
      prev.includes(choiceId)
        ? prev.filter((id) => id !== choiceId)
        : [...prev, choiceId]
    );
  };

  const handleVerifyMultiChoice = () => {
    if (stageCompleted || !currentStage.choices) return;
    const requiredCount = currentStage.requiredSelectCount || 4;
    if (selectedChoices.length !== requiredCount) {
      triggerMistake(
        'material',
        2,
        `Ups! Pilih tepat ${requiredCount} bahan yang sesuai resep (-2 poin).`
      );
      return;
    }
    const allCorrect = selectedChoices.every((id) => {
      const item = currentStage.choices?.find((c) => c.id === id);
      return item?.isCorrect;
    });

    if (allCorrect) {
      triggerStageSuccess('Hebat! Langkah kamu tepat! Semua takaran bahan akurat.');
    } else {
      triggerMistake(
        'material',
        5,
        'Ups! Ada bahan yang tidak sesuai resep tradisional ini (-5 poin). Coba periksa kembali!'
      );
    }
  };

  // --- HANDLERS FOR 2. DRAG_DROP ---
  const handleDropIngredient = (itemId: string) => {
    if (stageCompleted || !currentStage.dragItems) return;
    if (droppedItemIds.includes(itemId)) return;

    const item = currentStage.dragItems.find((d) => d.id === itemId);
    if (!item) return;

    if (!item.isRequired) {
      triggerMistake(
        'material',
        5,
        `Ups! "${item.label}" bukan bahan untuk tahap ini (-5 poin).`
      );
      return;
    }

    soundFX.playPop(640);
    const nextDropped = [...droppedItemIds, itemId];
    setDroppedItemIds(nextDropped);
    setChefMood('happy');
    setFeedback({
      type: 'info',
      text: `${item.label} (${item.sublabel}) berhasil dimasukkan ke wadah!`,
    });

    const requiredTotal = currentStage.dragItems.filter((d) => d.isRequired).length;
    if (nextDropped.length >= requiredTotal) {
      triggerStageSuccess('Hebat! Langkah kamu tepat! Seluruh bahan telah masuk ke wadah.');
    }
  };

  // --- HANDLERS FOR 3. STIRRING ---
  const handleStirStep = (increment = 0.65, speedBoost = 22) => {
    if (stageCompleted || currentStage.type !== 'STIRRING') return;
    const target = currentStage.targetRotations || 10;
    soundFX.playStirTick();
    setWhiskAngle((prev) => (prev + 42) % 360);

    const nextSpeed = Math.min(100, stirSpeed + speedBoost);
    setStirSpeed(nextSpeed);

    setStirProgress((prev) => {
      const next = Math.min(target, +(prev + increment).toFixed(2));
      if (next >= target) {
        setTimeout(() => {
          triggerStageSuccess('Hebat! Langkah kamu tepat! Adonan tercampur rata & kalis.');
        }, 120);
      }
      return next;
    });
  };

  const handleBowlPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || stageCompleted || !bowlRef.current) return;
    const rect = bowlRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

    if (lastAngleRef.current !== null) {
      let delta = Math.abs(angle - lastAngleRef.current);
      if (delta > 180) delta = 360 - delta;
      if (delta > 14) {
        lastAngleRef.current = angle;
        handleStirStep(delta / 210, 14);
      }
    } else {
      lastAngleRef.current = angle;
    }
  };

  // --- HANDLERS FOR 4. TIMING_TAP ---
  const handleTimingTap = () => {
    if (stageCompleted || timingLocked || currentStage.type !== 'TIMING_TAP') return;
    const start = currentStage.greenZoneStart ?? 58;
    const end = currentStage.greenZoneEnd ?? 80;

    soundFX.playSizzle();
    if (timingCursor >= start && timingCursor <= end) {
      setTimingLocked(true);
      triggerStageSuccess('Hebat! Langkah kamu tepat! Tingkat kematangan sangat presisi.');
    } else if (timingCursor < start) {
      triggerMistake(
        'precision',
        4,
        'Ups! Kue masih setengah matang! Tunggu indikator masuk ke Zona Hijau (-4 poin).'
      );
    } else {
      triggerMistake(
        'precision',
        4,
        'Ups! Hampir gosong! Tekan tepat saat indikator berada di Zona Hijau (-4 poin).'
      );
    }
  };

  // --- HANDLERS FOR 5. SEQUENCING ---
  const handleSelectSequenceStep = (item: SequenceStepItem) => {
    if (stageCompleted || selectedSequenceIds.includes(item.id)) return;
    const expectedOrder = selectedSequenceIds.length + 1;

    if (item.correctOrder === expectedOrder) {
      soundFX.playPop(580 + expectedOrder * 70);
      const next = [...selectedSequenceIds, item.id];
      setSelectedSequenceIds(next);
      setChefMood('happy');
      setFeedback({
        type: 'info',
        text: `Langkah #${expectedOrder} tepat! Lanjutkan langkah berikutnya.`,
      });

      const totalSteps = currentStage.sequenceItems?.length || 4;
      if (next.length >= totalSteps) {
        triggerStageSuccess('Hebat! Langkah kamu tepat! Urutan prosedur kerja 100% akurat.');
      }
    } else {
      triggerMistake(
        'material',
        5,
        'Ups! Urutannya kurang tepat (-5 poin). Pikirkan tahap persiapan hingga penyajian!'
      );
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#FFF9ED] text-[#3E2723] flex flex-col">
      {/* Top Game HUD Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 border-b border-[#E6D5B8] px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back & Active Cake Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExitToMenu}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D6C1A0] bg-white hover:bg-[#FEF3C7] text-xs font-semibold text-[#5D4037] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Pilih Kue
            </button>
            <div>
              <div className="text-xs text-[#8D6E63] font-medium">
                Koki: <span className="font-bold text-[#3E2723]">{nickname}</span> · {cake.region}
              </div>
              <h1 className="text-base sm:text-lg font-bold text-[#3E2723] leading-tight">
                {cake.name}
              </h1>
            </div>
          </div>

          {/* Center: Stage Progress Steps */}
          <div className="flex items-center gap-2">
            {cake.stages.map((st, idx) => {
              const isDone = idx < currentStageIdx || (idx === currentStageIdx && stageCompleted);
              const isCurrent = idx === currentStageIdx;
              return (
                <div
                  key={st.id}
                  className={`h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? 'w-10 bg-[#D97706]'
                      : isDone
                      ? 'w-6 bg-[#15803D]'
                      : 'w-6 bg-[#E6D5B8]'
                  }`}
                  title={st.title}
                />
              );
            })}
            <span className="ml-2 text-xs font-semibold text-[#6D4C41] font-mono-tabular">
              Tahap {currentStageIdx + 1}/{cake.stages.length}
            </span>
          </div>

          {/* Right: Live Timer, Transparent Score & Recipe Sheet Toggle */}
          <div className="flex items-center gap-2.5">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono-tabular text-sm font-bold ${
                timeLeft <= 25
                  ? 'bg-[#FEE2E2] border-[#EF4444] text-[#B91C1C]'
                  : 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ECFDF5] border border-[#10B981]/40 text-xs font-semibold text-[#065F46] font-mono-tabular">
              <span>Skor: {liveTotalScore}/100</span>
            </div>

            <button
              onClick={() => setIsRecipeDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#78350F] hover:bg-[#92400E] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lihat Resep
            </button>

            <button
              onClick={onToggleMute}
              className="p-2 rounded-lg border border-[#D6C1A0] bg-white hover:bg-[#FEF3C7] text-[#5D4037] transition-colors cursor-pointer"
              aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Kitchen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Chef Sari Assistant, Live 3-Component Rubric & Tips */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Chef Sari Card */}
          <div className="bg-white rounded-2xl border border-[#E6D5B8] p-5 shadow-xs">
            <div className="flex items-center gap-4">
              <ChefCharacter mood={chefMood} className="w-24 h-24 shrink-0 animate-float-slow" />
              <div>
                <div className="text-xs font-bold text-[#D97706]">
                  Instruktur Dapur Nusantara
                </div>
                <h2 className="text-lg font-bold text-[#3E2723]">Chef Sari</h2>
                <p className="text-xs text-[#6D4C41] mt-1 leading-relaxed">
                  &ldquo;{currentStage.chefTip}&rdquo;
                </p>
              </div>
            </div>

            {/* Dynamic Feedback Alert */}
            {feedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-semibold transition-all ${
                  feedback.type === 'success'
                    ? 'bg-[#DCFCE7] border-[#16A34A] text-[#14532D]'
                    : feedback.type === 'error'
                    ? 'bg-[#FEE2E2] border-[#DC2626] text-[#991B1B]'
                    : 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                ) : feedback.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>

          {/* Transparent 3-Component Score Meter */}
          <div className="bg-white rounded-2xl border border-[#E6D5B8] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3E2723]">
                Rincian Evaluasi Langsung
              </h3>
              <span className="text-sm font-bold text-[#15803D] font-mono-tabular">
                {liveTotalScore} / 100 Poin
              </span>
            </div>

            {/* Component 1: 60 pts */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#5D4037] font-medium">Ketepatan Urutan & Bahan</span>
                <span className="font-mono-tabular font-bold text-[#3E2723]">
                  {liveMaterialScore} / 60
                </span>
              </div>
              <div className="w-full h-2 bg-[#F5EBE0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#15803D] transition-all"
                  style={{ width: `${(liveMaterialScore / 60) * 100}%` }}
                />
              </div>
            </div>

            {/* Component 2: 25 pts */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#5D4037] font-medium">Presisi Mini-Game</span>
                <span className="font-mono-tabular font-bold text-[#3E2723]">
                  {livePrecisionScore} / 25
                </span>
              </div>
              <div className="w-full h-2 bg-[#F5EBE0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D97706] transition-all"
                  style={{ width: `${(livePrecisionScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Component 3: 15 pts */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#5D4037] font-medium">Kecepatan Waktu</span>
                <span className="font-mono-tabular font-bold text-[#3E2723]">
                  {liveTimeScore} / 15
                </span>
              </div>
              <div className="w-full h-2 bg-[#F5EBE0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0284C7] transition-all"
                  style={{ width: `${(liveTimeScore / 15) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#F3E8D6] flex items-center justify-between text-xs text-[#795548]">
              <span>Indikator Keberhasilan:</span>
              <span className="font-mono-tabular">Kesalahan: {mistakesCount}x</span>
            </div>
            <p className="text-xs text-[#6D4C41] leading-relaxed">
              {cake.successIndicator}
            </p>
          </div>
        </aside>

        {/* Right Column (8 cols): Active Interactive Mini-Game Table */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-[#E6D5B8] p-5 sm:p-7 shadow-xs">
          {/* Stage Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#F3E8D6]">
            <div>
              <div className="text-xs font-semibold text-[#D97706]">
                {currentStage.type === 'MULTI_CHOICE' && 'Mekanisme 1 · Seleksi Takaran Bahan Baku'}
                {currentStage.type === 'DRAG_DROP' && 'Mekanisme 2 · Drag & Drop Bahan ke Wadah'}
                {currentStage.type === 'STIRRING' && 'Mekanisme 3 · Speed Gauge & Mengaduk Adonan'}
                {currentStage.type === 'TIMING_TAP' && 'Mekanisme 4 · Timing Bar Kematangan Kue'}
                {currentStage.type === 'SEQUENCING' && 'Mekanisme 5 · Mengurutkan Prosedur Praktikum'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3E2723] mt-0.5">
                {currentStage.title}
              </h2>
            </div>
            <CakeIllustration cakeId={cake.id} className="w-24 h-16 shrink-0" />
          </div>

          {/* Instruction Callout */}
          <div className="my-4 p-3.5 rounded-xl bg-[#FFF9ED] border border-[#F59E0B]/40 text-sm font-medium text-[#4E342E]">
            {currentStage.instruction}
          </div>

          {/* ==============================================================
              MINI-GAME 1: MULTI-CHOICE MATERIAL
             ============================================================== */}
          {currentStage.type === 'MULTI_CHOICE' && currentStage.choices && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentStage.choices.map((choice) => {
                  const isSelected = selectedChoices.includes(choice.id);
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleToggleChoice(choice.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#D97706] bg-[#FEF3C7]/70 shadow-xs'
                          : 'border-[#E6D5B8] bg-[#FFFDF9] hover:border-[#D97706]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#E6D5B8] flex items-center justify-center shrink-0">
                          <IngredientIcon type={choice.iconType} className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#3E2723]">
                            {choice.name}
                          </div>
                          <div className="text-xs text-[#8D6E63] font-mono-tabular mt-0.5">
                            Takaran: {choice.amount}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'border-[#D97706] bg-[#D97706] text-white'
                            : 'border-[#C8B296] bg-white'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs font-semibold text-[#6D4C41] font-mono-tabular">
                  Terpilih: {selectedChoices.length} / {currentStage.requiredSelectCount || 4} bahan
                </span>
                <button
                  type="button"
                  onClick={handleVerifyMultiChoice}
                  disabled={stageCompleted}
                  className="px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  Periksa Takaran Bahan
                </button>
              </div>
            </div>
          )}

          {/* ==============================================================
              MINI-GAME 2: DRAG AND DROP INGREDIENTS INTO BOWL/POT
             ============================================================== */}
          {currentStage.type === 'DRAG_DROP' && currentStage.dragItems && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left: Draggable / Tappable Ingredients Tray */}
              <div className="md:col-span-6 space-y-2.5">
                <div className="text-xs font-bold text-[#6D4C41] mb-1">
                  Meja Bahan (Seret ke wadah atau Klik/Ketuk untuk memasukkan):
                </div>
                {currentStage.dragItems.map((item) => {
                  const isAdded = droppedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      draggable={!isAdded && !stageCompleted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      onClick={() => !isAdded && handleDropIngredient(item.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
                        isAdded
                          ? 'border-[#16A34A]/40 bg-[#DCFCE7]/50 opacity-60 cursor-default'
                          : 'border-[#E6D5B8] bg-[#FFFDF9] hover:border-[#D97706] cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-[#E6D5B8] flex items-center justify-center shrink-0">
                          <IngredientIcon type={item.iconType} className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#3E2723]">{item.label}</div>
                          <div className="text-xs text-[#795548] font-mono-tabular">
                            {item.sublabel}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#D97706]">
                        {isAdded ? 'Sudah Masuk ✓' : '+ Masukkan'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right: Animated Kitchen Vessel Drop Zone */}
              <div className="md:col-span-6">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverVessel(true);
                  }}
                  onDragLeave={() => setDragOverVessel(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverVessel(false);
                    const id = e.dataTransfer.getData('text/plain');
                    if (id) handleDropIngredient(id);
                  }}
                  className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center min-h-[270px] transition-all ${
                    dragOverVessel
                      ? 'border-[#15803D] bg-[#DCFCE7]/40 scale-[1.01]'
                      : 'border-[#D97706] bg-[#FFF9ED]'
                  }`}
                >
                  {/* Animated Mixing Bowl / Cooking Pot SVG */}
                  <svg viewBox="0 0 200 140" className="w-48 h-36">
                    {/* Rim */}
                    <ellipse cx="100" cy="48" rx="74" ry="18" fill="#FEF3C7" stroke="#92400E" strokeWidth="3" />
                    {/* Dropped ingredients inside bowl */}
                    {droppedItemIds.map((id, i) => {
                      const found = currentStage.dragItems?.find((d) => d.id === id);
                      return (
                        <ellipse
                          key={id}
                          cx={72 + (i % 3) * 26}
                          cy={50 - (i % 2) * 3}
                          rx="18"
                          ry="7"
                          fill={found?.color || '#F59E0B'}
                        />
                      );
                    })}
                    {/* Bowl Body */}
                    <path
                      d="M26 48 C30 118, 170 118, 174 48 Z"
                      fill="#D97706"
                      fillOpacity="0.88"
                      stroke="#78350F"
                      strokeWidth="3"
                    />
                    <path d="M50 74 Q100 90 150 74" stroke="#FEF08A" strokeWidth="2.5" fill="none" />
                  </svg>

                  <div className="text-sm font-bold text-[#3E2723] mt-2">
                    {currentStage.targetContainerLabel || 'Wadah Adonan'}
                  </div>
                  <div className="text-xs text-[#795548] mt-1 font-mono-tabular">
                    Bahan Masuk: {droppedItemIds.length} /{' '}
                    {currentStage.dragItems.filter((d) => d.isRequired).length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              MINI-GAME 3: SPEED GAUGE / STIRRING ACTION
             ============================================================== */}
          {currentStage.type === 'STIRRING' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left: Circular Interactive Mixing Bowl */}
              <div className="md:col-span-7 flex flex-col items-center">
                <div
                  ref={bowlRef}
                  onPointerDown={() => {
                    isPointerDownRef.current = true;
                  }}
                  onPointerUp={() => {
                    isPointerDownRef.current = false;
                    lastAngleRef.current = null;
                  }}
                  onPointerLeave={() => {
                    isPointerDownRef.current = false;
                    lastAngleRef.current = null;
                  }}
                  onPointerMove={handleBowlPointerMove}
                  onClick={() => handleStirStep(1.0, 26)}
                  className="relative w-64 h-64 rounded-full border-8 border-[#92400E] bg-[#FEF3C7] shadow-inner flex items-center justify-center cursor-pointer select-none touch-none"
                >
                  {/* Dynamic Batter Color swirl */}
                  <div
                    className="w-52 h-52 rounded-full transition-transform duration-150 flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${
                        currentStage.batterColorEnd || '#F59E0B'
                      } ${Math.min(
                        100,
                        Math.round((stirProgress / (currentStage.targetRotations || 10)) * 100)
                      )}%, ${currentStage.batterColorStart || '#FEF9C3'} 100%)`,
                      transform: `rotate(${whiskAngle}deg)`,
                    }}
                  >
                    {/* Swirl lines */}
                    <svg viewBox="0 0 120 120" className="w-40 h-40">
                      <path
                        d="M60 20 C85 20, 100 45, 90 70 C80 95, 45 100, 30 75 C18 55, 35 35, 55 40"
                        stroke="#78350F"
                        strokeOpacity="0.35"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="60" cy="60" r="9" fill="#78350F" fillOpacity="0.25" />
                    </svg>
                  </div>

                  {/* Center Whisk Badge */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="px-3 py-1.5 rounded-full bg-white/90 border border-[#D97706] text-xs font-bold text-[#78350F] shadow-xs flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4 text-[#D97706]" />
                      Putar / Ketuk Aduk
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#6D4C41] mt-3 text-center">
                  Gerakkan kursor/jari memutar di atas mangkuk atau tekan tombol aduk di samping.
                </p>
              </div>

              {/* Right: Speed Gauge & Progress Meter */}
              <div className="md:col-span-5 space-y-4 bg-[#FFF9ED] p-5 rounded-2xl border border-[#E6D5B8]">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#5D4037] mb-1">
                    <span>Meteran Kecepatan Aduk</span>
                    <span className="text-[#15803D]">{currentStage.idealSpeedLabel}</span>
                  </div>
                  <div className="w-full h-4 bg-[#E6D5B8] rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        stirSpeed > 85
                          ? 'bg-[#DC2626]'
                          : stirSpeed >= 30
                          ? 'bg-[#16A34A]'
                          : 'bg-[#F59E0B]'
                      }`}
                      style={{ width: `${stirSpeed}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#5D4037] mb-1">
                    <span>Kekalisan Adonan</span>
                    <span className="font-mono-tabular">
                      {Math.floor(stirProgress)} / {currentStage.targetRotations || 10} Putaran
                    </span>
                  </div>
                  <div className="w-full h-4 bg-[#E6D5B8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D97706] transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (stirProgress / (currentStage.targetRotations || 10)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStirStep(1.25, 28)}
                  disabled={stageCompleted}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Hand className="w-4 h-4" />
                  Aduk Adonan Sekarang (+1 Putaran)
                </button>
              </div>
            </div>
          )}

          {/* ==============================================================
              MINI-GAME 4: TIMING BAR TAP (COOKING / STEAMING / BAKING)
             ============================================================== */}
          {currentStage.type === 'TIMING_TAP' && (
            <div className="space-y-6">
              {/* Visual Stove / Steamer / Oven Simulation */}
              <div className="p-6 rounded-2xl bg-[#FFF9ED] border border-[#E6D5B8] flex flex-col items-center justify-center">
                <div className="relative flex flex-col items-center">
                  {/* Rising steam */}
                  <div className="flex gap-5 mb-1">
                    <span className="w-2 h-5 rounded-full bg-[#D97706]/30 animate-steam-1" />
                    <span className="w-2 h-6 rounded-full bg-[#D97706]/40 animate-steam-2" />
                    <span className="w-2 h-5 rounded-full bg-[#D97706]/30 animate-steam-3" />
                  </div>
                  <CakeIllustration cakeId={cake.id} className="w-44 h-32" />
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#EA580C]">
                    <Flame className="w-4 h-4 fill-[#EA580C]" />
                    <span>Proses Memasak Sedang Berlangsung...</span>
                  </div>
                </div>
              </div>

              {/* Timing Bar with Green Target Zone */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#8D6E63]">Mentah</span>
                  <span className="text-[#15803D]">ZONA MATANG SEMPURNA (HIJAU)</span>
                  <span className="text-[#DC2626]">Gosong</span>
                </div>

                <div className="relative w-full h-10 rounded-xl bg-[#F5EBE0] border-2 border-[#92400E] overflow-hidden">
                  {/* Green Target Zone */}
                  <div
                    className="absolute top-0 bottom-0 bg-[#22C55E]/85 border-x-2 border-[#14532D] flex items-center justify-center text-[11px] font-extrabold text-white"
                    style={{
                      left: `${currentStage.greenZoneStart ?? 58}%`,
                      width: `${
                        (currentStage.greenZoneEnd ?? 80) -
                        (currentStage.greenZoneStart ?? 58)
                      }%`,
                    }}
                  >
                    TEPAT
                  </div>

                  {/* Moving Indicator Needle */}
                  <div
                    className="absolute top-0 bottom-0 w-2.5 bg-[#3E2723] shadow-md rounded-xs"
                    style={{
                      left: `calc(${timingCursor}% - 5px)`,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleTimingTap}
                  disabled={stageCompleted}
                  className="w-full sm:w-auto min-w-[290px] py-4 px-8 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-extrabold text-base shadow-sm transition-all cursor-pointer"
                >
                  {currentStage.timingActionLabel || 'ANGKAT KUE SEKARANG!'}
                </button>
              </div>
            </div>
          )}

          {/* ==============================================================
              MINI-GAME 5: SEQUENCING (ORDERING PRACTICAL STEPS)
             ============================================================== */}
          {currentStage.type === 'SEQUENCING' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#6D4C41]">
                <span>Ketuk kartu langkah dari urutan 1 sampai {shuffledSequenceItems.length}:</span>
                <span className="font-mono-tabular text-[#15803D]">
                  Urutan Selesai: {selectedSequenceIds.length} / {shuffledSequenceItems.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {shuffledSequenceItems.map((item) => {
                  const orderIndex = selectedSequenceIds.indexOf(item.id);
                  const isPicked = orderIndex !== -1;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSequenceStep(item)}
                      disabled={isPicked || stageCompleted}
                      className={`w-full p-4 rounded-xl border-2 text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                        isPicked
                          ? 'border-[#16A34A] bg-[#DCFCE7]/60 text-[#14532D]'
                          : 'border-[#E6D5B8] bg-[#FFFDF9] hover:border-[#D97706]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono-tabular font-bold text-sm shrink-0 ${
                          isPicked
                            ? 'bg-[#15803D] text-white'
                            : 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]'
                        }`}
                      >
                        {isPicked ? orderIndex + 1 : '?'}
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{item.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Authentic Recipe Reference Modal / Drawer */}
      {isRecipeDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-[#D97706] rounded-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E6D5B8] pb-4">
              <div>
                <div className="text-xs font-bold text-[#D97706]">
                  Buku Resep & Modul Praktikum Nusantara
                </div>
                <h3 className="text-2xl font-bold text-[#3E2723]">{cake.name}</h3>
                <p className="text-xs text-[#6D4C41] mt-0.5">
                  Asal: {cake.region} · Perkiraan Hasil: {cake.yieldText}
                </p>
              </div>
              <button
                onClick={() => setIsRecipeDrawerOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#3E2723] text-white text-xs font-bold cursor-pointer"
              >
                Tutup Resep
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cake.ingredientGroups.map((grp, i) => (
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
              <h4 className="text-sm font-bold text-[#3E2723]">Prosedur Kerja Akurat:</h4>
              <ol className="space-y-1.5 text-xs text-[#4E342E] list-decimal list-inside">
                {cake.procedureSummary.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 text-xs text-[#065F46] space-y-1">
              <div className="font-bold">Tips Praktik:</div>
              <p>{cake.practicalTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
