export const validateEmail = ( email ) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email) ? '': ' inserisci email corretta  '
}
export const validatePassword = ( password) => {
 if (!password) return ' Password obbligatoria '
 if ( password.length <8) return  'min 8 cararatteri'
return ''
}
export const validateRequired = ( value, fieldName ) => {
 if (!value || value.toString().trim() === '') return `${fieldName} è obbligatorio`   
  return ''
}

export const validateRating = (rating) => {
  const num = Number(rating)
  if (!rating) return 'Voto obbligatorio'
  if (num < 1 || num > 10) return 'Il voto deve essere tra 1 e 10'
  return '' 
}
