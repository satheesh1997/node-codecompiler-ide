/* 
    Javascript codes that control the client side
    discussion system.

    Author: Satheesh Kumar D
    Date: 19-10-2017
    Project: Offline Code Compiler
    Organisation: Code Lordz

*/

$('document').ready(function(){
    $('#title').keydown(function(){
        var length = $('#title').val().length;
        if(length >= 15 && length <= 40 && $('#title').val()!= " "){
            $('#body').removeAttr('disabled');
        }
        else{
            $('#body').attr('disabled', 'disabled');
        }
    });
    $('#body').keydown(function(){
        $('#title').attr('disabled', 'disabled');
    });
});