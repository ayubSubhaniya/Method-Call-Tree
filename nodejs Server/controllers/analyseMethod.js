var exec = require('child-process-promise').exec;


module.exports = {
    analyseMethod: async (req, res, next) => {
        const {className,methodName,methodParameter,maxDepth} = req.body;
        if (className==null || methodName ==null || methodParameter==null || className.length==0 || methodName.length==0 || methodParameter.length==0){
            res.status(400).json({error:"className methodName methodParameter required"});
            return;
        }
        
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
                        })
                        .catch(function (err) {
                            console.error('ERROR: ', err);
                        });
            })
            .catch(function (err) {
                    console.error('ERROR: ', err);
            });
        res.status(200)
    },
};
