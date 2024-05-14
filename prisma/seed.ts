import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
import fs from "fs";
import { pid } from "process";
const json = fs.readFileSync("prisma/data/data.json");
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const data: {
  "S No ": string;
  "Medicine name": string;
  "Salt Code": string;
  "Salt name": string;
  "Product ID": string;
  "Product ID to be shown as Alternative": string;
  "Note if same": string;
  "Image link": string;
  Brand: string;
  MRP: string;
  "Selling price": string;
  Discount: string;
  "MRP of cheapest ": string;
  "Savings ": string;
  Cheapest: string;
  "Buy now button URL": string;
  "Prescription required": string;
  "Top Selling": string;
  Category: string;
  "Sub Category": string;
  Packaging: string;
  Description: string;
  Storage: string;
  "Side Effects": string;
  Precautions: string;
  "Brand Code": string;
  Manufacturer: string;
  "Marketed by": string;
  "Conten 1": string;
  "Conten 2": string;
  "Conten 3": string;
  "Conten 4": string;
  "Conten 5": string;
  "Conten 6": string;
}[] = JSON.parse(json.toString());

void (async () => {
  await prisma.medicine.createMany({
    data: data.map((e) => ({
      sno: Number(e["S No "]),
      name: e["Medicine name"],
      productId: e["Product ID"],
      mrp: e.MRP,
      sp: e["Selling price"],
      discount: e.Discount,
      savings: "",
      cheapest: e.Cheapest === "Yes" ? true : false,
      prescriptionRequired: e["Prescription required"] === "Yes" ? true : false,
      topSelling: e["Top Selling"] === "Yes" ? true : false,
      packaging: e.Packaging,
      description: e.Description,
      storage: e.Storage,
      sideEffects: e["Side Effects"],
      precautions: e.Precautions,
      content1: e["Conten 1"],
      content2: e["Conten 2"],
      content3: e["Conten 3"],
      content4: e["Conten 4"],
      content5: e["Conten 5"],
      content6: e["Conten 6"],
    })),
  });
  for (const d of data) {
    const { "Product ID": pID, "Product ID to be shown as Alternative": aID } =
      d;

    const id = await prisma.medicine.findFirst({ where: { productId: pID } });
    const aid = await prisma.medicine.findFirst({ where: { productId: aID } });
    if (id?.id && aid?.id) {
      await prisma.suggestionMedicine.create({
        data: {
          medicineId: id.id,
          suggestionMedicineId: aid.id,
        },
      });
    }
  }
})();
