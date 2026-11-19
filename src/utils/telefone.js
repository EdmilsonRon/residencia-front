export function limparTelefone(valor) {
  return String(valor || '').replace(/\D/g, '');
}

export function formatarTelefone(valor) {
  const numeros = limparTelefone(valor).slice(0, 11);

  if (numeros.length === 0) return '';

  if (numeros.length <= 2) {
    return numeros;
  }

  const ddd = numeros.slice(0, 2);
  const restante = numeros.slice(2);

  if (numeros.length <= 6) {
    return `(${ddd}) ${restante}`;
  }

  if (numeros.length <= 10) {
    return `(${ddd}) ${restante.slice(0, 4)}-${restante.slice(4)}`;
  }

  return `(${ddd}) ${restante.slice(0, 5)}-${restante.slice(5)}`;
}

const DDD_VALIDOS = [
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
];

export function validarTelefone(valor) {
  const numeros = limparTelefone(valor);

  if (numeros.length !== 10 && numeros.length !== 11) {
    return false;
  }

  const ddd = numeros.slice(0, 2);
  const numero = numeros.slice(2);

  if (!DDD_VALIDOS.includes(ddd)) {
    return false;
  }

  if (numeros.length === 11) {
    return numero[0] === '9';
  }

  return /^[2-5]/.test(numero);
}
