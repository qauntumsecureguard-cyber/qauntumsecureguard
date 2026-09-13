import bcrypt from "bcrypt"

export const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(value, salt);
}

export const compareValue = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue).catch(() => false);
}