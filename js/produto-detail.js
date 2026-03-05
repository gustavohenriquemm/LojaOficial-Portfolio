// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // Não converter para int, manter como string

// Products array
let allProducts = [];
let currentProduct = null;

// Load products from script.js defaultProducts or window.getAllProducts
function loadProducts() {
    try {
        // Tentar obter produtos do script.js
        if (typeof window.getAllProducts === 'function') {
            allProducts = window.getAllProducts();
        } else if (window.defaultProducts && Array.isArray(window.defaultProducts)) {
            allProducts = window.defaultProducts;
        } else {
            // Fallback para produtos padrão se não encontrar
            allProducts = [];
        }
        
        // Comparar como string para compatibilidade
        currentProduct = allProducts.find(p => String(p.id) === String(productId));
        
        if (currentProduct) {
            displayProductDetail();
            displayRelatedProducts();
        } else {
            showProductNotFound();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showProductError();
    }
}

function showProductError() {
    const productDetailContainer = document.getElementById('productDetail');
    if (productDetailContainer) {
        productDetailContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Erro ao carregar produto</h2>
                <p>Não foi possível carregar as informações do produto. Por favor, tente novamente.</p>
                <a href="produtos.html" class="btn btn-primary">Ver Todos os Produtos</a>
            </div>
        `;
    }
}

function showProductNotFound() {
    const productDetailContainer = document.getElementById('productDetail');
    if (productDetailContainer) {
        productDetailContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Produto não encontrado</h2>
                <p>O produto que você está procurando não existe ou foi removido.</p>
                <a href="produtos.html" class="btn btn-primary">Ver Todos os Produtos</a>
            </div>
        `;
    }
}

// Format price helper
function formatPrice(price) {
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
}

// Detectar e buscar automaticamente imagens numeradas
function detectImageGallery(imagePath) {
    if (!imagePath) return [];
    
    // Extrair extensão e nome do arquivo
    const lastDot = imagePath.lastIndexOf('.');
    if (lastDot === -1) return [imagePath];
    
    const extension = imagePath.substring(lastDot);
    const basePath = imagePath.substring(0, lastDot);
    
    let imageGallery = [];
    let baseWithoutNumber = '';
    let hasPattern = false;
    
    // Padrão 1: arquivo-01, arquivo-02 (com hífen e zeros à esquerda)
    const pattern1 = /-(\d{2})$/;
    const match1 = basePath.match(pattern1);
    
    if (match1) {
        baseWithoutNumber = basePath.replace(pattern1, '');
        hasPattern = true;
        
        // Buscar variações -01 até -05
        for (let i = 1; i <= 5; i++) {
            const formattedNumber = String(i).padStart(2, '0');
            imageGallery.push(`${baseWithoutNumber}-${formattedNumber}${extension}`);
        }
    }
    
    // Padrão 2: arquivo-1, arquivo-2 (com hífen, sem zeros)
    if (!hasPattern) {
        const pattern2 = /-(\d)$/;
        const match2 = basePath.match(pattern2);
        
        if (match2) {
            baseWithoutNumber = basePath.replace(pattern2, '');
            hasPattern = true;
            
            // Buscar variações -1 até -5
            for (let i = 1; i <= 5; i++) {
                imageGallery.push(`${baseWithoutNumber}-${i}${extension}`);
            }
        }
    }
    
    // Padrão 3: arquivo 2, arquivo 3 (com espaço e número)
    if (!hasPattern) {
        const pattern3 = /\s+(\d+)$/;
        const match3 = basePath.match(pattern3);
        
        if (match3) {
            baseWithoutNumber = basePath.replace(pattern3, '');
            hasPattern = true;
            const currentNumber = parseInt(match3[1]);
            
            // Para esse padrão, geralmente a primeira imagem não tem número
            // Ex: "nuvem.jpg" e "nuvem 2.jpg"
            imageGallery.push(`${baseWithoutNumber}${extension}`); // imagem sem número
            
            // Adicionar variações com espaço começando do número 2
            for (let i = 2; i <= 5; i++) {
                imageGallery.push(`${baseWithoutNumber} ${i}${extension}`);
            }
        }
    }
    
    // Padrão 4: arquivo2, arquivo3 (número direto sem espaço nem hífen)
    if (!hasPattern) {
        const pattern4 = /(\d+)$/;
        const match4 = basePath.match(pattern4);
        
        if (match4) {
            baseWithoutNumber = basePath.replace(pattern4, '');
            hasPattern = true;
            
            const currentNumber = parseInt(match4[1]);
            
            // Se começa com 1, incluir versão sem número E versões numeradas
            // Ex: lis1.jpg → busca lis.jpg, lis1.jpg, lis2.jpg, lis3.jpg
            // Se começa com 2+, NÃO incluir versão sem número
            // Ex: pesego2.jpg → busca pesego.jpg, pesego2.jpg, pesego3.jpg
            
            if (currentNumber === 1) {
                // Começando com 1, então existe sequência 1,2,3...
                for (let i = 1; i <= 5; i++) {
                    imageGallery.push(`${baseWithoutNumber}${i}${extension}`);
                }
            } else {
                // Começando com 2+, buscar versão sem número primeiro
                imageGallery.push(`${baseWithoutNumber}${extension}`); // sem número
                for (let i = 1; i <= 5; i++) {
                    imageGallery.push(`${baseWithoutNumber}${i}${extension}`);
                }
            }
        }
    }
    
    // Se não encontrou nenhum padrão numérico, tentar verificar se existe variação com " 2"
    if (!hasPattern) {
        // Tentar buscar variação com espaço + 2
        imageGallery = [
            imagePath, // imagem original (sem número)
            `${basePath} 2${extension}`,
            `${basePath} 3${extension}`,
            `${basePath}2${extension}`, // sem espaço
            `${basePath}3${extension}`,
            `${basePath}4${extension}`,
            `${basePath}5${extension}`
        ];
    }
    
    return imageGallery.length > 0 ? imageGallery : [imagePath];
}

function displayProductDetail() {
    const productDetailContainer = document.getElementById('productDetail');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    
    if (!currentProduct) {
        productDetailContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Produto não encontrado</h2>
                <p>O produto que você está procurando não existe ou foi removido.</p>
                <a href="produtos.html" class="btn btn-primary">Ver Todos os Produtos</a>
            </div>
        `;
        return;
    }

    // Update breadcrumb
    breadcrumbProduct.textContent = currentProduct.name;
    document.title = `${currentProduct.name} - Presentes Especiais`;

    // Display product
    const discount = currentProduct.oldPrice 
        ? Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)
        : 0;

    // Detectar e buscar automaticamente imagens numeradas
    if (!currentProduct.images && currentProduct.image) {
        const imageGallery = detectImageGallery(currentProduct.image);
        if (imageGallery.length > 1) {
            currentProduct.images = imageGallery;
        }
    }

    // Criar galeria de imagens
    const hasGallery = currentProduct.images && currentProduct.images.length > 1;
    let galleryHTML = '';
    
    if (hasGallery) {
        // Ajustar caminhos das imagens
        const adjustedImages = currentProduct.images.map(img => {
            if (typeof getImagePath === 'function') {
                return getImagePath(img);
            }
            return img.startsWith('../') ? img : '../' + img;
        });

        galleryHTML = `
            <div class="product-gallery">
                <div class="product-gallery-thumbs" id="galleryThumbs">
                    ${adjustedImages.map((img, index) => `
                        <img src="${img}" 
                             alt="${currentProduct.name} - Imagem ${index + 1}" 
                             class="gallery-thumb ${index === 0 ? 'active' : ''}"
                             onclick="changeMainImage('${img}', ${index})"
                             onerror="handleThumbError(this)"
                             style="display: block;">
                    `).join('')}
                </div>
                <div class="product-gallery-main">
                    <img id="mainProductImage" src="${adjustedImages[0]}" alt="${currentProduct.name}" 
                         onerror="handleMainImageError(this)">
                    <div class="product-image-placeholder" style="display: none;">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                            <circle cx="12" cy="12" r="3"></circle>
                            <line x1="3" y1="3" x2="7" y2="7"></line>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    } else if (currentProduct.image) {
        // Ajustar caminho da imagem
        const imagePath = typeof getImagePath === 'function' ? getImagePath(currentProduct.image) : (currentProduct.image.startsWith('../') ? currentProduct.image : '../' + currentProduct.image);
        galleryHTML = `
            <img src="${imagePath}" alt="${currentProduct.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="product-image-placeholder" style="display: none;">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="3" y1="3" x2="7" y2="7"></line>
                </svg>
            </div>
        `;
    } else {
        galleryHTML = `
            <div class="product-image-placeholder">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ffbdbd" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                    <line x1="3" y1="3" x2="7" y2="7"></line>
                </svg>
            </div>
        `;
    }

    productDetailContainer.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                ${galleryHTML}
            </div>

            <div class="product-detail-info">
                <div class="product-detail-category">${currentProduct.category}</div>
                <h1 class="product-detail-title">${currentProduct.name}</h1>
                
                <div class="product-detail-prices">
                    <div class="product-detail-price" id="preco-produto">R$ ${currentProduct.price.toFixed(2)}</div>
                    ${currentProduct.oldPrice 
                        ? `<div class="product-detail-old-price">R$ ${currentProduct.oldPrice.toFixed(2)}</div>
                           <div class="product-detail-discount">${discount}% OFF</div>`
                        : ''
                    }
                </div>

                <div class="product-detail-description">
                    <h3>Descrição</h3>
                    <p>${currentProduct.description}</p>
                </div>

                <!-- FRETE -->
                <div class="frete-box" id="frete-box">
                    <h3>Calcule o Frete</h3>
                    <div class="frete-form">
                        <input type="text" id="cepDestino" maxlength="9" placeholder="Digite seu CEP" class="frete-input" />
                        <button class="btn btn-secondary" id="btnCalcularFrete">Calcular Frete</button>
                    </div>
                    <div id="freteResultado" class="frete-resultado"></div>
                </div>

                <div class="product-detail-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <input type="number" id="productQuantity" value="1" min="1" readonly>
                        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                    
                    <button class="btn btn-primary btn-large" onclick="addProductToCart()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Adicionar ao Carrinho
                    </button>
                </div>

                <div class="product-detail-features">
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>Produto de qualidade garantida</span>
                    </div>
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        <span>Entrega rápida e segura</span>
                    </div>
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                            <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z"></path>
                        </svg>
                        <span>Embalagem especial para presente</span>
                    </div>
                </div>
            </div>
        </div>
    `;
// --- FRETE ---
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'btnCalcularFrete') {
        calcularFreteHandler();
    }
});

// Adicionar máscara de CEP
document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'cepDestino') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }
        e.target.value = value;
    }
});

function calcularFreteHandler() {
    const cepInput = document.getElementById('cepDestino');
    const cepDestino = cepInput.value.replace(/\D/g, '');
    const resultado = document.getElementById('freteResultado');
    
    resultado.innerHTML = '';
    
    if (!cepDestino || cepDestino.length < 8) {
        resultado.innerHTML = '<span style="color:red; font-size: 0.9rem;">⚠️ Digite um CEP válido (8 dígitos)</span>';
        cepInput.style.borderColor = 'red';
        return;
    }
    
    cepInput.style.borderColor = '';
    resultado.innerHTML = '<span style="color: var(--primary-color);">Calculando frete...</span>';
    
    // Dados simulados do produto (poderia vir do backend)
    const cepOrigem = '06833160'; // Origem ajustada para Embu-Guaçu/SP
    const peso = currentProduct.peso || 0.6; // kg (ajustado)
    const altura = currentProduct.altura || 15; // cm (ajustado)
    const largura = currentProduct.largura || 8; // cm (ajustado)
    const comprimento = currentProduct.comprimento || 8; // cm (ajustado)

    // Peso cúbico
    const pesoCubico = (altura * largura * comprimento) / 6000;
    const pesoFinal = Math.max(peso, pesoCubico);


    // --- Cálculo de distância simulada por faixas de CEP ---
    // --- Cálculo de distância simulada por faixas de CEP e região ---
    function calcularDistanciaSimulada(cepOrigem, cepDestino) {
        const o = cepOrigem.replace(/\D/g, "").substring(0, 5);
        const d = cepDestino.replace(/\D/g, "").substring(0, 5);
        // Mesma rua/bairro
        if (o === d) return 5;
        // Mesma cidade/região próxima (exemplo: Embu-Guaçu e região)
        if (o.startsWith("068") && d.startsWith("068")) return 20;
        // Estado de SP (faixa 0xxxx ou 1xxxx)
        if (d.startsWith("0") || d.startsWith("1")) return 60;
        // RJ, Sul, Centro-Oeste (faixa 2xxxx ou 3xxxx)
        if (d.startsWith("2") || d.startsWith("3")) return 100;
        // Norte/Nordeste e demais regiões
        return 150;
    }
    const distancia = calcularDistanciaSimulada(cepOrigem, cepDestino);

    // Simulação de valores
    const basePAC = 18 + (pesoFinal * 6) + (distancia * 0.1);
    const baseSEDEX = 28 + (pesoFinal * 9) + (distancia * 0.2);

    const prazoPAC = 5 + Math.ceil(distancia / 40);
    const prazoSEDEX = 2 + Math.ceil(distancia / 80);

    // Armazenar valores de frete para uso posterior
    window.freteCalculado = {
        pac: basePAC,
        sedex: baseSEDEX,
        selecionado: basePAC // Usar PAC como padrão
    };

    resultado.innerHTML = `
        <div class="frete-opcao" onclick="selecionarFrete('pac', ${basePAC})" style="cursor: pointer; border: 2px solid var(--primary-light); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
            <strong>PAC:</strong> R$ ${basePAC.toFixed(2)}<br>
            <span>Prazo estimado: ${prazoPAC} dias úteis</span>
            <small style="display: block; color: var(--primary-color); margin-top: 5px;">✓ Opção selecionada</small>
        </div>
        <div class="frete-opcao" onclick="selecionarFrete('sedex', ${baseSEDEX})" style="cursor: pointer; border: 2px solid #e0e0e0; padding: 10px; border-radius: 8px;">
            <strong>SEDEX:</strong> R$ ${baseSEDEX.toFixed(2)}<br>
            <span>Prazo estimado: ${prazoSEDEX} dias úteis</span>
        </div>
    `;

}
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('productQuantity');
    let newValue = parseInt(quantityInput.value) + delta;
    if (newValue < 1) newValue = 1;
    quantityInput.value = newValue;
}

function addProductToCart() {
    if (!currentProduct) {
        return;
    }
    
    const quantity = parseInt(document.getElementById('productQuantity').value);
    
    // Adicionar produto ao carrinho usando a função global
    addToCart(currentProduct.id, quantity);
    
    // Resetar quantidade
    document.getElementById('productQuantity').value = 1;
}

function displayRelatedProducts() {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    
    if (!currentProduct) return;
    
    // Get products from same category
    const relatedProducts = allProducts
        .filter(p => String(p.id) !== String(currentProduct.id) && p.category === currentProduct.category)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        relatedProductsContainer.innerHTML = '<p class="empty-message">Nenhum produto relacionado encontrado</p>';
        return;
    }
    
    relatedProductsContainer.innerHTML = relatedProducts.map(product => `
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

// Helper function to get correct image path
function getImagePath(imagePath) {
    if (!imagePath) return '';
    // Se já tem ../ no caminho, retornar como está
    if (imagePath.startsWith('../')) {
        return imagePath;
    }
    // Para a página de produto que está em /pages/, adicionar ../
    return `../${imagePath}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Function to change main image in gallery
function changeMainImage(imageUrl, index) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageUrl;
        
        // Update active thumbnail
        const thumbs = document.querySelectorAll('.gallery-thumb');
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        if (thumbs[index]) {
            thumbs[index].classList.add('active');
        }
    }
}

// Handle thumbnail load error
function handleThumbError(imgElement) {
    // Remove a miniatura que não carregou
    imgElement.style.display = 'none';
    imgElement.remove();
    
    // Verificar se restam miniaturas visíveis
    const thumbsContainer = document.getElementById('galleryThumbs');
    if (thumbsContainer) {
        const visibleThumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
        
        // Se só restar 1 miniatura ou nenhuma, esconder o container de thumbs
        if (visibleThumbs.length <= 1) {
            thumbsContainer.style.display = 'none';
        }
    }
}

// Handle main image load error
function handleMainImageError(imgElement) {
    // Tentar carregar a próxima imagem disponível
    const thumbs = document.querySelectorAll('.gallery-thumb');
    let foundAlternative = false;
    
    for (let thumb of thumbs) {
        if (thumb.complete && thumb.naturalWidth > 0) {
            imgElement.src = thumb.src;
            foundAlternative = true;
            break;
        }
    }
    
    // Se não encontrou alternativa, mostrar placeholder
    if (!foundAlternative) {
        imgElement.style.display = 'none';
        const placeholder = imgElement.nextElementSibling;
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}

// Make functions global
window.changeQuantity = changeQuantity;
window.addProductToCart = addProductToCart;
window.changeMainImage = changeMainImage;
window.handleThumbError = handleThumbError;
window.handleMainImageError = handleMainImageError;

// Funções para frete e preço total
function selecionarFrete(tipo, valor) {
    if (window.freteCalculado) {
        window.freteCalculado.selecionado = valor;
        
        // Atualizar visual das opções
        const opcoes = document.querySelectorAll('.frete-opcao');
        opcoes.forEach(opcao => {
            opcao.style.border = '2px solid #e0e0e0';
            const small = opcao.querySelector('small');
            if (small) small.remove();
        });
        
        event.target.closest('.frete-opcao').style.border = '2px solid var(--primary-light)';
        const small = document.createElement('small');
        small.style.cssText = 'display: block; color: var(--primary-color); margin-top: 5px;';
        small.textContent = '✓ Opção selecionada';
        event.target.closest('.frete-opcao').appendChild(small);
    }
}

window.selecionarFrete = selecionarFrete;
