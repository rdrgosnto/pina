// Ocultar Splash Screen após o carregamento
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
    }, 500);
  }, 1200); // Exibe a splash por 1.2s
});

// Elementos dos campos
const inputNome = document.getElementById('nome');
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');
const inputEmail = document.getElementById('email');
const selectCurso = document.getElementById('curso');
const form = document.getElementById('contact-form');

// Função para remover acentos
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// 1. Formatação do Nome (Title Case, sem acentos, regras para de/da/do/das/dos)
function formatarNome(valor) {
  const preposicoes = ['de', 'da', 'do', 'das', 'dos'];
  const textoLimpo = removerAcentos(valor).replace(/[^a-zA-Z\s]/g, '');
  
  const palavras = textoLimpo.toLowerCase().split(' ');
  const formatadas = palavras.map((palavra, index) => {
    if (palavra.length === 0) return '';
    if (index > 0 && preposicoes.includes(palavra)) {
      return palavra;
    }
    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
  });

  return formatadas.join(' ');
}

inputNome.addEventListener('input', (e) => {
  e.target.value = formatarNome(e.target.value);
});

// 2. Máscara e Formatação do CPF
inputCpf.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);

  let mascara = val;
  if (val.length > 9) mascara = val.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (val.length > 6) mascara = val.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (val.length > 3) mascara = val.replace(/(\d{3})(\d{1,3})/, '$1.$2');

  e.target.value = mascara;
});

// 3. Máscara e Formatação do Telefone
inputTelefone.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);

  let mascara = val;
  if (val.length > 10) mascara = val.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (val.length > 6) mascara = val.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
  else if (val.length > 2) mascara = val.replace(/(\d{2})(\d{0,5})/, '($1) $2');

  e.target.value = mascara;
});

// Validação dos Campos antes do Envio
function validarFormulario() {
  let valido = true;

  // Validação Nome
  const partesNome = inputNome.value.trim().split(' ').filter(p => p.length > 0);
  if (partesNome.length < 2) {
    document.getElementById('err-nome').style.display = 'block';
    valido = false;
  } else {
    document.getElementById('err-nome').style.display = 'none';
  }

  // Validação CPF (precisa ter 11 dígitos numéricos)
  const cpfNumeros = inputCpf.value.replace(/\D/g, '');
  if (cpfNumeros.length !== 11) {
    document.getElementById('err-cpf').style.display = 'block';
    valido = false;
  } else {
    document.getElementById('err-cpf').style.display = 'none';
  }

  // Validação Telefone (10 ou 11 dígitos com DDD)
  const telNumeros = inputTelefone.value.replace(/\D/g, '');
  if (telNumeros.length < 10 || telNumeros.length > 11) {
    document.getElementById('err-telefone').style.display = 'block';
    valido = false;
  } else {
    document.getElementById('err-telefone').style.display = 'none';
  }

  // Validação E-mail (Presença de @ e ponto)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inputEmail.value.trim())) {
    document.getElementById('err-email').style.display = 'block';
    valido = false;
  } else {
    document.getElementById('err-email').style.display = 'none';
  }

  // Validação Curso
  if (!selectCurso.value) {
    document.getElementById('err-curso').style.display = 'block';
    valido = false;
  } else {
    document.getElementById('err-curso').style.display = 'none';
  }

  return valido;
}

// Evento ao Enviar o Formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (validarFormulario()) {
    const payload = {
      nome: inputNome.value,
      cpf: inputCpf.value.replace(/\D/g, ''),
      telefone: inputTelefone.value.replace(/\D/g, ''),
      email: inputEmail.value.trim(),
      curso: selectCurso.value
    };

    console.log("Dados prontos para o Power Automate:", payload);
    alert("Informações enviadas com sucesso!");
  }
});
