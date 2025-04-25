// pages/index.tsx
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>GPT 민원 자동작성</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="민원 내용을 입력해 주세요"
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={handleSubmit}>민원 생성하기</button>
      <div>
        <h3>생성된 민원:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}
