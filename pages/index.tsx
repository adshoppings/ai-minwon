import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setResult('내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();
      setResult(data.result || '결과 없음');
    } catch (error) {
      console.error('에러 발생:', error);
      setResult('에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontWeight: 'bold' }}>GPT 민원 자동작성</h1>

      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%', padding: 10, fontSize: 14, marginTop: 12 }}
      />

      <button
        onClick={handleSubmit}
        style={{ marginTop: 12, padding: '10px 16px', fontSize: 14 }}
        disabled={loading}
      >
        {loading ? '생성 중...' : '민원 생성하기'}
      </button>

      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontWeight: 'bold' }}>작성된 민원서</h3>
        <div style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
          {result || '결과 없음'}
        </div>
      </div>
    </div>
  );
}
