// Question-related Queries

exports.getAllQuestions = function (req, res, db, mysql) {

    let sql = 'SELECT * FROM question ORDER BY qid DESC';
    let query = db.query(sql, (err, results) =>{
        if(err) throw err;

        res.send(results)
    
    })
}


exports.addNewQuestion = function (req,response, db, mysql) {
    let user = req.body.user

    let question = req.body.new_question

    let title1 = question.title
    let text1 = question.text
    let asked_by1 = user.username
    let views1 = question.views
    let summary1 = question.summary

    let post = {title: title1, text: text1, asked_by: asked_by1, views: views1, votes: 0, summary: summary1}
     
    let sql = "INSERT INTO question SET ?";
    let query = db.query(sql,post, (err, res) =>{
        if(err) throw  err;

        let post1 = {userId: user.userId, qstnId: res.insertId}
        let sql1 = "INSERT INTO uq SET ?";
        let query1 = db.query(sql1,post1, (err, res1) =>{
            if(err) throw  err;
        

            for (let tag of question.tags){
                let tagPost = {name: tag}
         
                let sql1 = "SELECT * FROM tag WHERE name = " + mysql.escape(tag)
                let existQuery = db.query(sql1, (err, results) => {
                    if (err)throw err
                    if(results.length != 0){
                        let insertPost = {qstnId: res.insertId, tagId: results[0].tid}
                        let insertSql = "INSERT INTO qt SET ?"
                        let insertQuery = db.query(insertSql, insertPost, (err, results1) =>{
                            if(err) throw err 
                            
                             })
                    }else{

                            let sql = "INSERT INTO tag SET ?";
                            let query = db.query(sql,tagPost, (err, results5) =>{
                            if(err) throw err
   
                            let post1 = {userId: user.userId, tagId: results5.insertId}
                            let sql1 = "INSERT INTO ut SET ?";
                            
                            let query1 = db.query(sql1,post1, (err, res1) =>{
                                if(err) throw  err;
   
                                let insertPost = {qstnId: res.insertId, tagId: results5.insertId}
                                let insertSql = "INSERT INTO qt SET ?"
                                let insertQuery = db.query(insertSql, insertPost, (err, resultoe) =>{
                                     if(err) throw err
                                        })
                                   })
   
                            })

                      
                    }
                 })
                }

            }) 
            response.end()

        })            
}

exports.searchQuestions = function (req, res, db, mysql) {      //Will search questions based on the tags or the words contained within a string
    let searchString = req.params.word
    let tagWords = searchString.match(/\[.*?\]/g);

    let isTag = false

    if(tagWords){
         tagWords[0] = tagWords[0].substring(1, tagWords[0].length -1)
    }else{ 
        tagWords = []
    }

    if(tagWords.length != 0){
        searchString = tagWords[0]
        isTag = true
    }else{ 
        searchString = searchString
        isTag = false
    }   
    
    if(isTag){
        let sql = "SELECT question.* FROM qt JOIN question ON qt.qstnId = question.qid JOIN tag ON qt.tagId = tag.tid WHERE name = " + mysql.escape(searchString);
        db.query(sql, (err, results) =>{
            if(err) throw err;
            res.send(results)
            })

    }else{
        let wordFormat = "% " + searchString + " %"
        let wordFormat2 = "%" + searchString + " %"
        let wordFormat3 = "%" + searchString + "%"

        let sql = "SELECT * FROM question WHERE title LIKE " + mysql.escape(wordFormat) + 
        " OR title LIKE " + mysql.escape(wordFormat2) + " OR title LIKE " + mysql.escape(wordFormat3) + 
        " OR summary LIKE " + mysql.escape(wordFormat3) + 
        " OR summary LIKE " + mysql.escape(wordFormat2) + 
        " OR summary LIKE " + mysql.escape(wordFormat) + 
        " OR text LIKE " + mysql.escape(wordFormat3) + 
        " OR text LIKE " + mysql.escape(wordFormat2) + 
        " OR text LIKE " + mysql.escape(wordFormat) + 
        " ORDER BY qid DESC;";


        db.query(sql, (err, results) =>{
            if(err) throw err;
            res.send(results)
            })    
        }
}

exports.updateViews = function (req, res, db) {
    let question = req.body.question.qid

    let sql = "UPDATE question SET views = views + 1 WHERE qid = " + question;
    let query = db.query(sql, (err, results) =>{
        if(err) throw  err;
        res.end()
    }) 
}

exports.getQuestionById = function (req, res, db) {
    let questionId = req.params.qid

    let sql = 'SELECT * FROM question WHERE qid = ' + questionId;
    let query = db.query(sql, (err, results) =>{
        if(err) throw err;
        res.send(results)
    })
}