import pg from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn(
    '[server] DATABASE_URL is not set. Start Postgres (see docker-compose.yml) and set DATABASE_URL, e.g. postgres://postgres:postgres@localhost:5432/dashboards',
  )
}

export const pool = new pg.Pool({
  connectionString: connectionString ?? 'postgres://postgres:postgres@localhost:5432/dashboards',
  max: 10,
})

export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dashboards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      widgets JSONB NOT NULL DEFAULT '[]'::jsonb,
      layouts JSONB NOT NULL DEFAULT '[]'::jsonb,
      global_filters JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

export type DashboardRow = {
  id: string
  name: string
  widgets: unknown
  layouts: unknown
  global_filters: unknown
  created_at: Date
  updated_at: Date
}
