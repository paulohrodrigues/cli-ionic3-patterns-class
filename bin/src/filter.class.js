'use strict';
module.exports = class FilterClass {
    constructor(code,argumentsArray){
    
        this.caracterValid = {
            "extends":false,
            "interfaces":false
        };

        this.translate = {
            "extends":"{{nameextends}}",
            "interfaces":"{{nameinterface}}"
        };

        this.code           = code;
        this.argumentsArray = argumentsArray; 

        this.patters = [
            "pattern1"
        ];

        this.initValidate(argumentsArray);
    }

    initValidate(argumentsArray){
        if(argumentsArray.length<3 || argumentsArray[2].split("=")[0]!=="model") throw "Algum(s) dos 3 primeiros parametros é/são inválido(s)";
        if(this.patters.indexOf(argumentsArray[2].split("=")[1]) ==-1 ) throw "Padrão "+argumentsArray[2].split("=")[1]+" não encontrado";
    }


    isPattern(value){
        let array = value.split("=");
        return array.length==2 && ( this.caracterValid[array[0]]===false || this.caracterValid[array[0]]===true );
    }

    stringType(argument){
        let type = argument.split("=")[0];
        if(type == "extends"){
            return "extends "+argument.split("=")[1];
        }
        
        if(type == "interfaces"){
            return "implements "+argument.split("=")[1];
        }
        
        return "";
    }

    process(codeFilter){
        for(let i=2;i<this.argumentsArray.length;i++){
            if(this.isPattern(this.argumentsArray[i]) && this.caracterValid[this.argumentsArray[i].split("=")[0]]==false){
                codeFilter = codeFilter.replace(this.translate[this.argumentsArray[i].split("=")[0]],this.stringType(this.argumentsArray[i]));
                this.caracterValid[this.argumentsArray[i].split("=")[0]]=true;
            }
        }
        return codeFilter;
    }

    processAuto(codeFilter){
        for(let index in this.caracterValid ){
            if(this.caracterValid[index] ==false){
                codeFilter = codeFilter.replace(this.translate[index],"");
            }
        }
        return codeFilter;
    }



    filter(){
        var codeFilter=this.code;
        codeFilter = codeFilter.replace("{{nameclass}}",this.argumentsArray[1]);
        codeFilter = this.process(codeFilter);
        codeFilter = this.processAuto(codeFilter);

        return codeFilter;
    }
}