/*
'##################################################################################################'
'#  			Classe:      ItemUI                                                                 #'
'																							                                                    #'
'##################################################################################################'
*/
function PecaUI() {
	this.form	= null;
	this.produto_id = 0;
	this.objPecaColecao	= new PecaColecao();
}

/*
'##################################################################################################'
'#                                       Método: TotalAdicionados                                        																															#'
'##################################################################################################'
*/
PecaUI.prototype.TotalAdicionados = function(){
	return this.PecaColecao.length();
}

/*
'##################################################################################################'
'#                                       Método: Adicionar                                        #'
'##################################################################################################'
*/
PecaUI.prototype.Adicionar = function(){
	var produto_id_peca  = $("input[name='produto_id_peca[]']").filter(':checked');
	var item = "";
     
	if(produto_id_peca.length == 0){
   		alert('Selecione um ou mais produtos');    	
    	return false;
  	}  	
  	
  	
  	var objPecaColecao = this.objPecaColecao;  	

  	$.each(produto_id_peca,function(){
  		var objePeca = new Peca();
  		UniqueID = objPecaColecao.uniqueID++;
  		
 	with(objePeca){
  		produto_id =$(this).val();
  	}

		objPecaColecao.Adicionar(objePeca);

		item  += "<tr>";
		item +=  "<td><input type='checkbox' class='checkboxRemove' name='checkboxPecas[]' value='" + UniqueID +"' /></td>";
		item +=    "<td>" + $(this).parent().text() + "</td>";
		item +=  "</tr>";

  	})
  	
   $("#tbl_pecas").append(item);
   $("#lista_produtos").html('');
   this.LimparCampos();
}


/*
'##################################################################################################'
'#                                       Método: Remover																																		                                         #'
'##################################################################################################'
*/

PecaUI.prototype.Remover = function(){
	var objPecaID = $("[name='checkboxPecas[]']");
	if(objPecaID == null) return;
	
	if(objPecaID.filter(":checked").length == 0){
		alert("Selecione no minimo um item para remover.");
		return;
 	}	 
	 
	colecao = this.objPecaColecao;
	objPecaID.filter(":checked").each(function(){
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

PecaUI.prototype.LimparCampos = function(){
    
	$("#pecas").find(":input").each(function(){
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

PecaUI.prototype.Processar = function(){
	all_peca = $("#AllPecas");
	all_peca.val('');
	var valor = '';

	for(indx=0;indx< this.objPecaColecao.length();indx++){
		objePeca = this.objPecaColecao.getItem(indx);
		
		valor += '[campo]'+  objePeca.produto_id;
				
		if(indx<this.objPecaColecao.length())
			valor += '[peca]';
	}
	all_peca.val(valor);
}

/*'##################################################################################################'
'#                                       Método: ReloadFromText																															                                         #'
'##################################################################################################'
*/

PecaUI.prototype.ReloadFromText = function(text){
	var arraPeca, arraPecaCampos;

	if(text != ""){
		arraPeca = text.split("[peca]");

		for(var indx=0;indx< arraPeca.length;indx++){
			
      		if(arraPeca[indx] != ''){
        		arraPecaCampos = arraPeca[indx].split("[campo]");

        		$("#produto_peca_id").val(arraPecaCampos[1]);
        		this.Adicionar();
	      	}
		}
	}
}


/*'##################################################################################################'
'#                                       Método: Reloadcolection																															                                         #'
'##################################################################################################'
*/

PecaUI.prototype.Reloadcolection = function(text){
	var arraPeca, arraPecaCampos;
	var objPecaColecao = this.objPecaColecao; 	
	if(text != ""){
		arraPeca = text.split("[peca]");
		for(var indx=0;indx< arraPeca.length;indx++){			
      		if(arraPeca[indx] != ''){
        		arraPecaCampos = arraPeca[indx].split("[campo]");      			
				var objePeca = new Peca();    
			 	with(objePeca){
			  		produto_id = arraPecaCampos[1];
			  	}				 
				objPecaColecao.Adicionar(objePeca);
	      	}
		}
	}
}