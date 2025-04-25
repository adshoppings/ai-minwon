import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

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
    if (!resultRef.current) {
      alert('PDF로 저장할 내용이 없습니다.');
      return;
    }
    html2pdf().from(resultRef.current).save('minwon.pdf').catch(() => {
      alert('PDF 변환기 로딩 실패');
    });
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <h1>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: 12, marginRight: 10 }}>
        민원 생성하기
      </button>
      <button onClick={handleDownloadPDF}>PDF 저장</button>
      <div ref={resultRef} style={{ marginTop: 24 }}>
        <h3>작성된 민원서</h3>
        <div>{result}</div>
      </div>
    </div>
  );
}
