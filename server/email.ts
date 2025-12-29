import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not set');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = 'info@webproitalia.com';
const TOUR_OPERATOR_EMAIL = 'siviaggiacondesi@gmail.com';

interface BookingEmailData {
  bookingId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelTitle: string;
  travelDate: string;
  numberOfParticipants: number;
  totalAmount: string;
  paymentProvider: string;
  paymentStatus: string;
  notes?: string;
}

// Nuova interfaccia per ordini con più tour
interface OrderItem {
  travelTitle: string;
  travelDate: string;
  numberOfParticipants: number;
  pricePerPerson: number;
  itemTotal: number;
  selectedAddons?: Array<{addonName: string, addonPrice: string, quantity: number}>;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  orderTotal: number;
  amountPaid: number;
  paymentType: 'full' | 'deposit';
  remainingBalance: number;
  paymentProvider: string;
  paymentStatus: string;
  notes?: string;
  transactionId?: string;
}

export async function sendOrderConfirmationEmails(data: OrderEmailData): Promise<void> {
  try {
    const isDeposit = data.paymentType === 'deposit';
    const paymentTypeLabel = isDeposit ? 'ACCONTO' : 'SALDO COMPLETO';
    const paymentTypeColor = isDeposit ? '#f59e0b' : '#10b981';
    
    // Genera la lista dei tour ordinati
    const itemsHtml = data.items.map(item => `
      <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb;">
        <div style="font-weight: bold; font-size: 16px; color: #1e3a5f; margin-bottom: 8px;">${item.travelTitle}</div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="color: #6b7280;">Data:</span>
          <span>${item.travelDate ? new Date(item.travelDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Da definire'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="color: #6b7280;">Partecipanti:</span>
          <span>${item.numberOfParticipants} person${item.numberOfParticipants > 1 ? 'e' : 'a'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 5px 0;">
          <span style="color: #6b7280;">Prezzo per persona:</span>
          <span>€${item.pricePerPerson.toFixed(2)}</span>
        </div>
        ${item.selectedAddons && item.selectedAddons.length > 0 ? `
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e5e7eb;">
            <span style="color: #6b7280; font-size: 12px;">Servizi aggiuntivi:</span>
            ${item.selectedAddons.map(addon => `
              <div style="display: flex; justify-content: space-between; padding: 3px 0; font-size: 13px;">
                <span>• ${addon.addonName} x${addon.quantity}</span>
                <span>€${(parseFloat(addon.addonPrice) * addon.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding: 8px 0; margin-top: 8px; border-top: 1px solid #e5e7eb; font-weight: bold;">
          <span>Subtotale:</span>
          <span style="color: #2563eb;">€${item.itemTotal.toFixed(2)}</span>
        </div>
      </div>
    `).join('');

    // Email per il cliente
    const customerEmail = {
      to: data.customerEmail,
      from: FROM_EMAIL,
      subject: `Conferma Ordine ${data.orderId} - Si viaggia con Desi`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Ordine Confermato!</h1>
              <p>Grazie per aver scelto i nostri tour a Sharm El Sheikh</p>
            </div>
            <div class="content">
              <p>Gentile <strong>${data.customerName}</strong>,</p>
              <p>Il tuo ordine è stato confermato con successo!</p>
              
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: bold; color: #1e3a5f;">Numero Ordine:</span>
                  <span style="font-family: monospace; background: #e5e7eb; padding: 5px 10px; border-radius: 4px;">${data.orderId}</span>
                </div>
              </div>

              <h3 style="color: #1e3a5f; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">🗓️ Tour Prenotati</h3>
              ${itemsHtml}

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid ${paymentTypeColor};">
                <h3 style="margin-top: 0; color: #1e3a5f;">💳 Riepilogo Pagamento</h3>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span>Totale Ordine:</span>
                  <span style="font-weight: bold; font-size: 18px;">€${data.orderTotal.toFixed(2)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span>Tipo Pagamento:</span>
                  <span style="background: ${paymentTypeColor}; color: white; padding: 3px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">${paymentTypeLabel}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span>Importo Pagato:</span>
                  <span style="font-weight: bold; color: #10b981; font-size: 18px;">€${data.amountPaid.toFixed(2)}</span>
                </div>
                
                ${data.transactionId ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <span>ID Transazione:</span>
                  <span style="font-family: monospace; background: #e5e7eb; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${data.transactionId}</span>
                </div>
                ` : ''}
                
                ${isDeposit ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; background: #fef3c7; margin: 10px -20px -20px; padding: 15px 20px; border-radius: 0 0 6px 6px;">
                  <span style="font-weight: bold; color: #92400e;">⚠️ Saldo da Versare:</span>
                  <span style="font-weight: bold; color: #92400e; font-size: 20px;">€${data.remainingBalance.toFixed(2)}</span>
                </div>
                ` : `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; background: #d1fae5; margin: 10px -20px -20px; padding: 15px 20px; border-radius: 0 0 6px 6px;">
                  <span style="font-weight: bold; color: #065f46;">✅ Pagamento Completato</span>
                  <span style="font-weight: bold; color: #065f46;">Saldo: €0.00</span>
                </div>
                `}
              </div>

              ${data.notes ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <h4 style="margin: 0 0 10px; color: #92400e;">📝 Note dell'ordine</h4>
                <p style="margin: 0;">${data.notes}</p>
              </div>
              ` : ''}

              ${isDeposit ? `
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 15px; font-weight: bold; color: #92400e;">
                  ⚠️ Ricorda: il saldo di <strong>€${data.remainingBalance.toFixed(2)}</strong> dovrà essere versato prima della partenza del tour.
                </p>
                <a href="https://escursioniasharmcondesi.com/versa-saldo?code=${encodeURIComponent(data.orderId)}" 
                   style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
                  💳 VERSA SALDO ORA
                </a>
                <p style="margin: 15px 0 0; font-size: 12px; color: #92400e;">
                  Clicca il pulsante per pagare il saldo rimanente direttamente online
                </p>
              </div>
              ` : ''}

              <p style="margin-top: 30px;">Riceverai ulteriori dettagli e istruzioni per i tour via email nei prossimi giorni.</p>
              <p>Per qualsiasi domanda, non esitare a contattarci!</p>
              
              <p style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px;">
                <strong>Si viaggia con Desi</strong><br>
                Escursioni a Sharm El Sheikh<br>
                📧 ${TOUR_OPERATOR_EMAIL}<br>
                📞 +39 123 456 7890
              </p>
            </div>
            <div class="footer">
              <p>Questa è una email automatica, per favore non rispondere a questo messaggio.</p>
              <p>&copy; 2025 Si viaggia con Desi. Tutti i diritti riservati.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email per il tour operator
    const operatorEmail = {
      to: TOUR_OPERATOR_EMAIL,
      from: FROM_EMAIL,
      subject: `🎉 Nuovo Ordine ${data.orderId} - ${data.items.length} tour - €${data.amountPaid.toFixed(2)} ${isDeposit ? '(ACCONTO)' : '(SALDO)'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nuovo Ordine Ricevuto!</h1>
              <p style="font-size: 24px; margin: 10px 0;">€${data.amountPaid.toFixed(2)}</p>
              <span style="background: ${paymentTypeColor}; padding: 5px 15px; border-radius: 20px; font-size: 14px;">${paymentTypeLabel}</span>
            </div>
            <div class="content">
              
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold;">Ordine:</span>
                <span style="font-family: monospace; background: #e5e7eb; padding: 5px 10px; border-radius: 4px;">${data.orderId}</span>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0; color: #059669;">👤 Informazioni Cliente</h3>
                <p><strong>Nome:</strong> ${data.customerName}</p>
                <p><strong>Email:</strong> ${data.customerEmail}</p>
                <p><strong>Telefono:</strong> ${data.customerPhone || 'Non fornito'}</p>
              </div>

              <h3 style="color: #059669; border-bottom: 2px solid #10b981; padding-bottom: 10px;">🗓️ Tour Ordinati (${data.items.length})</h3>
              ${itemsHtml}

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid ${paymentTypeColor};">
                <h3 style="margin-top: 0; color: #059669;">💰 Riepilogo Economico</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;">Totale Ordine:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px;">€${data.orderTotal.toFixed(2)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;">Tipo Pagamento:</td>
                    <td style="padding: 10px 0; text-align: right;">
                      <span style="background: ${paymentTypeColor}; color: white; padding: 3px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">${paymentTypeLabel}</span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;">Metodo Pagamento:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.paymentProvider.toUpperCase()}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e5e7eb; background: #d1fae5;">
                    <td style="padding: 10px; font-weight: bold; color: #065f46;">Importo Incassato:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #065f46; font-size: 20px;">€${data.amountPaid.toFixed(2)}</td>
                  </tr>
                  ${isDeposit ? `
                  <tr style="background: #fef3c7;">
                    <td style="padding: 10px; font-weight: bold; color: #92400e;">⚠️ Saldo Mancante:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #92400e; font-size: 20px;">€${data.remainingBalance.toFixed(2)}</td>
                  </tr>
                  ` : `
                  <tr style="background: #d1fae5;">
                    <td style="padding: 10px; font-weight: bold; color: #065f46;">✅ Pagamento Completo</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #065f46;">Saldo: €0.00</td>
                  </tr>
                  `}
                </table>
              </div>

              ${data.notes ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <h4 style="margin: 0 0 10px; color: #92400e;">📝 Note del Cliente</h4>
                <p style="margin: 0;">${data.notes}</p>
              </div>
              ` : ''}

              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px;">
                <p style="margin: 0;"><strong>Azione Richiesta:</strong></p>
                <p style="margin: 10px 0 0;">Verifica l'ordine nel pannello admin e contatta il cliente per confermare i dettagli dei tour.</p>
                ${isDeposit ? `<p style="margin: 10px 0 0; color: #92400e; font-weight: bold;">⚠️ Ricordare al cliente il saldo di €${data.remainingBalance.toFixed(2)}</p>` : ''}
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Invia entrambe le email
    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(operatorEmail),
    ]);

    console.log(`✅ Email ordine inviate con successo per ordine ${data.orderId}`);
  } catch (error) {
    console.error('❌ Errore invio email ordine:', error);
    throw error;
  }
}

export async function sendBookingConfirmationEmails(data: BookingEmailData): Promise<void> {
  try {
    // Email per il cliente
    const customerEmail = {
      to: data.customerEmail,
      from: FROM_EMAIL,
      subject: `Conferma Prenotazione #${data.bookingId} - ${data.travelTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: bold; color: #1e3a5f; }
            .info-value { color: #4b5563; }
            .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Prenotazione Confermata!</h1>
              <p>Grazie per aver scelto i nostri tour a Sharm El Sheikh</p>
            </div>
            <div class="content">
              <p>Gentile ${data.customerName},</p>
              <p>La tua prenotazione è stata confermata con successo!</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #1e3a5f;">Dettagli della Prenotazione</h3>
                <div class="info-row">
                  <span class="info-label">Numero Prenotazione:</span>
                  <span class="info-value">#${data.bookingId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tour:</span>
                  <span class="info-value">${data.travelTitle}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Data Partenza:</span>
                  <span class="info-value">${new Date(data.travelDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Partecipanti:</span>
                  <span class="info-value">${data.numberOfParticipants} person${data.numberOfParticipants > 1 ? 'e' : 'a'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Importo Pagato:</span>
                  <span class="info-value" style="font-size: 18px; font-weight: bold; color: #10b981;">€ ${parseFloat(data.totalAmount).toLocaleString('it-IT')}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Stato Pagamento:</span>
                  <span class="success-badge">${data.paymentStatus === 'succeeded' ? 'PAGATO' : 'IN ELABORAZIONE'}</span>
                </div>
              </div>

              ${data.notes ? `
              <div class="info-box">
                <h3 style="margin-top: 0; color: #1e3a5f;">Note della Prenotazione</h3>
                <p style="margin: 0;">${data.notes}</p>
              </div>
              ` : ''}

              <p style="margin-top: 30px;">Riceverai ulteriori dettagli e istruzioni per il tour via email nei prossimi giorni.</p>
              <p>Per qualsiasi domanda, non esitare a contattarci!</p>
              
              <p style="margin-top: 30px;">
                <strong>Si viaggia con Desi</strong><br>
                Escursioni a Sharm El Sheikh<br>
                📧 ${TOUR_OPERATOR_EMAIL}<br>
                📞 +39 123 456 7890
              </p>
            </div>
            <div class="footer">
              <p>Questa è una email automatica, per favore non rispondere a questo messaggio.</p>
              <p>&copy; 2025 Si viaggia con Desi. Tutti i diritti riservati.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Email per il tour operator
    const operatorEmail = {
      to: TOUR_OPERATOR_EMAIL,
      from: FROM_EMAIL,
      subject: `🎉 Nuova Prenotazione #${data.bookingId} - ${data.travelTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
            .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-label { font-weight: bold; color: #059669; }
            .info-value { color: #4b5563; }
            .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nuova Prenotazione Ricevuta!</h1>
              <p>Dashboard Admin - Notifica Prenotazione</p>
            </div>
            <div class="content">
              <h2 style="color: #059669;">Dettagli Prenotazione #${data.bookingId}</h2>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #059669;">Informazioni Cliente</h3>
                <div class="info-row">
                  <span class="info-label">Nome:</span>
                  <span class="info-value">${data.customerName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${data.customerEmail}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Telefono:</span>
                  <span class="info-value">${data.customerPhone}</span>
                </div>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #059669;">Dettagli Tour</h3>
                <div class="info-row">
                  <span class="info-label">Tour:</span>
                  <span class="info-value">${data.travelTitle}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Data Partenza:</span>
                  <span class="info-value">${new Date(data.travelDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Numero Partecipanti:</span>
                  <span class="info-value">${data.numberOfParticipants}</span>
                </div>
              </div>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #059669;">Dettagli Pagamento</h3>
                <div class="info-row">
                  <span class="info-label">Metodo Pagamento:</span>
                  <span class="info-value">${data.paymentProvider.toUpperCase()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Stato:</span>
                  <span class="info-value" style="color: #10b981; font-weight: bold;">${data.paymentStatus === 'succeeded' ? 'PAGATO' : 'IN ELABORAZIONE'}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Importo:</span>
                  <span class="info-value" style="font-size: 20px; font-weight: bold; color: #10b981;">€ ${parseFloat(data.totalAmount).toLocaleString('it-IT')}</span>
                </div>
              </div>

              ${data.notes ? `
              <div class="alert-box">
                <h3 style="margin-top: 0; color: #f59e0b;">⚠️ Note del Cliente</h3>
                <p style="margin: 0;">${data.notes}</p>
              </div>
              ` : ''}

              <p style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
                <strong>Azione Richiesta:</strong><br>
                Verifica la prenotazione nel pannello admin e contatta il cliente per confermare i dettagli del tour.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Invia entrambe le email
    await Promise.all([
      sgMail.send(customerEmail),
      sgMail.send(operatorEmail),
    ]);

    console.log(`✅ Email inviate con successo per prenotazione #${data.bookingId}`);
  } catch (error) {
    console.error('❌ Errore invio email:', error);
    throw error;
  }
}
