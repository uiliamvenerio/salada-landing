import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  tabela_nutricional: {
    type: String,
    required: true,
    trim: true
  },
  numero_alimento: {
    type: String,
    required: true,
    trim: true
  },
  descricao_alimento: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  porcentagem_umidade: {
    type: Number,
    default: 0
  },
  energia_kcal: {
    type: Number,
    default: 0
  },
  energia_kj: {
    type: Number,
    default: 0
  },
  proteina_g: {
    type: Number,
    default: 0
  },
  lipideos_g: {
    type: Number,
    default: 0
  },
  colesterol_mg: {
    type: Number,
    default: 0
  },
  carboidrato_g: {
    type: Number,
    default: 0
  },
  fibra_alimentar_g: {
    type: Number,
    default: 0
  },
  cinzas_g: {
    type: Number,
    default: 0
  },
  calcio_mg: {
    type: Number,
    default: 0
  },
  magnesio_mg: {
    type: Number,
    default: 0
  },
  manganes_mg: {
    type: Number,
    default: 0
  },
  fosforo_mg: {
    type: Number,
    default: 0
  },
  ferro_mg: {
    type: Number,
    default: 0
  },
  sodio_mg: {
    type: Number,
    default: 0
  },
  potassio_mg: {
    type: Number,
    default: 0
  },
  cobre_mg: {
    type: Number,
    default: 0
  },
  zinco_mg: {
    type: Number,
    default: 0
  },
  retinol_mcg: {
    type: Number,
    default: 0
  },
  re_mcg: {
    type: Number,
    default: 0
  },
  rae_mcg: {
    type: Number,
    default: 0
  },
  tiamina_mg: {
    type: Number,
    default: 0
  },
  riboflavina_mg: {
    type: Number,
    default: 0
  },
  piridoxina_mg: {
    type: Number,
    default: 0
  },
  niacina_mg: {
    type: Number,
    default: 0
  },
  vitamina_c_mg: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;