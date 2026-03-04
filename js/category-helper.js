<script>
// Wait for products to load
function waitAndDisplayCategoryProducts(category) {
    if (typeof products !== "undefined" && products.length > 0) {
        displayCategoryProducts(category);
    } else {
        setTimeout(() => waitAndDisplayCategoryProducts(category), 100);
    }
}

function displayCategoryProducts(category) {
    const container = document.getElementById("categoryProducts");
    if (!container) return;

    const filtered = products.filter(p => p.category === category);
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #999; padding: 40px;">Nenhum produto encontrado nesta categoria.</p>`;
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <a href="produto.html?id=${product.id}" class="product-card-link">
                <div class="product-image">
                    ${product.image 
                        ? `<img src="../${product.image}" alt="${product.name}" onerror="this.style.display=''none''; this.nextElementSibling.style.display=''flex''">
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
                            ${product.oldPrice ? `<div class="product-old-price">${formatPrice(product.oldPrice)}</div>` : ""}
                        </div>
                        <button class="add-to-cart-btn" onclick="event.preventDefault(); event.stopPropagation(); addToCart(''${product.id}''); return false;">
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
    `).join("");
}
</script>
