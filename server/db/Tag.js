// Tag related queries
exports.getAllTags = function (res, db) {
    let sql = 'SELECT * FROM tag';
    let query = db.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(results)

    })
}

exports.getQuestionsOfTag = function (req, res, db, mysql) {
    let tagID = req.params.tid  

    let sql = "SELECT * FROM qt JOIN question ON qt.qstnId = question.qid WHERE tagId = " + mysql.escape(tagID);
    let query = db.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(results)

    })
}

exports.getTagsOfQuestion = function (req, res, db, mysql) {
    let questionID = req.params.qid

    let sql = "SELECT name FROM qt JOIN tag ON qt.tagId = tag.tid WHERE qstnId = " + mysql.escape(questionID);
    let query = db.query(sql, (err, results) =>{
        if(err) throw  err;
        res.send(results)

    })
}