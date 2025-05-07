import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserPreference } from '../hooks/useChoreRecommendations';

interface UserPreferencesFormProps {
  onSubmit: (data: UserPreference) => void;
}

const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({ onSubmit }) => {
  const [weatherPriority, setWeatherPriority] = useState(0.5);
  const [frequencyPriority, setFrequencyPriority] = useState(0.5);
  const navigate = useNavigate();

  const handleWeatherPriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeatherPriority = parseFloat(e.target.value);
    setWeatherPriority(newWeatherPriority);
    setFrequencyPriority(1 - newWeatherPriority);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('ログインしてください。');
      return;
    }

    const preferences: UserPreference = {
      user_id: user.id,
      weatherPriority,
      frequencyPriority,
    };

    await onSubmit(preferences);

    navigate('/results');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>天気の優先度</label>
      <input
        type="number"
        step="0.1"
        min="0"
        max="1"
        value={weatherPriority}
        onChange={handleWeatherPriorityChange}
        required
      />

      <label>頻度の優先度</label>
      <input
        type="number"
        step="0.1"
        min="0"
        max="1"
        value={frequencyPriority}
        readOnly
      />

      <button type="submit">設定する</button>
    </form>
  );
};

export default UserPreferencesForm;
