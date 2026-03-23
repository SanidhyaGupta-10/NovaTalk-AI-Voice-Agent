import { splitIntoSegments } from '@/lib/utils';

type RenderTask = { promise: Promise<void> };

type PDFTextItem = { str: string };

type PDFDocumentHandle = {
    destroy: () => Promise<void>;
    getPage: (pageNumber: number) => Promise<{
        getViewport: (options: { scale: number }) => { width: number; height: number };
        render: (options: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => RenderTask;
        getTextContent: () => Promise<{ items: unknown[] }>;
    }>;
    numPages: number;
};

export async function parsePDFFile(file: File) {
    let pdfDocument: PDFDocumentHandle | null = null;

    try {
        const pdfjsLib = await import('pdfjs-dist');

        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url,
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        pdfDocument = await loadingTask.promise as PDFDocumentHandle;

        const firstPage = await pdfDocument.getPage(1);
        const viewport = firstPage.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Could not get canvas context');
        }

        const renderTask = firstPage.render({
            canvasContext: context,
            viewport,
        });

        await renderTask.promise;

        const coverDataURL = canvas.toDataURL('image/png');

        let fullText = '';

        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .filter((item): item is PDFTextItem => 'str' in item)
                .map((item) => item.str)
                .join(' ');

            fullText += `${pageText}\n`;
        }

        const segments = splitIntoSegments(fullText);

        return {
            content: segments,
            cover: coverDataURL,
        };
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
        if (pdfDocument) {
            await pdfDocument.destroy();
        }
    }
}
