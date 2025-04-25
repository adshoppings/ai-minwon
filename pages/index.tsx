'use client';
import { useState } from 'react';

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

  const handleSavePdf = async () => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById('result-text');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf()
      .set({ margin: 10, filename: '민원서.pdf', html2canvas: { scale: 2 } })
      .from(element)
      .save()
      .catch((err) => {
        console.error('PDF 저장 실패:', err);
        alert('PDF 변환기 로딩 실패');
      });
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700 }}>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: 12, marginRight: 8 }}>민원 생성하기</button>
      <button onClick={handleSavePdf}>PDF 저장</button>
      <hr style={{ margin: '24px 0' }} />
      <h3>작성된 민원서</h3>
      <div id="result-text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{result}</div>
    </div>
  );
}
