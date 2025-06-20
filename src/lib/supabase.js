import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const db = {
  // Clients
  clients: {
    async getAll() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async create(client) {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // Ingredients
  ingredients: {
    async getAll() {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('descricao_alimento', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(ingredient) {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([ingredient])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from('ingredients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id) {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // Recipes
  recipes: {
    async getAll() {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients(
            *,
            ingredients(id, descricao_alimento)
          ),
          preparation_steps(*)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async create(recipe) {
      const { ingredients, preparationSteps, ...recipeData } = recipe
      
      // Map camelCase to snake_case for database insertion
      const dbRecipeData = {
        name: recipeData.name,
        category: recipeData.category,
        measurement_unit: recipeData.measurementUnit || recipeData.measurement_unit || 'g',
        cooking_index: recipeData.cookingIndex || recipeData.cooking_index || 0,
        internal_code: recipeData.internalCode || recipeData.internal_code,
        prep_time: recipeData.prepTime || recipeData.prep_time,
        yield: recipeData.yield,
        difficulty: recipeData.difficulty,
        notes: recipeData.notes,
        image: recipeData.image,
        tags: recipeData.tags,
        gross_weight: recipeData.grossWeight || recipeData.gross_weight || 0,
        net_weight: recipeData.netWeight || recipeData.net_weight || 0,
        correction_factor: recipeData.correctionFactor || recipeData.correction_factor || 0
      }
      
      // Insert recipe
      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([dbRecipeData])
        .select()
        .single()
      
      if (recipeError) throw recipeError

      // Insert ingredients
      if (ingredients && ingredients.length > 0) {
        const ingredientsData = ingredients.map(ing => ({
          recipe_id: newRecipe.id,
          ingredient_id: ing.ingredient_id || null,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit,
          correction_factor: ing.correctionFactor ? parseFloat(ing.correctionFactor) : null
        }))

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsData)
        
        if (ingredientsError) throw ingredientsError
      }

      // Insert preparation steps
      if (preparationSteps && preparationSteps.length > 0) {
        const stepsData = preparationSteps.map(step => ({
          recipe_id: newRecipe.id,
          step_number: step.number,
          description: step.description
        }))

        const { error: stepsError } = await supabase
          .from('preparation_steps')
          .insert(stepsData)
        
        if (stepsError) throw stepsError
      }

      return newRecipe
    },

    async update(id, updates) {
      const { ingredients, preparationSteps, ...recipeData } = updates
      
      // Map camelCase to snake_case for database update
      const dbRecipeData = {
        name: recipeData.name,
        category: recipeData.category,
        measurement_unit: recipeData.measurementUnit || recipeData.measurement_unit,
        cooking_index: recipeData.cookingIndex || recipeData.cooking_index,
        internal_code: recipeData.internalCode || recipeData.internal_code,
        prep_time: recipeData.prepTime || recipeData.prep_time,
        yield: recipeData.yield,
        difficulty: recipeData.difficulty,
        notes: recipeData.notes,
        image: recipeData.image,
        tags: recipeData.tags,
        gross_weight: recipeData.grossWeight || recipeData.gross_weight,
        net_weight: recipeData.netWeight || recipeData.net_weight,
        correction_factor: recipeData.correctionFactor || recipeData.correction_factor
      }
      
      // Update recipe
      const { data: updatedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .update(dbRecipeData)
        .eq('id', id)
        .select()
        .single()
      
      if (recipeError) throw recipeError

      // Update ingredients
      if (ingredients) {
        // Delete existing ingredients
        await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', id)

        // Insert new ingredients
        if (ingredients.length > 0) {
          const ingredientsData = ingredients.map(ing => ({
            recipe_id: id,
            ingredient_id: ing.ingredient_id || null,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit,
            correction_factor: ing.correctionFactor ? parseFloat(ing.correctionFactor) : null
          }))

          const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsData)
          
          if (ingredientsError) throw ingredientsError
        }
      }

      // Update preparation steps
      if (preparationSteps) {
        // Delete existing steps
        await supabase
          .from('preparation_steps')
          .delete()
          .eq('recipe_id', id)

        // Insert new steps
        if (preparationSteps.length > 0) {
          const stepsData = preparationSteps.map(step => ({
            recipe_id: id,
            step_number: step.number,
            description: step.description
          }))

          const { error: stepsError } = await supabase
            .from('preparation_steps')
            .insert(stepsData)
          
          if (stepsError) throw stepsError
        }
      }

      return updatedRecipe
    },

    async delete(id) {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // Conversations
  conversations: {
    async getAll() {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          clients(*),
          messages(*)
        `)
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      return data
    },

    async create(conversation) {
      const { data, error } = await supabase
        .from('conversations')
        .insert([conversation])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async addMessage(conversationId, message) {
      // Insert message
      const { data: newMessage, error: messageError } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          type: message.type,
          text: message.text
        }])
        .select()
        .single()
      
      if (messageError) throw messageError

      // Update conversation last message
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message_text: message.text,
          last_message_timestamp: new Date().toISOString(),
          unread: message.type === 'client'
        })
        .eq('id', conversationId)
      
      if (updateError) throw updateError

      return newMessage
    }
  }
}