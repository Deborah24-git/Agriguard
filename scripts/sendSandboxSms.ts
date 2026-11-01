import { isSmsConfigured, sendSms } from "@/lib/sms/africasTalking";

function getOption(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1]?.trim() || null;
}

async function main(): Promise<void> {
  const recipient = getOption("--to");
  const message = getOption("--message");
  const username = process.env.AT_USERNAME?.trim();
  const senderId = process.env.AT_SENDER_ID?.trim();

  if (process.argv.includes("--help")) {
    console.log(
      'Usage: npm run sms:simulator -- --to "+27821234567" --message "Test message"'
    );
    return;
  }

  if (username?.toLowerCase() !== "sandbox") {
    throw new Error(
      "Refusing to send: set AT_USERNAME=sandbox in .env.local to use this command."
    );
  }
  if (!isSmsConfigured()) {
    throw new Error("Set AT_USERNAME and AT_API_KEY in .env.local first.");
  }
  if (!recipient || !message) {
    throw new Error('Both --to "+countrycode..." and --message "..." are required.');
  }

  console.log(`Sending one sandbox SMS${senderId ? ` from ${senderId}` : ""} to ${recipient}...`);
  const result = await sendSms(recipient, message);

  if (result.status !== "sent") {
    throw new Error(result.error ?? "Africa's Talking did not accept the message.");
  }

  console.log("Africa's Talking sandbox accepted the SMS.");
  if (result.provider_id) console.log(`Provider message ID: ${result.provider_id}`);
  console.log("Sandbox acceptance does not mean a handset received a real SMS.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unable to send sandbox SMS.");
  process.exitCode = 1;
});
