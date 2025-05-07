import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPreferencesForm from './components/UserPreferencesForm';
import ResultsPage from './components/ResultsPage';
import ChoreSelection from './components/ChoreSelection'; // ChoreSelection をインポート
import Auth from './components/Auth';
import { supabase } from './supabaseClient';
import { UserPreference, useChoreRecommendations } from './hooks/useChoreRecommendations';
import './styles/index.css';

const App: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null); // ユーザーIDの状態を追加

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(session);
        if (session?.user?.id) {
          setUserId(session.user.id); // ユーザーIDを取得して状態に保存
        }
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user?.id) {
          setUserId(session.user.id); // ユーザーIDを取得して状態に保存
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const { recommendedChores, currentWeather, temperature } = useChoreRecommendations(
    preferences ? preferences : { user_id: userId || '', weatherPriority: 0.5, frequencyPriority: 0.5 }
  ); // user_idが存在するか確認

  const handlePreferencesSubmit = async (data: UserPreference) => {
    if (!userId) {
      alert('ユーザーIDが取得できませんでした。');
      return;
    }

    const { error } = await supabase.from('user_preferences').insert([{
      user_id: userId, // 常に最新のuserIdを使う
      weather_priority: data.weatherPriority,
      frequency_priority: data.frequencyPriority,
    }]);

    if (error) {
      console.error('Error saving preferences:', error);
      alert('設定の保存に失敗しました。');
      return;
    }

    setPreferences(data);
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserPreferencesForm onSubmit={handlePreferencesSubmit} />} />
        <Route path="/selection" element={<ChoreSelection />} /> {/* ChoreSelection を追加 */}
        <Route path="/results" element={<ResultsPage preferences={preferences!} currentWeather={currentWeather} temperature={temperature} />} />
      </Routes>
    </Router>
  );
};

export default App;
