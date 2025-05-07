import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getWeatherData } from '../api/weatherApi';

// Chore型の定義
interface Chore {
  id: string;
  name: string;
  ideal_weather: string[];
  ideal_frequency: number;
}

interface ScoredChore extends Chore {
  score: number;
}

export interface UserPreference {
  user_id: string;
  weatherPriority: number;
  frequencyPriority: number;
}

const calculateChoreScore = (
  chore: Chore,
  preferences: UserPreference,
  currentWeather: string,
  lastCompletedAt: Date | null
): number => {
  const weatherScore = chore.ideal_weather.includes(currentWeather) ? 1.0 : 0.5;
  const daysSinceLastCompleted = lastCompletedAt
    ? (new Date().getTime() - new Date(lastCompletedAt).getTime()) / (1000 * 60 * 60 * 24)
    : Number.MAX_SAFE_INTEGER;
  const frequencyScore = Math.min(daysSinceLastCompleted / chore.ideal_frequency, 1.0);

  return (
    weatherScore * preferences.weatherPriority +
    frequencyScore * preferences.frequencyPriority
  );
};

export const useChoreRecommendations = (preferences: UserPreference | null) => {
  const [recommendedChores, setRecommendedChores] = useState<ScoredChore[]>([]);
  const [currentWeather, setCurrentWeather] = useState<string | null>(null); // 天気データ用の状態
  const [temperature, setTemperature] = useState<number | null>(null); // 気温データ

  useEffect(() => {
    const fetchChores = async () => {
      if (!preferences || !preferences.user_id) {
        console.warn('ユーザーIDが無効です');
        return;
      }

      const { data: chores, error: choresError } = await supabase.from('chores').select('*');
      const weatherData = await getWeatherData('Tokyo');  // 'Tokyo' を指定
      const { data: history, error: historyError } = await supabase
        .from('chore_history')
        .select('*')
        .eq('user_id', preferences.user_id)  // ここでuser_idを正しく指定
        .order('completed_at', { ascending: false });

      if (choresError || historyError) {
        console.error('Error fetching chores or history:', choresError || historyError);
      } else if (weatherData && chores) {
        setCurrentWeather(weatherData.currentWeather); // 天気データを保存
        setTemperature(weatherData.temperature); // 気温データを保存

        const scoredChores = chores.map((chore: Chore) => {
          const lastCompletedAt = history?.find((h) => h.chore_id === chore.id)?.completed_at || null;
          return {
            ...chore,
            score: calculateChoreScore(chore, preferences, weatherData.currentWeather, lastCompletedAt),
          };
        }).sort((a, b) => b.score - a.score);

        setRecommendedChores(scoredChores);
      }
    };

    fetchChores();
  }, [preferences]);

  return { recommendedChores, currentWeather, temperature };  // 天気と気温も返す
};
