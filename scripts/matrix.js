/**
 * Created by Russell Fillmore on 10/6/2016.
 */

var SynMatrix = function(n) {
    var size = n;
    this.matrix = new Array(n).fill(0);
    self = this;
    var sumList = new Array(n).fill(0);
    var total = 0;
    for(var i=0; i<n;i++){
        this.matrix[i] = new Array(n);
        for(var j=0; j<n;j++){
            if(i==j){
                this.matrix[i][j] = 0;
            }else{
                this.matrix[i][j] = Math.floor(Math.random()*150)-50;
            }
            sumList[i]+=this.matrix[i][j];
            sumList[j]+=this.matrix[i][j];
            total+=this.matrix[i][j];
        }
    }

    this.getScoresList = function(){
        var scores = new Array(size).fill(0);
        for(var i=0;i<size; i++){
            for(var j=0;j<size; j++){
                scores[i]+=(sumList[j]-self.matrix[i][j]-self.matrix[j][i])* sumList[j]/sumList[i];
            }
        }
        return scores;
    }
    this.recalcSums = function () {
        sumList = new Array(size).fill(0);
        total = 0;
        var scores = new Array(size);
        for(var i=0; i<size;i++){
            scores[i] = new Array(n);
            for(var j=0; j<size;j++){
                sumList[i]+=self.matrix[i][j];
                sumList[j]+=self.matrix[i][j];
                total+=self.matrix[i][j];
            }
        }
    }
    this.exaustive = function (m) {
        var resultsKeys = new Array();
        var results = {};
        for(var x=0; x<m; x++){
          resultsKeys = populateExtraArrayDegree(resultsKeys, x);
        }
        for(var index in resultsKeys){
            var key = resultsKeys[index];
            results[key] = getResult(key);
        }
        console.log(results);
    }

    var populateExtraArrayDegree= function(startArray, startVal){
        var newArray = new Array();
        if(startArray.length>0) {
            for (var index in startArray) {
                for (var i = 1+startVal; i <= size; i++) {
                    var canAdd = startArray[index][startArray[index].length-1] < i;
                        for(var index2 in startArray[index]) {
                            if (startArray[index][index2] == i) {
                                canAdd = false;
                            }
                        }
                        if(canAdd) {
                            newArray.push(startArray[index].slice(0));
                            newArray[newArray.length - 1].push(i);
                        }
                }
            }
        }else{
            newArray = new Array(size);
            for (var i = 0; i < size; i++) {
                newArray[i] = [i+1];
            }
        }
        return newArray;
    }

    var getResult = function(ignoreArray){
        var result = 0;
        for(var i=0; i<size;i++) {
            for (var j = 0; j < size; j++) {
                if(ignoreArray.indexOf(i+1)<0 && ignoreArray.indexOf(j+1)<0){
                    result+=self.matrix[i][j];
                }
            }
        }
        return result;
    }

};

var mar =new SynMatrix(5);
console.log(mar.matrix);
console.log(mar.getScoresList());
mar.exaustive(2);
