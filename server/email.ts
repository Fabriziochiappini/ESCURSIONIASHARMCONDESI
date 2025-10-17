import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not set');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = 'info@webproitalia.com';
const TOUR_OPERATOR_EMAIL = 'tuacarfrosinone@gmail.com';

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
