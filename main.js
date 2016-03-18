var fs = require('fs');

exports.createPayslip = function (read, fillPersonSalaryData) {
    var remaining = '';
    var writeStream = fs.createWriteStream('output.txt', {flags: 'w'});
    read.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        fillPersonSalaryData(line,writeStream);
        index = remaining.indexOf('\n', last);
    }
    remaining = remaining.substring(last);
});
    read.on('end', function() {
        if (remaining.length > 0) {
            fillPersonSalaryData(remaining,writeStream);
        }
        writeStream.end();
    });
}

exports.fillPersonSalaryData = function (data, writeStream) {
    console.log('Line: ' + data);
    var personFields = data.replace(/\r?\n|\r/g, " ").split(',');
    var date = personFields[4].split('-');
    var person = {
        firstName           :  personFields[0],
        lastName            :  personFields[1],
        annualSalary        :  personFields[2],
        superRate           :  personFields[3],
        paymentStartDate    :  date[0],
        paymentEndDate      :  date[1]
    };
    var paysPeriod = exports.getPaysperiod(person.paymentStartDate,person.paymentEndDate);
    var grossIncome = exports.getGrossIncome(person.annualSalary);
    var incomeTax = exports.getIncomeTax(person.annualSalary);
    var netIncome = grossIncome-incomeTax;
    var supper =  (grossIncome * parseInt(person.superRate)/100).toFixed();

    writeStream.write(person.firstName+ ' '+person.lastName+','+ person.paymentStartDate+'-' +person.paymentEndDate+','+grossIncome*paysPeriod+ ',' + incomeTax*paysPeriod+','+ netIncome*paysPeriod+','+ supper*paysPeriod+'\n');
}

exports.getIncomeTax = function (annualSalary){

    if (annualSalary <= 18200) return 0;
    if (annualSalary <= 37000) return ((annualSalary-18200)*0.19/12).toFixed();
    if (annualSalary <= 80000) return ((3572+(annualSalary-37000)*0.325)/12).toFixed();
    if (annualSalary <= 180000) return ((17547+(annualSalary-80000)*0.37)/12).toFixed();

    return ((54547+(annualSalary-180000)*0.45)/12).toFixed();
}

exports.getGrossIncome = function (annualSalary){

    var salary = annualSalary/12;

    return salary.toFixed();
}

exports.getPaysperiod = function (start,end ){

    var sMonth = new Date(start).getMonth()+1;
    var eMonth = new Date(end).getMonth()+1;
    if (sMonth==eMonth) return 1 ;

    if( sMonth > 6 ) sMonth = sMonth - 6;
    else if( sMonth < 6 ) sMonth = sMonth + 6;

    if( eMonth > 6 ) eMonth = eMonth - 6;
    else if( eMonth < 6 ) eMonth = eMonth + 6;
    return eMonth - sMonth+1;
}

exports.mainfunc = function (inputFile, createPayslip){
    var readStream = fs.createReadStream(inputFile, {flags: 'r'});

    createPayslip(readStream, exports.fillPersonSalaryData);
}

console.log('Program Start');
if(process.argv.length < 3)
{
    console.log('There is no input file.');
}
else {
    console.log('Proccessing file: ' + process.argv[2]);
    fs.stat(process.argv[2], function(err, stat) {
        if(err == null) {
            console.log('File exists');
            exports.mainfunc(process.argv[2], exports.createPayslip);
        }
        else if (process.argv[2]=='--reporter')
        {
            console.log('Testing...');
        }
        else {
            console.log('File does not exist error: ', err.code);
        }
    });
}
console.log('Program End');

