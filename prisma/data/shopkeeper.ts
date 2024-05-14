import csv from "csvtojson";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
void (async () => {
  const rawShopkeepers = (await csv().fromFile(
    "prisma/data/shopkeeper.csv",
  )) as Record<string, string>[];
  console.log(rawShopkeepers);
  const shopkeepers = rawShopkeepers.map((shop) => ({
    shopName: shop.Name ?? "",
    code: shop["S no"] ?? "",
    phone: shop["Phone No."] ?? "",
    whatsapp: shop["Whatsapp link"] ?? "",
    website: shop.Website ?? "",
    maps: shop["Gmaps link"] ?? "",
    address: shop.Address ?? "",
    pincode: shop.Pincode ?? "",
    lat: "",
    lon: "",
  }));
  const insertedShopkeepers = await prisma.shopkeeper.createMany({
    data: shopkeepers,
  });
  console.log(insertedShopkeepers.count);
})();
