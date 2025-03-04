// eslint-disable-next-line import/default
import PG from "pg";

class Postgres {
  private pool: PG.Pool | null = null;

  constructor(opts: PG.PoolConfig) {
    // eslint-disable-next-line import/no-named-as-default-member
    this.pool = new PG.Pool(opts);
  }

  async query<resultRow extends { [column: string]: any }>(
    str: string,
    params: any[] = []
  ) {
    if (this.pool === null) {
      throw new Error("Pool not initialized");
    }

    return this.pool.query<resultRow>(str, params);
  }

  async close() {
    if (this.pool === null) {
      throw new Error("Pool not initialized");
    }

    await this.pool.end();
  }
}

export { Postgres };
