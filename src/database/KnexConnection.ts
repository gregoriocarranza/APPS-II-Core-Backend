import knex, { Knex } from "knex";
import fs from "fs";
import path from "path";

class KnexManager {
  private static knexInstance: Knex | null = null;

  static async connect(cfg?: Knex.Config, connections?: number): Promise<Knex> {
    if (this.knexInstance) return this.knexInstance;

    const url = process.env.DATABASE_URL;
    let connection: any;

    if (url) {
      const caPath = path.resolve(process.cwd(), "src/certs/us-east-2-bundle.pem");
      const ca = fs.readFileSync(caPath, "utf8");       // <- CA de RDS
      connection = { connectionString: url, ssl: { ca } }; // valida el cert del servidor
    } else {
      connection = {
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : 5432,
        database: process.env.SQL_DB_NAME,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        ssl:
          process.env.SQL_HOST === "localhost" || process.env.SQL_HOST === "127.0.0.1"
            ? false
            : { rejectUnauthorized: false }, // local no; remoto sí con TLS (sin validar CA)
      };
    }

    const finalConfig: Knex.Config = cfg || {
      client: "pg",
      connection,
      pool: {
        min: 1,
        max: connections || 15,
        idleTimeoutMillis: 20_000,
        acquireTimeoutMillis: 30_000,
      },
      migrations: { tableName: "knex_migrations" },
    };

    try {
      const cn: any = finalConfig.connection as any;
      const host = typeof cn === "string" ? new URL(cn).hostname : cn?.host ?? cn?.connection?.host;
      if (host) console.log("[Knex] host:", host);
    } catch {
      /* ignore */
    }

    this.knexInstance = knex(finalConfig);
    try {
      await this.knexInstance.raw("select 1");
      console.info("✅ Knex connection established");
    } catch (error) {
      console.error("❌ Failed to establish Knex connection:", error);
      this.knexInstance = null;
      throw error;
    }

    return this.knexInstance;
  }

  // Preferí usar get(), pero dejo el alias para compatibilidad con tu código viejo
  static get(): Knex {
    if (!this.knexInstance) {
      throw new Error("Knex connection has not been established. Call connect() first.");
    }
    return this.knexInstance;
  }

  static getConnection(): Knex { // <-- alias p/compatibilidad
    return this.get();
  }

  static async disconnect(): Promise<void> {
    if (this.knexInstance) {
      await this.knexInstance.destroy();
      this.knexInstance = null;
      console.info("Knex connection closed");
    }
  }
}

export default KnexManager;
