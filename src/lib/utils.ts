import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRequestID = () => {
  const minLength = 8;
  const maxLength = 64;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const requestIdLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let requestId = "";
  for (let i = 0; i < requestIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    requestId += characters.charAt(randomIndex);
  }

  return requestId;
};
import { randomBytes } from "crypto";

export const generateOTP = () => {
  // Generate a random buffer
  const buffer = randomBytes(3); // 3 bytes = 6 hex digits = 6*4 = 24 bits

  // Convert buffer to a hexadecimal string
  const hexString = buffer.toString("hex");

  // Convert hexadecimal string to a number
  const otpNumber = parseInt(hexString, 16);

  // Ensure the OTP is 6 digits long by taking modulo 1,000,000
  const otp = otpNumber % 1000000;

  // Pad OTP with leading zeros if necessary
  return otp.toString().padStart(6, "0");
};

export const states: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  Assam: "AS",
  Bihar: "BR",
  Chhattisgarh: "CG",
  Goa: "GA",
  Gujarat: "GJ",
  Haryana: "HR",
  "Himachal Pradesh": "HP",
  Jharkhand: "JH",
  Karnataka: "KA",
  Kerala: "KL",
  "Madhya Pradesh": "MP",
  Maharashtra: "MH",
  Manipur: "MN",
  Meghalaya: "ML",
  Mizoram: "MZ",
  Nagaland: "NL",
  Odisha: "OD",
  Punjab: "PB",
  Rajasthan: "RJ",
  Sikkim: "SK",
  "Tamil Nadu": "TN",
  Telangana: "TG",
  Tripura: "TR",
  "Uttar Pradesh": "UP",
  Uttarakhand: "UT",
  "West Bengal": "WB",
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
