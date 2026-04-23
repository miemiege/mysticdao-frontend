import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { GUA64_LIST } from '@/data/gua64';
import { getWuxingRelation } from '@/data/wuxing';

interface PKData {
  hexagramNumber: number;
  score: number;
  changingLines: number[];
  date: string;
}

interface FortunePKProps {
  opponentData: PKData;
}

function getHexagramSymbol(name: string): string {
  const map: Record<string, string> = {
    '乾为天': '☰',
    '坤为地': '☷',
    '水雷屯': '☵☳',
    '山水蒙': '☶☵',
    '水天需': '☵☰',
    '天水讼': '☰☵',
    '地水师': '☷☵',
    '水地比': '☵☷',
  };
  const gua = GUA64_LIST.find((g) => g.name === name);
  return gua?.symbol || map[name] || '☯';
}

const cnToEn: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water',
};

const FortunePK: React.FC<FortunePKProps> = ({ opponentData }) => {
  const [myData, setMyData] = useState<PKData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mysticdao_state');
      if (raw) {
        const state = JSON.parse(raw);
        if (state?.daily?.fortune && state?.daily?.lastDrawDate) {
          const fortune = state.daily.fortune as any;
          setMyData({
            hexagramNumber: GUA64_LIST.find((g) => g.name === fortune.card?.name)?.number || 1,
            score: fortune.overallScore || 0,
            changingLines: fortune.changingLines || [],
            date: state.daily.lastDrawDate,
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const opponentGua = GUA64_LIST.find((g) => g.number === opponentData.hexagramNumber);
  const myGua = myData ? GUA64_LIST.find((g) => g.number === myData.hexagramNumber) : null;

  const relation = useMemo(() => {
    if (!myGua || !opponentGua) return null;
    const a = cnToEn[myGua.element];
    const b = cnToEn[opponentGua.element];
    if (!a || !b) return null;
    return getWuxingRelation(a, b);
  }, [myGua, opponentGua]);

  const resultText = useMemo(() => {
    if (!relation || !myGua || !opponentGua) return '';
    const aName = myGua.name;
    const bName = opponentGua.name;
    const aEl = myGua.element;
    const bEl = opponentGua.element;

    switch (relation) {
      case '生':
        return `你的${aName}（${aEl}）滋养了对方的${bName}（${bEl}），今日运势你占上风！`;
      case '克':
        return `你的${aName}（${aEl}）克制了对方的${bName}（${bEl}），今日运势你占上风！`;
      case '被生':
        return `对方的${bName}（${bEl}）滋养了你的${aName}（${aEl}），今日需低调行事`;
      case '被克':
        return `对方的${bName}（${bEl}）压制了你的${aName}（${aEl}），今日需低调行事`;
      case '同':
        return `同气相求，志趣相投。你们的${aName}与${bName}同属${aEl}，今日势均力敌`;
      default:
        return '';
    }
  }, [relation, myGua, opponentGua]);

  const winText = useMemo(() => {
    if (!myData) return '';
    const myScore = myData.score;
    const opScore = opponentData.score;
    if (myScore > opScore) {
      const beatPercent = Math.min(99, Math.max(50, Math.round(50 + (myScore - opScore) * 1.5)));
      return `你的运势击败了 ${beatPercent}% 的朋友`;
    } else if (myScore < opScore) {
      const beatPercent = Math.min(49, Math.max(1, Math.round(50 - (opScore - myScore) * 1.5)));
      return `你的运势击败了 ${beatPercent}% 的朋友`;
    }
    return `你的运势击败了 50% 的朋友`;
  }, [myData, opponentData]);

  const handleCopyLink = () => {
    if (!myData) {
      toast.info('请先抽今日运势');
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}#/daily?pk=${btoa(JSON.stringify(myData))}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('反击链接已复制');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        {/* 用户 A (对手/链接主人) */}
        <div className="flex-1 text-center">
          <div className="text-3xl mb-2">{getHexagramSymbol(opponentGua?.name || '')}</div>
          <div className="text-sm font-bold text-white">{opponentGua?.name || '未知'}</div>
          <div className="text-xs text-text-muted mt-1">{opponentGua?.element || ''}行</div>
          <div className="text-2xl font-bold text-gold mt-2">{opponentData.score}</div>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-lg">
            VS
          </div>
        </div>

        {/* 用户 B (当前用户) */}
        <div className="flex-1 text-center">
          {myData ? (
            <>
              <div className="text-3xl mb-2">{getHexagramSymbol(myGua?.name || '')}</div>
              <div className="text-sm font-bold text-white">{myGua?.name || '未知'}</div>
              <div className="text-xs text-text-muted mt-1">{myGua?.element || ''}行</div>
              <div className="text-2xl font-bold text-gold mt-2">{myData.score}</div>
            </>
          ) : (
            <div className="py-4">
              <div className="text-3xl text-text-muted mb-2">?</div>
              <div className="text-xs text-text-muted">今日未抽卦</div>
            </div>
          )}
        </div>
      </div>

      {myData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-sm text-text-secondary leading-relaxed mb-2">{resultText}</p>
          <p className="text-xs text-gold/70">{winText}</p>
        </motion.div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/30 text-sm text-gold hover:bg-gold/10 transition-all"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {myData ? '生成我的反击链接' : '先去抽今日运势'}
        </button>
      </div>
    </div>
  );
};

export default FortunePK;
