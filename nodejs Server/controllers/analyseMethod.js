var exec = require('child-process-promise').exec;


module.exports = {
    analyseMethod: async (req, res, next) => {
        const {
            channelName,
            maxDepth,
            flow,
        } = req.body;
        
        const command1 = 'chmod +x controllers/runAnalyseMethod.sh'
        const command2 = './controllers/runAnalyseMethod.sh '+reverseCommand+' '+className+' '+methodName+' '+methodParameter+' '+maxDepth;
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
