'use client';

import { useState, useEffect } from 'react';
import styles from './TimeCalculator.module.css';

type CalculationMode = 'backward' | 'forward';
type TimeUnit = 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
type Language = 'en' | 'zh';

interface TimeResult {
  target: {
    full: string;
    date: string;
    time: string;
    weekday: string;
  };
  result: {
    full: string;
    date: string;
    time: string;
    weekday: string;
  };
  amount: number;
  unit: string;
  mode: CalculationMode;
}

const translations = {
  en: {
    title: '⏰ Advanced Time Calculator',
    subtitle: 'Calculate time forwards or backwards with precision',
    dateLabel: 'Target Date & Time:',
    timeLabel: 'Time Amount:',
    calculateText: 'Calculate Time',
    clearText: 'Clear',
    resultTitle: 'Calculation Result:',
    exampleTitle: 'Usage Examples:',
    exampleText: '• Time Ago: Find out when it was 36 hours before December 25, 2024 3:00 PM\n• Time After: Calculate what time it will be 36 hours after December 25, 2024 3:00 PM\n• Supports various units: minutes, hours, days, weeks, months, and years',
    timeUnits: {
      minutes: 'Minutes',
      hours: 'Hours',
      days: 'Days',
      weeks: 'Weeks',
      months: 'Months',
      years: 'Years'
    },
    quickBtns: ['1 Hour', '1 Day', '2 Days', '1 Week', '1 Month', '1 Year'],
    modes: {
      backward: 'Time Ago',
      forward: 'Time After'
    },
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    targetTime: 'Target Time:',
    resultTime: 'Result Time:',
    dateText: 'Date:',
    timeText: 'Time:',
    difference: 'Difference:'
  },
  zh: {
    title: '⏰ 高级时间计算器',
    subtitle: '精确计算向前或向后的时间',
    dateLabel: '目标日期时间：',
    timeLabel: '时间数量：',
    calculateText: '计算时间',
    clearText: '清空',
    resultTitle: '计算结果：',
    exampleTitle: '使用示例：',
    exampleText: '• 时间前：计算2024年12月25日下午3点的36小时前是什么时候\n• 时间后：计算2024年12月25日下午3点的36小时后是什么时候\n• 支持多种单位：分钟、小时、天、周、月、年',
    timeUnits: {
      minutes: '分钟',
      hours: '小时',
      days: '天',
      weeks: '周',
      months: '月',
      years: '年'
    },
    quickBtns: ['1小时', '1天', '2天', '1周', '1月', '1年'],
    modes: {
      backward: '时间前',
      forward: '时间后'
    },
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    targetTime: '目标时间：',
    resultTime: '结果时间：',
    dateText: '日期：',
    timeText: '时间：',
    difference: '时间差：'
  }
};

export default function TimeCalculator() {
  const [mode, setMode] = useState<CalculationMode>('backward');
  const [language, setLanguage] = useState<Language>('en');
  const [targetDateTime, setTargetDateTime] = useState<string>('');
  const [timeAmount, setTimeAmount] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hours');
  const [result, setResult] = useState<TimeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const t = translations[language];

  // Set default time on component mount
  useEffect(() => {
    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setTargetDateTime(localISOTime);
  }, []);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    const weekday = t.weekdays[date.getDay()];
    
    return {
      full: language === 'en' 
        ? `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
        : `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`,
      date: language === 'en' ? `${month}/${day}/${year}` : `${year}-${month}-${day}`,
      time: `${hours}:${minutes}:${seconds}`,
      weekday: weekday
    };
  };

  const calculateTime = () => {
    if (!targetDateTime) {
      alert(language === 'en' ? 'Please select a target date and time!' : '请选择目标日期时间！');
      return;
    }

    if (!timeAmount || parseFloat(timeAmount) < 0) {
      alert(language === 'en' ? 'Please enter a valid time amount!' : '请输入有效的时间数量！');
      return;
    }

    const targetDate = new Date(targetDateTime);
    const amount = parseFloat(timeAmount);
    let millisecondsToAdd = 0;

    // Convert to milliseconds
    switch (timeUnit) {
      case 'minutes':
        millisecondsToAdd = amount * 60 * 1000;
        break;
      case 'hours':
        millisecondsToAdd = amount * 60 * 60 * 1000;
        break;
      case 'days':
        millisecondsToAdd = amount * 24 * 60 * 60 * 1000;
        break;
      case 'weeks':
        millisecondsToAdd = amount * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'months':
        millisecondsToAdd = amount * 30.44 * 24 * 60 * 60 * 1000;
        break;
      case 'years':
        millisecondsToAdd = amount * 365.25 * 24 * 60 * 60 * 1000;
        break;
    }

    const resultDate = mode === 'backward' 
      ? new Date(targetDate.getTime() - millisecondsToAdd)
      : new Date(targetDate.getTime() + millisecondsToAdd);

    const newResult: TimeResult = {
      target: formatDateTime(targetDate),
      result: formatDateTime(resultDate),
      amount,
      unit: t.timeUnits[timeUnit],
      mode
    };

    setResult(newResult);
    setShowResult(true);
  };

  const clearAll = () => {
    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setTargetDateTime(localISOTime);
    setTimeAmount('');
    setTimeUnit('hours');
    setResult(null);
    setShowResult(false);
  };

  const setQuickTime = (amount: number, unit: TimeUnit) => {
    setTimeAmount(amount.toString());
    setTimeUnit(unit);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateTime();
    }
  };

  return (
    <div className={styles.body}>
      <button className={styles.languageSwitch} onClick={toggleLanguage}>
        {language === 'en' ? '中文' : 'English'}
      </button>
      
      <div className={styles.container}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
        
        <div className={styles.calculationMode}>
          <button 
            className={`${styles.modeBtn} ${mode === 'backward' ? styles.active : ''}`}
            onClick={() => setMode('backward')}
          >
            ⏪ {t.modes.backward}
          </button>
          <button 
            className={`${styles.modeBtn} ${mode === 'forward' ? styles.active : ''}`}
            onClick={() => setMode('forward')}
          >
            ⏩ {t.modes.forward}
          </button>
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="targetDateTime">{t.dateLabel}</label>
          <input
            type="datetime-local"
            id="targetDateTime"
            value={targetDateTime}
            onChange={(e) => setTargetDateTime(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="timeAmount">{t.timeLabel}</label>
          <div className={styles.timeUnitGroup}>
            <input
              type="number"
              id="timeAmount"
              placeholder="e.g., 36"
              min="0"
              step="0.1"
              value={timeAmount}
              onChange={(e) => setTimeAmount(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
            >
              {Object.entries(t.timeUnits).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.quickActions}>
          {[
            { amount: 1, unit: 'hours' as TimeUnit },
            { amount: 24, unit: 'hours' as TimeUnit },
            { amount: 48, unit: 'hours' as TimeUnit },
            { amount: 1, unit: 'weeks' as TimeUnit },
            { amount: 1, unit: 'months' as TimeUnit },
            { amount: 1, unit: 'years' as TimeUnit }
          ].map((quick, index) => (
            <button
              key={index}
              className={styles.quickBtn}
              onClick={() => setQuickTime(quick.amount, quick.unit)}
            >
              {t.quickBtns[index]}
            </button>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.calculateBtn} onClick={calculateTime}>
            🔄 {t.calculateText}
          </button>
          <button className={styles.clearBtn} onClick={clearAll}>
            {t.clearText}
          </button>
        </div>

        {showResult && result && (
          <div className={`${styles.result} ${showResult ? styles.show : ''}`}>
            <div className={styles.resultTitle}>{t.resultTitle}</div>
            <div className={styles.resultContent}>
              <div><strong>{t.targetTime}</strong></div>
              <div className={styles.resultTime}>
                {result.target.full} ({result.target.weekday})
              </div>
              
              <div className={styles.directionIndicator}>
                {mode === 'backward' ? '⏪' : '⏩'}
              </div>
              
              <div>
                <strong>
                  {result.amount} {result.unit} {mode === 'backward' ? (language === 'en' ? 'before' : '前') : (language === 'en' ? 'after' : '后')}:
                </strong>
              </div>
              <div className={styles.resultTime}>
                {result.result.full} ({result.result.weekday})
              </div>
              
              <div className={styles.resultDetails}>
                📅 {t.dateText} {result.result.date}<br/>
                🕐 {t.timeText} {result.result.time}<br/>
                ⏱️ {t.difference} {result.amount} {result.unit}
              </div>
            </div>
          </div>
        )}

        <div className={styles.example}>
          <strong>{t.exampleTitle}</strong><br/>
          {t.exampleText.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t.exampleText.split('\n').length - 1 && <br/>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}