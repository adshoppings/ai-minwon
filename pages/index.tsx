import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data.result || '결과 없음');
    } catch (error) {
      console.error('에러 발생:', error);
      setResult('에러 발생');
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('result');
    if (element) {
      html2pdf().set({ filename: '민원서.pdf' }).from(element).save();
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h1>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 내용을 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: 12 }}>민원 생성하기</button>
      {result && (
        <>
          <div style={{ marginTop: 24 }}>
            <h3>작성된 민원서</h3>
            <div id="result">{result}</div>
          </div>
          <button onClick={handleDownloadPDF} style={{ marginTop: 12 }}>PDF로 저장</button>
        </>
      )}
    </div>
  );
}
