import { generateCompanyName } from "./companyName";
import { generatePersonName } from "./name";
import { generateEmail } from "./email";
import { generateFeatureFlags } from "./featureFlags";

function generateNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBoolean() {
  return Math.random() < 0.5;
}

const TIERS = ["Basic", "Premium", "Enterprise"] as const;

function generateTier() {
  return TIERS[Math.floor(Math.random() * TIERS.length)];
}

function generateDate(min: Date, max: Date) {
  return new Date(
    min.getTime() + Math.random() * (max.getTime() - min.getTime())
  );
}

export {
  generateCompanyName,
  generateNumber,
  generateBoolean,
  generateTier,
  generateDate,
  generatePersonName,
  generateEmail,
  generateFeatureFlags,
};
