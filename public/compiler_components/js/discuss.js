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
        var length = $("#body").val().length;
        if(length >= 25){
            $("#submit").removeAttr('disabled');
        }
        else{
            $("#submit").attr('disabled', 'disabled');
        }
    });
    $("#submit").click(function(){
        var author = $("#author").val();
        var title = $("#title").val();
        var body = $("#body").val();
        var errors = "";
        if(title.length < 15){
            errors += "Length of Title is less than 15!</br>";
        }
        if(body.length < 25){
            errors += "Length of Content is less than 25!</br>"
        }
        if(errors.length > 0){
            $("#error-msg").html("<h5>ERROR:</h5>");
            $("#error-msg").append(errors);
            $("#submit").attr('disabled', 'disabled');
        }
        else{
            var req_url = '/discuss/add';
            var data = {
                author: author,
                title: title,
                body: body
            };
            $.post(req_url, data, function(data, status, jqXHR){
                console.log('AddDiscussion Request Status: '+status);
                window.location.reload();
            });;
        }
    });
});

function openMyThreads(){
    window.location.assign("/discuss/my");
}