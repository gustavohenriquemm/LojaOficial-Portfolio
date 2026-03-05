// Script para gerar favicon com fundo rosa
(function() {
    // Criar canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Desenhar fundo rosa com bordas arredondadas
    ctx.fillStyle = '#FFB6C1'; // Rosa claro
    roundRect(ctx, 0, 0, 64, 64, 8);
    ctx.fill();
    
    // Carregar a logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Detectar se está na raiz ou em uma subpasta
    const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || !window.location.pathname.includes('/pages/');
    const logoPath = isRoot ? 'img/Logoroofc (1).png' : '../img/Logoroofc (1).png';
    
    img.onload = function() {
        // Calcular dimensões para centralizar e manter proporção
        const padding = 8;
        const maxWidth = 64 - (padding * 2);
        const maxHeight = 64 - (padding * 2);
        
        let width = img.width;
        let height = img.height;
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        
        width *= ratio;
        height *= ratio;
        
        const x = (64 - width) / 2;
        const y = (64 - height) / 2;
        
        // Desenhar a logo
        ctx.drawImage(img, x, y, width, height);
        
        // Converter canvas para data URL
        const faviconUrl = canvas.toDataURL('image/png');
        
        // Atualizar o favicon
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = faviconUrl;
    };
    
    img.onerror = function() {
        // Se falhar ao carregar a imagem, usar apenas o fundo rosa com iniciais
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PR', 32, 32);
        
        const faviconUrl = canvas.toDataURL('image/png');
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = faviconUrl;
    };
    
    img.src = logoPath;
    
    // Função auxiliar para desenhar retângulo com bordas arredondadas
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
})();
