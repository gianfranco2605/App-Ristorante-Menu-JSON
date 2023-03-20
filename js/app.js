let cliente = {
    tavolo: '',
    ora: '',
    ordine: []
}

const categorias = {
    1: 'Piatti Principali',
    2: 'Bebite',
    3: 'Dolci'
}


const btnSalvareCliente = document.querySelector('#guardar-cliente');

btnSalvareCliente.addEventListener('click', salvareCliente);

function salvareCliente() {
 const tavolo = document.querySelector('#mesa').value;
 const ora = document.querySelector('#hora').value;

    // CONTROLLARE CI SONO CAMPI VUOTI

    const campiVuoti = [mesa, tavolo].some( campo => campo === '');

    if(campiVuoti) {
        // CONTROLLARE SE CI SONO ALERT
        const essisteAlerta = document.querySelector('.invalid-feedback');

        if(!essisteAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center', 'bg-light');
            alerta.textContent = 'Tutti i campi sono obligatori'
            document.querySelector('.modal-body form').appendChild(alerta);

            // ELIMINA ALERTA

            setTimeout(() => {
                alerta.remove();
            },3000);
        }

        return;

    }

//    ASEGNA DATI FORMULARIO AL CLIENTE
    cliente = {...cliente, tavolo, ora};

    // console.log(cliente);

    // NASCODERE MODAL

    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    // VEDERE SEZIONI
    seeSection();

    // TAKE ORDER FUNCTION

    takeMenu();

}

function seeSection() {
    const hideSections = document.querySelectorAll('.d-none');
    hideSections.forEach(section => section.classList.remove('d-none'));
}

function takeMenu() {

    const url = "http://localhost:4000/platillos";

    fetch(url)
        .then( answer => answer.json())
        .then( result => showOrder(result))
        .catch( error => console.log(error))

}

function showOrder(platillos) {
    console.log(platillos);

    const content = document.querySelector('#platillos .contenido');


     platillos.forEach( platillo => {
        const row  = document.createElement('DIV');
        row.classList.add('row');


        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4')
        nombre.textContent = platillo.nome;

        const prezzo = document.createElement('DIV');
        prezzo.classList.add('col-md-3', 'fw-bold');
        prezzo.textContent = `$${platillo.prezzo}`

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria]

        const inputQuantita = document.createElement('INPUT');
        inputQuantita.type = 'number';
        inputQuantita.min = 0;
        inputQuantita.value = 0;
        inputQuantita.id = `product-${platillo.id}`
        inputQuantita.classList.add('form-control');

        // FUNCTION TO CATCH QUANTITI AND THE DISH

        inputQuantita.onchange = function() {
            const quantita = parseInt(inputQuantita.value);

            aggiungiPiatto({...platillo, quantita})
        }

        const aggiungere = document.createElement('DIV');
        aggiungere.classList.add('col-md-2');
        aggiungere.appendChild(inputQuantita);

        row.appendChild(nombre);
        row.appendChild(prezzo);
        row.appendChild(categoria);
        row.appendChild(aggiungere);


        content.appendChild(row);

        

     })
}

function aggiungiPiatto(product) {
    // DESTRUCTORING
    let { ordine } = cliente;
    // CHECK QUANTITI IS MORE THAN ZERO
    if(product.quantita > 0) {

        if(ordine.some( article => article.id === product.id)) {

            // IF ARTICLE EXIST UPDATE QUANTITI
            const ordineUpdate = ordine.map( article => {
                if( article.id === product.id) {
                    article.quantita = product.quantita;
                }

                return article;
            });

            //new array order
            cliente.ordine = [...ordineUpdate];

        }else {
            // if article does not exist , put it in the ordine array
            cliente.ordine = [...ordine, product];
        }

    }else {
        // ELIMINATE ELEMENTS WHEN QUANTITI IS EQUAL TO ZERO
        const result = ordine.filter(article => article.id !== product.id)

        cliente.ordine = [...result]


    }
    // CLEAN PREVIEW HTML

    limpiaHtml();

    if(cliente.ordine.length) {
        //Mostra il resumen
        updateOrder();
      
    }else {
        mesaggioOrdineVuoto()
    }
  
}

function updateOrder() {
    const content = document.querySelector('#resumen .contenido');

    const order = document.createElement('DIV');
    order.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    // INFORMAZIONE TAVOLO
    const tavolo = document.createElement('P');
    tavolo.textContent = 'Tavolo: ';
    tavolo.classList.add('fw-bold');

    const tavoloSpan = document.createElement('SPAN');
    tavoloSpan.textContent = cliente.tavolo;
    tavoloSpan.classList.add('fw-normal');
   


    // INFORMAZIONE ORA
    const ora = document.createElement('P');
    ora.textContent = 'Ora: ';
    ora.classList.add('fw-bold');

    const oraSpan = document.createElement('SPAN');
    oraSpan.textContent = cliente.ora;
    oraSpan.classList.add('fw-normal');

    // AGGIUNGENDO ELEMENTI PADRE
    tavolo.appendChild(tavoloSpan);
    ora.appendChild(oraSpan);

    // AGGIUNGERE TITLE SECTION

    const heading = document.createElement('H3');
    heading.textContent = 'Piatti Consumati'
    heading.classList.add('my-4', 'text-center');

    // PERCORRERE ARRAY DI ORDINI 

    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { ordine } = cliente;

    ordine.forEach( article => {
        const {nome, quantita, prezzo, id} = article;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nomeEl = document.createElement('H4');
        nomeEl.classList.add('my-4');
        nomeEl.textContent = nome;

        // QUANTITA PRODOTTO
        const quantitaEl = document.createElement('P');
        quantitaEl.classList.add('fw-bold');
        quantitaEl.textContent = 'Quantita';

        const quantitaValore = document.createElement('SPAN');
        quantitaEl.classList.add('fw-normal');
        quantitaValore.textContent = quantita;

        // PREZZO ARTICOLO
        const prezzoEl = document.createElement('P');
        prezzoEl.classList.add('fw-bold');
        prezzoEl.textContent = 'Prezzo: ';

        const prezzoValore = document.createElement('SPAN');
        prezzoValore.classList.add('fw-normal');
        prezzoValore.textContent = `$${prezzo}`;

        // SUBTOTAL ORDINE
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValore = document.createElement('SPAN');
        subtotalValore.classList.add('fw-normal');
        subtotalValore.textContent = calcolareSubtotal(prezzo, quantita);
 
        // BOTTN TO CANCEL ORDER
        const btnCancellare = document.createElement('BUTTON');
        btnCancellare.classList.add('btn', 'btn-danger');
        btnCancellare.textContent = 'Cancella';

        // FUNCTION BTN CANCEL
        btnCancellare.onclick = function() {    
            cancellareProdotto(id)
        }

        // AGGIUNGERE VALORI AI CONTENITORI 
        quantitaEl.appendChild(quantitaValore);
        prezzoEl.appendChild(prezzoValore);
        subtotalEl.appendChild(subtotalValore);
       


        // AGGIUNGERE ELEMENTI AL LI
        lista.appendChild(nomeEl);
        lista.appendChild(quantitaEl);
        lista.appendChild(prezzoEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnCancellare);


        // AGGIUNGERE LISTA A GRUPO PRINCIPALE
        grupo.appendChild(lista)
    })


    // AGGIUNGERE AL CONTENT
    order.appendChild(heading);
    order.appendChild(tavolo);
    order.appendChild(ora); 
    order.appendChild(grupo);
    content.appendChild(order);

    formularioMance();
}

function limpiaHtml() {
    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild)
    }
}

function calcolareSubtotal(prezzo, quantita) {
        return `$ ${prezzo * quantita}`;
}

function cancellareProdotto(id) {
    const { ordine } = cliente;
    const result = ordine.filter(article => article.id !== id)
    cliente.ordine = [...result]

    limpiaHtml();
    
    
    if(cliente.ordine.length) {
        //Mostra il resumen
        updateOrder();
      
    }else {
        mesaggioOrdineVuoto()
    }
    // Prodotto eliminato = formulario uguale a 0
    const productCancel = `#product-${id}`;
    const inputCancel = document.querySelector(productCancel);
    inputCancel.value = 0;

}

function mesaggioOrdineVuoto() {
    const content = document.querySelector('#resumen .contenido');

    const text = document.createElement('P');
    text.classList.add('text-center');
    text.textContent = "Aggiunge prodotti all'ordine";

    content.appendChild(text);
}

function formularioMance() {
    
    const content = document.querySelector("#resumen .contenido");

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Mancia';

    // RADIO BUTTOM 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'mancia';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcolareMancia;
    
    // Mancia 10%
    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    // Mancia 25%

    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'mancia';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcolareMancia;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    // mancia 50%

    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'mancia';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcolareMancia;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    // aggiungi al div principale
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    formulario.appendChild(divFormulario);

    // aggiunge al formulario
    content.appendChild(formulario);

}

function calcolareMancia() {
    const { ordine } = cliente;
    let subTotal = 0;

    // Calcolare subtotal
    ordine.forEach( article => {
        subTotal += article.quantita * article.prezzo;
    });

    // Selezzionare radio button mancia
    const manciaSelect = document.querySelector('[name="mancia"]:checked').value;

    // Calcolare Mancia
    const mancia = ((subTotal *parseInt(manciaSelect)) / 100);

    const total = subTotal + mancia;


    console.log(total);

    showTotalHTML(subTotal, total, mancia);
}


function showTotalHTML(subTotal, total, mancia) {
    console.log(subTotal);

    const divTotal = document.createElement('DIV');
    divTotal.classList.add('totale-pagare');

    // Subtotal
    const subTotalPar = document.createElement('P');
    subTotalPar.classList.add('fs-3', 'fw-bold', 'mt-2');
    subTotalPar.textContent = 'Subtotal Consumo: ';

    const subTotalSpan = document.createElement('SPAN');
    subTotalSpan.classList.add('fw-normal');
    subTotalSpan.textContent = `$${subTotal}`;

    subTotalPar.appendChild(subTotalSpan);

    //Mancia
    const manciaPar = document.createElement('P');
    manciaPar.classList.add('fs-3', 'fw-bold', 'mt-2');
    manciaPar.textContent = 'Mancia: ';

    const manciaSpan = document.createElement('SPAN');
    manciaSpan.classList.add('fw-normal');
    manciaSpan.textContent = `$${mancia}`;

    manciaPar.appendChild(manciaSpan);

    //Totale
    const totalePar = document.createElement('P');
    totalePar.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalePar.textContent = 'Totale: ';

    const totaleSpan = document.createElement('SPAN');
    totaleSpan.classList.add('fw-normal');
    totaleSpan.textContent = `$${total}`;

    totalePar.appendChild(totaleSpan);

    // Cancellare ultimo risultato 
    const totalPagareDiv = document.querySelector('.totale-pagare')
    if(totalPagareDiv) {
        totalPagareDiv.remove()
    }

    divTotal.appendChild(subTotalPar);
    divTotal.appendChild(manciaPar);
    divTotal.appendChild(totalePar);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotal);


}


