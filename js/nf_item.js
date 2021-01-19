/*
'##################################################################################################'
'#                                       CLASS: NfItem		                                        																																    #'
'##################################################################################################'
*/	

function NfItem(){
	this.id = 0;
	this.cod_prod = '';
	this.desc = '';
	this.qtde = 0.00;
	this.pallet_id = '';
	this.valor_unit = 0.00;
}

/*
'##################################################################################################'
'#                                       CLASS: ItemColecao                                  																																    #'
'##################################################################################################'
*/		

function NfItemColecao(){
	this.colecao = new Array();
	this.uniqueID = 0;
}

NfItemColecao.prototype.Adicionar = function(objItem){
    this.uniqueID++;
	objItem.id = this.uniqueID;	
	return this.colecao.push(objItem);
	
}

NfItemColecao.prototype.Remover = function(indice){
	this.colecao.splice(indice,1);
}

NfItemColecao.prototype.length = function(){
	return this.colecao.length;
}

NfItemColecao.prototype.getItem = function(index){
	return this.colecao[index];
}

NfItemColecao.prototype.setItem = function(index, Atributo){
	this.colecao[index] = Atributo;
}



NfItemColecao.prototype.getIndexById = function(id){
	for(var indx=0;indx<this.length();indx++){
	    if(parseInt(id,10) == parseInt(this.getItem(indx).id,10)){
			return indx;
		}
	} 
	
}

NfItemColecao.prototype.RemoverTodos = function(){
	this.colecao = this.colecao.splice(0);
}