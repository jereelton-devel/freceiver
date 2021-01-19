/*
'##################################################################################################'
'#  			Classe:      ItemUI                                                                 #'
'																							                                                    #'
'##################################################################################################'
*/
function EstoqueUI() {
	this.form	= null;
	this.cliente_id = 0;
	this.clienteconfig_id = 0;
	this.categoria_id = 0;
	valor_compra = 0.00;
	valor_imposto = 0.00;
	valor_venda = 0.00;
	minimo = 0.00;
	maximo = 0.00;
	devolucao_requerida = "";
	this.objEstoqueColecao	= new EstoqueColecao();
}

/*
'##################################################################################################'
'#                                       Método: TotalAdicionados                                        																															#'
'##################################################################################################'
*/
EstoqueUI.prototype.TotalAdicionados = function(){
	return this.EstoqueColecao.length();
}

/*
'##################################################################################################'
'#                                       Método: Adicionar                                        #'
'##################################################################################################'
*/
EstoqueUI.prototype.Adicionar = function(){

	var estoque_cliente_id  = $('#cliente_id');
	var estoque_clienteconfig_id  = $('#clienteconfig_id');
	var estoque_categoria_id = $("#categoria_id");
	var estoque_valor_compra = $("#estoque_valor_compra");
	var estoque_valor_imposto = $("#estoque_valor_imposto");
	var estoque_valor_venda = $("#estoque_valor_venda");
	var estoque_minimo = $("#estoque_minimo");
	var estoque_maximo = $("#estoque_maximo");
	var estoque_devolucao_requerida = $("input[name=estoque_devolucao_requerida]");

	if(estoque_cliente_id.val() == ''){
   		alert('Selecione o cliente da Care');
    	estoque_cliente_id.focus();
    	return false;
  	}

  	if(estoque_clienteconfig_id.val() == ''){
    	alert('Selecione a configuração do cliente ');
    	estoque_clienteconfig_id.focus();
    	return false;
  	}

  	if(estoque_categoria_id.val() == ''){
    	alert('Selecione o nome do estoque');
    	estoque_categoria_id.focus();
    	return false;
  	}

  	
  	if(estoque_valor_compra.val() == ''){
  		alert('Inforne o valor de compra do produto');
    	estoque_valor_compra.focus();
    	return false;
  	}

  	if(estoque_valor_imposto.val() == ''){
  		alert('Inforne o valor do imposto do produto');
    	estoque_valor_imposto.focus();
    	return false;
  	}

  	if(estoque_valor_venda.val() == ''){
  		alert('Informe o valor de venda do produto ');
    	estoque_valor_venda.focus();
   	 	return false;
  	}

  	if(estoque_minimo.val() == ''){
  		alert('Informe o limite minimo em estoque do produto ');
    	estoque_minimo.focus();
    	return false;
  	}	

  	if(estoque_maximo.val() == ''){
  		alert('Inforne o limite maximo em estoque do produto ');
    	estoque_maximo.focus();
    	return false;
  	}

  	if(estoque_devolucao_requerida.val() == ''){
		alert('Selecione se a devolução é requerida');
    	estoque_devolucao_requerida.focus();
    	return false;
 	}

  	var objeEstoque = new Estoque();
  	var UniqueID = this.objEstoqueColecao.uniqueID++;
  	
    objeEstoque.cliente_id = estoque_cliente_id.val();
	objeEstoque.clienteconfig_id = estoque_clienteconfig_id.val();
	objeEstoque.categoria_id = estoque_categoria_id.val();
	objeEstoque.valor_compra =  estoque_valor_compra.val();
	objeEstoque.valor_imposto =  estoque_valor_imposto.val();
	objeEstoque.valor_venda = estoque_valor_venda.val();
	objeEstoque.minimo = estoque_minimo.val();
	objeEstoque.maximo = estoque_maximo.val();
	objeEstoque.devolucao_requerida = estoque_devolucao_requerida.val();
    	
   	this.objEstoqueColecao.Adicionar(objeEstoque);	
    
	item  = "<tr>";
	item +=  "<td><input type='checkbox' class='checkboxRemove' name='checkboxEstoque[]' value='" + UniqueID +"' /></td>";
	item +=    "<td>" + estoque_cliente_id.children(':selected').text() + "</td>";
	item +=    "<td>" + estoque_clienteconfig_id.children(':selected').text() + "</td>";
	item +=    "<td>" + estoque_categoria_id.children(':selected').text() + "</td>";
	item +=    "<td>" + estoque_minimo.val() + "</td>";
	item +=    "<td>" + estoque_maximo.val() + "</td>";
	item +=    "<td>" + estoque_valor_compra.val() + "</td>";
	item +=    "<td>" + estoque_valor_venda.val() + "</td>";
	item +=  "</tr>";
	
  $("#tbl_estoque").append(item);
	
	this.LimparCampos();
}

/*
'##################################################################################################'
'#                                       Método: Editar																																		                                         #'
'##################################################################################################'
*/

EstoqueUI.prototype.Editar = function(){
  
	var objEstoqueID = $("[name='checkboxEstoque[]']");
	

	if(objEstoqueID == null) return;

    if(objEstoqueID.filter(":checked").length == 0){
      alert("Selecione um item para editar.");
      return;
    }
	 
    if(objEstoqueID.filter(":checked").length > 1){
      alert("Selecione apenas um item para editar.");
      return;
    }
	
    objEstoqueID = this.objEstoqueColecao.getItem(this.objEstoqueColecao.getIndexById(objEstoqueID.filter(":checked").val()));

	$('#cliente_id').val(objEstoqueID.cliente_id);
	setaClienteConfig();

    $('#clienteconfig_id').val(objEstoqueID.clienteconfig_id);
    $('#categoria_id').val(objEstoqueID.categoria_id);
    $('#estoque_valor_compra').val(objEstoqueID.valor_compra);
    $('#estoque_valor_imposto').val(objEstoqueID.valor_imposto);
    $('#estoque_valor_venda').val(objEstoqueID.valor_venda);
    $('#estoque_minimo').val(objEstoqueID.minimo);
    $('#estoque_maximo').val(objEstoqueID.maximo);
    $('#estoque_devolucao_requerida').val(objEstoqueID.devolucao_requerida)

	this.Remover();
	
}

/*
'##################################################################################################'
'#                                       Método: Remover																																		                                         #'
'##################################################################################################'
*/

EstoqueUI.prototype.Remover = function(){
	var objEstoqueID = $("[name='checkboxEstoque[]']");
	if(objEstoqueID == null) return;
	
	if(objEstoqueID.filter(":checked").length == 0){
		alert("Selecione no minimo um item para remover.");
		return;
  }	 
	 
	 colecao = this.objEstoqueColecao;
	 objEstoqueID.filter(":checked").each(function(){
	    if($(this).val() != 'on'){
			$(this).parent().parent().remove();
			colecao.Remover(colecao.getIndexById($(this).val()));
		}	
		$(this).attr("checked",false);
	 });
}


/*
'##################################################################################################'
'#                                       Método: LimparCampos																																                                         #'
'##################################################################################################'
*/

EstoqueUI.prototype.LimparCampos = function(){
    
	$("#estoque").find(":input").each(function(){
	  switch(this.type) {
		case 'select-one':
		case 'text':
	    case 'textarea':
	        $(this).val('');
	        break;
	     case 'radio':
	     	$(this).attr("checked",false);
	  }
	});
}


/*
'##################################################################################################'
'#                                       Método: Processar																																	                                         #'
'##################################################################################################'
*/

EstoqueUI.prototype.Processar = function(){
	all_estoque = $("#AllEstoque");
	all_estoque.val('');
	var valor = '';
	for(indx=0;indx< this.objEstoqueColecao.length();indx++){
		objeEstoque = this.objEstoqueColecao.getItem(indx);
		
		valor += '[campo]'+  objeEstoque.cliente_id;
		valor += '[campo]'+  objeEstoque.clienteconfig_id;
		valor += '[campo]'+  objeEstoque.categoria_id;
		valor += '[campo]'+  objeEstoque.valor_compra;
		valor += '[campo]'+  objeEstoque.valor_imposto;
		valor += '[campo]'+  objeEstoque.valor_venda;
		valor += '[campo]'+  objeEstoque.minimo;
		valor += '[campo]'+  objeEstoque.maximo;
		valor += '[campo]'+  objeEstoque.devolucao_requerida;


		if(indx<this.objEstoqueColecao.length()-1)
			valor += '[estoque]';
	}
	all_estoque.val(valor);
}

/*'##################################################################################################'
'#                                       Método: ReloadFromText																															                                         #'
'##################################################################################################'
*/

EstoqueUI.prototype.ReloadFromText = function(text){
	var arraEstoque, arraEstoqueCampos;

	if(text != ""){
		arraEstoque = text.split("[estoque]");

		for(var indx=0;indx< arraEstoque.length;indx++){
			
      		if(arraEstoque[indx] != ''){
        		arraEstoqueCampos = arraEstoque[indx].split("[campo]");

        		$("#cliente_id").val(arraEstoqueCampos[1]);
        		//Carregar Lista de Config da Care
        		setaClienteConfig();
        		$("#clienteconfig_id").val(arraEstoqueCampos[2]);
        		$("#categoria_id").val(arraEstoqueCampos[3]);        		
        		$("#estoque_valor_compra").val(arraEstoqueCampos[4]);
        		$("#estoque_valor_imposto").val(arraEstoqueCampos[5]);
        		$("#estoque_valor_venda").val(arraEstoqueCampos[6]);
        		$("#estoque_minimo").val(arraEstoqueCampos[7]);
        		$("#estoque_maximo").val(arraEstoqueCampos[8]);
				$("#estoque_devolucao_requerida").val(arraEstoqueCampos[9]);

        		this.Adicionar();
	      	}
		}
	}
}