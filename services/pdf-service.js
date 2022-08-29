const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, dataCallback, endCallback) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    generateHeader(doc, invoice);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc, invoice);

    doc.end();
}

function generateHeader(doc, invoice) {
    doc.fontSize(10)
        .text(invoice.creator.name, 200, 50, { align: "right" })
        .text(invoice.creator.email, 200, 65, { align: "right" })
        .text(invoice.creator.address, 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;
    const amount = invoice.items.reduce(
        (accu, curr) => accu + curr.quantity * curr.item.cost,
        0
    );

    doc.fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_number, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(invoice.createdAt), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(formatCurrency(amount), 150, customerInformationTop + 30)

        .font("Helvetica-Bold")
        .text(invoice.client.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.client.email, 300, customerInformationTop + 15)
        .text(invoice.client.address, 300, customerInformationTop + 30)
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const amount = item.quantity * item.item.cost;
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.item.name,
            item.item.description.slice(0, 32) + "...",
            formatCurrency(item.item.cost),
            item.quantity,
            formatCurrency(amount)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    const amount = invoice.items.reduce(
        (accu, curr) => accu + curr.quantity * curr.item.cost,
        0
    );
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(amount)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Paid To Date",
        "",
        formatCurrency(0)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(amount)
    );
    doc.font("Helvetica");
}

function generateFooter(doc, invoice) {
    doc.fontSize(10).text(
        "Payment is due " + formatDate(invoice.due_date) + ". Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
    );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc.fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(amount) {
    return "$" + amount.toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    createInvoice,
};
