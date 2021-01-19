/*
'##################################################################################################'
'#  			Classe:      ItemUI                                                                 #'
'																							                                                    #'
'##################################################################################################'
*/
function NfItemUI() {
	this.form	= null;
	this.cod_prod = "";
	this.desc = '';
	this.qtde = 0.00;
	this.valor_unit = 0.00;
	this.pallet_id = "";
	this.objItemColecao	= new NfItemColecao();
}

/*
'##################################################################################################'
'#                                       Método: TotalAdicionados                                        																															#'
'##################################################################################################'
*/
NfItemUI.prototype.TotalAdicionados = function(){
	return this.objItemColecao.length();
}

/*
'##################################################################################################'
'#                                       Método: Adicionar                                        #'
'##################################################################################################'
*/
NfItemUI.prototype.Adicionar = function(){

	var det_prod_cProd  = $('#det_prod_cProd');
	var det_prod_xProd  = $('#det_prod_xProd');
	var det_prod_qCom = $("#det_prod_qCom");
	var det_prod_vUnCom = $("#det_prod_vUnCom");
	var pallet_id = $("#pallet_id").val();
	var arr_pallet = pallet_id.split("###");
	var pallet_descricao = arr_pallet[1];
	pallet_id = arr_pallet[0];

  if(det_prod_cProd.val() == ''){
    alert('Informe o código do produto');
    det_prod_cProd.focus();
    return false;
  }


  if(det_prod_xProd.val() == ''){
    alert('Informe a descrição do produto');
    det_prod_xProd.focus();
    return false;
  }

  if(det_prod_qCom.val() == ''){
    alert('Informe a quantidade');
    det_prod_qCom.focus();
    return false;
  }

  if(det_prod_vUnCom.val() == ''){
    alert('Informe o valor unitario');
    det_prod_vUnCom.focus();
    return false;
  }
	
  var objeNfItem = new NfItem();
  var UniqueID = this.objItemColecao.uniqueID++;

  with(objeNfItem){
    cod_prod  = det_prod_cProd.val();
    desc        = det_prod_xProd.val();
    qtde        = det_prod_qCom.val();
    valor_unit  = det_prod_vUnCom.val();
    pallet_id   = $("#pallet_id").val();
   }

   	this.objItemColecao.Adicionar(objeNfItem);
	

	item  = "<tr>";
	item +=  "<td align='center'><input type='checkbox' class='checkboxRemove' name='checkboxItem[]' value='" + UniqueID +"' /></td>";
	item +=    "<td>" + det_prod_cProd.val() + "</td>";
	item +=    "<td>" + det_prod_xProd.val() + "</td>";
	item +=    "<td>" + det_prod_qCom.val() + "</td>";
	item +=    "<td>" + det_prod_vUnCom.val() + "</td>";
	item +=    "<td>" + pallet_descricao + "</td>";
	item +=  "</tr>";
	
  $("#tbl_itens").append(item);
	
	this.LimparCampos();
}

/*
'##################################################################################################'
'#                                       Método: Editar																																		                                         #'
'##################################################################################################'
*/

NfItemUI.prototype.Editar = function(){
  
	var objItemID = $("[name='checkboxItem[]']");
	

	if(objItemID == null) return;

    if(objItemID.filter(":checked").length == 0){
      alert("Selecione um item para editar.");
      return;
    }
	 
    if(objItemID.filter(":checked").length > 1){
      alert("Selecione apenas um item para editar.");
      return;
    }
	
    objItem = this.objItemColecao.getItem(this.objItemColecao.getIndexById(objItemID.filter(":checked").val()));

    $('#det_prod_cProd').val(objItem.cod_prod);
	$('#det_prod_xProd').val(objItem.desc);
	$("#det_prod_qCom").val(objItem.qtde);
	$("#det_prod_vUnCom").val(objItem.valor_unit);
	this.Remover();
	
}

/*
'##################################################################################################'
'#                                       Método: Remover																																		                                         #'
'##################################################################################################'
*/

NfItemUI.prototype.Remover = function(){
	var objItemID = $("[name='checkboxItem[]']");
	if(objItemID == null) return;
	
	if(objItemID.filter(":checked").length == 0){
		alert("Selecione no minimo um item para remover.");
		return;
  }
	 
	 
	 colecao = this.objItemColecao;
	 objItemID.filter(":checked").each(function(){
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

NfItemUI.prototype.LimparCampos = function(){
    
	jQuery("#nf_item").find(":input").each(function(){
	  switch(this.type) {
		case 'select-one':
		case 'text':
	    case 'textarea':
	        jQuery(this).val('');
	        break;
	  }
	});
}


/*
'##################################################################################################'
'#                                       Método: Processar																																	                                         #'
'##################################################################################################'
*/

NfItemUI.prototype.Processar = function(){
	all_items = $("#NfAllItems");
	all_items.val('');
	var valor = '';
	var id;
	for(indx=0;indx< this.objItemColecao.length();indx++){
		objeItem = this.objItemColecao.getItem(indx);
		
		valor += '[campo]'+  objeItem.cod_prod;
		valor += '[campo]'+  objeItem.desc;
		valor += '[campo]'+  objeItem.qtde;
		valor += '[campo]'+  objeItem.valor_unit;
		id = objeItem.pallet_id.split("###");
		valor += '[campo]'+ id[0] ;
		if(indx<this.objItemColecao.length()-1)
			valor += '[item]';
	}
	all_items.val(valor);
}

/*'##################################################################################################'
'#                                       Método: ReloadFromText																															                                         #'
'##################################################################################################'
*/

NfItemUI.prototype.ReloadFromText = function(text){
	var arraItems, arraItemCampos;

	if(text != ""){
		arraItems = text.split("[item]");

		for(var indx=0;indx< arraItems.length;indx++){
			
      		if(arraItems[indx] != ''){
        		arraItemCampos = arraItems[indx].split("[campo]");
        		$('#det_prod_cProd').val(arraItemCampos[1]);
				$('#det_prod_xProd').val(arraItemCampos[2]);
				$("#det_prod_qCom").val(arraItemCampos[3]);
				$("#det_prod_vUnCom").val(arraItemCampos[4]);

        		this.Adicionar();
	      	}
		}
	}
}