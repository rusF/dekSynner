/**
 * Created by Russell Fillmore on 9/1/2016.
 */

var SearchingTool = function(){
    var templates = new TemplateController();
    this.init = function(){
        templates.loadTemplate('cardSelection');
    }
    this.magicIOSearch= function(term){
       $.ajax({
           url:"/search/mtgio",
           method: 'POST',
           data:{'q':term},
           success: showIOCards
       });
    }
    var duplicateCardFilter = function(data){
        var uniqueNames = [];
        var nameFilter = function(o){
            console.log(uniqueNames);
            if(uniqueNames.indexOf(o.name) < 0){
                uniqueNames.push(o.name);
                return true;
            }else{
                return false;
            }
        }
        return data.filter(nameFilter);
    }
    var showIOCards = function(data){
        var html = '';
        var cards = duplicateCardFilter(data);
        console.log(cards);
        for(index in cards){
            html+= templates.generateHtml('cardSelection',cards[index]);
        }
        $("#cardSelect").prepend(html);
        $("#submitCards").show();
    }
}

searcher = new SearchingTool();
searcher.init();