function carregarTabelaItens() {
  $.ajax({
    url: `${baseUrl}/item/listar`,
    method: "GET",
    success: function (response) {
      var esconderTabela = $("#tabelaItens");

      if (response.itens.length > 0) {
        esconderTabela.show();
        var tabela = $("#tabelaItens > tbody");
        tabela.empty();

        response.itens.forEach((item) => {
          let valor = item.valor;
          let valorReal = valor.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          });
          let visibilidade;
          if (item.status === true) {
            visibilidade = `<i class="bi bi-eye-fill" data-bs-toggle="tooltip" data-bs-placement="top" title="Visível"></i>`;
          } else {
            visibilidade = `<i class="bi bi-eye-slash" data-bs-toggle="tooltip" data-bs-placement="top" title="Oculto"></i>`;
          }
          tabela.append(`<tr>
                      <td class="align-middle"><img src="${baseUrl}/${item.imagem}" class="img-thumbnail" width="50px;"/></td>
                      <td class="align-middle" id="item-id">${item.id}</td>
                      <td class="align-middle"><a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.descricao}">${item.nome}</a></td>
                      <td class="align-middle">${item.quantidade}</td>
                      <td class="align-middle">${valorReal}</td>
                      <td class="align-middle">${item.peso}g</td>
                      <td class="align-middle text-center">${visibilidade}</td>
                      <td class="align-middle">
                          <button type="button" class="btn btn-info editar" data-id="${item.id}"><i class="fa fa-pencil-square-o" aria-hidden="true" data-bs-toggle="tooltip" data-bs-placement="top" title="Editar item"></i>
                          </button>
                          <button type="button" class="btn btn-danger excluir" data-id="${item.id}"><i class="fa fa-trash" aria-hidden="true" data-bs-toggle="tooltip" data-bs-placement="top" title="Remover item"></i>
                          </button>
                      </td>
                  </tr>`);
        });
      } else {
        esconderTabela.hide();
      }
    },
  });
}

var modalGestao = document.getElementById("modalGerenciador");

modalGestao.addEventListener("show.bs.modal", function (event) {
  carregarTabelaItens();
});

modalGestao.addEventListener("hidden.bs.modal", function (event) {
  document.getElementById("itemForm").reset();

  if ($("#adicionarItem").is(":hidden")) {
    $("#adicionarItem").show();
  }

  if ($("#controle-edicao").length) {
    $("#controle-edicao").remove();
  }
});

if (typeof baseUrl !== "undefined") {
  carregarTabelaItens(3);
} else {
  console.error(
    "A variável 'baseUrl' não está definida. Não é possível carregar a tabela de itens."
  );
}

function valorMonetarioParaFloat(valor) {
  var valorNumerico = valor.replace(/[^0-9,]/g, "");
  valorNumerico = valorNumerico.replace(",", ".");
  var valorFloat = parseFloat(valorNumerico) / 100;
  return valorFloat;
}

$("#adicionarItem").click(function () {
  var $botaoClicado = $(this);
  $botaoClicado.prop("disabled", true);

  var inputNome = $("#nome").val();
  var inputDescricao = $("#descricao").val();
  var inputQuantidade = $("#quantidade").val();
  var inputValor = $("#valor").val();
  var inputPeso = $("#valor").val();
  var selectStatus = $("#status").val();
  var inputImagem = document.getElementById("imagem");
  var imagem = inputImagem.files[0];

  console.log(inputValor);

  var valorFloat = valorMonetarioParaFloat(inputValor);
  console.log(valorFloat);

  var pesoFloat = parseFloat(inputPeso.replace(" g", "").replace(",", "."));

  var formData = new FormData();
  formData.append("nome", inputNome);
  formData.append("descricao", inputDescricao);
  formData.append("quantidade", inputQuantidade);
  formData.append("valor", valorFloat);
  formData.append("peso", pesoFloat);
  formData.append("status", selectStatus);
  formData.append("imagem", imagem);

  $.ajax({
    type: "POST",
    url: `${baseUrl}/item/cadastrar`,
    global: false,
    data: formData,
    contentType: false,
    processData: false,

    success: function (response) {
      console.log(response);
      exibirAlerta(
        "success",
        "Sucesso!",
        "O item foi adicionado ao catálogo.",
        3000
      );

      document.getElementById("itemForm").reset();
      carregarTabelaItens();
      montarTabelaItens();

      setTimeout(function () {
        $botaoClicado.prop("disabled", false);
      }, 3000);
    },
    error: function (xhr, error) {
      exibirAlerta("error", "Ops!", `${xhr.responseJSON.message}.`, 3000);
      $botaoClicado.prop("disabled", false);
    },
  });
});

function atualizarItem(formData) {
  $.ajax({
    url: `${baseUrl}/item/editar`,
    type: "PUT",
    global: false,
    dataType: "json",
    data: formData,
    contentType: false,
    processData: false,

    success: function (item) {
      carregarTabelaItens();
      montarTabelaItens();
      exibirAlerta(
        "success",
        "Sucesso!",
        "O item foi alterado com sucesso.",
        3000
      );
    },
    error: function (xhr, error) {
      exibirAlerta("error", "Ops!", `${error}.`, 3000);
    },
  });
}

$("#itemForm").on("click", "#editarItem", function () {
  var $botaoClicado = $(this);
  $botaoClicado.prop("disabled", true);

  var item_id = parseInt($("#itemId").val());
  var inputNome = $("#nome").val();
  var inputDescricao = $("#descricao").val();
  var inputQuantidade = parseInt($("#quantidade").val(), 10);
  var inputValor = $("#valor").val();
  var inputPeso = $("#peso").val();
  var selectStatus = $("#status").val();
  var inputImagem = document.getElementById("imagem"); // Obtenha o elemento do input file
  var imagem = inputImagem.files[0]; // Obtenha o primeiro arquivo selecionado (pode ser null se nenhum arquivo foi selecionado)

  var valorFloat = parseFloat(inputValor.replace(".", "").replace(",", "."));
  var pesoFloat = parseFloat(inputPeso.replace(" g", "").replace(",", "."));

  var formData = new FormData();
  formData.append("item_id", item_id);
  formData.append("nome", inputNome);
  formData.append("descricao", inputDescricao);
  formData.append("quantidade", inputQuantidade);
  formData.append("valor", valorFloat);
  formData.append("peso", pesoFloat);
  formData.append("status", selectStatus);
  formData.append("imagem", imagem);

  // for (var pair of formData.entries()) {
  //   console.log(pair[0] + ": " + pair[1]);
  // }

  atualizarItem(formData);
});

$("#tabelaItens").on("click", ".editar", function () {
  const itemId = $(this).data("id");

  $.ajax({
    url: `${baseUrl}/item/buscar?id=${itemId}`,
    method: "GET",
    success: function (item) {
      formulario = $("#itemForm");
      botaoAdicionar = $("#adicionarItem");
      botaoAdicionar.hide();
      console.log(item);

      $("#itemId").val(item.id);
      $("#nome").val(item.nome);
      $("#descricao").val(item.descricao);
      $("#quantidade").val(item.quantidade);
      $("#valor").val(item.valor);
      $("#peso").val(item.peso);
      $("#status").val(`${item.status}`);

      // Verifica se os botões já existem antes de anexá-los
      if ($("#controle-edicao").length === 0) {
        formulario.append(`
          <div id="controle-edicao">
            <button type="submit" class="btn btn-primary" id="editarItem" data-id="${item.id}">Editar Item</button>
            <button type="button" class="btn btn-danger excluir" data-id="${item.id}">Excluir Item</button>
          </div>
        `);
      }
    },
    error: function (xhr, error) {
      console.error("Erro ao obter detalhes do item:", error);
    },
  });
});

$("#tabelaItens").on("click", ".excluir", function () {
  const itemId = $(this).data("id");

  Swal.fire({
    title: "Remover o item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, por favor!",
    confirmButtonColor: "#000",
    background: "#212529",
    color: "#fff",
    cancelButtonText: "Cancelar!",
  }).then((result) => {
    if (result.isConfirmed) {
      if ($("#controle-edicao").length) {
        $("#controle-edicao").remove();
        $("#adicionarItem").show();
      }
      $.ajax({
        url: `${baseUrl}/item/deletar?item_id=${itemId}`,
        method: "DELETE",
        success: function () {
          document.getElementById("itemForm").reset();
          carregarTabelaItens();
          montarTabelaItens();
          Swal.fire({
            title: "Removido!",
            text: "Item removido do pedido.",
            icon: "success",
            confirmButtonText: "Ok",
            color: "#fff",
            confirmButtonColor: "#000",
            background: "#212529",
            timer: 3000,
          });
        },
      });
    }
  });
});

$("#itemForm").on("click", ".excluir", function () {
  const itemId = $(this).data("id");
  const botaoAdicionar = $("#adicionarItem");
  const controleEdicao = $("#controle-edicao");

  Swal.fire({
    title: "Remover o item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, por favor!",
    confirmButtonColor: "#000",
    background: "#212529",
    color: "#fff",
    cancelButtonText: "Cancelar!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Use uma requisição AJAX para excluir o item no servidor
      $.ajax({
        url: `${baseUrl}/item/deletar?item_id=${itemId}`, // Use query string para enviar o item_id
        method: "DELETE",
        success: function () {
          carregarTabelaItens();
          montarTabelaItens();

          document.getElementById("itemForm").reset();

          console.log(`Tem botão? ${botaoAdicionar.length === 0}`);
          let statusDoBotao = botaoAdicionar.length === false;
          if (statusDoBotao === false) {
            console.log("cheguei aqui");
            botaoAdicionar.toggle();
            controleEdicao.toggle();
          }
          Swal.fire({
            title: "Removido!",
            text: "Item removido do pedido.",
            icon: "success",
            confirmButtonText: "Ok",
            color: "#fff",
            confirmButtonColor: "#000",
            background: "#212529",
            timer: 3000,
          });
        },
      });
    }
  });
});
// Input de máscara
$(document).ready(function () {
  $(".mask-monetario").inputmask({
    alias: "numeric",
    groupSeparator: "",
    radixPoint: ",",
    autoGroup: true,
    digits: 2,
    digitsOptional: false,
    placeholder: "0",
    rightAlign: false,
    numericInput: true,
  });
  $(".mask-peso").inputmask({
    mask: "9{1,6} g",
    placeholder: "",
    numericInput: true,
    rightAlign: false,
    onBeforePaste: function (pastedValue, opts) {
      // Remove caracteres não numéricos
      var cleanedValue = pastedValue.replace(/[^0-9]/g, "");
      return cleanedValue + " g";
    },
  });
});
