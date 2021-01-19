/*
'##################################################################################################'
'#                                       CLASS: Varejo                                      																																    #'
'##################################################################################################'
*/	

function Peca(){
	this.id = 0;
	this.produto_id = 0;

}

/*
'##################################################################################################'
'#                                       CLASS: VarejoColecao                                  																																    #'
'##################################################################################################'
*/		

function PecaColecao(){
	this.colecao = new Array();
	this.uniqueID = 0;
}

PecaColecao.prototype.Adicionar = function(objItem){
    this.uniqueID++;
	objItem.id = this.uniqueID;	
	return this.colecao.push(objItem);
	
}

PecaColecao.prototype.Remover = function(indice){
	this.colecao.splice(indice,1);
}

PecaColecao.prototype.length = function(){
	return this.colecao.length;
}

PecaColecao.prototype.getItem = function(index){
	return this.colecao[index];
}

PecaColecao.prototype.setItem = function(index, Atributo){
	this.colecao[index] = Atributo;
}



PecaColecao.prototype.getIndexById = function(id){
	for(var indx=0;indx<this.length();indx++){
	    if(parseInt(id,10) == parseInt(this.getItem(indx).produto_id,10)) {
			return indx;
		}
	} 
	
}

PecaColecao.prototype.RemoverTodos = function(){
	this.colecao = this.colecao.splice(0);
}