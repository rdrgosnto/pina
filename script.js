const steps = document.querySelectorAll('.step');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnSubmit = document.getElementById('btn-submit');
const progressBar = document.getElementById('progress');

const inputNome = document.getElementById('nome');
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');
const inputEndereco = document.getElementById('endereco');

let currentStep = 0;

// Remove acentos de uma string
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Formata o Nome: Primeira maiúscula, sem acento, mantendo preposições em minúsculo
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

// Atualiza a exibição dos passos no formulário
function updateStepUI() {
  steps.forEach((step, idx) => {
    step.classList.toggle('active', idx === currentStep);
    if (idx === currentStep) {
      const field = step.querySelector('input, textarea');
      if (field) field.focus();
    }
  });

  // Atualiza estado dos botões
  btnPrev.disabled = currentStep === 0;
  
  if (currentStep === steps.length - 1) {
    btnNext.style.display = 'none';
    btnSubmit.style.display = 'block';
  } else {
    btnNext.style.display = 'block';
    btnSubmit.style.display = 'none';
  }

  // Atualiza Barra de Progresso
  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

// Validação por campo
function validarPassoAtual() {
  let isValid = false;

  if (currentStep === 0) {
    const nomeLimpo = inputNome.value.trim();
    const partesNome = nomeLimpo.split(' ').filter(p => p.length > 0);
    isValid = partesNome.length >= 2;
    document.getElementById('err-nome').style.display = isValid ? 'none' : 'block';
  } 
  else if (currentStep === 1) {
    const apenasNumeros = inputCpf.value.replace(/\D/g, '');
    isValid = apenasNumeros.length === 11;
    document.getElementById('err-cpf').style.display = isValid ? 'none' : 'block';
  } 
  else if (currentStep === 2) {
    const apenasNumeros = inputTelefone.value.replace(/\D/g, '');
    isValid = apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
    document.getElementById('err-telefone').style.display = isValid ? 'none' : 'block';
  } 
  else if (currentStep === 3) {
    isValid = inputEndereco.value.trim().length >= 10;
    document.getElementById('err-endereco').style.display = isValid ? 'none' : 'block';
  }

  return isValid;
}

function proximoPasso() {
  if (validarPassoAtual()) {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStepUI();
    }
  }
}

function passoAnterior() {
  if (currentStep > 0) {
    currentStep--;
    updateStepUI();
  }
}

// Eventos de Formatação e Auto-Advance

// 1. Nome
inputNome.addEventListener('input', (e) => {
  e.target.value = formatarNome(e.target.value);
});

inputNome.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    proximoPasso();
  }
});

// 2. CPF (Apenas números + Máscara + Avanço Automático aos 11 dígitos)
inputCpf.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  
  // Aplica máscara visual
  let mascara = val;
  if (val.length > 9) mascara = val.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (val.length > 6) mascara = val.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (val.length > 3) mascara = val.replace(/(\d{3})(\d{1,3})/, '$1.$2');

  e.target.value = mascara;

  if (val.length === 11) {
    setTimeout(proximoPasso, 300);
  }
});

// 3. Telefone (Apenas números + Avanço Automático aos 11 dígitos)
inputTelefone.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);

  // Aplica máscara visual
  let mascara = val;
  if (val.length > 6) mascara = val.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  else if (val.length > 2) mascara = val.replace(/(\d{2})(\d{0,5})/, '($1) $2');

  e.target.value = mascara;

  if (val.length === 11) {
    setTimeout(proximoPasso, 300);
  }
});

// Navegação pelos botões
btnNext.addEventListener('click', proximoPasso);
btnPrev.addEventListener('click', passoAnterior);

// Envio do Formulário (Preparado para Power Automate / Webhook)
document.getElementById('student-form').addEventListener('submit', (e) => {
  e.preventDefault();

  if (validarPassoAtual()) {
    const dados = {
      nome: inputNome.value,
      cpf: inputCpf.value.replace(/\D/g, ''),
      telefone: inputTelefone.value.replace(/\D/g, ''),
      endereco: inputEndereco.value
    };

    console.log("Dados prontos para envio ao Power Automate:", dados);
    alert("Formulário validado com sucesso! Dados prontos para integração.");
  }
});

updateStepUI();
