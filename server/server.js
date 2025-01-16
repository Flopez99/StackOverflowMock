const Question = require('./db/Question.js')
const Answer = require('./db/Answer.js')
const Tag = require('./db/Tag.js')

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const MySQLStore = require('express-mysql-session')(session);

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"], 
    credentials: true
}))

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


let userArgs = process.argv.slice(2);

user = userArgs[1];
pass = userArgs[3];

const db = mysql.createConnection({
    host    : 'localhost',
    user    : user,
    password: pass,
    database: 'fake_so'
});

   
sessionStore = new MySQLStore({},db)
 
app.use(session({
    key: "userId",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     expires: 60 * 60 * 24,
    // },
    store: sessionStore
}))
db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("Database connected.");
  });
   
app.get('/loggedIn', (req, res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    }else{
        res.send({loggedIn: false})
    }
})

app.get('/getUserTags/:userId', (req, res) => {
    
    let userId = req.params.userId;
    //+ " ORDER BY qid DESC LIMIT 5 OFFSET " + mysql.escape(offset)

    let sql = "SELECT tag.* FROM ut JOIN tag ON ut.tagId = tag.tid WHERE userId = " + mysql.escape(userId) 
    let query = db.query(sql, (err, results) => {
        if(err) throw err
 
        res.send(results)
    })


})
app.get('/getUserAnswers/:userId', (req, res) => {
    
    let userId = req.params.userId;

    let sql = "SELECT answer.* FROM ua JOIN answer ON ua.answerId = answer.aid WHERE userId = " + mysql.escape(userId) + " ORDER BY aid DESC"
    let query = db.query(sql, (err, results) => {
        if(err) throw err
 
        res.send(results)
    })


})

app.post('/logOut', (req, res) =>{
    req.session.destroy();

    res.send("logged out")
}) 

app.post('/questions/getUserQuestions/', (req, res) => {
    const userId = req.body.user.userId;

    let sql = "SELECT question.* FROM uq JOIN question ON uq.qstnId = question.qid WHERE userId = " + mysql.escape(userId) + " ORDER BY qid DESC"
    let query = db.query(sql, (err, results) => {
        if(err) throw err
 
        res.send(results)
    })
})

app.post('/comment/getQuestionComments', (req, res) =>{
    let id = req.body.id;
    let isQuestion = req.body.isQuestion;


    let sql = ""
    if(isQuestion){
        sql = "SELECT comment.* FROM qc JOIN comment ON qc.commentId = comment.cId WHERE qstnId = " + mysql.escape(id) + " ORDER BY commentId DESC "
    }else{
        sql = "SELECT comment.* FROM ac JOIN comment ON ac.commentId = comment.cId WHERE answerId = " + mysql.escape(id) + " ORDER BY commentId DESC "
    }

    let query = db.query(sql, (err, results) => {
        if(err) throw err

        res.send(results)
 

    })
    }
    )

app.post('/questions/deleteQuestion', (req, res) =>{
    let id = req.body.id

    let sql = "DELETE FROM question WHERE qid = " + mysql.escape(id)
    let query = db.query(sql, (err, results) =>{
        if(err) throw err

        let sql1 = 'DELETE FROM answer WHERE aid IN (SELECT ansId FROM qa WHERE qstnId = '+ mysql.escape(id) + ')'
        let query1 = db.query(sql1, (err1, results1) =>{
            if(err1) throw err1

            let sql2 = 'DELETE FROM comment WHERE cId IN (SELECT commentId FROM ac WHERE answerId = (SELECT ansId FROM qa WHERE qstnId = '+ mysql.escape(id) + ')'+ ')'
            let query2 = db.query(sql2, (err2, results2) =>{
                if(err2) throw err2
            
                let sql7 = 'DELETE FROM ac WHERE answerId IN (SELECT ansId FROM qa WHERE qstnId = '+ mysql.escape(id) + ')'
                let query7 = db.query(sql7, (err7, results7) =>{
                    if(err7) throw err7

                    let sql3 = 'DELETE FROM comment WHERE cId IN (SELECT commentId FROM qc WHERE qstnId = ' + mysql.escape(id) + ')'
                    let query3 = db.query(sql3, (err3, results3) =>{
                        if(err3) throw err3
                        
                        let sql4 = 'DELETE FROM qc WHERE qstnId = ' + mysql.escape(id)
                        let query4 = db.query(sql4, (err4, results4) =>{
                            if(err4) throw err4
            
                            let sql5 = 'DELETE FROM qt WHERE qstnId = ' + mysql.escape(id)
                            let query5 = db.query(sql5, (err5, results5) =>{
                                if(err5) throw err5
                                
                                let sql6 = 'DELETE FROM qa WHERE qstnId = ' + mysql.escape(id)
                                let query6 = db.query(sql6, (err6, results6) =>{
                                    if(err6) throw err6
                    
                                    res.send("Deletion Successful")
            
                                    
                                })
                            })

                        })
                    })
            })
            })
        })
    })

})


app.post('/tags/deleteTag', (req, res) => {
    let id = req.body.id

    let sql = "DELETE FROM tag WHERE tid = " + mysql.escape(id)
    let query = db.query(sql, (err, results) =>{
        if(err) throw err

        let sql1 = "DELETE FROM qt WHERE tagId = " + mysql.escape(id)
        let query1 = db.query(sql1, (err1, results1) =>{
            if(err1) throw err1

            let sql2 = "DELETE FROM ut WHERE tagId = " + mysql.escape(id)
            let query2 = db.query(sql2, (err2, results2) =>{
                if(err2) throw err2

                res.send("Delete Successful")


            })


        })
    })
})


app.post('/answers/deleteAnswer', (req, res) => {
    let id = req.body.id
 
    let sql0 = 'DELETE FROM answer WHERE aid = ' + mysql.escape(id)
    let query0 = db.query(sql0, (err0, results0) => {
        if(err0) throw err0

        let sql = 'DELETE FROM ua WHERE answerId = '+ mysql.escape(id)
        let query = db.query(sql, (err, results) =>{
            if(err) throw err

            let sql1 = 'DELETE FROM comment WHERE cId IN (SELECT commentId FROM ac WHERE answerId = '+ mysql.escape(id) + ')'
            let query1 = db.query(sql1, (err1, results1) =>{
                if(err1) throw err1

                let sql2 = 'DELETE FROM ac WHERE answerId = '+ mysql.escape(id)
                let query2 = db.query(sql2, (err2, results2) =>{
                    if(err2) throw err2

                    let sql3 = 'DELETE FROM qa WHERE ansId = '+ mysql.escape(id)
                    let query3 = db.query(sql3, (err3, results3) =>{
                        if(err3) throw err3

                        res.send("Delete Successful")
        
                })
    
            })
    
            })

        })

    })

})


app.post('/tags/getEveryTag', (req, res) => {
    let user = req.body.user
    let question = req.body.new_question

        let sql1 = "SELECT name FROM tag"
        let existQuery = db.query(sql1, (err, results) => {
            
                    res.send(results)

            
                })
            }
        
        
        )

app.post('/comment/makeComment', (req, res) => {
    let comment = req.body.comment;
    let username = req.body.username;
    let isQuestion = req.body.isQuestion;
    let id = req.body.id

    let post = [comment, username]
    let sql = "INSERT INTO comment (text, username) VALUES (?, ?)"

    let query = db.query(sql, post, (err, results) =>{
        if(err) throw err
            let sql1 = ''
            if(isQuestion)
            sql1 = "INSERT INTO qc (qstnId, commentId) VALUES (?, ?)"
            else
            sql1 = "INSERT INTO ac (answerId, commentId) VALUES (?, ?)"

            let post1 = [req.body.id, results.insertId]

            let query1 = db.query(sql1, post1, (err, results1) =>{

                res.send("Success")

            })
        })
    })


app.post('/updateQuestion', (req, res) => {

    let question = req.body.new_question
    let user =  req.body.user
    let questionId = req.body.questionId

    let post = {title: question.title, text: question.text, summary: question.summary}

    let sql = "UPDATE question SET ? WHERE qid = " + mysql.escape(questionId)
    let query = db.query(sql, post, (err, results) => {
        if(err) throw err


        for (let tag of question.tags){
            let tagPost = {name: tag}
     
            let sql5 = 'DELETE FROM qt WHERE qstnId = ' + mysql.escape(questionId)
            let query5 = db.query(sql5, (err5, results5) => {


            let sql1 = "SELECT * FROM tag WHERE name = " + mysql.escape(tag)
            let existQuery = db.query(sql1, (err, results) => {
                if (err)throw err
                if(results.length != 0){

                    let insertPost = {qstnId: questionId, tagId: results[0].tid}
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

                            let insertPost = {qstnId: questionId, tagId: results5.insertId}
                            let insertSql = "INSERT INTO qt SET ?"
                            let insertQuery = db.query(insertSql, insertPost, (err, resultoe) =>{
                                 if(err) throw err
                                    })
                               })

                        })

                  
                }
             })
            })

            }

        res.send("Update Successful")


    })
})

app.post('/updateTag', (req, res) => {
    let tag = req.body.tag
    let new_tag = req.body.new_tag

    let post = {name: new_tag.text}

    let sql = "UPDATE tag SET ? WHERE tid = " + mysql.escape(tag.tid)
    let query = db.query(sql, post, (err, results) => {
        if(err) throw err
        
        res.send("Update Successful")


    })
}) 

app.post('/updateAnswer', (req, res) => {
    let answer = req.body.answer
    let new_answer = req.body.new_answer

    let post = {text: new_answer.text}

    let sql = "UPDATE answer SET ? WHERE aid = " + mysql.escape(answer.aid)
    let query = db.query(sql, post, (err, results) => {
        if(err) throw err
        
        res.send("Update Successful")


    })
})
app.post('/changeVote', (req, res) => {
    const questionID = req.body.questionID;
    const isUpvote = req.body.isUpvote;
    const isAns = req.body.isAns;

    if(isUpvote){
        let sql = ""
        if(isAns)
        sql = "UPDATE answer SET votes = votes + 1 WHERE aid = " + questionID;
        else
        sql = "UPDATE question SET votes = votes + 1 WHERE qid = " + questionID;

        let query = db.query(sql, (err, results) =>{
            if(err) throw  err;

            let sql2 = ""
            if(isAns)
            sql2 = "UPDATE users SET users.reputation = reputation + 5 where userId = (SELECT userId FROM ua JOIN answer ON answer.aid= ua.answerId WHERE answer.aId = " + questionID + ")"
            else
            sql2 = "UPDATE users SET users.reputation = reputation + 5 where userId = (SELECT userId FROM uq JOIN question ON question.qid= uq.qstnId WHERE question.qId = " + questionID + ")"

            let query2 = db.query(sql2, (err, results2) => {
                if(err) throw err;
                res.send({upvoted: true})
                
            })
        })  


    }else{
        
        let sql = ""
        if(isAns)
        sql = "UPDATE answer SET votes = votes - 1 WHERE aid = " + questionID;
        else
        sql = "UPDATE question SET votes = votes - 1 WHERE qid = " + questionID;

        let query = db.query(sql, (err, results) =>{
            if(err) throw  err;
        
            let sql2 = ""
            if(isAns)
            sql2 = "UPDATE users SET users.reputation = reputation - 5 where userId = (SELECT userId FROM ua JOIN answer ON answer.aid= ua.answerId WHERE answer.aId = " + questionID + ")"
            else
            sql2 = "UPDATE users SET users.reputation = reputation - 5 where userId = (SELECT userId FROM uq JOIN question ON question.qid= uq.qstnId WHERE question.qId = " + questionID + ")"
           
            let query2 = db.query(sql2, (err, results2) => {
                if(err) throw err;

                res.send({upvoted: false})

            })        
        }) 
    }
})

app.post('/register', async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;

    console.log(req.body)

    const errors = [];

   function validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    let uniqueEmail = true
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) throw err
  
        if(result.length != 0){
            errors.push("Email is already in use")
            uniqueEmail = false        
        }

        if(username === ''){
            errors.push("Username field is empty")
        }

        if(validateEmail(email) === false){
            errors.push("Invalid Email Address")
        }
        if(password === ''){
            errors.push("Password field is empty")
        }
        if(verifyPassword != password){
            errors.push("Passwords do not match")
        }
        if(password.toLowerCase().includes(email.substring(0, email.indexOf('@'))) && email !=''){
            errors.push("Cannot contain email ID in password!")
        }

        if(password.toLowerCase().includes(username.toLowerCase()) && username != ''){
            errors.push("Cannot contain username in password")
        }

    
        if(errors.length > 0){
            res.send({passedValidation: false, errors: errors})
        }else{

            bcrypt.hash(password,saltRounds, (err, hash) =>{

                if(err)throw err
        
                if(uniqueEmail)
                db.query("INSERT INTO users (username, email, password) VALUES (?,?,?)", [username, email, hash], (err, result) => {
                    if (err) throw err
                    res.send({passedValidation: true})
                })
                else
                res.send({passedValidation: false, errors: errors})
            })
        }

    })
 
})
  
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
     
    db.query("SELECT * FROM users WHERE email = ?;", [email], (err, result) => {
        if (err){
            res.send({err: err})
        }

        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (error, response) => {
                if(response){
                    req.session.user = result;
                    console.log(req.session.user)
                    res.send(result)
                }else{
                    res.send({message: "Wrong username/password combination"})
                }
            })
        } else {
            res.send({message: "Wrong username/password combination"})
        }
    }) 
})

app.get('/getTags', (req, res) => {
    Tag.getAllTags(res, db)
}) 
 
app.get('/tags/questionsOfTag/:tid', (req, res) => {
    Tag.getQuestionsOfTag(req, res, db, mysql)
})

app.get('/tagsOfQuestion/:qid', (req, res) => {
   Tag.getTagsOfQuestion(req,res,db,mysql)
})
 
app.post('/answersOfQuestion/', (req, res) => { 
   Answer.getAnswersOfQuestion(req,res,db, mysql)
})
app.get('/numberAnswersOfQuestion/:qid', (req, res) => { 
    Answer.getNumberAnswersOfQuestion(req,res,db, mysql)
 })
 
app.post('/questions/addNewQuestion/', (req, res) => {
    Question.addNewQuestion(req, res, db, mysql)    
}) 

app.post('/questions/addNewAnswer/', (req, res1) =>{
    Answer.addNewAnswer(req,res1, db)
})

app.get('/searching/:word', (req, res) => {
    Question.searchQuestions(req, res, db, mysql)
})

app.post('/questions/updateViews', (req, res) => {
    Question.updateViews(req, res, db)
}) 

app.get('/getQuestions/:qid', (req, res) => {

    Question.getQuestionById(req,res, db)
})

app.get('/getAllQuestions/:offset', (req, res) => {
    Question.getAllQuestions(req, res, db, mysql)
})


app.get('/getAnswers', (req, res) => {
    Answer.getAllAnswers(res, db)
})


app.listen('8000', () => {
    console.log("FakeSO listening on port 8000")
})

process.on('SIGINT', () => {
    if(db){
        console.log("Server closed. Database instance disconnected") 
        db.close();
        server.close();
    }
});