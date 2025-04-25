import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/pdf-helper.html';
    script.type = 'text/html';
    document.body.appendChild(script);
  }, []);

  const handleDownloadPDF = () => {
    if (typeof window !== 'undefined' && (window as any).exportToPdf) {
      (window as any).exportToPdf(`<h1>작성된 민원서</h1><p>${result}</p>`);
    } else {
      alert('PDF 변환기 로딩 실패');
    }
  };

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

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h1>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: 12 }}>
        민원 생성하기
      </button>
      {result && (
        <button onClick={handleDownloadPDF} style={{ marginLeft: 10 }}>
          PDF 저장
        </button>
      )}
      <div style={{ marginTop: 24 }}>
        <h3>작성된 민원서</h3>
        <div>{result}</div>
      </div>
    </div>
  );
}
