var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/public'));

//크로스도메인 이슈 대응(CORS)
var cors = require('cors')();
app.use(cors);

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  //password : 'test1234',
  database : 'restful'
}); 
connection.connect();
///////////////////////////////////
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/restful';
var dbObj = null;
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  dbObj = db;
});

//////////////////////////////////////////////
/* 
 API명세서(2017.10.13)에 따른 API리스트  (1 ~ 22)
*/

app.get('/users/', function(req,res){ 
	connection.query('select * from users', 
		function(err,results,fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(results));
			}
		});
});

/*	1	로그인	GET	/users/	userid	SELECT	user	회원정보	*/
app.get('/users/:userid', function(req,res){ 
	connection.query('select * from users where userid=?',
		[req.params.userid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results[0]));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});

});

/*	2	회원가입	POST	/users	name, password, hpno, snsid	INSERT	user	회원정보	*/
app.post('/users', function(req,res){
	connection.query(
		'insert into users(userid,name,password,hpno,snsid) values(?,?,?,?,?)',
		[ req.body.userid, req.body.name, req.body.password, req.body.hpno, req.body.snsid ], 
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});

/*	3	회원정보변경	PUT	/user	rowid, password, hpno, snsid	UPDATE	user	회원정보	*/
app.put('/users/:id', function(req,res){
	connection.query(
		'update users set name=?,password=?,hpno=?,snsid=? where id=?',
		[ req.body.name, req.body.password, req.body.hpno, req.body.snsid, req.params.id ],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});

/*	4	회원정보삭제	DELETE	/user	rowid	DELETE	user	회원정보	*/
app.delete('/users/:id', function(req,res){
	connection.query('delete from users where id=?',
		[ req.params.id ], function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});

/*	5	영업장게시판조회	GET	/board/list	business_id	SELECT	user	게시판정보	*/
app.get('/board/list/', function(req,res){
	connection.query('select * from board',
		[req.params.businessid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	5-1	영업장게시판조회	GET	/board/list	business_id	SELECT	user	게시판정보	*/
app.get('/board/list/:businessid', function(req,res){
	connection.query('select * from board where businessid=? order by id desc',
		[req.params.businessid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	5-2	게시판상세조회	GET	/board/list	business_id	SELECT	user	게시판정보	*/
app.get('/board/:id', function(req,res){
	connection.query('select * from board where id=?',
		[req.params.id], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results[0]));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});


/*	6	게시판댓글달기	POST	/board	business_number, customer_number, writetime, content	INSERT	user	게시판정보	*/
app.post('/board', function(req,res){
	connection.query(
		'insert into board(businessid,userid,writetime,title,content) values(?,?,?,?,?)',
		[ req.body.businessid, req.body.userid, Date.now(), req.body.title, req.body.content ], 
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});

/*	7	게시판댓글수정	PUT	/board	rowid, writetime, content	UPDATE	user	게시판정보	*/
app.put('/board/:id', function(req,res){
	connection.query(
		'update board set businessid=?,userid=?,writetime=?,title=?,content=? where id=?',
		[ req.body.businessid, req.body.userid, Date.now(), req.body.title, req.body.content,
		  req.params.id ],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});


/*	8	게시판댓글삭제	DELETE	/board	rowid	DELETE	user	게시판정보	*/
app.delete('/board/:id', function(req,res){
	connection.query('delete from board where id=?',
		[ req.params.id ], function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});

/*	9	메뉴조회	GET	/menu/list	businessid	SELECT	BIZ	메뉴정보	*/
app.get('/menu/', function(req,res){
	connection.query('select * from menu',
		[req.params.businessid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	9	메뉴조회	GET	/menu/list	businessid	SELECT	BIZ	메뉴정보	*/
app.get('/menu/list/:businessid', function(req,res){
	connection.query('select * from menu where businessid=?',
		[req.params.businessid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	9	메뉴상세조회	GET	/menu/list	business_id	SELECT	BIZ	메뉴정보	*/
app.get('/menu/:id', function(req,res){
	connection.query('select * from menu where id=?',
		[req.params.id], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	10	메뉴등록	POST	/menu	businessid, imgurl, name, price	INSERT	BIZ	메뉴정보	*/
app.post('/menu', function(req,res){
	connection.query(
		'insert into menu(businessid,name,price,imgurl) values(?,?,?,?)',
		[ req.body.businessid, req.body.name, req.body.price, req.body.imgurl], 
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});


/*	11	메뉴변경	PUT	/menu	rowid, imgurl, name, price	UPDATE	BIZ	메뉴정보	*/
app.put('/menu/:id', function(req,res){
	connection.query(
		'update menu set businessid=?,name=?,price=?,imgurl=? where id=?',
		[ req.body.businessid, req.body.name, req.body.price, req.body.imgurl,
		  req.params.id ],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});


/*	12	메뉴삭제	DELETE	/menu	rowid	DELETE	BIZ	메뉴정보	*/
app.delete('/menu/:id', function(req,res){
	connection.query('delete from menu where id=?',
		[ req.params.id ], function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});

/*	19	점포조회	GET	/user/biz	business_number	SELECT	CUS	영업장정보	*/
app.get('/user/biz', function(req,res){
	connection.query('select * from business_info', 
		function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	19	점포상세조회	GET	/user/biz	business_number	SELECT	CUS	영업장정보	*/
app.get('/user/biz/:id', function(req,res){
	connection.query('select * from business_info where id=?',
		[req.params.id], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results[0]));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}
		});
});

/*	13	점포등록	POST	/user/biz	business_number, name, context	INSERT	BIZ	영업장정보	*/
app.post('/users/biz', function(req,res){
	connection.query(
		'insert into business_info(businessid,name,context,gps,business_state) values(?,?,?,?,?)',
		[ req.body.businessid, req.body.name, req.body.context, req.body.gps, 2], 
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});

/*	14	점포삭제	DELETE	/user/biz	business_number	DELETE	BIZ	영업장정보	*/
app.delete('/user/biz', function(req,res){
	connection.query('delete from business_info where id=?',
		[ req.params.id ], function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});

/*	15	점포정보변경(영업시작종료 등)	PUT	/user/biz/	business_number, gps 	UPDATE	BIZ	영업장정보	*/
app.put('/user/biz/:id', function(req,res){
	connection.query(
		'update business_info set businessid=?,name=?,context=?,gps=?,business_state=? where id=?',
		[ req.body.businessid, req.body.name, req.body.context, req.body.gps, req.body.business_state,
		  req.params.id ],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});

/*	16	주문상세조회	GET	/order/biz/list	business_number, date	SELECT	BIZ	주문내역	*/
app.get('/order/:id', function(req,res){
	connection.query('select * from order_info where id=?',
		[req.params.id], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results[0]));
				} else {
					res.send(JSON.stringify({}));
				}
			}
		});
});

/*	17	점포주문확인	PUT	/order/biz	rowid	UPDATE	BIZ	주문내역	*/
app.put('/order/:id', function(req,res){
	connection.query(
		'update order_info set businessid=?,userid=?,order_text=?,total_price=?,order_time=?,order_state=? where id=?',
		[ req.body.businessid, req.body.userid, req.body.order_text, 
		  req.body.total_price, req.body.order_time, req.body.order_state,
		  req.params.id ],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});



/*	20	주문하기	POST	/order	business_number, customer_number, ordername, total_price	INSERT	CUS	주문내역	*/
app.post('/order', function(req,res){
	connection.query(
		'insert into order_info(businessid,userid,order_text,total_price,order_time,order_state) values(?,?,?,?,?,?)',
		[ req.body.businessid, req.body.userid, req.body.order_text, 
		  req.body.total_price, req.body.order_time, 2], 
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		})
});

/*	21	주문취소하기	DELETE	/order	rowid	DELETE	CUS	주문내역	*/
app.delete('/order/:id', function(req,res){
	connection.query('delete from order_info where id=?',
		[ req.params.id ], function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});

/*	22	고객주문내역조회	GET	/order/cus/list	customer_number, date	SELECT	CUS	주문내역	*/
app.get('/order/cus/list/:userid', function(req,res){
	connection.query('select * from order_info where userid=?',
		[req.params.userid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
			}
		});
});

/*	23	점포주문상세조회	GET	/order/biz/list	business_number, date	SELECT	BIZ	주문내역	*/
app.get('/order/biz/list/:businessid', function(req,res){
	connection.query('select * from order_info where businessid=?',
		[req.params.businessid], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					res.send(JSON.stringify(results));
				} else {
					res.send(JSON.stringify({}));
				}
			}
		});
});


app.listen(52273,function() {
	console.log('Server running');
});
