
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


/*
* VARIAVEIS
* Declaração de variaveis
*
* */

var x_tratativa_relatorio_operacional        = 'OLD-x-tratativa_relatorio_operacional.php';
var x_tratativa_relatorio_operacional_edicao = 'OLD-x-tratativa_relatorio_operacional_edicao.php';
var x_tratativa_relatorio_operacional_acao   = 'OLD-x-tratativa_relatorio_operacional_acao.php';
var x_request                                = 'x-request.php';

/*
* DOM READY
* Configurar as primeiras instruções a serem executadas quando o DOM estiver pronto
*
* */

$(document).ready(function() {

    //Chamada da API de log, usada apenas em dev
    //callDevLogger('[Start] Em Desenvovimento', 'tela_inclusao_nf1');

    loadGrid('');

    //Chamada da API de log, usada apenas em dev
    //callDevLogger('[End] Em Desenvovimento', 'tela_inclusao_nf1');

});

/*
* GENERICO
* Configurar aqui as funcões genericas do subomulo
*
* */

//Date Picker
function recarregarDatepicker(){
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
        //alert("Escolha apenas 1 item por vez");
        $('[title="Editar Lote"]').show();
    } else {
        $('[title="Editar Lote"]').hide();
    }

    $("div#conta_os").html("<b class='bg-color-red fg-color-white'>Selecionados: " + num +"</b>");

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
    $("div.page").fadeOut('slow', 'linear');
    $("footer").hide();
}

function fimTransicaoAjax(_data, _callback) {

    setTimeout(function(){

        $("div.page").fadeIn('slow', 'linear');
        $("footer").show();
        $("div.page").html(_data);
        clearFooter();

        _callback();

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

    $("#grid_busca").val('');
    $("#filtro_os_controle_1").val('');
    $("#filtro_os_controle_2").val('');
    $("#filtro_os_controle_3").val('');
    $("#filtro_os_controle_4").val('');
    $("#filtro_os_controle_5").val('');
    $("#filtro_os_controle_6").val('');
    $("#filtro_os_controle_7").val('');
    loadGrid('');

}

//Função que carrega o conteudo inicial na grid
function loadGrid(param){

    iniTransicaoAjax();

    if(param == '') {
        param = {'acao':'grid'};
    } else {
        //Atualiza o indice da paginacao antes de executar a requisicao
        //de paginacao para poder enviar o valor correto da pagina atual
        $("#page").val(param);
        param = $("#frm_grid").serialize();
    }

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        /*data: $("#frm_grid").serialize(),*/
        data: param,
        async: false,
        success: function(data) {

            fimTransicaoAjax(data, function() {
                criaPaginacao($("#pagina_total").val(), $("#page").val());
                $('[title="Editar Lote"]').hide();
            });
        }
    });
}

/*
* VALIDACOES
* Configurar aqui as validacoes gerais do submodulo
*
* */

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

function validacaoFake(){

    if(1 == 1) {
        return true;
    }

    return false;

}

/*
* CRUD
* Configuar aqui as funções para manipular os itens: Listar/Inserir/Atualizar/Remover/Bloquear
*
* */

//Inserir
function insereNovoItem(id){

    $("#frm_cadastro_novo_item").append("Aguarde...");

    var dataForm = new FormData();

    dataForm.append('id_request_novo_item', $("#id_request_novo_item").val());
    dataForm.append('acao', $("#acao_novo_item").val());
    dataForm.append('input_atualizar_novo_item', $("#input_atualizar_novo_item").val());
    dataForm.append('input_numero_1', $("#input_numero_1").val());
    dataForm.append('input_numero_2', $("#input_numero_2").val());

    //Arquivo PDF
    $('input[type=file]').each(function (index, item) {
        if (item.files.length > 0) {
            dataForm.append('ext_file', item.files[0]);
        }
    });

    dataForm.append('comentario_novo_item', $("#comentario_novo_item").val());

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

            //window.location.href = 'os_controle_inclusao_nf1_ing.php';
            recarregarTela();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });

}

//Listar
function listaItem(id){
    listarItemTela(id);
}

//Atualizar
function atualizaItem(id){

    $("#frm_cadastro_novo_item").append("Aguarde...");

    var dataForm = new FormData();

    dataForm.append('id_request_novo_item', $("#id_request_novo_item").val());
    dataForm.append('acao', $("#acao_novo_item").val());
    dataForm.append('input_atualizar_novo_item', $("#input_atualizar_novo_item").val());
    dataForm.append('input_numero_1', $("#input_numero_1").val());
    dataForm.append('input_numero_2', $("#input_numero_2").val());

    //Arquivo PDF
    $('input[type=file]').each(function (index, item) {
        if (item.files.length > 0) {
            dataForm.append('ext_file', item.files[0]);
        }
    });

    dataForm.append('comentario_novo_item', $("#comentario_novo_item").val());

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

            //window.location.href = 'os_controle_inclusao_nf1_ing.php';
            recarregarTela();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText, textStatus, errorThrown);
            _errorAlertify(jqXHR.responseText);
            $("div.page").fadeIn('slow', 'linear');
        }
    });

}

//Remover
function removeItem(id){

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

                    recarregarTela();

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

//Bloquear
function bloqueiaItem(id){

    alertify.confirm('Mensagem', 'Deseja mesmo bloquear o item ?',
        function(){
            alertify.success('Confirmado');

            $.ajax({
                url: x_tratativa_relatorio_operacional_acao,
                dataType: 'json',
                cache: false,
                data: {acao: 'bloquear_item', id: id},
                method: 'POST',
                async: false,
                success: function (data) {

                    var resp = JSON.parse(JSON.stringify(data));

                    alertify.alert('Mensagem', resp.message);

                    recarregarTela();

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

//Configurar aqui a tela para criar um novo item no sistema (pedidos, os, etc...)
function novoItemTela(){

    iniTransicaoAjax();

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'novo_item',
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
        success: function(data) {

            fimTransicaoAjax(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });

                $("#bt-submit-form-novo-item").on('click', function(){
                    if(validarCadastroNovoItem() === true) {

                        alertify.confirm('Mensagem', 'Deseja mesmo cadastrar o novo item ?',
                            function(){
                                alertify.success('Confirmado');
                                insereNovoItem('123456');
                            },
                            function(){
                                alertify.error('Cancelado');
                            });

                    }
                    return false;
                });

                $('#bt-reset-form-novo-item').on('click', function() {
                    $('#out').html('');
                    $('#ext_file').val('');
                    $('#file_ext').val('');
                    $("#ext_file").show('fast');
                });

                //Somente numeros para os campos de chave e numero da nota fiscal
                $("#input_numero_1, #input_numero_2").on('keyup', function() {

                    var str_campo = $(this).val();
                    $(this).val(str_campo.replace(/[^\d]+/g, ''));

                });

                ativarUploadPDF();
            });
        },
        error: function(error){
            alert(error);
            _errorAlertify(error)
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

//Configurar aqui a tela para editar um item no sistema (pedidos, os, etc...)
function editarItemTela(item_id){

    var lista_os = "";

    if(item_id) {
        lista_os = item_id;
    } else {

        $('.lista_os').each(function () {
            if ($(this).is(':checked')) {
                if (lista_os != '') lista_os += ',';
                lista_os += $(this).val();
            }
        });
    }

    if (lista_os == ''){
        alertify.alert('Aviso', 'Selecione 1 item para editar');
        return false;
    }

    iniTransicaoAjax();

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'editar_item',
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
        success: function(data) {

            fimTransicaoAjax(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });

                $("#bt-submit-form-editar-item").on('click', function(){
                    if(validacaoFake() === true) {

                        alertify.confirm('Mensagem', 'Deseja mesmo atualizar o item ?',
                            function(){
                                alertify.success('Confirmado');
                                atualizaItem('123456');
                            },
                            function(){
                                alertify.error('Cancelado');
                            });

                    }
                    return false;
                });

                $('#bt-reset-form-editar-item').on('click', function() {
                    $('#out').html('');
                    $('#ext_file').val('');
                    $('#file_ext').val('');
                    $("#ext_file").show('fast');
                });

                //Somente numeros para os campos de chave e numero da nota fiscal
                $("#input_numero_1, #input_numero_2").on('keyup', function() {

                    var str_campo = $(this).val();
                    $(this).val(str_campo.replace(/[^\d]+/g, ''));

                });

                //ativarUploadPDF();
            });
        },
        error: function(error){
            alert(error);
            _errorAlertify(error)
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

//TODO: Configurar
function removerItemTela(item_id){

    var lista_os = "";

    if(item_id) {
        lista_os = item_id;
    } else {

        $('.lista_os').each(function () {
            if ($(this).is(':checked')) {
                if (lista_os != '') lista_os += ',';
                lista_os += $(this).val();
            }
        });
    }

    if (lista_os == ''){
        alertify.alert('Aviso', 'Selecione 1 item para remover');
        return false;
    }

    iniTransicaoAjax();

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'remover_item',
            filtro_where:'',
            limit:'',
            lista_os:lista_os,
            status_atual:'',
            tipo_consulta:'',
            getsql:'',
            sql:'',
            request_number:''
        },
        async: false,
        success: function(data) {

            fimTransicaoAjax(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });

                $("#bt-submit-form-remover-item").on('click', function(){
                    if(validarCadastroNovoItem() === true) {

                        alertify.confirm('Mensagem', 'Deseja mesmo remover o item ?',
                            function(){
                                alertify.success('Confirmado');
                                removeItem('123456');
                            },
                            function(){
                                alertify.error('Cancelado');
                            });

                    }
                    return false;
                });

                //Somente numeros para os campos de chave e numero da nota fiscal
                $("#input_numero_1, #input_numero_2").on('keyup', function() {

                    var str_campo = $(this).val();
                    $(this).val(str_campo.replace(/[^\d]+/g, ''));

                });
            });
        },
        error: function(error){
            _errorAlertify(error);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

//TODO: Configurar
function bloquearItemTela(item_id){

    var lista_os = "";

    if(item_id) {
        lista_os = item_id;
    } else {

        $('.lista_os').each(function () {
            if ($(this).is(':checked')) {
                if (lista_os != '') lista_os += ',';
                lista_os += $(this).val();
            }
        });
    }

    if (lista_os == ''){
        alertify.alert('Aviso', 'Selecione 1 item para bloquear');
        return false;
    }

    iniTransicaoAjax();

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'bloquear_item',
            filtro_where:'',
            limit:'',
            lista_os:lista_os,
            status_atual:'',
            tipo_consulta:'',
            getsql:'',
            sql:'',
            request_number:''
        },
        async: false,
        success: function(data) {

            fimTransicaoAjax(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });

                $("#bt-submit-form-bloquear-item").on('click', function(){
                    if(validarCadastroNovoItem() === true) {

                        alertify.confirm('Mensagem', 'Deseja mesmo bloquear o item ?',
                            function(){
                                alertify.success('Confirmado');
                                bloqueiaItem('123456');
                            },
                            function(){
                                alertify.error('Cancelado');
                            });

                    }
                    return false;
                });

                //Somente numeros para os campos de chave e numero da nota fiscal
                $("#input_numero_1, #input_numero_2").on('keyup', function() {

                    var str_campo = $(this).val();
                    $(this).val(str_campo.replace(/[^\d]+/g, ''));

                });
            });
        },
        error: function(error){
            _errorAlertify(error);
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

//TODO: Configurar
function listarItemTela(item_id){

    var lista_os = "";

    if(item_id) {
        lista_os = item_id;
    } else {

        $('.lista_os').each(function () {
            if ($(this).is(':checked')) {
                if (lista_os != '') lista_os += ',';
                lista_os += $(this).val();
            }
        });
    }

    if (lista_os == ''){
        alertify.alert('Aviso', 'Selecione 1 item para listar');
        return false;
    }

    iniTransicaoAjax();

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'listar_item',
            filtro_where:'',
            limit:'',
            lista_os:lista_os,
            status_atual:'',
            tipo_consulta:'',
            getsql:'',
            sql:'',
            request_number:''
        },
        async: false,
        success: function(data) {

            fimTransicaoAjax(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });
            });
        },
        error: function(error){
            _errorAlertify(error)
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

//TODO: Configurar
function acoesItemTela(item_id){

    var lista_os = "";

    if(item_id) {
        lista_os = item_id;
    } else {

        $('.lista_os').each(function () {
            if ($(this).is(':checked')) {
                if (lista_os != '') lista_os += ',';
                lista_os += $(this).val();
            }
        });
    }

    if (lista_os == ''){
        alertify.alert('Aviso', 'Selecione 1 item');
        return false;
    }

    iniTransicaoAjax();

    $.ajax({
        type: "POST",
        url: x_tratativa_relatorio_operacional_edicao,
        data: {
            acao:'acoes_item',
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
        success: function(data) {

            fimTransicaoAjax(data, function() {
                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });

                $("#bt-submit-form-acoes-item").on('click', function(){
                    if(validacaoFake() === true) {

                        alertify.confirm('Mensagem', 'Deseja mesmo agir no item ?',
                            function(){
                                alertify.success('Confirmado');
                                //TODO algumaAcao('123456');
                            },
                            function(){
                                alertify.error('Cancelado');
                            });

                    }
                    return false;
                });

                $('#bt-reset-form-acoes-item').on('click', function() {
                    $('#out').html('');
                    $('#ext_file').val('');
                    $('#file_ext').val('');
                    $("#ext_file").show('fast');
                });

                //Somente numeros para os campos de chave e numero da nota fiscal
                $("#input_numero_1, #input_numero_2").on('keyup', function() {

                    var str_campo = $(this).val();
                    $(this).val(str_campo.replace(/[^\d]+/g, ''));

                });

                ativarUploadPDF();
            });
        },
        error: function(error){
            alert(error);
            _errorAlertify(error)
            $("div.page").fadeIn('slow', 'linear');
        }
    });
}

function uploadItemTela(){

    iniTransicaoAjax();

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
        success: function(data) {

            fimTransicaoAjax(data, function() {
                ativarUpload();

                $('[data-click-retorna-tela-principal]').on('click', function(){
                    recarregarTela();
                });

                $('#bt-reset-form-upload-item').on('click', function() {
                    $('#out').html('');
                    $('#xls').val('');
                    $("#xlfile").show('fast');
                });

                ativarXlsImport();
            });
        },
        error: function(error){
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
        if (!drop.addEventListener) return;

        function handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();

            //console.log(e);
            //console.log(e.target);
            //console.log(e.dataTransfer);
            //console.log(e.dataTransfer.items);
            //console.log(e.dataTransfer.files);

            try {

                if(validarExtensaoArquivo(e.dataTransfer.files[0].name, 'pdf')) {

                    //Le o arquivo arrastado para cima do drop zone
                    var fReader = new FileReader();
                    fReader.addEventListener('load', function(event) {
                        var result = btoa(event.target.result);
                        $("#file_ext").val(result);
                        $("#ext_file").val('');
                        $("#ext_file").hide('fast');

                        if($("#file_ext").val() != "") {
                            $("#out").html("<strong>Arquivo Carregado:</strong> " + e.dataTransfer.files[0].name);
                        } else {
                            $("#out").html("<strong>Falha ao tentar carregar o arquivo!</strong>");
                        }
                    });
                    fReader.readAsBinaryString(e.dataTransfer.files[0]);
                } else {
                    $("#file_ext").val('');
                    $("#ext_file").val('');
                    $("#ext_file").show('fast');
                    $("#out").html('');
                }

            } catch (er) {
                console.error(er.message);
                $("#file_ext").val('');
                $("#ext_file").val('');
                $("#ext_file").show('fast');
                $("#out").html('');
            }

            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
        }

        function handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            drop.style.borderColor = "#00CBFE";
            drop.style.color = "#00CBFE";
        }

        function handleExit(e) {
            e.stopPropagation();
            e.preventDefault();
            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
        }

        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
        drop.addEventListener('dragexit', handleExit, false);

    })();

    (function () {
        var pdf = document.getElementById('ext_file');
        if (!pdf.addEventListener) return;

        function handleFile(e) {

            try {

                fname = e.target.files[0].name;

                if (validarExtensaoArquivo(e.target.files[0].name, 'pdf')) {

                    fname = e.target.files[0].name;

                    if ($("#ext_file").val() != "") {
                        $("#file_ext").val('');
                        $("#ext_file").hide('fast');
                        $("#out").html('Arquivo carregado: ' + fname);
                    } else {
                        $("#out").html('');
                    }

                } else {
                    $("#file_ext").val('');
                    $("#ext_file").val('');
                    $("#ext_file").show('fast');
                    $("#out").html('');
                }

            } catch(er) {
                console.error(er.message);
                $("#file_ext").val('');
                $("#ext_file").val('');
                $("#ext_file").show('fast');
                $("#out").html('');
            }
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
                    result.push(csv);
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

            $("#xls").val(output);
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
        if (!drop.addEventListener) return;

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
        }

        function handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            drop.style.borderColor = "#00CBFE";
            drop.style.color = "#00CBFE";
        }

        function handleExit(e) {
            e.stopPropagation();
            e.preventDefault();
            drop.style.borderColor = "#ABABAB";
            drop.style.color = "#ABABAB";
        }

        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
        drop.addEventListener('dragexit', handleExit, false);

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

function ativarUpload() {

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
                            loadGrid('');
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
            filtro_os_controle_1: $("#filtro_os_controle_1").val(),
            filtro_os_controle_2: $("#filtro_os_controle_2").val(),
            filtro_os_controle_3: $("#filtro_os_controle_3").val(),
            filtro_os_controle_4: $("#filtro_os_controle_4").val(),
            filtro_os_controle_5: $("#filtro_os_controle_5").val(),
            filtro_os_controle_6: $("#filtro_os_controle_6").val(),
            filtro_os_controle_7: $("#filtro_os_controle_7").val()
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
                    $("#filtro_os_controle_1").val($("#filtro_1").val());
                    $("#filtro_os_controle_2").val($("#filtro_2").val());
                    $("#filtro_os_controle_3").val($("#filtro_3").val());
                    $("#filtro_os_controle_4").val($("#filtro_4").val());
                    $("#filtro_os_controle_5").val($("#filtro_5").val());
                    $("#filtro_os_controle_6").val($("#filtro_6").val());
                    $("#filtro_os_controle_7").val($("#filtro_7").val());
                    loadGrid('');
                }
            },
            'Cancelar'	: {
                'action': function() {}
            }
        }
    });

    listaFiltro1();
    listaFiltro2();
    listaFiltro3();
    recarregarDatepicker();
}

function listaFiltro1(cliente_negocio) {

    $.get(x_request,
        {acao:'consulta_status_ws',id:'508,532,529,535,533,534,531,537,530,536',descricao:''},
        function(data, textStatus, jqXHR)
        {
            $("#filtro_1").html(data);
        }
    );

}

function listaFiltro2(){

    $.get(x_request,
        {acao:'consulta_cliente_negocio_operacao',cliente_negocio:'',todos:'S'},
        function(data, textStatus, jqXHR)
        {
            $("#filtro_cliente_negocio").html(data);
        }
    );
}

function listaFiltro3(){

    $.get(x_request,
        {acao:'consulta_status_ws',id:'508,532,529,535,533,534,531,537,530,536',descricao:''},
        function(data, textStatus, jqXHR)
        {
            $("#filtro_3").html(data);
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
    var filtro_sql = $("#filtro_sql").val();
    var formato = "xls";
    $("#sql").val(filtro_sql);
    $("#acao").val(formato);
    $("#pag").val($("#page").val());
    $("#frm_exportar").submit();
}

function exportaListaItem(){
    var filtro_sql = $("#filtro_sql").val();
    var formato = "xls_item";
    $("#sql").val(filtro_sql);
    $("#acao").val(formato);
    $("#pag").val('1'); //TESTE
    $("#frm_exportar_lista_item").submit();
}
