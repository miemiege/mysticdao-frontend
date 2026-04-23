import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GUA64_LIST } from '@/data/gua64';

interface FortunePKProps {
  userGuaName?: string;
  userScore?: number;
  userScores?: Record<string, number>;
}

const FortunePK: React.FC<FortunePKProps> = ({
  userGuaName = '乾为天',
  userScore = 78,
  userScores = { career: 82, love: 75, wealth: 70, health: 85, study: 80 }
}) => {
  const [opponentGua, setOpponentGua] = useState(GUA64_LIST[0]);
  const [showResult, setShowResult] = useState(false);

  // Generate opponent scores deterministically based on gua
  const seed = opponentGua.number * 13 + 7;
  const rand = (n: number) => ((seed * (n + 1) * 9301 + 49297) % 233280) / 233280;
  const oppScore = 55 + Math.floor(rand(0) * 40);
  const oppScores = {
    career: 55 + Math.floor(rand(1) * 40),
    love: 55 + Math.floor(rand(2) * 40),
    wealth: 55 + Math.floor(rand(3) * 40),
    health: 55 + Math.floor(rand(4) * 40),
    study: 55 + Math.floor(rand(5) * 40)
  };

  const dimensions = [
    { key: 'total', label: '总分', user: userScore, opp: oppScore },
    { key: 'career', label: '事业', user: userScores.career, opp: oppScores.career },
    { key: 'love', label: '感情', user: userScores.love, opp: oppScores.love },
    { key: 'wealth', label: '财富', user: userScores.wealth, opp: oppScores.wealth },
    { key: 'health', label: '健康', user: userScores.health, opp: oppScores.health },
    { key: 'study', label: '学业', user: userScores.study ?? 75, opp: oppScores.study },
  ];

  const userWins = dimensions.filter(d => d.user > d.opp).length;
  const resultText = userWins >= 3 ? '您的运势更胜一筹 ✨' : '对手运势略占上风 ⚡';

  const userColor = '#C8A45C';
  const oppColor = '#8B7355';

  return (
    <div className="w-full">
      {/* 选择对手 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 text-center p-4 rounded-2xl border border-gold/10 bg-gold/[0.03]">
          <div className="text-xs text-gold/50 mb-2">您的卦象</div>
          <div className="text-2xl font-bold text-gold">{userGuaName}</div>
          <div className="text-sm text-gold/60">Score: {userScore}</div>
        </div>
        <div className="text-3xl font-bold text-gold/40">VS</div>
        <div className="flex-1">
          <select
            value={opponentGua.name}
            onChange={(e) => {
              const selected = GUA64_LIST.find(g => g.name === e.target.value);
              if (selected) {
                setOpponentGua(selected);
                setShowResult(false);
              }
            }}
            className="w-full p-4 rounded-2xl border border-gold/10 bg-gold/[0.03] text-gold text-center appearance-none cursor-pointer outline-none focus:border-gold/30"
          >
            {GUA64_LIST.map(g => (
              <option key={g.name} value={g.name} className="bg-black text-gold">
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setShowResult(true)}
        className="w-full py-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm hover:bg-gold/20 transition-all mb-8"
      >
        开始对比
      </button>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* 3D八卦装饰 */}
          <div className="flex justify-center mb-6">
            <img
              src="/bagua-3d.png"
              alt=""
              className="w-24 h-24 object-contain opacity-30"
              aria-hidden="true"
            />
          </div>

          {/* 6维度对比 */}
          <div className="space-y-4">
            {dimensions.map((d, i) => {
              const userPct = d.user;
              const oppPct = d.opp;
              const isUserWin = d.user > d.opp;

              return (
                <motion.div
                  key={d.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-10 text-right">
                      {d.label}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      {/* User bar */}
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: userColor,
                            boxShadow: isUserWin ? '0 0 8px rgba(200,164,92,0.3)' : 'none',
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${userPct}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.3 + i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                      <span className="text-xs text-gold w-6 text-right">
                        {d.user}
                      </span>
                      <span className="text-xs text-text-muted/50">vs</span>
                      <span className="text-xs text-white/40 w-6">
                        {d.opp}
                      </span>
                      {/* Opponent bar */}
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: oppColor,
                            boxShadow: !isUserWin ? '0 0 8px rgba(139,115,85,0.3)' : 'none',
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${oppPct}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.3 + i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 结果 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <span className="text-gold text-lg font-bold">{resultText}</span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FortunePK;
