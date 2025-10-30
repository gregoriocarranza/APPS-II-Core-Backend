import { knex, Knex } from "knex";

class KnexManager {
  private static knexInstance: Knex<any, unknown[]> | null = null;

  /**
   * Open a new connection. Reuse the already existing one if there's any.
   */
  static async connect(
    config?: Knex.Config,
    connections?: number
  ): Promise<Knex<any, unknown[]>> {
    if (!KnexManager.knexInstance) {
      const isLocalhost =
        process.env.SQL_HOST === "localhost" ||
        process.env.SQL_HOST === "127.0.0.1";
      const defaultConfig = {
        client: "pg",
        connection: {
          host: process.env.SQL_HOST,
          user: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD,
          database: process.env.SQL_DB_NAME,
          charset: "utf8mb4",
          port: Number(process.env.SQL_PORT) || 5432,
          ssl: isLocalhost ? false : { rejectUnauthorized: false },
        },
        pool: {
          min: 1,
          max: connections || 15,
          idleTimeoutMillis: 20000,
          acquireTimeoutMillis: 30000,
        },
        migrations: {
          tableName: "knex_migrations",
        },
        options: {
          nestTables: true,
        },
      };
      KnexManager.knexInstance = knex(config || defaultConfig);
      try {
        await KnexManager.knexInstance.raw("SELECT 1");
        console.info(`Knex connection established`);
      } catch (error) {
        console.error(`Failed to establish Knex connection:`, error);
        KnexManager.knexInstance = null;
        throw error;
      }
    }

    return KnexManager.knexInstance;
  }

  /**
   * Devuelve la conexión activa.
   */
  static getConnection(): Knex<any, unknown[]> {
    if (!KnexManager.knexInstance) {
      throw new Error(
        "Knex connection has not been established. Call connect() first."
      );
    }
    return KnexManager.knexInstance;
  }

  /**
   * Cierra la conexión y destruye la instancia.
   */
  static async disconnect(): Promise<void> {
    if (KnexManager.knexInstance) {
      await KnexManager.knexInstance.destroy();
      KnexManager.knexInstance = null;
      console.info(`Knex connection closed`);
    }
  }
}

export default KnexManager;
