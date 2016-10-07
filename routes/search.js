/**
 * Created by Russell Fillmore on 9/1/2016.
 */
var express = require('express');
var http = require('http');
var edh = require('../scripts/edhscrape');
var Promise = require("node-promise").Promise;
var router = express.Router();
var mtg = require('mtgsdk');
var uuid = require('uuid');
var jsonfile = require("jsonfile");


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('search', {});
});

router.post('/mtgio', function(req,res) {
    var term = req.body.q;

    var returnData = [];
    mtg.card.where({'text':term}).then(function(result){

        for(index in result){
            returnData.push(result[index]);
        }

        res.send(returnData);
    });
});

router.post('/edhrec', function(req,res){
    var search_id = uuid.v1();
    var cardNames = req.body.selectedCard;
    for(var i in cardNames){
        cardNames[i] = cardNames[i].replace(/ /g,"-").toLowerCase();
    }
    console.log(cardNames);
    var resultSet = {};
    var extra_search = 1;
    var index = 0;


    var mainSearch = function() {
        console.log("Main Search ...");
        if(!resultSet.hasOwnProperty(cardNames[index])) {
            console.log("Searching: "+cardNames[index]);
            var promise = new Promise();
            var search = new edh.EDHSearch(cardNames[index], promise);
            index = index + 1;
            if (index < cardNames.length) {
                promise.then(function () {
                    resultSet[search.getName()] = search.getResults();
                    mainSearch()
                });
            } else {
                promise.then(function () {
                    resultSet[search.getName()] = search.getResults();
                    secondarySearch();
                });
            }
            search.run();
        }else if(index >= cardNames.length){
            secondarySearch();
        }else{
            index = index+1;
            mainSearch();
        }
        console.log(index);
    };


    var secondarySearch= function(){
        if(extra_search > 0){
            console.log("New Search Round");
            extra_search-=1;
            cardNames = [];
            index = 0;
            for(var resKey in resultSet){
                for(var resCard in resultSet[resKey].synergies){
                    cardNames.push(resCard);
                }
            }
            mainSearch();
        }else{
            console.log("Writing File");
            writeFile();
        }
    };



    mainSearch();
    console.log(resultSet);


    var sendAcceptedResp = function(){
        res.location("/results/"+search_id);
        res.sendStatus(202);
    };

    var writeFile = function(){
        var file = './jsonResults/'+search_id+'.json';
        jsonfile.writeFile(file, resultSet, function (err) {
            console.error(err)
        });
    };
    sendAcceptedResp();


});

module.exports = router;
