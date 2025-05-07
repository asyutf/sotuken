import React from 'react';
import { useChoreRecommendations, UserPreference } from '../hooks/useChoreRecommendations';

interface RecommendedChoresProps {
  userPreferences: UserPreference; // UserPreference型に修正
}

const RecommendedChores: React.FC<RecommendedChoresProps> = ({ userPreferences }) => {
  const { recommendedChores } = useChoreRecommendations(userPreferences); // recommendedChoresを抽出

  return (
    <div>
      <h1>おすすめの家事</h1>
      <ul>
        {recommendedChores.map((chore) => ( // 型を明示
          <li key={chore.id}>
            {chore.name} - スコア: {chore.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedChores;
