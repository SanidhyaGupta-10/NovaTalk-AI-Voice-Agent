import { splitIntoSegments } from '@/lib/utils';

type PdfJsModule = typeof import('pdfjs-dist');
type PDFDocumentHandle = Awaited<ReturnType<PdfJsModule['getDocument']>['promise']>;
type PDFTextItem = { str: string };

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
        pdfDocument = await loadingTask.promise;

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
            canvas,
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
                .filter((item) => 'str' in item)
                .map((item) => (item as { str: string }).str)
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
