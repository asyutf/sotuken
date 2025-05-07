import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendedChores from './RecommendedChores';
import { UserPreference } from '../hooks/useChoreRecommendations';
import { supabase } from '../supabaseClient';

interface ResultsPageProps {
  preferences: UserPreference;
  currentWeather: string | null;
  temperature: number | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ preferences, currentWeather, temperature }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBackToPreferences = () => {
    navigate('/'); // 優先度設定ページに戻る
  };

  return (
    <div>
      <h1>家事推薦結果</h1>
      <button onClick={handleLogout}>ログアウト</button>
      <p>天気の優先度: {preferences.weatherPriority}</p>
      <p>頻度の優先度: {preferences.frequencyPriority}</p>
      {/* 天気と気温の表示 */}
      {currentWeather && <p>現在の天気: {currentWeather}</p>}
      {temperature !== null && <p>現在の気温: {temperature}℃</p>}
      <RecommendedChores userPreferences={preferences} />
      <button onClick={handleBackToPreferences}>優先度を再設定する</button>
    </div>
  );
};

export default ResultsPage;
