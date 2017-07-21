/**
	Author : Rodrigue Cheumadjeu 
			 Alain Tona
*/

/*@@@@@@@@@@@@@@@@@ Fichier Js contenant la logique fonctionnelle client générique de lapplication @@@@@@@@@@@@@@@@*/

/**
	Fonction d'affichage de la fenêtre modale à isoler et refactoriser
	
*/
function printModalWindow(idModal, title) {
    $(document).on('show.bs.modal', idModal, function(event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('whatever')
        var modal = $(this)
        modal.find('.modal-title').text(title)
        modal.find('.modal-body input').val("")

    })
}


/*Cette fonction ne rend un dialogue que si le statut de la chambre est libre */
function oReservationDialogWithConstraint(oForRooms, oColumn, oIdModal, oDpickerField1, oDpickerField2, dStateBusy, dStateFree, dStateUnav, dHTMLkey, dHTMLdirective) {
    $(document).on('click', oColumn, function() {
        if(oForRooms=="ForChambres"){
            var val = $(this).parent().find(dHTMLkey).attr(dHTMLdirective);
            $(oDpickerField1).datepicker({ inline: true });
            $(oDpickerField2).datepicker({ inline: true });
            if (val == dStateBusy) {
                $('#tCode-chambre').val($(this).text());
                oShowDialog5(oColumn, "#occupe");

            } else if (val == dStateFree) {
                $('#oBuffer').val($(this).text());
                //$("table#chambres   tbody tr th").parent().find("input[value="+$().val()+"]").prop("checked","true");
                oShowDialog3(oColumn, oIdModal);

            } else if (val == dStateUnav) {
                $('#sCode-chambre').val($(this).text());
                oShowDialog4(oColumn, "#unavailable");
            }
        }else if(oForRooms=="ForSalles"){
            var val = $(this).parent().find(dHTMLkey).attr(dHTMLdirective);
            $("#datepicker3").datepicker({ inline: true });
            $("#datepicker4").datepicker({ inline: true });
            if (val == dStateBusy) {
                $('#tCode-chambre').val($(this).text());
                oShowDialog5Prim(oColumn, "#occupe");

            } else if (val == dStateFree) {
                $('#oBuffer').val($(this).text());
                //$("table#chambres   tbody tr th").parent().find("input[value="+$().val()+"]").prop("checked","true");
                oShowDialog3Prim(oColumn, oIdModal);

            } else if (val == dStateUnav) {
                $('#sCode-chambre').val($(this).text());
                oShowDialog4Prim(oColumn, "#unavailable");
            }
        }
        

    });
}





/* Doubler le montant d'un service côté client: Reprendre à cette étape */
function oTimesAmount(oQuantite, oCoutUnitaire) {

    var oOriginalQteValue = $(oQuantite).val();
    $(document).on('change', oQuantite, function() {
        var oAmountOfService = $("#trichZone").val() * $(oQuantite).val();
        $(oCoutUnitaire).val(oAmountOfService);
        if ($(oQuantite).val() <= 0) {
            $(oQuantite).val("0");
            $(oCoutUnitaire).val("0");
        }
    });
}



function oExtractFlowForCommands(oListener, oFlowToPrint, oClassToHide, oMessage, oPopup) {
    var $t = $(oFlowToPrint).clone();
    $(oClassToHide).hide();
    printFlow(oListener, oFlowToPrint, oPopup, oMessage);
    //setTimeout(function() {$(oFlowToPrint).html($t);}, 200);

}



function oMisAjourDate(sListener) {
    $(sListener).find('tr').each(function() {
        date1 = new Date($(this).children().eq(2).text());
        date2 = new Date();
        var t = oDateDiff(date1, date2);
        if (!t.day) $(this).children().eq(2).next().text("0 jours ");
        else $(this).children().eq(2).next().text(t.day + "  jours ");
    });
}


function oAddService(oIdService, oRoot) {

    $(document).on('click', oIdService, function() {
        if ($("#field-services").val() != '') {
            var tbodyRoot = $(oRoot).html();
            tbodyConnexe = "<tr id='corps-commande'>";
            tbodyConnexe = tbodyConnexe + "<th scope=row id='service'>" + $("#trichZoneForCode").val() + "</th>";
            tbodyConnexe = tbodyConnexe + "<td scope=row id='service'>" + $("#field-services").val() + "</td>";
            tbodyConnexe = tbodyConnexe + "<td id='quantite'>" + $("#field-quantity").val() + "</td>";
            tbodyConnexe = tbodyConnexe + "<td id='prix'>" + $("#field-uniq-price").val() + "</td>";
            tbodyConnexe = tbodyConnexe + "<td class='text-center cacher'>";
            tbodyConnexe = tbodyConnexe + "<img  title=Modifier width=20 height=20  class='btn-edit-commande'  src='img/modifier.png'/>";
            tbodyConnexe = tbodyConnexe + "<img  width=20 height=20 class='btn-delete-commande' style='margin-left: 15px' src='img/delete.png'/>";
            tbodyConnexe = tbodyConnexe + "</td>";
            tbodyConnexe = tbodyConnexe + "</tr>";
            $("#flowToPrint tbody").html(tbodyConnexe + tbodyRoot);
            oSommeCoutCommande("#cout-commande");
            $("#zQuantity").val($("#zQuantity").val() + $("#field-quantity").val() + "@#@");
            $("#zNom_service").val($("#zNom_service").val() + $("#field-services").val() + "@#@");

            $("#field-services").val("");
            $("#field-uniq-price").val("0");
            $("#field-quantity").val("0");



} else ("Précisez un service SVP !! ");
    });
}

function oSommeCoutCommande(oTotal) {
    var som = 0;
    var _SEUIL_ARTICLES = 70; //Le max d'articles sur une commande
    for (var i = 1; i < _SEUIL_ARTICLES; i++) {
        var tmp = $("#flowToPrint tbody tr:nth-child(" + i + ") td:nth-child(4)").text();
        $("#buffer").val(tmp);
        var atmp = parseInt($("#buffer").val());
        if (atmp) {
            som = som + atmp;
        }
        $(oTotal).html(som);
        
    }
    return som ;
}

//fonction qui calcul la difference de date


function oDateDiff(date1, date2) {
    var diff = {}
    var tmp = date2 - date1;
    tmp = Math.floor(tmp / 1000);
    diff.sec = tmp % 60;
    tmp = Math.floor((tmp - diff.sec) / 60);
    diff.min = tmp % 60;
    tmp = Math.floor((tmp - diff.min) / 60);
    diff.hour = tmp % 24;
    tmp = Math.floor((tmp - diff.hour) / 24);
    diff.day = tmp;
    return diff;
}


// oMisAjourDate('tbody');

//Suppression d'une ligne d'articles dans la commande
function oDeleteRowCommande(oListenerClass) {
    $(document).on('click', oListenerClass, function() {
        $(this).parent().parent().remove();
        $("#cout-commande").css("color", "green");
        oSommeCoutCommande("#cout-commande");
    });
}

//Editer une ligne d'articles dans la commande
function oEditRowCommande(oListenerClass) {
    $(document).on('click', oListenerClass, function() {
        var serviceToEdit = $(this).parent().parent().find('#service').html();
        var quantiteToEdit = $(this).parent().parent().find('#quantite').html();
        var prixToEdit = $(this).parent().parent().find('#prix').html();
        $("#field-services").val(serviceToEdit);
        $("#field-quantity").val(quantiteToEdit);
        $("#field-uniq-price").val(prixToEdit);
        $(this).parent().parent().remove();
        oSommeCoutCommande("#cout-commande");
    });
}



// get La date système
function oGetCurrentDate() {
    var now = new Date();
    var day = now.getDate();
    
    var month = now.getMonth() + 1;
    if(month<10)
        month = "0"+month;
    var year = now.getFullYear();
    realDate = day + "/" + month + "/" + year;
    return realDate;
}

// Présenter un UI dialogue avancé
function oShowDialog(oListener, oScreen, oMode) {

    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Non": function() {
                $(this).dialog("close");
            },
            "Oui": function() {

                var tQuantities = $("#zQuantity").val();
                var tServices = $("#zNom_service").val();

                var qteTAB = oUnParseString(tQuantities);
                var servicesTAB = oUnParseString(tServices);
                // Fabrication du query string
                var params = "";
                var cni_personne = $("#kCNI").val();
                params = "jeton=saveCommande&cni_personne=" + cni_personne;
                var i = 0;
                var size = qteTAB.length;
                var temp = "";
                //alert(size);
                while (i < size - 1) {
                    temp += "&service" + i + "=" + servicesTAB[i] + "&quantite" + i + "=" + qteTAB[i];
                    i++;
                }
                params += "&nb_enreg=" + (size - 1);
                params += temp;
                //alert(params);
                ajaxing_save_commande(params, "POST", "index.php", "warningsSuccess", "warningFailure");
                //var cloneFlowToPrint = $('#flowToPrint').html();
                //alert($("#flowToPrint tbody tr td:nth-child(4)").html());
                var cni_personne = cni_personne ;
                var message_bienvenue = "Bienvenu au centre MAISON CICM";
                var message_queue = "Votre satisfaction est notre priorité";
                var contact = "667876571 / 690876545";
                var site_web ="www.cicm.cm";
                $("#flowToPrint").prepend("<strong> CNI :"+cni_personne+"</strong><br/><strong>"+message_bienvenue+"</strong>");
                $("#flowToPrint").append("<strong>"+message_queue+"</strong><br/><strong>"+contact+"</strong><br/><strong>"+site_web+"</strong>");
                $("#flowToPrint").append("<p>ToTal : <strong>"+oSommeCoutCommande("#cout-commande")+"</strong> FCFA</p>");
                $("#flowToPrint").removeAttr("style");
                $("#flowToPrint tr th:nth-child(5)").remove();
                $("#flowToPrint tbody tr td:nth-child(5)").remove();
                $('#flowToPrint').printElement({ leaveOpen: true, printMode: 'popup', pageTitle: 'Facture CICM' });
                window.location.replace("http://localhost/cicm");  //OK
                $(this).dialog("close");

            }
        }
    });

}


// Présenter un UI dialogue avancé
function oShowDialog1(oListener, oScreen, oMode) {

    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Non": function() {
                $(this).dialog("close");
            },
            "Oui": function() {

                $(this).dialog("close");

            }
        }
    });

}


// Présenter un UI dialogue avancé
function oShowDialog3(oListener, oScreen) {
    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Annuler": function() {
                $(this).dialog("close");
            },
            "Travaux": function() {
                var params = "";
                var code_chambre = $("#oBuffer").val();
                params = "code_chambre=" + code_chambre + "&jeton=indisponibleChambre";
                //alert(params);
                ajaxing_native(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");

            },
            "Réserver": function() {
                var params = "";
                var cni_personne = $("#oCni-personne").val();
                var date_attribution =inverseDateTrue($("#oDatepicker1").val());
                var date_liberation = inverseDateTrue($("#oDatepicker2").val());
                var code_chambre = $("#oBuffer").val();
                //$(input['type=checkbox']).css("background","yellow");
                params = "jeton=reserverChambre&cni_personne=" + cni_personne + "&date_attribution=" + date_attribution + "&date_liberation=" + date_liberation + "&code_chambre=" + code_chambre;
                ajaxing_native(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");

            }
        }
    });

}


function oShowDialog3Prim(oListener, oScreen) {
    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Annuler": function() {
                $(this).dialog("close");
            },
            "Travaux": function() {
                var params = "";
                var code_chambre = $("#oBuffer").val();
                params = "code_chambre=" + code_chambre + "&jeton=indisponibleSalle";
                //alert(params);
                ajaxing_native_prim(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");

            },
            "Réserver": function() {
                var params = "";
                var cni_personne = $("#oCni-personne").val();
                var date_attribution =inverseDateTrue($("#datepicker3").val());
                var date_liberation = inverseDateTrue($("#datepicker4").val());
                var code_chambre = $("#oBuffer").val();
                //$(input['type=checkbox']).css("background","yellow");
                params = "jeton=reserverSalle&cni_personne=" + cni_personne + "&date_attribution=" + date_attribution + "&date_liberation=" + date_liberation + "&code_chambre=" + code_chambre;
                ajaxing_native_prim(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");

            }
        }
    });

}


function oShowDialog4Prim(oListener, oScreen) {
    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Libérer": function() {
                var params = "";
                var code_chambre = $("#sCode-chambre").val();

                params = "code_chambre=" + code_chambre + "&jeton=libererSalle";
                //alert(params);
                ajaxing_native_prim(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            },
            "quitter": function() {
                $(this).dialog("close");

            }
        }
    });
}



function oShowDialog4(oListener, oScreen) {
    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Libérer": function() {
                var params = "";
                var code_chambre = $("#sCode-chambre").val();

                params = "code_chambre=" + code_chambre + "&jeton=libererChambre";
                //alert(params);
                ajaxing_native(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            },
            "quitter": function() {
                $(this).dialog("close");

            }
        }
    });
}

function oShowDialog5(oListener, oScreen) {
    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Libérer": function() {
                var params = "";
                var code_chambre = $("#tCode-chambre").val();
                params = "code_chambre=" + code_chambre + "&jeton=libererChambre";
                //alert(params);
                ajaxing_native(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            },
            "quitter": function() {
                $(this).dialog("close");

            }
        }
    });
}


function oShowDialog5Prim(oListener, oScreen) {
    $(oScreen).dialog({
        modal: true,
        buttons: {
            "Libérer": function() {
                var params = "";
                var code_chambre = $("#tCode-chambre").val();
                params = "code_chambre=" + code_chambre + "&jeton=libererSalle";
                //alert(params);
                ajaxing_native_prim(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            },
            "quitter": function() {
                $(this).dialog("close");

            }
        }
    });
}



function oNotSubmittingBlankBill() {
    $(document).on('click', "#btn-pay", function() {
        if (!$(this).parent().find("#corps-commande").html()) {
            alert("Commande vide , choisissez au moins un service pour régler !! Merci");
        } else {

            oShowDialog("#btn-pay", "#cniModal", "open");

        }
    });
}


function oLaodUniqprice(oZoneService) {
    $(document).on('blur', oZoneService, function() {
        var params = "";
        var nom_service = $(oZoneService).val();
        params = "nom_service=" + nom_service + "&jeton=chargerPrixUnique";
        //alert(params);
        ajaxing_commands(params, "POST", "index.php", "warningsSuccess", "warningFailure");
    });
}



function viderCommande() {
    $(document).on('click', "#btn-reset", function() {

        $("#corpsCommande").html("");
        $("#zQuantity").val("");
        $("#zNom_service").val("");
    });
}

function viderCommande_brief() {
    $("#corpsCommande").html("");
    $("#zQuantity").val("");
    $("#zNom_service").val("");
}

function oUnParseString(str) {
    var strToArray = new Array();
    strToArray = str.split("@#@");
    return strToArray;
}


function oShowDialog6(oListener, oScreen) {
    $("#id-delete-confirm-dialog").hide();
    $(document).on('click',oListener,function(){
        $("#message-nom-personne").html($(this).attr("name-customer-directive")) ;
        $("#id-delete-personne").val($(this).attr("id-customer-directive"));
        $(oScreen).dialog({
        modal: true,
        height :200,
        buttons: {
            "OUI": function() {
                var params = "";
                var id_customer_directive = $("#id-delete-personne").val();
                params = "cni_personne=" + id_customer_directive + "&jeton=delete_customer";
                
                ajaxing_customers(params, "POST", "fideliser.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            },
            "NON": function() {
                $(this).dialog("close");

            }
        }
    });
    });
    
}


function initUserInfo() {
    //alert($(this).attr("name-customer-directive"));
}



function oShowDialog9(oListener, oScreen) {
    
    $(document).on('click',oListener,function(){
        var nom = $(this).parent().parent().find("nom").text();
        var contact = $(this).parent().parent().find("contact").text();
        var email = $(this).parent().parent().find("email").text();
        var vehicules = $(this).parent().parent().find("vehicules").text();
        var immatriculation = vehicules.split(";")[0];
        var marque = vehicules.split(";")[1];
        var modele = vehicules.split(";")[2];
        $('#cni-client').val($(this).attr("id-customer-directive"));
        $('#nom-client').val(nom);
        $('#contact-client').val(contact);
        $('#email-client').val(email);
        $('#modele-voiture-client').val(modele);
        $('#marque-voiture-client').val(marque);
        $('#immatriculation-voiture-client').val(immatriculation);

        $("logement").attr("oCni-personne-logement-fidelite",$(this).attr("id-customer-directive"));
        $("commandes").attr("oCni-personne-commandes-fidelite",$(this).attr("id-customer-directive"));
        //alert($("commandes").attr("oCni-personne-commandes-fidelite"));
        $(oScreen).dialog({
        modal: true,
        width : 400,
        buttons: {
            "Annuler": function() {
                $(this).dialog("close");

            },
            "Actualiser": function() {
                var nom_client = $('#nom-client').val();
                var cni_client = $('#cni-client').val();
                var contact_client = $('#contact-client').val();
                var genre_client= document.querySelector('input[name=genre-client]:checked').value;
                var email_client = $('#email-client').val();
                var immatriculation_voiture_client = $('#immatriculation-voiture-client').val();
                var modele_voiture_client = $('#modele-voiture-client').val();
                var marque_voiture_client = $('#marque-voiture-client').val();
                var voiture_client = modele_voiture_client + ";" + immatriculation_voiture_client + ";" + marque_voiture_client;
                var params = "" ;
                params += "cni_personne="+cni_client+"&nom_personne="+nom_client+"&contact_personne="+contact_client ;
                params += "&genre_client="+genre_client+"&email_personne="+email_client+"&vehicules="+ voiture_client ;
                params += "&jeton=update_client";
                ajaxing_customers(params,"POST","fideliser.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            }
        }
    });
    });
    
}



function oShowDialog7(oListener, oScreen) {
    $('#nom-client').val("");
    $('#cni-client').val("");
    $('#email-client').val("");
    $('#contact-client').val("");
    $('#immatriculation-voiture-client').val("");
    $('#modele-voiture-client').val("");
    $('#marque-voiture-client').val("");
    
    $(oScreen).dialog({
        modal: true,
        width : 400,
        buttons: {
            
            "Annuler": function() {
                $(this).dialog("close");

            },
            "Fidéliser": function() {
                $("logement").attr("oCni-personne-logement-fidelite",$("#cni-client").val());
                $("commandes").attr("oCni-personne-commandes-fidelite",$("#cni-client").val());
                //alert($("commandes").attr("oCni-personne-commandes-fidelite"));
                var nom_client = $('#nom-client').val();
                var cni_client = $('#cni-client').val();
                var contact_client = $('#contact-client').val();
                var genre_client= document.querySelector('input[name=genre-client]:checked').value;
                var email_client = $('#email-client').val();
                var immatriculation_voiture_client = $('#immatriculation-voiture-client').val();
                var modele_voiture_client = $('#modele-voiture-client').val();
                var marque_voiture_client = $('#marque-voiture-client').val();
                var voiture_client = modele_voiture_client + ";" + immatriculation_voiture_client + ";" + marque_voiture_client;
                var params = "" ;
                params += "cni_personne="+cni_client+"&nom_personne="+nom_client+"&contact_personne="+contact_client ;
                params += "&genre_client="+genre_client+"&email_personne="+email_client+"&vehicules="+ voiture_client ;
                params += "&jeton=save_client";
                ajaxing_save_customers(params,"POST","fideliser.php", "warningsSuccess", "warningFailure");
                $(this).dialog("close");
            }
        }
    });
}




function oFilterCni(oListener){
   $(document).on('keyup',oListener,function(e){
        if(e.keyCode== 13 || e.which == 13) {
            if($(oListener).val()!=""){
                    if($(oListener).val().length==9 || $(oListener).val().length==17){
                        var cni_personne=$(oListener).val();
                        var params ="";
                        params+="cni_personne="+cni_personne+"&jeton=filter_cni";
                    }else if($(oListener).val().length>9 && $(oListener).val().length<17){
                        alert("Longeur de CNI incorrecte");
                        var params ="jeton=read_users";
                    }else if ($(oListener).val().length<9){
                        alert("CNI trop courte");
                        var params ="jeton=read_users";
                    }else  if ($(oListener).val().length>17){
                        alert("CNI trop longue!!");
                        var params ="jeton=read_users";
                    }
                    $("logement").attr("oCni-personne-logement-fidelite",$("#cni-zone").val());
                    $("commandes").attr("oCni-personne-commandes-fidelite",$("#cni-zone").val());
                    //alert($("commandes").attr("oCni-personne-commandes-fidelite"));
            }else{
                alert("Renseignez une CNI svp!");
                var params ="jeton=read_users";
            }
            ajaxing_customers(params,"POST","fideliser.php", "warningsSuccess", "warningFailure");
        }
    });
}

function oFilterName(oListener){
   $(document).on('keyup',oListener,function(e){
        if(e.keyCode== 13 || e.which == 13) {
            
            if($(oListener).val()!=""){
                        var nom_personne=$(oListener).val();
                        var params = "nom_personne="+nom_personne+"&jeton=filter_nom";
                    
                    $("logement").attr("oCni-personne-logement-fidelite",$("#cni-zone").val());
                    $("commandes").attr("oCni-personne-commandes-fidelite",$("#cni-zone").val());
                    //alert($("commandes").attr("oCni-personne-commandes-fidelite"));
            }else{
                alert("Renseignez un nom svp");
                var params ="jeton=read_users";
            }
            ajaxing_customers(params,"POST","fideliser.php", "warningsSuccess", "warningFailure");
        }
    });

}


function enableOrDisableCNIzone (){
    $(document).on('click',"#btn-edit-customer",function(){
        $("#cni-client").attr("readonly","true");
        
    });
    $("#test-fidelite").click(function(){
        $("#cni-client").removeAttr("readonly");
    });
}


function initItemWithCNIForNewCustomer (oListener){
    var params="";
        
    $(document).on('click',oListener,function(){
        $("logement").attr("oCni-personne-logement-fidelite",$("#cni-client").val());
        $("commandes").attr("oCni-personne-commandes-fidelite",$("#cni-client").val());
        // params = "jeton=send_CNI_to_locaux&cni_personne=" +  $("logement").attr("oCni-personne-logement-fidelite");
        // ajaxing_page(params, "POST", "locaux.php", "warningsSuccess", "warningFailure");
    });
}


function redirectToCible_1(oListener,oCible){
    $(document).on("click",oListener,function(){
         $(this).parent().parent().find("a").attr("href",oCible+"?jeton=receive_cni_for_logement&cni_personne="+$("logement").attr("oCni-personne-logement-fidelite"));   
    });
    
}

function oCniLockLogement(oListener){
    $(document).on("click",oListener,function(){
        if($("#oCni-personne").val()){
            $("#oCni-personne").attr("readonly","true");
        }else {
            $("#oCni-personne").removeAttr("readonly");
        } 
    });
}


function oCniLockCommandes(oListener){
    $(document).on("click",oListener,function(){
        if($("#kCNI").val()){
            $("#kCNI").attr("readonly","true");
        }else {
            $("#kCNI").removeAttr("readonly");
        } 
    });
}

function redirectToCible_3 (oListener,oCible,oTbodyItemCheck){
    $(document).on("click",oListener,function(){
          var params = "jeton=transmission_chambres_for_commandes&cni_personne="+$("#oCni-personne").val(); 
          params += $(oTbodyItemCheck).map(function(){return "&"+this.name +"="+this.value; }).get().join().replace(/,/g,"");
          $(this).parent().parent().find("a").attr("href",oCible+"?"+params);   
    });
}


function startCoutCommande (){
    $(document).load(function(){
        //alert("toto");
        oSommeCoutCommande("#cout-commande");
    });

}

function inverseDateAnglo(oDateStr){
    var jour = oDateStr.split("/")[2] ;
    var mois = oDateStr.split("/")[1]
    var annee = oDateStr.split("/")[0]
    var dateInverseeStr = jour +"/"+ mois +"/"+ annee ;
    return dateInverseeStr ; 
}

function inverseDate(oDateStr){
    var jour = oDateStr.split("/")[1] ;
    var mois = oDateStr.split("/")[0]
    var annee = oDateStr.split("/")[2]
    var dateInverseeStr = annee +"/"+ mois +"/"+ jour ;
    return dateInverseeStr ; 
}


function inverseDateTrue(oDateStr){
    var jour = oDateStr.split("/")[2] ;
    var mois = oDateStr.split("/")[0]
    var annee = oDateStr.split("/")[1]
    var dateInverseeStr = annee +"/"+ mois +"/"+ jour ;
    return dateInverseeStr ; 
}

function inverseDateReal(oDateStr){
    var jour = oDateStr.split("-")[0] ;
    var mois = oDateStr.split("-")[1]
    var annee = oDateStr.split("-")[2]
    var dateInverseeStr = annee +"/"+ mois +"/"+ jour ;
    return dateInverseeStr ; 
}

function oFilterCommande(){
   var $date_debut=inverseDateTrue($("#date-debut").val());
   var $date_fin=inverseDateTrue($("#date-fin").val());
   var params="date_debut="+$date_debut+"&date_fin="+$date_fin+"&jeton=filter_commande";
   ajaxing_filter_commande(params, "POST", "index.php", "warningsSuccess", "warningFailure");

}

function dateBoxOnCommands (oIDZone){
    $(document).on('focus', oIDZone, function() {
        $(oIDZone).datepicker({ inline: true });
    });
}

function lockCheckBoxInLogements(){
    $("table#chambres   tbody tr th").css("background","#49a");//attr("readonly","true");
    $("table#chambres   tbody tr th  input[type=checkbox]").prop("disabled","true");
}
