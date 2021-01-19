/*
'##################################################################################################'
'#                                       CLASS: Estoque	                                        																																    #'
'##################################################################################################'
*/	

function Estoque(){
	this.id = 0;
	this.cliente_id = 0;
	this.clienteconfig_id = 0;
	this.categoria_id = 0;
	valor_compra = 0.00;
	valor_imposto = 0.00;
	valor_venda = 0.00;
	minimo = 0.00;
	maximo = 0.00;
	devolucao_requerida = "";

}

/*
'##################################################################################################'
'#                                       CLASS: EstoqueColecao                                  																																    #'
'##################################################################################################'
*/		

function EstoqueColecao(){
	this.colecao = new Array();
	this.uniqueID = 0;
}

EstoqueColecao.prototype.Adicionar = function(objItem){
    this.uniqueID++;
	objItem.id = this.uniqueID;	
	return this.colecao.push(objItem);
	
}

EstoqueColecao.prototype.Remover = function(indice){
	this.colecao.splice(indice,1);
}

EstoqueColecao.prototype.length = function(){
	return this.colecao.length;
}

EstoqueColecao.prototype.getItem = function(index){
	return this.colecao[index];
}

EstoqueColecao.prototype.setItem = function(index, Atributo){
	this.colecao[index] = Atributo;
}



EstoqueColecao.prototype.getIndexById = function(id){
	for(var indx=0;indx<this.length();indx++){
	    if(parseInt(id,10) == parseInt(this.getItem(indx).id,10)){
			return indx;
		}
	} 
	
}

EstoqueColecao.prototype.RemoverTodos = function(){
	this.colecao = this.colecao.splice(0);
}