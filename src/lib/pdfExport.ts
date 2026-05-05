export const exportToPDF = async (title: string, content: string): Promise<void> => {
  try {
    // Dynamically import dependencies
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create a temporary container for the PDF content
    const element = document.createElement('div');
    element.style.padding = '40px';
    element.style.backgroundColor = 'white';
    element.style.fontFamily = 'Georgia, serif';
    element.style.lineHeight = '1.6';
    element.style.color = '#333';
    element.style.maxWidth = '800px';

    // Add title
    const titleEl = document.createElement('h1');
    titleEl.textContent = title;
    titleEl.style.fontSize = '28px';
    titleEl.style.fontWeight = 'bold';
    titleEl.style.marginBottom = '10px';
    titleEl.style.color = '#1f2937';
    element.appendChild(titleEl);

    // Add date
    const dateEl = document.createElement('p');
    dateEl.textContent = `Generated on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    dateEl.style.fontSize = '12px';
    dateEl.style.color = '#6b7280';
    dateEl.style.marginBottom = '20px';
    element.appendChild(dateEl);

    // Add separator
    const separator = document.createElement('hr');
    separator.style.borderTop = '2px solid #e5e7eb';
    separator.style.marginBottom = '20px';
    element.appendChild(separator);

    // Add content
    const contentEl = document.createElement('div');
    contentEl.innerHTML = content;
    contentEl.style.fontSize = '14px';
    
    // Style the content elements
    const styleHeadings = (el: HTMLElement) => {
      const h2s = el.querySelectorAll('h2');
      h2s.forEach((h2) => {
        (h2 as HTMLElement).style.fontSize = '20px';
        (h2 as HTMLElement).style.fontWeight = 'bold';
        (h2 as HTMLElement).style.marginTop = '15px';
        (h2 as HTMLElement).style.marginBottom = '10px';
        (h2 as HTMLElement).style.color = '#1f2937';
      });

      const h3s = el.querySelectorAll('h3');
      h3s.forEach((h3) => {
        (h3 as HTMLElement).style.fontSize = '16px';
        (h3 as HTMLElement).style.fontWeight = 'bold';
        (h3 as HTMLElement).style.marginTop = '12px';
        (h3 as HTMLElement).style.marginBottom = '8px';
        (h3 as HTMLElement).style.color = '#374151';
      });

      const uls = el.querySelectorAll('ul');
      uls.forEach((ul) => {
        (ul as HTMLElement).style.marginLeft = '20px';
        (ul as HTMLElement).style.marginBottom = '10px';
      });

      const ols = el.querySelectorAll('ol');
      ols.forEach((ol) => {
        (ol as HTMLElement).style.marginLeft = '20px';
        (ol as HTMLElement).style.marginBottom = '10px';
      });

      const codes = el.querySelectorAll('code');
      codes.forEach((code) => {
        (code as HTMLElement).style.backgroundColor = '#f3f4f6';
        (code as HTMLElement).style.padding = '2px 6px';
        (code as HTMLElement).style.fontFamily = 'monospace';
        (code as HTMLElement).style.fontSize = '13px';
      });

      const blockquotes = el.querySelectorAll('blockquote');
      blockquotes.forEach((bq) => {
        (bq as HTMLElement).style.borderLeft = '4px solid #3b82f6';
        (bq as HTMLElement).style.paddingLeft = '15px';
        (bq as HTMLElement).style.marginLeft = '0';
        (bq as HTMLElement).style.color = '#6b7280';
        (bq as HTMLElement).style.fontStyle = 'italic';
      });
    };

    styleHeadings(contentEl);
    element.appendChild(contentEl);

    // Append to body temporarily
    document.body.appendChild(element);

    // Convert to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Clean up
    document.body.removeChild(element);

    // Download PDF
    pdf.save(`${title || 'Note'}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
