import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, Zap, Crown, Sparkles } from 'lucide-react';

interface PricingTier {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  icon: React.ReactNode;
  features: { text: string; included: boolean }[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: '免费体验',
    price: { monthly: 0, yearly: 0 },
    description: '初识灵枢，感受 AI 玄学魅力',
    icon: <Sparkles size={24} />,
    features: [
      { text: '每日一卦（1次/天）', included: true },
      { text: '塔罗单牌阵', included: true },
      { text: '基础八字排盘', included: true },
      { text: 'AI 解读（精简版）', included: true },
      { text: '多牌阵塔罗', included: false },
      { text: '深度八字分析', included: false },
      { text: '八字合婚', included: false },
      { text: '优先 AI 通道', included: false },
      { text: '专属客服', included: false },
    ],
    cta: '免费开始',
  },
  {
    name: '灵枢 Pro',
    price: { monthly: 29, yearly: 290 },
    description: '深度探索，解锁全部功能',
    icon: <Zap size={24} />,
    features: [
      { text: '每日一卦（无限次）', included: true },
      { text: '全部塔罗牌阵', included: true },
      { text: '深度八字排盘', included: true },
      { text: 'AI 解读（完整版）', included: true },
      { text: '多牌阵塔罗', included: true },
      { text: '深度八字分析', included: true },
      { text: '八字合婚', included: true },
      { text: '优先 AI 通道', included: false },
      { text: '专属客服', included: false },
    ],
    cta: '选择 Pro',
    highlighted: true,
    badge: '推荐',
  },
  {
    name: '灵枢 Master',
    price: { monthly: 99, yearly: 990 },
    description: '大师级体验，尊享一切',
    icon: <Crown size={24} />,
    features: [
      { text: '每日一卦（无限次）', included: true },
      { text: '全部塔罗牌阵', included: true },
      { text: '大师级八字排盘', included: true },
      { text: 'AI 解读（大师版）', included: true },
      { text: '多牌阵塔罗', included: true },
      { text: '深度八字分析', included: true },
      { text: '八字合婚', included: true },
      { text: '优先 AI 通道', included: true },
      { text: '1对1 专属客服', included: true },
    ],
    cta: '选择 Master',
  },
];

const faqs = [
  { q: '可以随时取消订阅吗？', a: '可以。您可以随时在账户设置中取消订阅，取消后将在当前计费周期结束后失效，不会自动续费。' },
  { q: '年付和月付有什么区别？', a: '年付享受 10 个月价格用 12 个月的优惠，相当于节省约 17%。推荐长期使用者选择年付。' },
  { q: '免费版和付费版有什么区别？', a: '免费版提供基础的每日一卦、单牌阵塔罗和八字排盘。付费版解锁全部牌阵、深度分析和 AI 完整解读。' },
  { q: '如何获得优先 AI 通道？', a: '灵枢 Master 会员专享优先 AI 通道，在高峰期可大幅减少等待时间。' },
  { q: '支持哪些支付方式？', a: '目前支持微信支付、支付宝和银行卡支付。所有支付均通过安全的第三方支付通道完成。' },
];

function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    let current = 0;
    const increment = value / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  return <span className="tabular-nums">{display}</span>;
}

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              选择你的灵枢方案
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
              从免费体验到大师尊享，找到最适合你的 AI 玄学之旅
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1.5 rounded-full border border-border-subtle bg-bg-card">
              <button
                onClick={() => setIsYearly(false)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: !isYearly ? '#FFFFFF' : 'transparent',
                  color: !isYearly ? '#000000' : '#888888',
                }}
              >
                月付
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03] flex items-center gap-2"
                style={{
                  background: isYearly ? '#FFFFFF' : 'transparent',
                  color: isYearly ? '#000000' : '#888888',
                }}
              >
                年付
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: isYearly ? 'rgba(0,0,0,0.15)' : 'rgba(74,222,128,0.15)',
                    color: isYearly ? '#000' : '#4ADE80',
                  }}
                >
                  省17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative flex flex-col rounded-xl border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: tier.highlighted ? '#0D0D0D' : '#0A0A0A',
                  borderColor: tier.highlighted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                  boxShadow: tier.highlighted ? '0 0 40px rgba(255,255,255,0.06)' : 'none',
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-xs font-bold rounded-full">
                    {tier.badge}
                  </div>
                )}

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-text-secondary">{tier.icon}</div>
                      <h3 className="text-xl font-semibold text-text-primary">{tier.name}</h3>
                    </div>
                    <p className="text-sm text-text-muted">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      {tier.price.monthly > 0 ? (
                        <>
                          <span className="text-lg text-text-muted">¥</span>
                          <span className="text-5xl font-bold text-text-primary tracking-tight">
                            <AnimatedPrice value={isYearly ? tier.price.yearly : tier.price.monthly} />
                          </span>
                          <span className="text-text-muted ml-1">
                            /{isYearly ? '年' : '月'}
                          </span>
                        </>
                      ) : (
                        <span className="text-5xl font-bold text-text-primary tracking-tight">免费</span>
                      )}
                    </div>
                    {isYearly && tier.price.yearly > 0 && (
                      <p className="text-sm text-text-muted mt-1">
                        相当于 ¥{Math.round(tier.price.yearly / 12)}/月
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    className="w-full py-3.5 rounded-pill font-semibold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] mb-8"
                    style={{
                      background: tier.highlighted ? '#FFFFFF' : 'transparent',
                      color: tier.highlighted ? '#000000' : '#FFFFFF',
                      border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {tier.cta}
                  </button>

                  {/* Features */}
                  <div className="flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature.text} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X size={18} className="text-text-muted mt-0.5 flex-shrink-0" />
                        )}
                        <span
                          className="text-sm"
                          style={{
                            color: feature.included ? '#CCCCCC' : '#555555',
                          }}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-32 px-6">
        <div className="max-w-[700px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-text-primary text-center mb-10"
          >
            常见问题
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-bg-hover"
                >
                  <span className="text-text-primary font-medium text-sm">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-text-muted" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
