var fs = require('fs')
var path = require('path')
var readlineSync = require('readline-sync');
var File = require('./lib_files.js')
var filename = "init.json"
var template = "template.json"

var Init = class extends File{
    constructor(filename){
        super(filename);
        this.json = null
    }
    async getJSON(){
        if (!await this.isFile()){
            return null
        }
        let s = await this.readString()
        try{
            this.json = JSON.parse(s)
            return(this.json)
        }catch(e){
            throw new Error("JSON PARSING ERROR FOR:"+this.fpath+e.toString())
        }
    }
    async setJSON(json){
        try{
            let s = JSON.stringify(json)
            this.json = JSON.parse(s)
            return this.writeString(s)
        }catch(e){
            throw new Error("JSON PARSING ERROR BEFORE WRITE")
        }
    }
    async fillJSON(){
        await this.getJSON()
        for(var j in this.json){
            console.log("Current value for "+j+":",this.json[j])
             let input = readlineSync.question('Enter value for '+j+': ') 
             this.json[j] = input == "" ? this.json[j] : input
        }
        for(var j in this.json){
            console.log("New value for"+j+":",this.json[j])
        }
        await this.setJSON(this.json)
    }
    
    async setup(){
        if ( await this.isFile()){
            await this.fillJSON()
        }else if(await init.isFile(template)){
            console.log("Using template file",template)
            var temp = new File(template)
            await temp.read()
            await temp.write(filename)
            await this.fillJSON()
        }else{
            console.log("No Init or Template File!")
        }
    }
}

module.exports = Init
if (require.main === module) {
    console.log("Init Called Directly")
    var init = new Init(filename)
    init.setup()
}