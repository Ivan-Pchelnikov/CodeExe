var fs = require('fs');

function createPayslip(read, WritePayslips) {
var remaining = '';

    read.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    var last  = 0;
    while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        WritePayslips(line);
        index = remaining.indexOf('\n', last);
    }
    remaining = remaining.substring(last);
});

    read.on('end', function() {
    if (remaining.length > 0) {
        WritePayslips(remaining);
    }

        writeStream.end();
});
}

function fillPersonSalaryData(data) {
    console.log(++num +' '+ 'Line: ' + data);
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

    calculateResults(person);
}

function calculateResults(person) {

    var paysPeriod = getPaysperiod(person.paymentStartDate,person.paymentEndDate);
    var grossIncome = getGrossIncome(person.annualSalary);
    var incomeTax = getIncomeTax(person.annualSalary);
    var netIncome = grossIncome-incomeTax;
    var supper =  (grossIncome * parseInt(person.superRate)/100).toFixed();

    writeStream.write(person.firstName+ ' '+person.lastName+','+ person.paymentStartDate+'-' +person.paymentEndDate+','+grossIncome+ ',' + incomeTax+','+ netIncome+','+ supper+'\n');
}

function getIncomeTax(annualSalary){

    if (annualSalary <= 18200) return 0;
    if (annualSalary <= 37000) return ((annualSalary-18200)*0.19/12).toFixed();
    if (annualSalary <= 80000) return ((3572+(annualSalary-37000)*0.325)/12).toFixed();
    if (annualSalary <= 180000) return ((17547+(annualSalary-80000)*0.37)/12).toFixed();

    return ((54547+(annualSalary-180000)*0.45)/12).toFixed();
}

function getGrossIncome(annualSalary){

    var salary = annualSalary/12;

    return salary.toFixed();
}

function getPaysperiod(start,end ){

    var sMonth = new Date(start).getMonth()+1;
    var eMonth = new Date(end).getMonth()+1;
    if (sMonth==eMonth) return 1 ;
    if( sMonth > 6 ) sMonth = sMonth - 6;
    if( sMonth < 6 ) sMonth = sMonth + 6;
    if( eMonth > 6 ) eMonth = eMonth - 6;
    if( eMonth < 6 ) eMonth = eMonth + 6;

    return eMonth - sMonth+1;
}


console.log('Program Start');
var num = 0;
if(process.argv.length < 3)
{
    console.log('There is no input file.');
}
else {
    console.log('Proccessing file: ' + process.argv[2]);
    var readStream = fs.createReadStream(process.argv[2], {flags: 'r'});
    var writeStream = fs.createWriteStream('output.txt', {flags: 'w'});
    createPayslip(readStream, fillPersonSalaryData);
}
console.log('Program End');

