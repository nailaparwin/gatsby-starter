import React from "react"

export default function Home() {

  //var dotenv = require('dotenv').config();
  const sendReqOnGithub = () => {
    var githubApi = {};
		githubApi.header = {};
		githubApi.header.Accept = "application/vnd.github.v3+json"; //make sure we use v3		
		githubApi.baseUrl = "https://api.github.com";		
		githubApi.sha = "";
		githubApi.path = "";
		githubApi.newFile = false;
    

    githubApi.username = process.env.GATSBY_USERNAME;       
    githubApi.nameRepo = process.env.GATSBY_NAMEREPO  
    githubApi.header.Authorization = "token "+ process.env.GATSBY_TOKEN;
    var obj={}
            
		function apiRequest(method, url, jsonData, callback) {

			//load the json file
			var xhr = new XMLHttpRequest();
			
			xhr.onreadystatechange = function() {
			    if (xhr.readyState == 4 ){
			    	if(xhr.status == 200 || xhr.status == 201) {
                console.log("success")
			        	callback(xhr.responseText);
			        }
			        else {
			        	console.log(xhr.status);
			        	console.log(xhr.responseText);
			        }
			    }
			}
			xhr.open(method, url, true);
			for(var key in githubApi.header) {
				xhr.setRequestHeader(key, githubApi.header[key]);
			}
			xhr.send(jsonData);
		}

		const getfile = async (url, path) => {
			await apiRequest("GET", url, null, function(r) {
				var jsonRsp = JSON.parse(r);				
				githubApi.sha = jsonRsp.sha;
				githubApi.path = path;
        //githubApi.newFile = false;                			
        commitAndPush()
			});
		}

		
		const list = async () => {			
			//get tree url from master branch's last commit
        var url = githubApi.baseUrl+"/repos/"+githubApi.username+"/"+githubApi.nameRepo+"/branches/master";
        //console.log(url)
			  await apiRequest("GET", url, null, async function(r) {
				var jsonRsp = JSON.parse(r);
				var treeUrl = jsonRsp.commit.commit.tree.url+"?recursive=1";
				//get tree
				  await apiRequest("GET", treeUrl, null, async function(r){
					var jsonRsp = JSON.parse(r);
					                    
					 for(var i in jsonRsp.tree) {                                           
                        if (jsonRsp.tree[i].path == "dummy.txt"){
					              obj.url = jsonRsp.tree[i].url;
                        obj.path = "dummy.txt";
                        console.log("file found")                        
                        await getfile(obj.url, obj.path)
                        
                    }					
					}
				});
      });            
		}

		function commitAndPush() {		            
			var jsonData = new Object();
			jsonData.message = "new commit";
			jsonData.content = btoa("add new data by gatsby app"); //encode64
			jsonData.path = githubApi.path;
			jsonData.branch = "master";
			jsonData.sha = githubApi.sha;			
			var url = githubApi.baseUrl+"/repos/"+githubApi.username+"/"+githubApi.nameRepo+"/contents/"+githubApi.path;
			jsonData = JSON.stringify(jsonData); //api expects json as string
			console.log("invoke commit ", url)
			apiRequest("PUT", url, jsonData, function(r) {
                console.log(r);
                console.log("commit done")
			});
        }
        list();       
  }
  return (
    <>
    <div>Hello world! </div>
    <button onClick={sendReqOnGithub}> Send Request </button>
    </>
  )

}
