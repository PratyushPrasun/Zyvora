import PDFDocument from "pdfkit";
import { drawInvoice } from "../templates/invoiceTemplate.js";

/**
 * Generate a professional PDF invoice as a Buffer.
 *
 * Uses PDFKit for server-side PDF rendering.
 * No temp files — streams directly to a Buffer.
 *
 * @param {Object} invoice — Invoice document from MongoDB
 * @returns {Promise<Buffer>} PDF file as Buffer
 */
export const generateInvoicePdf = (invoice) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50,
                info: {
                    Title: `Invoice ${invoice.invoiceNumber}`,
                    Author: "Zyvora",
                    Subject: `Invoice for Order ${invoice.orderNumber}`,
                    Creator: "Zyvora Invoice System",
                },
                bufferPages: true,
            });

            const chunks = [];

            doc.on("data", (chunk) => chunks.push(chunk));

            doc.on("end", () => {
                const buffer = Buffer.concat(chunks);

                console.log(
                    `[PDF_SERVICE] ✅ PDF generated for ${invoice.invoiceNumber} (${(buffer.length / 1024).toFixed(1)} KB)`
                );

                resolve(buffer);
            });

            doc.on("error", (error) => {
                console.error(
                    `[PDF_SERVICE] ❌ PDF generation failed for ${invoice.invoiceNumber}:`,
                    error.message
                );
                reject(error);
            });

            // Draw invoice content
            drawInvoice(doc, invoice);

            // Add page numbers
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);

                doc.fontSize(7)
                    .font("Helvetica")
                    .fillColor("#d1d5db")
                    .text(
                        `Page ${i + 1} of ${pageCount}`,
                        50,
                        doc.page.height - 30,
                        {
                            width: doc.page.width - 100,
                            align: "center",
                        }
                    );
            }

            doc.end();
        } catch (error) {
            console.error(
                "[PDF_SERVICE] ❌ PDF creation error:",
                error.message
            );
            reject(error);
        }
    });
};
