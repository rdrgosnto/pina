const steps = document.querySelectorAll('.step');
const nextButtons = document.querySelectorAll('.btn-next');
const progressBar = document.getElementById('progress');
let currentStep = 0;

function updateStep() {
  steps.forEach((step, index) => {
    if (index === currentStep) {
      step.classList.add('active');
      const input = step.querySelector('input, textarea');
      if (input) input.focus();
    } else {
      step.classList.remove('active');
    }
  });

  // Atualiza a barra de progresso
  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

nextButtons.forEach(button => {
  button.addEventListener('click', () => {
    const currentInput = steps[currentStep].querySelector('input, textarea');
    if (currentInput && !currentInput.checkValidity()) {
      currentInput.reportValidity();
      return;
    }
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStep();
    }
  });
});

// Permite avançar ao pressionar "Enter" nos inputs
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const btn = steps[currentStep].querySelector('.btn-next');
      if (btn) btn.click();
    }
  });
});
