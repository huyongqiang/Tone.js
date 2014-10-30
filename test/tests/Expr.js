/* global it, describe, maxTimeout */

define(["tests/Core", "chai", "Tone/signal/Signal", "Tone/signal/Expr", "tests/Common"], 
function(core, chai, Signal, Expr, Test){

	var expect = chai.expect;

	describe("Tone.Expr - Basic", function(){
		this.timeout(maxTimeout);

		it("can be created and disposed", function(){
			var exp = new Expr("2");
			exp.dispose();
			// Test.wasDisposed(exp);
		});

		it("can create inputs", function(){
			var exp = new Expr("$0 + $1");
			Test.acceptsInput(exp, 0);
			Test.acceptsInput(exp, 1);
			exp.dispose();
		});

		it("has an output", function(){
			var exp = new Expr("0 + 0");
			Test.acceptsOutput(exp);
			exp.dispose();
		});

		it("has output", function(done){
			var exp;
			Test.outputsAudio(function(out){
				exp = new Expr("1.1");
				exp.connect(out);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("passes input", function(done){
			var exp;
			Test.passesAudio(function(input, output){
				exp = new Expr("$0");
				input.connect(exp);
				exp.connect(output);
			}, function(){
				exp.dispose();
				done();
			});
		});
	});

	describe("Tone.Expr - Signal Math", function(){
		this.timeout(maxTimeout);

		it("does signal addition", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1 + 3");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(4);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("does signal multiplication", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1.5 * 6");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(9);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("does signal subtraction", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("8 - 16");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(-8);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles precendence", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("8 + 16 * 4 - 1");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(71);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles parens", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("(8 + 16) * (4 - 1)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(72);
			}, function(){
				exp.dispose();
				done();
			});
		});
	});

	describe("Tone.Expr - Signal Logic", function(){
		this.timeout(maxTimeout);

		it("correctly outputs 1 for 1 && 1", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1 && 1");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 0 for 0 && 1", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("0 && 1");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(0);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 0 for 0 || 0", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("0||0");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(0);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 1 for 0 || 1", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("0 || 1");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 1 for 1 || 0", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1 || 0");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 1 for 1 > 0", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1 > 0");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 1 for 100 > 99", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1 > 0");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 0 for -10 > -9", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("-10 > -9");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(0);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 1 for 1.001 < 1.002", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("1.001 < 1.002");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 0 for 11 < 1.002", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("11 < 1.002");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(0);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 1 for 11.001 == 11.001", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("11.001 == 11.001");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("correctly outputs 0 for 11.002 == 11.001", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("11.002 == 11.001");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(0);
			}, function(){
				exp.dispose();
				done();
			});
		});
	});

	describe("Tone.Expr - Unary Operators", function(){
		this.timeout(maxTimeout);

		it("correctly outputs negative", function(done){
			var exp, sig;
			Test.offlineTest(0.1, function(dest){
				sig = new Signal(1);
				exp = new Expr("-$0");
				sig.connect(exp);
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(-1);
			}, function(){
				exp.dispose();
				sig.dispose();
				done();
			});
		});

		it("correctly handles NOT (!)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("!0");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(1);
			}, function(){
				exp.dispose();
				done();
			});
		});
	});

	describe("Tone.Expr - Functions", function(){
		this.timeout(maxTimeout);

		it("handles if(false)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("if(0, 2, 11)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(11);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles if(true)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("if(1, 2, 11)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(2);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles abs(-10)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("abs(-10)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(10);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles abs(11)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("abs(11)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(11);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles min(10, 11)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("min(10, 11)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(10);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles min(7, -100)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("min(7, -100)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(-100);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles max(10, 11)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("max(10, 11)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(11);
			}, function(){
				exp.dispose();
				done();
			});
		});

		it("handles max(7, -100)", function(done){
			var exp;
			Test.offlineTest(0.1, function(dest){
				exp = new Expr("max(7, -100)");
				exp.connect(dest);
			}, function(sample){
				expect(sample).to.equal(7);
			}, function(){
				exp.dispose();
				done();
			});
		});
	});

});