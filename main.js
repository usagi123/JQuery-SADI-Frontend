var access_token = ''

//This is an ajax request. The purpsose is to get an access_token
$.ajax({
    url: 'http://localhost:8080/oauth/token?grant_type=password&username=admin&password=admin',
    method: 'post',
    beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization','Basic Y2xpZW50LWlkOnNlY3JldA==')
},
    success: function(data){
        setCookie("access_token", data.access_token, 1)
        console.log(getCookie("access_token"))
        $('body').append("<div>Login successfully. <a href='index.html'>Go to main page</a></div>")
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

//Question CRUD
function QuestionService(){
    var $questions = $('#questions');
    var $qid = $('#qid');
    var $question = $('#question');

    var questionTemplate = $('question-template').html();

    function addNewQuestion(question){
        $questions.append(Mustache.render(questionTemplate), question);            
    }

    //Read
    $.ajax({
        type: 'GET',
        url: 'localhost:8080/questions/getAll?access_token='+getCookie('access_token'),
        success: function(question){
            console.log('success', question)
            $.each(question, function(qid, question){
                addNewQuestion(question);
            });
        },
        error: function(){
            alert('Error loading questions');
        }
    });

    //Create
    $('add_question').on('click', function(){
        var addQuestion = {
            qid: $qid.val(),
            question: $question.val(),
        };
        $.ajax({
            type: 'POST',
            url: 'localhost:8080/questions/create?access_token='+getCookie('access_token'),
            data: addQuestion,
            success: function(newQuestion){
                addNewQuestion(newQuestion);
            },
            error: function(){
                alert('Error saving question');
            }
        })
    });

    //Delete
    $questions.delegate('.remove','click', function(){

        var $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: 'localhost:8080/questions/deleteByqid' + $(this).attr('data-id') + '?access_token='+getCookie('access_token'),
            success: function(){
                $li.fadeOut(300, function(){
                    $(this).remove();
                });
            }
        });
    });

    //Update
    $questions.delegate('.editQuestion', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.qid').val($li.find('span.qid').html());
        $li.find('input.question').val($li.find('span.question').html());
        $li.addClass('edit');
    });

    $questions.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    })

    $questions.delegate('saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var question = {
            qid: $li.find('input.qid').val(),
            question: $li.find('input.question').val()
        };

        var updateQuestion = {
            qid: $qid.val(),
            question: $question.val(),
        };
        $.ajax({
            type: 'PUT',
            url: 'localhost:8080/questions/updateByqid?access_token='+getCookie('access_token'),
            data: updateQuestion,
            success: function(newQuestion){
                $li.find('span.qid').html(question.qid);
                $li.find('span.question').html(question.question);
                $li.removeClass('edit');
            },
            error: function(){
                alert('Error updating question');
            }
        })
    })
};

//Answer CRUD
function AnswerService(){
    var $answers = $('#answers');
    var $aid = $('#aid');
    var $answer = $('#answer');
    var $correctcheck = $('#correctcheck');
    var $qid = $('qid');

    var answerTemplate = $('answer-template').html();

    function addNewAnswer(answer){
        $answers.append(Mustache.render(answerTemplate), answer);            
    }

    //Read
    $.ajax({
        type: 'GET',
        url: 'localhost:8080/answers/getAll?access_token='+getCookie('access_token'),
        success: function(answer){
            console.log('success', answer)
            $.each(answer, function(aid, answer){
                addNewAnswer(answer);
            });
        },
        error: function(){
            alert('Error loading answers');
        }
    });

    //Create
    $('add_answer').on('click', function(){
        var addAnswer = {
            aid: $answer.val(),
            answer: $answer.val(),
            correctcheck: $answer.val(),
            qid: $qid.val(),
        };
        $.ajax({
            type: 'POST',
            url: 'localhost:8080/answers/create?access_token='+getCookie('access_token'),
            data: addAnswer,
            success: function(newAnswer){
                addNewQuestion(newAnswer);
            },
            error: function(){
                alert('Error saving answer');
            }
        })
    });

    //Delete
    $answers.delegate('.remove','click', function(){

        var $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: 'localhost:8080/answers/deleteByaid' + $(this).attr('data-id') + '?access_token='+getCookie('access_token'),
            success: function(){
                $li.fadeOut(300, function(){
                    $(this).remove();
                });
            }
        });
    });

    //Update
    $answers.delegate('.editAnswer', 'click', function(){
        var $li = $(this).closest('li');
        $li.find('input.aid').val($li.find('span.aid').html());
        $li.find('input.answer').val($li.find('span.answer').html());
        $li.find('input.correctcheck').val($li.find('span.correctcheck').html());
        $li.find('input.qid').val($li.find('span.qid').html());
        $li.addClass('edit');
    });

    $answers.delegate('.cancelEdit', 'click', function(){
        $(this).closest('li').removeClass('edit');
    })

    $answers.delegate('saveEdit', 'click', function(){
        var $li = $(this).closest('li');
        var answer = {
            aid: $li.find('input.aid').val(),
            question: $li.find('input.question').val(),
            correctcheck: $li.find('input.correctcheck').val(),
            qid: $li.find('input.qid').val(),
        };

        var updateAnswer = {
            aid: $aid.val(),
            answer: $answer.val(),
            correctcheck: $answer.val(),
            qid: $qid.val(),
        };
        $.ajax({
            type: 'PUT',
            url: 'localhost:8080/questions/updateByaid?access_token='+getCookie('access_token'),
            data: updateAnswer,
            success: function(newAnswer){
                $li.find('span.aid').html(answer.aid);
                $li.find('span.answer').html(answer.answer);
                $li.find('span.correctcheck').html(answer.correctcheck);
                $li.find('span.qid').html(question.qid);
                $li.removeClass('edit');
            },
            error: function(){
                alert('Error updating answer');
            }
        })
    })
};