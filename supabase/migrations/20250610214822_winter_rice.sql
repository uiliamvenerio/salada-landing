/*
  # Add foreign key relationship for recipe ingredients

  1. Changes
    - Add ingredient_id column to recipe_ingredients table
    - Create foreign key relationship with ingredients table
    - Keep ingredient_name as fallback for custom ingredients
    - Update indexes for better performance

  2. Security
    - Maintain existing RLS policies
    - No changes to authentication or permissions
*/

-- Add ingredient_id column to recipe_ingredients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipe_ingredients' AND column_name = 'ingredient_id'
  ) THEN
    ALTER TABLE recipe_ingredients ADD COLUMN ingredient_id uuid REFERENCES ingredients(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);