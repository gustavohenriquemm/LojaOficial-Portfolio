
// ===================================
// ADMIN AUTHENTICATION
// ===================================

// IMPORTANTE: Esta é uma autenticação básica para demonstração
// Para produção, use autenticação backend com JWT ou OAuth

// Hash seguro da senha (use um gerador de hash online)
// Senha atual: admin123 -> Hash SHA-256
const ADMIN_CREDENTIALS = {
    username: 'admin',
    // Hash SHA-256 de 'admin123'
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};

async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

async function login(username, password) {
    const hashedPassword = await hashPassword(password);
    if (username === ADMIN_CREDENTIALS.username && hashedPassword === ADMIN_CREDENTIALS.passwordHash) {
        localStorage.setItem('adminLoggedIn', 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    
    if (await login(username, password)) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminData();
    } else {
        alert('Usuário ou senha incorretos!');
    }
});

// Check if already logged in
if (checkAuth()) {
    document.getElementById('loginScreen')?.classList.add('hidden');
    document.getElementById('adminPanel')?.classList.remove('hidden');
    loadAdminData();
}

// ===================================

// PRODUCTS MANAGEMENT
// ===================================

// Initialize variables
var adminProducts = [];
var editingProductId = null;

// Load products from API
async function loadProductsFromAPI() {
    try {
        const apiUrl = window.API_URL;
        console.log('Carregando produtos de:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // A API retorna { products: [], pagination: {} } ou { products: [], warning: "..." }
        if (data.products && Array.isArray(data.products)) {
            adminProducts = data.products;
        } else if (Array.isArray(data)) {
            // Compatibilidade com formato antigo (array direto)
            adminProducts = data;
        } else {
            console.error('Formato de resposta inesperado:', data);
            adminProducts = [];
        }
        
        // Mostrar aviso se MongoDB não estiver configurado
        if (data.warning) {
            console.warn('⚠️', data.warning);
            showNotification(data.warning, 'warning');
        }
        
        console.log(`✅ ${adminProducts.length} produtos carregados`);
        
    } catch (error) {
        console.error('❌ Erro ao conectar com API:', error);
        adminProducts = [];
        showNotification('Erro ao conectar com o servidor. Verifique se o backend está rodando.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Criar elemento de notificação se não existir
    let notification = document.getElementById('admin-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'admin-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Cores por tipo
    const colors = {
        error: '#ff4444',
        warning: '#ffa500',
        success: '#4CAF50',
        info: '#2196F3'
    };
    
    notification.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Subcategories by main category
const subcategoriesByCategory = {
    'Cosmético Feminino': ['Perfumes', 'Antitranspirante', 'Cremes', 'Body Splash', 'Máscaras', 'Outros Cuidados'],
    'Cosmético Masculino': ['Perfumes', 'Antitranspirante', 'Loção', 'Shampoo', 'Condicionador', 'Creme'],
    'Chocolates': ['Chocolate ao Leite', 'Chocolate Meio Amargo', 'Chocolate Branco', 'Trufas', 'Bombons', 'Kits Presente', 'Outros Chocolates']
};

// Update subcategory options based on selected category
function updateSubcategoryOptions() {
    const categorySelect = document.getElementById('productCategory');
    const subcategorySelect = document.getElementById('productSubcategory');
    
    const selectedCategory = categorySelect.value;
    
    if (!selectedCategory) {
        subcategorySelect.innerHTML = '<option value="">Selecione uma categoria principal primeiro</option>';
        subcategorySelect.disabled = true;
        return;
    }
    
    const subcategories = subcategoriesByCategory[selectedCategory] || [];
    subcategorySelect.disabled = false;
    subcategorySelect.innerHTML = '<option value="">Selecione...</option>' + 
        subcategories.map(sub => `<option value="${sub}">${sub}</option>`).join('');
}

function loadProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (adminProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">Nenhum produto cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" class="product-thumb" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/></svg>'">` 
                    : '<div class="product-thumb" style="display: flex; align-items: center; justify-content: center; background: #f0f0f0;">Sem imagem</div>'}
            </td>
            <td>
                <strong>${product.name}</strong>
                ${product.featured ? '<span style="margin-left: 8px; font-size: 1.1em;" title="Produto em destaque">⭐</span>' : ''}
            </td>
            <td>${product.category}${product.subcategory ? ' > ' + product.subcategory : ''}</td>
            <td><strong style="color: var(--primary-color)">R$ ${product.price.toFixed(2)}</strong></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn action-btn-edit" onclick="editProduct('${product.id}')">Editar</button>
                    <button class="action-btn action-btn-delete" onclick="deleteProduct('${product.id}')">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (productId) {
        // Converter productId para string para garantir comparação correta
        const product = adminProducts.find(p => String(p.id) === String(productId));
        if (product) {
            modalTitle.textContent = 'Editar Produto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name || '';
            document.getElementById('productCategory').value = product.category || '';
            
            // Update subcategory options and set value
            updateSubcategoryOptions();
            document.getElementById('productSubcategory').value = product.subcategory || '';
            
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productOldPrice').value = product.oldPrice || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productFeatured').checked = product.featured || false;
            
            // Show main image preview if exists
            if (product.image) {
                const preview = document.getElementById('imagePreview');
                const previewImg = document.getElementById('previewImg');
                if (preview && previewImg) {
                    previewImg.src = product.image;
                    preview.style.display = 'block';
                }
            }
            
            // Load secondary image if exists
            if (product.images && product.images.length > 1) {
                const secondaryImage = product.images[1];
                document.getElementById('productImageSecondary').value = secondaryImage;
                const previewSecondary = document.getElementById('imageSecondaryPreview');
                const previewImgSecondary = document.getElementById('previewImgSecondary');
                if (previewSecondary && previewImgSecondary) {
                    previewImgSecondary.src = secondaryImage;
                    previewSecondary.style.display = 'block';
                }
            }
            
            editingProductId = productId;
        } else {
            console.error('Produto não encontrado:', productId);
            console.log('Produtos disponíveis:', adminProducts);
        }
    } else {
        modalTitle.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productImage').value = '';
        document.getElementById('productImageSecondary').value = '';
        document.getElementById('productFeatured').checked = false;
        
        const imagePreview = document.getElementById('imagePreview');
        const imageSecondaryPreview = document.getElementById('imageSecondaryPreview');
        if (imagePreview) imagePreview.style.display = 'none';
        if (imageSecondaryPreview) imageSecondaryPreview.style.display = 'none';
        
        editingProductId = null;
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productImageSecondaryFile').value = '';
    document.getElementById('productImageSecondary').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageSecondaryPreview').style.display = 'none';
    editingProductId = null;
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        // Delete from API
        fetch(`${window.API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Converter para string para garantir comparação correta
                adminProducts = adminProducts.filter(p => String(p.id) !== String(id));
                loadProducts();
                updateDashboard();
                alert('Produto excluído com sucesso!');
            } else {
                alert('Erro ao excluir produto!');
            }
        })
        .catch(error => {
            console.error('Erro ao excluir produto:', error);
            alert('Erro ao excluir produto! Verifique a conexão com o servidor.');
        });
    }
}

// Product form submission
document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const subcategory = document.getElementById('productSubcategory').value;
    const mainImage = document.getElementById('productImage').value || null;
    const secondaryImage = document.getElementById('productImageSecondary').value || null;
    
    // Criar array de imagens para a galeria
    const images = [];
    if (mainImage) {
        images.push(mainImage);
    }
    if (secondaryImage) {
        images.push(secondaryImage);
    }
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        subcategory: subcategory || '',
        price: parseFloat(document.getElementById('productPrice').value),
        oldPrice: document.getElementById('productOldPrice').value ? parseFloat(document.getElementById('productOldPrice').value) : null,
        description: document.getElementById('productDescription').value,
        image: mainImage, // Imagem principal (usada nos cards)
        images: images.length > 0 ? images : undefined, // Array de imagens para galeria
        featured: document.getElementById('productFeatured').checked || false
    };
    
    try {
        let response;
        if (editingProductId) {
            // Update existing product
            response = await fetch(`${window.API_URL}/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await fetch(window.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (response.ok) {
            await loadProductsFromAPI();
            closeProductModal();
            loadProducts();
            updateDashboard();
            showNotification('Produto salvo com sucesso!', 'success');
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.message || errorData.error || 'Erro ao salvar produto';
            showNotification(errorMsg, 'error');
            
            // Se for erro 503, mostrar instrução específica
            if (response.status === 503) {
                showNotification('MongoDB não configurado. Configure MONGODB_URI no Render.', 'warning');
            }
        }
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showNotification('Erro ao conectar com o servidor. Verifique se o backend está rodando.', 'error');
    }
});

// ===================================
// ORDERS MANAGEMENT
// ===================================

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const recentOrdersList = document.getElementById('recentOrdersList');
    const ordersGrid = document.getElementById('ordersGrid');
    
    // Recent orders in dashboard
    if (recentOrdersList) {
        if (orders.length === 0) {
            recentOrdersList.innerHTML = '<p class="empty-message">Nenhum pedido registrado ainda</p>';
        } else {
            const recentOrders = orders.slice(-5).reverse();
            recentOrdersList.innerHTML = recentOrders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-id">Pedido #${order.id}</span>
                        <span class="order-date">${new Date(order.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="order-customer">${order.customer.name}</div>
                    <div class="order-total">R$ ${order.total.toFixed(2)}</div>
                </div>
            `).join('');
        }
    }
    
    // All orders in orders section
    if (ordersGrid) {
        if (orders.length === 0) {
            ordersGrid.innerHTML = '<p class="empty-message">Nenhum pedido registrado</p>';
        } else {
            ordersGrid.innerHTML = orders.slice().reverse().map(order => `
                <div class="order-card">
                    <div class="order-card-header">
                        <span class="order-card-title">Pedido #${order.id}</span>
                        <span class="order-card-date">${new Date(order.date).toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div class="order-card-info">
                        <div class="order-card-label">Cliente</div>
                        <div class="order-card-value">${order.customer.name}</div>
                    </div>
                    
                    <div class="order-card-info">
                        <div class="order-card-label">Telefone</div>
                        <div class="order-card-value">${order.customer.phone}</div>
                    </div>
                    
                    <div class="order-card-info">
                        <div class="order-card-label">Endereço</div>
                        <div class="order-card-value">
                            ${order.address.street}, ${order.address.number}<br>
                            ${order.address.neighborhood} - ${order.address.city}
                            ${order.address.complement ? '<br>' + order.address.complement : ''}
                        </div>
                    </div>
                    
                    <div class="order-card-products">
                        <h4>Produtos</h4>
                        ${order.items.map(item => `
                            <div class="order-product-item">
                                ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-card-total">
                        <span class="order-card-total-label">Total</span>
                        <span class="order-card-total-value">R$ ${order.total.toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ===================================
// SALES MANAGEMENT
// ===================================

function updateSalesData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const period = document.getElementById('salesPeriod')?.value || 'current';
    
    let filteredOrders = orders;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    if (period === 'current') {
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
    } else if (period === 'last') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        });
    }
    
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const ordersCount = filteredOrders.length;
    const averageTicket = ordersCount > 0 ? totalSales / ordersCount : 0;
    
    // Update sales summary
    if (document.getElementById('salesTotal')) {
        document.getElementById('salesTotal').textContent = `R$ ${totalSales.toFixed(2)}`;
    }
    if (document.getElementById('salesCount')) {
        document.getElementById('salesCount').textContent = ordersCount;
    }
    if (document.getElementById('salesAverage')) {
        document.getElementById('salesAverage').textContent = `R$ ${averageTicket.toFixed(2)}`;
    }
    
    // Update sales table
    const salesTableBody = document.getElementById('salesTableBody');
    if (salesTableBody) {
        if (filteredOrders.length === 0) {
            salesTableBody.innerHTML = '<tr><td colspan="4" class="empty-message">Nenhuma venda registrada</td></tr>';
        } else {
            salesTableBody.innerHTML = filteredOrders.slice().reverse().map(order => `
                <tr>
                    <td>${new Date(order.date).toLocaleDateString('pt-BR')}</td>
                    <td>${order.customer.name}</td>
                    <td>${order.items.length} produto(s)</td>
                    <td><strong style="color: var(--primary-color)">R$ ${order.total.toFixed(2)}</strong></td>
                </tr>
            `).join('');
        }
    }
}

// ===================================
// DASHBOARD
// ===================================

function updateDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Update stats
    if (document.getElementById('totalProducts')) {
        document.getElementById('totalProducts').textContent = adminProducts.length;
    }
    if (document.getElementById('totalOrders')) {
        document.getElementById('totalOrders').textContent = monthOrders.length;
    }
    if (document.getElementById('totalRevenue')) {
        document.getElementById('totalRevenue').textContent = `R$ ${monthRevenue.toFixed(2)}`;
    }
}

// ===================================
// NAVIGATION
// ===================================

function showSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.admin-nav-btn').classList.add('active');
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const sectionId = sectionName + 'Section';
    document.getElementById(sectionId)?.classList.add('active');
    
    // Load section data
    if (sectionName === 'sales') {
        updateSalesData();
    } else if (sectionName === 'orders') {
        loadOrders();
    }
}

// ===================================
// INITIALIZATION
// ===================================

async function loadAdminData() {
    // Load products from API
    await loadProductsFromAPI();
    
    loadProducts();
    loadOrders();
    updateDashboard();
    updateSalesData();
}

// Listen for storage changes from other tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key === 'orders') {
        loadOrders();
        updateDashboard();
        updateSalesData();
    }
});

// Poll API for changes every 5 seconds to keep in sync across browsers
setInterval(async () => {
    await loadProductsFromAPI();
    loadProducts();
    updateDashboard();
}, 5000);

// ===================================
// IMAGE UPLOAD HANDLER
// ===================================

function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande! Tamanho máximo: 2MB');
        event.target.value = '';
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        event.target.value = '';
        return;
    }
    
    // Read and convert to base64
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Store in hidden input
        document.getElementById('productImage').value = base64Image;
        
        // Show preview
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        previewImg.src = base64Image;
        preview.style.display = 'block';
    };
    
    reader.onerror = function() {
        alert('Erro ao carregar a imagem. Tente novamente.');
        event.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

function removeImage() {
    document.getElementById('productImageFile').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

// Handle secondary image upload
function handleSecondaryImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('A imagem é muito grande! Tamanho máximo: 2MB');
        event.target.value = '';
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        event.target.value = '';
        return;
    }
    
    // Read and convert to base64
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Store in hidden input
        document.getElementById('productImageSecondary').value = base64Image;
        
        // Show preview
        const preview = document.getElementById('imageSecondaryPreview');
        const previewImg = document.getElementById('previewImgSecondary');
        
        previewImg.src = base64Image;
        preview.style.display = 'block';
    };
    
    reader.onerror = function() {
        alert('Erro ao carregar a imagem. Tente novamente.');
        event.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

function removeSecondaryImage() {
    document.getElementById('productImageSecondaryFile').value = '';
    document.getElementById('productImageSecondary').value = '';
    document.getElementById('imageSecondaryPreview').style.display = 'none';
    document.getElementById('previewImgSecondary').src = '';
}

// Close modal when clicking outside
document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        closeProductModal();
    }
});

// Make functions global
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.logout = logout;
window.updateSalesData = updateSalesData;
window.updateSubcategoryOptions = updateSubcategoryOptions;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.handleSecondaryImageUpload = handleSecondaryImageUpload;
window.removeSecondaryImage = removeSecondaryImage;
