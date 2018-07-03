var exec = require('child-process-promise').exec;


module.exports = {
    analyseMethod: async (req, res, next) => {
        const {
            className,
            methodName,
            methodParameter,
            channelName,
            maxDepth,
            flow,
            allowedChunkScore
        } = req.body;
        let rootChangeRequest=false
        if (className!=null&&(className.length>0 || methodName.length>0 || methodParameter.length>0 )){
            rootChangeRequest=true
        }
    
        if (channelName.length==0){
            res.status(400).json({error:"channelName required"})
            return
        }

        let makeGraphCommand
        let command1
        let command2

        if (rootChangeRequest){
            changeRootCommand='changeRoot'
            command1 = 'chmod +x controllers/runAnalyseMethod.sh'
            command2 = './controllers/runAnalyseMethod.sh'+' '+changeRootCommand+' '+channelName+' '+flow+' '+maxDepth+' '+className+' '+methodName+' '+methodParameter + ' ' + allowedChunkScore 
        } else {
            makeGraphCommand='makeGraph'
            command1 = 'chmod +x controllers/runAnalyseMethod.sh'
            command2 = './controllers/runAnalyseMethod.sh'+' '+makeGraphCommand+' '+channelName+' '+flow+' '+maxDepth+ ' ' + allowedChunkScore 
        }
        console.log(command2)
        exec(command1)
            .then(function (result) {
                    var stdout = result.stdout;
                    var stderr = result.stderr;
                    console.log('stdout: ', stdout);
                    console.log('stderr: ', stderr);
                    exec(command2)
                        .then(function (result) {
                            var stdout = result.stdout;
                            var stderr = result.stderr;
                            console.log('stdout: ', stdout);
                            console.log('stderr: ', stderr);
                        })
                        .catch(function (err) {
                            console.error('ERROR: ', err);
                        });
            })
            .catch(function (err) {
                    console.error('ERROR: ', err);
            });
        res.status(200).json({success:true})
    },
};