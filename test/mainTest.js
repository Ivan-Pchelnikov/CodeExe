/**
 * Created by IvanP on 3/18/2016.
 */
var main=require('../main.js');
var fs = require('fs');
var expect = require('chai').expect;

describe("Test main function", function() {
    describe("Load from local input file and calculate the reuslt.", function() {
        it("File input.txt exist.",function() {
            fs.stat('../input.txt', function(err, stat) {
                expect(err).to.equal(null);
            });
        });
        it("File output.txt exist.",function() {

            main.mainfunc('../input.txt', main.createPayslip);

            fs.stat('../output.txt', function(err, stat) {
                expect(err).to.equal(null);
            });
        });
    });
});

describe("getPaysperiod converts date and returns difference", function() {
    describe("For 2015/11/01 - 2016/02/31", function() {
        it("Returns 4 month period.",function() {
            var start = new Date(2015, 11, 01);
            var end = new Date(2016, 02, 31);
            var diff = main.getPaysperiod(start,end);
            expect(diff).to.equal(4);
        });
    });

    describe("For 2015/07/01 - 2016/04/31", function() {
        it("Returns 10 month period.",function() {
            var start = new Date(2015, 07, 01);
            var end = new Date(2016, 04, 31);
            var diff = main.getPaysperiod(start,end);
            expect(diff).to.equal(10);
        });
    });
});

describe("getIncomeTax returns income tax depend on annual salary.", function() {
    it("Annual salary  20 000.",function() {
        var annualSalary = 20000;
        var incomTax= main.getIncomeTax(annualSalary);
        expect(incomTax).to.equal(((annualSalary-18200)*0.19/12).toFixed());
    });
    it("Annual salary  120 000.",function() {
        var annualSalary = 120000;
        var incomTax= main.getIncomeTax(annualSalary);
        expect(incomTax).to.equal(((17547+(annualSalary-80000)*0.37)/12).toFixed());
    });
});

describe("getGrossIncome  returns gross income depend on annual salary..", function() {
    it("Annual salary  100 000.",function() {
        var annualSalary = 100000;
        var grossIncome= main.getGrossIncome(annualSalary);
        expect(grossIncome).to.equal((annualSalary/12).toFixed());
    });
});
