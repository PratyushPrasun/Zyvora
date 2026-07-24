import storeConfig from "../config/store.js";

/**
 * Format currency value to INR.
 */
const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value || 0);
};

/**
 * Format date to readable string.
 */
const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

/**
 * Draw the invoice PDF using PDFKit document.
 *
 * This is a pure layout function — receives a PDFKit doc
 * instance and invoice data, draws the entire invoice.
 *
 * @param {PDFDocument} doc — PDFKit document instance
 * @param {Object} invoice — Invoice document from MongoDB
 */
export const drawInvoice = (doc, invoice) => {
    const pageWidth = doc.page.width;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    let y = margin;

    // ─── HEADER ────────────────────────────────────────

    // Store Name
    doc.fontSize(22)
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text(storeConfig.name, margin, y, { width: contentWidth / 2 });

    // Invoice Title (right-aligned)
    doc.fontSize(28)
        .font("Helvetica-Bold")
        .fillColor("#10b981")
        .text("INVOICE", margin, y, {
            width: contentWidth,
            align: "right",
        });

    y += 40;

    // Store contact info
    doc.fontSize(8)
        .font("Helvetica")
        .fillColor("#6b7280");

    const storeLines = [
        storeConfig.address,
        `Email: ${storeConfig.email}`,
        `Phone: ${storeConfig.phone}`,
        storeConfig.website,
    ].filter(Boolean);

    for (const line of storeLines) {
        doc.text(line, margin, y);
        y += 12;
    }

    y += 10;

    // Divider
    doc.moveTo(margin, y)
        .lineTo(pageWidth - margin, y)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

    y += 20;

    // ─── INVOICE METADATA ──────────────────────────────

    const metaLeftX = margin;
    const metaRightX = pageWidth / 2 + 20;
    const metaStartY = y;

    // Left column
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#374151");

    const leftMeta = [
        ["Invoice Number", invoice.invoiceNumber],
        ["Invoice Date", formatDate(invoice.generatedAt)],
        ["Order Number", invoice.orderNumber],
        ["Order Date", formatDate(invoice.orderDate)],
        ["Status", invoice.status],
    ];

    for (const [label, value] of leftMeta) {
        doc.font("Helvetica-Bold")
            .fillColor("#6b7280")
            .text(`${label}:`, metaLeftX, y, { continued: true })
            .font("Helvetica")
            .fillColor("#111827")
            .text(`  ${value}`);
        y += 14;
    }

    // Right column — Payment Info
    y = metaStartY;

    const rightMeta = [];

    if (invoice.paymentMethod === "COD") {
        rightMeta.push(
            ["Payment Method", "Cash On Delivery"],
            ["Payment Status", "Pending"],
            ["Payment Due", "On Delivery"]
        );
    } else {
        rightMeta.push(
            ["Payment Method", "Online Payment"],
            ["Payment Status", "Paid"]
        );

        if (invoice.paymentSnapshot?.paidAt) {
            rightMeta.push([
                "Paid At",
                formatDate(invoice.paymentSnapshot.paidAt),
            ]);
        }

        if (invoice.paymentSnapshot?.razorpayPaymentId) {
            rightMeta.push([
                "Payment ID",
                invoice.paymentSnapshot.razorpayPaymentId,
            ]);
        }

        if (invoice.paymentSnapshot?.razorpayOrderId) {
            rightMeta.push([
                "Razorpay Order ID",
                invoice.paymentSnapshot.razorpayOrderId,
            ]);
        }

        if (invoice.paymentSnapshot?.transactionId) {
            rightMeta.push([
                "Transaction Ref",
                invoice.paymentSnapshot.transactionId,
            ]);
        }
    }

    for (const [label, value] of rightMeta) {
        doc.font("Helvetica-Bold")
            .fillColor("#6b7280")
            .text(`${label}:`, metaRightX, y, { continued: true })
            .font("Helvetica")
            .fillColor("#111827")
            .text(`  ${value}`);
        y += 14;
    }

    y = Math.max(y, metaStartY + leftMeta.length * 14) + 20;

    // ─── CUSTOMER INFO ─────────────────────────────────

    // Bill To / Ship To
    const billToX = margin;
    const shipToX = pageWidth / 2 + 20;

    doc.fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#10b981")
        .text("BILL TO", billToX, y)
        .text("SHIP TO", shipToX, y);

    y += 16;

    // Bill To details
    const billToStartY = y;
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#111827")
        .text(invoice.customerName, billToX, y);
    y += 12;
    doc.font("Helvetica").fillColor("#6b7280")
        .text(invoice.customerEmail, billToX, y);
    y += 12;
    if (invoice.customerPhone) {
        doc.text(invoice.customerPhone, billToX, y);
        y += 12;
    }
    doc.text(`Customer ID: ${invoice.customerId}`, billToX, y);

    // Ship To details
    y = billToStartY;
    const addr = invoice.shippingAddress || {};
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#111827")
        .text(addr.fullName || invoice.customerName, shipToX, y);
    y += 12;
    doc.font("Helvetica").fillColor("#6b7280");

    if (addr.addressLine1) {
        doc.text(addr.addressLine1, shipToX, y);
        y += 12;
    }
    if (addr.addressLine2) {
        doc.text(addr.addressLine2, shipToX, y);
        y += 12;
    }
    if (addr.landmark) {
        doc.text(`Landmark: ${addr.landmark}`, shipToX, y);
        y += 12;
    }

    const cityLine = [addr.city, addr.state, addr.pincode]
        .filter(Boolean)
        .join(", ");
    if (cityLine) {
        doc.text(cityLine, shipToX, y);
        y += 12;
    }
    if (addr.country) {
        doc.text(addr.country, shipToX, y);
        y += 12;
    }
    if (addr.phone) {
        doc.text(`Phone: ${addr.phone}`, shipToX, y);
        y += 12;
    }

    y += 20;

    // Divider
    doc.moveTo(margin, y)
        .lineTo(pageWidth - margin, y)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

    y += 15;

    // ─── PRODUCT TABLE ─────────────────────────────────

    // Column definitions
    const cols = [
        { label: "#", width: 25, align: "left" },
        { label: "Product", width: 180, align: "left" },
        { label: "Category", width: 70, align: "left" },
        { label: "Qty", width: 35, align: "center" },
        { label: "Unit Price", width: 70, align: "right" },
        { label: "Discount", width: 60, align: "right" },
        { label: "Price", width: 70, align: "right" },
        { label: "Subtotal", width: 0, align: "right" }, // takes remaining
    ];

    // Calculate last column width
    const usedWidth = cols.slice(0, -1).reduce((sum, c) => sum + c.width, 0);
    cols[cols.length - 1].width = contentWidth - usedWidth;

    // Table header
    doc.rect(margin, y, contentWidth, 22)
        .fill("#f9fafb");

    let colX = margin + 6;

    doc.fontSize(7)
        .font("Helvetica-Bold")
        .fillColor("#374151");

    for (const col of cols) {
        doc.text(col.label, colX, y + 7, {
            width: col.width - 8,
            align: col.align,
        });
        colX += col.width;
    }

    y += 26;

    // Table rows
    const items = invoice.items || [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Check if we need a new page
        if (y > doc.page.height - 150) {
            doc.addPage();
            y = margin;
        }

        // Alternate row background
        if (i % 2 === 0) {
            doc.rect(margin, y - 2, contentWidth, 20)
                .fill("#fafafa");
        }

        colX = margin + 6;
        doc.fontSize(7).font("Helvetica").fillColor("#374151");

        const rowData = [
            String(i + 1),
            item.title || "—",
            item.category || "—",
            String(item.quantity),
            formatCurrency(item.unitPrice),
            item.discount > 0 ? formatCurrency(item.discount) : "—",
            formatCurrency(item.finalPrice),
            formatCurrency(item.subtotal),
        ];

        for (let j = 0; j < cols.length; j++) {
            doc.text(rowData[j], colX, y + 2, {
                width: cols[j].width - 8,
                align: cols[j].align,
            });
            colX += cols[j].width;
        }

        y += 20;
    }

    y += 10;

    // Divider
    doc.moveTo(margin, y)
        .lineTo(pageWidth - margin, y)
        .strokeColor("#e5e7eb")
        .lineWidth(0.5)
        .stroke();

    y += 15;

    // ─── TOTALS ────────────────────────────────────────

    const totalsX = pageWidth - margin - 200;
    const totalsWidth = 200;

    const drawTotalRow = (label, value, bold = false) => {
        doc.fontSize(9)
            .font(bold ? "Helvetica-Bold" : "Helvetica")
            .fillColor(bold ? "#111827" : "#6b7280")
            .text(label, totalsX, y, {
                width: 110,
                align: "left",
            });

        doc.font(bold ? "Helvetica-Bold" : "Helvetica")
            .fillColor(bold ? "#111827" : "#374151")
            .text(value, totalsX + 110, y, {
                width: totalsWidth - 110,
                align: "right",
            });

        y += bold ? 20 : 16;
    };

    drawTotalRow("Total Quantity", String(invoice.totalQuantity));
    drawTotalRow("Subtotal", formatCurrency(invoice.subtotal));

    if (invoice.discount > 0) {
        drawTotalRow("Discount", `- ${formatCurrency(invoice.discount)}`);
    }

    drawTotalRow(
        "Shipping",
        invoice.shippingCharge === 0
            ? "FREE"
            : formatCurrency(invoice.shippingCharge)
    );

    if (invoice.tax > 0) {
        drawTotalRow("Tax", formatCurrency(invoice.tax));
    }

    // Grand Total divider
    doc.moveTo(totalsX, y)
        .lineTo(totalsX + totalsWidth, y)
        .strokeColor("#10b981")
        .lineWidth(1)
        .stroke();

    y += 8;
    drawTotalRow("Grand Total", formatCurrency(invoice.grandTotal), true);

    // ─── FOOTER ────────────────────────────────────────

    // Check if we need a new page for footer
    if (y > doc.page.height - 120) {
        doc.addPage();
        y = margin;
    }

    y = Math.max(y, doc.page.height - 120);

    // Divider
    doc.moveTo(margin, y)
        .lineTo(pageWidth - margin, y)
        .strokeColor("#e5e7eb")
        .lineWidth(0.5)
        .stroke();

    y += 15;

    doc.fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text("Thank you for shopping with us!", margin, y, {
            width: contentWidth,
            align: "center",
        });

    y += 16;

    doc.fontSize(7)
        .font("Helvetica")
        .fillColor("#9ca3af")
        .text(
            `If you have any questions, please contact ${storeConfig.supportEmail}`,
            margin,
            y,
            { width: contentWidth, align: "center" }
        );

    y += 12;

    doc.text(
        "This invoice was generated automatically.",
        margin,
        y,
        { width: contentWidth, align: "center" }
    );

    y += 12;

    doc.text(
        `Invoice ID: ${invoice.invoiceUUID}`,
        margin,
        y,
        { width: contentWidth, align: "center" }
    );
};
