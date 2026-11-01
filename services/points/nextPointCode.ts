import { connectDB } from "@/lib/mongodb";
import Point from "@/models/Point";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Suggests the next "Point X" / "PT-X" label for the create form. */
export async function nextPointCode(
  ownerId: string
): Promise<{ name: string; code: string }> {
  await connectDB();

  const points = await Point.find({ owner_id: ownerId }).select("code");
  const used = new Set(points.map((point) => point.code.toUpperCase()));

  let index = 0;
  while (index < LETTERS.length && used.has(`PT-${LETTERS[index]}`)) {
    index += 1;
  }

  const letter = LETTERS[Math.min(index, LETTERS.length - 1)];
  return { name: `Point ${letter}`, code: `PT-${letter}` };
}
