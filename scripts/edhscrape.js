/**
 * Created by Russell Fillmore on 10/5/2016.
 */
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var promise = require('selenium-webdriver').promise;
var driver;

var exports = module.exports = {
    EDHSearch: function (card_name, promise_func) {
        this.finished = false;
        var self = this;
        var card = card_name;
        var prom = promise_func;
        var url = 'https://edhrec.com/cards/'+card;
        console.log("EDH Search: "+url);
        var results = {
            'card': card,
            'synergies': {}
        };
        this.getResults = function(){
          return results;
        };
        this.getName = function () {
            return card;
        };
        this.run = function(){
            driver = new webdriver.Builder()
                .forBrowser('phantomjs')
                .build();
            driver.get(url);
            driver.wait(until .titleContains('EDHREC'), 1000);
            var divs = driver.findElements(By.css(".nw"));
            divs.then(function (elements) {
                var pendingHtml = elements.map(function (elem) {
                    return elem.getAttribute("innerHTML");
                });
                promise.all(pendingHtml).then(function (allHtml) {
                    for(index in allHtml){
                       var card_string = allHtml[index];
                        if(card_string.indexOf("synergy")>=0){
                            var name = card_string.substr(card_string.indexOf("href=\"/cards/")+13,card_string.indexOf("\">")-card_string.indexOf("href=\"/cards/")-13);
                            var syn = parseInt(card_string.substr(card_string.indexOf("\<br>+")+5,2));
                           // console.log(name+" : "+syn);
                            results.synergies[name] = syn;
                        }
                    }
                    self.finished = true;
                    prom.resolve("Search Complete");
                });
            });
            driver.quit();
        }

    }

}



