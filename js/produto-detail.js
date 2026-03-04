// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Debug logs
console.log('=== PRODUTO-DETAIL.JS INICIADO ===');
console.log('Product ID da URL:', productId);
console.log('Typeof window.products:', typeof window.products);
console.log('Products disponíveis:', window.products);

// Products will be loaded from script.js
let currentProduct = null;
let waitCount = 0;
const MAX_WAIT = 50; // 5 segundos máximo (50 * 100ms)

// Wait for products to load from script.js
function waitForProducts() {
    waitCount++;
    
    // Tentar acessar de múltiplas formas
    const productsArray = window.products || products || [];
    
    console.log(`Tentativa ${waitCount}:`, {
        windowProducts: typeof window.products,
        globalProducts: typeof products,
        length: productsArray.length,
        productId: productId
    });
    
    if (productsArray.length > 0) {
        console.log('✅ Produtos carregados com sucesso!', productsArray.length, 'produtos');
        // Usar a variável global
        if (typeof products === 'undefined') {
            window.products = productsArray;
        }
        loadProduct();
    } else if (waitCount >= MAX_WAIT) {
        console.error('❌ Timeout: Produtos não carregados após 5 segundos');
        showProductNotFound();
    } else {
        setTimeout(waitForProducts, 100);
    }
}

// Load product details
function loadProduct() {
    console.log('=== LOAD PRODUCT CHAMADO ===');
    console.log('Product ID:', productId);
    
    // Tentar acessar products de múltiplas formas
    const productsArray = window.products || products || [];
    console.log('Total de produtos disponíveis:', productsArray.length);
    
    if (!productId) {
        console.error('❌ Nenhum ID de produto na URL');
        showProductNotFound();
        return;
    }
    
    // Find product by ID (compare as strings)
    currentProduct = productsArray.find(p => {
        const match = String(p.id) === String(productId);
        console.log(`Comparando: ${p.id} === ${productId}? ${match}`);
        return match;
    });
    
    console.log('Produto encontrado:', currentProduct);
    
    if (currentProduct) {
        console.log('✅ Exibindo produto:', currentProduct.name);
        displayProductDetail();
        displayRelatedProducts();
    } else {
        console.error('❌ Produto não encontrado com ID:', productId);
        showProductNotFound();
    }
}

// Show product not found
function showProductNotFound() {
    const productDetailContainer = document.getElementById('productDetail');
    if (productDetailContainer) {
        productDetailContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="max-width: 500px; margin: 0 auto;">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5" style="margin-bottom: 30px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v4M12 16h.01"></path>
                    </svg>
                    <h2 style="font-size: 2rem; color: #2c2c2c; margin-bottom: 15px;">Produto não encontrado</h2>
                    <p style="font-size: 1.1rem; color: #6b6b6b; margin-bottom: 30px;">
                        O produto que você está procurando não existe ou não está disponível no momento.
                    </p>
                    <a href="../index.html" class="btn btn-primary" style="display: inline-block;">Voltar para Início</a>
                </div>
            </div>
        `;
    }
}

// Format price helper
function formatPrice(price) {
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
}

// Display product details
function displayProductDetail() {
    const productDetailContainer = document.getElementById('productDetail');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    
    if (!currentProduct) {
        showProductNotFound();
        return;
    }

    // Update breadcrumb
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = currentProduct.name;
    }
    document.title = `${currentProduct.name} - Presentes Especiais | PROJETO PORTFÓLIO`;

    // Calculate discount
    const discount = currentProduct.oldPrice 
        ? Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)
        : 0;

    // Helper to get correct image path
    const getImagePath = (imagePath) => {
        if (!imagePath) return '';
        // Se já começa com ../, retornar como está
        if (imagePath.startsWith('../')) return imagePath;
        // Se começa com img/, adicionar ../
        if (imagePath.startsWith('img/')) return `../${imagePath}`;
        // Caso contrário, retornar como está
        return imagePath;
    };

    // Helper to get category page URL
    const getCategoryUrl = (category) => {
        console.log('🔗 Gerando URL para categoria:', category);
        let url;
        if (category === 'Cosmético Feminino') {
            url = 'cosmetico-feminino.html';
        } else if (category === 'Cosmético Masculino') {
            url = 'cosmetico-masculino.html';
        } else {
            url = 'categorias.html';
        }
        console.log('✅ URL gerada:', url);
        return url;
    };

    // Create product HTML
    const productHTML = `
        <div class="product-detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-bottom: 60px;">
            <div class="product-detail-image">
                ${currentProduct.image 
                    ? `<img src="${getImagePath(currentProduct.image)}" alt="${currentProduct.name}" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                       <div class="product-image-placeholder" style="display: none; width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #ffd4d4 0%, #ffbdbd 100%); border-radius: 12px; align-items: center; justify-content: center; flex-direction: column; padding: 40px; text-align: center;">
                           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" style="margin-bottom: 20px;">
                               <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                               <circle cx="12" cy="12" r="3"></circle>
                               <path d="M3 9l9 6 9-6"></path>
                           </svg>
                           <p style="color: white; font-size: 1.2rem; font-weight: 500;">${currentProduct.name}</p>
                           <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem; margin-top: 10px;">${currentProduct.category}</p>
                       </div>`
                    : `<div class="product-image-placeholder" style="display: flex; width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #ffd4d4 0%, #ffbdbd 100%); border-radius: 12px; align-items: center; justify-content: center; flex-direction: column; padding: 40px; text-align: center;">
                           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" style="margin-bottom: 20px;">
                               <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                               <circle cx="12" cy="12" r="3"></circle>
                               <path d="M3 9l9 6 9-6"></path>
                           </svg>
                           <p style="color: white; font-size: 1.2rem; font-weight: 500;">${currentProduct.name}</p>
                           <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem; margin-top: 10px;">${currentProduct.category}</p>
                       </div>`
                }
            </div>

            <div class="product-detail-info">
                <a href="${getCategoryUrl(currentProduct.category)}" class="product-category" style="display: inline-block; color: #ffbdbd; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; text-decoration: none; transition: all 0.3s; cursor: pointer;" onmouseover="this.style.color='#ff9090'; this.style.transform='translateX(5px)'" onmouseout="this.style.color='#ffbdbd'; this.style.transform='translateX(0)'">
                    ← ${currentProduct.category}
                </a>
                
                <h1 style="font-size: 2.5rem; color: #2c2c2c; margin-bottom: 20px; line-height: 1.2;">
                    ${currentProduct.name}
                </h1>

                <div class="product-rating" style="display: flex; align-items: center; gap: 10px; margin-bottom: 25px;">
                    <div style="display: flex; gap: 4px;">
                        ${Array(5).fill().map((_, i) => `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${i < 4 ? '#ffbdbd' : '#e0e0e0'}" stroke="none">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        `).join('')}
                    </div>
                    <span style="color: #6b6b6b; font-size: 0.95rem;">(4.5 estrelas)</span>
                </div>

                <p style="font-size: 1.05rem; color: #6b6b6b; line-height: 1.8; margin-bottom: 30px;">
                    ${currentProduct.description}
                </p>

                <div class="product-price-section" style="background: #f9f5f5; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                    ${currentProduct.oldPrice ? `
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="background: #ff4444; color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                                -${discount}% OFF
                            </span>
                            <span style="text-decoration: line-through; color: #999; font-size: 1.1rem;">
                                ${formatPrice(currentProduct.oldPrice)}
                            </span>
                        </div>
                    ` : ''}
                    <div style="font-size: 2.5rem; color: #ffbdbd; font-weight: 700;">
                        ${formatPrice(currentProduct.price)}
                    </div>
                    <p style="color: #6b6b6b; font-size: 0.9rem; margin-top: 8px;">
                        Em até 3x sem juros no cartão
                    </p>
                </div>

                <div class="product-actions" style="display: flex; gap: 15px; margin-bottom: 25px;">
                    <button onclick="addToCart('${currentProduct.id}')" class="btn btn-primary" style="flex: 1; padding: 18px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Adicionar ao Carrinho
                    </button>
                </div>

                <div class="product-features" style="border-top: 1px solid #eee; padding-top: 25px;">
                    <h3 style="font-size: 1.1rem; color: #2c2c2c; margin-bottom: 15px;">Informações do Produto</h3>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span style="color: #6b6b6b;">Produto original e de qualidade</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span style="color: #6b6b6b;">Envio para todo o Brasil</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span style="color: #6b6b6b;">Embalagem para presente</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                                <path d="M20 6 9 17l-5-5"></path>
                            </svg>
                            <span style="color: #6b6b6b;">Garantia de satisfação</span>
                        </div>
                    </div>
                </div>

                <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-top: 25px;">
                    <p style="color: #856404; font-size: 0.9rem; margin: 0;">
                        💡 <strong>Projeto de Portfólio:</strong> Este é um site demonstrativo. Nenhum pagamento real será processado.
                    </p>
                </div>
            </div>
        </div>
    `;

    productDetailContainer.innerHTML = productHTML;

    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .product-detail-grid {
                grid-template-columns: 1fr !important;
                gap: 30px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Display related products
function displayRelatedProducts() {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (!relatedProductsContainer || !currentProduct) return;

    // Tentar acessar products de múltiplas formas
    const productsArray = window.products || products || [];

    // Get products from same category, excluding current product
    const related = productsArray
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (related.length === 0) {
        relatedProductsContainer.innerHTML = '<p style="text-align: center; color: #999;">Nenhum produto relacionado encontrado.</p>';
        return;
    }

    // Helper to get correct image path
    const getImagePath = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('../')) return imagePath;
        if (imagePath.startsWith('img/')) return `../${imagePath}`;
        return imagePath;
    };

    relatedProductsContainer.innerHTML = related.map(product => `
        <div class="product-card">
            <a href="produto.html?id=${product.id}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${getImagePath(product.image)}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                           <div class="product-placeholder" style="display: none;">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
                               </svg>
                           </div>`
                        : `<div class="product-placeholder" style="display: flex;">
                               <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                   <circle cx="12" cy="12" r="3"></circle>
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

// Start loading when page loads
window.addEventListener('DOMContentLoaded', () => {
    waitForProducts();
});
