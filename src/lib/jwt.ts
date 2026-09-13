import jwt, { VerifyOptions } from "jsonwebtoken"

export const signToken = (token: string) => {
  return jwt.sign(
    { passcode: token },
    process.env.JWT_PASSCODE_SECRET!,
    {
      expiresIn: "30m",
      audience: ["passcode"]
    }
  )
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_PASSCODE_SECRET!, { audience: ["passcode"] } as VerifyOptions) as { passcode: string }
}