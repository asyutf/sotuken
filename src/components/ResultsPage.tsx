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
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // 天気データの取得（大阪の緯度経度）
    fetchWeatherByLatLon(34.6937, 135.5023)
      .then(setWeather)
      .catch(console.error)

    // ログインユーザー情報の取得
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email ?? null)
      }
    }

    fetchUser()
  }, [])

  const { suggestions, loading, error } = useActivitySuggestions(userInfo, weather)

  // 設定画面に戻る
  const handleBack = () => {
    navigate('/')
  }

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  // 提案をSupabaseに保存してトップへ戻る
  const handleSaveAndFinish = async () => {
    if (!suggestions) return

    if (!userId) {
      alert('ユーザーIDが取得できていません。保存できません。')
      return
    }

    // suggestions テーブルに保存（created_atはデフォルト値が設定されているのでなくてもOK）
    const { error: insertError } = await supabase.from('suggestions').insert([
      {
        user_id: userId,
        email: userEmail,
        suggestion: suggestions,
      },
    ])

    if (insertError) {
      alert(`保存に失敗しました: ${insertError.message}`)
      return
    }

    alert('提案を保存しました。')
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h2>今日の行動提案</h2>

      {!weather && <p>天候データを取得中（大阪）...</p>}
      {(loading || !weather) && !error && <p>提案を生成中...</p>}
      {error && <p style={{ color: 'red' }}>エラーが発生しました: {error}</p>}

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
        <button onClick={handleSaveAndFinish} style={{ marginLeft: 8 }}>
          保存して終了
        </button>
      </div>
    </div>
  )
}

export default ResultsPage
