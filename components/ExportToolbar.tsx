import React from 'react';
import { Download, FileText, Code, FileJson, Image } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ExportToolbarProps {
  elementId: string;
  title: string;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ elementId, title }) => {

  const handleExport = (format: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const contentText = element.innerText;
    const contentHTML = element.innerHTML;
    const filename = `export-${title.replace(/\s+/g, '-')}-${Date.now()}`;

    const download = (blob: Blob, ext: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    };

    switch (format) {
      case 'png':
        html2canvas(element, { backgroundColor: null }).then(canvas => {
          canvas.toBlob(blob => {
            if (blob) download(blob, 'png');
          });
        });
        break;
      case 'pdf':
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(`
            <html dir="rtl"><head><title>${title}</title>
            <style>body{font-family:tahoma;padding:40px;direction:rtl;} p{text-align:justify;line-height:2;} h1,h2,h3{color:#333;}</style>
            </head><body>${contentHTML}</body></html>
          `);
          printWindow.document.close();
          setTimeout(() => printWindow.print(), 500);
        }
        break;
      case 'md':
        download(new Blob([`# ${title}\n\n${contentText}`], { type: 'text/markdown' }), 'md');
        break;
      case 'html':
        download(new Blob([`<html dir="rtl"><body>${contentHTML}</body></html>`], { type: 'text/html' }), 'html');
        break;
      case 'txt': // docs/txt fallback
        download(new Blob([contentText], { type: 'text/plain' }), 'txt');
        break;
      case 'docs':
        const docContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body dir="rtl">${contentHTML}</body></html>`;
        download(new Blob([docContent], { type: 'application/msword' }), 'doc');
        break;
      case 'json':
        download(new Blob([JSON.stringify({ title, content: contentText }, null, 2)], { type: 'application/json' }), 'json');
        break;
      case 'csv':
        // Simple CSV escape
        const csvContent = `"Title","Content"\n"${title.replace(/"/g, '""')}","${contentText.replace(/"/g, '""')}"`;
        download(new Blob([csvContent], { type: 'text/csv' }), 'csv');
        break;
      case 'xml':
        const xmlContent = `<root><title>${title}</title><content>${contentText}</content></root>`;
        download(new Blob([xmlContent], { type: 'text/xml' }), 'xml');
        break;
    }
  };

  return (
    <div className="mt-8 pt-4 border-t border-[var(--c-border)] flex flex-wrap gap-2 justify-center opacity-70 hover:opacity-100 transition-opacity">
      <div className="text-[10px] w-full text-center mb-2 uppercase tracking-widest font-bold">دریافت خروجی</div>
      
      <button onClick={() => handleExport('png')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1" title="PNG Image">
        <Image size={14}/> PNG
      </button>
      <button onClick={() => handleExport('pdf')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1" title="Print / PDF">
        <Download size={14}/> PDF
      </button>
      <button onClick={() => handleExport('docs')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1" title="Word Doc">
        <FileText size={14}/> DOCS
      </button>
      <button onClick={() => handleExport('md')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1" title="Markdown">
        <Code size={14}/> MD
      </button>
      <button onClick={() => handleExport('html')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1">
        HTML
      </button>
      <button onClick={() => handleExport('json')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1">
        <FileJson size={14}/> JSON
      </button>
      <button onClick={() => handleExport('csv')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1">
        CSV
      </button>
      <button onClick={() => handleExport('xml')} className="p-2 bg-[var(--c-content-bg)] border border-[var(--c-border)] rounded-lg hover:bg-[var(--c-accent)] hover:text-white transition-colors text-xs flex items-center gap-1">
        XML
      </button>
    </div>
  );
};

export default ExportToolbar;