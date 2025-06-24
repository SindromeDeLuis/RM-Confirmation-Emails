import { Resend } from 'resend';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  // const client = new Client()
  //   .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
  //   .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  //   .setKey(req.headers['x-appwrite-key'] ?? '');
  const resend = new Resend(process.env.APPWRITE_RESEND_API);

  if (
    !req.bodyJson.email ||
    !req.bodyJson.name ||
    !req.bodyJson.paymentId ||
    !req.bodyJson.paymentReference
  ) {
    return res.json(
      {
        message: `Missing required fields: email, name, paymentId, paymentReference`,
      },
      400
    );
  }

  if (req.bodyJson.status == 'aprobado') {
    let ticketsHTML = '';
    req.bodyJson.raffleTickets.forEach(element => {
      ticketsHTML += `
        <b style="border-radius:4px;background:green;color:white;padding:5px 8px;font-size:18pt;">${element}</b>`;
    });
    const data = await resend.emails.send({
      from: 'non-reply@ganaconmarin.com',
      to: [req.bodyJson.email],
      subject: 'Pago aprobado en la rifa',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <h1 class="text-3xl font-bold text-green-600 mb-4">¡Pago Aprobado!</h1>
      <p class="text-gray-600 mb-6">
          ¡Excelentes noticias ${req.bodyJson.name}!<br>
          Tu pago con la referencia: ${req.bodyJson.paymentReference} ha sido aprobado exitosamente.
      </p>
      <p class="text-gray-600 mb-6">
          Ya estás participando oficialmente en nuestra rifa.
      </p>
      <p class="text-gray-600 mb-6">
          Has comprado los siguientes números:
      </p>
      <p class="text-gray-600 mb-6">
        ${ticketsHTML}
      </p>
      <p class="text-gray-600 mb-6">
          Puedes ver los detalles de tu participación aquí:
      </p>
      <a href="https://www.ganaconmarin.com/payment-info/${req.bodyJson.paymentId}" 
         class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          Ver la Información de la Compra
      </a>
      <p class="text-sm text-gray-500 mt-6">
          ¡Mucha suerte en el sorteo!
      </p>
  </div>
</body>
</html>
    `,
    });

    if (data.error) {
      return error({ error: data.error });
    }

    log({ data: data.data });
    return res.json({
      message: `Email sent to ${req.bodyJson.email}`,
    });
  }

  if (req.bodyJson.status == 'rechazado') {
    const data = await resend.emails.send({
      from: 'non-reply@ganaconmarin.com',
      to: [req.bodyJson.email],
      subject: 'Pago rechazado en la rifa',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <h1 class="text-3xl font-bold text-red-600 mb-4">Pago Rechazado</h1>
      <p class="text-gray-600 mb-6">
          Estimado ${req.bodyJson.name},<br>
          Lamentamos informarte que tu pago con la referencia: ${req.bodyJson.paymentReference} ha sido rechazado.
      </p>
      <p class="text-gray-600 mb-6">
          No te preocupes, puedes intentar nuevamente con otro método de pago o registrar una nueva compra:
      </p>
      <div class="space-y-4">
          <a href="https://www.ganaconmarin.com/payment-info/${req.bodyJson.paymentId}" 
             class="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Ver Detalles del Pago
          </a>
          <br>
          <br>
          <a href="https://www.ganaconmarin.com/rifa/${req.bodyJson.raffleId}" 
             class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Intentar Nueva Compra
          </a>
      </div>
      <p class="text-sm text-gray-500 mt-6">
          Si necesitas ayuda, no dudes en contactarnos.
      </p>
  </div>
</body>
</html>
    `,
    });

    if (data.error) {
      return error({ error: data.error });
    }

    log({ data: data.data });
    return res.json({
      message: `Email sent to ${req.bodyJson.email}`,
    });
  } else {
    const data = await resend.emails.send({
      from: 'non-reply@ganaconmarin.com',
      to: [req.bodyJson.email],
      subject: 'Gracias por tu compra en Ganaconmarin.com',
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h1>
        <p class="text-gray-600 mb-6">
          ${req.bodyJson.name}, gracias por participar en nuestra rifa.
        </p>
        <p class="text-gray-600 mb-6">
            Hemos recibido tu pago con la referencia: ${req.bodyJson.paymentReference}.
        </p>
        <p class="text-gray-600 mb-6">
           Estamos validando tu pago, en lo que este aprobado, te notificaremos.
           Puedes hacerle seguimiento desde aqui:
        </p>
        <a href="https://www.ganaconmarin.com/payment-info/${req.bodyJson.paymentId}" 
           class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Ver la información de la compra
        </a>
    </div>
  </body>
  </html>
    `,
    });

    if (data.error) {
      return error({ error: data.error });
    }

    log({ data: data.data });
    return res.json({
      message: `Email sent to ${req.bodyJson.email}`,
    });
  }
};
