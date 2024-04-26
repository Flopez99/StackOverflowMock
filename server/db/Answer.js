// Answer-related queries
exports.getAnswersOfQuestion = function (req, res, db, mysql) {
    let questionID = req.body.questionID

    let sql = "SELECT * FROM qa JOIN answer ON qa.ansId = answer.aid WHERE qstnId = " + mysql.escape(questionID) + " ORDER BY aid DESC ";
    let query = db.query(sql, (err, results) =>{
        if(err) throw  err;
        res.send(results)

    })
}
exports.getNumberAnswersOfQuestion = function (req, res, db, mysql) {
    let questionId = req.params.qid

    let sql = "SELECT * FROM qa JOIN answer ON qa.ansId = answer.aid WHERE qstnId = " + mysql.escape(questionId) ;
    let query = db.query(sql, (err, results) =>{
        if(err) throw  err;
        res.send(results)

    })
}


exports.addNewAnswer = function (req, res1, db) {
    let questionID = req.body.currentQuestion.qid;
    let answer = req.body.new_answer;
    let user = req.body.user

    let text = answer.text
    let ans_by = answer.ans_by
    let ans_date_time = answer.ans_date_time

    if(ans_by === '')
    ans_by = "Anonymous"

    let post = {text: text, ans_by: ans_by}
    let sql = "INSERT INTO answer SET ?";
    let query = db.query(sql,post, (err, res) =>{
        if(err) throw  err;

        let post1 = {userId: user.userId, answerId: res.insertId}
        let sql1 = "INSERT INTO ua SET ?";
        let query1 = db.query(sql1,post1, (err, res1) =>{
            if(err) throw  err;
        
            let insertPost = {qstnId: questionID, ansId: res.insertId}
            let insertSql = "INSERT INTO qa SET ?"
            let insertQuery = db.query(insertSql, insertPost, (err, resultoe) =>{
                 if(err) throw err
    
                })         
        })
    })
    res1.end()

}
exports.getAllAnswers = function (res, db) {
    let sql = 'SELECT * FROM answer';
    let query = db.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(results)

    })
}