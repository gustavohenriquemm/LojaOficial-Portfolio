// ================================================
// INTEGRAÇÃO FRONTEND COM MERCADO PAGO
// ================================================

// Configuração do backend
const BACKEND_URL = 'http://localhost:3000';

// Variáveis globais
let mercadoPagoPublicKey = null;
let currentPreferenceId = null;

// ================================================
// INICIALIZAR MERCADO PAGO
// ================================================
async function initMercadoPago() {
  try {
    console.log('🔧 Iniciando SDK do Mercado Pago...');
    
    // Verificar se SDK está disponível
    if (typeof MercadoPago === 'undefined') {
      console.error('❌ SDK do Mercado Pago não está carregado!');
      console.log('Aguardando 2 segundos e tentando novamente...');
      
      // Esperar um pouco e tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (typeof MercadoPago === 'undefined') {
        throw new Error('SDK do Mercado Pago não carregou. Verifique sua conexão com a internet.');
      }
    }
    
    // Buscar Public Key do backend
    console.log('📡 Buscando Public Key do backend...');
    const response = await fetch(`${BACKEND_URL}/api/payment/public-key`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar Public Key: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.publicKey) {
      throw new Error('Public Key não retornada pelo backend');
    }
    
    mercadoPagoPublicKey = data.publicKey;
    console.log('✅ Public Key obtida:', mercadoPagoPublicKey.substring(0, 20) + '...');
    
    // Inicializar SDK do Mercado Pago
    const mp = new MercadoPago(mercadoPagoPublicKey, {
      locale: 'pt-BR'
    });
    
    console.log('✅ Mercado Pago inicializado com sucesso!');
    return mp;
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Mercado Pago:', error);
    console.error('Detalhes:', error.message);
    return null;
  }
}

// ================================================
// CRIAR PAGAMENTO E ABRIR CHECKOUT
// ================================================
async function createPaymentAndCheckout() {
  console.log('🚀 Iniciando processo de pagamento...');
  
  try {
    // Obter carrinho
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    console.log('🛒 Carrinho:', cart);
    
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Validar dados do cliente
    console.log('📋 Validando dados do cliente...');
    const customerData = getCustomerData();
    
    if (!customerData) {
      console.error('❌ Dados do cliente não encontrados');
      console.log('checkoutData global:', typeof window.checkoutData !== 'undefined' ? window.checkoutData : 'não definido');
      console.log('sessionStorage checkoutData:', sessionStorage.getItem('checkoutData'));
      alert('Por favor, preencha todos os dados antes de continuar. Volte aos passos anteriores e complete os formulários.');
      return;
    }
    
    console.log('✅ Dados do cliente validados:', customerData);

    // Mostrar loading
    showLoading('Preparando pagamento...');

    // Inicializar Mercado Pago SDK
    console.log('🔧 Inicializando SDK do Mercado Pago...');
    const mp = await initMercadoPago();
    
    if (!mp) {
      hideLoading();
      showDetailedError();
      return;
    }

    // Preparar items para o Mercado Pago
    const items = cart.map(item => ({
      title: item.name,
      description: item.name,
      unit_price: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));

    // Preparar dados do comprador
    const payer = {
      name: customerData.name,
      email: customerData.email,
      phone: {
        area_code: customerData.phone.substring(0, 2),
        number: customerData.phone.substring(2)
      }
    };

    // Preparar metadata
    const metadata = {
      orderId: `order_${Date.now()}`,
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      shippingAddress: customerData.address
    };

    // URLs de retorno
    const currentUrl = window.location.origin;
    const back_urls = {
      success: `${currentUrl}/checkout.html?status=success`,
      failure: `${currentUrl}/checkout.html?status=failure`,
      pending: `${currentUrl}/checkout.html?status=pending`
    };

    // Criar preferência no backend
    console.log('📤 Criando preferência no backend...');
    const response = await fetch(`${BACKEND_URL}/api/payment/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        payer,
        metadata,
        back_urls
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Erro ao criar pagamento');
    }

    // Salvar IDs para referência
    currentPreferenceId = data.preferenceId;
    sessionStorage.setItem('currentOrderId', data.orderId);
    sessionStorage.setItem('currentPreferenceId', data.preferenceId);

    console.log('✅ Preferência criada:', data.preferenceId);
    console.log('🎯 Abrindo Checkout Pro do Mercado Pago...');

    // Ocultar loading antes de abrir modal
    hideLoading();

    // ABRIR CHECKOUT PRO MODAL com callbacks
    const checkout = mp.checkout({
      preference: {
        id: data.preferenceId
      },
      autoOpen: true, // Abre automaticamente
      callbacks: {
        onReady: () => {
          console.log('🎯 Modal do Mercado Pago pronto');
        },
        onClose: () => {
          console.log('🚪 Modal fechado pelo usuário');
          // Verificar status do pagamento ao fechar modal
          checkPaymentStatusOnClose(data.orderId);
        },
        onError: (error) => {
          console.error('❌ Erro no Checkout Pro:', error);
          hideLoading();
          alert('Erro ao processar pagamento. Tente novamente.');
        }
      }
    });

    console.log('✅ Checkout Pro modal iniciado');
    
    // Iniciar verificação automática do status do pagamento
    startPaymentStatusCheck(data.orderId, data.preferenceId);

  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error);
    console.error('Stack:', error.stack);
    hideLoading();
    alert('Erro ao processar pagamento: ' + error.message);
  }
}

// ================================================
// OBTER DADOS DO CLIENTE DO FORMULÁRIO
// ================================================
function getCustomerData() {
  // 1. Tentar buscar do checkoutData global (definido no checkout-script.js)
  if (typeof window.checkoutData !== 'undefined' && window.checkoutData.customer && window.checkoutData.address) {
    // Validar se os dados essenciais existem
    if (window.checkoutData.customer.name && window.checkoutData.customer.phone) {
      const data = {
        name: window.checkoutData.customer.name,
        email: window.checkoutData.customer.email || 'cliente@email.com',
        phone: window.checkoutData.customer.phone.replace(/\D/g, ''),
        address: {
          street: window.checkoutData.address.street || '',
          number: window.checkoutData.address.number || '',
          neighborhood: window.checkoutData.address.neighborhood || '',
          city: window.checkoutData.address.city || '',
          complement: window.checkoutData.address.complement || ''
        }
      };
      console.log('✅ Dados obtidos do window.checkoutData');
      return data;
    }
  }
  
  // 2. Fallback: tentar buscar do sessionStorage
  const savedData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
  
  if (savedData.customer && savedData.customer.name && savedData.customer.phone) {
    const data = {
      name: savedData.customer.name,
      email: savedData.customer.email || 'cliente@email.com',
      phone: (savedData.customer.phone || '').replace(/\D/g, ''),
      address: savedData.address || {}
    };
    console.log('✅ Dados obtidos do sessionStorage');
    return data;
  }
  
  // Se não encontrou dados, retornar null
  console.error('❌ Dados do cliente não encontrados');
  return null;
}

// ================================================
// VERIFICAR STATUS DO PAGAMENTO
// ================================================
async function checkPaymentStatus(orderId) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/payment/order/${orderId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.order;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return null;
  }
}

// ================================================
// INICIAR VERIFICAÇÃO AUTOMÁTICA DE PAGAMENTO
// ================================================
let paymentCheckInterval = null;
let checkAttempts = 0;
const MAX_CHECK_ATTEMPTS = 120; // 10 minutos (120 * 5 segundos)

function startPaymentStatusCheck(orderId, preferenceId) {
  console.log('🔍 Iniciando verificação automática de pagamento...');
  console.log('📦 Order ID:', orderId);
  console.log('🔖 Preference ID:', preferenceId);
  
  // Limpar verificação anterior se existir
  if (paymentCheckInterval) {
    clearInterval(paymentCheckInterval);
  }
  
  checkAttempts = 0;
  
  // Verificar a cada 5 segundos
  paymentCheckInterval = setInterval(async () => {
    checkAttempts++;
    
    try {
      console.log(`🔄 Verificação ${checkAttempts}/${MAX_CHECK_ATTEMPTS}...`);
      
      // Buscar status do pagamento no backend pelo orderId
      const response = await fetch(`${BACKEND_URL}/api/payment/order/${orderId}`);
      const data = await response.json();
      
      if (data.success && data.order) {
        const order = data.order;
        console.log('📊 Status do pedido:', order.status || order.paymentStatus);
        
        // Verificar se tem informações de pagamento
        if (order.payment || order.paymentData) {
          const paymentInfo = order.payment || order.paymentData;
          const status = paymentInfo.status || order.paymentStatus || order.status;
          
          console.log('💳 Status do pagamento:', status);
          
          if (status === 'approved') {
            // PAGAMENTO APROVADO!
            console.log('✅ ✅ ✅ PAGAMENTO APROVADO! ✅ ✅ ✅');
            clearInterval(paymentCheckInterval);
            paymentCheckInterval = null;
            
            // Aguardar 1 segundo antes de fechar para garantir processamento
            setTimeout(() => {
              // Fechar modal do Mercado Pago
              closeAllMercadoPagoModals();
              
              // Mostrar mensagem de sucesso com detalhes
              showPaymentSuccessMessage(order);
              
              // Limpar carrinho
              localStorage.removeItem('cart');
              sessionStorage.removeItem('currentOrderId');
              sessionStorage.removeItem('currentPreferenceId');
              
              // Atualizar contador do carrinho
              if (typeof updateCartCount === 'function') {
                updateCartCount();
              }
            }, 1000);
            
            return;
            
          } else if (status === 'pending' || status === 'in_process') {
            // Continuar verificando
            console.log('⏳ Pagamento pendente, continuando verificação...');
            
          } else if (status === 'rejected' || status === 'cancelled') {
            // PAGAMENTO REJEITADO/CANCELADO
            console.log('❌ Pagamento rejeitado ou cancelado');
            clearInterval(paymentCheckInterval);
            paymentCheckInterval = null;
            
            // Fechar modal
            closeAllMercadoPagoModals();
            
            // Mostrar mensagem de rejeição
            showPaymentRejectedMessage(order);
            
            return;
          }
        }
      }
      
      // Parar após MAX_CHECK_ATTEMPTS tentativas
      if (checkAttempts >= MAX_CHECK_ATTEMPTS) {
        console.log('⏱️ Tempo limite de verificação atingido (10 minutos)');
        clearInterval(paymentCheckInterval);
      }
      
    } catch (error) {
      console.error('❌ Erro ao verificar pagamento:', error);
    }
  }, 5000); // Verificar a cada 5 segundos
  
  console.log('✅ Verificação automática iniciada (verificando a cada 5 segundos por até 10 minutos)');
}

// ================================================
// PROCESSAR RETORNO DO CHECKOUT
// ================================================
async function handleCheckoutReturn() {
  // Verificar parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const paymentId = urlParams.get('payment_id');
  const preferenceId = urlParams.get('preference_id');
  const orderId = sessionStorage.getItem('currentOrderId');

  if (!status) {
    return; // Não é uma página de retorno
  }

  // Mostrar status baseado no resultado
  if (status === 'success' || status === 'approved') {
    showSuccessMessage(orderId, paymentId);
    localStorage.removeItem('cart'); // Limpar carrinho
  } else if (status === 'pending') {
    showPendingMessage(orderId);
  } else if (status === 'failure' || status === 'rejected') {
    showErrorMessage('Pagamento não aprovado. Tente novamente.');
  }
}

// ================================================
// MOSTRAR MENSAGENS DE STATUS
// ================================================
function showSuccessMessage(orderId, paymentId) {
  const container = document.querySelector('.checkout-content') || document.body;
  
  container.innerHTML = `
    <div class="payment-result success">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <h2>✅ Pagamento Aprovado!</h2>
      <p>Seu pagamento foi processado com sucesso.</p>
      <div class="order-info">
        <p><strong>Pedido:</strong> #${orderId || 'N/A'}</p>
        <p><strong>Pagamento:</strong> #${paymentId || 'N/A'}</p>
      </div>
      <div class="actions">
        <a href="index.html" class="btn btn-primary">Voltar para Início</a>
        <a href="produtos.html" class="btn btn-secondary">Ver Mais Produtos</a>
      </div>
    </div>
  `;
}

function showPendingMessage(orderId) {
  const container = document.querySelector('.checkout-content') || document.body;
  
  container.innerHTML = `
    <div class="payment-result pending">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <h2>⏳ Pagamento Pendente</h2>
      <p>Seu pagamento está sendo processado.</p>
      <div class="order-info">
        <p><strong>Pedido:</strong> #${orderId || 'N/A'}</p>
        <p>Você receberá uma confirmação assim que o pagamento for aprovado.</p>
      </div>
      <div class="actions">
        <a href="index.html" class="btn btn-primary">Voltar para Início</a>
      </div>
    </div>
  `;
}

function showErrorMessage(message) {
  const container = document.querySelector('.checkout-content') || document.body;
  
  container.innerHTML = `
    <div class="payment-result error">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <h2>❌ Pagamento Não Aprovado</h2>
      <p>${message}</p>
      <div class="actions">
        <a href="checkout.html" class="btn btn-primary">Tentar Novamente</a>
        <a href="index.html" class="btn btn-secondary">Voltar para Início</a>
      </div>
    </div>
  `;
}

// ================================================
// VERIFICAR STATUS AO FECHAR MODAL
// ================================================
async function checkPaymentStatusOnClose(orderId) {
  console.log('🔍 Modal foi fechado - Verificando status do pagamento...');
  
  // Aguardar 2 segundos para dar tempo do webhook processar
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/payment/order/${orderId}`);
    const data = await response.json();
    
    if (data.success && data.order) {
      const order = data.order;
      const paymentInfo = order.payment || order.paymentData;
      const status = paymentInfo?.status || order.paymentStatus || order.status;
      
      console.log('📊 Status ao fechar modal:', status);
      
      if (status === 'approved') {
        // Pagamento foi aprovado - fechar tudo e mostrar sucesso
        console.log('🎉 Pagamento APROVADO detectado!');
        closeAllMercadoPagoModals();
        showPaymentSuccessMessage(order);
        localStorage.removeItem('cart');
        sessionStorage.removeItem('currentOrderId');
        sessionStorage.removeItem('currentPreferenceId');
        if (typeof updateCartCount === 'function') {
          updateCartCount();
        }
      } else if (status === 'pending' || status === 'in_process') {
        // Pagamento pendente
        console.log('⏳ Pagamento PENDENTE detectado');
        closeAllMercadoPagoModals();
        showPaymentPendingMessage(order);
      } else if (status === 'rejected') {
        // Pagamento rejeitado
        console.log('❌ Pagamento REJEITADO detectado');
        closeAllMercadoPagoModals();
        showPaymentRejectedMessage(order);
      } else {
        // Status desconhecido ou usuário fechou sem pagar
        console.log('ℹ️ Usuário fechou modal sem concluir pagamento');
        closeAllMercadoPagoModals();
      }
    }
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    closeAllMercadoPagoModals();
  }
}

// ================================================
// FECHAR TODOS OS MODAIS DO MERCADO PAGO
// ================================================
function closeAllMercadoPagoModals() {
  console.log('🔒 Fechando TODOS os elementos do Mercado Pago...');
  
  // 1. Tentar fechar via SDK (se disponível)
  try {
    if (typeof window.MercadoPago !== 'undefined' && window.MercadoPago.checkout) {
      window.MercadoPago.checkout.close();
      console.log('✅ Modal fechado via SDK');
    }
  } catch (e) {
    console.log('⚠️ Não foi possível fechar via SDK:', e.message);
  }
  
  // 2. Remover todos os elementos do DOM
  // Container principal
  const containers = document.querySelectorAll('.mercadopago-checkout-container, .mercadopago-checkout-wrapper, .cho-container');
  containers.forEach(el => {
    el.style.display = 'none';
    el.remove();
    console.log('🗑️ Container removido');
  });
  
  // Todos os iframes do Mercado Pago
  const iframes = document.querySelectorAll('iframe[src*="mercadopago"], iframe[src*="mercadolibre"]');
  iframes.forEach(iframe => {
    iframe.style.display = 'none';
    iframe.remove();
    console.log('🗑️ Iframe removido');
  });
  
  // Overlays e backdrop
  const overlays = document.querySelectorAll('.mercadopago-checkout-overlay, .mercadopago-overlay, .cho-backdrop, [class*="mercadopago"]');
  overlays.forEach(overlay => {
    overlay.style.display = 'none';
    overlay.remove();
    console.log('🗑️ Overlay removido');
  });
  
  // Qualquer elemento com mercadopago no id ou class
  const mpElements = document.querySelectorAll('[class*="mercadopago"], [id*="mercadopago"], [class*="cho-"], [id*="cho-"]');
  mpElements.forEach(el => {
    if (el && el.parentNode) {
      el.style.display = 'none';
      el.remove();
    }
  });
  
  // 3. Restaurar body
  document.body.style.overflow = 'auto';
  document.body.style.position = 'relative';
  document.documentElement.style.overflow = 'auto';
  
  // 4. Remover estilos inline que o MP pode ter adicionado
  document.body.removeAttribute('style');
  
  console.log('✨ TODOS os elementos do Mercado Pago foram removidos!');
}

// ================================================
// MOSTRAR MENSAGEM DE SUCESSO
// ================================================
function showPaymentSuccessMessage(order) {
  const paymentInfo = order.payment || order.paymentData || {};
  const orderId = order.metadata?.orderId || order.id;
  const paymentId = paymentInfo.id || order.paymentId || 'N/A';
  const amount = paymentInfo.transactionAmount || order.totalAmount || 0;
  
  const successHtml = `
    <div class="payment-result-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="payment-result success" style="background: white; padding: 40px; border-radius: 16px; max-width: 500px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style="color: #4caf50; margin-bottom: 10px; font-size: 28px;">✅ Pagamento Aprovado!</h2>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Seu pagamento foi processado com sucesso.</p>
        
        <div class="order-info" style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
          <p style="margin: 8px 0;"><strong>📦 Pedido:</strong> #${orderId}</p>
          <p style="margin: 8px 0;"><strong>💳 Pagamento:</strong> #${paymentId}</p>
          <p style="margin: 8px 0;"><strong>💰 Valor:</strong> R$ ${amount.toFixed(2)}</p>
          <p style="margin: 8px 0;"><strong>✅ Status:</strong> <span style="color: #4caf50; font-weight: bold;">Aprovado</span></p>
        </div>
        
        <div class="actions">
          <a href="index.html" class="btn btn-primary" style="display: inline-block; background: #2196F3; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-right: 10px;">Voltar para Início</a>
          <a href="produtos.html" class="btn btn-secondary" style="display: inline-block; background: #757575; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none;">Ver Mais Produtos</a>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', successHtml);
}

// ================================================
// MOSTRAR MENSAGEM DE PAGAMENTO PENDENTE
// ================================================
function showPaymentPendingMessage(order) {
  const paymentInfo = order.payment || order.paymentData || {};
  const orderId = order.metadata?.orderId || order.id;
  const paymentId = paymentInfo.id || order.paymentId || 'N/A';
  const amount = paymentInfo.transactionAmount || order.totalAmount || 0;
  
  const pendingHtml = `
    <div class="payment-result-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="payment-result pending" style="background: white; padding: 40px; border-radius: 16px; max-width: 500px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #ff9800; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h2 style="color: #ff9800; margin-bottom: 10px; font-size: 28px;">⏳ Pagamento Pendente</h2>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px;">Seu pagamento está sendo processado.</p>
        
        <div class="order-info" style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
          <p style="margin: 8px 0;"><strong>📦 Pedido:</strong> #${orderId}</p>
          <p style="margin: 8px 0;"><strong>💳 Pagamento:</strong> #${paymentId}</p>
          <p style="margin: 8px 0;"><strong>💰 Valor:</strong> R$ ${amount.toFixed(2)}</p>
          <p style="margin: 8px 0;"><strong>⏳ Status:</strong> <span style="color: #ff9800; font-weight: bold;">Em Processamento</span></p>
        </div>
        
        <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
          ℹ️ Você receberá uma notificação quando o pagamento for confirmado.
        </p>
        
        <div class="actions">
          <a href="index.html" class="btn btn-primary" style="display: inline-block; background: #2196F3; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none;">Voltar para Início</a>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', pendingHtml);
}

// ================================================
// MOSTRAR MENSAGEM DE PAGAMENTO REJEITADO
// ================================================
function showPaymentRejectedMessage(order) {
  const paymentInfo = order.payment || order.paymentData || {};
  const orderId = order.metadata?.orderId || order.id;
  const statusDetail = paymentInfo.statusDetail || 'Pagamento não aprovado';
  
  const rejectedHtml = `
    <div class="payment-result-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="payment-result rejected" style="background: white; padding: 40px; border-radius: 16px; max-width: 500px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
        <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: #f44336; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2 style="color: #f44336; margin-bottom: 10px; font-size: 28px;">❌ Pagamento Não Aprovado</h2>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px;">${statusDetail}</p>
        
        <div class="order-info" style="background: #ffebee; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
          <p style="margin: 8px 0;"><strong>📦 Pedido:</strong> #${orderId}</p>
          <p style="margin: 8px 0;"><strong>❌ Status:</strong> <span style="color: #f44336; font-weight: bold;">Rejeitado</span></p>
        </div>
        
        <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
          💡 Tente novamente com outro método de pagamento ou entre em contato com seu banco.
        </p>
        
        <div class="actions">
          <a href="checkout.html" class="btn btn-primary" style="display: inline-block; background: #2196F3; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-right: 10px;">Tentar Novamente</a>
          <a href="index.html" class="btn btn-secondary" style="display: inline-block; background: #757575; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none;">Voltar</a>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', rejectedHtml);
}

// ================================================
// FUNÇÕES AUXILIARES
// ================================================
function showLoading(message = 'Carregando...') {
  const loading = document.createElement('div');
  loading.id = 'payment-loading';
  loading.className = 'payment-loading';
  loading.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(loading);
}

function hideLoading() {
  const loading = document.getElementById('payment-loading');
  if (loading) {
    loading.remove();
  }
}

function showDetailedError() {
  const errorHtml = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px; text-align: center;">
        <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
        <h2 style="color: #d32f2f; margin-bottom: 20px;">Erro ao Carregar Mercado Pago</h2>
        <p style="margin-bottom: 20px; color: #666;">O SDK do Mercado Pago não foi carregado corretamente.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
          <strong>Possíveis causas:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Problema de conexão com a internet</li>
            <li>Bloqueio de firewall ou antivírus</li>
            <li>Extensão de navegador bloqueando scripts</li>
            <li>Backend não está rodando (porta 3000)</li>
          </ul>
        </div>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
          <strong>✅ Soluções:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Verifique sua conexão com a internet</li>
            <li>Desative temporariamente extensões do navegador</li>
            <li>Certifique-se que o backend está rodando: <code style="background: #fff; padding: 2px 6px; border-radius: 4px;">http://localhost:3000</code></li>
            <li>Recarregue a página (F5)</li>
          </ul>
        </div>
        <button onclick="window.location.reload()" style="background: #2196F3; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 16px; margin-right: 10px;">
          🔄 Recarregar Página
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #757575; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 16px;">
          Fechar
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', errorHtml);
}

// ================================================
// EXPORTAR FUNÇÕES
// ================================================
window.createPaymentAndCheckout = createPaymentAndCheckout;
window.checkPaymentStatus = checkPaymentStatus;
window.handleCheckoutReturn = handleCheckoutReturn;
window.initMercadoPago = initMercadoPago;

// Verificar retorno do checkout ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  handleCheckoutReturn();
});
