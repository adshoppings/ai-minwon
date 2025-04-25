import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data.result || '결과 없음');
      setSuggestion(data.suggestion || '');
    } catch (error) {
      console.error('에러 발생:', error);
      setResult('에러 발생');
    }
  };

  const handlePdfDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result + "\n\n" + suggestion], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '민원_자동작성.txt';
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        style={{ width: '100%', padding: 12, fontSize: '1rem' }}
      />
      <div style={{ marginTop: 10 }}>
        <button onClick={handleSubmit} style={{ marginRight: 10 }}>민원 생성하기</button>
        <button onClick={handlePdfDownload}>PDF 저장</button>
      </div>
      <hr style={{ marginTop: 30 }} />
      <h3>작성된 민원서</h3>
      <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result}</pre>
      {suggestion && (
        <div style={{ marginTop: 20 }}>
          <h4>📌 민원 작성 시 참고할 서식</h4>
          <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{suggestion}</pre>
        </div>
      )}
    </div>
  );
}