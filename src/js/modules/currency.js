export default function currency(currencySelector, pricesSelector, basePriceData) {
  const currency = document.querySelector(currencySelector)
  const prices = document.querySelectorAll(pricesSelector)

  currency.addEventListener('click', event => {
    const currentCurrency = event.target.textContent

    let newCurrency = '$'
    let coefficient = 1

    switch (currentCurrency) {
      case '$':
        newCurrency = '€'
        coefficient = 0.9
        break
      case '€':
        newCurrency = '¥'
        coefficient = 6.9
        break
      case '¥':
        newCurrency = '£'
        coefficient = 0.8
        break
      case '£':
        newCurrency = '₴'
        coefficient = 40
        break
    }

    event.target.textContent = newCurrency

    prices.forEach(price => {
      price.textContent =
        +(price.getAttribute(basePriceData) * coefficient).toFixed(1) +
        ' ' +
        newCurrency
    })
  })
}
