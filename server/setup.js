const mysql = require('mysql2')


let userArgs = process.argv.slice(2);

user = userArgs[1];
pass = userArgs[3]; 


const connection = mysql.createConnection({
    host: "localhost",
    user: user,
    password: pass,
    database: "fake_so"
})

//ASSUMING DATABASE EXISTSSSSSSSSSSSSSSSSSSSSSSSSSSS

connection.connect((err) =>{
   if(err) throw err

   connection.query("CREATE TABLE `fake_so`.`ac` (`answerId` INT NOT NULL,`commentId` INT NOT NULL);", (err, result) => {
       if(err) throw err
       
       connection.query("CREATE TABLE `fake_so`.`answer` (`aid` INT NOT NULL AUTO_INCREMENT,`text` MEDIUMTEXT NOT NULL,`ans_by` VARCHAR(15) NULL DEFAULT NULL,`ans_date_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,`votes` INT NOT NULL DEFAULT '0',PRIMARY KEY (`aid`));", (err, result) => {
        if(err) throw err
        
        connection.query("CREATE TABLE `fake_so`.`comment` (`cId` INT NOT NULL AUTO_INCREMENT,`text` MEDIUMTEXT NOT NULL,`username` VARCHAR(45) NOT NULL,PRIMARY KEY (`cId`));", (err, result) => {
            if(err) throw err
        
            connection.query("CREATE TABLE `fake_so`.`qa` (`qstnId` INT NOT NULL,`ansId` INT NOT NULL);", (err, result) => {
                if(err) throw err
               
                connection.query("CREATE TABLE `fake_so`.`qc` (`qstnId` INT NOT NULL,`commentId` INT NOT NULL);", (err, result) => {
                    if(err) throw err
                
                    connection.query("CREATE TABLE `fake_so`.`qt` (`qstnId` INT NOT NULL,`tagId` INT NOT NULL);", (err, result) => {
                        if(err) throw err
                        
                        connection.query("CREATE TABLE `fake_so`.`question` (`qid` INT NOT NULL AUTO_INCREMENT,`title` VARCHAR(100) NOT NULL,`text` MEDIUMTEXT NOT NULL,`asked_by` VARCHAR(15) NULL DEFAULT 'Anonymous',`ask_date_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,`views` INT NOT NULL DEFAULT '0',`votes` INT NULL DEFAULT '0',`summary` VARCHAR(300) NULL DEFAULT '\"\"' ,PRIMARY KEY (`qid`),UNIQUE INDEX `qid_UNIQUE` (`qid` ASC) VISIBLE);", (err, result) => {
                            if(err) throw err
                            
                            connection.query("CREATE TABLE `fake_so`.`tag` (`tid` INT NOT NULL AUTO_INCREMENT,`name` TINYTEXT NOT NULL,PRIMARY KEY (`tid`));", (err, result) => {
                                if(err) throw err
                                
                                connection.query("CREATE TABLE `fake_so`.`ua` (`userId` INT NOT NULL,`answerId` INT NOT NULL);", (err, result) => {
                                    if(err) throw err
                                
                                    connection.query("CREATE TABLE `fake_so`.`uq` (`userId` INT NOT NULL,`qstnId` INT NOT NULL);", (err, result) => {
                                        if(err) throw err
                                    
                                        connection.query("CREATE TABLE `fake_so`.`users` (`userId` INT NOT NULL AUTO_INCREMENT,`username` VARCHAR(45) NULL DEFAULT 'Username',`email` VARCHAR(45) NOT NULL,`password` VARCHAR(2000) NOT NULL,`reputation` INT NOT NULL DEFAULT '120',`signup_date_time` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`userId`));", (err, result) => {
                                            if(err) throw err
                                        
                                            connection.query("CREATE TABLE `fake_so`.`ut` (`userId` INT NOT NULL,`tagId` INT NOT NULL);", (err, result) => {
                                                if(err) throw err
                                            
                                                console.log("Created all Tables. Ending Connection to DB")
                                                connection.end()
                                            })
                                        })
                                    })
                                })     
                            })
                        })       
                    })
                })
            })
        })
    })
   })
})

