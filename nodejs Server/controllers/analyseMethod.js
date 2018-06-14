var exec = require('child-process-promise').exec;


module.exports = {
    analyseMethod: async (req, res, next) => {
        const {className,methodName,methodParameter,maxDepth} = req.body;
        if (className==null || methodName ==null || methodParameter==null){
            res.status(400).json({error:"className methodName methodParameter required"});
            return;
        }
        console.log({className,methodName,methodParameter,maxDepth});
        const command1 = 'chmod +x controllers/runAnalyseMethod.sh'
        const command2 = './controllers/runAnalyseMethod.sh '+className+' '+methodName+' '+methodParameter+' '+maxDepth;
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
                            res.status(200).json({success:true});
                        })
                        .catch(function (err) {
                            console.error('ERROR: ', err);
                            res.status(400).json({success:false})
                            return;
                        });
            })
            .catch(function (err) {
                    console.error('ERROR: ', err);
                    res.status(400).json({success:false})
                    return;
            });
    },
};
