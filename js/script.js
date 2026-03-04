// ===================================
// SAMPLE PRODUCTS DATA
// ===================================

// Default products array
const defaultProducts = [
    // Cosmético Feminino - Perfumes
    {
        id: 1,
        name: "Perfume Floral Elegance Feminino",
        category: "Cosmético Feminino",
        subcategory: "Perfumes",
        price: 189.90,
        oldPrice: 249.90,
        description: "Fragrância sofisticada e duradoura para momentos especiais",
        image: null
    },
    {
        id: 2,
        name: "Perfume Floral Delicado",
        category: "Cosmético Feminino",
        subcategory: "Perfumes",
        price: 129.90,
        oldPrice: null,
        description: "Aroma suave e romântico para o dia a dia",
        image: null
    },
    // Cosmético Feminino - Cremes
    {
        id: 3,
        name: "Creme Hidratante Facial Premium",
        category: "Cosmético Feminino",
        subcategory: "Cremes",
        price: 89.90,
        oldPrice: 109.90,
        description: "Hidratação profunda e anti-idade para pele radiante",
        image: null
    },
    {
        id: 4,
        name: "Creme Corporal Nutritivo",
        category: "Cosmético Feminino",
        subcategory: "Cremes",
        price: 69.90,
        oldPrice: null,
        description: "Nutrição intensa com fragrância suave",
        image: null
    },
    // Cosmético Feminino - Sabonetes
    {
        id: 5,
        name: "Sabonete Líquido Floral",
        category: "Cosmético Feminino",
        subcategory: "Sabonetes",
        price: 39.90,
        oldPrice: 49.90,
        description: "Limpeza suave com essências florais",
        image: null
    },
    {
        id: 6,
        name: "Kit Sabonetes Artesanais",
        category: "Cosmético Feminino",
        subcategory: "Sabonetes",
        price: 59.90,
        oldPrice: null,
        description: "3 sabonetes artesanais com aromas exclusivos",
        image: null
    },
    // Cosmético Feminino - Body Splash
    {
        id: 7,
        name: "Body Splash Floral Fresh",
        category: "Cosmético Feminino",
        subcategory: "Body Splash",
        price: 49.90,
        oldPrice: 59.90,
        description: "Fragrância leve e refrescante para o dia a dia",
        image: null
    },
    {
        id: 8,
        name: "Body Splash Romance",
        category: "Cosmético Feminino",
        subcategory: "Body Splash",
        price: 54.90,
        oldPrice: null,
        description: "Aroma envolvente e duradouro",
        image: null
    },
    // Cosmético Feminino - Esfoliantes
    {
        id: 9,
        name: "Esfoliante Facial Revitalizante",
        category: "Cosmético Feminino",
        subcategory: "Esfoliantes",
        price: 79.90,
        oldPrice: null,
        description: "Renovação celular e pele mais luminosa",
        image: null
    },
    {
        id: 10,
        name: "Esfoliante Corporal Nutritivo",
        category: "Cosmético Feminino",
        subcategory: "Esfoliantes",
        price: 69.90,
        oldPrice: 89.90,
        description: "Remove impurezas e nutre a pele",
        image: null
    },
    // Cosmético Feminino - Outros Cuidados
    {
        id: 11,
        name: "Máscara Facial Hidratante",
        category: "Cosmético Feminino",
        subcategory: "Outros Cuidados",
        price: 45.90,
        oldPrice: null,
        description: "Hidratação intensiva em 15 minutos",
        image: null
    },
    {
        id: 12,
        name: "Sérum Anti-idade",
        category: "Cosmético Feminino",
        subcategory: "Outros Cuidados",
        price: 149.90,
        oldPrice: 199.90,
        description: "Tratamento intensivo contra sinais do tempo",
        image: null
    },
    // Cosmético Masculino - Perfumes
    {
        id: 13,
        name: "Perfume Amadeirado Masculino",
        category: "Cosmético Masculino",
        subcategory: "Perfumes",
        price: 179.90,
        oldPrice: 229.90,
        description: "Fragrância marcante e sofisticada",
        image: null
    },
    {
        id: 14,
        name: "Perfume Fresh Masculino",
        category: "Cosmético Masculino",
        subcategory: "Perfumes",
        price: 139.90,
        oldPrice: null,
        description: "Aroma fresco e envolvente para o dia a dia",
        image: null
    },
    // Cosmético Masculino - Cremes
    {
        id: 15,
        name: "Creme Facial Hidratante Masculino",
        category: "Cosmético Masculino",
        subcategory: "Cremes",
        price: 79.90,
        oldPrice: 99.90,
        description: "Hidratação sem deixar oleosidade",
        image: null
    },
    {
        id: 16,
        name: "Creme Pós-Barba Revitalizante",
        category: "Cosmético Masculino",
        subcategory: "Cremes",
        price: 59.90,
        oldPrice: null,
        description: "Acalma e hidrata após o barbear",
        image: null
    },
    // Cosmético Masculino - Sabonetes
    {
        id: 17,
        name: "Sabonete Líquido Masculino Fresh",
        category: "Cosmético Masculino",
        subcategory: "Sabonetes",
        price: 42.90,
        oldPrice: null,
        description: "Limpeza profunda com fragrância masculina",
        image: null
    },
    {
        id: 18,
        name: "Kit Sabonetes em Barra Masculino",
        category: "Cosmético Masculino",
        subcategory: "Sabonetes",
        price: 54.90,
        oldPrice: 69.90,
        description: "3 sabonetes com diferentes fragrâncias",
        image: null
    },
    // Cosmético Masculino - Body Splash
    {
        id: 19,
        name: "Body Splash Sport Masculino",
        category: "Cosmético Masculino",
        subcategory: "Body Splash",
        price: 52.90,
        oldPrice: null,
        description: "Fragrância energizante e refrescante",
        image: null
    },
    {
        id: 20,
        name: "Body Splash Classic Masculino",
        category: "Cosmético Masculino",
        subcategory: "Body Splash",
        price: 49.90,
        oldPrice: 59.90,
        description: "Aroma clássico e duradouro",
        image: null
    },
    // Cosmético Masculino - Esfoliantes
    {
        id: 21,
        name: "Esfoliante Facial Masculino",
        category: "Cosmético Masculino",
        subcategory: "Esfoliantes",
        price: 69.90,
        oldPrice: null,
        description: "Remove impurezas e prepara para o barbear",
        image: null
    },
    {
        id: 22,
        name: "Esfoliante Corporal Masculino",
        category: "Cosmético Masculino",
        subcategory: "Esfoliantes",
        price: 74.90,
        oldPrice: 89.90,
        description: "Limpeza profunda e revitalizante",
        image: null
    },
    // Cosmético Masculino - Outros Cuidados
    {
        id: 23,
        name: "Gel de Barbear Premium",
        category: "Cosmético Masculino",
        subcategory: "Outros Cuidados",
        price: 39.90,
        oldPrice: null,
        description: "Barbear suave e confortável",
        image: null
    },
    {
        id: 24,
        name: "Sérum Anti-idade Masculino",
        category: "Cosmético Masculino",
        subcategory: "Outros Cuidados",
        price: 139.90,
        oldPrice: 179.90,
        description: "Combate rugas e sinais de cansaço",
        image: null
    }
];

// API Base URL - Usa configuração do config.js se disponível
const API_URL = (() => {
  // Se config.js foi carregado, usar a configuração
  if (window.APP_CONFIG && window.APP_CONFIG.apiUrl) {
    return window.APP_CONFIG.apiUrl;
  }
  
  // Fallback: detectar ambiente automaticamente
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Em produção - SUBSTITUA pela URL real do seu backend no Render
    return 'https://SEU-BACKEND.onrender.com/api/products';
  }
  
  // Em desenvolvimento local
  return 'http://localhost:3000/api/products';
})();

console.log('🔗 API URL configurada:', API_URL);

// Expor no escopo global para outros scripts
window.API_URL = API_URL;

console.log('=== SCRIPT.JS INICIADO ===');
console.log('defaultProducts disponíveis:', defaultProducts.length);

// Load products from API or use default
let products = defaultProducts; // Inicializar com produtos padrão
window.products = products; // Expor globalmente

console.log('Products inicializados:', products.length);
console.log('window.products definido:', typeof window.products, window.products.length);

// Load products from API
async function loadProductsFromAPI() {
    console.log('Tentando carregar produtos da API...');
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            products = await response.json();
            window.products = products; // Atualizar globalmente
            console.log('✅ Produtos carregados da API:', products.length);
            // Não usar defaultProducts, sempre usar o que vem da API
        } else {
            console.error('Erro ao carregar produtos da API');
            // Só usar defaultProducts se houver erro real
            products = defaultProducts;
            window.products = products; // Atualizar globalmente
            console.log('⚠️ Usando defaultProducts:', products.length);
        }
    } catch (error) {
        console.error('Erro ao conectar com API:', error);
        // Só usar defaultProducts se não conseguir conectar
        products = defaultProducts;
        window.products = products; // Atualizar globalmente
        console.log('⚠️ Usando defaultProducts (erro de conexão):', products.length);
    }
    
    // Atualizar displays se as funções existirem
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    if (typeof loadFeaturedProducts === 'function') {
        loadFeaturedProducts();
    }
    
    // Atualizar displays de produtos
    displayFeaturedProducts();
    displayAllProducts();
}

// Carregar produtos ao iniciar
loadProductsFromAPI();

// Sincronizar a cada 5 segundos para manter atualizado
setInterval(loadProductsFromAPI, 5000);

// ===================================
// CART MANAGEMENT
// ===================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Helper function to get correct path for produto.html
function getProductPath(productId) {
    // Se estamos no index.html (raiz), usar caminho com frontend/pages/
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        return `frontend/pages/produto.html?id=${productId}`;
    }
    // Se estamos em uma página dentro de frontend/pages/, usar caminho relativo
    return `produto.html?id=${productId}`;
}

function addToCart(productId) {
    console.log('addToCart chamado com ID:', productId);
    console.log('Produtos disponíveis:', products);
    
    // Converter para string para compatibilidade
    const productIdStr = String(productId);
    const product = products.find(p => String(p.id) === productIdStr);
    
    if (!product) {
        console.error('Produto não encontrado:', productId);
        showNotification('Erro: Produto não encontrado!');
        return;
    }

    console.log('Produto encontrado:', product);

    const existingItem = cart.find(item => String(item.id) === productIdStr);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Quantidade atualizada:', existingItem);
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        console.log('Produto adicionado ao carrinho');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showNotification('Produto adicionado ao carrinho!');
    console.log('Carrinho atualizado:', cart);
}

function removeFromCart(productId) {
    const productIdStr = String(productId);
    cart = cart.filter(item => String(item.id) !== productIdStr);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateQuantity(productId, change) {
    const productIdStr = String(productId);
    const item = cart.find(item => String(item.id) === productIdStr);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartModal();
        updateCartCount();
    }
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image 
                    ? `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5" style="display: none;">
                           <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                           <circle cx="12" cy="12" r="3"></circle>
                       </svg>`
                    : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                           <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                           <circle cx="12" cy="12" r="3"></circle>
                       </svg>`
                }
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');

    cartTotal.textContent = formatPrice(calculateTotal());
}

// ===================================
// DISPLAY PRODUCTS
// ===================================

function displayFeaturedProducts() {
    const productsContainer = document.getElementById('featuredProducts');
    if (!productsContainer) return;

    // Filtrar produtos em destaque primeiro, se não houver nenhum, mostrar os 6 primeiros
    let featuredProducts = products.filter(p => p.featured === true);
    if (featuredProducts.length === 0) {
        featuredProducts = products.slice(0, 6);
    } else if (featuredProducts.length > 6) {
        featuredProducts = featuredProducts.slice(0, 6);
    }

    productsContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <a href="${getProductPath(product.id)}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                           <div class="product-placeholder" style="display: none;">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                        : `<div class="product-placeholder">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                    }
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            ${product.oldPrice ? `<div class="product-old-price">${formatPrice(product.oldPrice)}</div>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart('${product.id}'); return false;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

function displayAllProducts() {
    const productsContainer = document.getElementById('allProducts');
    if (!productsContainer) return;

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="${getProductPath(product.id)}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                           <div class="product-placeholder" style="display: none;">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                        : `<div class="product-placeholder">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                    }
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            ${product.oldPrice ? `<div class="product-old-price">${formatPrice(product.oldPrice)}</div>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart('${product.id}'); return false;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// ===================================
// NAVIGATION & UI INTERACTIONS
// ===================================

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.getElementById('closeCartModal');
    const finalizarCompraBtn = document.getElementById('finalizarCompraBtn');

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            updateCartModal();
        });
    }

    if (closeCartModal && cartModal) {
        closeCartModal.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }

    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // Botão Finalizar Compra
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            // Abrir modal de demonstração
            openDemoCheckoutModal();
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput) return;
    
    // Criar container de resultados se não existir
    let searchResults = document.querySelector('.search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchInput.closest('.search-box').appendChild(searchResults);
    }
    
    // Função para realizar a busca
    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        // Filtrar produtos
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term) ||
            (product.subcategory && product.subcategory.toLowerCase().includes(term))
        ).slice(0, 8); // Limitar a 8 resultados
        
        // Exibir resultados
        if (filteredProducts.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Nenhum produto encontrado</div>';
            searchResults.classList.add('active');
            return;
        }
        
        searchResults.innerHTML = filteredProducts.map(product => `
            <div class="search-result-item" onclick="window.location.href='${getProductPath(product.id)}'">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" class="search-result-image">`
                    : `<div class="search-result-image">
                           <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                               <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                               <circle cx="12" cy="12" r="3"></circle>
                           </svg>
                       </div>`
                }
                <div class="search-result-info">
                    <div class="search-result-name">${product.name}</div>
                    <div class="search-result-category">${product.category}</div>
                </div>
                <div class="search-result-price">${formatPrice(product.price)}</div>
            </div>
        `).join('');
        
        searchResults.classList.add('active');
    }
    
    // Evento de input com debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
    
    // Evento de clique no botão
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }
    
    // Evento Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            searchResults.classList.remove('active');
        }
    });
    
    // Manter aberto ao clicar dentro
    searchInput.addEventListener('click', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch(searchInput.value);
        }
    });
}

function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Adicionar animações ao CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// ACTIVE LINK MANAGEMENT
// ===================================

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// FILTER PRODUCTS BY CATEGORY
// ===================================

function filterProductsByCategory(category) {
    const productsContainer = document.getElementById('allProducts');
    if (!productsContainer) return;
    
    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <a href="produto.html?id=${product.id}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                           <div class="product-placeholder" style="display: none;">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                        : `<div class="product-placeholder">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                                   <line x1="3" y1="3" x2="7" y2="7"></line>
                               </svg>
                           </div>`
                    }
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${formatPrice(product.price)}</div>
                            ${product.oldPrice ? `<div class="product-old-price">${formatPrice(product.oldPrice)}</div>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart('${product.id}'); return false;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Adicionar
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    updateCartCount();
    setupMobileMenu();
    setupCartModal();
    setupSearch();
    setActiveLink();
    setupSmoothScroll();
    
    // Display products will be called after API loads in loadProductsFromAPI()
    
    // Setup event delegation for add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const btn = e.target.closest('.add-to-cart-btn');
            const onclick = btn.getAttribute('onclick');
            if (onclick) {
                // Extract product ID from onclick attribute
                const match = onclick.match(/addToCart\('([^']+)'\)/);
                if (match && match[1]) {
                    addToCart(match[1]);
                }
            }
            return false;
        }
    }, true); // Use capture phase
    
    console.log('Site carregado com sucesso!');
});

// Export functions for use in HTML onclick attributes
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.filterProductsByCategory = filterProductsByCategory;
window.getProductPath = getProductPath;
window.formatPrice = formatPrice;
window.openDemoCheckoutModal = openDemoCheckoutModal;
window.closeDemoCheckoutModal = closeDemoCheckoutModal;
window.enviarPedidoWhatsApp = enviarPedidoWhatsApp;

// ========== PORTFOLIO SPECIFIC FUNCTIONS ==========

// Open Demo Checkout Modal
function openDemoCheckoutModal() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        alert('Seu carrinho est� vazio! Adicione produtos antes de finalizar a compra.');
        return;
    }
    
    const demoModal = document.getElementById('demoCheckoutModal');
    if (demoModal) {
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Demo Checkout Modal
function closeDemoCheckoutModal() {
    const demoModal = document.getElementById('demoCheckoutModal');
    if (demoModal) {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Enviar pedido via WhatsApp
function enviarPedidoWhatsApp() {
    // Mensagem para contratar o serviço de desenvolvimento
    let mensagem = '👋 Olá!\n\n';
    mensagem += '🌟 Vi seu portfólio de e-commerce "Presentes Especiais" e fiquei muito interessado!\n\n';
    mensagem += '💼 Gostaria de saber mais informações sobre:\n';
    mensagem += '• Desenvolvimento de um e-commerce completo\n';
    mensagem += '• Valores e formas de pagamento\n';
    mensagem += '• Prazo de desenvolvimento\n';
    mensagem += '• Funcionalidades incluídas\n\n';
    mensagem += '📱 Podemos conversar sobre um projeto?';
    
    // Número do WhatsApp (formato internacional sem + e sem espaços)
    const numeroWhatsApp = '5511943593778';
    
    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');
    
    // Fechar modal
    closeDemoCheckoutModal();
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const demoModal = document.getElementById('demoCheckoutModal');
    if (e.target === demoModal) {
        closeDemoCheckoutModal();
    }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDemoCheckoutModal();
    }
});

// ========== UPDATE PRODUCT LINKS FOR PORTFOLIO ==========

// Override getProductPath function for portfolio structure
function getProductPath(productId) {
    // Para o portf�lio, sempre usar pages/produto.html
    if (window.location.pathname.includes('/pages/')) {
        // Se j� estamos em uma p�gina dentro de pages/, usar caminho relativo
        return `produto.html?id=${productId}`;
    }
    // Se estamos no index.html, usar caminho com pages/
    return `pages/produto.html?id=${productId}`;
}
