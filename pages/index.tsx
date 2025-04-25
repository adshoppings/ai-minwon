import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [html2pdf, setHtml2pdf] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('html2pdf.js').then((mod) => {
        setHtml2pdf(mod.default || mod);
      });
    }
  }, []);

  const handleSubmit = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResult(data.result || '결과 없음');
  };

  const handleSavePDF = () => {
    if (!html2pdf || !resultRef.current) {
      alert('PDF 변환기 로딩 실패');
      return;
    }

    html2pdf().from(resultRef.current).save('minwon.pdf');
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
      <button onClick={handleSubmit}>민원 생성하기</button>
      <button onClick={handleSavePDF} style={{ marginLeft: 10 }}>
        PDF 저장
      </button>
      <div style={{ marginTop: 24 }}>
        <h3>작성된 민원서</h3>
        <div ref={resultRef}>{result}</div>
      </div>
    </div>
  );
}
