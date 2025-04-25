// pages/index.tsx
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResult(data.result || '결과 없음');
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return alert('PDF 변환 대상이 없습니다.');

    const canvas = await html2canvas(resultRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('민원_자동작성.pdf');
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 40, fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>GPT 민원 자동작성</h1>

      <textarea
        placeholder="민원 내용을 입력해주세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: '100%', padding: 10, fontSize: '1rem', marginTop: 20 }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={handleSubmit} style={{ marginRight: 10, padding: '10px 16px' }}>
          민원 생성하기
        </button>
        <button onClick={handleDownloadPDF} style={{ padding: '10px 16px' }}>
          PDF 저장
        </button>
      </div>

      <div ref={resultRef} style={{ marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>작성된 민원서</h3>
        <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{result}</p>
      </div>
    </div>
  );
}
