// Those tests require IDOL API key to run with.
// Try to load it from .env file...

// Create a client instance to use.
var request=require('request');
var https=require('https');
var MyClient = require('../lib/idol-client.js')('f3129194-4f03-4419-80c2-f3aa041baf9a');
var ips=['0','23.13.169.35','23.196.118.201','23.195.87.224','64.233.183.105',
'31.13.71.1','23.195.91.218','208.54.70.10','209.99.98.33','23.195.80.170','208.54.70.10','159.153.103.209',
'72.172.89.185','23.13.163.95','208.54.70.8'];

var cid=['0','1864','162479','1066','1441','10667','1497','2018','5617','1063','1481','162717','5329','164215','1053'];


var ipname=['','3M','Apple Inc','Motorola Mobility','Google Inc','Facebook','AMD','Applied Materials',
'Cirrus Logic','Cisco Systems','eBay/PayPal','Bioware','Blizzard Entertainment','Hoovers','Intel Corporation']
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
  consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
  access_token_key: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
  access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
});

MyClient.Q.longStackSupport = true;
var cors = require('cors')
var express=require('express');
var app = express();
app.use(cors());
var https=require('https');
//var url="http://www.signalogic.com/melp/EngSamples/Orig/male.wav";

app.get('/getScore',function(reqst,rspns){
 var pos_score=0,neg_score=0;


var url="http://www.talkenglish.com/AudioTE/L21/sentence/L21S5.mp3";
url = url.replace(/\//g, '%2F');
url=url.replace(":","%3A");
//console.log(url);
//https.get('https://api.idolondemand.com/1/api/async/recognizespeech/v1?url=http%3A%2F%2Fwww.talkenglish.com%2FAudioTE%2FL21%2Fsentence%2FL21S5.mp3&interval=0&apikey=f3129194-4f03-4419-80c2-f3aa041baf9a',function(res){
https.get('https://api.idolondemand.com/1/api/async/recognizespeech/v1?url='+url+'&apikey=f3129194-4f03-4419-80c2-f3aa041baf9a',function(res){

var data='';
res.on('data', function(d) {
    data+=d;
});
res.on('end',function(data1){
    //console.log(data);
    data=JSON.parse(data);
    //console.log(data);
    jobID=data.jobID;
     https.get('https://api.idolondemand.com/1/job/result/'+jobID+'?apikey=f3129194-4f03-4419-80c2-f3aa041baf9a',function(res){
        
        var dt1='';
        res.on('data', function(dt) {
            dt1+=dt;
        });
        res.on('end',function(dtt){
            var x=(JSON.parse(dt1));
            var textval=(x.actions[0].result.document[0].content);
            MyClient.analyzeSentiment({
            type: 'sync',
            parameters: {
                text: textval
            }
        }).then(
     function(res){
        var pos=res.data.positive;
        var neg=res.data.negative;
       

        for (i in pos)
        {
        pos_score+=pos[i].score;
        }
        for (i in neg)
        {
        neg_score+=neg[i].score;
        }
        console.log(pos);
        console.log(pos_score)
       console.log(neg);
       console.log("neg_score is"+neg_score);
       var overall_Score=pos_score+neg_score;
       var x={"overall_Score":overall_Score};
      // rspns.writeHead({'Content-type':'application/json'});
       rspns.send(x);
     });
        });
    });
});

    
});

});

app.get('/parseResume',function(reqst,respns){

var url="http://www.snee.com/xml/xslt/sample.doc";
url = url.replace(/\//g, '%2F');
url=url.replace(":","%3A");
console.log(url);

https.get('https://api.idolondemand.com/1/api/sync/extracttext/v1?url='+url+'&additional_metadata=&reference_prefix=&password=&apikey=f3129194-4f03-4419-80c2-f3aa041baf9a',function(res){

var data='';
res.on('data', function(d) {
    data+=d;
});
res.on('end',function(data1){
    console.log(data);
    data=JSON.parse(data);
    //console.log(data);
    jobID=data.jobID;
  var textContent = data.document[0].content;
  var n = textContent.search("Excel");
  var x=0,y=0,z=0;
  if(n>0)
  {
    x=1;
  }
   var n = textContent.search("Spreadsheet");
  if(n>0)
  {
    y=1;
  }
  var n = textContent.search("Football");
  if(n>0)
  {
   z=1;
  }
  respns.send(x+''+y+''+z);
});

   
    
});
})

app.use('/dnb',function(reqst,respns){
var num=(reqst.url.substring(9));
var ip='';
  ip=ips[num];
request({
    method: 'POST',
    url: 'https://plus.dnb.com/v1/token',
    headers: 
      {
        'Content-Type': 'application/json',
        'Authorization':'Basic OXM2d2c5QnluaVY2bGtDQzZRaUdrN1lZUzJMcDJQYTQ6TElBSkRpZHJRNVY4SjMzUw==',
        'Origin':'www.dnb.com',
    },
     body: '{"grant_type" : "client_credentials"}'
},
    function (error, response, body) {
    console.log(body);
    var token=(JSON.parse(response.body)["access_token"]);
    var brr="Bearer "+token;
    request({
    method: 'GET',
    url: 'https://plus.dnb.com/v1/duns-search/ip/'+ip,
    headers: 
      {
        'Content-Type': 'application/json',
        'Authorization':brr,
        'Origin':'www.dnb.com',
        }
    }, function (error, response, body) {
        respns.send(JSON.parse(body));
    });
  });


})


app.use('/twitterSentiment',function(reqst,respns){
var num=(reqst.url.substring(9));
var ip=ipname[num];
client.get('search/tweets', {q: ip}, function(error, tweets, response){
   
  var length=(tweets.statuses.length);
  console.log(length);
  var total;
  var count=0;
   (tweets.statuses).forEach(function(e){
    var text=e.text;
    console.log(text);
      MyClient.analyzeSentiment({
            type: 'sync',
            parameters: {
                text: text
            }
        }).then(
     function(res){
      count=count+1;
      console.log(res.data.aggregate.score);
        if(res.data.aggregate.score!=0)
          respns.send({'total':res.data.aggregate.score});
     });
   });
   }
);
});
app.use('/linkedinFeed',function(req,res){
  var num=(req.url.substring(9));
  var ip=cid[num];
  https.get('https://api.linkedin.com/v1/companies/'+ip+'/updates?oauth2_access_token=AQUxHxrW_VKxyQoipBT3-37W7cj3NJhF0LLmGARZvGX2hziIY9gdy8HEdaZHTGLPuo8T8mHdD0X64HEZIQeSL-6mj8hMLAGPH2IuZAwi8HF_6sFe7sM79r0q1wxyxZpCXcT_M8gicNIieekmGegFpHp8H-UqjPnTLwWNKUd1HI4taXVbbdg&format=json',
  function(response){
   var body = '';
        response.on('data', function(d) {
            body += d;
        });
    response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            console.log('linkedin');
            res.send(parsed);
        });

});
})

app.listen(1337,'127.0.0.1');
       