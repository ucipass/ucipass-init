var fs = require("fs")
var path = require("path")
var logger = require('winston');
logger.emitErrs = true;
logger.loggers.add('FILE', { console: { level: 'debug', label: "FILE", handleExceptions: true, json: false, colorize: true}});
var log = logger.loggers.get('FILE');

module.exports = class{
    constructor(fpath){
        this.fpath = path.resolve(fpath)
        this.size = null
        this.mtime = null
        this.ctime = null
        this.buffer = null
    }
    name(){
        return path.basename(this.fpath)
    }
    path(){
        return path.dirname(this.fpath)
    }
    type(){
        return path.extname(this.fpath)
    }
    clearBuffer(){
        this.buffer = null ; 
        return(this)
    }
    isFile(filename){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
	var filename = filename ? filename : this.fpath
        fs.stat(filename,(err,stat)=>{
            if(err) {
                resolve(false)
            }
            else if (stat.isFile()){
                resolve(true)
            }else{
                resolve(false)
            }
        })
        return final;
    }
    stat(){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
        fs.stat(this.fpath,(err,stat)=>{
            if(err) {
                log.error(err)
                reject(err)
            }
            else{
                this.size = stat.size
                this.mtime = stat.mtime
                this.ctime = stat.ctime
                resolve(this)
            }
        })
        return final;
    }
    read(){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
        fs.readFile(this.fpath,(err,buffer)=>{
            if(err) {
                log.error(err)
                reject(err)
            }
            else{
                this.buffer = buffer
                resolve(this)
            }
        })
        return final;
    }
    readString(){
        return this.read()
        .then(()=> this.buffer.toString('utf8'))
    }
    write(newFilename){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
        var file = newFilename ? newFilename : this.fpath
        var data = this.buffer ? this.buffer : this.fpath
        if (file == data ) {
            log.info("Nothing to write. Date and File content are the same!")
            resolve(this)
        }
        else{
            fs.writeFile(file,data,(err)=>{
                if(err) {
                    log.error(err)
                    reject(err)
                }
                else{
                    resolve(this)
                }
            })
        }
        return final;
    }
    writeString(text){
        this.buffer = Buffer.from(text, 'utf8');
        return this.write()
    }
    unlink(newFilename){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
        var file = newFilename ? newFilename : this.fpath

        fs.unlink(file,(err)=>{
            if(err) {
                log.error(err)
                reject(err)
            }
            else{
                resolve(this)
            }
        })

        return final;
    }
    rename(newFilename){
        var resolve,reject
        var oldfilename = this.fpath;
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})

        fs.rename(oldfilename,newFilename,(err)=>{
            if(err) {
                log.error(err)
                reject(err)
            }
            else{
                resolve(this)
            }
        })

        return final;
    }
    time(mtime,atime){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
        fs.utimes(this.fpath, atime ? atime: mtime,mtime,(err)=>{
            if(err) {
                log.error(err)
                reject(err)
            }
            else{
                resolve(this)
            }
        })

        return final;
    }
    hashfn(keepBuffer){
        var resolve,reject
        var final = new Promise((res,rej)=>{resolve=res;reject=rej})
        var crypto = require("crypto")
        var readline = require("readline")
        var process = require("process")
        var file = this
        function hash(file){
                var md5 = crypto.createHash('md5')
                md5.update(file.buffer, 'utf8');
                file.hash = md5.digest('hex');
                if (!keepBuffer) { file.buffer = null}
                return file
        }
        if (!file.buffer ){
            return file.read().then(file => hash(file))
        }
        else{
            return hash(file)
        }
    }
}