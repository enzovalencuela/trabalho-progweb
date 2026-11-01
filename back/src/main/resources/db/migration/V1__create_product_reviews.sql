-- A tabela product_reviews é consultada pelo backend TypeScript, embora ausente do schema.ts original.
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nota NUMERIC(2,1) NOT NULL CHECK (nota >= 1 AND nota <= 5),
    titulo VARCHAR(255),
    comentario TEXT NOT NULL,
    img_url VARCHAR(1000),
    compra_verificada BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_created ON product_reviews(product_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_reviews_user_product ON product_reviews(user_id, product_id);
