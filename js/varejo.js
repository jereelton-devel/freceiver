/*
'##################################################################################################'
'#                                       CLASS: Varejo                                      																																    #'
'##################################################################################################'
*/	

function Varejo(){
	this.id = 0;
	this.empresa_id = 0;
	this.codigo = "";
	this.descricao = "";
	
}

/*
'##################################################################################################'
'#                                       CLASS: VarejoColecao                                  																																    #'
'##################################################################################################'
*/		

function VarejoColecao(){
	this.colecao = new Array();
	this.uniqueID = 0;
}

VarejoColecao.prototype.Adicionar = function(objItem){
    this.uniqueID++;
	objItem.id = this.uniqueID;	
	return this.colecao.push(objItem);
	
}

VarejoColecao.prototype.Remover = function(indice){
	this.colecao.splice(indice,1);
}

VarejoColecao.prototype.length = function(){
	return this.colecao.length;
}

VarejoColecao.prototype.getItem = function(index){
	return this.colecao[index];
}

VarejoColecao.prototype.setItem = function(index, Atributo){
	this.colecao[index] = Atributo;
}



VarejoColecao.prototype.getIndexById = function(id){
	for(var indx=0;indx<this.length();indx++){
	    if(parseInt(id,10) == parseInt(this.getItem(indx).id,10)) {		
			return indx;
		}
	} 
	
}

VarejoColecao.prototype.RemoverTodos = function(){
	this.colecao = this.colecao.splice(0);
}