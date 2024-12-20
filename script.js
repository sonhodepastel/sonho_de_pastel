let cart = [];
let total = 0;

function addToCart(item, price) {
    cart.push({ item, price });
    total += price;
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(cartItem => {
        const li = document.createElement('li');
        li.textContent = `${cartItem.item} - R$ ${cartItem.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });
    document.getElementById('total').textContent = total.toFixed(2);
}

function sendOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').value;
    const troco = document.getElementById('troco').value;

    let orderMessage = `*Pedido de Cliente*\n\n`;
    orderMessage += `*Itens do Pedido:*\n`;
    cart.forEach(cartItem => {
        orderMessage += `- ${cartItem.item}: R$ ${cartItem.price.toFixed(2)}\n`;
    });
    orderMessage += `\n*Total:* R$ ${total.toFixed(2)}\n\n`;
    orderMessage += `*Dados do Cliente:*\n`;
    orderMessage += `Nome: ${name}\n`;
    orderMessage += `Endereço: ${address}\n`;
    orderMessage += `Telefone: ${phone}\n`;
    orderMessage += `Método de Pagamento: ${payment}\n`;
    if (payment === 'dinheiro' && troco) {
        orderMessage += `Precisa de troco para: R$ ${troco}\n`;
    }

    const whatsappUrl = `https://wa.me/5585994530854?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank');
}

function checkPaymentMethod() {
    const payment = document.getElementById('payment').value;
    if (payment === 'pix') {
        generatePixQRCode(total);
    }
}

function generatePixQRCode(amount) {
    const pixUrl = `https://link.gerarpix.com.br/p/pagamento-do-pedido-1c189faf?valor=${amount.toFixed(2)}`;
    fetch(pixUrl)
        .then(response => response.json())
        .then(data => {
            const qrCodeImg = document.getElementById('pix-qrcode');
            qrCodeImg.src = data.qrcode;
            document.getElementById('pix-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao gerar QR Code Pix:', error);
        });
}

function closeModal() {
    document.getElementById('pix-modal').style.display = 'none';
}

function copyPixKey() {
    const pixKey = '5585994530854';
    navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave Pix copiada!');
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar o ServiceWorker:', error);
            });
    });
}
