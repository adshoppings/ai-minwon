import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
    const data = await res.json();
    setResult(data.result || '결과 없음');
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('result-area');
    if (element) {
      html2pdf().set({ margin: 10 }).from(element).save();
    } else {
      alert('PDF 변환할 내용을 찾을 수 없습니다.');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>GPT 민원 자동작성</h1>
      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%', marginTop: 12 }}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleSubmit}>민원 생성하기</button>
        <button onClick={handleDownloadPDF} style={{ marginLeft: 8 }}>PDF 저장</button>
      </div>
      <div id="result-area" style={{ marginTop: 32 }}>
        <hr />
        <h3>작성된 민원서</h3>
        <div dangerouslySetInnerHTML={{ __html: result }} />
      </div>
    </div>
  );
}
