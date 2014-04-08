describe('localStorage', function() {
	var ls;
	before(function() {
		ls = S.localStorage;
	});
	it('#set()', function() {
		ls.set('a', 'data_A');
		var a = ls.get('a');
		a.should.equal('data_A');
	});
});