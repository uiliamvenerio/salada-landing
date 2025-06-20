/*
  # Remove ingredient_name column from recipe_ingredients table

  1. Changes
    - Remove ingredient_name column from recipe_ingredients table
    - This column is no longer needed since we now use ingredient_id to reference the ingredients table
*/

-- Remove ingredient_name column from recipe_ingredients table
ALTER TABLE recipe_ingredients DROP COLUMN IF EXISTS ingredient_name;