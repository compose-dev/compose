import { m } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";
import { Postgres } from "../postgres";

abstract class CustomerBillingService {
  server: FastifyInstance;
  company: m.Company.DB;
  pg: Postgres;

  _standardSeatsUsed: number;
  _externalSeatsUsed: number;

  constructor(
    server: FastifyInstance,
    company: m.Company.DB,
    pg: Postgres,
    standardSeatsUsed: number,
    externalSeatsUsed: number
  ) {
    this.server = server;
    this.company = company;
    this.pg = pg;
    this._standardSeatsUsed = standardSeatsUsed;
    this._externalSeatsUsed = externalSeatsUsed;
  }

  static async getExternalSeatsUsed(company: m.Company.DB, pg: Postgres) {
    const externalUsers = await db.externalAppUser.selectByCompanyId(
      pg,
      company.id
    );

    const externalSeatsUsed = externalUsers.filter(
      (permission) =>
        permission.email !==
          m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP &&
        permission.email.startsWith(
          m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
        ) === false
    ).length;

    return externalSeatsUsed;
  }

  static async getStandardSeatsUsed(company: m.Company.DB, pg: Postgres) {
    const count = await db.user.selectCountAllByCompanyId(pg, company.id);
    return count;
  }

  abstract syncBillingWithDB(): Promise<void>;

  abstract createUpgradeToProCheckoutSession(
    standardUsers: number,
    externalUsers: number,
    cancelUrl: string,
    successUrl: string
  ): Promise<{ url: string | null }>;

  abstract updateSubscriptionExternalSeatQuantity(
    newQuantity: number
  ): Promise<void>;

  abstract updateSubscriptionStandardSeatQuantity(
    newQuantity: number
  ): Promise<void>;

  get externalSeatsUsed() {
    return this._externalSeatsUsed;
  }

  get standardSeatsUsed() {
    return this._standardSeatsUsed;
  }

  abstract get externalSeatAllowance(): number;
  abstract get standardSeatAllowance(): number;

  abstract get hasFreeUnlimitedUsage(): boolean;
  abstract get hasProSubscription(): boolean;
  abstract get hasHobbySubscription(): boolean;

  get externalSeatsRemaining() {
    return this.externalSeatAllowance - this.externalSeatsUsed;
  }

  get standardSeatsRemaining() {
    return this.standardSeatAllowance - this.standardSeatsUsed;
  }
}

class CustomerBillingServiceStub extends CustomerBillingService {
  private constructor(
    server: FastifyInstance,
    company: m.Company.DB,
    pg: Postgres,
    standardSeatsUsed: number,
    externalSeatsUsed: number
  ) {
    super(server, company, pg, standardSeatsUsed, externalSeatsUsed);
  }

  static async create(
    server: FastifyInstance,
    company: m.Company.DB | null,
    pg: Postgres
  ) {
    if (!company) {
      throw new Error("Company not found");
    }

    const standardSeatsUsed =
      await CustomerBillingServiceStub.getStandardSeatsUsed(company, pg);
    const externalSeatsUsed =
      await CustomerBillingServiceStub.getExternalSeatsUsed(company, pg);

    return new CustomerBillingServiceStub(
      server,
      company,
      pg,
      standardSeatsUsed,
      externalSeatsUsed
    );
  }

  async createUpgradeToProCheckoutSession(
    standardUsers: number,
    externalUsers: number,
    cancelUrl: string,
    successUrl: string
  ) {
    if (!this.hasHobbySubscription) {
      throw new Error("Company is not on the hobby plan within Stripe!");
    }

    if (this.hasProSubscription) {
      throw new Error("Company is already on the pro plan within Stripe!");
    }

    if (standardUsers < 1) {
      throw new Error("Pro plan requires at least one standard user");
    }

    if (externalUsers < 0) {
      throw new Error("External seat quantity cannot be negative");
    }

    await db.company.updatePlan(this.pg, this.company.id, m.Company.PLANS.PRO);
    return { url: successUrl };
  }

  async syncBillingWithDB() {
    return;
  }

  async updateSubscriptionExternalSeatQuantity(newQuantity: number) {
    if (this.hasHobbySubscription) {
      if (newQuantity <= this.externalSeatAllowance) {
        return;
      }

      // Throw a more explict error if they were on the free discount.
      if (this.hasFreeUnlimitedUsage) {
        throw new Error(
          "Reached discount limit. Please upgrade to PRO plan to expand usage."
        );
      }

      throw new Error(
        "Cannot edit external seats for hobby subscriptions. Upgrade to pro to increase limits."
      );
    }

    return;
  }

  async updateSubscriptionStandardSeatQuantity(newQuantity: number) {
    if (this.hasHobbySubscription) {
      if (newQuantity <= this.standardSeatAllowance) {
        return;
      }

      // Throw a more exlicit error if they were on the free discount.
      if (this.hasFreeUnlimitedUsage) {
        throw new Error(
          "Reached discount limit. Please upgrade to PRO plan to expand usage."
        );
      }

      throw new Error(
        "Cannot edit standard seats for hobby subscription. Upgrade to PRO plan to expand usage."
      );
    }

    if (newQuantity < 1) {
      throw new Error("Standard seat quantity cannot be less than 1");
    }

    return;
  }

  get externalSeatAllowance() {
    if (this.hasProSubscription) {
      return 1000000000000;
    }

    if (this.hasFreeUnlimitedUsage) {
      return 1000000000000;
    }

    return this.server.billing.gateway.DEFAULT_EXTERNAL_SEAT_ALLOWANCE;
  }

  get standardSeatAllowance() {
    if (this.hasProSubscription) {
      return 1000000000000;
    }

    if (this.hasFreeUnlimitedUsage) {
      return 1000000000000;
    }

    return this.server.billing.gateway.DEFAULT_STANDARD_SEAT_ALLOWANCE;
  }

  get hasFreeUnlimitedUsage() {
    return this.company.flags.FRIENDS_AND_FAMILY_FREE === true;
  }

  get hasProSubscription() {
    return this.company.plan === m.Company.PLANS.PRO;
  }

  get hasHobbySubscription() {
    return this.company.plan === m.Company.PLANS.HOBBY;
  }
}

export { CustomerBillingService, CustomerBillingServiceStub };
