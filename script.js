// script.js
let sacola = [];

document.addEventListener('DOMContentLoaded', () => {
    const visitorNumber = document.getElementById('visitor-number');
    const enviarPedidoButton = document.getElementById('enviar-pedido');
    const dadosClienteForm = document.getElementById('dados-cliente-form');
    const dadosEntrega = document.getElementById('dados-entrega');
    const formularioCliente = document.getElementById('formulario-cliente');
    const pagamentoSelect = document.getElementById('pagamento');
    const trocoDiv = document.getElementById('troco');
    const entregaRetiradaSelect = document.getElementById('entrega-retirada');

    // Simulação de contagem de visitantes
    setInterval(() => {
        visitorNumber.textContent = Math.floor(Math.random() * 100);
    }, 5000);

    enviarPedidoButton.addEventListener('click', () => {
        formularioCliente.style.display = 'block';
    });

    dadosClienteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nomeCliente = document.getElementById('nome').value;
        const telefoneCliente = document.getElementById('telefone').value;
        const enderecoCliente = document.getElementById('endereco').value;
        const complementoCliente = document.getElementById('complemento').value;
        const pagamento = pagamentoSelect.value;
        const troco = document.getElementById('troco-valor').value;
        const entregaRetirada = entregaRetiradaSelect.value;

        const pedido = `
            Nome: ${nomeCliente}
            Telefone: ${telefoneCliente}
            ${entregaRetirada === 'delivery' ? `Endereço: ${enderecoCliente}\nComplemento: ${complementoCliente}` : ''}
            Pagamento: ${pagamento}
            ${troco ? `Troco: ${troco}` : ''}
            Entrega/Retirada: ${entregaRetirada}
            Itens: ${sacola.join(', ')}
            Total: R$ ${calcularTotal().toFixed(2)}
        `;

        const whatsappUrl = `https://wa.me/5585994530854?text=${encodeURIComponent(pedido)}`;
        window.open(whatsappUrl, '_blank');
        sacola = [];
        atualizarSacola();
        formularioCliente.style.display = 'none';
    });

    pagamentoSelect.addEventListener('change', () => {
        if (pagamentoSelect.value === 'dinheiro') {
            trocoDiv.style.display = 'block';
        } else {
            trocoDiv.style.display = 'none';
        }
    });

    entregaRetiradaSelect.addEventListener('change', () => {
        if (entregaRetiradaSelect.value === 'delivery') {
            dadosEntrega.style.display = 'block';
        } else {
            dadosEntrega.style.display = 'none';
        }
    });
});

function adicionarPizza(sabor) {
    if (sacola.length < 2) {
        sacola.push(sabor);
        atualizarSacola();
    } else {
        alert('Você só pode adicionar até dois sabores de pizza.');
    }
}

function removerItem(index) {
    sacola.splice(index, 1);
    atualizarSacola();
}

function atualizarSacola() {
    const itensSacola = document.getElementById('itens-sacola');
    itensSacola.innerHTML = '';
    sacola.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        const button = document.createElement('button');
        button.textContent = 'Remover';
        button.onclick = () => removerItem(index);
        li.appendChild(button);
        itensSacola.appendChild(li);
    });
    document.getElementById('total-pedido').textContent = calcularTotal().toFixed(2);
}

function calcularTotal() {
    // Simulação de preços
    const precos = {
        'Pizza Mussarela': 25.00,
        'Pizza Calabresa': 27.00,
        'Pizza Marguerita': 30.00,
        'Pizza Portuguesa': 32.00,
        'Calzone Frango': 20.00,
        'Calzone Misto': 22.00,
        'Esfiha de Carne': 5.00,
        'Esfiha de Frango': 5.00,
        'Guaraná 1L': 5.00,
        'Coca Cola 2L': 7.00
    };

    let total = 0;
    if (sacola.length === 1) {
        total = precos[sacola[0]] || 0;
    } else if (sacola.length === 2) {
        total = (precos[sacola[0]] || 0) / 2 + (precos[sacola[1]] || 0) / 2;
    }
    return total;
}
