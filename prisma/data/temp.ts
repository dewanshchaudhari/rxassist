import { PrismaClient } from "@prisma/client";
import csv from "csvtojson";
import fs from "fs";
const filePath = "./prisma/data/500.csv";
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
const convertListToSetArray = (obj: Record<string, string>[], key: string) => {
  return [
    ...new Set(
      obj
        .filter((e) => e[key])
        .filter((e) => e[key] !== "NA")
        .map((e) => e[key] ?? ""),
    ),
  ];
};
void (async () => {
  const file = (await csv().fromFile(filePath)) as Record<string, string>[];

  console.log(file.length);
  console.log(file[0]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const createdBrands = await prisma.brand.createMany({
    data: convertListToSetArray(file, "Brand").map((brand, i) => ({
      brand,
      code: i + 2,
    })),
  });
  console.log(createdBrands.count, " Brands Created");
  const createdCategories = await prisma.category.createMany({
    data: convertListToSetArray(file, "Category").map((category) => ({
      category,
    })),
  });
  console.log(createdCategories.count, " Categories Created");
  const createdSubCategories = await prisma.subcategory.createMany({
    data: convertListToSetArray(file, "Sub Category").map((subcategory) => ({
      subcategory,
    })),
  });
  console.log(createdSubCategories.count, " SubCategories Created");
  const createdManufacturer = await prisma.manufacturer.createMany({
    data: convertListToSetArray(file, "Manufacturer address").map(
      (manufacturer) => ({
        manufacturer,
      }),
    ),
  });
  console.log(createdManufacturer.count, " Manufacturer Created");
  const createdMarketedBy = await prisma.marketer.createMany({
    data: convertListToSetArray(file, "Marketed by").map((marketer) => ({
      marketer,
    })),
  });
  console.log(createdMarketedBy.count, " Marketing Created");
  const createdSalts = await prisma.salt.createMany({
    data: convertListToSetArray(file, "Salt name").map((salt, i) => ({
      salt,
      code: i + 1,
    })),
  });
  console.log(createdSalts.count, " Salts Created");
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const subcategories = await prisma.subcategory.findMany();
  const manufacturers = await prisma.manufacturer.findMany();
  const marketers = await prisma.marketer.findMany();
  const salts = await prisma.salt.findMany();
  const medicines: {
    sno: number;
    name: string;
    productId: string;
    mrp: string;
    sp: string;
    discount: string;
    savings: string;
    cheapest: boolean;
    prescriptionRequired: boolean;
    topSelling: boolean;
    imageLink: string;
    packaging: string;
    description: string;
    storage: string;
    sideEffects: string;
    precautions: string;
    content1: string;
    content2: string;
    content3: string;
    content4: string;
    content5: string;
    content6: string;
    brandId: string;
    saltId: string;
    categoryId: string;
    manufacturerId: string;
    subcategoryId: string;
    marketerId: string;
  }[] = [];
  for (let i = 0; i < file.length; i++) {
    console.log("medicine", i);
    const medicine = file[i];
    if (medicine) {
      const brandId =
        brands.find((brand) => brand.code === Number(medicine["Brand Code"]))
          ?.id ?? null;
      const saltId =
        salts.find((salt) => salt.code === Number(medicine["Salt Code"]))?.id ??
        null;
      const categoryId =
        categories.find(
          (category) => category.category.trim() === medicine.Category?.trim(),
        )?.id ?? null;
      const subcategoryId =
        subcategories.find(
          (subcategory) =>
            subcategory.subcategory.trim() === medicine["Sub Category"]?.trim(),
        )?.id ?? null;
      const manufacturerId =
        manufacturers.find(
          (manufacturer) =>
            manufacturer.manufacturer === medicine["Manufacturer address"],
        )?.id ?? null;
      const marketerId =
        marketers.find(
          (marketer) => marketer.marketer === medicine["Marketed by"],
        )?.id ?? null;
      medicines.push({
        sno: Number(medicine["S No"]),
        name: medicine["Medicine name"] ?? "",
        productId: medicine["Product ID"] ?? "",
        mrp: medicine.MRP ?? "",
        sp: medicine["Selling price"] ?? "",
        discount: medicine.Discount?.replaceAll("%", "") ?? "",
        savings: medicine.Savings?.replaceAll("%", "") ?? "",
        cheapest: medicine.Cheapest === "Yes" ? true : false,
        imageLink: medicine["Image link"] ?? "",
        prescriptionRequired:
          medicine["Prescription required"] === "Yes" ? true : false,
        topSelling: medicine["Top Selling"] === "Yes" ? true : false,
        packaging: medicine.Packaging ?? "",
        description: medicine.Description ?? "",
        storage: medicine.Storage ?? "",
        sideEffects: medicine["Side Effects"] ?? "",
        precautions: medicine.Precautions ?? "",
        content1: medicine.Intro ?? "",
        content2: medicine.Uses ?? "",
        content3: medicine.Directions ?? "",
        content4: medicine["Conten 4"] ?? "",
        content5: medicine["Conten 5"] ?? "",
        content6: medicine["Conten 6"] ?? "",
        brandId: brandId!,
        saltId: saltId!,
        categoryId: categoryId!,
        manufacturerId: manufacturerId!,
        subcategoryId: subcategoryId!,
        marketerId: marketerId!,
      });
    }
  }
  console.log(medicines.length);
  const insertedMedicines = await prisma.medicine.createMany({
    data: medicines,
  });
  console.log(insertedMedicines.count, " insertedMedicines added");
  const alternativeMedicine: {
    medicineId: string;
    alternateMedicineId: string;
  }[] = [];
  const createdMedicines = await prisma.medicine.findMany();
  for (let i = 0; i < file.length; i++) {
    console.log("alternativeMedicine", i);
    const medicine = file[i];
    console.log(i);
    if (
      medicine?.["Product ID"] !==
      medicine?.["Product ID to be shown as Alternative"]
    ) {
      const alternateMedicineId = createdMedicines.find(
        (med) =>
          med.productId.trim() ===
          medicine?.["Product ID to be shown as Alternative"]?.trim(),
      )?.id;
      const medicineId = createdMedicines.find(
        (med) => med.productId.trim() === medicine?.["Product ID"]?.trim(),
      )?.id;
      if (!alternateMedicineId || !medicineId) {
        console.log(medicine);
        continue;
      }
      alternativeMedicine.push({
        medicineId,
        alternateMedicineId,
      });
    }
  }
  const createdAlternativeMedicines =
    await prisma.alternativeMedicine.createMany({
      data: alternativeMedicine,
    });
  console.log(createdAlternativeMedicines.count);
  const deliveryFilePath = "prisma/data/delivery.csv";
  const deliveryFile = (await csv().fromFile(deliveryFilePath)) as {
    Pincode: string;
    "City Name": string;
    State: string;
    "Top City": string;
    "Delivery Fees": string;
    "Delivery Fees > 500 Rs": string;
    "Delivery Fees > 1000 Rs": string;
    "Order and packing fees": string;
    "Delivery Time": string;
    Servicable: string;
    Prescriptions: string;
    "Cart Orders": string;
    "Whatsapp Tap": string;
    COD: string;
    Online: string;
  }[];
  const delivery = await prisma.delivery.createMany({
    data: deliveryFile.map((delivery) => ({
      pincode: delivery.Pincode,
      prescriptionNumber: delivery.Prescriptions,
      city: delivery["City Name"],
      state: delivery.State,
    })),
  });
  console.log(delivery.count);
})();
