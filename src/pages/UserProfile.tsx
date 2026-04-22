import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  History,
  Heart,
  Share2,
  Trash2,
  Copy,
  ExternalLink,
  ScrollText,
  Sparkles,
  Compass,
  X,
  Clock,
  Calendar,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getUserProfile,
  saveUserProfile,
  getHistory,
  removeHistory,
  clearHistory,
  getFavorites,
  removeFavorite,
  getAllShareIds,
  type HistoryItem,
  type FavoriteItem,
} from '../lib/storage';

type TabValue = 'history' | 'favorites' | 'shares';

const typeConfig = {
  bazi: { label: '八字', icon: ScrollText, color: '#c8a45c', path: '/#/bazi' },
  daily: { label: '每日运势', icon: Sparkles, color: '#FBBF24', path: '/#/daily' },
  fengshui: { label: '风水', icon: Compass, color: '#4ADE80', path: '/#/fengshui' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-white/20" />
      </div>
      <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
      <p className="text-text-muted text-xs">{subtitle}</p>
    </motion.div>
  );
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<TabValue>('history');
  const [profile, setProfile] = useState(getUserProfile);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [shareIds, setShareIds] = useState<string[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const refreshData = useCallback(() => {
    setHistory(getHistory());
    setFavorites(getFavorites());
    setShareIds(getAllShareIds());
    setProfile(getUserProfile());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    // Auto-create profile if none exists
    const existing = getUserProfile();
    if (!existing) {
      const newProfile = {
        name: 'Mystic Traveler',
        createdAt: new Date().toISOString(),
      };
      saveUserProfile(newProfile);
      setProfile(newProfile);
    }
  }, []);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setIsEditingName(false);
      return;
    }
    const updated = { ...(profile || { createdAt: new Date().toISOString() }), name: trimmed };
    saveUserProfile(updated);
    setProfile(updated);
    setIsEditingName(false);
    toast.success('昵称已更新');
  };

  const handleDeleteHistory = (id: string) => {
    removeHistory(id);
    setHistory(getHistory());
    toast.success('已删除记录');
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast.success('历史记录已清空');
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
    toast.success('已取消收藏');
  };

  const handleCopyShareLink = (id: string) => {
    const url = `${window.location.origin}/#/?share=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('分享链接已复制');
    }).catch(() => {
      toast.error('复制失败');
    });
  };

  const totalReadings = history.length;
  const baziCount = history.filter((h) => h.type === 'bazi').length;
  const dailyCount = history.filter((h) => h.type === 'daily').length;

  const tabs: { value: TabValue; label: string; icon: LucideIcon }[] = [
    { value: 'history', label: '历史记录', icon: History },
    { value: 'favorites', label: '我的收藏', icon: Heart },
    { value: 'shares', label: '分享管理', icon: Share2 },
  ];

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-bg-primary">
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-[800px] mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                      onBlur={handleSaveName}
                      className="bg-bg-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-text-primary text-lg font-semibold outline-none focus:border-gold/50 w-full max-w-[240px]"
                      placeholder="输入昵称"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setNameInput(profile?.name || '');
                      setIsEditingName(true);
                    }}
                    className="text-left group"
                  >
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-gold transition-colors">
                      {profile?.name || 'Mystic Traveler'}
                    </h1>
                    <p className="text-xs text-text-muted mt-1">点击修改昵称</p>
                  </button>
                )}
                {profile?.createdAt && (
                  <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    加入于 {new Date(profile.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">{totalReadings}</div>
                <div className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  总测算
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">{baziCount}</div>
                <div className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
                  <ScrollText className="w-3 h-3" />
                  八字
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">{dailyCount}</div>
                <div className="text-xs text-text-muted mt-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  每日运势
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-1 bg-bg-card border border-border-subtle rounded-xl p-1 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-gold'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="profile-tab-bg"
                        className="absolute inset-0 bg-gold/10 rounded-lg border border-gold/20"
                        transition={{ type: 'spring', duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* History Tab */}
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {history.length > 0 && (
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs text-text-muted">
                        共 {history.length} 条记录
                      </p>
                      <button
                        onClick={handleClearHistory}
                        className="text-xs text-red-400/80 hover:text-red-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        清空全部
                      </button>
                    </div>
                  )}

                  {history.length === 0 ? (
                    <EmptyState
                      icon={History}
                      title="暂无历史记录"
                      subtitle="完成测算后，记录将自动保存到这里"
                    />
                  ) : (
                    <div className="space-y-3">
                      {history.map((item, index) => {
                        const config = typeConfig[item.type];
                        const TypeIcon = config.icon;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3 }}
                            className="group bg-bg-card border border-border-subtle rounded-xl p-4 hover:border-gold/20 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${config.color}15` }}
                              >
                                <TypeIcon className="w-4 h-4" style={{ color: config.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <a
                                  href={config.path}
                                  className="text-sm font-medium text-text-primary hover:text-gold transition-colors block truncate"
                                >
                                  {item.title}
                                </a>
                                <div className="flex items-center gap-3 mt-1">
                                  <span
                                    className="text-[11px] px-2 py-0.5 rounded-full border"
                                    style={{
                                      color: config.color,
                                      borderColor: `${config.color}30`,
                                      backgroundColor: `${config.color}08`,
                                    }}
                                  >
                                    {config.label}
                                  </span>
                                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(item.date)}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteHistory(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                                title="删除"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <motion.div
                  key="favorites"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {favorites.length === 0 ? (
                    <EmptyState
                      icon={Heart}
                      title="暂无收藏"
                      subtitle="在测算结果页面点击收藏，即可保存到这里"
                    />
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((item, index) => {
                        const config = typeConfig[item.type];
                        const TypeIcon = config.icon;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3 }}
                            className="group bg-bg-card border border-border-subtle rounded-xl p-4 hover:border-gold/20 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${config.color}15` }}
                              >
                                <TypeIcon className="w-4 h-4" style={{ color: config.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <a
                                  href={config.path}
                                  className="text-sm font-medium text-text-primary hover:text-gold transition-colors block truncate"
                                >
                                  {item.title}
                                </a>
                                <div className="flex items-center gap-3 mt-1">
                                  <span
                                    className="text-[11px] px-2 py-0.5 rounded-full border"
                                    style={{
                                      color: config.color,
                                      borderColor: `${config.color}30`,
                                      backgroundColor: `${config.color}08`,
                                    }}
                                  >
                                    {config.label}
                                  </span>
                                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(item.date)}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveFavorite(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                                title="取消收藏"
                              >
                                <Heart className="w-4 h-4 fill-current" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Shares Tab */}
              {activeTab === 'shares' && (
                <motion.div
                  key="shares"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {shareIds.length === 0 ? (
                    <EmptyState
                      icon={Share2}
                      title="暂无分享链接"
                      subtitle="在测算结果页面点击分享，即可生成链接"
                    />
                  ) : (
                    <div className="space-y-3">
                      {shareIds.map((id, index) => (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04, duration: 0.3 }}
                          className="group bg-bg-card border border-border-subtle rounded-xl p-4 hover:border-gold/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                              <Share2 className="w-4 h-4 text-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary font-mono truncate">
                                {id}
                              </p>
                              <p className="text-[11px] text-text-muted mt-0.5 truncate">
                                {typeof window !== 'undefined' ? window.location.origin : ''}/#/?share={id}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCopyShareLink(id)}
                                className="p-2 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-all"
                                title="复制链接"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <a
                                href={`/#/?share=${id}`}
                                className="p-2 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-all"
                                title="打开链接"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
