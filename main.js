//Storing username and password input from login page
$('login').on('click', function(){
    var username = $('#username').val();
    var password = $('#password').val();
})

//JWT authorization
var access_token = ''

//This is an ajax request. The purpsose is to get an access_token
$.ajax({
    method: 'POST',
    url: 'http://localhost:8080/oauth/token?grant_type=password&username=admin&password=admin',
    beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization','Basic'+ btoa(username + ':' + password))
},
    success: function(data){
        setCookie("access_token", data.access_token, 1)
        console.log(getCookie("access_token"))
        $('body').append("<div>Login successfully. <a href='index.html'>Proceed to main page</a></div>")
}
})

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "Empty";
}

//QUESTION CRUD
$(function(){
    var $questions = $('#questions');
    var $qid = $('#qid');
    var $content = $('#content');

    var questionTemplate = $('#question-template').html();

    function addQuestion(question){
        $questions.append(Mustache.render(questionTemplate, question));
    }

    $.ajax({
        method: 'GET',
        url: 'localhost:8080/questions/getAll' + '?access_token=' + getCookie('access_token'),
        success: function(questions) {
            console.log("Getted all questions", questions); //debug
            $.each(questions, function(i, question){
                addQuestion(question);
            });
        },
        error: function(){
            alert('Error loading questions')
        }
    });

    $('#add-question').on('click', function(){

        var question = {
            qid: $qid.val(),
            content: $content.val(),
        }

        $.ajax({
            method: 'POST',
            url: 'localhost:8080/questions/create' + '?access_token=' + getCookie('access_token'),
            contentType: "application/json; charset=utf-8",
            accepts: "application/json",
            dataType: "json",
            data: JSON.stringify(question),
            success: function(newQuestion) {
                console.log("Question added!", newQuestion); //debug
                addQuestion(newQuestion);
            },
            error: function(){
                alert('Error adding question')
            }
        });
    });

    $questions.delegate('.remove', 'click', function(){

        var $li = $(this).closest('li');

        $.ajax({
            method: 'DELETE',
            // url: 'localhost:8080/questions/deleteByqid' + $(this).attr('data-id'),
            // url: 'localhost:8080/questions/deleteByqid' + $(this).val(question.qid),
            // url: 'localhost:8080/questions/deleteByqid' + $(this).val('qid'),
            // url: 'localhost:8080/questions/deleteByqid' + $li.find('input.qid').val($li.find('span.qid').html()),
            // url: 'localhost:8080/questions/deleteByqid' + $(this).val($li.find('span.qid').html()),
            url: 'localhost:8080/questions/deleteByqid' + $li.attr('data-id') + '?access_token=' + getCookie('access_token'),
            success: function(){
                console.log('Question Deleted Successfully!');
                $li.fadeOut(300, function(){
                    $(this).remove();
                })
            }
        })
    })

    $questions.delegate('.editQuestion', 'click', function(){
         var $li = $(this).closest('li');
         $li.find('input.qid').val($li.find('span.qid').html());
         $li.find('input.content').val($li.find('span.content').html());
         $li.addClass('edit');

    });

    $questions.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit')

    });

    $questions.delegate('.saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var question = {
            qid: $li.find('input.qid').val(),
            age: $li.find('input.content').val(),
        }

        $.ajax({
            method: 'PUT',
            url: 'localhost:8080/questions/updateByqid' + $li.attr('data-id') + '?access_token=' + getCookie('access_token'),
            contentType: "application/json; charset=utf-8",
            accepts: "application/json",
            dataType: "json",
            data: JSON.stringify(question),
            success: function(newQuestion) {
                console.log("Question editted!", newQuestion); //debug
                $li.find('span.qid').html(question.qid);
                $li.find('span.content').html(question.content);
                $li.removeClass('edit')
            },
            error: function(){
                alert('Error updating question')
            }
        });
    });
})