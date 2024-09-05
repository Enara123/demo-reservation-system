const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const SECRET_KEY = crypto
  .createHash("sha256")
  .update("my32charpassword123456789")
  .digest();
const iv = crypto.randomBytes(16);

export const encryptData = (data: string): string => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY),
    iv
  );
  let encrypted = cipher.update(data);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) {
    console.error("No encrypted data provided for decryption");
    return ""; // Return empty or handle as needed
  }

  const [iv, encryptedText] = encryptedData.split(":");
  if (!iv || !encryptedText) {
    console.error("Invalid encrypted data format");
    return ""; // Return empty or handle as needed
  }

  try {
    const ivBuffer = Buffer.from(iv, "hex");
    const encryptedBuffer = Buffer.from(encryptedText, "hex");

    if (ivBuffer.length !== 16) {
      throw new Error("Invalid IV length");
    }

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(SECRET_KEY, "hex"),
      ivBuffer
    );
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (error) {
    console.error("Decryption error:", error);
    return ""; // Return empty or handle as needed
  }
};
