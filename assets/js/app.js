const protocol = window.location.protocol;
const host = window.location.host;
const prefix = protocol + "//" + host.split(":")[0];
const baseUrl = `${prefix}:5000`;

const montarCarousel = (itens) => {
  const numItensPorSlide = 4; // Define o número de itens por slide

  const numSlides = Math.ceil(itens.length / numItensPorSlide); // Calcula o número de slides necessários

  var vitrine = $(".vitrine");
  vitrine.empty();

  for (let i = 0; i < numSlides; i++) {
    // Crie um novo slide para cada grupo de itens
    const startIndex = i * numItensPorSlide;
    const endIndex = startIndex + numItensPorSlide;
    const slideItens = itens.slice(startIndex, endIndex);

    const slide = $("<div>").addClass("carousel-item").appendTo(vitrine);

    if (i === 0) {
      slide.addClass("active"); // Marque o primeiro slide como ativo
    }

    const row = $("<div>").addClass("row").appendTo(slide);

    slideItens.forEach((item) => {
      // Adicione os itens ao slide
      let valor_unidade = String(item.valor);
      let handleValor = valor_unidade.split(".");

      const col = $("<div>").addClass("col-sm-3").appendTo(row);

      col.append(`
        <!-- Conteúdo do Item -->
        <div class="card item-comida col-sm-12">
          <div class="card-body">
            <img src="${baseUrl}${
        item.imagem
      }" class="mx-auto d-block img-fluid mb-3">
            <h2 class="card-title nome-item">${item.nome}</h2>
            <p class="card-text">
                <span id="descricao">${item.descricao}</span>
            </p>
            <div class="oferta clearfix">
                <span class="valor">
                    <span class="valor-real">${handleValor[0]}</span>
                    <span class="centavos">${handleValor[1]}</span>
                    <span class="unidade">/unid.</span>
                </span>
            </div>
            <div class="col-8 text-center" id="detalhesItem">
              <div class="quantidade ">
                <div class="input-group inline-group">
                  <div class="input-group-prepend">
                    <button class="btn btn-minus ${
                      item.quantidade == 1 ? "disabled" : ""
                    }" ${item.quantidade == 1 ? "disabled" : ""}>
                      <i class="fa fa-minus"></i>
                    </button>
                  </div>
                  <input class="form-control ${
                    item.quantidade == 1 ? "disabled" : ""
                  }" min="0" max="${
        item.quantidade
      }" name="quantity" value="1" type="number" ${
        item.quantidade == 1 ? "disabled" : ""
      }>
                  <div class="input-group-append">
                    <button class="btn btn-plus ${
                      item.quantidade == 1 ? "disabled" : ""
                    }" ${item.quantidade == 1 ? "disabled" : ""}>
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="d-grid gap-2">
                <button class="btn btn-outline-light mt-2 adicionarItem" type="button" data-id="${
                  item.id
                }">
                  Adicionar item
                </button>
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }

  // Inicialize o carousel
  $("#itemCarousel").carousel();
};

const montarTabelaItens = () => {
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:5000/item/catalogo",
    success: function (response) {
      montarCarousel(response.itens); // Chame a função montarCarousel com os itens retornados da API
    },
    error: function (xhr, error) {
      var vitrine = $(".vitrine");
      vitrine.append(
        `<p class="col text-center">${xhr.responseJSON.message}</p>`
      );
    },
  });
};

$(document).on("click", ".adicionarItem", function () {
  const item_id = $(this).data("id");
  const quantidade = parseInt(
    $(this) // Referência ao botão clicado
      .closest(".col-sm-3") // Encontre o contêiner do item
      .find("input[name='quantity']") // Encontre o input de quantidade
      .val() // Obtenha o valor do input
  );

  const itemData = {
    item_id: item_id,
    quantidade: quantidade,
  };

  // var $botaoClicado = $(this);
  // $botaoClicado.prop("disabled", true);

  $.ajax({
    type: "POST",
    url: `${baseUrl}/carrinho/adicionar`,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(itemData), // Envie os dados como JSON
    success: function (response) {
      exibirAlerta(
        "success",
        "Sucesso!",
        "O item foi adicionado na lista de compra.",
        3000
      );
      montarTabelaItens();
      atualizarCarrinho();
    },
    error: function (xhr, error) {
      exibirAlerta("error", "Ops!", `${xhr.responseJSON.message}.`, 3000);
    },
  });
});

function atualizarCarrinho() {
  $.ajax({
    type: "GET",
    url: `${baseUrl}/carrinho/listar`,
    dataType: "JSON",
    success: function (response) {
      const listaItensCarrinho = $("#tabela-pedidos #lista-itens-carrinho");
      const lista = $(".lista");
      listaItensCarrinho.empty();
      let subTotal = 0;
      let frete = 9.99;

      if (lista.find("p").length === 0 && response.length === 0) {
        lista.append("<p>O carrinho está vazio.</p>");
      }

      if (response.length > 0) {
        lista.find("p").remove();
      }

      response.forEach((item) => {
        let valor = item.valor;
        let mathTotal = item.valor * item.quantidade;
        subTotal += mathTotal;
        let valorReal = valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
        let valorTotal = mathTotal.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });

        listaItensCarrinho.append(
          `<tr>
            <td>${item.nome}</td>
            <td>x${item.quantidade}</td>
            <td>${valorReal}</td>
            <td>${valorTotal}</td>
          </tr>`
        );
      });
      $(".valor-unitario").text(
        subTotal.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
      );
      $(".valor-frete").text(
        frete.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
      );
      let total = subTotal + frete;
      $(".valor-total").text(
        total.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })
      );
    },
    error: function (xhr, error) {
      console.error("Erro ao listar itens do carrinho: " + error);
    },
  });
}

// Chame a função atualizarCarrinho para calcular o sub-total, o frete e o total
atualizarCarrinho();
$(document).ready(function () {
  atualizarCarrinho();
  montarTabelaItens();

  var $loading = $("#containerLoading").hide();
  $(document)
    .ajaxStart(function () {
      $loading.show();
    })
    .ajaxStop(function () {
      $loading.hide();
    });
});

$(document).on("click", ".btn-plus, .btn-minus", function (e) {
  const isNegative = $(e.target).closest(".btn-minus").is(".btn-minus");
  const input = $(e.target).closest(".input-group").find("input");
  if (input.is("input")) {
    input[0][isNegative ? "stepDown" : "stepUp"]();
  }
});

function exibirAlerta(status, titulo, texto, tempo) {
  Swal.fire({
    position: "center",
    title: titulo,
    text: texto,
    icon: status,
    color: "#fff",
    showConfirmButton: false,
    background: "#212529",
    timer: tempo,
  });
}
// Função para habilitar/desabilitar o botão "Finalizar a compra"
function habilitarBotaoFinalizar(valido) {
  const botaoFinalizar = $("#finalizar-compra");
  botaoFinalizar.prop("disabled", !valido);
}

$(document).ready(function () {
  // Evento de clique no botão "Finalizar a compra"
  $("#finalizar-compra").click(function (e) {
    e.preventDefault();
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
      exibirAlerta(
        "error",
        "Erro",
        "Por favor, complete a verificação do reCAPTCHA.",
        3000
      );
      return;
    }

    $.ajax({
      type: "POST",
      url: `${baseUrl}/carrinho/validacao`,
      data: { recaptchaResponse: recaptchaResponse },
      dataType: "json",
      success: function (data) {
        if (data.success) {
          exibirAlerta(
            "success",
            "Sucesso",
            "Formulário enviado com sucesso!",
            3000
          );
        } else {
          exibirAlerta(
            "error",
            "Erro",
            "Falha na verificação do reCAPTCHA.",
            3000
          );
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        exibirAlerta(
          "error",
          "Erro",
          `Erro ao verificar o reCAPTCHA:", ${errorThrown})`,
          3000
        );
        console.error("Erro ao verificar o reCAPTCHA:", errorThrown);
      },
    });
  });
});
