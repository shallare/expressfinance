import 'server-only';

import { randomUUID } from 'node:crypto';
import { uploadPolicy } from '@/lib/config/loans';

export type AllowedMime = (typeof uploadPolicy.acceptedMimeTypes)[number];

/**
 * Détecte le type réel d'un fichier à partir de sa signature binaire
 * (« magic bytes »). On ne fait JAMAIS confiance au `Content-Type` envoyé par
 * le navigateur ni à l'extension.
 */
export function sniffMimeType(bytes: Uint8Array): AllowedMime | null {
  if (bytes.length < 12) return null;
  // %PDF-
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d) {
    return 'application/pdf';
  }
  // JPEG : FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  // WEBP : "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
}

const extensionForMime: Record<AllowedMime, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface ValidatedFile {
  buffer: Buffer;
  mime: AllowedMime;
  size: number;
  originalName: string;
  /** Nom de stockage aléatoire : ne contient jamais le nom d'origine. */
  storageName: string;
}

export type FileValidationError =
  | 'empty'
  | 'too_large'
  | 'unsupported_type'
  | 'name_too_long';

export async function validateUploadedFile(
  file: File,
): Promise<{ ok: true; file: ValidatedFile } | { ok: false; error: FileValidationError }> {
  if (file.size === 0) return { ok: false, error: 'empty' };
  if (file.size > uploadPolicy.maxFileSizeBytes) return { ok: false, error: 'too_large' };
  if (file.name.length > 200) return { ok: false, error: 'name_too_long' };

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMimeType(new Uint8Array(buffer.subarray(0, 16)));
  if (!mime) return { ok: false, error: 'unsupported_type' };

  // Nom d'origine nettoyé (affichage admin uniquement).
  const originalName = file.name
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}._ -]/gu, '_')
    .slice(0, 120);

  return {
    ok: true,
    file: {
      buffer,
      mime,
      size: file.size,
      originalName,
      storageName: `${randomUUID()}.${extensionForMime[mime]}`,
    },
  };
}
