// ===================================
// CHECKOUT DATA
// ===================================

let currentStep = 1;
let checkoutData = {
    customer: {
        name: '',
        phone: '',
        email: ''
    },
    address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        complement: '',
        cep: ''
    },
    deliveryType: 'entrega', // 'entrega' ou 'retirada'
    frete: 0
};

// ===================================
// DELIVERY TYPE TOGGLE
// ===================================
function toggleDeliveryFields() {
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const enderecoFields = document.getElementById('enderecoEntregaFields');
    const retiradaInfo = document.getElementById('retiradaInfo');
    
    checkoutData.deliveryType = deliveryType;
    
    if (deliveryType === 'entrega') {
        enderecoFields.style.display = 'block';
        retiradaInfo.classList.remove('show');
        // Não zera o frete aqui, ele será calculado pelo campo de CEP
    } else {
        enderecoFields.style.display = 'none';
        retiradaInfo.classList.add('show');
        checkoutData.frete = 0;
        updateCheckoutTotals();
    }
    
    // Salvar escolha no localStorage
    localStorage.setItem('deliveryType', deliveryType);
}

// ===================================
// CEP AND FREIGHT CALCULATION
// ===================================
function calcularFreteCheckout() {
    const cepInput = document.getElementById('addressCep');
    const freteBox = document.getElementById('freteCheckoutBox');
    
    if (!cepInput || !freteBox) return;
    
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        freteBox.innerHTML = '<div style="color: #f44336; font-size: 0.9rem;">⚠️ CEP inválido. Digite 8 dígitos.</div>';
        return;
    }
    
    freteBox.innerHTML = '<div style="color: #666; font-size: 0.9rem;">Calculando frete...</div>';
    
    // Simular cálculo de frete com a mesma lógica da página de produtos
    setTimeout(() => {
        const cepOrigem = '06833160'; // Embu-Guaçu/SP
        const peso = 0.6; // kg padrão
        const altura = 15; // cm
        const largura = 8; // cm
        const comprimento = 8; // cm
        
        // Peso cúbico
        const pesoCubico = (altura * largura * comprimento) / 6000;
        const pesoFinal = Math.max(peso, pesoCubico);
        
        // Cálculo de distância simulada
        function calcularDistanciaSimulada(cepOrigem, cepDestino) {
            const o = cepOrigem.replace(/\D/g, "").substring(0, 5);
            const d = cepDestino.replace(/\D/g, "").substring(0, 5);
            if (o === d) return 5;
            if (o.startsWith("068") && d.startsWith("068")) return 20;
            if (d.startsWith("0") || d.startsWith("1")) return 60;
            if (d.startsWith("2") || d.startsWith("3")) return 100;
            return 150;
        }
        
        const distancia = calcularDistanciaSimulada(cepOrigem, cep);
        
        // Cálculo dos valores de frete
        const basePAC = 18 + (pesoFinal * 6) + (distancia * 0.1);
        const baseSEDEX = 28 + (pesoFinal * 9) + (distancia * 0.2);
        
        const prazoPAC = 5 + Math.ceil(distancia / 40);
        const prazoSEDEX = 2 + Math.ceil(distancia / 80);
        
        // Armazenar valores
        checkoutData.freteOpcoes = {
            pac: basePAC,
            sedex: baseSEDEX
        };
        checkoutData.frete = basePAC; // PAC como padrão
        checkoutData.address.cep = cep;
        
        freteBox.innerHTML = `
            <div class="frete-opcoes-checkout">
                <div class="frete-opcao-checkout ativa" onclick="selecionarFreteCheckout('pac', ${basePAC})" data-tipo="pac">
                    <div class="frete-opcao-header">
                        <strong>📦 PAC</strong>
                        <span class="frete-preco">R$ ${basePAC.toFixed(2)}</span>
                    </div>
                    <div class="frete-opcao-prazo">Prazo: ${prazoPAC} dias úteis</div>
                    <div class="frete-opcao-badge">✓ Selecionado</div>
                </div>
                <div class="frete-opcao-checkout" onclick="selecionarFreteCheckout('sedex', ${baseSEDEX})" data-tipo="sedex">
                    <div class="frete-opcao-header">
                        <strong>⚡ SEDEX</strong>
                        <span class="frete-preco">R$ ${baseSEDEX.toFixed(2)}</span>
                    </div>
                    <div class="frete-opcao-prazo">Prazo: ${prazoSEDEX} dias úteis</div>
                    <div class="frete-opcao-badge" style="display: none;">✓ Selecionado</div>
                </div>
            </div>
        `;
        
        updateCheckoutTotals();
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    }, 500);
}

// Função para selecionar opção de frete no checkout
function selecionarFreteCheckout(tipo, valor) {
    checkoutData.frete = valor;
    checkoutData.freteOpcoes.selecionado = tipo;
    
    // Atualizar visual
    const opcoes = document.querySelectorAll('.frete-opcao-checkout');
    opcoes.forEach(opcao => {
        const badge = opcao.querySelector('.frete-opcao-badge');
        if (opcao.dataset.tipo === tipo) {
            opcao.classList.add('ativa');
            badge.style.display = 'block';
        } else {
            opcao.classList.remove('ativa');
            badge.style.display = 'none';
        }
    });
    
    updateCheckoutTotals();
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
}

// Tornar função global
window.selecionarFreteCheckout = selecionarFreteCheckout;

// Máscara de CEP
function aplicarMascaraCEP(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '-' + valor.substring(5, 8);
    }
    input.value = valor;
}

// ===================================
// STEP NAVIGATION
// ===================================
function goToStep(step) {
    // Adicionar loading visual
    const activeContent = document.querySelector('.checkout-step.active .checkout-content');
    if (activeContent) {
        activeContent.style.opacity = '0.6';
        activeContent.style.pointerEvents = 'none';
    }
    
    // Pequeno delay para feedback visual
    setTimeout(() => {
        // Hide all steps
        document.querySelectorAll('.checkout-step').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show target step
        document.getElementById(`step${step}`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.checkout-step-indicator').forEach(indicator => {
            const indicatorStep = parseInt(indicator.dataset.step);
            indicator.classList.remove('active', 'completed');
            
            if (indicatorStep === step) {
                indicator.classList.add('active');
            } else if (indicatorStep < step) {
                indicator.classList.add('completed');
            }
        });
        
        currentStep = step;
        
        // Load step content
        if (step === 4) {
            loadOrderSummary();
        }
        
        // Restaurar opacidade
        const newActiveContent = document.querySelector('.checkout-step.active .checkout-content');
        if (newActiveContent) {
            newActiveContent.style.opacity = '1';
            newActiveContent.style.pointerEvents = 'auto';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// ===================================
// LOAD CART ITEMS
// ===================================

function loadCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('checkoutCartItems');
    const sidebarItemsContainer = document.getElementById('sidebarItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos para continuar</p>
                <a href="produtos.html" class="btn btn-primary">Ver Produtos</a>
            </div>
        `;
        return;
    }
    
    // Main cart display
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-cart-item">
            ${item.image 
                ? `<img src="${item.image}" alt="${item.name}" class="checkout-item-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                   <div class="checkout-item-image-placeholder" style="display: none;">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                           <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                           <circle cx="12" cy="12" r="3"></circle>
                       </svg>
                   </div>`
                : `<div class="checkout-item-image-placeholder">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                           <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                           <circle cx="12" cy="12" r="3"></circle>
                       </svg>
                   </div>`
            }
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-category">${item.category}</div>
                <div class="checkout-item-quantity">
                    <span>Quantidade: ${item.quantity}</span>
                </div>
            </div>
            <div class="checkout-item-price">
                R$ ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="checkout-item-remove" onclick="removeItemFromCheckout(${item.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Sidebar items
    sidebarItemsContainer.innerHTML = cart.map(item => `
        <div class="sidebar-item">
            <div>
                <div class="sidebar-item-name">${item.name}</div>
                <div class="sidebar-item-quantity">${item.quantity}x R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="sidebar-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Update totals
    updateCheckoutTotals();
}

function removeItemFromCheckout(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in header
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    loadCheckoutCart();
}

function updateCheckoutTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const frete = checkoutData.frete || 0;
    const total = subtotal + frete;
    
    // Atualizar sidebar
    document.getElementById('sidebarSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('sidebarFrete').textContent = frete > 0 ? formatPrice(frete) : 'A calcular';
    document.getElementById('sidebarTotal').textContent = formatPrice(total);
}

// ===================================
// ORDER SUMMARY
// ===================================

function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const frete = checkoutData.frete || 0;
    
    // Personal data
    document.getElementById('summaryPersonal').innerHTML = `
        <div><strong>Nome:</strong> ${checkoutData.customer.name}</div>
        <div><strong>Telefone:</strong> ${checkoutData.customer.phone}</div>
        ${checkoutData.customer.email ? `<div><strong>E-mail:</strong> ${checkoutData.customer.email}</div>` : ''}
    `;
    
    // Address / Delivery Type
    if (checkoutData.deliveryType === 'entrega') {
        document.getElementById('summaryAddress').innerHTML = `
            <div><strong>🚚 Entrega</strong></div>
            <div>${checkoutData.address.street}, ${checkoutData.address.number}</div>
            <div>${checkoutData.address.neighborhood} - ${checkoutData.address.city}</div>
            ${checkoutData.address.cep ? `<div>CEP: ${checkoutData.address.cep}</div>` : ''}
            ${checkoutData.address.complement ? `<div>${checkoutData.address.complement}</div>` : ''}
        `;
    } else {
        document.getElementById('summaryAddress').innerHTML = `
            <div><strong>🏪 Retirada na Loja</strong></div>
            <div style="color: #2e7d32; margin-top: 8px;">Você retirará seu pedido presencialmente após a confirmação do pagamento.</div>
        `;
    }
    
    // Products
    document.getElementById('summaryProducts').innerHTML = cart.map(item => `
        <div class="summary-product-item">
            <div>
                <div class="summary-product-name">${item.name}</div>
                <div class="summary-product-quantity">${item.quantity}x R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="summary-product-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Total
    document.getElementById('summaryTotal').textContent = formatPrice(subtotal + frete);
}

// ===================================
// FINALIZE ORDER - WhatsApp Integration
// ===================================

function finalizeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const frete = checkoutData.frete || 0;
    const total = subtotal + frete;
    
    // Build WhatsApp message
    let message = `*🎁 NOVO PEDIDO - Presentes Especiais*\n\n`;
    message += `*👤 CLIENTE*\n`;
    message += `Nome: ${checkoutData.customer.name}\n`;
    message += `Telefone: ${checkoutData.customer.phone}\n`;
    if (checkoutData.customer.email) {
        message += `E-mail: ${checkoutData.customer.email}\n`;
    }
    
    // Tipo de entrega
    const tipoEntrega = checkoutData.deliveryType === 'entrega' ? '🚚 ENTREGA' : '🏪 RETIRADA NA LOJA';
    message += `\n*${tipoEntrega}*\n`;
    
    if (checkoutData.deliveryType === 'entrega') {
        message += `${checkoutData.address.street}, ${checkoutData.address.number}\n`;
        message += `${checkoutData.address.neighborhood} - ${checkoutData.address.city}\n`;
        if (checkoutData.address.cep) {
            message += `CEP: ${checkoutData.address.cep}\n`;
        }
        if (checkoutData.address.complement) {
            message += `Complemento: ${checkoutData.address.complement}\n`;
        }
    } else {
        message += `Cliente irá retirar o pedido na loja após confirmação.\n`;
    }
    
    message += `\n*🛍️ PRODUTOS*\n`;
    cart.forEach(item => {
        message += `\n• ${item.name}\n`;
        message += `  Quantidade: ${item.quantity}\n`;
        message += `  Preço unitário: R$ ${item.price.toFixed(2)}\n`;
        message += `  Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*💰 VALOR TOTAL: R$ ${total.toFixed(2)}*\n`;
    if (checkoutData.deliveryType === 'entrega' && frete > 0) {
        message += `Frete: R$ ${frete.toFixed(2)}\n`;
    } else if (checkoutData.deliveryType === 'retirada') {
        message += `Frete: Grátis (Retirada na loja)\n`;
    }
    message += `\n_Aguardo confirmação e informações sobre o pagamento. Obrigado! 😊_`;
    
    // Save order to localStorage
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: checkoutData.customer,
        address: checkoutData.address,
        items: cart,
        total: total
    };
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // WhatsApp number (replace with your actual number)
    const whatsappNumber = '5511987654321'; // Format: country code + area code + number
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success message and redirect
    setTimeout(() => {
        alert('Pedido enviado! Você será redirecionado para a página inicial.');
        window.location.href = 'index.html';
    }, 1000);
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutCart();
    
    // Restaurar escolha de tipo de entrega
    const savedDeliveryType = localStorage.getItem('deliveryType');
    if (savedDeliveryType) {
        const radioInput = document.getElementById(`deliveryType${savedDeliveryType.charAt(0).toUpperCase() + savedDeliveryType.slice(1)}`);
        if (radioInput) {
            radioInput.checked = true;
            toggleDeliveryFields();
        }
    }
    
    // Adicionar eventos ao campo de CEP
    const cepInput = document.getElementById('addressCep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            aplicarMascaraCEP(this);
        });
        
        cepInput.addEventListener('blur', function() {
            if (this.value.replace(/\D/g, '').length === 8) {
                calcularFreteCheckout();
            }
        });
    }
    
    // Load saved data if exists
    const savedData = sessionStorage.getItem('checkoutData');
    if (savedData) {
        checkoutData = JSON.parse(savedData);
        
        // Fill forms
        if (checkoutData.customer.name) {
            document.getElementById('customerName').value = checkoutData.customer.name;
            document.getElementById('customerPhone').value = checkoutData.customer.phone;
            document.getElementById('customerEmail').value = checkoutData.customer.email || '';
        }
        
        if (checkoutData.address.street) {
            document.getElementById('addressStreet').value = checkoutData.address.street;
            document.getElementById('addressNumber').value = checkoutData.address.number;
            document.getElementById('addressNeighborhood').value = checkoutData.address.neighborhood;
            document.getElementById('addressCity').value = checkoutData.address.city;
            document.getElementById('addressComplement').value = checkoutData.address.complement || '';
        }
    }
    
    // ===================================
    // FORM HANDLERS
    // ===================================
    
    // Personal Data Form
    const personalDataForm = document.getElementById('personalDataForm');
    if (personalDataForm) {
        personalDataForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('customerPhone').value.trim();
            
            if (!name || !phone) {
                alert('Por favor, preencha nome e telefone.');
                return;
            }
            
            checkoutData.customer = {
                name: name,
                phone: phone,
                email: document.getElementById('customerEmail').value.trim()
            };
            
            // Salvar no sessionStorage
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            console.log('✅ Dados pessoais salvos:', checkoutData.customer);
            
            // Avançar para próxima etapa
            goToStep(3);
        });
    }
    
    // Address Form
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Verificar tipo de entrega
            const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
            checkoutData.deliveryType = deliveryType;
            
            if (deliveryType === 'entrega') {
                // Validação completa para entrega
                const street = document.getElementById('addressStreet').value.trim();
                const number = document.getElementById('addressNumber').value.trim();
                const neighborhood = document.getElementById('addressNeighborhood').value.trim();
                const city = document.getElementById('addressCity').value.trim();
                const cep = document.getElementById('addressCep').value.trim();
                
                if (!street || !number || !neighborhood || !city || !cep) {
                    alert('Por favor, preencha todos os campos obrigatórios do endereço.');
                    return;
                }
                
                if (cep.replace(/\D/g, '').length !== 8) {
                    alert('Por favor, insira um CEP válido.');
                    return;
                }
                
                checkoutData.address = {
                    street: street,
                    number: number,
                    neighborhood: neighborhood,
                    city: city,
                    complement: document.getElementById('addressComplement').value.trim(),
                    cep: cep
                };
            } else {
                // Para retirada, não precisa de endereço completo
                checkoutData.address = {
                    street: 'Retirada na loja',
                    number: '-',
                    neighborhood: '-',
                    city: '-',
                    complement: '',
                    cep: ''
                };
                checkoutData.frete = 0;
            }
            
            // Salvar no sessionStorage
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            
            // Avançar para próxima etapa
            goToStep(4);
        });
    }
});

// Save checkout data to session storage
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
});

// Make functions and data global
window.goToStep = goToStep;
window.removeItemFromCheckout = removeItemFromCheckout;
window.finalizeOrder = finalizeOrder;
window.toggleDeliveryFields = toggleDeliveryFields;
window.checkoutData = checkoutData; // Exportar checkoutData globalmente
