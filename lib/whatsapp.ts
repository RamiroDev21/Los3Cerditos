import { brand, WHATSAPP_NUMBER } from "./content";
import { findItem, formatPrice, fullName } from "./menu";

export type CartLine = { id: string; qty: number };

export function whatsappUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Resolved lines with names and subtotals; unknown ids (a product removed from the carta) are dropped. */
export function resolveLines(lines: CartLine[]) {
  return lines.flatMap((line) => {
    const found = findItem(line.id);
    if (!found) return [];
    return [{ ...line, item: found.item, category: found.category, subtotal: found.item.price * line.qty }];
  });
}

export function orderMessage(lines: CartLine[], note = "") {
  const resolved = resolveLines(lines);
  const total = resolved.reduce((sum, l) => sum + l.subtotal, 0);
  const rows = resolved.map((l) => `• ${l.qty} × ${fullName(l.item)} — ${formatPrice(l.subtotal)}`);
  return [
    `¡Hola, ${brand.name}! Quiero hacer este pedido:`,
    "",
    ...rows,
    "",
    `Total: ${formatPrice(total)}`,
    ...(note.trim() ? ["", `Nota: ${note.trim()}`] : []),
    "",
    "Mi nombre:",
    "Dirección de entrega:",
  ].join("\n");
}

export function askMessage(itemId: string) {
  const found = findItem(itemId);
  if (!found) return `¡Hola, ${brand.name}! Tengo una pregunta.`;
  return `¡Hola, ${brand.name}! Quiero preguntar por: ${fullName(found.item)} (${formatPrice(found.item.price)}).`;
}

export const greetingMessage = `¡Hola, ${brand.name}! Quiero hacer un pedido.`;
