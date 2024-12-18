let basePrice = 0;
let selectedFood = null;
let selectedRecheios = [];
let totalPrice = 0;



function selectFood(foodId, foodPrice) {
    selectedFood = foodId;
    basePrice = foodPrice;
    selectedRecheios = []; 
    updatePrice();
    loadFillings(foodId);
}


function loadFillings(foodId) {
    if (!foodId) return;

    fetch(`http://localhost:8080/food?id=${foodId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); 

            const fillingOptions = document.getElementById("filling-options");
            fillingOptions.innerHTML = ""; 

            
            if (Array.isArray(data.filing) && data.filing.length > 0) {
                data.filing.forEach(filing => {
                    const filingCheckbox = `
                        <label>
                            <input type="checkbox" value="${filing.name}" data-price="${filing.price}" onclick="toggleRecheio(this)">
                            ${filing.name} (R$ ${filing.price.toFixed(2)})
                        </label><br>
                    `;
                    fillingOptions.innerHTML += filingCheckbox;
                });
            } else {
                fillingOptions.innerHTML = "Nenhum recheio disponível.";
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os recheios:", error);
            alert("Erro ao carregar os recheios: " + error.message);
        });
}




function updatePrice() {
    totalPrice = basePrice + selectedRecheios.reduce((acc, recheio) => acc + recheio.price, 0);
    document.getElementById("total-price").textContent = `Preço Total: R$ ${totalPrice.toFixed(2)}`;
}


function toggleRecheio(checkbox) {
    const price = parseFloat(checkbox.getAttribute('data-price'));
    if (checkbox.checked) {
        selectedRecheios.push({ name: checkbox.value, price: price });
    } else {
        selectedRecheios = selectedRecheios.filter(recheio => recheio.name !== checkbox.value);
    }
    updatePrice();
}


function submitOrder() {
    const cpf = document.getElementById("cpf").value;
    if (!cpf || !selectedFood) {
        alert("Por favor, selecione a comida e informe o CPF.");
        return;
    }

    const description = selectedRecheios.map(recheio => recheio.name).join(", ");
    const orderData = {
        id_food: parseInt(selectedFood),
        cpf: cpf,
        description: description
    };

    fetch('http://localhost:8080/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.mensagem) {
                alert(data.mensagem);
            } else if (data.erro) {
                alert(data.erro);
            }
        })
        .catch(error => alert("Erro ao enviar o pedido: " + error.message));
}

function loadPurchaseHistory() {
    const cpf = document.getElementById("cpf").value; 
    if (!cpf) {
        alert("Por favor, informe o CPF para ver o histórico.");
        return;
    }

    
    fetch(`http://localhost:8080/history?cpf=${cpf}`)
        .then(response => response.json())
        .then(data => {
            const historyContainer = document.getElementById("popup");
            const historyContent = document.querySelector(".popup-content p");

            
            if (data.length === 0) {
                historyContent.innerHTML = "Sem compras registradas no momento.";
            } else {
                let historyHTML = "<ul>";
                data.forEach(item => {
                    
                    historyHTML += `
                        <li>
                            Pedido de comida ID: ${item.id_food} com recheios: ${item.description}.
                            Preço: R$ ${item.price.toFixed(2)}.
                            Data: ${item.sale_date}.
                        </li>
                    `;
                });
                historyHTML += "</ul>";
                historyContent.innerHTML = historyHTML;
            }
        })
        .catch(error => {
            console.error("Erro ao carregar o histórico de compras:", error);
            alert("Erro ao carregar o histórico de compras.");
        });
}




function togglePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
}


window.onload = () => {
    
};