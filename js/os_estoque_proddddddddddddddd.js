// globais com os status do estoque
var $status_disponivel    = 60;
var $status_utilizado     = 62;
var $status_reservado     = 64;
var $status_devolvido     = 66;
var $status_laboratorio   = 68;
var $status_descarte      = 70;
var $status_nao_utilizado = 71;

var $temPeca    = 0; // verifica se uma peca foi atrelada a OS
var $temEstoque = 1; // verifica se as pecas atreladas a OS tem em estoque disponivel
var $escalonado = 0; // verifica se a OS foi escalonada
var $temSwap    = 0; // verifica se houve troca do produto
var $obgIMEI    = 0; // valida se o imei novo eh obrigatorio no reparo

//console.dir($os);

// pega a lista de solucoes de acordo com a falha
function getSolucoes($falha)
{
    $("#servico_id").empty();
    $("#peca_lista_combobox, #qtde_box").css('visibility', 'hidden');
    $.ajax({
        url: 'os_servico_defeito_acao.php',
        type: 'GET',
        async: false,
        data: {
            acao: 'getservicodefeito',
            defeito_id: $falha,
            status_id: $os.status_id,
            servico_ativo: 'S',
            groupby: 's.servico_id'
        },
        success: function($data)
        {
            $json = $.parseJSON($data);
            $("#servico_id").append('<option value="#" selected disabled>Selecione...</option>');
            $.each($json, function($i, $val) {
                //console.dir($val);
                $("#servico_id").append('<option value="'+$val.servico_id+'" obrigatorio_peca="'+$val.servico_obrigatorio+'" tipo_material="'+$val.pecas.join(',')+'">('+$val.servico_codigo+') '+$val.servico_titulo+'</option>'); 
            });
        }
    });
}

// pega a lista de pecas, considerando os action code
function getPecas()
{
    $("#produto_id_peca").empty();
	var $tipo_material = $("#servico_id").find("option:selected").attr('tipo_material');

    $.ajax({
        url: 'os_estoque.php',
        type: 'GET',
        async: false,
        data: {
            os_id: $os.os_id,
            produto_id: $os.produto_id,
            servico_id: $("#servico_id").val(),
            acao: 'get_pecas',
            tipo_material: $tipo_material
        },
        success: function($data)
        {
            //console.dir($data);
            $json = $.parseJSON($data);
            $("#produto_id_peca").append('<option value="#" selected disabled>Selecione...</option>');
            $.each($json, function($i, $val) {
                $("#produto_id_peca").append('<option value="'+$val.produto_id+'">'+$val.produto_codigo+' - '+$val.produto_descricao+'</option>'); 
            });
        }
    });         
}

// pega o estoque de uma peca
function getQtdEstoque($peca_id)
{
    var $res = false;
    $.ajax({
        url: 'os_estoque.php',
        type: 'GET',
        async: false,
        data: {
            produto_id: $peca_id,
            clienteconfig_id: $os.clienteconfig_id,
            os_id: $os.os_id,
            acao: 'get_qtd_estoque'
        },
        success: function($data)
        {
            $res = $.parseJSON($data);
        }
    });

    return $res;
}

function getQtdEstoqueStatus($o, $s)
{
    if(empty($o))
        return 0;
    var $res = 0;
    $.each($o, function($i, $val) {
          if($val.status_id == $s && !isNaN($val.qtde))
          {
            $res = parseInt($val.qtde);
            return true;
          }
    });
    return $res;
}

function getTableStatus($o)
{
    if(empty($o))
        return '';
    var $thead = [];
    var $tbody = [];
    $.each($o, function($j, $e) {
        if($e.status_id != $status_disponivel)
        {
            $thead.push('<td>'+$e.abr+'</td>');
            $tbody.push('<td>'+$e.qtde+'</td>');
        }
    });
    return '<table class="bordered striped"><thead><tr>'+$thead.join('')+'</tr></thead><tbody><tr>'+$tbody.join('')+'</tr></tbody></table>';
}

// pega a lista de pecas, falhas e solucoes da os
function getListaSolucoes()
{
    $("#lista_solucoes tbody").empty();
    $.ajax({
        url: 'os_estoque.php',
        type: 'GET',
        async: false,
        data: {
            os_id: $os.os_id,
            produto_id: $os.produto_id,
            clienteconfig_id: $os.clienteconfig_id,
            acao: 'get_lista_solucoes'
        },
        success: function($data)
        {
            var $json = $.parseJSON($data);

            console.dir($json);

            switch(parseInt($os.status_id))
            {
                case 8:
                case 10: var $html = __listaAgAnalise($json); break;
                case 12: 
                case 13: var $html = __listaOrcamento($json); break;
                case 14: var $html = __listaAgPeca($json); break;
                case 9:
                case 16: var $html = __listaReparo($json); break;
                default: var $html = __listaDefault($json);
            }

            $("#lista_solucoes tbody").html($html);
            // altera o status da os
            setOsStatus($json);            
        }
    }); 
}

// monta a lista no ag analise SL1/SL3
function __listaAgAnalise($json)
{
    var $html = [];
    $.each($json, function($i, $val) {
        // checa se ha pecas utilizadas
        var $uti = getQtdEstoqueStatus($val.estoque, $status_utilizado);
        // checa se ha pecas no laboratorio (deprecated)
        var $lab = getQtdEstoqueStatus($val.estoque, $status_laboratorio);
        // checa se ha pecas reservadas (deprecated)
        var $res = getQtdEstoqueStatus($val.estoque, $status_reservado);
        // index + hiddens
        var $index = ($i+1)+'<input type="hidden" name="osprodutopeca_uti[]" value="'+$uti+'" /><input type="hidden" name="osprodutopeca_lab[]" value="'+$lab+'" /><input type="hidden" name="osprodutopeca_res[]" value="'+$res+'" /><input type="hidden" name="osprodutopeca_id[]" class="osprodutopeca_id" value="'+$val.osprodutopeca_id+'" /><input type="hidden" name="produto_id_peca[]" value="'+$val.produto_id_peca+'" />';
        //Status Estoque  
        var $estoque = getTableStatus($val.estoque);
        //Falha   
        var $falha = '('+$val.defeito_id+') '+$val.defeito_titulo;
        //Solução 
        var $solucao = '('+$val.servico_id+') '+$val.servico_titulo;
        //SI - Peça   
        var $peca = (!empty($val.produto_id_peca)) ? $val.produto_codigo+' - '+$val.produto_descricao : '';
        //Qtde disponivel em estoque
        var $qtdEstoque = getQtdEstoqueStatus($val.estoque, $status_disponivel);
        //input Qtde os
        var $inputQtd = '<div class="input-control"><input type="number" name="osprodutopeca_qtde['+$i+']" step="1" value="'+$val.osprodutopeca_qtde+'" /></div>';   
        //Qtde reuso
        var $inputQtdReuso = '<div class="input-control"><input type="number" name="qtde_reuso['+$i+']" step="1" min="0" max="'+$val.osprodutopeca_qtde+'" value="'+$val.qtde_reuso+'" /></div>';                    
        // cria input para atualizar a qtde      
        if(!empty($val.produto_id_peca))
            var $upd = '<a href="javascript: void(0);" onclick="updListaSolucoes('+$i+');" title="Alterar" alt="Alterar"><i class="icon-save"></i></a>';
        else
        {
            var $upd = '';
            $inputQtd = $val.osprodutopeca_qtde;
            $inputQtdReuso = '';
        }
        // botao excluir
        var $dlt = '<a href="javascript: void(0);" onclick="dltListaSolucoes('+$i+', false);" title="Excluir" alt="Excluir"><i class="icon-cancel"></i></a>';

        // SL3 nao pode editar dados da SL1
        if($.inArray(parseInt($val.servico_id), [10, 34, 46]) >= 0 && parseInt($os.status_id) == 10)
        {
            $upd = '';
            $dlt = '';
        }

        // se a OS voltou, nao pode excluir utilizados
        //if($uti > 0) $dlt = '';       

        var $laudo = '<a href="javascript: void(0);" onclick="dialogGeraLaudoSolucoes('+$i+');" title="Imprimir laudo" alt="Imprimir laudo"><i class="icon-printer"></i></a>'; 
        
        var $tr = '<tr><td>'+$index+'</td><td>'+$falha+'</td><td>'+$solucao+'</td><td>'+$peca+'</td><td>'+$inputQtd+'</td><td>'+$inputQtdReuso+'</td><td>'+$qtdEstoque+'</td><td>'+$estoque+'</td><td>'+$upd+$dlt+$laudo+'</td></tr>';
        $html.push($tr);
    });   

    return $html.join(''); 
}

// monta a lista de orcamento e calcula os totais
function __listaOrcamento($json)
{
    var $html = [];
    var $total_pecas = 0;
    var $total_mao_obra  = 0;
    $.each($json, function($i, $val) {      
        // checa se ha pecas utilizadas
        var $uti = getQtdEstoqueStatus($val.estoque, $status_utilizado);
        // checa se ha pecas no laboratorio (deprecated)
        var $lab = getQtdEstoqueStatus($val.estoque, $status_laboratorio);
        // checa se ha pecas reservadas (deprecated)
        var $res = getQtdEstoqueStatus($val.estoque, $status_reservado);
        // index + hiddens
        var $index = ($i+1)+'<input type="hidden" name="osprodutopeca_uti[]" value="'+$uti+'" /><input type="hidden" name="osprodutopeca_lab[]" value="'+$lab+'" /><input type="hidden" name="osprodutopeca_res[]" value="'+$res+'" /><input type="hidden" name="osprodutopeca_id[]" class="osprodutopeca_id" value="'+$val.osprodutopeca_id+'" /><input type="hidden" name="produto_id_peca[]" value="'+$val.produto_id_peca+'" />';
        //Status Estoque  
        var $estoque = getTableStatus($val.estoque);
        //Falha   
        var $falha = '('+$val.defeito_id+') '+$val.defeito_titulo;
        //Solução 
        var $solucao = '('+$val.servico_id+') '+$val.servico_titulo;
        //SI - Peça   
        var $peca = (!empty($val.produto_id_peca)) ? $val.produto_codigo+' - '+$val.produto_descricao : '';
        //Qtde disponivel em estoque
        var $qtdEstoque = getQtdEstoqueStatus($val.estoque, $status_disponivel);
        //Qtde    
        var $inputQtd = '<div class="input-control"><input type="number" disabled name="osprodutopeca_qtde[]" step="1" min="1" value="'+$val.osprodutopeca_qtde+'" /></div>';
        //Valor Venda 
        var $inputValor = '<div class="input-control"><input type="text" class="decimals" name="osprodutopeca_valor_venda[]" value="'+$val.osprodutopeca_valor_venda.replace('.', ',')+'" /></div>';
        // M.O.    
        var $inputMO = '<div class="input-control"><input type="text" class="decimals" name="osprodutopeca_valor_mao_obra[]" value="'+$val.osprodutopeca_valor_mao_obra.replace('.', ',')+'" /></div>';
        // acao
        var $action = '<a href="javascript: void(0);" onclick="updListaSolucoes('+$i+');" title="Alterar" alt="Alterar"><i class="icon-save"></i></a>';

        var $tr = '<tr><td>'+$index+'</td><td>'+$estoque+'</td><td>'+$falha+'</td><td>'+$solucao+'</td><td>'+$peca+'</td><td>'+$qtdEstoque+'</td><td>'+$inputQtd+'</td><td>'+$inputValor+'</td><td>'+$inputMO+'</td><td>'+$val.valor_total+'</td><td>'+$action+'</td></tr>';
        $html.push($tr);
        // soma as parciais
        $total_pecas += parseFloat($val.osprodutopeca_valor_venda) * parseInt($val.osprodutopeca_qtde);
        $total_mao_obra += parseFloat($val.osprodutopeca_valor_mao_obra) * parseInt($val.osprodutopeca_qtde);
    });   
    var $total_geral = ($total_pecas + $total_mao_obra).toFixed(2);
    // adiciona os totais
    $html.push('<tr><td colspan="7">Totais</td><td>'+$total_pecas.toFixed(2)+'</td><td>'+$total_mao_obra.toFixed(2)+'</td><td>'+$total_geral+'</td><td><a href="javascript: void(0);" onclick="updListaSolucoes(-1);" title="Salvar Todos" alt="Salvar Todos"><i class="icon-save"></i></a></td></tr>');

    $("#os_valor_pecas, #os_valor_liquido_pecas").val($total_pecas.toFixed(2));
    $("#os_valor_maodeobra, #os_valor_liquido_maodeobra").val($total_mao_obra.toFixed(2));
    $("#os_valor_total, #os_valor_liquido").val($total_geral);

    calculaDesconto();

    return $html.join(''); 
}

function __listaAgPeca($json)
{
    var $html = [];
    $.each($json, function($i, $val) {
        // checa se ha pecas utilizadas
        var $uti = getQtdEstoqueStatus($val.estoque, $status_utilizado);
        // checa se ha pecas no laboratorio (deprecated)
        var $lab = getQtdEstoqueStatus($val.estoque, $status_laboratorio);
        // checa se ha pecas reservadas (deprecated)
        var $res = getQtdEstoqueStatus($val.estoque, $status_reservado);
        // index + hiddens
        var $index = ($i+1)+'<input type="hidden" name="osprodutopeca_uti[]" value="'+$uti+'" /><input type="hidden" name="osprodutopeca_lab[]" value="'+$lab+'" /><input type="hidden" name="osprodutopeca_res[]" value="'+$res+'" /><input type="hidden" name="osprodutopeca_id[]" class="osprodutopeca_id" value="'+$val.osprodutopeca_id+'" /><input type="hidden" name="produto_id_peca[]" value="'+$val.produto_id_peca+'" />';
        //Status Estoque  
        var $estoque = getTableStatus($val.estoque);
        //Falha   
        var $falha = '('+$val.defeito_id+') '+$val.defeito_titulo;
        //Solução
        var $solucao = '('+$val.servico_id+') '+$val.servico_titulo;
        //SI - Peça   
        var $peca = (!empty($val.produto_id_peca)) ? $val.produto_codigo+' - '+$val.produto_descricao : '';

        var $troca = '<a href="javascript: void(0);" onclick="trocarProduto(\''+$os.produto_titulo+'\', \''+$val.produto_tipo_material+'\', '+$val.osprodutopeca_qtde+', '+$val.servico_id+', '+$val.defeito_id+', '+$i+')" title="Trocar Produto"><i class="icon-pencil"></i></a>';
        // botao excluir
        var $dlt = '<a href="javascript: void(0);" onclick="dltListaSolucoes('+$i+', false);" title="Excluir" alt="Excluir"><i class="icon-cancel"></i></a>';        

        if(empty($val.produto_id_peca))
        {
            $troca = '';
            $dlt = '';
        }    
        //Qtde disponivel em estoque
        var $qtdEstoque = getQtdEstoqueStatus($val.estoque, $status_disponivel);
        //Qtde    
        var $inputQtd = '<div class="input-control"><input type="number" disabled name="osprodutopeca_qtde[]" step="1" min="1" value="'+$val.osprodutopeca_qtde+'" /></div>';
        //Qtde reuso
        var $inputQtdReuso = '<div class="input-control"><input type="number" name="qtde_reuso[]" step="1" min="0" max="'+$val.osprodutopeca_qtde+'" value="'+$val.qtde_reuso+'" disabled /></div>';         

        var $tr = '<tr><td>'+$index+'</td><td>'+$falha+'</td><td>'+$solucao+'</td><td>'+$peca+'</td><td>'+$inputQtd+'</td><td>'+$inputQtdReuso+'</td><td>'+$qtdEstoque+'</td><td>'+$estoque+'</td><td>'+$dlt+$troca+'</td></tr>';
        $html.push($tr);
    });   

    return $html.join(''); 
}

function __listaReparo($json)
{
    var $html = [];
    $.each($json, function($i, $val) {
        // checa se ha pecas no laboratorio (os retornada)
        var $lab = getQtdEstoqueStatus($val.estoque, $status_laboratorio);
        // checa se ha pecas reservadas
        var $res = getQtdEstoqueStatus($val.estoque, $status_reservado);
        // index + hiddens
        var $index = ($i+1)+'<input type="hidden" name="osprodutopeca_lab[]" value="'+$lab+'" /><input type="hidden" name="osprodutopeca_res[]" value="'+$res+'" /><input type="hidden" name="osprodutopeca_id[]" class="osprodutopeca_id" value="'+$val.osprodutopeca_id+'" /><input type="hidden" name="produto_id_peca[]" value="'+$val.produto_id_peca+'" />';
        //Status Estoque  
        var $estoque = getTableStatus($val.estoque);
        //Falha   
        var $falha = '('+$val.defeito_id+') '+$val.defeito_titulo;
        //Solução 
        var $solucao = '('+$val.servico_id+') '+$val.servico_titulo;
        //SI - Peça   
        var $peca = (!empty($val.produto_id_peca)) ? $val.produto_codigo+' - '+$val.produto_descricao : '';
        //Qtde disponivel em estoque
        var $qtdEstoque = getQtdEstoqueStatus($val.estoque, $status_disponivel);
        //Qtde    
        var $inputQtd = '<div class="input-control"><input type="number" disabled name="osprodutopeca_qtde[]" step="1" min="1" value="'+$val.osprodutopeca_qtde+'" /></div>';
        //Qtde reuso
        var $inputQtdReuso = '<div class="input-control"><input type="number" name="qtde_reuso[]" step="1" min="0" max="'+$val.osprodutopeca_qtde+'" value="'+$val.qtde_reuso+'" disabled /></div>';         
        //Qtde utilizada
        var $inputQtdUti = '<div class="input-control"><input type="number" name="osprodutopeca_uti[]" step="1" min="0" max="'+$val.osprodutopeca_qtde+'" value="'+$val.osprodutopeca_qtde+'" /></div>';        

        var $laudo = '<a href="javascript: void(0);" onclick="dialogGeraLaudoSolucoes('+$i+');" title="Imprimir laudo" alt="Imprimir laudo"><i class="icon-printer"></i></a>'; 

        var $tr = '<tr><td>'+$index+'</td><td>'+$falha+'</td><td>'+$solucao+'</td><td>'+$peca+'</td><td>'+$inputQtd+'</td><td>'+$inputQtdReuso+'</td><td>'+$inputQtdUti+'</td><td>'+$qtdEstoque+'</td><td>'+$estoque+'</td><td>'+$laudo+'</td></tr>';
        $html.push($tr);
    });   

    return $html.join(''); 
}

function __listaDefault($json)
{
    var $html = [];
    $.each($json, function($i, $val) {
        //Falha   
        var $falha = '('+$val.defeito_id+') '+$val.defeito_titulo;
        //Solução 
        var $solucao = '('+$val.servico_id+') '+$val.servico_titulo;
        //SI - Peça   
        var $peca = (!empty($val.produto_id_peca)) ? $val.produto_codigo+' - '+$val.produto_descricao : '';   

        var $tr = '<tr><td>'+($i+1)+'</td><td>'+$falha+'</td><td>'+$solucao+'</td><td>'+$peca+'</td><td>'+$val.osprodutopeca_qtde+'</td></tr>';
        $html.push($tr);
    });   

    return $html.join(''); 
}

//calcula os descontos do orcamento
function calculaDesconto()
{
    var $tx_orcamento          = parseFloat($("#taxa_deslocamento").val().replace(',', '.'));
    var $os_desconto_pecas     = parseFloat($("#os_desconto_pecas").val().replace(',', '.'));
    var $os_desconto_maodeobra = parseFloat($("#os_desconto_maodeobra").val().replace(',', '.'));
    var $desconto_pecas        = ($("#os_valor_pecas").val() - $os_desconto_pecas).toFixed(2);
    var $desconto_maodeobra    = ($("#os_valor_maodeobra").val() - $os_desconto_maodeobra).toFixed(2);
    var $desconto_total        = $os_desconto_pecas + $os_desconto_maodeobra;
    var $total_liquido         = parseFloat($("#os_valor_total").val()) - $desconto_total + $tx_orcamento;

    $("#os_valor_liquido_pecas").val($desconto_pecas);
    $("#os_valor_liquido_maodeobra").val($desconto_maodeobra);
    $("#os_desconto_total").val($desconto_total.toFixed(2));
    $("#os_valor_liquido").val($total_liquido.toFixed(2));
}

// adiciona uma falha / solucao / peca a os
function addListaSolucoes()
{
    var $produto_id_peca  = $("#produto_id_peca").val();
    var $servico_id       = parseInt($("#servico_id").val()) || 0;
    var $defeito_id       = parseInt($("#defeito_id").val()) || 0;
    var $obrigatorio_peca = $("#servico_id").find("option:selected").attr('obrigatorio_peca');
    var $qtde             = $("#qtde").val();

    if(empty($defeito_id))
    {
        alert('Selecione uma falha!');
        $("#defeito_id").focus();
        return false;
    }

    if(empty($servico_id))
    {
        alert('Selecione uma solucao!');
        $("#servico_id").focus();
        return false;
    }    
    
    // exibe a AT para escolanamento
    if($servico_id == 10 || $servico_id == 34)
    {
        if(!getAtDestino())
        {
            alert("AT de destino não encontrada!");
            return false;
        }
    }

    if($temSwap && $obrigatorio_peca == 'S')
    {
        alert('Para inserir uma peca, primeiro remova o swap da lista!');
        return false;
    }

    if($.inArray($servico_id, [13, 101, 11]) >= 0 && $temPeca == 1)
    {
        alert('Remova as pecas antes de realizar um swap');
        return false;
    }

    // checa se é laudo
    if($servico_id == 25)
    {      
        dialogFoto($os.os_id, 'gerenciar');
    }

    $(".modal").show();

    var $params = {
        os_id: $os.os_id,
        clienteconfig_id: $os.clienteconfig_id,
        produto_id: $os.produto_id,
        produto_id_peca: $produto_id_peca,
        qtde: $qtde,
        servico_id: $servico_id,
        defeito_id: $defeito_id,
        obrigatorio_peca: $obrigatorio_peca,
        acao: 'add_lista_solucao',
        reserva_peca: 0
    };

    $.ajax({
      type: "POST",
      url: 'os_estoque.php',
      data: $params,
      async: false,
      success: function($data) {
        alert($data);
        if($data == "Cadastro realizado com sucesso!")
        {
            getListaSolucoes();    
            $("#defeito_id, #servico_id, #produto_id_peca, #qtde_estoque, #qtde").val(0);
            $("#servico_id, #servico_id, #produto_id_peca").empty();          
            $(".peca_lista_combobox").css('visibility', 'hidden');
        }
      }
    });

    $(".modal").hide();
}

// exclui uma falha / solucao / peca da os_id
function dltListaSolucoes($index, $exchange)
{
    if(!$exchange)
    {
        if(!confirm("Deseja realmente excluir?"))
            return false;        
    }

    $("#acao").val("dlt_lista_solucao");
    $.ajax({
      type: "POST",
      url: 'os_estoque.php',
      data: $("#frm_cadastro").serialize()+'&index='+$index,
      async: false,
      success: function($data) {
        if(!$exchange)
        {
            alert($data);
            getListaSolucoes();
        }       
      }
    });
}

// gera laudo da falha / solucao / peca da os_id
function dialogGeraLaudoSolucoes($index){
    $.Dialog({
        'title'      : 'Laudo',
        'content'    : getLaudoModelo($index),
        'draggable'  : true,
        'keepOpened' : true,
        'closeButton': true,         
        'buttonsAlign': 'right',
        'position'   : {
                        'offsetY' : 300,
                        'offsetX' : 600
        },          
        'buttons'    : {
            'OK' : {
                'action': function() {
                    var modelo_laudo = $("#modelo_laudo").val();
                    window.open("laudo_tecnico.php?clienteconfig_id="+$os.clienteconfig_id+"&os_id="+$os.os_id+"&modelo_laudo="+modelo_laudo);
                }
            },
            'Cancelar'   : {
                'action': function() {}
            }
        }
    });
}

function getLaudoModelo($index){
    $("#acao").val("get_laudo_modelo");
    var dialog_filtro = '';
    $.ajax({
      type: "POST",
      url: 'os_estoque.php',
      data: $("#frm_cadastro").serialize()+'&index='+$index,
      async: false,
      success: function(data) {
        dialog_filtro = data;
      }
    });
    return dialog_filtro;
}


// troca produto
function trocarProduto($produto_titulo, $produto_tipo_material, $qtde, $servico_id, $defeito_id, $index){
    $.Dialog({
        'title'      : 'Trocar Produto',
        'content'    : getMatrizTroca($produto_titulo, $produto_tipo_material),
        'draggable'  : true,
        'keepOpened' : true,
        'closeButton': true,         
        'buttonsAlign': 'right',
        'position'   : {
            'offsetY' : 300,
            'offsetX' : 300
        },          
        'buttons'    : {
            'OK' : {
                'action': function() {
                    var $produto_id_peca = $("#produto_id_peca_troca").val();
                    if(empty($produto_id_peca))
                    {
                        alert('Escolha uma peca para substituir');
                        return false;
                    }
                    dltListaSolucoes($index, true); // exclui o antigo e remove reserva
                    var $params = {
                        os_id: $os.os_id,
                        clienteconfig_id: $os.clienteconfig_id,
                        produto_id: $os.produto_id,
                        produto_id_peca: $produto_id_peca,
                        qtde: $qtde,
                        servico_id: $servico_id,
                        defeito_id: $defeito_id,
                        obrigatorio_peca: 'S',
                        acao: 'add_lista_solucao',
                        reserva_peca: 1
                    };

                    $.ajax({
                      type: "POST",
                      url: 'os_estoque.php',
                      data: $params,
                      async: false,
                      success: function($data) {
                        console.dir($data);
                        alert("Troca efetuada com sucesso!");
                        getListaSolucoes();
                      }
                    });
                }
            },
            'Cancelar'   : {
                'action': function() {}
            }
        }
    });
}

function getMatrizTroca($produto_titulo, $produto_tipo_material){
    var dialog_filtro = '';
    $.ajax({
      type: "POST",
      url: 'os_estoque.php',
      data: {
        acao: 'get_matriz_troca',
        produto_titulo: $produto_titulo,
        produto_tipo_material: $produto_tipo_material,
        os_id: $os.os_id,
        produto_id: $os.produto_id
      },
      async: false,
      success: function(data) {
        dialog_filtro = data;
      }
    });
    return dialog_filtro;
}


function updListaSolucoes($index)
{
    $("#acao").val("upd_lista_solucao");
    $.ajax({
      type: "POST",
      url: 'os_estoque.php',
      data: $("#frm_cadastro").serialize()+'&index='+$index,
      async: false,
      success: function($data) {
        alert($data);
        getListaSolucoes();       
      }
    });
}

function movimentaEstoque()
{
    $("#acao").val("movimenta_estoque");
    $.ajax({
      type: "POST",
      url: 'os_estoque.php',
      data: $("#frm_cadastro").serialize()+'&temPeca='+$temPeca+'&temEstoque='+$temEstoque,
      async: false,
      success: function($data) {
        console.dir($data);
      }
    });
}

// pega e exibe a AT que vai receber o produto (SL3). Retorna false se nao encontrar nenhuma
function getAtDestino()
{
    $achou = false;
    $.ajax({
        url: 'os_controle_acao.php',
        type: 'POST',
        async: false,
        data: {
            acao_id: 'busca_at',
            os_tipo: 'balcao',
            uf: $os.empresa_uf,
            cidade_nome: $os.empresa_cidade,
            modelo: $os.produto_titulo
        },
        success: function($data)
        {
            if(empty($data))
            {
                alert("AT nao encontrada!");
                $achou = false;
                return false;
            }
            else
                $achou = true;
            var $json = $.parseJSON($data);
            $("#at-destino-box").show();
            $("#at-destino").val($json.empresa_razao_social);
            $("#clienteconfig_id_sl3").val($json.clienteconfig_id);
        }
    })
    .fail(function($e) {
        console.dir($e);
    });     

    return $achou;       
}

// envia a remessa
function PreparaEscalado($clienteconfig_id_sl3){
    var ok = '0';
     $.ajax({
            url: 'os_controle_aguarda_analise_acao.php',
            type: 'POST',
            async: false,
            data: {
                acao: 'prepara_remessa',
                clienteconfig_id_sl3: $clienteconfig_id_sl3,
                os_id: $os.os_id,
                produto_modelo : $os.produto_titulo,
                empresa_uf_id  : $os.empresa_uf_id,
                empresa_cidade_id :  $os.empresa_cidade_id
            },
            dataType:'json',
            success: function($data)
            {
                //alert(data);
                if(empty($data)){
                    alert("Falha na remessa!");
                    return false;
                }else{

                    if($data.msg_erro != ''){
                        alert($data.msg_erro);
                        ok = '1';
                    }
                    else if($data.remessa_id != ''){
                        alert("Produto Escalado! Remessa Num.: " + $data.remessa_id );
                        ok = '0';
                    }
                }
            }
      })
      .fail(function($e) {
          console.dir($e);
      });

      return ok;
}

// envia a remessa
function devolveRemessa($clienteconfig_id_sl1){
    var ok = '0';
     $.ajax({
            url: 'os_controle_aguarda_analise_acao.php',
            type: 'POST',
            async: false,
            data: {
                acao: 'devolve_remessa',
                clienteconfig_id_sl1: $clienteconfig_id_sl1,
                os_id: $os.os_id,
                produto_modelo : $os.produto_titulo,
                empresa_uf_id  : $os.empresa_uf_id_sl1,
                empresa_cidade_id :  $os.empresa_cidade_id_sl1
            },
            dataType:'json',
            success: function($data)
            {
                //alert(data);
                if(empty($data)){
                    alert("Falha na remessa!");
                    return false;
                }else{

                    if($data.msg_erro != ''){
                        alert($data.msg_erro);
                        ok = '1';
                    }
                    else if($data.remessa_id != ''){
                        alert("Produto Escalado! Remessa Num.: " + $data.remessa_id );
                        ok = '0';
                    }
                }
            }
      })
      .fail(function($e) {
          console.dir($e);
      });

      return ok;
}

// seta o status_id_novo de acordo com a situacao
function setOsStatus($lista_solucoes)
{
    // reseta as variaveis globais para evitar erros
    $temPeca    = 0; // verifica se uma peca foi atrelada a OS
    $temEstoque = 1; // verifica se as pecas atreladas a OS tem em estoque disponivel
    $escalonado = 0; // verifica se a OS foi escalonada
    $temSwap    = 0; // verifica se houve troca do produto    
    $obgIMEI    = 0; // verifica a obrigatoriedade do imei novo no reparo

    // varre a lista de solucoes para identificar as regras
    $.each($lista_solucoes, function($i, $val) {
        // checa se foi escalonado
        if(parseInt($val.servico_id) == 10 || parseInt($val.servico_id) == 34)
        {
            getAtDestino();
            $escalonado = 1;
        }
        // checa se tem peca atrelada
        if(!empty($val.produto_id_peca))
        {
            $temPeca = 1;
            // checa o estoque
            $disponivel = getQtdEstoqueStatus($val.estoque, $status_disponivel);
            // checa se a qtde requerida ja esta em laboratorio
            $reuso = $val.qtde_reuso;
            $lab  = getQtdEstoqueStatus($val.estoque, $status_laboratorio);
            if(parseInt($val.osprodutopeca_qtde) > (parseInt($disponivel) + parseInt($lab) + parseInt($reuso)))
                $temEstoque = 0;
            // checa se tem swap
            if(parseInt($val.obgIMEI) == 1)
                $obgIMEI = 1;

            if(parseInt($val.swap) == 1)
            {
                $temSwap = 1;
                $("#os_produto_codigo_troca").val($val.produto_codigo);
                $("#os_modelo_troca").val($val.produto_titulo);
            }
        }
    });


    // seta o status
    switch(parseInt($os.status_id))
    {
        // ag analise SL1
        case 8: 
        {
            if($escalonado > 0)
                $("#status_id_novo").val(21);
            else
            {
                $("#status_id_novo").val(9); // reparo
                $("#at-destino-box").hide(); // esconde at de remessa
            }
        } break;

        // ag analise SL3
        case 10: 
        {
            if($os.os_cobertura == 'Fora de Garantia')
                $("#status_id_novo").val(12); // aguarda orcamento
            else if($temPeca > 0)
            {
                if($temEstoque > 0)
                    $("#status_id_novo").val(14); // era reparo (16)
                else
                    $("#status_id_novo").val(14); // aguarda peca
                
            }
            else
                $("#status_id_novo").val(16); // nao tem peca, vai pro reparo direto
        } break;

        // ag ap. orcamento
        case 12: $("#status_id_novo").val(13); break; 

        // aprova orcamento
        case 13: 
        {
            if($temPeca > 0)
            {
                if($temEstoque > 0)
                    $("#status_id_novo").val(14); // era reparo (16)
                else
                    $("#status_id_novo").val(14); // aguarda peca              
            }
            else
                $("#status_id_novo").val(16); // nao tem peca, vai pro reparo direto            
        } break;

        // ag peca
        case 14: 
        {
            $(".os_sub_status").empty();
            $(".os_sub_status").append('<option selected disabled value="#">Selecione...</option>');
            if($temEstoque > 0)
            {
                $("#status_id_novo").val(14); // era reparo (16)
                $(".os_sub_status").append('<option value="Aguardando atendimento">Aguardando atendimento</option>');
            }
            else              
            {
                $("#status_id_novo").val(14); // aguarda peca          
                $(".os_sub_status").append('<option value="Aguardando pedido de peca">Aguardando pedido de peca</option>');
                $(".os_sub_status").append('<option value="Pedido solicitado">Pedido solicitado</option>');
            }
        } break;

        case 18:
        case 9: {

        } break;

        // reparo
        case 16: 
        {
            if(!empty($os.clienteconfig_id_sl1))
                $("#status_id_novo").val(38);

            if($obgIMEI == 1)
                $(".swap").show();
            else
                $(".swap").hide();

        } break;

        default: alert('setOsStatus: Status nao encontrado!');
    }
}

// checa se uma variavel esta vazia
function empty (mixedVar) 
{
	var undef
	var key
	var i
	var len
	var emptyValues = [undef, null, false, 0, '', '0', '[]', '{}'];

	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixedVar === emptyValues[i]) {
			  return true
		}
	}

	if (typeof mixedVar === 'object') {
		for (key in mixedVar) {
			if (mixedVar.hasOwnProperty(key))
			    return false
		}
		return true
	}

	return false
}