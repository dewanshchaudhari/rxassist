import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
type RequestBody = {
  status?: string;
  requestId: string;
  accessToken?: string;
  endpoint?: string;
};
type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  console.log(req.body, req.method);
  const body = req.body as RequestBody;
  if (body.status === "flow_invoked") {
    await db.truecallerAuth.create({
      data: {
        requestId: body.requestId,
        status: body.status ?? "",
      },
    });
  }
  if (body.accessToken) {
    await db.truecallerAuth.update({
      where: {
        requestId: body.requestId,
      },
      data: {
        accessToken: body.accessToken,
        endpoint: body.endpoint,
      },
    });
  }
  res.status(200).json({ message: "Hello from Next.js!" });
}
