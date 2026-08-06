import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface CertificateData {
  name: string;
  courseTitle: string;
  number: string;
  date: string;
  issuer?: string;
}

const PRIMARY = rgb(0.16, 0.4, 0.73);
const DARK = rgb(0.09, 0.1, 0.13);
const GRAY = rgb(0.45, 0.47, 0.52);

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WBT-${year}-${rand}`;
}

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: PRIMARY,
    borderWidth: 3,
  });
  page.drawRectangle({
    x: 38,
    y: 38,
    width: width - 76,
    height: height - 76,
    borderColor: PRIMARY,
    borderWidth: 1,
  });

  const issuer = data.issuer ?? "Wabtechs Academy";
  const center = (text: string, y: number, f = font, size = 14, color = DARK) => {
    const w = f.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font: f, color });
  };

  center("WABTECHS ACADEMY", height - 130, bold, 18, PRIMARY);
  center("CERTIFICAT DE RÉUSSITE", height - 190, bold, 34, DARK);
  center("Ce certificat est décerné à", height - 240, font, 14, GRAY);
  center(data.name, height - 300, bold, 30, PRIMARY);
  center("pour avoir complété avec succès le cours", height - 345, font, 14, GRAY);
  center(data.courseTitle, height - 395, bold, 24, DARK);

  center(`Délivré par ${issuer} le ${data.date}`, 100, font, 11, GRAY);
  center(`Numéro de certificat : ${data.number}`, 78, font, 10, GRAY);

  return doc.save();
}
