CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "username" varchar(255),
  "email" varchar(255),
  "password" varchar(255),
  "balance" numeric not null default 0,
  "created_at" timestamp with time zone default current_timestamp,
  "updated_at" timestamp with time zone
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY,
  "name" varchar(255),
  "description" text,
  "price" numeric,
  "created_at" timestamp with time zone default current_timestamp,
  "updated_at" timestamp with time zone
);

CREATE TABLE "purchases" (
  "id" uuid PRIMARY KEY,
  "quantity" int,
  "total_price" numeric not null,
  "user_id" uuid,
  "product_id" uuid,
  "created_at" timestamp with time zone default current_timestamp,
  "updated_at" timestamp with time zone
);

ALTER TABLE "purchases" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "purchases" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE INDEX idx_users_email ON "users" ("email");

INSERT INTO products (id, name, description, price) VALUES
  ('6967cded-fcd7-468b-ace5-3d531421f5cf', 'Product 1', 'Description of product 1', 100),
  ('c86ff138-6023-446a-9529-f18af89b3a59', 'Product 2', 'Description of product 2', 200),
  ('fa3a99e5-eced-4e82-8336-0812a53a2a00', 'Product 3', 'Description of product 3', 300),
  ('87193fa9-83da-4af0-b115-736b7aa0e7a9', 'Product 4', 'Description of product 4', 400),
  ('344f97b8-b3cd-4670-af99-edb951784e71', 'Product 5', 'Description of product 5', 500);