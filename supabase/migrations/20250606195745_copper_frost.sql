/*
  # Initial Schema Setup for Nutri Cloud

  1. New Tables
    - `clients` - Client management with complete address and contact information
    - `ingredients` - Nutritional composition database with TACO table support
    - `recipes` - Recipe management with ingredients and preparation steps
    - `recipe_ingredients` - Junction table for recipe-ingredient relationships
    - `preparation_steps` - Recipe preparation steps
    - `conversations` - Client communication tracking
    - `messages` - Individual messages in conversations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Ensure data isolation and security

  3. Features
    - Full nutritional data tracking
    - Recipe management with ingredients and steps
    - Client relationship management
    - Communication history
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cnpj text,
  email text NOT NULL,
  fone_1 text NOT NULL,
  fone_2 text,
  endereco_logradouro text,
  endereco_complemento text,
  endereco_numero text,
  endereco_bairro text,
  endereco_cidade text,
  endereco_uf text,
  endereco_pais text,
  responsavel_legal_nome text,
  responsavel_legal_email text,
  responsavel_legal_fone text,
  responsavel_legal_cpf text,
  responsavel_tecnico_nome text,
  responsavel_tecnico_email text,
  responsavel_tecnico_fone text,
  responsavel_tecnico_cpf text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  observacoes text,
  logotipo_imagem text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela_nutricional text NOT NULL,
  numero_alimento text NOT NULL,
  descricao_alimento text NOT NULL,
  categoria text NOT NULL,
  porcentagem_umidade decimal(10,2) DEFAULT 0,
  energia_kcal decimal(10,2) DEFAULT 0,
  energia_kj decimal(10,2) DEFAULT 0,
  proteina_g decimal(10,2) DEFAULT 0,
  lipideos_g decimal(10,2) DEFAULT 0,
  colesterol_mg decimal(10,2) DEFAULT 0,
  carboidrato_g decimal(10,2) DEFAULT 0,
  fibra_alimentar_g decimal(10,2) DEFAULT 0,
  cinzas_g decimal(10,2) DEFAULT 0,
  calcio_mg decimal(10,2) DEFAULT 0,
  magnesio_mg decimal(10,2) DEFAULT 0,
  manganes_mg decimal(10,2) DEFAULT 0,
  fosforo_mg decimal(10,2) DEFAULT 0,
  ferro_mg decimal(10,2) DEFAULT 0,
  sodio_mg decimal(10,2) DEFAULT 0,
  potassio_mg decimal(10,2) DEFAULT 0,
  cobre_mg decimal(10,2) DEFAULT 0,
  zinco_mg decimal(10,2) DEFAULT 0,
  retinol_mcg decimal(10,2) DEFAULT 0,
  re_mcg decimal(10,2) DEFAULT 0,
  rae_mcg decimal(10,2) DEFAULT 0,
  tiamina_mg decimal(10,2) DEFAULT 0,
  riboflavina_mg decimal(10,2) DEFAULT 0,
  piridoxina_mg decimal(10,2) DEFAULT 0,
  niacina_mg decimal(10,2) DEFAULT 0,
  vitamina_c_mg decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  measurement_unit text NOT NULL DEFAULT 'g' CHECK (measurement_unit IN ('g', 'ml')),
  cooking_index decimal(10,2) NOT NULL DEFAULT 0,
  internal_code text,
  prep_time integer,
  yield integer,
  difficulty text CHECK (difficulty IN ('Fácil', 'Médio', 'Difícil')),
  notes text,
  image text,
  tags text[] DEFAULT '{}',
  gross_weight decimal(10,2) DEFAULT 0,
  net_weight decimal(10,2) DEFAULT 0,
  correction_factor decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  unit text NOT NULL DEFAULT 'g' CHECK (unit IN ('g', 'ml')),
  correction_factor decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Create preparation_steps table
CREATE TABLE IF NOT EXISTS preparation_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  last_message_text text,
  last_message_timestamp timestamptz,
  unread boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('client', 'agent')),
  text text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE preparation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can read all clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for ingredients table
CREATE POLICY "Users can read all ingredients"
  ON ingredients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert ingredients"
  ON ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update ingredients"
  ON ingredients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete ingredients"
  ON ingredients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for recipes table
CREATE POLICY "Users can read all recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete recipes"
  ON recipes
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for recipe_ingredients table
CREATE POLICY "Users can read all recipe ingredients"
  ON recipe_ingredients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert recipe ingredients"
  ON recipe_ingredients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update recipe ingredients"
  ON recipe_ingredients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete recipe ingredients"
  ON recipe_ingredients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for preparation_steps table
CREATE POLICY "Users can read all preparation steps"
  ON preparation_steps
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert preparation steps"
  ON preparation_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update preparation steps"
  ON preparation_steps
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete preparation steps"
  ON preparation_steps
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for conversations table
CREATE POLICY "Users can read all conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete conversations"
  ON conversations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for messages table
CREATE POLICY "Users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_ingredients_categoria ON ingredients(categoria);
CREATE INDEX IF NOT EXISTS idx_ingredients_descricao ON ingredients(descricao_alimento);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_preparation_steps_recipe_id ON preparation_steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();