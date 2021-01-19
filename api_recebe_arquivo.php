<?

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

ini_set("memory_limit",-1);
ini_set('max_execution_time', 0);

/*print_r($_REQUEST);
print_r($_FILES);*/

$acao = $_POST['acao'];
$file_content = @$_POST['file_ext'];
$fakepath = @$_FILES['ext_file']['tmp_name'];
$final_filename = @$_POST['final_filename'];
$token = $_POST['token'];
$response = "";

if($token == "" || !$token || empty($token) || $token != "!!!!!!!!TOKEN!!!!!!!!") {
	$response = array(
		'retorno'=>'false',
		'mensagem' => 'Falha ao tentar autenticar, token incorreto.');
	echo json_encode($response);
	die();
}

if($acao == "listar_arquivos") {

	$filepath = "./files/";
	$getfiles = [];
	$listfiles = glob($filepath."*.pdf", GLOB_BRACE);

	if(count($listfiles) == 0) {
		$response = array(
			'retorno'=>'false',
			'mensagem' => 'Lista de arquivos vazia');
	} else {

		foreach ($listfiles as $file) {
			$getfiles[] = "https://[DOMAIN]/freceiver/files/".basename($file);
		}

		$response = array(
			'retorno'=>'ok',
			'mensagem' => 'Arquivos listados com sucesso',
			'fLister' => $getfiles);

		echo json_encode($response,JSON_UNESCAPED_UNICODE);
		exit;
	}
}

if($acao != "enviar_arquivo" || (empty($file_content) && empty($fakepath))) {
	$response = array(
		'retorno'=>'false',
		'mensagem' => 'Parametros incorretos');
	echo json_encode($response);
	die();
}

if(empty($final_filename) || !$final_filename || $final_filename == "") {
	$final_filename = "arqPDF";
}

if(!empty($fakepath)) {

	//Envio do arquivo

	if(move_uploaded_file($fakepath, "./files/".$final_filename.".pdf")) {
		$response = array(
			'retorno'=>'ok',
			'mensagem' => 'Arquivo enviado com sucesso',
			'linkFile' => "https://[DOMAIN]/freceiver/files/".$final_filename.".pdf");
	} else {
		$response = array(
			'retorno'=>'nok',
			'mensagem' => 'Houve um erro ao tentar enviar o arquivo');
	}

} else {

	//Envio do Conteudo do arquivo

	if(file_put_contents("./files/".$final_filename.".pdf", base64_decode($file_content))) {
		$response = array(
			'retorno'=>'ok',
			'mensagem' => 'Arquivo salvo com sucesso',
			'linkFile' => "https://[DOMAIN]/freceiver/files/".$final_filename.".pdf");
	} else {
		$response = array(
			'retorno'=>'nok',
			'mensagem' => 'Houve um erro ao tentar salvar o arquivo');
	}
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);
exit;

?>
