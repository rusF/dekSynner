/**
 * Created by Russell Fillmore on 9/6/2016.
 */

var TemplateController = function(){
    var templates = {};
    this.loadTemplate = function(name){
        $.ajax({
            url: '/templates/'+name+'.hbs',
            cache: true,
            success: function(data) {
                templates[name] = data;
            }
        });
    }
    this.generateHtml = function(name, data){
        var template = Handlebars.compile(templates[name]);
         return template(data);
    }
}