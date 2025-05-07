// src/components/ChoreSelection.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ChoreSelection: React.FC = () => {
  const [chores, setChores] = useState<any[]>([]);
  const [selectedChores, setSelectedChores] = useState<number[]>([]);

  useEffect(() => {
    const fetchChores = async () => {
      const { data, error } = await supabase.from('chores').select('*');
      if (error) {
        console.error('Error fetching chores:', error);
      } else {
        setChores(data || []);
      }
    };

    fetchChores();
  }, []);

  const handleChoreSelection = (choreId: number) => {
    setSelectedChores((prevSelected) =>
      prevSelected.includes(choreId)
        ? prevSelected.filter((id) => id !== choreId)
        : [...prevSelected, choreId]
    );
  };

  const handleSubmit = async () => {
    const user_id = 1; // 実際にはログインしているユーザーのIDを使用
    const { error } = await supabase
      .from('user_preferences')
      .update({ selected_chores_ids: selectedChores })
      .eq('user_id', user_id);

    if (error) {
      console.error('Error saving selected chores:', error);
    } else {
      console.log('Selected chores saved successfully');
    }
  };

  return (
    <div>
      <h1>家事タスクを選択してください</h1>
      <ul>
        {chores.map((chore) => (
          <li key={chore.id}>
            <label>
              <input
                type="checkbox"
                value={chore.id}
                onChange={() => handleChoreSelection(chore.id)}
                checked={selectedChores.includes(chore.id)}
              />
              {chore.name} - 理想的な天気: {chore.ideal_weather.join(', ')} - 頻度: {chore.ideal_frequency}日おき
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>選択した家事を保存する</button>
    </div>
  );
};

export default ChoreSelection;
