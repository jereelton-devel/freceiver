<?php

?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <title>FRECEIVER</title>
    <style>
        * {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        #box_main {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0px;
            left: 0px;
            color: #BBBBBB;
            background-color: #0b3e6f;
        }
        #div_box_left {
            width: 59%;
            float: left;
            position: relative;
            background-color: #FFFFFF;
            padding-bottom: 66px;
            border-right: solid #0b3e6f 1px;
        }
        #div_box_right {
            width: 36%;
            padding: 2%;
            float: right;
            position: relative;
            color: #888888;
            background-color: #FFFFFF;
        }
        #div_box_right input {
            width: 98%;
        }
        #div_box_right #div_send_result {
            width: 98%;
            height: 300px;
            margin-top: 40px;
            padding: 1%;
            color: #0b3e6f;
            background-color: #F1F1F1;
        }
        #frm_envia_arquivo {
            width: 100%;
            height: auto;
            margin: 0px auto;
        }
        .div_rows {
            width: 100%;
            float: left;
            text-align: center;
        }
        #drop {
            width: 98%;
            height: 300px;
            margin: 0px auto;
            font-size: 2em;
            border: dashed #BBBBBB 3px;
        }
        #ext_file {
            width: 98%;
            border: solid #BBBBBB 1px;
        }
        #out {
            width: 97%;
            margin-left: 1%;
            padding-top: 10px;
            text-align: left;
            padding-left: 1%;
            height: 30px;
            color: #555555;
            border: solid #BBBBBB 1px;
            background-color: #F1F1F1;
        }
        .div_bts {
            width: 98%;
            height: 40px;
            margin-top: 25px;
        }
        .div_bts input {
            width: 150px;
            height: 30px;
        }
        .div_clear_fix {
            float: none;
            clear: both;
        }
        #downloadPDF {
            position: relative;
            width: 100%;
            height: auto;
            min-height: 30px;
            padding-top: 20px;
            padding-bottom: 10px;
            text-align: center;
            background-color: #FFFFFF;
            border-top: solid #0b3e6f 20px;
        }
    </style>
</head>
<body>

<div id="box_main">

    <div id="div_box_left">

        <form id="frm_envia_arquivo" name="frm_envia_arquivo" method="POST" enctype="multipart/form-data">

            <div class="div_rows">
                <label><h2>Escolha um arquivo para enviar</h2></label>
                <div id="drop">
                    <br />
                    <br />
                    <br />
                    Arraste um arquivo aqui ou Selecione
                </div>
                <input type="hidden" value="" name="format" />
                <br />
                <input type="file" name="ext_file" id="ext_file" value="" />
                <input name="file_ext" type="hidden" id="file_ext" value="" />
                <br />
                <pre id="out"></pre>
            </div>

            <div class="div_rows">
                <div class="div_bts">
                    <input type="submit" id="bt-submit-form-novo-item" value="Enviar" />
                    <input type="reset" id="bt-reset-form-novo-item" value="Cancelar" />
                    <input type="button" id="bt-list-form-novo-item" value="Listar" />
                    <input type="button" id="bt-renew-form-novo-item" value="Renovar" />
                </div>
            </div>

            <div class="div_clear_fix"></div>

        </form>

    </div>

    <div id="div_box_right">

        Endpoint<br />
        <input type="text" id="endpoint" name="endpoint" value="" />
        <br />
        <br />
        Nome final para o arquivo<br />
        <input type="text" id="final_filename" name="final_filename" value="" />
        <br />
        <br />
        Token<br />
        <input type="text" id="token" name="token" value="" />

        <div id="div_send_result"></div>

    </div>

    <div class="div_clear_fix"></div>

    <div id="downloadPDF"></div>

</div>

<!--Dependencias-->
<script type="text/javascript" src="./js/assets/jquery-1.9.0.min.js"></script>
<script type="text/javascript" src="./js/jquery.maskedinput.js" ></script>
<script type="text/javascript" src="./js/x-alertify/alertify-1.13.1.min.js"></script>
<script type="text/javascript" src="./js/assets/jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="./js/assets/moment.js"></script>
<script type="text/javascript" src="./js/assets/moment_langs.js"></script>
<script type="text/javascript" src="./js/modern/dropdown.js"></script>
<script type="text/javascript" src="./js/modern/accordion.js"></script>
<script type="text/javascript" src="./js/modern/buttonset.js"></script>
<script type="text/javascript" src="./js/modern/carousel.js"></script>
<script type="text/javascript" src="./js/modern/input-control.js"></script>
<script type="text/javascript" src="./js/modern/pagecontrol.js"></script>
<script type="text/javascript" src="./js/modern/rating.js"></script>
<script type="text/javascript" src="./js/modern/slider.js"></script>
<script type="text/javascript" src="./js/modern/tile-slider.js"></script>
<script type="text/javascript" src="./js/modern/tile-drag.js"></script>
<script type="text/javascript" src="./js/modern/calendar.js"></script>
<script type="text/javascript" src="./js/assets/care.pagination.js"></script>
<script type="text/javascript" src="./js/app.js"></script>
<script type="text/javascript" src="./js/jquery.uploadfile.js"></script>
<script type="text/javascript" src="./js/jquery.binarytransport.js"></script>
<script type="text/javascript" src="./js/assets/jquery.modal.min.js"></script>
<script type="text/javascript" src="./js/1.11.4jquery-ui.js"></script>
<script type="text/javascript" src="./js/modern/dialog.js"></script>
<script type="text/javascript" src="./js/datepicker-idiomas.js"></script>
<script type="text/javascript" src="./shim.js"></script>
<script type="text/javascript" src="./js/dist/xlsx.full.min.js"></script>

<script type="text/javascript">

    var endpoint = 'https://[DOMAIN]/freceiver/api_recebe_arquivo.php';

    $(document).ready(function() {

        function validaEnviarArquivo() {
            if($("#file_ext").val() == "" && $("#ext_file").val() == "") {
                alert("Falou Informar um arquivo para enviar !");
                return false;
            }

            return true;
        }

        function listarArquivos(){

            var endpoint = $("#endpoint").val();
            var token = $("#token").val();

            if(endpoint == "" || token == "") {
                alert("Informe os parametros para autenticar na API");
                return false;
            }

            var dataForm = new FormData();

            dataForm.append('acao', 'listar_arquivos');
            dataForm.append('token', token);

            $.ajax({
                url: endpoint,
                dataType: 'json',
                cache: false,
                data: dataForm,
                method: 'POST',
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {

                    var resp = JSON.parse(JSON.stringify(data));

                    $("#div_send_result").html("<pre>"+JSON.stringify(data, null, "\t")+"</pre>");

                    if(resp.retorno == "ok") {

                        $("#downloadPDF").html('');
                        $.each(resp.fLister, function(i, obj){
                            basename = obj.split('/').pop();
                            $("#downloadPDF").append("<a href='"+obj+"' target='_blank'>"+basename+"</a><br />");
                        });

                        $('#bt-renew-form-novo-item').show();

                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText, textStatus, errorThrown);
                    alert(jqXHR.responseText);
                }
            });

        }

        function enviarArquivo(id){

            var endpoint = $("#endpoint").val();
            var filename = $("#final_filename").val();
            var token = $("#token").val();

            if(endpoint == "" || filename == "" || token == "") {
                alert("Informe os parametros para autenticar na API");
                return false;
            }

            var dataForm = new FormData();

            dataForm.append('acao', 'enviar_arquivo');

            //Arquivo PDF: Selecionado
            $('input[type=file]').each(function (index, item) {
                if (item.files.length > 0) {
                    dataForm.append('ext_file', item.files[0]);
                } else {
                    dataForm.append('ext_file', '');
                }
            });

            //Arquivo PDF: Drag And Drop
            dataForm.append('file_ext', $('#file_ext').val());

            dataForm.append('final_filename', filename);
            dataForm.append('token', token);

            $.ajax({
                url: endpoint,
                dataType: 'json',
                cache: false,
                data: dataForm,
                method: 'POST',
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {

                    var resp = JSON.parse(JSON.stringify(data));

                    //alert(resp.mensagem);
                    $("#div_send_result").html("<pre>"+JSON.stringify(data, null, "\t")+"</pre>");

                    if(resp.retorno == "ok" && resp.arqName != "") {
                        $("#downloadPDF").html("<a href='"+resp.linkFile+"' target='_blank'>Download PDF</a>");
                    }

                    $('#bt-renew-form-novo-item').show();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText, textStatus, errorThrown);
                    alert(jqXHR.responseText);
                }
            });

        }

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
                alert('Tipo de arquivo invalido !');
                input_file.val('');
                return false;
            }

            return true;
        }

        function ativarUploadPDF() {

            var OUT = document.getElementById('out');

            (function () {
                var drop = document.getElementById('drop');
                if (!drop.addEventListener) return;

                function handleDrop(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    try {

                        if(validarExtensaoArquivo(e.dataTransfer.files[0].name, 'pdf')) {

                            //Le o arquivo arrastado para cima do drop zone
                            var fReader = new FileReader();
                            fReader.addEventListener('load', function(event) {
                                var result = btoa(event.target.result);
                                $("#file_ext").val(result);
                                $("#ext_file").val('');
                                //$("#ext_file").hide('fast');
                                $("#ext_file").prop('disabled', true);

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
                    drop.style.backgroundColor = "#FFFFFF";
                }

                function handleDragover(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    drop.style.borderColor = "#00CBFE";
                    drop.style.color = "#00CBFE";
                    drop.style.backgroundColor = "#FCF970";
                }

                function handleExit(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    drop.style.borderColor = "#ABABAB";
                    drop.style.color = "#ABABAB";
                    drop.style.backgroundColor = "#FFFFFF";
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
                                //$("#ext_file").hide('fast');
                                $("#ext_file").prop('disabled', true);
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

        $("#bt-submit-form-novo-item").on('click', function(){
            if(validaEnviarArquivo()) {
                enviarArquivo();
            }
            return false;
        });

        $('#bt-reset-form-novo-item').on('click', function() {
            $('#out').html('');
            $('#ext_file').val('');
            $('#file_ext').val('');
            //$("#ext_file").show('fast');
            $("#ext_file").prop('disabled', false);
        });

        $('#bt-renew-form-novo-item').on('click', function() {
            $('#out').html('');
            $('#ext_file').val('');
            $('#file_ext').val('');
            $('#final_filename').val('');
            $("#ext_file").prop('disabled', false);
            $("#downloadPDF").html("");
            $("#div_send_result").html("");
            $('#bt-renew-form-novo-item').hide();
        });

        $('#bt-list-form-novo-item').on('click', function() {
            listarArquivos();
        });

        $('#bt-renew-form-novo-item').hide();
        ativarUploadPDF();
        $("#endpoint").val(endpoint);

    });

</script>

</body>
</html>