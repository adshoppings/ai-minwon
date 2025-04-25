import html2pdf from 'html2pdf.js';

export function exportToPdf(content) {
  const element = document.createElement('div');
  element.innerHTML = `<h1>작성된 민원서</h1><p>${content}</p>`;

  html2pdf().from(element).set({
    margin: 10,
    filename: 'minwon.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).save();
}
