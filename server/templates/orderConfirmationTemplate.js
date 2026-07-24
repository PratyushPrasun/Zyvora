import storeConfig from "../config/store.js";

/**
 * Format currency value to INR.
 */
const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
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
 * Generate professional responsive HTML email
 * for order confirmation.
 *
 * @param {Object} invoice — Invoice document
 * @param {string} clientUrl — Frontend base URL
 * @returns {string} HTML email body
 */
export const buildOrderConfirmationHtml = (invoice, clientUrl) => {
    const orderId = invoice.order.toString
        ? invoice.order.toString()
        : invoice.order;

    const viewOrderUrl = `${clientUrl}/account/orders/${orderId}`;
    const downloadInvoiceUrl = `${clientUrl}/account/orders/${orderId}`;
    const continueShoppingUrl = `${clientUrl}/shop`;

    // Payment-specific messaging
    const paymentMessage =
        invoice.paymentMethod === "COD"
            ? `<p style="margin:0;color:#92400e;font-size:14px;line-height:1.6;">
                 Your order has been confirmed.<br/>
                 Payment will be collected upon delivery.
               </p>`
            : `<p style="margin:0;color:#065f46;font-size:14px;line-height:1.6;">
                 Payment received successfully.<br/>
                 Thank you for your purchase!
               </p>`;

    const paymentBgColor =
        invoice.paymentMethod === "COD" ? "#fffbeb" : "#ecfdf5";
    const paymentBorderColor =
        invoice.paymentMethod === "COD" ? "#fde68a" : "#a7f3d0";

    // Build product rows
    const productRows = (invoice.items || [])
        .map(
            (item) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;">
            <div style="display:flex;align-items:center;gap:12px;">
              ${
                  item.image
                      ? `<img src="${item.image}" alt="${item.title}" width="48" height="48" style="border-radius:8px;object-fit:cover;border:1px solid #f3f4f6;"/>`
                      : `<div style="width:48px;height:48px;border-radius:8px;background:#f3f4f6;"></div>`
              }
              <div>
                <p style="margin:0;font-weight:600;color:#111827;font-size:13px;">${item.title}</p>
                ${item.category ? `<p style="margin:2px 0 0;color:#9ca3af;font-size:11px;">${item.category}</p>` : ""}
              </div>
            </div>
          </td>
          <td style="padding:12px 16px;text-align:center;color:#374151;font-size:13px;border-bottom:1px solid #f3f4f6;">
            ${item.quantity}
          </td>
          <td style="padding:12px 16px;text-align:right;color:#374151;font-size:13px;border-bottom:1px solid #f3f4f6;">
            ${formatCurrency(item.finalPrice)}
          </td>
          <td style="padding:12px 16px;text-align:right;font-weight:600;color:#111827;font-size:13px;border-bottom:1px solid #f3f4f6;">
            ${formatCurrency(item.subtotal)}
          </td>
        </tr>`
        )
        .join("");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation — ${storeConfig.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                ${storeConfig.name}
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">
                Order Confirmation
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">
                Hi ${invoice.customerName}! 👋
              </h2>
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                Thank you for your order. We're excited to get your items on their way!
              </p>
            </td>
          </tr>

          <!-- Payment Status Message -->
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="background:${paymentBgColor};border:1px solid ${paymentBorderColor};border-radius:12px;padding:16px 20px;">
                ${paymentMessage}
              </div>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="background:#f9fafb;border-radius:12px;padding:20px;border:1px solid #f3f4f6;">
                <h3 style="margin:0 0 16px;color:#111827;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                  Order Summary
                </h3>
                <table width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Order Number</td>
                    <td style="padding:4px 0;text-align:right;font-weight:600;color:#111827;font-family:monospace;">${invoice.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Invoice Number</td>
                    <td style="padding:4px 0;text-align:right;font-weight:600;color:#111827;font-family:monospace;">${invoice.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Order Date</td>
                    <td style="padding:4px 0;text-align:right;font-weight:600;color:#111827;">${formatDate(invoice.orderDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Payment Method</td>
                    <td style="padding:4px 0;text-align:right;font-weight:600;color:#111827;">
                      ${invoice.paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment"}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Payment Status</td>
                    <td style="padding:4px 0;text-align:right;">
                      <span style="display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;${
                          invoice.paymentStatus === "Paid"
                              ? "background:#ecfdf5;color:#065f46;"
                              : "background:#fffbeb;color:#92400e;"
                      }">
                        ${invoice.paymentStatus}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="background:#f9fafb;border-radius:12px;padding:20px;border:1px solid #f3f4f6;">
                <h3 style="margin:0 0 12px;color:#111827;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                  Shipping Address
                </h3>
                <p style="margin:0;color:#374151;font-size:13px;line-height:1.8;">
                  <strong>${invoice.shippingAddress?.fullName || invoice.customerName}</strong><br/>
                  ${invoice.shippingAddress?.addressLine1 || ""}${invoice.shippingAddress?.addressLine2 ? `, ${invoice.shippingAddress.addressLine2}` : ""}<br/>
                  ${[invoice.shippingAddress?.city, invoice.shippingAddress?.state, invoice.shippingAddress?.pincode].filter(Boolean).join(", ")}<br/>
                  ${invoice.shippingAddress?.country || "India"}
                  ${invoice.shippingAddress?.phone ? `<br/>Phone: ${invoice.shippingAddress.phone}` : ""}
                </p>
              </div>
            </td>
          </tr>

          <!-- Products Table -->
          <tr>
            <td style="padding:0 40px 24px;">
              <h3 style="margin:0 0 16px;color:#111827;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                Items Ordered
              </h3>
              <table width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #f3f4f6;border-radius:12px;overflow:hidden;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                    <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="font-size:13px;">
                <tr>
                  <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
                  <td style="padding:4px 0;text-align:right;color:#374151;">${formatCurrency(invoice.subtotal)}</td>
                </tr>
                ${invoice.discount > 0 ? `
                <tr>
                  <td style="padding:4px 0;color:#6b7280;">Discount</td>
                  <td style="padding:4px 0;text-align:right;color:#10b981;">- ${formatCurrency(invoice.discount)}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:4px 0;color:#6b7280;">Shipping</td>
                  <td style="padding:4px 0;text-align:right;color:${invoice.shippingCharge === 0 ? "#10b981" : "#374151"};">
                    ${invoice.shippingCharge === 0 ? "FREE" : formatCurrency(invoice.shippingCharge)}
                  </td>
                </tr>
                ${invoice.tax > 0 ? `
                <tr>
                  <td style="padding:4px 0;color:#6b7280;">Tax</td>
                  <td style="padding:4px 0;text-align:right;color:#374151;">${formatCurrency(invoice.tax)}</td>
                </tr>` : ""}
                <tr>
                  <td colspan="2" style="padding:8px 0 0;">
                    <div style="border-top:2px solid #10b981;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#111827;">Grand Total</td>
                  <td style="padding:12px 0 0;text-align:right;font-size:16px;font-weight:700;color:#111827;">${formatCurrency(invoice.grandTotal)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding:0 0 12px;">
                    <a href="${viewOrderUrl}" target="_blank" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;text-decoration:none;border-radius:12px;font-weight:600;font-size:14px;letter-spacing:0.3px;">
                      View Order
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right:8px;">
                          <a href="${downloadInvoiceUrl}" target="_blank" style="display:inline-block;padding:10px 24px;border:1.5px solid #d1d5db;color:#374151;text-decoration:none;border-radius:10px;font-weight:600;font-size:12px;">
                            Download Invoice
                          </a>
                        </td>
                        <td>
                          <a href="${continueShoppingUrl}" target="_blank" style="display:inline-block;padding:10px 24px;border:1.5px solid #d1d5db;color:#374151;text-decoration:none;border-radius:10px;font-weight:600;font-size:12px;">
                            Continue Shopping
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">
                Need help? Contact us at
                <a href="mailto:${storeConfig.supportEmail}" style="color:#10b981;text-decoration:none;font-weight:600;">
                  ${storeConfig.supportEmail}
                </a>
              </p>
              <p style="margin:0;color:#d1d5db;font-size:11px;">
                © ${new Date().getFullYear()} ${storeConfig.name}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
