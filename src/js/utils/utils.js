export function clearInputs(inputsSelector) {
  const inputs = document.querySelectorAll(inputsSelector)

  inputs.forEach(input => (input.value = ''))

  resetBorders(inputs)
}

export function resetBorders(inputs) {
  inputs.forEach(input => (input.style.border = ''))
}

export async function postData(url, data) {
  changeStatusMessage('pending')

  try {
    let res = await fetch(url, {
      method: 'POST',
      body: data,
    })

    if (!res.ok) throw new Error('Network response was not ok')

    return await res.text()
  } catch (error) {
    console.error('Error during post request:', error)
    throw error
  }
}

export function changeStatusMessage(state) {
  const status = document.querySelector('.status')

  if (!status) return

  switch (state) {
    case 'pending':
      status.innerHTML = 'Loading...'
      break
    case 'fullfield':
      status.innerHTML = 'Success! We will call you soon :)'
      break
    case 'rejected':
      status.innerHTML = 'Something went wrong :('
      break
    case 'clear':
      status.innerHTML = ''
      break
    default:
      status.innerHTML = state
      break
  }
}
