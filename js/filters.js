// ===================================
// MODERN FILTERS SYSTEM
// ===================================

// Filter state
let filterState = {
    category: [],
    subcategory: [],
    priceMin: null,
    priceMax: null,
    brands: [],
    sortBy: 'relevance'
};

let allProducts = [];
let filteredProducts = [];

// Initialize filters when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});

// Listen for products loaded event
window.addEventListener('productsLoaded', (event) => {
    console.log('🎉 Evento productsLoaded recebido');
    loadProductsForFilters();
});

// Fallback: Try to load after a delay
setTimeout(() => {
    if (allProducts.length === 0) {
        console.log('⏱️ Tentando carregar produtos via fallback...');
        loadProductsForFilters();
    }
}, 2000);

// Load products and initialize filters
async function loadProductsForFilters() {
    try {
        // Aguardar produtos serem carregados da API
        let attempts = 0;
        const maxAttempts = 20; // 10 segundos no máximo
        
        while (attempts < maxAttempts) {
            // Tentar obter produtos de várias fontes
            if (typeof getAllProducts === 'function') {
                const fetchedProducts = getAllProducts();
                if (fetchedProducts && fetchedProducts.length > 0) {
                    allProducts = fetchedProducts;
                    break;
                }
            }
            
            if (window.products && window.products.length > 0) {
                allProducts = window.products;
                break;
            }
            
            // Aguardar 500ms antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        console.log('📦 Produtos carregados para filtros:', allProducts.length);
        
        if (allProducts.length === 0) {
            console.warn('⚠️ Nenhum produto encontrado para filtros');
            return;
        }
        
        filteredProducts = [...allProducts];
        buildFilterOptions();
        renderFilteredProducts(filteredProducts);
        updateProductCount();
    } catch (error) {
        console.error('Error loading products for filters:', error);
    }
}

// Initialize filter system
function initializeFilters() {
    // Mobile filter toggle
    const filterToggle = document.getElementById('filterToggleBtn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersOverlay = document.getElementById('filtersOverlay');
    const closeFiltersBtn = document.getElementById('closeFiltersBtn');

    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            filtersSidebar?.classList.add('mobile-open');
            filtersOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', closeFiltersSidebar);
    }

    if (filtersOverlay) {
        filtersOverlay.addEventListener('click', closeFiltersSidebar);
    }

    // Clear all filters
    const clearFiltersBtn = document.getElementById('clearAllFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Sort dropdown
    const sortSelect = document.getElementById('sortProducts');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            filterState.sortBy = e.target.value;
            applySorting();
        });
    }

    // Price inputs
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');

    if (priceMinInput) {
        priceMinInput.addEventListener('change', () => {
            filterState.priceMin = priceMinInput.value ? parseFloat(priceMinInput.value) : null;
            applyFilters();
        });
    }

    if (priceMaxInput) {
        priceMaxInput.addEventListener('change', () => {
            filterState.priceMax = priceMaxInput.value ? parseFloat(priceMaxInput.value) : null;
            applyFilters();
        });
    }

    // Category checkboxes
    document.querySelectorAll('.filter-category').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            updateFilterArray(filterState.category, e.target.value, e.target.checked);
            applyFilters();
        });
    });

    // Subcategory checkboxes
    document.querySelectorAll('.filter-subcategory').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            updateFilterArray(filterState.subcategory, e.target.value, e.target.checked);
            applyFilters();
        });
    });

    // Brand checkboxes
    document.querySelectorAll('.filter-brand').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            updateFilterArray(filterState.brands, e.target.value, e.target.checked);
            applyFilters();
        });
    });

    // Collapsible filter groups
    document.querySelectorAll('.filter-group-title').forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            if (content) {
                content.classList.toggle('hidden');
                title.classList.toggle('collapsed');
            }
        });
    });
}

// Close filters sidebar (mobile)
function closeFiltersSidebar() {
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersOverlay = document.getElementById('filtersOverlay');
    
    filtersSidebar?.classList.remove('mobile-open');
    filtersOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}

// Update filter array helper
function updateFilterArray(array, value, add) {
    if (add) {
        if (!array.includes(value)) {
            array.push(value);
        }
    } else {
        const index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}

// Build filter options dynamically
function buildFilterOptions() {
    console.log('🔨 Construindo opções de filtro...', {
        totalProducts: allProducts.length,
        sampleProduct: allProducts[0]
    });
    
    // Get unique categories
    const categories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);
    console.log('📁 Categorias encontradas:', categories);
    
    const categoryContainer = document.getElementById('categoryFilters');
    
    if (categoryContainer) {
        categoryContainer.innerHTML = categories.map((cat, index) => `
            <div class="filter-option">
                <input type="checkbox" id="cat-${index}" class="filter-category" value="${cat}">
                <label for="cat-${index}">
                    <span>${cat}</span>
                    <span class="filter-option-count">(${allProducts.filter(p => p.category === cat).length})</span>
                </label>
            </div>
        `).join('');

        // Re-attach event listeners
        categoryContainer.querySelectorAll('.filter-category').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                updateFilterArray(filterState.category, e.target.value, e.target.checked);
                applyFilters();
            });
        });
    }

    // Get unique subcategories
    const subcategories = [...new Set(allProducts.map(p => p.subcategory))].filter(Boolean);
    const subcategoryContainer = document.getElementById('subcategoryFilters');
    
    if (subcategoryContainer) {
        subcategoryContainer.innerHTML = subcategories.map((subcat, index) => `
            <div class="filter-option">
                <input type="checkbox" id="subcat-${index}" class="filter-subcategory" value="${subcat}">
                <label for="subcat-${index}">
                    <span>${subcat}</span>
                    <span class="filter-option-count">(${allProducts.filter(p => p.subcategory === subcat).length})</span>
                </label>
            </div>
        `).join('');

        // Re-attach event listeners
        subcategoryContainer.querySelectorAll('.filter-subcategory').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                updateFilterArray(filterState.subcategory, e.target.value, e.target.checked);
                applyFilters();
            });
        });
    }

    // Get unique brands (if available in product data)
    const brands = [...new Set(allProducts.map(p => p.brand || p.marca))].filter(Boolean);
    const brandContainer = document.getElementById('brandFilters');
    
    if (brandContainer && brands.length > 0) {
        brandContainer.innerHTML = brands.map((brand, index) => `
            <div class="filter-option">
                <input type="checkbox" id="brand-${index}" class="filter-brand" value="${brand}">
                <label for="brand-${index}">
                    <span>${brand}</span>
                    <span class="filter-option-count">(${allProducts.filter(p => (p.brand || p.marca) === brand).length})</span>
                </label>
            </div>
        `).join('');

        // Re-attach event listeners
        brandContainer.querySelectorAll('.filter-brand').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                updateFilterArray(filterState.brands, e.target.value, e.target.checked);
                applyFilters();
            });
        });
    }

    // Set price range limits
    const prices = allProducts.map(p => p.price).filter(Boolean);
    if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        
        const priceMinInput = document.getElementById('priceMin');
        const priceMaxInput = document.getElementById('priceMax');
        
        if (priceMinInput) {
            priceMinInput.placeholder = `R$ ${minPrice}`;
            priceMinInput.min = minPrice;
        }
        
        if (priceMaxInput) {
            priceMaxInput.placeholder = `R$ ${maxPrice}`;
            priceMaxInput.max = maxPrice;
        }
    }
}

// Apply all filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (filterState.category.length > 0) {
            if (!filterState.category.includes(product.category)) {
                return false;
            }
        }

        // Subcategory filter
        if (filterState.subcategory.length > 0) {
            if (!filterState.subcategory.includes(product.subcategory)) {
                return false;
            }
        }

        // Brand filter
        if (filterState.brands.length > 0) {
            const productBrand = product.brand || product.marca;
            if (!filterState.brands.includes(productBrand)) {
                return false;
            }
        }

        // Price filter
        if (filterState.priceMin !== null && product.price < filterState.priceMin) {
            return false;
        }

        if (filterState.priceMax !== null && product.price > filterState.priceMax) {
            return false;
        }

        return true;
    });

    applySorting();
    updateActiveFilters();
    updateProductCount();
    renderFilteredProducts(filteredProducts);
}

// Apply sorting
function applySorting() {
    switch (filterState.sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            // relevance - keep original order
            break;
    }
    
    renderFilteredProducts(filteredProducts);
}

// Display filtered products
function renderFilteredProducts(products) {
    const container = document.getElementById('allProducts');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products-found">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros para encontrar o que você procura</p>
            </div>
        `;
        return;
    }

    // Render products directly
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="${typeof getProductPath === 'function' ? getProductPath(product.id) : 'produto.html?id=' + product.id}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="${typeof getImagePath === 'function' ? getImagePath(product.image) : product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
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
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                            ${product.oldPrice ? `<div class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</div>` : ''}
                        </div>
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); ${typeof addToCart === 'function' ? 'addToCart' : 'window.addToCart'}('${product.id}'); return false;">
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

// Update active filters display
function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;

    const tags = [];

    // Category tags
    filterState.category.forEach(cat => {
        tags.push({ type: 'category', value: cat, label: cat });
    });

    // Subcategory tags
    filterState.subcategory.forEach(subcat => {
        tags.push({ type: 'subcategory', value: subcat, label: subcat });
    });

    // Brand tags
    filterState.brands.forEach(brand => {
        tags.push({ type: 'brand', value: brand, label: brand });
    });

    // Price tag
    if (filterState.priceMin !== null || filterState.priceMax !== null) {
        const minStr = filterState.priceMin !== null ? `R$ ${filterState.priceMin}` : 'R$ 0';
        const maxStr = filterState.priceMax !== null ? `R$ ${filterState.priceMax}` : '∞';
        tags.push({ type: 'price', label: `${minStr} - ${maxStr}` });
    }

    if (tags.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = tags.map(tag => `
        <div class="filter-tag">
            <span>${tag.label}</span>
            <button onclick="removeFilter('${tag.type}', '${tag.value || ''}')" aria-label="Remover filtro">×</button>
        </div>
    `).join('');
}

// Remove individual filter
function removeFilter(type, value) {
    switch (type) {
        case 'category':
            filterState.category = filterState.category.filter(c => c !== value);
            document.querySelectorAll('.filter-category').forEach(cb => {
                if (cb.value === value) cb.checked = false;
            });
            break;
        case 'subcategory':
            filterState.subcategory = filterState.subcategory.filter(s => s !== value);
            document.querySelectorAll('.filter-subcategory').forEach(cb => {
                if (cb.value === value) cb.checked = false;
            });
            break;
        case 'brand':
            filterState.brands = filterState.brands.filter(b => b !== value);
            document.querySelectorAll('.filter-brand').forEach(cb => {
                if (cb.value === value) cb.checked = false;
            });
            break;
        case 'price':
            filterState.priceMin = null;
            filterState.priceMax = null;
            const priceMinInput = document.getElementById('priceMin');
            const priceMaxInput = document.getElementById('priceMax');
            if (priceMinInput) priceMinInput.value = '';
            if (priceMaxInput) priceMaxInput.value = '';
            break;
    }

    applyFilters();
}

// Clear all filters
function clearAllFilters() {
    filterState = {
        category: [],
        subcategory: [],
        priceMin: null,
        priceMax: null,
        brands: [],
        sortBy: 'relevance'
    };

    // Uncheck all checkboxes
    document.querySelectorAll('.filter-category, .filter-subcategory, .filter-brand').forEach(cb => {
        cb.checked = false;
    });

    // Clear price inputs
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';

    // Reset sort
    const sortSelect = document.getElementById('sortProducts');
    if (sortSelect) sortSelect.value = 'relevance';

    applyFilters();
}

// Update product count
function updateProductCount() {
    const countElement = document.getElementById('productsCount');
    if (countElement) {
        const total = allProducts.length;
        const showing = filteredProducts.length;
        countElement.textContent = `${showing} de ${total} produtos`;
    }
}

// Export functions to global scope
window.removeFilter = removeFilter;
window.clearAllFilters = clearAllFilters;
window.initializeFilters = initializeFilters;
window.applyFilters = applyFilters;
