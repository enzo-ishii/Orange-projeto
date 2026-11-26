// Template do e-mail de boas-vindas enviado quando uma conta e criada.
// Os links sao inseridos ja escapados para atributo HTML.

export const WELCOME_EMAIL_SUBJECT = 'Obrigado por se cadastrar na Orange';

export function renderWelcomeEmailText({ privacyUrl, unsubscribeUrl }: { privacyUrl: string; unsubscribeUrl: string }) {
  return [
    'Obrigado por se cadastrar.',
    '',
    'Que bom ter você com a gente. Estamos preparando o lançamento da Orange e, em breve, mandamos as novidades por aqui.',
    'E tem presente: o seu cadastro já garante 10% OFF na primeira compra.',
    '',
    'SEU CUPOM DE BOAS-VINDAS: 10% OFF na sua primeira compra.',
    'Garantido pelo seu cadastro. O código chega no seu e-mail no dia do lançamento. Válido para uma compra.',
    '',
    'O que vem aí: suco de laranja 100% natural com colágeno, feito em Brasília. Você retira a sua garrafa gelada nas máquinas automáticas da Orange, sem fila e sem atendente, na hora que quiser.',
    '',
    'Siga no Instagram: https://www.instagram.com/bebaorange/',
    'Conhece alguém que ia gostar? Manda https://bebaorange.com pra essa pessoa garantir os 10% também.',
    '',
    '--',
    'Orange · Brasília, DF',
    'Você recebeu este e-mail porque se cadastrou em bebaorange.com.',
    `Privacidade: ${privacyUrl}`,
    `Não quero mais receber: ${unsubscribeUrl}`,
  ].join('\n');
}

export function renderWelcomeEmailHtml({ privacyUrl, unsubscribeUrl }: { privacyUrl: string; unsubscribeUrl: string }) {
  return `<!DOCTYPE html>
<html lang="pt-BR" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Obrigado por se cadastrar na Orange</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet"><!--<![endif]-->
<!--[if mso]><style>h1,p,td,a,span,strong{font-family:Arial,sans-serif!important}</style><![endif]-->
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0;mso-table-rspace:0}
  img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
  body{margin:0!important;padding:0!important;width:100%!important}
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
  u + #corpo a{color:inherit;text-decoration:none}
  [data-ogsc] .cupom{background-color:#FFF4E6!important}
  [data-ogsc] .cupom .tinta{color:#111111!important}
  [data-ogsc] .cupom .laranja{color:#FF6A00!important}
  @media only screen and (max-width:620px){
    .wrap{width:100%!important}
    .px{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:36px!important;line-height:40px!important}
    .big{font-size:50px!important;line-height:54px!important;white-space:nowrap!important}
    .col{display:block!important;width:100%!important;padding:0 0 18px 0!important}
    .chip{display:block!important;width:100%!important;padding:0 0 8px 0!important}
    .btn{display:block!important;text-align:center!important}
  }
</style>
</head>
<body id="corpo" style="margin:0;padding:0;background-color:#0B0B0B;">

<!-- Texto de prévia: aparece ao lado do assunto na caixa de entrada -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#0B0B0B;opacity:0;">
Seu cadastro está confirmado e já garante 10% OFF na sua primeira compra.&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0B0B;">
<tr><td align="center" style="padding:24px 12px 32px 12px;">

  <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
  <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#111111;border-radius:20px;border:1px solid #241B14;">

    <!-- Topo com brilho laranja (no Outlook fica só a cor de fundo) -->
    <tr><td bgcolor="#1A110B" style="background-color:#1A110B;background-image:linear-gradient(200deg,#5A2208 0%,#2A140A 32%,#111111 70%);border-radius:20px 20px 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

        <!-- Marca -->
        <tr><td class="px" style="padding:32px 40px 0 40px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="middle" style="padding-right:12px;">
              <a href="https://bebaorange.com" target="_blank" style="text-decoration:none;"><img src="https://bebaorange.com/orange-logo.png" width="39" height="39" alt="" style="display:block;width:39px;height:39px;border:0;color:#FF6A00;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;"></a>
            </td>
            <td valign="middle" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:18px;font-weight:bold;letter-spacing:3px;color:#FFF4E6;">BEBA&nbsp;ORANGE</td>
          </tr></table>
        </td></tr>

        <!-- Título -->
        <tr><td class="px" style="padding:56px 40px 0 40px;">
          <p style="margin:0 0 14px 0;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:16px;letter-spacing:3px;text-transform:uppercase;color:#FF8A1F;">Cadastro confirmado / Brasília</p>
          <h1 class="h1" style="margin:0;font-family:'Archivo Black','Arial Black',Arial,sans-serif;font-weight:900;font-size:46px;line-height:50px;color:#FFF4E6;">Obrigado por se cadastrar<span style="color:#FF6A00;">.</span></h1>
        </td></tr>

        <!-- Texto -->
        <tr><td class="px" style="padding:22px 40px 40px 40px;font-family:'Fraunces',Georgia,'Times New Roman',serif;font-size:18px;line-height:28px;color:#E9DFD2;">
          <p style="margin:0 0 14px 0;">Que bom ter você com a gente. Estamos preparando o lançamento da Orange e, em breve, mandamos as novidades por aqui.</p>
          <p style="margin:0;">E tem presente: <strong style="color:#FFF4E6;font-weight:600;">o seu cadastro já garante 10% OFF na primeira compra.</strong></p>
        </td></tr>

      </table>
    </td></tr>

    <!-- Cupom (bilhete creme) -->
    <tr><td class="px" style="padding:0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="cupom" bgcolor="#FFF4E6" style="background-color:#FFF4E6;border-radius:16px;">
        <tr><td align="center" style="padding:30px 24px 22px 24px;">
          <p style="margin:0 0 6px 0;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:16px;letter-spacing:3px;text-transform:uppercase;color:#7A4A26;">Seu cupom de boas-vindas</p>
          <p class="big laranja" style="margin:0;font-family:'Archivo Black','Arial Black',Arial,sans-serif;font-weight:900;font-size:80px;line-height:80px;color:#FF6A00;">10% OFF</p>
          <p class="tinta" style="margin:8px 0 0 0;font-family:'Fraunces',Georgia,serif;font-size:18px;line-height:24px;color:#111111;">na sua primeira compra</p>
        </td></tr>
        <tr><td style="padding:0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:2px dashed #E2CBB0;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table></td></tr>
        <tr><td align="center" style="padding:16px 24px 22px 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:#5C4A3A;">
          Garantido pelo seu cadastro. O código chega no seu e-mail no dia do lançamento. Válido para uma compra.
        </td></tr>
      </table>
    </td></tr>

    <!-- O que é a Orange -->
    <tr><td class="px" style="padding:44px 40px 0 40px;">
      <p style="margin:0 0 10px 0;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:16px;letter-spacing:3px;text-transform:uppercase;color:#FF8A1F;">O que vem aí</p>
      <p style="margin:0 0 18px 0;font-family:'Fraunces',Georgia,serif;font-size:17px;line-height:26px;color:#E9DFD2;">Suco de laranja 100% natural com colágeno, feito em Brasília. Você retira a sua garrafa gelada nas máquinas automáticas da Orange, sem fila e sem atendente, na hora que quiser.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="chip" width="33%" style="padding:0 4px 0 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="border:1px solid #3A2A1E;border-radius:999px;padding:10px 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:16px;color:#FFF4E6;"><span style="color:#FF6A00;">&#9679;</span>&nbsp;Laranja espremida</td></tr></table>
        </td>
        <td class="chip" width="33%" style="padding:0 2px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="border:1px solid #3A2A1E;border-radius:999px;padding:10px 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:16px;color:#FFF4E6;"><span style="color:#FF6A00;">&#9679;</span>&nbsp;Com colágeno</td></tr></table>
        </td>
        <td class="chip" width="33%" style="padding:0 0 0 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="border:1px solid #3A2A1E;border-radius:999px;padding:10px 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:16px;color:#FFF4E6;"><span style="color:#FF6A00;">&#9679;</span>&nbsp;Sem conservante</td></tr></table>
        </td>
      </tr></table>
    </td></tr>

    <!-- Botão -->
    <tr><td class="px" align="left" style="padding:36px 40px 0 40px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.instagram.com/bebaorange/" style="height:54px;v-text-anchor:middle;width:300px;" arcsize="50%" stroke="f" fillcolor="#FF6A00">
        <w:anchorlock/><center style="color:#111111;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Seguir no Instagram</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a class="btn" href="https://www.instagram.com/bebaorange/" target="_blank" style="display:inline-block;background-color:#FF6A00;color:#111111;font-family:'Archivo Black','Arial Black',Arial,sans-serif;font-size:16px;line-height:20px;text-decoration:none;padding:17px 34px;border-radius:999px;mso-hide:all;">Seguir no Instagram <span aria-hidden="true">&#8594;</span></a>
      <!--<![endif]-->
    </td></tr>

    <!-- Indicar -->
    <tr><td class="px" style="padding:22px 40px 40px 40px;font-family:'Fraunces',Georgia,serif;font-size:15px;line-height:22px;color:#BFB6AA;">
      As novidades do lançamento saem primeiro por lá. E se conhece alguém que ia gostar, manda <a href="https://bebaorange.com" target="_blank" style="color:#FF8A1F;text-decoration:underline;">bebaorange.com</a> pra essa pessoa garantir os 10% também.
    </td></tr>

    <!-- Faixa laranja -->
    <tr><td bgcolor="#FF6A00" align="center" style="background-color:#FF6A00;padding:14px 24px;border-radius:0 0 20px 20px;font-family:'Archivo Black','Arial Black',Arial,sans-serif;font-size:13px;line-height:18px;letter-spacing:2px;text-transform:uppercase;color:#111111;">
      Laranja de verdade &middot; Gelada &middot; Brasília
    </td></tr>

  </table>

  <!-- Rodapé -->
  <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
    <tr><td class="px" align="center" style="padding:24px 40px 0 40px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8278;">
      <p style="margin:0 0 8px 0;">Orange &middot; Brasília, DF<br>Você recebeu este e-mail porque se cadastrou em bebaorange.com.</p>
      <p style="margin:0;"><a href="https://www.instagram.com/bebaorange/" target="_blank" style="color:#BFB6AA;text-decoration:underline;">Instagram</a> &nbsp;&middot;&nbsp; <a href="${privacyUrl}" target="_blank" style="color:#BFB6AA;text-decoration:underline;">Privacidade</a> &nbsp;&middot;&nbsp; <a href="${unsubscribeUrl}" target="_blank" style="color:#8A8278;text-decoration:underline;">Não quero mais receber</a></p>
    </td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->

</td></tr>
</table>
</body>
</html>
`;
}
