export const getWeatherData = async (city: string) => {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // 環境変数からAPIキーを取得

  if (!apiKey) {
    throw new Error('APIキーが設定されていません。');
  }

  // OpenWeather APIのエンドポイント
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    // APIリクエストに成功しているかをチェック
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const data = await response.json();

    // 必要なデータを抽出して返す
    return {
      currentWeather: data.weather[0].main.toLowerCase(),  // 天気情報
      temperature: data.main.temp                          // 気温（摂氏）
    };
  } catch (error) {
    console.error('天気データの取得に失敗しました:', error);
    throw error;  // エラーをキャッチして再度投げる
  }
};
