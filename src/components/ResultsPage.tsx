//結果画面
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useActivitySuggestions } from '../hooks/useActivitySuggestions'
import { UserInfo } from '../hooks/useUserInfoForm'
import { fetchWeatherByLatLon, WeatherData } from '../api/weather'

interface ResultsPageProps {
  userInfo: UserInfo
}

const ResultsPage: React.FC<ResultsPageProps> = ({ userInfo }) => {
  const navigate = useNavigate()
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    console.log(process.env.REACT_APP_OPENAI_API_KEY)
    fetchWeatherByLatLon(34.6937, 135.5023)
      .then(setWeather)
      .catch(console.error)
  }, [])

  const { suggestions, loading, error } = useActivitySuggestions(userInfo, weather)

  const handleBack = () => {
    navigate('/')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h2>今日の行動提案</h2>

      {!weather && <p>天候データを取得中（大阪）...</p>}

      {(loading || !weather) && !error && <p>提案を生成中...</p>}

      {error && (
        <p style={{ color: 'red' }}>
          エラーが発生しました: {error}
        </p>
      )}

      {!loading && suggestions && weather && (
        <div
          style={{
            whiteSpace: 'pre-wrap',
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: 4,
          }}
        >
          {suggestions}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={handleBack}>設定を変更する</button>
        <button onClick={handleLogout} style={{ marginLeft: 8 }}>
          ログアウト
        </button>
      </div>
    </div>
  )
}

export default ResultsPage
