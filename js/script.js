// ===================================
// SAMPLE PRODUCTS DATA
// ===================================

// Default products array
const defaultProducts = [
    // Cosmético Feminino - Perfumes
    {
        id: 1,
        name: "Cuide-se Bem Nuvem Body Splash",
        category: "Cosmético Feminino",
        subcategory: "Body Splash",
        price: 49.90,
        oldPrice: 59.90,
        description: "Fragrância suave e delicada como uma nuvem",
        image: "img/cuidesebem nuvem 2.jpg",
        featured: true
    },
    {
        id: 2,
        name: "Cuide-se Bem Pêssego Body Splash",
        category: "Cosmético Feminino",
        subcategory: "Body Splash",
        price: 49.90,
        oldPrice: null,
        description: "Aroma doce e refrescante de pêssego",
        image: "img/cuidesebem pesego.jpg"
    },
    {
        id: 3,
        name: "Liz Flora Desodorante Colônia",
        category: "Cosmético Feminino",
        subcategory: "Perfumes",
        price: 129.90,
        oldPrice: 149.90,
        description: "Aroma floral delicado e romântico",
        image: "img/lis1.jpg"
    },

    // Cosmético Masculino - Perfumes
    {
        id: 4,
        name: "Zaad Desodorante Colônia",
        category: "Cosmético Masculino",
        subcategory: "Perfumes",
        price: 139.90,
        oldPrice: 169.90,
        description: "Fragrância masculina sofisticada e marcante",
        image: "img/zaad1.jpg",
        featured: true
    },

    // Cosmético Feminino - Cremes
    {
        id: 8,
        name: "Creme Hidratante Corporal Nuvem",
        category: "Cosmético Feminino",
        subcategory: "Cremes",
        price: 39.90,
        oldPrice: 49.90,
        description: "Hidratação profunda com fragrância suave",
        image: "img/cuidesebem nuvem.jpg"
    },

    // Chocolates - Ovos de Páscoa
    {
        id: 5,
        name: "Ovo de Páscoa Harry Potter",
        category: "Chocolates",
        subcategory: "Ovos de Páscoa",
        price: 89.90,
        oldPrice: 109.90,
        description: "Delicioso ovo de páscoa temático Harry Potter",
        image: "img/HERRYPOTTEROVO.png",
        featured: true
    },
    {
        id: 6,
        name: "Ovo de Páscoa Scooby-Doo",
        category: "Chocolates",
        subcategory: "Ovos de Páscoa",
        price: 79.90,
        oldPrice: null,
        description: "Ovo de páscoa do querido Scooby-Doo",
        image: "img/scoobydoovo.webp",
        featured: true
    },
    {
        id: 7,
        name: "Ovo de Páscoa Luffy",
        category: "Chocolates",
        subcategory: "Ovos de Páscoa",
        price: 84.90,
        oldPrice: 99.90,
        description: "Ovo de Páscoa do Luffy de One Piece",
        image: "img/lUFFY.png"
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
    return 'https://lojaoficial-3.onrender.com/api/products'; // domínio correto do backend
  }
  
  // Em desenvolvimento local
  return 'http://localhost:3000/api/products';
})();

console.log('🔗 API URL configurada:', API_URL);

// Expor no escopo global para outros scripts
window.API_URL = API_URL;

// Load products from API or use default
let products = [...defaultProducts]; // Inicializa com produtos padrão

// Carregar produtos da API
async function loadProductsFromAPI() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            
            // A API retorna { products: [], pagination: {} } ou array direto (compatibilidade)
            if (data.products && Array.isArray(data.products)) {
                products = data.products;
            } else if (Array.isArray(data)) {
                products = data;
            } else {
                console.error('Formato de resposta inesperado:', data);
                products = [...defaultProducts]; // Fallback para produtos padrão
            }
            
            console.log('✅ Produtos carregados da API:', products.length);
            
            // Disparar evento customizado quando produtos são carregados
            window.dispatchEvent(new CustomEvent('productsLoaded', { detail: { products } }));
        } else {
            console.error('Erro ao carregar produtos da API, usando produtos padrão');
            products = [...defaultProducts]; // Fallback para produtos padrão
        }
    } catch (error) {
        console.error('Erro ao conectar com API, usando produtos padrão:', error);
        products = [...defaultProducts]; // Fallback para produtos padrão
    }
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    if (typeof loadFeaturedProducts === 'function') {
        loadFeaturedProducts();
    }
    displayFeaturedProducts();
    displayAllProducts();
}

// Carregar produtos ao iniciar (opcional - apenas se API estiver disponível)
// loadProductsFromAPI();
// Comentado para evitar requisições desnecessárias quando API não está disponível
// setInterval(loadProductsFromAPI, 5000);

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
    // Se estamos no index.html (raiz), usar caminho pages/produto.html
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        return `pages/produto.html?id=${productId}`;
    }
    // Se estamos em uma página dentro de pages/, usar caminho relativo
    return `produto.html?id=${productId}`;
}

// Helper function to get correct image path
function getImagePath(imagePath) {
    // Se já tem ../ no caminho, retornar como está
    if (imagePath.startsWith('../')) {
        return imagePath;
    }
    // Se estamos no index.html (raiz), usar caminho direto
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        return imagePath;
    }
    // Se estamos em uma página dentro de pages/, adicionar ../
    return `../${imagePath}`;
}

function addToCart(productId) {
    // Converter para string para compatibilidade
    const productIdStr = String(productId);
    const product = products.find(p => String(p.id) === productIdStr);
    
    if (!product) {
        showNotification('Erro: Produto não encontrado!');
        return;
    }

    const existingItem = cart.find(item => String(item.id) === productIdStr);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showNotification('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    const productIdStr = String(productId);
    const itemRemovido = cart.find(item => String(item.id) === productIdStr);
    
    cart = cart.filter(item => String(item.id) !== productIdStr);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Atualizar todas as visualizações
    updateCartCount();
    updateCartModal();
    
    // Mostrar notificação
    if (itemRemovido) {
        showNotification(`${itemRemovido.name} removido do carrinho`);
    }
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
    
    // Feedback visual imediato
    const itemElement = document.querySelector(`[data-product-id="${productIdStr}"]`);
    if (itemElement) {
        itemElement.style.transition = 'all 0.2s ease';
        itemElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            itemElement.style.transform = 'scale(1)';
        }, 200);
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
                    ? `<img src="${getImagePath(item.image)}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
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

    // Filtrar produtos em destaque primeiro, se não houver nenhum, mostrar os 5 primeiros
    let featuredProducts = products.filter(p => p.featured === true);
    if (featuredProducts.length === 0) {
        featuredProducts = products.slice(0, 5);
    } else if (featuredProducts.length > 5) {
        featuredProducts = featuredProducts.slice(0, 5);
    }

    productsContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <a href="${getProductPath(product.id)}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${getImagePath(product.image)}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
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
                        ? `<img src="${getImagePath(product.image)}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
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
            // Redirecionar para página de checkout
            window.location.href = 'checkout.html';
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
                    ? `<img src="${getImagePath(product.image)}" alt="${product.name}" class="search-result-image">`
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
                        ? `<img src="${getImagePath(product.image)}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
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
    
    // Display featured products on index page
    displayFeaturedProducts();
    
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
});

// Export functions for use in HTML onclick attributes
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.filterProductsByCategory = filterProductsByCategory;
window.getProductPath = getProductPath;
window.getImagePath = getImagePath;
window.formatPrice = formatPrice;
// ===================================
// HIERARCHICAL FILTER SYSTEM
// ===================================

// Define subcategories for each main category
const categorySubcategories = {
    'Cosmético Feminino': ['Perfumes', 'Cremes', 'Sabonetes', 'Body Splash', 'Esfoliantes', 'Outros Cuidados'],
    'Cosmético Masculino': ['Perfumes', 'Cremes', 'Sabonetes', 'Body Splash', 'Esfoliantes', 'Outros Cuidados'],
    'Chocolates': ['Chocolate ao Leite', 'Chocolate Meio Amargo', 'Chocolate Branco', 'Trufas', 'Bombons', 'Kits Presente', 'Outros Chocolates']
};

let currentMainCategory = 'todos';
let currentSubcategory = null;

// Filter by main category
function filterByMainCategory(category) {
    currentMainCategory = category;
    currentSubcategory = null;
    
    // Update active button
    document.querySelectorAll('.main-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide sub-filters
    const subFilters = document.getElementById('subFilters');
    const subFilterButtons = document.getElementById('subFilterButtons');
    
    if (category === 'todos') {
        subFilters.style.display = 'none';
        loadAllProducts();
    } else {
        // Show sub-filters
        subFilters.style.display = 'block';
        
        // Populate sub-filter buttons
        const subcategories = categorySubcategories[category] || [];
        subFilterButtons.innerHTML = `
            <button class="filter-btn active" onclick="filterBySubcategory(null)">Todos</button>
            ${subcategories.map(sub => `
                <button class="filter-btn" onclick="filterBySubcategory('${sub}')">${sub}</button>
            `).join('')}
        `;
        
        // Load products from this category
        loadProductsByMainCategory(category);
    }
}

// Filter by subcategory
function filterBySubcategory(subcategory) {
    currentSubcategory = subcategory;
    
    // Update active button
    document.querySelectorAll('.sub-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Filter products
    if (subcategory) {
        loadProductsBySubcategory(currentMainCategory, subcategory);
    } else {
        loadProductsByMainCategory(currentMainCategory);
    }
}

// Get all products
function getAllProducts() {
    // Se products estiver vazio, retorna defaultProducts
    return products.length > 0 ? products : defaultProducts;
}

// Load products by category (alias para compatibilidade)
function loadProductsByCategory(category) {
    loadProductsByMainCategory(category);
}

// Load products by main category
function loadProductsByMainCategory(category) {
    const products = getAllProducts().filter(p => p.category === category);
    displayFilteredProducts(products);
}

// Load products by subcategory
function loadProductsBySubcategory(mainCategory, subcategory) {
    const products = getAllProducts().filter(p => 
        p.category === mainCategory && p.subcategory === subcategory
    );
    displayFilteredProducts(products);
}

// Display filtered products
function displayFilteredProducts(products) {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum produto encontrado nesta categoria</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="${getProductPath('produto.html')}?id=${product.id}" class="product-card-link">
                ${product.image ? 
                    `<img src="${getImagePath(product.image)}" alt="${product.name}" class="product-img">` :
                    `<div class="product-img-placeholder">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>`
                }
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-pricing">
                            <span class="product-price">${formatPrice(product.price)}</span>
                            ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                        </div>
                    </div>
                </div>
            </a>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Adicionar ao Carrinho
            </button>
        </div>
    `).join('');
}

// Load all products (when "todos" is selected)
function loadAllProducts() {
    const products = getAllProducts();
    displayFilteredProducts(products);
}

// Export new functions
window.getAllProducts = getAllProducts;
window.loadProductsByCategory = loadProductsByCategory;
window.filterByMainCategory = filterByMainCategory;
window.filterBySubcategory = filterBySubcategory;
window.loadProductsByMainCategory = loadProductsByMainCategory;
window.loadAllProducts = loadAllProducts;
// ===================================
// DEMO CHECKOUT MODAL
// ===================================

function openDemoCheckoutModal() {
    const modal = document.getElementById('demoCheckoutModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDemoCheckoutModal() {
    const modal = document.getElementById('demoCheckoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function enviarPedidoWhatsApp() {
    const numeroWhatsApp = '5511943593778'; // N�mero com c�digo do pa�s e DDD
    const mensagem = encodeURIComponent(
        ' Ol�! Vi seu portf�lio de e-commerce e estou interessado(a) em saber mais sobre o desenvolvimento de uma loja online completa. Poderia me passar mais informa��es sobre os servi�os oferecidos?'
    );
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(urlWhatsApp, '_blank');
}

// Exportar fun��es globalmente
window.openDemoCheckoutModal = openDemoCheckoutModal;
window.closeDemoCheckoutModal = closeDemoCheckoutModal;
window.enviarPedidoWhatsApp = enviarPedidoWhatsApp;

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    const modal = document.getElementById('demoCheckoutModal');
    if (modal && e.target === modal) {
        closeDemoCheckoutModal();
    }
});
