var language = 1;
ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("ace/theme/eclipse");
editor.getSession().setMode("ace/mode/c_cpp");
editor.setValue("#include<stdio.h>\n\nint main(){\n\n\t//Enter your code here\n\n\treturn 0;\n}");
document.getElementById('editor').style.fontSize='16px';


function load_c() {
    if(language != 1 || language == 1){
        editor.getSession().setMode("ace/mode/c_cpp");
        language = 1;
        $("#dropdownMenu1").html('C');
        editor.setValue("#include<stdio.h>\n\nint main(){\n\n\t//Enter your code here\n\n\treturn 0;\n}");
    }
}

function load_cpp(){
    if(language != 2){
        editor.getSession().setMode("ace/mode/c_cpp");
        language = 2;
        $("#dropdownMenu1").html('C++');
        editor.setValue("#include<iostream>\nusing namespace std;\n\nint main(){\n\n\t//Enter your code here\n\n\treturn 0;\n}");
    }
}

function load_java() {
    if(language != 3){
        editor.getSession().setMode("ace/mode/java");
        language = 3;
        $("#dropdownMenu1").html('Java');
        editor.setValue("public class Solution{\n\n\tpublic static void main(String[] as){\n\n\t\t//Enter your lines\n\n\t}\n\n}");
    }
}

function load_py() {
    if(language != 30){
        editor.getSession().setMode("ace/mode/python");
        language = 30;
        $("#dropdownMenu1").html('Python 3.5');
        editor.setValue("n = input()\n#Enter your lines");
    }
}

function load_theme(id) {
    if(id == 1){
        editor.setTheme("ace/theme/ambiance");
        $("#dropdownMenu2").html('Ambiance');
    }
    if(id == 2){
        editor.setTheme("ace/theme/chaos");
        $("#dropdownMenu2").html('Chaos');
    }
    if(id == 3) {
        editor.setTheme("ace/theme/chrome");
        $("#dropdownMenu2").html('Chrome');
    }
    if(id == 4){
        editor.setTheme("ace/theme/clouds");
        $("#dropdownMenu2").html('Clouds');
    }
    if(id == 5){
        editor.setTheme("ace/theme/clouds_midnight");
        $("#dropdownMenu2").html('Clouds Midnight');
    }
}

function submit_code() {
    $(".preloader").fadeIn();
    $("#out_2_box").hide();
    $("#out_1_box").hide();
    $("#error_box").hide();
    $("#error_box_2").hide();
    $("#error_box_3").hide();
    var req_url = "/compiler/compile";
    var src = editor.getValue();
    var t1 = $("#testcase_1").val();
    var t2 = $("#testcase_2").val();
    var post_data = {
        source: src,
        lang: language,
        testcase_1: t1,
        testcase_2: t2
    };
    console.log(post_data);
    $.post(req_url,
        post_data,
        function(data, status, jqXHR) {
            console.log('status: ' + status + ', data: ' + JSON.stringify(data.result));
            if(data.result.compilemessage.length > 0){
                $("#error_msg_1").html(data.result.compilemessage);
                $("#error_box").show();
                $(".preloader").fadeOut();
                Console.log("Compiler Error");
            }
            if(data.result.stderr[0] != false){
                $("#error_msg_2").html(data.result.stderr[0]);
                $("#error_box_2").show();
            }
            if(data.result.stderr[1] != false){
                $("#error_msg_3").html(data.result.stderr[1]);
                $("#error_box_3").show();
            }
            if(data.result.stdout != null) {
                if (data.result.stdout[0].length > 0) {
                    if (language != 30) {
                        if (data.result.stdout[0] === $("#o_1").val()) {
                            $("#out_1").html("Successfully Executed :)");
                            $("#out_1").append('<br>Time Taken: ' + data.result.time[0]);
                        }
                        else {
                            $("#out_1").html("<b>Mismatch</b> - <u>Output:</u><br>"+data.result.stdout[0]);
                        }
                    }
                    else {
                        if (data.result.stdout[0] === $("#o_1").val() + "\n") {
                            $("#out_1").html("Successfully Executed :)");
                            $("#out_1").append('<br>Time Taken: ' + data.result.time[0]);
                        }
                        else {
                            $("#out_1").html("<b>Mismatch</b> - <u>Output:</u><br>"+data.result.stdout[0]);
                        }
                    }
                    $("#out_1_box").show();
                }
                if (data.result.stdout[1].length > 0) {
                    if (language != 30) {
                        if (data.result.stdout[1] === $("#o_2").val()) {
                            $("#out_2").html("Successfully Executed :)");
                            $("#out_2").append('<br>Time Taken: ' + data.result.time[1]);
                        }
                        else {
                            $("#out_2").html("<b>Mismatch</b> - <u>Output:</u><br>"+data.result.stdout[1]);
                        }
                    }
                    else {
                        if (data.result.stdout[1] === $("#o_2").val() + "\n") {
                            $("#out_2").html("Successfully Executed :)");
                            $("#out_2").append('<br>Time Taken: ' + data.result.time[1]);
                        }
                        else {
                            $("#out_2").html("<b>Mismatch</b>-- <u>Output:</u><br>"+data.result.stdout[1]);
                        }
                    }
                    $("#out_2_box").show();
                }
            }
            $(".preloader").fadeOut();
        })
        .done(function() {
            alert('Code Compiled Successfully!');
            
        })
        .fail(function(jqxhr, settings, ex) {
            alert('Compilation Failed: ' + ex);
        });
}

//Save the latest program in the editor to the server
function saveProgram(){
    $('#save_pg_btn').addClass('disabled');
    var src = editor.getValue();
    var req_url = '/compiler/saveprogram';
    var data = {
        code: src,
        language: language
    };
    $.post(req_url, data, function(data, status, jqXHR){
        console.log('SaveProgram Request Status: '+status);
    });
    $('#save_pg_btn').removeClass('disabled');
}

//Get the latest code saved from the server
function myCode(){
    $.get('/compiler/mycode',function(data, status){
        if(status == 'success'){
            if(data.status == true){
                language = data.language;
                if(language == 1 || language == 2){
                    editor.getSession().setMode("ace/mode/c_cpp");
                    if(language == 1)
                        $("#dropdownMenu1").html('C');
                    else
                        $("#dropdownMenu1").html('C++');
                }
                else if(language == 3){
                    editor.getSession().setMode("ace/mode/java");
                    $("#dropdownMenu1").html('Java');
                }
                else if(language == 30){
                    editor.getSession().setMode("ace/mode/python");
                    $("#dropdownMenu1").html('Python 3.5');
                }
                else{
                    console.log('Incorrect language code found');
                }
                editor.setValue(data.code);
            }else{
                console.log('No Saved Programs Found For You!');
            }
        }
    });
}
myCode();

$(window).bind('beforeunload', function(){
  return 'Are you sure you want to leave?';
});
