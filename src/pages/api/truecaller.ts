/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  console.log(req.body, req.method);
  if (req.body.status === "flow_invoked") {
    await db.truecallerAuth.create({
      data: {
        requestId: req.body.requestId,
        status: req.body.status,
      },
    });
  }
  if (req.body.accessToken) {
    await db.truecallerAuth.update({
      where: {
        requestId: req.body.requestId,
      },
      data: {
        accessToken: req.body.accessToken,
        endpoint: req.body.endpoint,
      },
    });
  }
  res.status(200).json({ message: "Hello from Next.js!" });
}
