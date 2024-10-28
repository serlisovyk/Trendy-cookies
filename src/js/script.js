import currency from './modules/currency.js'
import form from './modules/form.js'

window.addEventListener('DOMContentLoaded', () => {
  currency('.currency', '.products__price', 'data-base-price')

  form('form', 'input')
})
