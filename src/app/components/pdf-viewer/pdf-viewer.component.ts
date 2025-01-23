import { Component } from '@angular/core';
//import { saveAs } from 'file-saver'; // You might need to install this if saving the edited PDF
declare var pdfjsLib: any;

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {
  selectedFile: File | null = null;

  // Handle the file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      console.log('PDF file selected:', file);
      this.loadPDF(file);
    } else {
      alert('Please select a valid PDF file!');
    }
  }

  loadPDF(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const typedArray = new Uint8Array(e.target.result);
      this.renderPDF(typedArray);
    };
    fileReader.readAsArrayBuffer(file);
  }

  renderPDF(data: Uint8Array): void {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    
    pdfjsLib.getDocument(data).promise.then((pdf:any) => {
      console.log('PDF loaded');
      pdf.getPage(1).then((page: any) => {
        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({
          canvasContext: context,
          viewport: viewport
        });
      });
    });
  }
   
  }
  
