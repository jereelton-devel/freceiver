/*
*
* NOVO MODELO SUBMODULO CARE
*
* Descrição: Este script faz parte do novo modelo de submodulo
* utilizando o framework da Care com recursos modernos
*
* Adaptado por: Jereelton TEIXEIRA
*
* Data: 01/12/2020
*
*/

//Tela Relatorio Operacional: 12/01/2021

/*
* VARIAVEIS
* Declaração de variaveis
*
* */

var x_tratativa_relatorio_operacional        = 'x-tratativa_relatorio_operacional.php';
var x_tratativa_relatorio_operacional_edicao = 'x-tratativa_relatorio_operacional_edicao.php';
var x_tratativa_relatorio_operacional_acao   = 'x-tratativa_relatorio_operacional_acao.php';
var x_request                                = 'x-request.php';
var x_navegador_usuario                      = '';

/*
* DOM READY
* Configurar as primeiras instruções a serem executadas quando o DOM estiver pronto
*
* */

$(document).ready(function() {

    //Chamada da API de log, usada apenas em dev
    //callDevLogger('[Start] Em Desenvovimento', 'tela_inclusao_nf1');

    //Usar essa chamada para carregar automaticamente os dados
    //loadGrid('');
    //ou usar essa chamada para carregar um formulario de pesquisa de dados
    loadForm();

    //Chamada da API de log, usada apenas em dev
    //callDevLogger('[End] Em Desenvovimento', 'tela_inclusao_nf1');

});

/*
* GENERICO
* Configurar aqui as funcões genericas do subomulo
*
* */

//Verifica qual browser o usuario esta usando
function identificarNavegador() {

    var nav = navigator.userAgent.toLowerCase();

    if(nav.indexOf("msie") != -1){

        x_navegador_usuario = "msie";

    } else if(nav.indexOf("opera") != -1){

        x_navegador_usuario = "opera";

    } else if(nav.indexOf("safari") != -1){

        x_navegador_usuario = "safari";

    } else if(nav.indexOf("netscape") != -1){

        x_navegador_usuario = "netscape";

    } else if(nav.indexOf("chrome") != -1){

        x_navegador_usuario = "chrome";

    }  else if(nav.indexOf("mozilla") != -1){

        if(nav.indexOf("firefox") != -1){

            x_navegador_usuario = "firefox";

        } else if(nav.indexOf("chrome") != -1){

            x_navegador_usuario = "chrome";

        }

    } else {
        console.info("Atenção: Seu Navegador não foi reconhecido...");
    }
}

//Date Picker
function carregarDatepicker(){
    $(".mascara_ddmmyyyy").datepicker({ dateFormat: 'dd/mm/yy' });
    $(".mascara_ddmmyyyy").datepicker("option",$.datepicker.regional['1']);
}

//Posiciona o rodape de acordo com o tamanho do conteudo
function clearFooter() {

    if($("#pageContent").height() >= 550) {
        $("footer").css("position", "relative");
    } else {
        $("footer").css("position", "fixed").css("z-index", "1").css("left", "0px").css("bottom", "0px");
    }

    return false;
}

//Função para contar itens escolhidos na tela
function contaSetado(){

    var lista_os = "";
    var num = 0;
    $('.lista_os').each(function(){
        if($(this).is(':checked')){
            if (lista_os != '')	lista_os += ',';
            lista_os += $(this).val();
            num++;
        }
    });

    if(num > 1) {
        alertify.alert("Aviso", "Escolha apenas 1 pedido por vez.<br />Caso precise, use a tela de Upload para atualizar mais de 1 pedido");
        $(".lista_os").prop("checked", false);
    }

}

//Função padrão do sistema
function setaTodos(flag){
    $(".lista_os").prop("checked", flag);
}

function _errorAlertify(msg_error) {

    // Extend existing 'alert' dialog
    if(!alertify.errorAlert){
        //define a new errorAlert base on alert
        alertify.dialog('errorAlert',function factory(){
            return{
                build:function(){
                    var errorHeader = '<span class="fa fa-times-circle fa-2x" '
                        +    'style="vertical-align:middle;color:#e10000;">'
                        + '</span> Application Error';
                    this.setHeader(errorHeader);
                }
            };
        },true,'alert');
    }
    //launch it.
    // since this was transient, we can launch another instance at the same time.
    alertify.errorAlert(msg_error);

}

function dialogLog(pedido_id_ws){

    $.Dialog({
        'title'      : "Histórico de Alterações",
        'content'    : getLog(pedido_id_ws),
        'draggable'  : true,
        'keepOpened' : true,
        'closeButton': true,
        'position'   : {
            'offsetY' : 5,
            'offsetX' : 5
        },
        'buttonsAlign': 'right',
        'buttons'    : {
            ''	: {
                'action': function() {}
            }
        }
    });
}

function getLog(pedido_id_ws){

    $.ajax({
        type: "POST",
        data: {acao:'log_processo',pedido_id_ws:pedido_id_ws},
        async: false,
        url: x_tratativa_relatorio_operacional_edicao,
        success: function(data) {
            comentario = data;
        }
    });
    return comentario;
}

function iniTransicaoAjax() {
    $('body').addClass("loading");
    $("div.page").fadeOut('slow', 'linear');
    $("footer").hide();
}

function fimTransicaoAjax(_data, _callback) {

    setTimeout(function(){

        $("div.page").fadeIn('slow', 'linear');
        $("footer").show();
        $("div.page").html(_data);
        clearFooter();

        if(typeof _callback === "function") {
            _callback();
            $('body').removeClass("loading");
        }

    }, 600);

}

function fimTransicaoAjaxPageAdd(_data, _callback) {

    setTimeout(function(){

        $("div.page_add").show('fade');
        $("footer").show();
        $("div.page_add").html(_data);
        clearFooter();

        if(typeof _callback === "function") {
            _callback();
            $('body').removeClass("loading");
        }

    }, 600);

}

/*
* LOAD, RELOAD E PAGINAÇÃO
* Configurar aqui as funções de carregamento de tela e paginação
*
* */

function criaPaginacao(pag_total, pag_current) {

    var page = $(".pageDiv").pagelist();
    page.total = pag_total;
    page.current = pag_current;

    //console.log(page.total, page.current, page);

    var pag = "{page}";

    page.execCallback = loadGrid;
    page.paramCallback = pag;

    page.ajax = ".page";
    page.create();

}

//Função para recarregar a tela sem fazer refresh na página
function recarregarTela(param) {

    if(param === "zerar_filtros") {

        $("#grid_busca").val('');
        $("#filtro_hidden_1").val('');//Cliente Negocio
        $("#filtro_hidden_2").val('');//Status do Pedido
        $("#filtro_hidden_3").val('');//Pedido/CPF/CNPJ
        $("#filtro_hidden_4").val('');//Data Inicial
        $("#filtro_hidden_5").val('');//Data Final
        $("#filtro_hidden_6").val('');//SLA Fabrica
        $("#filtro_hidden_7").val('');//SLA Rota

    }

    loadGrid('1');

}

//Função que carrega o conteudo inicial na grid
function loadGrid(param){

    identificarNavegador();

    if(x_navegador_usuario != "chrome") {
        iniTransicaoAjax();
    }

    if(param == '') {
        param = {'acao':'grid'};
    } else {
        //Atualiza o indice da paginacao antes de executar a requisicao
        //de paginacao para poder enviar o valor correto da pagina atual
        $("#page").val(param);
        $("#grid_busca").val($("#input_grid_busca").val());
        param = $("#frm_grid_hidden").serialize();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        /*data: $("#frm_grid_hidden").serialize(),*/
        data: param,
        async: true,
        beforeSend: function(data) {

            console.log("Ajax-beforeSend");
            if(x_navegador_usuario == "chrome") {
                iniTransicaoAjax();
            }
        },
        success: function(data) {

            console.log("Ajax-success");
            fimTransicaoAjax(data, function() {

                $("#pagina_total").val($("#page_total").val());
                $("#page").val($("#page_current").val());
                $("#filtro_sql").val($("#sql_save").val());

                criaPaginacao($("#pagina_total").val(), $("#page").val());
            });
        },
        complete: function(data) {
            console.log("Ajax-complete");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

//Função para iniciar o carregamento de dados na tela atraves do filtro
function loadByFilter() {

    if(validarPesquisaInicial()) {

        $("#filtro_hidden_1").val($("#filtro_1").val());//Cliente Negocio
        $("#filtro_hidden_2").val($("#filtro_2").val());//Status do Pedido
        $("#filtro_hidden_3").val($("#filtro_3").val());//Pedido/CPF/CNPJ
        $("#filtro_hidden_4").val($("#filtro_4").val());//Data Inicial
        $("#filtro_hidden_5").val($("#filtro_5").val());//Data Final
        $("#filtro_hidden_6").val($("#filtro_6").val());//SLA Fabrica
        $("#filtro_hidden_7").val($("#filtro_7").val());//SLA Rota

        loadGrid('1');

    }

}

//Função que carrega o conteudo inicial na grid
function loadForm(){

    identificarNavegador();

    if(x_navegador_usuario != "chrome") {
        iniTransicaoAjax();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {acao:'carregar_filtro'},
        async: false,
        beforeSend: function(data) {

            console.log("Ajax-beforeSend");
            if(x_navegador_usuario == "chrome") {
                iniTransicaoAjax();
            }
        },
        success: function(data) {

            fimTransicaoAjax(data, function() {

                //Zerando os filtros
                $("#filtro_1").val('').select(0);//Cliente Negocio
                $("#filtro_2").val('').select(0);//Status do Pedido
                $("#filtro_3").val('');//Pedido/CPF/CNPJ
                $("#filtro_4").val('');//Data Inicial
                $("#filtro_5").val('');//Data Final
                $("#filtro_6").val('').select(0);//SLA Fabrica
                $("#filtro_7").val('').select(0);//SLA Rota

                listaClienteNegocio();
                carregarDatepicker();

                $("#btn-filtro").click(function(e){
                    e.preventDefault();
                    loadByFilter();
                });
            });
        },
        complete: function(data) {
            console.log("Ajax-complete");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

/*
* VALIDACOES
* Configurar aqui as validacoes gerais do submodulo
*
* */

function validarPesquisaInicial(){

    if(
        $("#filtro_1").val() !== "" ||
        $("#filtro_2").val() !== "" ||
        $("#filtro_3").val() !== "" ||
        $("#filtro_4").val() !== "" ||
        $("#filtro_5").val() !== "" ||
        $("#filtro_6").val() !== "" ||
        $("#filtro_7").val()) {
        return true;
    }

    alertify.alert('Aviso', 'Informe pelo menos 1 filtro !');

    return false;

}

//Funções especificas do submodulo
function validarExtensaoArquivo(input_file, tipo_esperado) {

    var arquivo;
    var inputOrigin = 0;

    try {
        arquivo = input_file.val();
        inputOrigin = 1;
    } catch (e) {
        arquivo = input_file;
    }

    var ext = arquivo.split(".").pop();

    var regtest = new RegExp('('+tipo_esperado+')');

    if(ext.search(regtest) == -1) {
        alertify.alert('Aviso', 'Tipo de arquivo invalido !');
        if(inputOrigin == 1) {
            input_file.val('');
        }
        return false;
    }

    return true;
}

//Configurar aqui a validação de cadastro para novo Item
function validarCadastroNovoItem(){

    if(1 == 1) {
        return true;
    }

    return false;

}

function validaCadastroTratativa(){

    if($("#comentario_cadastrar_tratativa").val() == "" || ! $("#comentario_cadastrar_tratativa").val()) {

        alertify.alert('Aviso', "Informe uma tratativa para cadastrar !");
        return false;
    }

    return true;

}

function validaCadastroSlaFabrica(){

    if($("#sla_fabrica").val() == "" || !$("#sla_fabrica").val()) {

        alertify.alert('Aviso', "Informe um valor para o SLA !");
        return false;
    }

    if($("#sla_fabrica_data_ativacao").val() == "" || !$("#sla_fabrica_data_ativacao").val()) {
        return "alerta";
    }

    return true;

}

/*
* CRUD
* Configuar aqui as funções para manipular os itens: Listar/Inserir/Atualizar/Remover/Bloquear
*
* */

//Inserir
function cadastrarTratativa(id){

    var dataForm = new FormData();

    dataForm.append('acao', $("#acao_cadastrar_tratativa").val());
    dataForm.append('numero_pedido', $("#numero_pedido").val());
    dataForm.append('status_pedido', $("#status_pedido").val());
    dataForm.append('cliente_negocio', $("#cliente_negocio").val());
    dataForm.append('nome_comprador', $("#nome_comprador").val());
    dataForm.append('serial_number', $("#serial_number").val());
    dataForm.append('data_aprovacao', $("#data_aprovacao").val());
    dataForm.append('comentario_tratativa', $("#comentario_cadastrar_tratativa").val());

    $.ajax({
        url: x_tratativa_relatorio_operacional_acao,
        dataType: 'json',
        cache: false,
        data: dataForm,
        method: 'POST',
        async: false,
        processData: false,
        contentType: false,
        success: function (data) {

            var resp = JSON.parse(JSON.stringify(data));

            alertify.alert('Aviso', resp.message);

            if(resp.status == "ok") {
                //recarregarTela();
                $("div.page_add").fadeOut('fast', 'linear');
                $("div.page").fadeIn('slow', 'linear');
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });

}

//Inserir
function inserirSlaFabrica(tela){

    var dataForm = new FormData();

    dataForm.append('acao', $("#acao_inserir_sla_fabrica").val());
    dataForm.append('sla_fabrica', $("#sla_fabrica").val());
    dataForm.append('sla_fabrica_data_ativacao', $("#sla_fabrica_data_ativacao").val());
    dataForm.append('comentario', $("#sla_fabrica_comentario").val());

    $.ajax({
        url: x_tratativa_relatorio_operacional_acao,
        dataType: 'json',
        cache: false,
        data: dataForm,
        method: 'POST',
        async: false,
        processData: false,
        contentType: false,
        success: function (data) {

            var resp = JSON.parse(JSON.stringify(data));

            alertify.alert('Aviso', resp.message);

            if(resp.status == "ok") {

                if(tela == "carregar_filtro") {
                    loadForm();
                }

                if(tela == "recarregar_tela") {
                    recarregarTela();
                }

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });

}

//Listar (Comentarios)
function dialogVerComentarios(id){

    var coments = getComentarios(id);

    if(coments === false) {

        alertify.alert("Aviso", "Nada encontrado para esse pedido");
        return false;

    } else {

        $.Dialog({
            'title': 'Comentarios',
            'content': coments,
            'draggable': true,
            'keepOpened': true,
            'position': {
                'offsetY': 50,
                'offsetX': 50
            },
            'closeButton': true,
            'buttonsAlign': 'right',
            'buttons': {
                'OK': {
                    'action': function () {
                    }
                }
            }
        });
    }
}

function getComentarios(id){

    var comentarios = false;

    $.ajax({
        url: x_tratativa_relatorio_operacional_acao,
        dataType: 'json',
        cache: false,
        data: {acao: 'consulta_comentarios_tratativa', pedido: id},
        method: 'GET',
        async: false,
        success: function (data) {

            var resp = JSON.parse(data);

            if(resp.status == "ok" && resp.results.length > 0) {

                comentarios = "" +
                    "   <div>" +
                    "       <div style='overflow: auto; width:800px'>" +
                    "           <div class='rows'>" +
                    "               <table class='striped bordered hovered' style='text-align: center'>" +
                    "                   <thead>" +
                    "                       <tr>" +
                    "                           <th class='text-center' style='white-space: nowrap;'>Pedido</th>" +
                    "                           <th class='text-center' style='white-space: nowrap;'>Cliente Neg&oacute;cio &nbsp;</th>" +
                    "                           <th class='text-center' style='white-space: nowrap;'>Data</th>" +
                    "                           <th class='text-center' style='white-space: nowrap;'>Postado por</th>" +
                    "                           <th class='text-center' style='white-space: nowrap;'>Coment&aacute;rio</th>" +
                    "                           <th class='text-center' style='white-space: nowrap;'>Status</th>" +
                    "                       </tr>" +
                    "                   </thead>" +
                    "                   <tbody>";

                $.each(resp.results, function(i, obj){

                    comentarios += "" +
                        "<tr>" +
                        "   <td class='text-center' style='width: 112px; min-width: 112px; text-align: center; padding-left: 3px; padding-right: 3px;' nowrap=''>" +
                        "" + obj.numero_pedido +
                        "   </td>" +
                        "   <td class='text-center' style='width: 112px; min-width: 112px; text-align: center; padding-left: 3px; padding-right: 3px;' nowrap=''>" +
                        "" + obj.cliente_negocio +
                        "   </td>" +
                        "   <td class='text-center' style='width: 112px; min-width: 112px; text-align: center; padding-left: 3px; padding-right: 3px;' nowrap=''>" +
                        "" + obj.data_tratativa +
                        "   </td>" +
                        "   <td style='white-space: nowrap; padding-left: 3px; padding-right: 3px;'>" +
                        "" + obj.usuario +
                        "   </td>" +
                        "   <td style='white-space: nowrap; padding-left: 3px; padding-right: 3px;'>" +
                        "" + obj.comentario +
                        "   </td>" +
                        "   <td style='white-space: nowrap; padding-left: 3px; padding-right: 3px;'>" +
                        "" + obj.status_pedido +
                        "   </td>" +
                        "</tr>";
                });

                comentarios += "" +

                    "                   </tbody>" +
                    "               </table>" +
                    "           </div>" +
                    "       </div>" +
                    "   </div>";
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });

    return comentarios;
}

//Deletar
function removerItem(id, tela) {

    alertify.confirm('Mensagem', 'Deseja mesmo remover o item ?',
        function(){
            alertify.success('Confirmado');

            $.ajax({
                url: x_tratativa_relatorio_operacional_acao,
                dataType: 'json',
                cache: false,
                data: {acao: 'remover_item', id: id},
                method: 'POST',
                async: false,
                success: function (data) {

                    var resp = JSON.parse(JSON.stringify(data));

                    alertify.alert('Mensagem', resp.message);

                    listarHistoricoSlaFabricaTela(tela);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText, textStatus, errorThrown);
                    _errorAlertify(jqXHR.responseText);
                    $("div.page").fadeIn('slow', 'linear');
                }
            });
        },
        function(){
            alertify.error('Cancelado');
        });
}

/*
* TELAS
* Configurar aqui as funções para mostrar as telas do submodulo
*
* */

//Configurar aqui a tela para editar um item no sistema (pedidos, os, etc...)
function editarItemTela(item_id){

    //Permitir editar apenas 1 pedido por vez

    //Botao rotinas cabecalho
    if(item_id == 0) {
        item_id = "";
        $('.lista_os').each(function () {
            if ($(this).is(':checked')) {
                if (item_id != '') item_id += ',';
                item_id += $(this).val();
            }
        });
    }

    //Botao rotinas internas
    var indice_contador = item_id.split('_')[1];
    var numero_pedido = item_id.split('_')[0];
    var status_pedido = $("#status_" + item_id).val();
    var cliente_negocio = $("#cliente_negocio_" + item_id).val();
    var nome_comprador = $("#nome_comprador_" + item_id).val();
    var serial_number = $("#serial_number_" + item_id).val();
    var data_aprovacao = $("#data_aprovacao_" + item_id).val();

    if (numero_pedido == '' || !numero_pedido) {
        alertify.alert('Aviso', 'Selecione 1 pedido para editar');
        return false;
    }

    identificarNavegador();

    if(x_navegador_usuario != "chrome") {
        iniTransicaoAjax();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao: 'cadastrar_tratativa_tela',
            numero_pedido: numero_pedido,
            status_pedido: status_pedido,
            cliente_negocio: cliente_negocio,
            nome_comprador: nome_comprador,
            serial_number: serial_number,
            data_aprovacao: data_aprovacao,
            filtro_where:'',
            limit:'',
            tipo_consulta:'',
            getsql:'',
            sql:''
        },
        async: false,
        beforeSend: function(data) {

            console.log("Ajax-beforeSend");
            if(x_navegador_usuario == "chrome") {
                iniTransicaoAjax();
            }
        },
        success: function(data) {

            fimTransicaoAjaxPageAdd(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    //recarregarTela();
                    $("div.page_add").hide();
                    $("div.page").fadeIn('slow', 'linear');
                });

                $("#bt-submit-form-cadastrar-tratativa").on('click', function(){
                    if(validaCadastroTratativa() === true) {

                        alertify.confirm('Mensagem', 'Deseja mesmo cadastrar a tratativa ?',
                            function(){
                                alertify.success('Confirmado');
                                cadastrarTratativa(numero_pedido);
                            },
                            function(){
                                alertify.error('Cancelado');
                            });

                    }
                    return false;
                });

                $('#bt-reset-form-cadastrar-tratativa').on('click', function() {
                    $("#comentario_cadastrar_tratativa").val('');
                });

                $("div.page_add").show('fade');

            });
        },
        complete: function(data) {
            console.log("Ajax-complete");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _errorAlertify(error);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

function editarSlaFabricaTela(tela){

    identificarNavegador();

    if(x_navegador_usuario != "chrome") {
        iniTransicaoAjax();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'editar_sla_fabrica',
            filtro_where:'',
            limit:'',
            lista_os:'',
            status_atual:'',
            tipo_consulta:'',
            getsql:'',
            sql:'',
            request_number:''
        },
        async: false,
        beforeSend: function(data) {

            console.log("Ajax-beforeSend");
            if(x_navegador_usuario == "chrome") {
                iniTransicaoAjax();
            }
        },
        success: function(data) {

            fimTransicaoAjax(data, function() {

                //listaTransportadoras();

                $('[data-click-retorna-tela-principal]').on('click', function(){
                    if(tela == "carregar_filtro") {
                        loadForm();
                    }
                    if(tela == "recarregar_tela") {
                        recarregarTela();
                    }
                });

                $("#bt-submit-form-editar-sla-fabrica").on('click', function(){
                    valCadSla = validaCadastroSlaFabrica();
                    if(valCadSla === true || valCadSla === "alerta") {

                        if(valCadSla == "alerta") {

                            alertify.confirm('Aviso',
                                'Uma data para ativar o SLA foi omitida.<br />' +
                                'Isso fara com que o SLA informado seja ativado imediatamente.<br /><br />' +
                                'Deseja mesmo cadastrar o SLA ?',
                                function () {
                                    alertify.success('Confirmado');
                                    inserirSlaFabrica(tela);
                                },
                                function () {
                                    alertify.error('Cancelado');
                                });

                        } else {

                            alertify.confirm('Mensagem', 'Deseja mesmo cadastrar o SLA ?',
                                function () {
                                    alertify.success('Confirmado');
                                    inserirSlaFabrica(tela);
                                },
                                function () {
                                    alertify.error('Cancelado');
                                });
                        }
                    }
                    return false;
                });

                $('#bt-reset-form-editar-sla-fabrica').on('click', function() {
                    $('#sla_f').val('');
                });

                carregarDatepicker();
            });
        },
        complete: function(data) {
            console.log("Ajax-complete");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _errorAlertify(error);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

function uploadItemTela(tela){

    identificarNavegador();

    if(x_navegador_usuario != "chrome") {
        iniTransicaoAjax();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'upload',
            filtro_where:'',
            limit:'',
            lista_os:'',
            status_atual:'',
            tipo_consulta:'',
            getsql:'',
            sql:'',
            request_number:''
        },
        async: false,
        beforeSend: function(data) {

            console.log("Ajax-beforeSend");
            if(x_navegador_usuario == "chrome") {
                iniTransicaoAjax();
            }
        },
        success: function(data) {

            fimTransicaoAjax(data, function() {
                ativarUpload(tela);

                $('[data-click-retorna-tela-principal]').on('click', function(){
                    if(tela == "carregar_filtro") {
                        loadForm();
                    }
                    if(tela == "recarregar_tela") {
                        recarregarTela();
                    }
                });

                $('#bt-reset-form-upload-item').on('click', function() {
                    $('#out').html('');
                    $('#xls').val('');
                    $("#xlfile").show('fast');
                });

                ativarXlsImport();
            });
        },
        complete: function(data) {
            console.log("Ajax-complete");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _errorAlertify(error);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

function listarHistoricoSlaFabricaTela(tela) {

    identificarNavegador();

    if(x_navegador_usuario != "chrome") {
        iniTransicaoAjax();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {acao: "listar_historico_sla_fabrica", tela: tela},
        async: false,
        beforeSend: function(data) {

            console.log("Ajax-beforeSend");
            if(x_navegador_usuario == "chrome") {
                iniTransicaoAjax();
            }
        },
        success: function(data) {

            fimTransicaoAjax(data, function() {

                $('[data-click-retorna-tela-principal]').on('click', function(){
                    if(tela == "carregar_filtro") {
                        loadForm();
                    }
                    if(tela == "recarregar_tela") {
                        recarregarTela();
                    }
                });
            });
        },
        complete: function(data) {
            console.log("Ajax-complete");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            _errorAlertify(error);
            $("div.page").fadeIn('slow', 'linear');
        }
    });

}

/*
* UPLOAD
* Configuar aqui as funções para upload de arquivos
*
* */

function ativarUploadPDF() {

    var OUT = document.getElementById('out');

    (function () {
        var drop = document.getElementById('drop');
        var page = document.getElementsByClassName('page')[0];
        if (!drop.addEventListener) return;

        function handleDropPage(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        function handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();

            //console.log(e);
            //console.log(e.target);
            //console.log(e.dataTransfer);
            //console.log(e.dataTransfer.items);
            //console.log(e.dataTransfer.files);

            if(nf1_obrigatorio == 1) {

                try {

                    if (validarExtensaoArquivo(e.dataTransfer.files[0].name, 'pdf')) {

                        //Le o arquivo arrastado para cima do drop zone
                        var fReader = new FileReader();
                        fReader.addEventListener('load', function (event) {
                            var result = btoa(event.target.result);
                            $("#file_pdf").val(result);
                            $("#pdf_file").val('');
                            $("#pdf_file").hide('fast');

                            if ($("#file_pdf").val() != "") {
                                $("#out").html("<strong>Arquivo Carregado:</strong> " + e.dataTransfer.files[0].name);
                            } else {
                                $("#out").html("<strong>Falha ao tentar carregar o arquivo!</strong>");
                            }
                        });
                        fReader.readAsBinaryString(e.dataTransfer.files[0]);
                    } else {
                        $("#file_pdf").val('');
                        $("#pdf_file").val('');
                        $("#pdf_file").show('fast');
                        $("#out").html('');
                    }

                } catch (er) {
                    console.error(er.message);
                    $("#file_pdf").val('');
                    $("#pdf_file").val('');
                    $("#pdf_file").show('fast');
                    $("#out").html('');
                }

            }

            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
            drop.style.backgroundColor = "#FFFFFF";

            //$("#drop").html("Arraste um arquivo de planilha aqui OU Selecione");

            return false;

        }

        function handleDragoverPage(e) {
            e.stopPropagation();
            e.preventDefault();
            return false
        }

        function handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();

            if(nf1_obrigatorio == 0) {
                drop.style.borderColor = "#FF2D85";
                drop.style.color = "#FF2D85";
                drop.style.backgroundColor = "#FCCFF9";

                //$("#drop").html("Campo bloqueado, para liberar clique em Editar Dados!");

            } else {
                e.dataTransfer.dropEffect = 'copy';
                drop.style.borderColor = "#00CBFE";
                drop.style.color = "#00CBFE";
                drop.style.backgroundColor = "#FFFFCC";

                //$("#drop").html("Arraste um arquivo de planilha aqui OU Selecione");
            }

            return false;
        }

        function handleExit(e) {
            e.stopPropagation();
            e.preventDefault();
            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
            drop.style.backgroundColor = "#FFFFFF";

            //$("#drop").html("Arraste um arquivo de planilha aqui OU Selecione");

            return false;
        }

        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
        drop.addEventListener('dragexit', handleExit, false);

        page.addEventListener('dragenter', handleDragoverPage, false);
        page.addEventListener('dragover', handleDragoverPage, false);
        page.addEventListener('drop', handleDropPage, false);

    })();

    (function () {
        var pdf = document.getElementById('pdf_file');
        if (!pdf.addEventListener) return;

        function handleFile(e) {

            if(nf1_obrigatorio == 0) {
                return false;
            }

            try {

                fname = e.target.files[0].name;

                if (validarExtensaoArquivo(e.target.files[0].name, 'pdf')) {

                    fname = e.target.files[0].name;

                    if ($("#pdf_file").val() != "") {
                        $("#file_pdf").val('');
                        $("#pdf_file").hide('fast');
                        $("#out").html('Arquivo carregado: ' + fname);
                    } else {
                        $("#out").html('');
                    }

                } else {
                    $("#file_pdf").val('');
                    $("#pdf_file").val('');
                    $("#pdf_file").show('fast');
                    $("#out").html('');
                }

            } catch(er) {
                console.error(er.message);
                $("#file_pdf").val('');
                $("#pdf_file").val('');
                $("#pdf_file").show('fast');
                $("#out").html('');
            }

            return false;
        }

        pdf.addEventListener('change', handleFile, false);

    })();

}

function ativarXlsImport() {

    /*jshint browser:true */
    /* eslint-env browser */
    /* eslint no-use-before-define:0 */
    /*global Uint8Array, Uint16Array, ArrayBuffer */
    /*global XLSX */
    var X = XLSX;
    var XW = {
        /* worker message */
        msg: 'xlsx',
        /* worker scripts */
        worker: './xlsxworker.js'
    };

    var global_wb;
    var fname = null;

    var process_wb = (function () {
        var OUT = document.getElementById('out');
        var HTMLOUT = document.getElementById('htmlout');

        var get_format = (function () {
            var radios = document.getElementsByName("format");
            return function () {
                for (var i = 0; i < radios.length; ++i) if (radios[i].checked || radios.length === 1) return radios[i].value;
            };
        })();

        var to_json = function to_json(workbook) {
            var result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (roa.length) result[sheetName] = roa;
            });
            return JSON.stringify(result, 2, 2);
        };

        var to_csv = function to_csv(workbook) {
            var result = [];
            workbook.SheetNames.forEach(function (sheetName) {
                var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                if (csv.length) {
                    //result.push("SHEET: " + sheetName);
                    //result.push("");
                    if(sheetName == 'Dados') {
                        result.push(csv);
                    }
                }
            });
            return result.join("\n");
        };

        var to_fmla = function to_fmla(workbook) {
            var result = [];
            workbook.SheetNames.forEach(function (sheetName) {
                var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
                if (formulae.length) {
                    result.push("SHEET: " + sheetName);
                    result.push("");
                    result.push(formulae.join("\n"));
                }
            });
            return result.join("\n");
        };

        var to_html = function to_html(workbook) {
            HTMLOUT.innerHTML = "";
            workbook.SheetNames.forEach(function (sheetName) {
                var htmlstr = X.write(workbook, {sheet: sheetName, type: 'binary', bookType: 'html'});
                HTMLOUT.innerHTML += htmlstr;
            });
            return "";
        };

        return function process_wb(wb) {
            global_wb = wb;
            var output = "";
            switch (get_format()) {
                case "form":
                    output = to_fmla(wb);
                    break;
                case "html":
                    output = to_html(wb);
                    break;
                case "json":
                    output = to_json(wb);
                    break;
                default:
                    output = to_csv(wb);
            }

            var _output = btoa(output.replaceAll(",,\n", "").replaceAll(",,", ""));

            $("#xls").val(_output);
            $("#xlfile").val('');
            $("#xlfile").hide('fast');

            if($("#xls").val() != "") {
                $("#out").html('<strong>Arquivo carregado:</strong> ' + fname);
            } else {
                $("#out").html('<strong>Falha ao carregar arquivo:</strong> ' + fname);
            }

            //if (typeof console !== 'undefined') console.log("output", new Date());
        };
    })();

    var do_file = (function () {
        var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;
        var domrabs = false;
        if (!rABS) domrabs.disabled = !(domrabs.checked = false);

        var use_worker = typeof Worker !== 'undefined';
        var domwork = false;
        if (!use_worker) domwork.disabled = !(domwork.checked = false);

        var xw = function xw(data, cb) {
            var worker = new Worker(XW.worker);
            worker.onmessage = function (e) {
                switch (e.data.t) {
                    case 'ready':
                        break;
                    case 'e':
                        console.error(e.data.d);
                        break;
                    case XW.msg:
                        cb(JSON.parse(e.data.d));
                        break;
                }
            };
            worker.postMessage({d: data, b: rABS ? 'binary' : 'array'});
        };

        return function do_file(files) {
            rABS = domrabs.checked;
            use_worker = domwork.checked;
            var f = files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                /*if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);*/
                var data = e.target.result;
                if (!rABS) data = new Uint8Array(data);
                if (use_worker) xw(data, process_wb);
                else process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
            };
            if (rABS) reader.readAsBinaryString(f);
            else reader.readAsArrayBuffer(f);
        };
    })();

    (function () {
        var drop = document.getElementById('drop');
        var page = document.getElementsByClassName('page')[0];
        if (!drop.addEventListener) return;

        function handleDropPage(e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        function handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();

            try {

                fname = e.dataTransfer.files[0].name;

                if(validarExtensaoArquivo(e.dataTransfer.files[0].name, 'xls|xlsx|xlsb')) {
                    do_file(e.dataTransfer.files);
                } else {
                    $('#out').html('');
                    $('#xls').val('');
                    $("#xlfile").val('');
                    $("#xlfile").show('fast');
                }

            } catch (er) {
                console.log(er.message);
                $('#out').html('');
                $('#xls').val('');
                $("#xlfile").val('');
                $("#xlfile").show('fast');
            }

            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
            drop.style.backgroundColor = "#FFFFFF";
        }

        function handleDragoverPage(e) {
            e.stopPropagation();
            e.preventDefault();
            return false
        }

        function handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            drop.style.borderColor = "#00CBFE";
            drop.style.color = "#00CBFE";
            drop.style.backgroundColor = "#FFFFCC";
        }

        function handleExit(e) {
            e.stopPropagation();
            e.preventDefault();
            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
            drop.style.backgroundColor = "#FFFFFF";
        }

        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
        drop.addEventListener('dragexit', handleExit, false);

        page.addEventListener('dragenter', handleDragoverPage, false);
        page.addEventListener('dragover', handleDragoverPage, false);
        page.addEventListener('drop', handleDropPage, false);

    })();

    (function () {
        var xlf = document.getElementById('xlfile');
        if (!xlf.addEventListener) return;

        function handleFile(e) {

            try {

                fname = e.target.files[0].name;

                if (validarExtensaoArquivo(e.target.files[0].name, 'xls|xlsx|xlsb')) {

                    do_file(e.target.files);

                    if ($("#xls").val() != "") {
                        $("#out").html('Arquivo carregado!');
                    } else {
                        $("#out").html('Falha ao carregar arquivo!');
                    }

                } else {
                    $('#out').html('');
                    $('#xls').val('');
                    $("#xlfile").val('');
                    $("#xlfile").show('fast');
                }

            } catch (er) {
                console.error(er.message);
                $('#out').html('');
                $('#xls').val('');
                $("#xlfile").val('');
                $("#xlfile").show('fast');
            }

        }

        xlf.addEventListener('change', handleFile, false);
    })();

}

function ativarUpload(tela) {

    $('#frm_upload_item').validate({
        rules: {
            modelo: "required"
        },
        messages: {
            modelo: "Campo Obrigatorio"
        },
        submitHandler: function (form) {

            var msg = "";

            if (msg !== "") {
                alertify.alert('Aviso', msg);
                return false;
            }

            if($("#xlfile").val() == "" && $("#xls").val() == "") {
                alertify.alert('Aviso', 'Escolha um arquivo para upload');
                return false;
            }

            alertify.confirm('Mensagem', 'Confirma upload do arquivo ?',
                function () {
                    alertify.success('Confirmado');
                    $.ajax({
                        type: "POST",
                        url: x_tratativa_relatorio_operacional_acao,
                        data: $("#frm_upload_item").serialize(),
                        async: false,
                        success: function (data) {

                            alertify.alert('Mensagem', data);
                            if(tela == "carregar_filtro") {
                                loadForm();
                            }
                            if(tela == "recarregar_tela") {
                                recarregarTela();
                                //loadGrid('');
                            }

                            return false;

                        }
                    });
                },
                function () {
                    alertify.error('Cancelado');
                });

            return false;
        }
    });
}

/*
* FILTROS (Dialog)
* Configurar aqui as funções utilizadas pelo dialog de filtro padrão do sistema
*
* */

//Configurar aqui o filtro que deve ser carregado quando requisitado
function getFiltro(){

    var dialog_filtro = "";

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao: 'dialog_filtro',
            filtro_hidden_1: $("#filtro_hidden_1").val(),//Cliente Negocio
            filtro_hidden_2: $("#filtro_hidden_2").val(),//Status do Pedido
            filtro_hidden_3: $("#filtro_hidden_3").val(),//Pedido/CPF/CNPJ
            filtro_hidden_4: $("#filtro_hidden_4").val(),//Data Inicial
            filtro_hidden_5: $("#filtro_hidden_5").val(),//Data Final
            filtro_hidden_6: $("#filtro_hidden_6").val(),//SLA Fabrica
            filtro_hidden_7: $("#filtro_hidden_7").val() //SLA Rota
        },
        async: false,
        success: function(data) {
            dialog_filtro = data;
        }
    });

    return dialog_filtro;

}

//Mostra o filtro em um dialog jquery
function dialogFiltro(){

    $.Dialog({
        'title'      : 'Filtro',
        'content'    : getFiltro(),
        'draggable'  : true,
        'keepOpened' : true,
        'closeButton': true,
        'buttonsAlign': 'right',
        'buttons'    : {
            'OK'	: {
                'action': function() {

                    if(validarPesquisaInicial()) {

                        $("#dialogBox").hide();

                        $("#filtro_hidden_1").val($("#filtro_1").val());//Cliente Negocio
                        $("#filtro_hidden_2").val($("#filtro_2").val());//Status do Pedido
                        $("#filtro_hidden_3").val($("#filtro_3").val());//Pedido/CPF/CNPJ
                        $("#filtro_hidden_4").val($("#filtro_4").val());//Data Inicial
                        $("#filtro_hidden_5").val($("#filtro_5").val());//Data Final
                        $("#filtro_hidden_6").val($("#filtro_6").val());//SLA Fabrica
                        $("#filtro_hidden_7").val($("#filtro_7").val());//SLA Rota

                        loadGrid('1');

                    } else {
                       dialogFiltro();
                    }
                }
            },
            'Cancelar'	: {
                'action': function() {}
            }
        }
    });

    listaClienteNegocio();
    carregarDatepicker();
}

function listaClienteNegocio(cliente_negocio){

    $.get(x_request,
        {acao:'consulta_cliente_negocio_operacao',cliente_negocio:'',todos:'S_CARE_DEPARA'},
        function(data, textStatus, jqXHR)
        {
            $("#filtro_1").html(data);//Cliente Negocio

            $("#filtro_1 option[value="+$("#filtro_hidden_1").val()+"]").prop('selected', true);
        }
    );
}

function listaTransportadoras(){

    $.get('request.php',
        {acao:'consulta_transportadoras',id:''},
        function(data, textStatus, jqXHR)
        {
            $("#sla_fabrica_transportadora").html(data);
        }
    );
}

/*
* EXPORTAR DADOS
* Configurar aqui as funções para exportar dados da tela para arquivos (ex: planilhas)
*
* */

//Configurar aqui a exportação do conteudo em tela para arquivo excel
function exportaBase(){

    $('body').addClass("loading");

    var filtro_sql = $("#filtro_sql").val();
    var formato = "xls";
    $("#sql").val(filtro_sql);
    $("#acao").val(formato);
    $("#pag").val($("#page").val());

    $.post(x_tratativa_relatorio_operacional_acao,
        $("#frm_exportar").serialize(),
        function(data, textStatus, jqXHR)
        {
            $('#iframe_exportar_xls').attr('src', data.replaceAll('\n', ''));

            setTimeout(function(){

                $.post(x_tratativa_relatorio_operacional_acao,
                    {acao:'xls_delete', path_filename:data.replaceAll('\n', '')},
                    function(datadel, textStatus, jqXHR)
                    {
                        $('body').removeClass("loading");
                    }
                );

            }, 1000);

            //Garante que o loader gif seja removido em casos de falha na requisição acima
            setTimeout(function(){
                if($('body').hasClass('loading')) {
                    $('body').removeClass("loading");
                }
            }, 2500);
        }
    );
}

/*function exportaBase(){
    var filtro_sql = $("#filtro_sql").val();
    var formato = "xls";
    $("#sql").val(filtro_sql);
    $("#acao").val(formato);
    $("#frm_exportar").submit();
}*/

function exportaListaItem(){

    $('body').addClass("loading");

    var filtro_sql = $("#filtro_sql").val();
    var formato = "xls_item";
    $("#sql").val(filtro_sql);
    $("#acao").val(formato);
    $("#pag").val('1'); //TESTE

    $.post(x_tratativa_relatorio_operacional_acao,
        $("#frm_exportar_lista_item").serialize(),
        function(data, textStatus, jqXHR)
        {
            $('#iframe_exportar_xls').attr('src', data.replaceAll('\n', ''));

            setTimeout(function(){

                $.post(x_tratativa_relatorio_operacional_acao,
                    {acao:'xls_delete', path_filename:data.replaceAll('\n', '')},
                    function(datadel, textStatus, jqXHR)
                    {
                        $('body').removeClass("loading");
                    }
                );

            }, 1000);

            //Garante que o loader gif seja removido em casos de falha na requisição acima
            setTimeout(function(){
                if($('body').hasClass('loading')) {
                    $('body').removeClass("loading");
                }
            }, 2500);
        }
    );
}

/*function exportaListaItem(){
    var filtro_sql = $("#filtro_sql").val();
    var formato = "xls_item";
    $("#sql").val(filtro_sql);
    $("#acao").val(formato);
    $("#pag").val('1'); //TESTE
    $("#frm_exportar_lista_item").submit();
}*/

