/**
 * Builds the HTML and plaintext for the SES email
 */
export function buildWelcomeEmail(firstName: string) {
  const safeName = (firstName || "").trim() || "there";
  const brandLogo = process.env.BRAND_PRIMARY_WEBSITE + "\\logo.svg"  || "";
  const bookCover = process.env.BRAND_PRIMARY_WEBSITE + "\\honest-investments-cover.webp"  || "";
  const ebookUrl = process.env.BRAND_PRIMARY_WEBSITE + "/" + process.env.EBOOK_URL || `https://www.gianlucafornaciari.com/honest-investments-book-gf-free-ZS2J5i|.ju<1bzo-24L96i.pdf`;
  const linkedin = process.env.BRAND_PRIMARY_LINKEDIN || "#";
  const website = process.env.BRAND_PRIMARY_WEBSITE || "#";
  const x = process.env.BRAND_PRIMARY_X || "#";

  const subject = `Finally ${safeName}! Time to Start Investing (incl. Honest Investment Guide)`;

  const text = `Welcome ${safeName}!!\n\nAs promised, here you have my investment guide. This text is designed to give you the knowledge you need to start investing responsibly as fast as possible.\n\nRemember: even with the right knowledge, taking action matters (not much action, but still some). That's why it's simple and includes practical tips and checklists.\n\nWish you success!\n\nRead the guide: ${ebookUrl}\n\nP.S.: one day, when these tips will make you wealthy and you wish to give back, keep in mind that I love steaks.\n`;

  const html = `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
    <style>
      /* Email-safe basic reset */
      body { margin:0; padding:0; background:#ffffff; }
      table { border-collapse:collapse; }
      img { display:block; border:0; line-height:0; }
      .container { width:100%; background:#ffffff; }
      .wrapper { max-width:600px; margin:0 auto; }
      .content { font-family: Verdana, Arial, sans-serif; font-size:12px; color:#111111; line-height:1.6; }
      .center { text-align:center; }
      .heading { font-size:16px; font-weight:bold; margin:16px 0; }
      .btn { display:inline-block; padding:12px 20px; background:#8b0000; color:#ffffff !important; text-decoration:none; font-weight:bold; border-radius:4px; }
      .separator { height:3px; background:#000000; margin:24px 0; }
      .muted { color:#666666; font-style:italic; font-size:8px; }
      .social td { padding:0 6px; }
      .footer { font-size:10px; color:#888888; text-align:center; padding:16px 0; }
      @media (prefers-color-scheme: dark) {
        body { background:#000; }
        .content { color:#eaeaea; }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="container" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <table role="presentation" class="wrapper" width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:24px 0; text-align:center;">
                  ${brandLogo ? `<img src="${brandLogo}" alt="Gianluca Fornaciari" width="120" style="display:block; margin:0 auto; max-width:100%; height:auto;" />` : ""}
                </td>
            </tr>
            <tr><td class="content" style="padding: 0 20px 8px; text-align:center;">
              <div class="heading">Welcome ${safeName}!!</div>
              <p>As promised, here you have my investment guide.</p>
              <p>This piece of text is designed to give you the knowledge that you need to start investing responsibly as fast as possible.</p>
              <p>Remember that even if you have the right knowledge, and you have it now, taking action is key (not much action, but still some action). Therefore, I wrote it simple including practical tips and checklists. This file already helped many, I hope it does the same for you.</p>
              <p><strong>Wish you success!</strong></p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFD700; margin:0; padding:0;">
                <tr>
                    <td align="center" style="padding:24px 0;">
                    ${bookCover ? `<img src="${bookCover}" alt="Book Cover" width="240" style="display:block; max-width:100%; height:auto;" />` : ""}
                    </td>
                </tr>
              </table>
              <p class="center" style="padding:16px 0 8px;">
                <a class="btn" href="${ebookUrl}" target="_blank" rel="noopener noreferrer">Click to Read</a>
              </p>
              <p class="muted">P.S.: one day, when these tips will make you wealthy and you wish to give back, keep in mind that I love steaks.</p>
              <div class="separator"></div>
              <table class="social" role="presentation" align="center" cellpadding="8" cellspacing="0">
                <tr>
                    <td align="center">
                    <a href="${linkedin}" target="_blank" style="display:inline-block; background:#000; border-radius:50%; padding:10px; text-decoration:none;">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" width="20" height="20" style="display:block; filter:invert(1);" />
                    </a>
                    </td>
                    <td align="center">
                    <a href="${website}" target="_blank" style="display:inline-block; background:#000; border-radius:50%; padding:10px; text-decoration:none;">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/internetexplorer.svg" alt="Website" width="20" height="20" style="display:block; filter:invert(1);" />
                    </a>
                    </td>
                    <td align="center">
                    <a href="${x}" target="_blank" style="display:inline-block; background:#000; border-radius:50%; padding:10px; text-decoration:none;">
                        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" width="20" height="20" style="display:block; filter:invert(1);" />
                    </a>
                    </td>
                </tr>
              </table>
              <div class="footer">© ${new Date().getFullYear()} Gianluca Fornaciari. All rights reserved.</div>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  return { subject, text, html };
}