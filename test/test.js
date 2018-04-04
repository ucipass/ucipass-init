
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var should = require('chai').should();
var Init = require('../init.js')
var FILE = require('../lib_files.js')

init_file = "./test/test_init.json"

describe('Unit Tests', function(){
    before("Before", async function(){
        var f = new FILE(init_file)
    await f.unlink(init_file).catch((e)=>{/*(console.log("No init.json deleted!",e))*/})
    })

    it('Create Init File', async function(){try{
        
        let i = new Init(init_file)
        return i.writeString('{"comment":"Test Comment"}')
 
    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

    it('Check if Init File Exits', async function(){try{
        
        let i = new Init(init_file)
        r = await i.isFile()
        assert(r)
 
    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

    it('Read JSON from Init File ', async function(){try{
        
        let i = new Init(init_file)
        json = await i.getJSON()
        assert(json)
 
    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

    it('Create Bad Init File', async function(){try{
        
        let i = new Init(init_file)
        return i.writeString('comment":"Test Comment"}')

    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

    it('Read JSON from BAD Init File ', async function(){try{
        
        let i = new Init(init_file)
        json = await i.getJSON().catch((e)=> null)
        assert(!json)
 
    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

    it('Write file from JSON', async function(){try{
        
        let i = new Init(init_file)
        return i.setJSON(JSON.parse('{"1":"2"}'))
 
    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

    it('Write from bad variable', async function(){try{
        
        let i = new Init(init_file)
        //let u = JSON.parse("111}}")
        return i.setJSON("111}}")
 
    }catch(e){ console.log("TEST EXCEPTION" , e ); assert(false)}})

})
