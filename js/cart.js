const getUserData = fetch(
  "https://japceibal.github.io/emercado-api/user_cart/25801.json"
)
  .then((response) => response.json())
  .then((response) => response);

let userData;
let precioDeEnvio = 0;
let precioTotal = 0;
let informacionDeEnvio = localStorage.getItem('envio')

function renderizarCarrito() {
  
  if (!userData) return;
  const { name, unitCost, count, currency, image } = userData.articles[0];
  let valueInDollars = count * unitCost;
  valueInDollars =
    currency +
    valueInDollars.toLocaleString("en-US", { minimumFractionDigits: 2 });

  let htmlContentToAppend = `
  <form class="row g-3 needs-validation" novalidate action="#">
    <div class="scroller">
    <h4>Artículos a comprar</h4>
      <div class="container">
        <div class="row">
          <div class="col">
            
          </div>
          <div class="col">
            <p><b>Nombre</b></p>
          </div>
          <div class="col">
            <p><b>Costo</b></p>
          </div>
          <div class="col">
            <p><b>Cantidad</b></p>
          </div>
          <div class="col">
            <p><b>Subtotal</b></p>
          </div>
        </div>

        <hr/>

        <div class="row">
          <div class="col">
            <img src="${image}" width="100">
          </div>
          <div class="col">
            <p>${name}</p>
          </div>
          <div class="col">
            <p id="contenedorDePrecio">${unitCost}</p>
          </div>
          <div class="col">
            <input type="text" value="${count}" class="form-control" id="ammountValue" onkeyup="actualizarPrecio()">
          </div>
          <div class="col">
            <p><b>${valueInDollars}</b></p>
          </div>
        </div>
      </div>

      <hr/>
      <hr/>

      <h4>Tipo de envío</h4>
        <input type="radio" id="envioPremium" name="tipo_de_envio" value="envioPremium" onclick="localStorageData(), actualizarPrecioEnvio(), marcarEnvio()" required>
          <label for="envioPremium">Premium 2 a 5 días (15%)</label><br>
        <input type="radio" id="envioExpress" name="tipo_de_envio" value="envioExpress" onclick="localStorageData(), actualizarPrecioEnvio(), marcarEnvio()" required>
          <label for="envioExpress">Express 5 a 8 días (7%)</label><br>
        <input type="radio" id="envioStandard" name="tipo_de_envio" value="envioStandard" onclick="localStorageData(), actualizarPrecioEnvio(), marcarEnvio()" required>
          <label for="envioStandard">Standard 12 a 15 días (5%)</label>
      <br>
      <br>

      <h4>Dirección de envio</h4>
        <div class="row">
          <div class="col">
            <p>Calle</p>
          </div>
          <div class="col">
            <p>Número</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <input type="text" class="form-control" id="validationCustom01" required>
            <div class="invalid-feedback">Ingresa una calle</div>
          </div>
          <div class="col-3">
            <input type="text" class="form-control" id="validationCustom02" required>
              <div class="invalid-feedback">
                Ingresa una esquina
              </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Esquina</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label for="numero" class="form-label">Esquina</label>
            <input type="text" class="form-control" id="numero" required>
            <div class="invalid-feedback">
              Ingresa un número
            </div>
          </div>
        </div>

        <hr/>

      <h4>Costos</h4>
        <div class="row border">
          <div class="col">
            <p>Subtotal</p>
            <p><small>Costo unitario del producto por cantidad</small></p>
          </div>
          <div class="col">
            <p>${valueInDollars}</p>
          </div>
        </div>
        <div class="row border">
          <div class="col">
            <p>Costo de envio</p>
            <p><small>Según el tipo de envio</small></p>
          </div>
          <div class="col">
            <p id="valorDeEnvio">${precioDeEnvio}</p>
            </div>
        </div>
        <div class="row border">
          <div class="col">
             <p>Total ($)</p>
          </div>
          <div class="col">
            <p>${precioTotal}</p>
          </div>
        </div>
        <br>
      <hr/>

      <h4>Forma de Pago</h4>
        <p>No se ha seleccionado</p> 
        <button type="button" class="btn btn-link ps-0" data-bs-toggle="modal"
          data-bs-target="#modalTerminos">Seleccionar</button>
      </div>

      <button type="submit" class="btn btn-primary" id="finalizarCompra">Finalizar compra</button> 
      </form>
    
      `;

  document.getElementById("articulos").innerHTML = htmlContentToAppend;
}

const showUserData = async () => {
  userData = await getUserData;
  renderizarCarrito();
  actualizarPrecioEnvio();
  marcarEnvio();
};

showUserData();

function actualizarPrecio() {
  const currentValue = document.getElementById("ammountValue").value;
  userData.articles[0].count = currentValue;
  renderizarCarrito();
  actualizarPrecioEnvio();
  marcarEnvio();
  
  document.getElementById("ammountValue").focus();
  document.getElementById("ammountValue").setSelectionRange(currentValue.length, currentValue.length);
}

function actualizarPrecioEnvio() {
  const currentValue = userData.articles[0].unitCost
  const currentCount = userData.articles[0].count
  
  if (document.getElementById("envioPremium").checked == true) {
    precioDeEnvio = currentCount*0.15*currentValue
  } else if (document.getElementById("envioExpress").checked == true) {
    precioDeEnvio = currentCount*0.07*currentValue
  } else if (document.getElementById("envioStandard").checked == true) {
    precioDeEnvio = currentCount*0.05*currentValue
  } else {
    precioDeEnvio = 0
  }
  console.log(precioDeEnvio)
  precioTotal = precioDeEnvio + currentValue*currentCount
  renderizarCarrito();
  marcarEnvio();
}

function localStorageData() {
  const envioExpress = document.getElementById("envioExpress")
  const envioPremium = document.getElementById("envioPremium")
  const envioStandard = document.getElementById("envioStandard")

  if (envioExpress.checked) {
    localStorage.setItem('envio','express')
  } else if (envioPremium.checked) {
    localStorage.setItem('envio','premium')
  } else if (envioStandard.checked) {
    localStorage.setItem('envio','standard')
  }
}


function marcarEnvio() {
  if (informacionDeEnvio == 'premium') {
    document.getElementById("envioPremium").checked = true;
  } else if (informacionDeEnvio == 'express') {
    document.getElementById("envioExpress").checked = true;
  } else if (informacionDeEnvio == 'standard') {
    document.getElementById("envioStandard").checked = true;
  }
}

