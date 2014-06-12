var process=require("child_process");;
var execCmd=function(cmds,callback){
    var execNext=function(){
        process.exec(cmds.shift(),function(error){
            if(error){
                console.warn(error);
            }else{
                if(cmds.length){
                    execNext();
                }else{
                    if(callback)callback("command exec successfully ! published!");
                }
            }
        });
    }
    execNext();
}

var cmds=[
    "rm -rf ../publish_to_bower",
    "mkdir ../publish_to_bower",
    "cd ../publish_to_bower",
    "git init",
    "git remote add origin git@github.com:innobower/bricksui.git",
    "git fetch origin",
    "git reset --hard origin/master",
    "git checkout master"
].join("&&")
process.exec(cmds,function(err,out){
    process.exec("cd ../publish_to_bower && git ls-files",function(err,out){
        if(err){
            console.warn(err);
        }else{
            var repo_files=out.split("\n");
            var package_manager_files = ['bower.json', 'package.json'];
            var file_to_publish=[
                "bricks.js"
            ];
            var list="";
            file_to_publish.forEach(function(file){
                list+="dist/"+file+" ";
            });
            process.exec("cp "+list+" ../publish_to_bower",function(){
                process.exec("cd ../publish_to_bower",function(){
                    var pushCmds=[
                        "cd ../publish_to_bower",
                        "git config user.email '294358991@qq.com'",
                        "git config user.name 'enshjiang'",
                        "git add -A",
                        "git commit -m 'Update for bricks-ui SHA: https://github.com/innoarch/bricks-ui/'",
                        "GIT_SSH=./bin/git_wrapper",
                        "git push origin master"].join("&&");
                    process.exec(pushCmds),function(err,out){
                        console.log(out);
                    };
                });
            });

        }
    });

});