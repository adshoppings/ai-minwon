import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input })
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 요약 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%' }}
      />
      <button onClick={handleSubmit} style={{ marginTop: 10 }}>민원서 자동작성</button>
      {result && (
        <div style={{ marginTop: 20, whiteSpace: 'pre-line', background: '#f5f5f5', padding: 10 }}>
          <h3>작성된 민원서:</h3>
          <div>{result}</div>
        </div>
      )}
    </div>
  );
}
